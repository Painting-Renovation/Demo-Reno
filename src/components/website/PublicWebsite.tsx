'use client';

import { Navbar } from './Navbar';
import { PromotionsBanner } from './PromotionsBanner';
import { Hero } from './Hero';
import { Services } from './Services';
import { WhyChooseUs } from './WhyChooseUs';
import { BrandsSection } from './BrandsSection';
import { TeamSection } from './TeamSection';
import { BeforeAfter } from './BeforeAfter';
import { Gallery } from './Gallery';
import { ColorPaletteExplorer } from './ColorPaletteExplorer';
import { PortfolioShowcase } from './PortfolioShowcase';
import { Process } from './Process';
import { Testimonials } from './Testimonials';
import { FAQ } from './FAQ';
import { ServiceAreas } from './ServiceAreas';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { EstimateForm } from './EstimateForm';
import { AppointmentForm } from './AppointmentForm';
import { PricingCalculator } from './PricingCalculator';
import { ReviewsShowcase } from './ReviewsShowcase';
import { SeasonalTips } from './SeasonalTips';
import { WeatherWidget } from './WeatherWidget';
import { FloatingCTA } from './FloatingCTA';
import { LiveChatWidget } from './LiveChatWidget';
import { CookieConsent } from './CookieConsent';
import { BackToTop } from './BackToTop';
import { SectionDivider } from './SectionDivider';
import { StatsBar } from './StatsBar';

export function PublicWebsite() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PromotionsBanner />

      <main>
        <Hero />
        <SectionDivider variant="dark" />

        <Services />
        <SectionDivider variant="light" />

        <PricingCalculator />
        <SectionDivider variant="dark" />

        <WhyChooseUs />

        <BrandsSection />
        <SectionDivider variant="light" />

        <TeamSection />
        <SectionDivider variant="dark" />

        <BeforeAfter />
        <SectionDivider variant="dark" />

        <Gallery />
        <SectionDivider variant="dark" />

        <ColorPaletteExplorer />
        <SectionDivider variant="light" />

        <PortfolioShowcase />
        <SectionDivider variant="dark" />

        <Process />
        <SectionDivider variant="light" />

        <Testimonials />
        <SectionDivider variant="dark" />

        <ReviewsShowcase />
        <SectionDivider variant="light" />

        <FAQ />
        <SectionDivider variant="light" />

        <SeasonalTips />
        <SectionDivider variant="dark" />

        <ServiceAreas />
        <WeatherWidget />
        <SectionDivider variant="dark" />

        <ContactSection />

        <StatsBar />
      </main>

      <Footer />

      {/* Modal Forms */}
      <EstimateForm />
      <AppointmentForm />

      {/* Floating UI Elements */}
      <FloatingCTA />
      <LiveChatWidget />
      <BackToTop />
      <CookieConsent />
    </div>
  );
}
