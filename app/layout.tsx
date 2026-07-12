import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Canonical production site — used for absolute OG/icon URLs */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.spawncrest.com";

const siteTitle = "Spawn Crest Plumbing | Licensed Plumbers in Fresno, CA";
const siteDescription =
  "Spawn Crest Plumbing serves Fresno, Clovis, and the Central Valley with 24/7 emergency plumbing, drain cleaning, water heater repair & install, leak detection, pipe repair, and fixture installation. California C-36 License #1156533. Call (559) 573-2269.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Spawn Crest Plumbing",
  },
  description: siteDescription,
  applicationName: "Spawn Crest Plumbing",
  keywords: [
    "Spawn Crest Plumbing",
    "plumber Fresno",
    "plumbing Fresno CA",
    "emergency plumber Fresno",
    "24/7 plumber Fresno",
    "drain cleaning Fresno",
    "water heater installation Fresno",
    "leak detection Fresno",
    "pipe repair Fresno",
    "Clovis plumber",
    "Central Valley plumber",
    "C-36 licensed plumber",
  ],
  authors: [{ name: "Spawn Crest Plumbing" }],
  creator: "Spawn Crest Plumbing",
  publisher: "Spawn Crest Plumbing",
  category: "home services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Explicit icons so Google/browsers stop using Vercel defaults
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Spawn Crest Plumbing",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spawn Crest Plumbing — licensed plumbers in Fresno and the Central Valley",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: "Spawn Crest Plumbing",
  alternateName: "Spawn Crest",
  url: siteUrl,
  logo: `${siteUrl}/icon-512.png`,
  image: `${siteUrl}/og-image.jpg`,
  description: siteDescription,
  telephone: "+1-559-573-2269",
  email: "admin@spawncrest.com",
  foundingDate: "2026",
  areaServed: [
    "Fresno, CA",
    "Clovis, CA",
    "Madera, CA",
    "Sanger, CA",
    "Selma, CA",
    "Reedley, CA",
    "Kingsburg, CA",
    "Kerman, CA",
    "Hanford, CA",
    "Visalia, CA",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Fresno",
    addressRegion: "CA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.7378,
    longitude: -119.7871,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
  priceRange: "$$",
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "license",
    name: "California C-36 Plumbing License #1156533",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#0A1629" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
