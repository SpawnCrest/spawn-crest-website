"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: string;
  isEmergency?: boolean;
  /** Optional stock / project photo for the service */
  image?: string;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  highlight,
  isEmergency,
  image,
}: ServiceCardProps) {
  return (
    <Card className="premium-card group h-full border-border/60 overflow-hidden gap-0 py-0">
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted shrink-0">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/35 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[var(--brand-navy)] shadow-sm transition-colors group-hover:bg-[var(--brand-teal)] group-hover:text-white">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      )}

      <CardContent className="p-6 md:p-7 flex flex-col flex-1">
        {!image && (
          <div className="service-icon mb-5 group-hover:bg-[var(--brand-teal)]/10 group-hover:text-[var(--brand-teal)] transition-colors">
            <Icon className="h-6 w-6" />
          </div>
        )}

        <h3 className="font-semibold text-xl tracking-[-0.015em] text-[var(--brand-navy)] mb-2.5">
          {title}
        </h3>

        <p className="text-[15px] leading-relaxed text-muted-foreground flex-1">
          {description}
        </p>

        <div className="pt-5 mt-auto flex items-center gap-2">
          {isEmergency && (
            <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/10 border-red-500/20 font-medium">
              24/7 Available
            </Badge>
          )}
          {highlight && (
            <span className="text-xs font-medium text-[var(--brand-teal)]">
              {highlight}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
