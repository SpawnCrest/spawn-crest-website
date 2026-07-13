"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Waves,
  Wrench,
  ThermometerSun,
  Search,
  ShowerHead,
  ShieldCheck,
  Clock,
  Award,
  Users,
  DollarSign,
  MapPin,
  CheckCircle2,
  Star,
  Calendar,
  Percent,
} from "lucide-react";

import Link from "next/link";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { ServiceCard } from "@/components/service-card";
import { WorkItem } from "@/components/work-item";
import { TrustItem } from "@/components/trust-item";
import { QuoteDialog } from "@/components/quote-dialog";
import { QuoteForm } from "@/components/quote-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    icon: PhoneCall,
    title: "Emergency Plumbing",
    description: "Burst pipes, overflowing toilets, gas leaks, and no-water emergencies. Our techs are on the road 24/7.",
    highlight: "15-min average response",
    isEmergency: true,
    image: "/gallery/stock-emergency.jpg",
  },
  {
    icon: Waves,
    title: "Drain Cleaning",
    description: "Clogged kitchen sinks, slow showers, main line backups. Hydro-jetting and camera inspection included.",
    highlight: "Same-day service",
    image: "/gallery/stock-drain-camera.jpg",
  },
  {
    icon: Wrench,
    title: "Pipe Repair & Repipe",
    description: "Slab leaks, pinhole leaks, galvanized or polybutylene replacement. Trenchless options available.",
    highlight: "Strong warranty on repairs",
    image: "/gallery/stock-finished-plumb.jpg",
  },
  {
    icon: ThermometerSun,
    title: "Water Heater Services",
    description: "Tank and tankless installation, replacement, repair, and maintenance. High-efficiency upgrades.",
    highlight: "Same-day installs often possible",
    image: "/gallery/stock-tankless.jpg",
  },
  {
    icon: Search,
    title: "Leak Detection",
    description: "Non-invasive electronic leak detection for slabs, walls, and yards. Pinpoint accuracy before digging.",
    highlight: "No destruction guarantee",
    image: "/gallery/stock-leak-detection.jpg",
  },
  {
    icon: ShowerHead,
    title: "Fixture Installation",
    description: "Faucets, showers, toilets, garbage disposals, whole-home filtration, and luxury upgrades.",
    highlight: "Premium brand options",
    image: "/gallery/stock-faucet-install.jpg",
  },
];

const trustSignals = [
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    description: "California Licensed Plumber (C-36) #1156533. Fully bonded and insured for your complete protection.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Response",
    description: "Real technicians on call nights, weekends, and holidays. No voicemail — a human answers.",
  },
  {
    icon: Award,
    title: "Top Rated Service",
    description: "5.0 average rating from every client so far. We earn your trust one job at a time.",
  },
  {
    icon: DollarSign,
    title: "Upfront Pricing",
    description: "Transparent written quotes before any work begins. No surprise fees. Ever.",
  },
  {
    icon: Users,
    title: "Licensed Professionals",
    description: "Every tech is fully licensed with solid hands-on experience in residential and commercial plumbing.",
  },
  {
    icon: MapPin,
    title: "Serving Fresno Since 2026",
    description: "Founded by brothers Adrian & Isaac Nieto. We're your new local plumbing team building a community.",
  },
];

