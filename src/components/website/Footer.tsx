'use client';

import { PaintBucket, Phone, Mail, MapPin, ArrowUp, Facebook, Instagram, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const services = [
  'Interior Painting',
  'Exterior Painting',
  'Cabinet Refinishing',
  'Commercial Painting',
  'Deck & Fence Staining',
  'Color Consultation',
];

const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Our Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Service Areas', href: '#service-areas' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: PaintBucket, label: 'Houzz', href: '#' },
  { icon: ChevronRight, label: 'Pinterest', href: '#' },
];

export function Footer() {
  const { setView, setEstimateFormOpen } = useAppStore();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy text-white">
      {/* Gold-to-Navy Gradient Line */}
      <div className="gold-navy-gradient-line" />

      {/* Get Your Free Estimate Banner CTA */}
      <div className="bg-gradient-to-r from-gold via-gold-light to-gold relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:200%_100%] animate-[shimmer_3s_infinite]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-navy mb-2">
                Get Your Free Estimate Today
              </h3>
              <p className="text-navy/80 text-sm md:text-base max-w-lg">
                No obligation, no pressure. Just honest pricing and expert advice for your painting project.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setEstimateFormOpen(true)}
                className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Request Free Estimate
              </Button>
              <a
                href="tel:4165557246"
                className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-navy font-semibold px-6 py-3.5 rounded-lg transition-all border border-navy/20"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-5" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="ProCoat Painters"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 items-center justify-center hidden">
                  <PaintBucket className="w-8 h-8 text-gold" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">ProCoat</span>
                <span className="text-gold text-xs font-medium tracking-widest uppercase">Painters</span>
              </div>
            </a>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Toronto&apos;s trusted painting professionals since 2009. Licensed, insured,
              and committed to delivering exceptional results for every project.
            </p>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5">
              <div className="w-2 h-2 bg-sage rounded-full" />
              <span className="text-xs font-medium text-white/70">Licensed &amp; Insured</span>
              <div className="w-2 h-2 bg-gold rounded-full ml-2" />
              <span className="text-xs font-medium text-white/70">5-Star Rated</span>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/30 rounded-xl flex items-center justify-center text-white/50 hover:text-gold transition-all duration-300 hover:-translate-y-0.5"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#services');
                    }}
                    className="footer-link-lift text-white/60 text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.href !== '#') {
                        handleNavClick(link.href);
                      } else {
                        scrollToTop();
                      }
                    }}
                    className="footer-link-lift text-white/60 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:4165557246" className="footer-link-lift text-white/60 text-sm">
                    (416) 555-PAINT
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <a href="mailto:info@procoatpainters.ca" className="footer-link-lift text-white/60 text-sm">
                  info@procoatpainters.ca
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  123 Painting Lane, Suite 200<br />
                  Toronto, ON M4B 1B3
                </span>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs font-medium text-gold mb-2.5">Business Hours</p>
              <p className="text-white/50 text-xs mb-1">Mon-Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-white/50 text-xs mb-1">Sat: 9:00 AM - 3:00 PM</p>
              <p className="text-white/50 text-xs">Sun: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} ProCoat Painters. All rights reserved. Licensed &amp;
              Insured in Ontario.
            </p>
            {/* Hidden owner access - triple click copyright text */}
            <div className="flex items-center gap-6">
              <a href="#" className="footer-link-lift text-white/40 text-xs">
                Privacy Policy
              </a>
              <a href="#" className="footer-link-lift text-white/40 text-xs">
                Terms of Service
              </a>
              <span
                onClick={() => setView('dashboard')}
                onContextMenu={(e) => { e.preventDefault(); setView('dashboard'); }}
                className="text-white/20 hover:text-white/40 text-[8px] cursor-pointer select-none transition-colors"
                title=""
              >
                ●
              </span>
              <button
                onClick={scrollToTop}
                className="w-9 h-9 bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/30 rounded-full flex items-center justify-center text-white/40 hover:text-gold transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
