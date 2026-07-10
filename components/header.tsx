"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, Phone } from "lucide-react";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Memberships", href: "#memberships" },
  { label: "About", href: "#about" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

interface HeaderProps {
  onRequestQuote: () => void;
}

export function Header({ onRequestQuote }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    // Smooth scroll is handled by CSS, but close sheet
    const el = document.querySelector(href);
    if (el) {
      const offset = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "nav-scrolled" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 md:h-[76px] items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Phone - desktop */}
            <a
              href="tel:+15595732269"
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-[var(--brand-navy)]/80 hover:text-[var(--brand-navy)] transition-colors"
            >
              <Phone className="h-4 w-4" />
              (559) 573-2269
            </a>

            {/* CTA Button - desktop */}
            <Button
              onClick={onRequestQuote}
              className="hidden md:inline-flex h-10 px-5 font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/90 text-white shadow-sm"
            >
              Get Free Quote
            </Button>

            {/* Mobile hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--brand-navy)] transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <SheetHeader className="border-b px-6 py-5">
                  <SheetTitle className="text-left">
                    <Logo size="sm" />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col py-2">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className="mobile-nav-link"
                    >
                      {item.label}
                    </a>
                  ))}

                  <div className="px-4 pt-6 pb-4 space-y-3">
                    <a
                      href="tel:+15595732269"
                      className="flex items-center justify-center gap-2 rounded-xl border border-[var(--brand-navy)]/20 py-3 text-sm font-medium text-[var(--brand-navy)] active:bg-muted"
                    >
                      <Phone className="h-4 w-4" />
                      Call (559) 573-2269
                    </a>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        onRequestQuote();
                      }}
                      className="w-full h-12 bg-[var(--brand-navy)] hover:bg-[var(--brand-navy-light)] text-white font-semibold"
                    >
                      Get a Free Quote
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
