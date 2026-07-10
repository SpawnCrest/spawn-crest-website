"use client";

import { LucideIcon } from "lucide-react";

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function TrustItem({ icon: Icon, title, description }: TrustItemProps) {
  return (
    <div className="flex gap-4">
      <div className="trust-icon shrink-0 mt-0.5">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-semibold text-[var(--brand-navy)] tracking-[-0.01em] mb-1">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