// Representative stock photos until we have completed job photos to swap in.
const galleryItems = [
  {
    title: "Whole-House Repipe",
    category: "Repipe",
    description: "PEX manifold installs that replace aging polybutylene or galvanized lines throughout the home.",
    image: "/gallery/stock-finished-plumb.jpg",
  },
  {
    title: "Water Heater Upgrade",
    category: "Water Heater",
    description: "Tank and tankless installs with proper valves, expansion tanks, and code-compliant connections.",
    image: "/gallery/stock-tankless.jpg",
  },
  {
    title: "Drain Camera & Cleaning",
    category: "Drain",
    description: "Camera inspection and mechanical cleaning to clear clogs and map problem lines.",
    image: "/gallery/stock-drain-camera.jpg",
  },
  {
    title: "Luxury Bath Remodel",
    category: "Fixtures",
    description: "Vanities, rainfall showers, tubs, and premium fixture packages finished cleanly.",
    image: "/gallery/bathroom-fixtures.jpg",
  },
  {
    title: "Leak Detection & Repair",
    category: "Leak",
    description: "Pinpoint leak detection and copper or PEX repair with minimal disruption to your home.",
    image: "/gallery/stock-leak-detection.jpg",
  },
  {
    title: "Emergency Pipe Repair",
    category: "Emergency",
    description: "Fast response for burst lines, failed fittings, and after-hours plumbing emergencies.",
    image: "/gallery/stock-emergency.jpg",
  },
  {
    title: "Kitchen Drain Restoration",
    category: "Drain",
    description: "Under-sink repairs, disposal installs, and hydro-jetting for slow or clogged kitchen lines.",
    image: "/gallery/stock-plumber-pipes.jpg",
  },
  {
    title: "Fixture Installation",
    category: "Fixtures",
    description: "Faucets, sinks, and fixture packages installed cleanly with professional finishes.",
    image: "/gallery/stock-faucet-install.jpg",
  },
  {
    title: "Pipe Tools & Precision Work",
    category: "Repipe",
    description: "Careful pipe joining, threading, and rebuild work using pro-grade tools and materials.",
    image: "/gallery/stock-pipe-tools.jpg",
  },
];


const serviceAreas = [
  "Fresno",
  "Clovis",
  "Madera",
  "Sanger",
  "Selma",
  "Reedley",
  "Kingsburg",
  "Kerman",
  "Hanford",
  "Visalia",
];

