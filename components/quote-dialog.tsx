"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "@/components/quote-form";

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialService?: string;
}

export function QuoteDialog({ open, onOpenChange, initialService }: QuoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-3xl overflow-hidden">
        <div className="bg-[var(--brand-navy)] px-6 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl tracking-[-0.02em]">Get Your Free Quote</DialogTitle>
            <DialogDescription className="text-white/70 pt-1">
              Tell us about your project. We&apos;ll get back to you fast.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-7">
          <QuoteForm
            variant="modal"
            initialService={initialService}
            onSuccess={() => {
              // Close after short delay so user sees toast
              setTimeout(() => onOpenChange(false), 1200);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
