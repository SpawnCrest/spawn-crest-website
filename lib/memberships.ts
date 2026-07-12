export type MembershipPlanId = "biyearly" | "quarterly" | "vip";

export interface MembershipPlan {
  id: MembershipPlanId;
  slug: MembershipPlanId;
  name: string;
  tagline: string;
  price: number;
  period: string;
  visits: string;
  recommended?: boolean;
  features: string[];
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "biyearly",
    slug: "biyearly",
    name: "Biyearly Care",
    tagline: "2 visits per year",
    price: 189,
    period: "/year",
    visits: "2 inspections / year",
    features: [
      "Two full plumbing system inspections",
      "Priority scheduling for service calls",
      "10% discount on all repairs",
      "No diagnostic fee on member visits",
      "Written inspection report after each visit",
    ],
  },
  {
    id: "quarterly",
    slug: "quarterly",
    name: "Quarterly Care",
    tagline: "4 visits per year",
    price: 329,
    period: "/year",
    visits: "4 inspections / year",
    recommended: true,
    features: [
      "Four full plumbing system inspections",
      "Same-day priority for emergencies",
      "15% discount on repairs & parts",
      "Free minor adjustments on visits",
      "Annual water heater flush included",
      "Detailed written report + photos",
    ],
  },
  {
    id: "vip",
    slug: "vip",
    name: "VIP Protection",
    tagline: "4 visits + priority response",
    price: 449,
    period: "/year",
    visits: "4 inspections + priority response",
    features: [
      "Everything in Quarterly Care",
      "2-hour guaranteed emergency response",
      "20% discount on all work",
      "1 emergency visit credit included",
      "Direct line to your technician",
      "Seasonal drain & fixture maintenance",
    ],
  },
];

export function getMembershipPlan(slug?: string | null): MembershipPlan | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return MEMBERSHIP_PLANS.find(
    (p) => p.slug === normalized || p.id === normalized || p.name.toLowerCase() === normalized
  );
}

export function formatMembershipPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
