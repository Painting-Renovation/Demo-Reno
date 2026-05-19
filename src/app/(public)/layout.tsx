'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/website/Navbar';
import { PromotionsBanner } from '@/components/website/PromotionsBanner';
import { Footer } from '@/components/website/Footer';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

/* ── Lazy-loaded non-critical components ── */
const FixedHeaderSpacer = dynamic(
  () => import('@/components/website/FixedHeaderSpacer').then((m) => ({ default: m.FixedHeaderSpacer })),
  { ssr: false }
);
const FloatingCTA = dynamic(
  () => import('@/components/website/FloatingCTA').then((m) => ({ default: m.FloatingCTA })),
  { ssr: false }
);
const ChatBotPanel = dynamic(
  () => import('@/components/website/ChatBotPanel').then((m) => ({ default: m.ChatBotPanel })),
  { ssr: false }
);
const BackToTop = dynamic(
  () => import('@/components/website/BackToTop').then((m) => ({ default: m.BackToTop })),
  { ssr: false }
);
const CookieConsent = dynamic(
  () => import('@/components/website/CookieConsent').then((m) => ({ default: m.CookieConsent })),
  { ssr: false }
);
const ExitIntentPopup = dynamic(
  () => import('@/components/website/ExitIntentPopup').then((m) => ({ default: m.ExitIntentPopup })),
  { ssr: false }
);
const EstimateForm = dynamic(
  () => import('@/components/website/EstimateForm').then((m) => ({ default: m.EstimateForm })),
  { ssr: false }
);
const AppointmentForm = dynamic(
  () => import('@/components/website/AppointmentForm').then((m) => ({ default: m.AppointmentForm })),
  { ssr: false }
);

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PromotionsBanner />
      <Navbar />
      {/* Static fallback spacer — client component updates height after mount */}
      <div className="w-full flex-shrink-0" style={{ height: 68 }} aria-hidden="true" />
      <FixedHeaderSpacer />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Global floating UI elements — lazy loaded */}
      <FloatingCTA />
      <ChatBotPanel />
      <BackToTop />
      <CookieConsent />
      <ExitIntentPopup />

      {/* Modal forms — still available from any page via CTAs */}
      <EstimateForm />
      <AppointmentForm />
    </div>
  );
}
