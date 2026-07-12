import { Resend } from "resend";

/** Where quote / membership notifications are delivered */
export function getContactEmail() {
  return (
    process.env.CONTACT_EMAIL ||
    process.env.QUOTE_TO_EMAIL ||
    "admin@spawncrest.com"
  );
}

/**
 * From address for Resend.
 * Until you verify spawncrest.com in Resend, use their onboarding address
 * (and CONTACT_EMAIL must be the email you signed up to Resend with).
 */
export function getResendFrom() {
  return (
    process.env.RESEND_FROM_EMAIL ||
    "Spawn Crest Website <onboarding@resend.dev>"
  );
}

export type OutboundEmail = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  /** Extra fields for FormSubmit fallback */
  fields?: Record<string, string>;
};

/**
 * Deliver email via Resend when configured, otherwise FormSubmit.
 * If Resend fails (unverified domain, wrong recipient, etc.), falls back to FormSubmit.
 */
export async function sendContactEmail(message: OutboundEmail): Promise<void> {
  const to = getContactEmail();
  const apiKey = process.env.RESEND_API_KEY;
  let resendError: string | null = null;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: getResendFrom(),
        to: [to],
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });

      if (error) {
        resendError = error.message;
        console.error("[Email] Resend rejected send:", error);
      } else {
        console.info("[Email] Sent via Resend:", data?.id, "→", to);
        return;
      }
    } catch (err) {
      resendError = err instanceof Error ? err.message : String(err);
      console.error("[Email] Resend threw:", err);
    }
  }

  // Fallback: FormSubmit (requires one-time activation email the first time)
  try {
    await sendViaFormSubmit(to, message);
    console.info("[Email] Sent via FormSubmit fallback →", to);
    return;
  } catch (fallbackErr) {
    console.error("[Email] FormSubmit fallback failed:", fallbackErr);
    const parts = [
      resendError
        ? `Resend: ${resendError}`
        : "Resend is not configured (RESEND_API_KEY missing).",
      fallbackErr instanceof Error
        ? `FormSubmit: ${fallbackErr.message}`
        : "FormSubmit failed.",
      `Destination was: ${to}`,
    ];
    throw new Error(parts.join(" "));
  }
}

async function sendViaFormSubmit(to: string, message: OutboundEmail) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...(message.fields || {}),
      _subject: message.subject,
      _template: "table",
      _replyto: message.replyTo || "",
      _captcha: "false",
      message: message.text,
    }),
  });

  const bodyText = await response.text();
  let body: { success?: string | boolean; message?: string } = {};
  try {
    body = JSON.parse(bodyText) as typeof body;
  } catch {
    // non-JSON body
  }

  if (!response.ok) {
    throw new Error(body.message || bodyText || `HTTP ${response.status}`);
  }

  if (body.success === false || body.success === "false") {
    throw new Error(body.message || "FormSubmit rejected the message.");
  }
}
