import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Phone, Home } from "lucide-react";
import { Logo } from "@/components/logo";
import { getStripe } from "@/lib/stripe";
import { getMembershipPlan, formatMembershipPrice } from "@/lib/memberships";

export const metadata: Metadata = {
  title: "Membership Payment Successful",
  description: "Your Spawn Crest membership payment was received.",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function MembershipSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;
  const stripe = getStripe();

  let planName = "your membership";
  let amountLabel = "";
  let email = "";

  if (stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.metadata?.planName) {
        planName = session.metadata.planName;
      } else if (session.metadata?.planId) {
        const plan = getMembershipPlan(session.metadata.planId);
        if (plan) planName = plan.name;
      }
      if (typeof session.amount_total === "number") {
        amountLabel = formatMembershipPrice(session.amount_total / 100);
      }
      email = session.customer_email || session.metadata?.email || "";
    } catch {
      // Session lookup failed — still show a friendly confirmation
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center">
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-teal)]/10">
            <CheckCircle2 className="h-9 w-9 text-[var(--brand-teal)]" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--brand-navy)]">
            Payment successful
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Thank you! Your payment for <strong className="text-[var(--brand-navy)]">{planName}</strong>
            {amountLabel ? (
              <>
                {" "}
                ({amountLabel})
              </>
            ) : null}{" "}
            was received securely through Stripe.
            {email ? (
              <>
                {" "}
                A receipt was sent to <strong>{email}</strong>.
              </>
            ) : null}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            We&apos;ll contact you within 1 business day to schedule your first inspection
            (within 10 business days of enrollment).
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-6 text-sm font-semibold text-white hover:bg-[var(--brand-navy-light)]"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
            <a
              href="tel:+15595732269"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-navy)]/20 px-6 text-sm font-semibold text-[var(--brand-navy)] hover:bg-muted"
            >
              <Phone className="h-4 w-4" />
              Call (559) 573-2269
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