export default function SpawnCrestWebsite() {
  const [quoteDialog, setQuoteDialog] = useState<{ open: boolean; initialService?: string }>({ open: false });

  const openQuote = (initialService?: string) => setQuoteDialog({ open: true, initialService });

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header onRequestQuote={openQuote} />

      {/* HERO */}
      <section
        id="hero"
        className="hero-bg water-flow flex min-h-[100dvh] md:min-h-[92dvh] items-center pt-16 md:pt-0"
      >
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-10 md:pt-8 md:pb-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex">
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur px-3 py-1 text-xs tracking-[1px] font-medium">
                EST. 2026 • FRESNO, CA
              </Badge>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[78px] font-semibold tracking-[-3.2px] leading-[0.92] text-white mb-6">
              Premium plumbing.<br />Done right.
            </h1>

            <p className="max-w-xl text-xl md:text-2xl text-white/80 tracking-[-0.2px] mb-9">
              Bringing honest, premium plumbing and fast reliable service to homeowners across the Central Valley.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => openQuote()}
                size="lg"
                className="h-14 px-9 text-base font-semibold bg-white text-[var(--brand-navy)] hover:bg-white/95 active:bg-white shadow-xl"
              >
                Get a Free Quote
              </Button>
              <a
                href="tel:+15595732269"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-white/30 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 active:bg-white/15"
              >
                <PhoneCall className="h-4 w-4" />
                Call 24/7: (559) 573-2269
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-cyan)]" /> Licensed Plumbers
              </div>
              <div className="hidden sm:block h-3 w-px bg-white/20" />
              <div>5.0 ★ from early customers</div>
            </div>
          </div>
        </div>

        {/* Subtle bottom wave / water accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </section>

      {/* TRUST BAR */}
      <div className="border-b bg-white py-3.5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-[var(--brand-navy)]/70">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--brand-teal)]" /> Licensed #1156533 &amp; Insured</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[var(--brand-teal)]" /> 24/7 Emergency</div>
            <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-[var(--brand-gold)] text-[var(--brand-gold)]" /> 5.0 ★ Early Reviews</div>
            <div className="flex items-center gap-2"><Award className="h-4 w-4 text-[var(--brand-teal)]" /> 100% Satisfaction Guarantee</div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="section bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 pb-10 md:flex-row md:items-end">
            <div>
              <div className="uppercase tracking-[2px] text-xs font-semibold text-[var(--brand-teal)] mb-3">WHAT WE DO BEST</div>
              <h2 className="section-title">Expertise across every<br className="hidden sm:block" /> plumbing need.</h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              From midnight emergencies to whole-home repipes, our team delivers precision work with premium materials.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(index * 0.03, 0.2) }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <Button
              variant="outline"
              onClick={() => openQuote()}
              className="border-[var(--brand-navy)]/30 text-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white"
            >
              Request Service for Your Home
            </Button>
            <a href="#memberships" className="text-sm font-medium text-[var(--brand-teal)] hover:underline">
              Or explore our Maintenance Memberships →
            </a>
          </div>
        </div>
      </section>

      {/* MEMBERSHIPS */}
      <section id="memberships" className="section bg-muted/30 border-y">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-10">
            <div className="uppercase tracking-[2px] text-xs font-semibold text-[var(--brand-teal)] mb-3">PROACTIVE PROTECTION</div>
            <h2 className="section-title">Maintenance Memberships</h2>
            <p className="section-subtitle mx-auto mt-3">
              Scheduled inspections catch small issues before they become expensive emergencies. 
              Members also receive priority scheduling and discounted repairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Biyearly */}
            <div className="premium-card p-7 flex flex-col h-full">
              <div>
                <div className="font-semibold text-xl text-[var(--brand-navy)]">Biyearly Care</div>
                <div className="text-sm text-muted-foreground mt-0.5">2 visits per year</div>
              </div>
              <div className="mt-5">
                <span className="text-4xl font-semibold tracking-tighter text-[var(--brand-navy)]">$189</span>
                <span className="text-muted-foreground text-sm">/year</span>
              </div>

              <ul className="mt-6 space-y-[13px] text-[14px] flex-1 text-[var(--brand-navy)]/90">
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Two full plumbing system inspections</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Priority scheduling for service calls</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> 10% discount on all repairs</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> No diagnostic fee on member visits</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Written inspection report after each visit</li>
              </ul>

              <Link
                href="/memberships/enroll?plan=biyearly"
                className="mt-7 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[var(--brand-navy)]/30 bg-background px-4 text-sm font-medium text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)] hover:text-white"
              >
                Enroll in Biyearly
              </Link>
            </div>

            {/* Quarterly - Recommended */}
            <div className="premium-card p-7 flex flex-col h-full border-[var(--brand-teal)]/70 shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--brand-teal)] text-white text-[10px] font-semibold tracking-wider px-5 py-1 rounded-full">RECOMMENDED</div>
              <div>
                <div className="font-semibold text-xl text-[var(--brand-navy)]">Quarterly Care</div>
                <div className="text-sm text-muted-foreground mt-0.5">4 visits per year</div>
              </div>
              <div className="mt-5">
                <span className="text-4xl font-semibold tracking-tighter text-[var(--brand-navy)]">$329</span>
                <span className="text-muted-foreground text-sm">/year</span>
              </div>

              <ul className="mt-6 space-y-[13px] text-[14px] flex-1 text-[var(--brand-navy)]/90">
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Four full plumbing system inspections</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Same-day priority for emergencies</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> 15% discount on repairs &amp; parts</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Free minor adjustments on visits</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Annual water heater flush included</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Detailed written report + photos</li>
              </ul>

              <Link
                href="/memberships/enroll?plan=quarterly"
                className="mt-7 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[var(--brand-teal)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-teal)]/90"
              >
                Enroll in Quarterly
              </Link>
            </div>

            {/* VIP */}
            <div className="premium-card p-7 flex flex-col h-full">
              <div>
                <div className="font-semibold text-xl text-[var(--brand-navy)]">VIP Protection</div>
                <div className="text-sm text-muted-foreground mt-0.5">4 visits + priority response</div>
              </div>
              <div className="mt-5">
                <span className="text-4xl font-semibold tracking-tighter text-[var(--brand-navy)]">$449</span>
                <span className="text-muted-foreground text-sm">/year</span>
              </div>

              <ul className="mt-6 space-y-[13px] text-[14px] flex-1 text-[var(--brand-navy)]/90">
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Everything in Quarterly Care</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> 2-hour guaranteed emergency response</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> 20% discount on all work</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> 1 emergency visit credit included</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Direct line to your technician</li>
                <li className="flex gap-2.5"><CheckCircle2 className="h-4 w-4 mt-[3px] text-[var(--brand-teal)] shrink-0" /> Seasonal drain &amp; fixture maintenance</li>
              </ul>

              <Link
                href="/memberships/enroll?plan=vip"
                className="mt-7 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[var(--brand-navy)]/30 bg-background px-4 text-sm font-medium text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)] hover:text-white"
              >
                Enroll in VIP
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
            All plans are annual commitments. You may pause or cancel after the first year. First inspection scheduled within 10 business days.
          </p>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="section bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-12 gap-x-12 gap-y-10 items-center">
            <div className="md:col-span-7">
              <div className="uppercase tracking-[2.5px] text-xs font-semibold text-[var(--brand-cyan)] mb-3">OUR STORY</div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-[-1.5px] leading-none mb-6">
                Built on craftsmanship.<br />Backed by integrity.
              </h2>
              <div className="space-y-5 text-[15px] leading-relaxed text-white/80 max-w-[46ch]">
                <p>
                  Spawn Crest was founded in 2026 by brothers Adrian and Isaac Nieto. We are a brand new company, but we are highly motivated and morally driven to give our customers the absolute best care possible. We haven&apos;t completed any jobs yet, but we are thrilled to start and build a real community through our company.
                </p>
                <p>
                  Although we&apos;re just getting started, our mission is to change the industry — no upselling, no shortcuts, and we will stand behind every job with integrity and a written guarantee. Our team is focused on earning your trust from day one.
                </p>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-9">
                <Logo size="lg" variant="light" className="mb-6" />
                <div className="grid grid-cols-2 gap-y-6 text-sm">
                  <div>
                    <div className="text-white/50 text-xs tracking-widest">FOUNDED</div>
                    <div className="font-semibold text-lg mt-1">2026</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs tracking-widest">FOUNDERS</div>
                    <div className="font-semibold text-lg mt-1">Adrian &amp; Isaac</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs tracking-widest">JOBS COMPLETED</div>
                    <div className="font-semibold text-lg mt-1">0 (ready!)</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs tracking-widest">OUR DRIVE</div>
                    <div className="font-semibold text-lg mt-1">Best care</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" className="section bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-10">
            <div className="uppercase tracking-[2px] text-xs font-semibold text-[var(--brand-teal)] mb-3">THE SPAWN CREST DIFFERENCE</div>
            <h2 className="section-title">Why discerning homeowners<br />choose us every time.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-9">
            {trustSignals.map((item, idx) => (
              <TrustItem key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <div className="border-y bg-muted/30 py-5">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm">
          <div className="font-semibold text-[var(--brand-navy)] flex items-center gap-2 shrink-0">
            <MapPin className="h-4 w-4 text-[var(--brand-teal)]" /> PROUDLY SERVING
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            {serviceAreas.map((area, i) => (
              <span key={i}>{area}{i < serviceAreas.length - 1 ? "," : ""}</span>
            ))}
            <span className="font-medium text-[var(--brand-navy)]/70">+ surrounding communities</span>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <section id="gallery" className="section bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-9">
            <div>
              <div className="uppercase tracking-[2px] text-xs font-semibold text-[var(--brand-teal)] mb-3">OUR WORK</div>
              <h2 className="section-title">The craft behind<br />every call.</h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              We&apos;re a new company building our portfolio. These photos show the kind of plumbing work we do — real project photos will replace them as jobs are completed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.005 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="group"
              >
                <WorkItem {...item} />
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            * Example stock photos for illustration only. We will update this gallery with photos of completed Spawn Crest jobs.
          </p>
        </div>
      </section>

      {/* CONTACT + FORM */}
      <section id="contact" className="section bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-12 gap-x-16 gap-y-12">
            {/* Left: info */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="uppercase tracking-[2px] text-xs font-semibold text-[var(--brand-teal)] mb-3">LET&apos;S TALK</div>
                <h2 className="section-title mb-6">Ready when you are.</h2>

                <div className="space-y-7 text-[15px]">
                  <div>
                    <div className="font-semibold text-[var(--brand-navy)] mb-1">Call or Text 24/7</div>
                    <a href="tel:+15595732269" className="text-2xl font-semibold tracking-tight text-[var(--brand-navy)] hover:underline">
                      (559) 573-2269
                    </a>
                  </div>

                  <div>
                    <div className="font-semibold text-[var(--brand-navy)] mb-1">Email</div>
                    <a href="mailto:admin@spawncrest.com" className="text-[var(--brand-teal)] hover:underline">admin@spawncrest.com</a>
                  </div>

                  <div>
                    <div className="font-semibold text-[var(--brand-navy)] mb-1">Office Hours</div>
                    <div className="text-muted-foreground">Monday – Friday: 7:00am – 6:00pm<br />Saturday: 8:00am – 2:00pm<br />Emergencies: Always</div>
                  </div>

                  <div>
                    <div className="font-semibold text-[var(--brand-navy)] mb-1.5">Service Area</div>
                    <div className="text-muted-foreground leading-relaxed">
                      Fresno, Clovis, Madera, Sanger, Selma, Reedley, Kingsburg, Kerman, Hanford, Visalia and all surrounding communities within ~35 miles.
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button
                    onClick={() => openQuote()}
                    className="w-full md:w-auto h-12 px-9 bg-[var(--brand-navy)] hover:bg-[var(--brand-navy-light)] text-white font-semibold"
                  >
                    Request Your Free Quote Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: form + map */}
            <div className="lg:col-span-7">
              <div className="mb-4">
                <h3 className="font-semibold text-xl tracking-tight text-[var(--brand-navy)]">Request a Quote</h3>
                <p className="text-muted-foreground">Fill out the form below and we’ll contact you shortly.</p>
              </div>

              <div className="premium-card p-7 md:p-8 mb-8">
                <QuoteForm variant="full" />
              </div>

              {/* Google Map – Fresno / Central Valley service area */}
              <div>
                <div className="text-sm font-medium mb-2.5 text-[var(--brand-navy)]">Our Service Territory</div>
                <div className="relative h-[220px] md:h-[280px] w-full rounded-2xl border bg-muted overflow-hidden shadow-sm">
                  <iframe
                    title="Spawn Crest service area — Fresno and Central Valley"
                    src="https://www.google.com/maps?q=Fresno,+California&hl=en&z=10&output=embed"
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Based in Fresno — serving Clovis, Madera, Sanger, Selma, Reedley, Kingsburg, Kerman, Hanford, Visalia, and surrounding communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="bg-[var(--brand-navy)] py-14 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-[-1.2px] mb-3">Plumbing problems don&apos;t wait.<br className="hidden sm:block" /> Neither do we.</h3>
          <p className="text-white/70 mb-7">Get your free, no-obligation quote today.</p>
          <Button
            onClick={() => openQuote()}
            size="lg"
            className="h-12 px-9 bg-white text-[var(--brand-navy)] font-semibold hover:bg-white/90"
          >
            Get My Free Quote
          </Button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[var(--brand-navy)] text-white/80 border-t border-white/10 pt-12 pb-9 text-sm">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-12 gap-y-10">
          <div className="col-span-2 md:col-span-5">
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-white/60 leading-relaxed">
              Premium plumbing solutions for the homes and families of the Central Valley. Founded 2026.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="font-semibold text-white mb-3 tracking-wide text-xs">COMPANY</div>
            <ul className="space-y-[7px]">
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              <li><a href="#why-us" className="hover:text-white transition">Why Choose Us</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Our Work</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="font-semibold text-white mb-3 tracking-wide text-xs">SERVICES</div>
            <ul className="space-y-[7px]">
              {services.slice(0, 5).map((s, i) => (
                <li key={i}><a href="#services" className="hover:text-white transition">{s.title}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <div className="font-semibold text-white mb-3 tracking-wide text-xs">CONTACT</div>
            <div className="space-y-1.5">
              <a href="tel:+15595732269" className="block hover:text-white transition">(559) 573-2269</a>
              <a href="mailto:admin@spawncrest.com" className="block hover:text-white transition">admin@spawncrest.com</a>
              <div className="pt-1">Fresno, California</div>
              <div className="text-[11px] text-white/50 pt-3">Licensed • Bonded • Insured<br />California C-36 Plumbing License #1156533</div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 mt-14 pt-6 border-t border-white/10 text-[11px] text-white/40 flex flex-col md:flex-row gap-y-1 md:items-center justify-between">
          <div>© {new Date().getFullYear()} Spawn Crest Plumbing Corporation. All rights reserved.</div>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Licensing</span>
          </div>
        </div>
      </footer>

      {/* Quote Modal */}
      <QuoteDialog 
        open={quoteDialog.open} 
        onOpenChange={(open) => setQuoteDialog({ open, initialService: open ? quoteDialog.initialService : undefined })} 
        initialService={quoteDialog.initialService}
      />
    </div>
  );
}
