"use client";

import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  rating?: number;
}

export function TestimonialCard({ quote, name, location, rating = 5 }: TestimonialCardProps) {
  return (
    <div className="premium-card p-7 md:p-8 h-full flex flex-col">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[var(--brand-gold)] text-[var(--brand-gold)]" />
        ))}
      </div>

      <blockquote className="text-[15px] leading-relaxed text-[var(--brand-navy)]/90 flex-1">
        “{quote}”
      </blockquote>

      <div className="pt-6 mt-auto border-t border-border/60">
        <div className="font-semibold text-[var(--brand-navy)]">{name}</div>
        <div className="text-sm text-muted-foreground">{location}</div>
      </div>
    </div>
  );
}
