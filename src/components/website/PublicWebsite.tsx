'use client';

import dynamic from 'next/dynamic';
import { Hero } from './Hero';
import { Services } from './Services';
import { SectionDivider } from './SectionDivider';

/* ── Below-the-fold sections — lazy loaded to reduce memory pressure ── */
const PricingCalculator = dynamic(() => import('./PricingCalculator').then(m => ({ default: m.PricingCalculator })));
const LeadMagnetSection = dynamic(() => import('./LeadMagnetSection').then(m => ({ default: m.LeadMagnetSection })));
const WhyChooseUs = dynamic(() => import('./WhyChooseUs').then(m => ({ default: m.WhyChooseUs })));
const ROICalculator = dynamic(() => import('./ROICalculator').then(m => ({ default: m.ROICalculator })));
const VideoTestimonials = dynamic(() => import('./VideoTestimonials').then(m => ({ default: m.VideoTestimonials })));
const BrandsSection = dynamic(() => import('./BrandsSection').then(m => ({ default: m.BrandsSection })));
const TeamSection = dynamic(() => import('./TeamSection').then(m => ({ default: m.TeamSection })));
const EnhancedTeam = dynamic(() => import('./EnhancedTeam').then(m => ({ default: m.EnhancedTeam })));
const BeforeAfter = dynamic(() => import('./BeforeAfter').then(m => ({ default: m.BeforeAfter })));
const Gallery = dynamic(() => import('./Gallery').then(m => ({ default: m.Gallery })));
const ColorPaletteExplorer = dynamic(() => import('./ColorPaletteExplorer').then(m => ({ default: m.ColorPaletteExplorer })));
const InteractiveShowcase = dynamic(() => import('./InteractiveShowcase').then(m => ({ default: m.InteractiveShowcase })));
const Process = dynamic(() => import('./Process').then(m => ({ default: m.Process })));
const ExpressService = dynamic(() => import('./ExpressService').then(m => ({ default: m.ExpressService })));
const ProjectJourney = dynamic(() => import('./ProjectJourney').then(m => ({ default: m.ProjectJourney })));
const Testimonials = dynamic(() => import('./Testimonials').then(m => ({ default: m.Testimonials })));
const GuaranteeSection = dynamic(() => import('./GuaranteeSection').then(m => ({ default: m.GuaranteeSection })));
const ReviewsShowcase = dynamic(() => import('./ReviewsShowcase').then(m => ({ default: m.ReviewsShowcase })));
const FAQ = dynamic(() => import('./FAQ').then(m => ({ default: m.FAQ })));
const SeasonalTips = dynamic(() => import('./SeasonalTips').then(m => ({ default: m.SeasonalTips })));
const MaintenanceTips = dynamic(() => import('./MaintenanceTips').then(m => ({ default: m.MaintenanceTips })));
const CommercialShowcase = dynamic(() => import('./CommercialShowcase').then(m => ({ default: m.CommercialShowcase })));
const NeighborhoodSpotlight = dynamic(() => import('./NeighborhoodSpotlight').then(m => ({ default: m.NeighborhoodSpotlight })));
const BeforeAfterSlider = dynamic(() => import('./BeforeAfterSlider').then(m => ({ default: m.BeforeAfterSlider })));
const ServiceAreas = dynamic(() => import('./ServiceAreas').then(m => ({ default: m.ServiceAreas })));
const WeatherWidget = dynamic(() => import('./WeatherWidget').then(m => ({ default: m.WeatherWidget })));
const ContactSection = dynamic(() => import('./ContactSection').then(m => ({ default: m.ContactSection })));
const StatsBar = dynamic(() => import('./StatsBar').then(m => ({ default: m.StatsBar })));

/**
 * Main website content sections.
 * Layout (PublicLayout) handles Navbar, Footer, FloatingCTA, etc.
 *
 * Hero and Services are eagerly loaded (above the fold).
 * Everything else is dynamically imported to keep memory usage manageable.
 */
export function PublicWebsite() {
  return (
    <>
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
    </>
  );
}
