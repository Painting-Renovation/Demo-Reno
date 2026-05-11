'use client';

import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Services } from './Services';
import { Gallery } from './Gallery';
import { Process } from './Process';
import { Testimonials } from './Testimonials';
import { ServiceAreas } from './ServiceAreas';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { EstimateForm } from './EstimateForm';
import { AppointmentForm } from './AppointmentForm';

export function PublicWebsite() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />

        <div className="section-divider" />

        <Services />

        <div className="section-divider" />

        <Gallery />

        <div className="section-divider" />

        <Process />

        <div className="section-divider" />

        <Testimonials />

        <div className="section-divider" />

        <ServiceAreas />

        <div className="section-divider" />

        <ContactSection />
      </main>

      <Footer />

      {/* Modal Forms */}
      <EstimateForm />
      <AppointmentForm />
    </div>
  );
}
