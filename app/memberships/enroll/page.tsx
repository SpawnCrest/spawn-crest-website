import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Phone } from "lucide-react";
import {
  MEMBERSHIP_PLANS,
  formatMembershipPrice,
  getMembershipPlan,
} from "@/lib/memberships";
import { MembershipEnrollForm } from "@/components/membership-enroll-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Purchase Membership",
  description:
    "Enroll in a Spawn Crest maintenance membership. Choose Biyearly, Quarterly, or VIP protection for your Fresno-area home.",
};

interface EnrollPageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function MembershipEnrollPage({ searchParams }: EnrollPageProps) {
  const params = await searchParams;
  const selected = getMembershipPlan(params.plan) ?? MEMBERSHIP_PLANS[1]; // default Quarterly

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <a
            href="tel:+15595732269"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-navy)]/80 hover:text-[var(--brand-navy)]"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">(559) 573-2269</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <Link
            href="/#memberships"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-teal)] hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to memberships
          </Link>

          <div className="mb-8 max-w-2xl">
            <div className="uppercase tracking-[2px] text-xs font-semibold text-[var(--brand-teal)] mb-2">
              Membership purchase
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-[-1px] text-[var(--brand-navy)]">
              Enroll &amp; protect your home
            </h1>
            <p className="mt-3 text-muted-foreground">
              This page is only for purchasing a maintenance membership. Need a repair or free quote for work?{" "}
              <Link href="/#contact" className="text-[var(--brand-teal)] font-medium hover:underline">
                Request a service quote instead
              </Link>
              .
            </p>
          </div>

          {/* Plan picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {MEMBERSHIP_PLANS.map((plan) => {
              const active = plan.id === selected.id;
              return (
                <Link
                  key={plan.id}
                  href={`/memberships/enroll?plan=${plan.slug}`}
                  className={`rounded-2xl border p-4 transition-all ${
                    active
                      ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/5 shadow-sm ring-1 ring-[var(--brand-teal)]/40"
                      : "border-border/60 bg-white hover:border-[var(--brand-navy)]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-[var(--brand-navy)]">{plan.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{plan.tagline}</div>
                    </div>
                    {plan.recommended && (
                      <span className="text-[9px] font-semibold tracking-wider uppercase bg-[var(--brand-teal)] text-white px-2 py-0.5 rounded-full shrink-0">
                        Best value
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-semibold tracking-tight text-[var(--brand-navy)]">
                      {formatMembershipPrice(plan.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Order summary */}
            <aside className="lg:col-span-5 order-2 lg:order-1">
              <div className="premium-card p-6 md:p-7 sticky top-24">
                <div className="text-xs font-semibold tracking-wider text-[var(--brand-teal)] uppercase mb-2">
                  Order summary
                </div>
                <h2 className="text-xl font-semibold text-[var(--brand-navy)]">{selected.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{selected.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tighter text-[var(--brand-navy)]">
                    {formatMembershipPrice(selected.price)}
                  </span>
                  <span className="text-muted-foreground text-sm">{selected.period}</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-sm text-[var(--brand-navy)]/90">
                  {selected.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-[var(--brand-teal)] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t text-xs text-muted-foreground space-y-1.5">
                  <p>First inspection scheduled within 10 business days of payment.</p>
                  <p>Annual commitment. Pause or cancel after the first year.</p>
                </div>
              </div>
            </aside>

            {/* Checkout form */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="premium-card p-6 md:p-8">
                <h2 className="text-lg font-semibold text-[var(--brand-navy)] mb-1">
                  Checkout details
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your info to enroll. We&apos;ll confirm payment using your preferred method.
                </p>
                <MembershipEnrollForm key={selected.id} plan={selected} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Spawn Crest Plumbing · CA C-36 #1156533 ·{" "}
        <Link href="/" className="hover:text-[var(--brand-navy)]">
          Home
        </Link>
      </footer>
    </div>
  );
}
