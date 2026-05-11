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
import { InteractiveShowcase } from './InteractiveShowcase';
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
import { GuaranteeSection } from './GuaranteeSection';
import { ProjectJourney } from './ProjectJourney';
import { LeadMagnetSection } from './LeadMagnetSection';
import { ExitIntentPopup } from './ExitIntentPopup';
import { ROICalculator } from './ROICalculator';
import { VideoTestimonials } from './VideoTestimonials';
import { EnhancedTeam } from './EnhancedTeam';
import { ExpressService } from './ExpressService';
import { CommercialShowcase } from './CommercialShowcase';
import { MaintenanceTips } from './MaintenanceTips';
import { ChatBotPanel } from './ChatBotPanel';
import { NeighborhoodSpotlight } from './NeighborhoodSpotlight';
import { BeforeAfterSlider } from './BeforeAfterSlider';

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

        <LeadMagnetSection />
        <SectionDivider variant="light" />

        <WhyChooseUs />
        <SectionDivider variant="light" />

        <ROICalculator />
        <SectionDivider variant="dark" />

        <VideoTestimonials />
        <SectionDivider variant="light" />

        <BrandsSection />
        <SectionDivider variant="light" />

        <TeamSection />
        <SectionDivider variant="dark" />

        <EnhancedTeam />

        <BeforeAfter />
        <SectionDivider variant="dark" />

        <Gallery />
        <SectionDivider variant="dark" />

        <ColorPaletteExplorer />
        <SectionDivider variant="light" />

        <InteractiveShowcase />
        <SectionDivider variant="dark" />

        <Process />
        <SectionDivider variant="light" />

        <ExpressService />

        <ProjectJourney />
        <SectionDivider variant="light" />

        <Testimonials />
        <SectionDivider variant="dark" />

        <GuaranteeSection />
        <SectionDivider variant="dark" />

        <ReviewsShowcase />
        <SectionDivider variant="light" />

        <FAQ />
        <SectionDivider variant="light" />

        <SeasonalTips />
        <SectionDivider variant="dark" />

        <MaintenanceTips />
        <SectionDivider variant="light" />

        <CommercialShowcase />
        <SectionDivider variant="dark" />

        <NeighborhoodSpotlight />
        <SectionDivider variant="light" />

        <BeforeAfterSlider />
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
      <ChatBotPanel />
      <BackToTop />
      <CookieConsent />
      <ExitIntentPopup />
    </div>
  );
}
