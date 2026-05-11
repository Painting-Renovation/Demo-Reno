import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProCoat Painters | Professional Painting Services in Toronto & GTA",
  description: "Toronto's trusted painting professionals. Premium interior & exterior painting, cabinet refinishing, commercial painting, deck & fence staining. Free estimates, licensed & insured. 4.9★ Google Rating.",
  keywords: ["painting contractor Toronto", "house painting Toronto", "interior painting", "exterior painting", "cabinet refinishing", "commercial painting", "painter Toronto", "GTA painting services", "ProCoat Painters", "free estimate painting"],
  authors: [{ name: "ProCoat Painters" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "ProCoat Painters | Toronto's Premier Painting Professionals",
    description: "Transform your space with professional painting services. 2000+ projects completed, 15+ years experience, 100% satisfaction guaranteed. Get a free estimate today!",
    siteName: "ProCoat Painters",
    type: "website",
    images: ["/images/hero-exterior.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProCoat Painters | Toronto's Premier Painting Professionals",
    description: "Transform your space with professional painting services. Get a free estimate today!",
    images: ["/images/hero-exterior.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
