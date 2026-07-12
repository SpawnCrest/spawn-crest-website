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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://spawn-crest-website.vercel.app");

const siteTitle = "Spawn Crest Plumbing | Fresno & Central Valley Plumbers";
const siteDescription =
  "Spawn Crest is a licensed plumbing company in Fresno, CA. We provide 24/7 emergency plumbing, drain cleaning, water heater install & repair, leak detection, pipe repair, and fixture installation for homes across Fresno, Clovis, and the Central Valley. CA C-36 License #1156533.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Spawn Crest Plumbing",
  },
  description: siteDescription,
  applicationName: "Spawn Crest Plumbing",
  keywords: [
    "Spawn Crest",
    "Spawn Crest Plumbing",
    "plumber Fresno",
    "plumbing Fresno CA",
    "emergency plumber Fresno",
    "drain cleaning Fresno",
    "water heater installation",
    "leak detection",
    "pipe repair",
    "repipe",
    "Clovis plumber",
    "Central Valley plumber",
    "licensed plumber C-36",
  ],
  authors: [{ name: "Spawn Crest Plumbing" }],
  creator: "Spawn Crest Plumbing",
  publisher: "Spawn Crest Plumbing",
  category: "home services",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
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
        alt: "Spawn Crest Plumbing — Premium plumbing services in Fresno and the Central Valley",
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
    canonical: "/",
  },
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
