"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  formatMembershipPrice,
  type MembershipPlan,
} from "@/lib/memberships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { formatPhoneInput, PHONE_PATTERN } from "@/lib/phone";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(PHONE_PATTERN, "Phone must be (xxx)xxx-xxxx"),
  email: z.string().email("Valid email required"),
  address: z.string().min(5, "Service address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MembershipEnrollFormProps {
  plan: MembershipPlan;
  /** When false, show setup message instead of live checkout */
  stripeEnabled?: boolean;
  canceled?: boolean;
}

export function MembershipEnrollForm({
  plan,
  stripeEnabled = true,
  canceled = false,
}: MembershipEnrollFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      notes: "",
    },
  });

  const phoneValue = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setValue("phone", formatted, { shouldValidate: formatted.length === 13 });
  };

  const onSubmit = async (data: FormValues) => {
    if (!stripeEnabled) {
      toast.error(
        "Online payments are not set up yet. Please call (559) 573-2269 to enroll."
      );
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/checkout/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
          zip: data.zip,
          notes: data.notes || "",
        }),
      });

      const payload = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !payload.url) {
        throw new Error(payload.error || "Could not start secure checkout.");
      }

      // Redirect to Stripe-hosted Checkout (card never touches our site)
      window.location.href = payload.url;
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again or call us."
      );
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="rounded-xl border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/5 px-4 py-3 text-sm text-[var(--brand-navy)] flex gap-2.5">
        <ShieldCheck className="h-5 w-5 text-[var(--brand-teal)] shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold">
            Purchasing {plan.name} — {formatMembershipPrice(plan.price)}
            {plan.period}
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Enter your details, then pay securely on Stripe&apos;s checkout page. Your card number is never stored on our website.
          </p>
        </div>
      </div>

      {canceled && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Checkout was canceled. You can update your info below and try payment again when ready.
        </div>
      )}

      {!stripeEnabled && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          Online card payments are being connected. Call{" "}
          <a href="tel:+15595732269" className="font-semibold underline">
            (559) 573-2269
          </a>{" "}
          to enroll over the phone, or finish Stripe setup (see site owner instructions).
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" className="label">
            Full Name *
          </Label>
          <Input
            id="name"
            placeholder="John Smith"
            className="form-input h-12"
            {...register("name")}
            disabled={isPending}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone" className="label">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="(559)573-2269"
            className="form-input h-12"
            value={phoneValue}
            onChange={handlePhoneChange}
            maxLength={13}
            disabled={isPending}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="label">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="form-input h-12"
          {...register("email")}
          disabled={isPending}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address" className="label">
          Service Address *
        </Label>
        <Input
          id="address"
          placeholder="123 Main St"
          className="form-input h-12"
          {...register("address")}
          disabled={isPending}
        />
        {errors.address && (
          <p className="mt-1.5 text-xs text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="city" className="label">
            City *
          </Label>
          <Input
            id="city"
            placeholder="Fresno"
            className="form-input h-12"
            {...register("city")}
            disabled={isPending}
          />
          {errors.city && (
            <p className="mt-1.5 text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="zip" className="label">
            ZIP Code *
          </Label>
          <Input
            id="zip"
            placeholder="93701"
            className="form-input h-12"
            {...register("zip")}
            disabled={isPending}
          />
          {errors.zip && (
            <p className="mt-1.5 text-xs text-destructive">{errors.zip.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="label">
          Notes (optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Preferred inspection days, gate codes, etc."
          rows={3}
          className="form-input resize-y min-h-[80px]"
          {...register("notes")}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !stripeEnabled}
        className="w-full h-12 text-base font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/90 text-white shadow-sm"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting to secure checkout...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay {formatMembershipPrice(plan.price)} securely with Stripe
          </>
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
        Payments are processed by{" "}
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--brand-navy)]"
        >
          Stripe
        </a>
        , a PCI Level 1 certified processor used by millions of businesses. Annual membership.
        You may pause or cancel after the first year.
      </p>
    </form>
  );
}
