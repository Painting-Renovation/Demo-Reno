'use client';

import dynamic from 'next/dynamic';

/* ── Below-fold heavy sections — client-only, loaded lazily ── */
const Hero = dynamic(
  () => import('@/components/website/Hero').then((m) => ({ default: m.Hero })),
  { ssr: false }
);
const Services = dynamic(
  () => import('@/components/website/Services').then((m) => ({ default: m.Services })),
  { ssr: false }
);
const WhyChooseUs = dynamic(
  () => import('@/components/website/WhyChooseUs').then((m) => ({ default: m.WhyChooseUs })),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import('@/components/website/Testimonials').then((m) => ({ default: m.Testimonials })),
  { ssr: false }
);
const BrandsSection = dynamic(
  () => import('@/components/website/BrandsSection').then((m) => ({ default: m.BrandsSection })),
  { ssr: false }
);
const StatsBar = dynamic(
  () => import('@/components/website/StatsBar').then((m) => ({ default: m.StatsBar })),
  { ssr: false }
);
const LeadMagnetSection = dynamic(
  () => import('@/components/website/LeadMagnetSection').then((m) => ({ default: m.LeadMagnetSection })),
  { ssr: false }
);

/**
 * Client component wrapper for heavy website sections.
 * These use ssr: false to avoid SSR errors from browser APIs,
 * and to keep the initial server-rendered HTML payload small.
 */
export function ClientSections() {
  return (
    <>
      <Hero />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <BrandsSection />
      <StatsBar />
      <LeadMagnetSection />
    </>
  );
}
