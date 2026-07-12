"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitMembershipEnrollment } from "@/app/actions";
import {
  formatMembershipPrice,
  type MembershipPlan,
} from "@/lib/memberships";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(5, "Service address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP is required"),
  paymentPreference: z.string().min(1, "Choose a payment preference"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const paymentOptions = [
  "Call me for card payment",
  "Send me a secure payment link by text/email",
  "Invoice / pay by check",
];

interface MembershipEnrollFormProps {
  plan: MembershipPlan;
}

export function MembershipEnrollForm({ plan }: MembershipEnrollFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitMembershipEnrollment,
    null
  );
  const [paymentPreference, setPaymentPreference] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      paymentPreference: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message, { duration: 8000 });
      reset();
      setPaymentPreference("");
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, reset]);

  const onSubmit = (data: FormValues) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("phone", data.phone);
    fd.append("email", data.email);
    fd.append("plan", plan.name);
    fd.append("planPrice", `${formatMembershipPrice(plan.price)}${plan.period}`);
    fd.append("address", data.address);
    fd.append("city", data.city);
    fd.append("zip", data.zip);
    fd.append("paymentPreference", data.paymentPreference);
    if (data.notes) fd.append("notes", data.notes);
    formAction(fd);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="rounded-xl border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/5 px-4 py-3 text-sm text-[var(--brand-navy)] flex gap-2.5">
        <ShieldCheck className="h-5 w-5 text-[var(--brand-teal)] shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold">
            Purchasing {plan.name} — {formatMembershipPrice(plan.price)}
            {plan.period}
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            This is a membership purchase, not a service quote. After you submit, we&apos;ll confirm payment and schedule your first inspection.
          </p>
        </div>
      </div>

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
            placeholder="(559) 573-2269"
            className="form-input h-12"
            {...register("phone")}
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
        <Label htmlFor="paymentPreference" className="label">
          How would you like to pay? *
        </Label>
        <Select
          value={paymentPreference}
          onValueChange={(value) => {
            const v = value || "";
            setPaymentPreference(v);
            setValue("paymentPreference", v, { shouldValidate: true });
          }}
          disabled={isPending}
        >
          <SelectTrigger className="form-input h-12 w-full" id="paymentPreference">
            <SelectValue placeholder="Select payment preference..." />
          </SelectTrigger>
          <SelectContent>
            {paymentOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.paymentPreference && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.paymentPreference.message}
          </p>
        )}
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
        disabled={isPending}
        className="w-full h-12 text-base font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/90 text-white shadow-sm"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing enrollment...
          </>
        ) : (
          `Enroll in ${plan.name} — ${formatMembershipPrice(plan.price)}/yr`
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        Annual membership. You may pause or cancel after the first year. Payment is collected after enrollment confirmation — we never charge a card on this page until you approve.
      </p>
    </form>
  );
}
