"use client";

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";

const STORAGE_KEY = "spawn-crest-app-coming-soon-dismissed";

export function AppComingSoon() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // Private browsing can block storage; still show the notice.
    }
    const id = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(id);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore storage failures; the notice stays closed for this view.
    }
  }

  if (!open) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex items-center gap-2.5 rounded-2xl bg-[var(--brand-navy)] py-2.5 pr-1.5 pl-2.5 text-white shadow-lg shadow-[var(--brand-navy)]/25 ring-1 ring-white/10">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-teal)] text-white">
          <Smartphone className="size-4" aria-hidden />
        </span>
        <p className="whitespace-nowrap text-sm font-semibold leading-none">
          Spawn Crest App coming soon
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
