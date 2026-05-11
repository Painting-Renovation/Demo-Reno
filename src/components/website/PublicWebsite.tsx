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
import { PortfolioShowcase } from './PortfolioShowcase';
import { Process } from './Process';
import { Testimonials } from './Testimonials';
import { FAQ } from './FAQ';
import { ServiceAreas } from './ServiceAreas';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { EstimateForm } from './EstimateForm';
import { AppointmentForm } from './AppointmentForm';
import { FloatingCTA } from './FloatingCTA';
import { LiveChatWidget } from './LiveChatWidget';
import { CookieConsent } from './CookieConsent';
import { BackToTop } from './BackToTop';

export function PublicWebsite() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PromotionsBanner />

      <main>
        <Hero />

        <div className="section-divider" />

        <Services />

        <div className="section-divider" />

        <WhyChooseUs />

        <BrandsSection />

        <div className="section-divider" />

        <TeamSection />

        <div className="section-divider" />

        <BeforeAfter />

        <div className="section-divider" />

        <Gallery />

        <div className="section-divider" />

        <PortfolioShowcase />

        <div className="section-divider" />

        <Process />

        <div className="section-divider" />

        <Testimonials />

        <div className="section-divider" />

        <FAQ />

        <div className="section-divider" />

        <ServiceAreas />

        <div className="section-divider" />

        <ContactSection />
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
