"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitQuoteRequest } from "@/app/actions";
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
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
  service: z.string().min(1, "Please select a service"),
  location: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const services = [
  "Emergency Plumbing",
  "Drain Cleaning",
  "Pipe Repair & Replacement",
  "Water Heater Installation",
  "Leak Detection & Repair",
  "Fixture Installation",
  "Other / Not sure",
];

interface QuoteFormProps {
  variant?: "modal" | "full";
  onSuccess?: () => void;
  initialService?: string;
}

export function QuoteForm({ variant = "full", onSuccess, initialService }: QuoteFormProps) {
  const [state, formAction, isPending] = useActionState(submitQuoteRequest, null);
  const [selectedService, setSelectedService] = useState(initialService || "");

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
      service: "",
      location: "",
      message: "",
    },
  });

  // Sync select with rhf
  const handleServiceChange = (value: string | null) => {
    const v = value || "";
    setSelectedService(v);
    setValue("service", v, { shouldValidate: true });
  };

  // Handle server action result
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message, {
        duration: 6000,
      });
      reset();
      setSelectedService("");
      onSuccess?.();
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, reset, onSuccess]);

  const isModal = variant === "modal";

  const onSubmit = (data: FormValues) => {
    // Build FormData for server action
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("phone", data.phone);
    fd.append("email", data.email);
    fd.append("service", data.service);
    if (data.location) fd.append("location", data.location);
    if (data.message) fd.append("message", data.message);

    formAction(fd);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`quote-form space-y-5 ${isModal ? "px-1" : ""}`}
      noValidate
    >
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
            aria-invalid={!!errors.name}
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
            aria-invalid={!!errors.phone}
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
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="service" className="label">
          Service Needed *
        </Label>
        <Select
          value={selectedService}
          onValueChange={handleServiceChange}
          disabled={isPending}
        >
          <SelectTrigger className="form-input h-12 w-full" id="service">
            <SelectValue placeholder="Select a service..." />
          </SelectTrigger>
          <SelectContent>
            {services.map((svc) => (
              <SelectItem key={svc} value={svc}>
                {svc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service && (
          <p className="mt-1.5 text-xs text-destructive">{errors.service.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="location" className="label">
          City / ZIP Code
        </Label>
        <Input
          id="location"
          placeholder="Fresno, CA or 93701"
          className="form-input h-12"
          {...register("location")}
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="message" className="label">
          Describe the issue (optional)
        </Label>
        <Textarea
          id="message"
          placeholder="E.g. Leaking under kitchen sink, water pressure low in master bath..."
          rows={isModal ? 3 : 4}
          className="form-input resize-y min-h-[88px]"
          {...register("message")}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 text-base font-semibold bg-[var(--brand-navy)] hover:bg-[var(--brand-navy-light)] active:bg-black text-white shadow-sm transition-all"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Request...
          </>
        ) : (
          "Request Free Quote"
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        We typically respond within 15 minutes during business hours. 24/7 for emergencies.
      </p>
    </form>
  );
}
