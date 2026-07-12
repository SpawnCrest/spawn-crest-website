"use server";

import { z } from "zod";
import { Resend } from "resend";

const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format"),
  email: z.string().email("Please enter a valid email address"),
  service: z.string().min(1, "Please select a service"),
  location: z.string().optional(),
  message: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;

const QUOTE_TO_EMAIL = "admin@spawncrest.com";

function buildQuoteEmail(data: QuoteFormData) {
  const subject = `New Quote Request: ${data.service} — ${data.name}`;
  const text = [
    "New quote request from the Spawn Crest website",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Service: ${data.service}`,
    `Location: ${data.location || "Not provided"}`,
    `Message: ${data.message || "No message"}`,
    "",
    `Received: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT`,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; color: #0f172a;">
      <h2 style="margin: 0 0 8px; color: #0c4a5e;">New Quote Request</h2>
      <p style="margin: 0 0 20px; color: #64748b;">Submitted via the Spawn Crest website</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; width: 120px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Service</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.service)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Location</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.location || "Not provided")}</td></tr>
        <tr><td style="padding: 10px 0; font-weight: 600; vertical-align: top;">Message</td><td style="padding: 10px 0; white-space: pre-wrap;">${escapeHtml(data.message || "No message")}</td></tr>
      </table>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendQuoteEmail(data: QuoteFormData) {
  const { subject, text, html } = buildQuoteEmail(data);
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Spawn Crest Website <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: QUOTE_TO_EMAIL,
      replyTo: data.email,
      subject,
      text,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  // Zero-config fallback so quotes still reach admin@spawncrest.com
  // without a Resend key. First delivery may require email confirmation.
  const response = await fetch(
    `https://formsubmit.co/ajax/${QUOTE_TO_EMAIL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        email: data.email,
        service: data.service,
        location: data.location || "Not provided",
        message: data.message || "No message",
        _subject: subject,
        _template: "table",
        _replyto: data.email,
        _captcha: "false",
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email delivery failed: ${body}`);
  }

  const result = (await response.json()) as { success?: string | boolean };
  if (result.success === false || result.success === "false") {
    throw new Error("Email delivery was rejected by the mail provider.");
  }
}

export async function submitQuoteRequest(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    service: formData.get("service"),
    location: formData.get("location") || "",
    message: formData.get("message") || "",
  };

  const result = quoteSchema.safeParse(rawData);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      message: firstError?.message || "Please check the form and try again.",
    };
  }

  const data = result.data;

  try {
    await sendQuoteEmail(data);
  } catch (error) {
    console.error("[Spawn Crest] Failed to forward quote request:", error);
    return {
      success: false,
      message:
        "We couldn't send your request right now. Please call us at (559) 573-2269 and we'll help you right away.",
    };
  }

  return {
    success: true,
    message:
      "Thank you! Your quote request has been received. A team member will contact you within 15 minutes during business hours.",
  };
}

const membershipSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format"),
  email: z.string().email("Please enter a valid email address"),
  plan: z.string().min(1, "Please select a membership plan"),
  planPrice: z.string().min(1),
  address: z.string().min(5, "Service address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP code is required"),
  paymentPreference: z.string().min(1, "Please choose a payment preference"),
  notes: z.string().optional(),
});

export type MembershipFormData = z.infer<typeof membershipSchema>;

function buildMembershipEmail(data: MembershipFormData) {
  const subject = `Membership Purchase: ${data.plan} — ${data.name}`;
  const text = [
    "New membership purchase / enrollment from the Spawn Crest website",
    "",
    `Plan: ${data.plan}`,
    `Annual price: ${data.planPrice}`,
    `Payment preference: ${data.paymentPreference}`,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Service address: ${data.address}`,
    `City: ${data.city}`,
    `ZIP: ${data.zip}`,
    `Notes: ${data.notes || "None"}`,
    "",
    `Received: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT`,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; color: #0f172a;">
      <h2 style="margin: 0 0 8px; color: #0c4a5e;">Membership Purchase Request</h2>
      <p style="margin: 0 0 20px; color: #64748b;">Customer submitted the membership enrollment form (not a service quote).</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; width: 140px;">Plan</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.plan)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Annual price</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.planPrice)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Payment preference</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.paymentPreference)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Address</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.address)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">City</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.city)}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600;">ZIP</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.zip)}</td></tr>
        <tr><td style="padding: 10px 0; font-weight: 600; vertical-align: top;">Notes</td><td style="padding: 10px 0; white-space: pre-wrap;">${escapeHtml(data.notes || "None")}</td></tr>
      </table>
    </div>
  `;

  return { subject, text, html };
}

async function sendMembershipEmail(data: MembershipFormData) {
  const { subject, text, html } = buildMembershipEmail(data);
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Spawn Crest Website <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: QUOTE_TO_EMAIL,
      replyTo: data.email,
      subject,
      text,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const response = await fetch(
    `https://formsubmit.co/ajax/${QUOTE_TO_EMAIL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        email: data.email,
        plan: data.plan,
        planPrice: data.planPrice,
        paymentPreference: data.paymentPreference,
        address: data.address,
        city: data.city,
        zip: data.zip,
        notes: data.notes || "None",
        _subject: subject,
        _template: "table",
        _replyto: data.email,
        _captcha: "false",
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email delivery failed: ${body}`);
  }

  const result = (await response.json()) as { success?: string | boolean };
  if (result.success === false || result.success === "false") {
    throw new Error("Email delivery was rejected by the mail provider.");
  }
}

export async function submitMembershipEnrollment(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    plan: formData.get("plan"),
    planPrice: formData.get("planPrice"),
    address: formData.get("address"),
    city: formData.get("city"),
    zip: formData.get("zip"),
    paymentPreference: formData.get("paymentPreference"),
    notes: formData.get("notes") || "",
  };

  const result = membershipSchema.safeParse(rawData);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      message: firstError?.message || "Please check the form and try again.",
    };
  }

  try {
    await sendMembershipEmail(result.data);
  } catch (error) {
    console.error("[Spawn Crest] Failed to forward membership enrollment:", error);
    return {
      success: false,
      message:
        "We couldn't complete your enrollment request right now. Please call us at (559) 573-2269 and we'll enroll you over the phone.",
    };
  }

  return {
    success: true,
    message:
      "You're almost set! We received your membership enrollment. A team member will contact you shortly to collect payment and schedule your first inspection.",
  };
}
