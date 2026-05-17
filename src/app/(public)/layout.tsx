'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/website/Navbar';
import { PromotionsBanner } from '@/components/website/PromotionsBanner';
import { Footer } from '@/components/website/Footer';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

/* ── Lazy-loaded non-critical components ── */
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

/**
 * Spacer that dynamically measures the combined height of
 * the fixed promo banner + navbar and creates matching space
 * so content is never hidden behind them.
 */
function FixedHeaderSpacer() {
  const { promoBannerHeight } = useAppStore();
  const [navHeight, setNavHeight] = useState(68);

  useEffect(() => {
    const navEl = document.querySelector('nav');
    if (navEl) {
      const update = () => setNavHeight(navEl.offsetHeight);
      update();
      const observer = new ResizeObserver(update);
      observer.observe(navEl);
      return () => observer.disconnect();
    }
  }, []);

  const totalHeight = promoBannerHeight + navHeight;

  return (
    <div
      className="w-full flex-shrink-0 transition-[height] duration-500"
      style={{ height: totalHeight }}
      aria-hidden="true"
    />
  );
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PromotionsBanner />
      <Navbar />
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
