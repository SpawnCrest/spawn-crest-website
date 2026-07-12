import { NextResponse } from "next/server";
import { z } from "zod";
import { getMembershipPlan } from "@/lib/memberships";
import { getSiteUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

const bodySchema = z.object({
  planId: z.enum(["biyearly", "quarterly", "vip"]),
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(2),
  zip: z.string().min(5),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Online payments are not configured yet. Please call (559) 573-2269 to enroll, or set STRIPE_SECRET_KEY on the server.",
        },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment system unavailable." },
        { status: 503 }
      );
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid form data." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const plan = getMembershipPlan(data.planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid membership plan." }, { status: 400 });
    }

    const siteUrl = getSiteUrl();

    // Hosted Stripe Checkout — card data never touches our servers (PCI SAQ-A)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      client_reference_id: data.planId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: {
              name: `Spawn Crest — ${plan.name} Membership`,
              description: `${plan.tagline}. Annual maintenance membership for your home plumbing system.`,
            },
          },
        },
      ],
      metadata: {
        type: "membership",
        planId: plan.id,
        planName: plan.name,
        planPrice: String(plan.price),
        customerName: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        zip: data.zip,
        notes: data.notes?.slice(0, 450) || "",
      },
      payment_intent_data: {
        description: `${plan.name} annual membership — ${data.name}`,
        metadata: {
          planId: plan.id,
          phone: data.phone,
        },
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      success_url: `${siteUrl}/memberships/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/memberships/enroll?plan=${plan.slug}&canceled=1`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("[Stripe Checkout] membership error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout failed. Please try again or call (559) 573-2269.",
      },
      { status: 500 }
    );
  }
}
