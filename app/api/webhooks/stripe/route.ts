import { NextResponse } from "next/server";
import { Resend } from "resend";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const ADMIN_EMAIL = "admin@spawncrest.com";

async function notifyAdmin(session: Stripe.Checkout.Session) {
  const m = session.metadata || {};
  const subject = `Paid membership: ${m.planName || "Membership"} — ${m.customerName || session.customer_email}`;
  const amount =
    typeof session.amount_total === "number"
      ? `$${(session.amount_total / 100).toFixed(2)}`
      : "unknown";

  const text = [
    "A membership was paid successfully via Stripe Checkout.",
    "",
    `Plan: ${m.planName || "—"}`,
    `Amount: ${amount}`,
    `Stripe session: ${session.id}`,
    `Payment status: ${session.payment_status}`,
    "",
    `Name: ${m.customerName || "—"}`,
    `Email: ${m.email || session.customer_email || "—"}`,
    `Phone: ${m.phone || "—"}`,
    `Address: ${m.address || "—"}`,
    `City: ${m.city || "—"}`,
    `ZIP: ${m.zip || "—"}`,
    `Notes: ${m.notes || "None"}`,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Spawn Crest Website <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to: ADMIN_EMAIL,
      subject,
      text,
    });
    return;
  }

  await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      message: text,
      _template: "table",
      _captcha: "false",
    }),
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (
        session.metadata?.type === "membership" &&
        session.payment_status === "paid"
      ) {
        await notifyAdmin(session);
      }
    }
  } catch (err) {
    console.error("[Stripe Webhook] handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
