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

export const metadata: Metadata = {
  title: "Spawn Crest | Premium Plumbing Solutions",
  description: "Expert plumbing services for homes and businesses in Fresno, CA. 24/7 emergency plumbing, drain cleaning, leak detection, water heater installation, and more. Licensed, insured, and newly founded in 2026. Serving Fresno, Clovis and the Central Valley.",
  keywords: [
    "plumbing",
    "plumber",
    "emergency plumbing",
    "drain cleaning",
    "water heater",
    "leak detection",
    "pipe repair",
    "Spawn Crest",
    "Fresno plumber",
    "Clovis plumber",
  ],
  authors: [{ name: "Spawn Crest" }],
  openGraph: {
    title: "Spawn Crest | Premium Plumbing Solutions",
    description: "Professional plumbing services in Fresno, CA. 24/7 emergency response. Licensed C-36 #1156533 & insured.",
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
