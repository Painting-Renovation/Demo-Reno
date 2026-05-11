'use client';

import { PaintBucket, Phone, Mail, MapPin, ArrowUp, Facebook, Instagram, ChevronRight, Heart } from 'lucide-react';
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
  { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-400/30' },
  { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:bg-pink-600/20 hover:text-pink-400 hover:border-pink-400/30' },
  { icon: PaintBucket, label: 'Houzz', href: '#', color: 'hover:bg-emerald-600/20 hover:text-emerald-400 hover:border-emerald-400/30' },
  { icon: ChevronRight, label: 'Pinterest', href: '#', color: 'hover:bg-red-600/20 hover:text-red-400 hover:border-red-400/30' },
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
    <footer className="bg-navy text-white relative">
      {/* Animated gradient top border */}
      <div className="footer-gradient-border" />

      {/* Get Your Free Estimate Banner CTA */}
      <div className="bg-gradient-to-r from-gold via-gold-light to-gold relative overflow-hidden">
        <div className="absolute inset-0 shimmer-bg" />
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
                className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 cta-button-enhanced"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-6 group" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
              <div className="relative w-11 h-11 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="ProCoat Painters"
                  className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-105"
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
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Toronto&apos;s trusted painting professionals since 2009. Licensed, insured,
              and committed to delivering exceptional results for every project.
            </p>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-sage rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white/60">Licensed &amp; Insured</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white/60">5-Star Rated</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-2.5 mt-7">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 transition-all duration-300 social-icon-hover ${social.color}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-semibold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              <div className="w-6 h-px bg-gold/40" />
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
                    className="footer-link-lift text-white/50 hover:text-white text-sm transition-colors duration-200"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              <div className="w-6 h-px bg-gold/40" />
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
                    className="footer-link-lift text-white/50 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-semibold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              <div className="w-6 h-px bg-gold/40" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-gold" />
                </div>
                <div>
                  <a href="tel:4165557246" className="footer-link-lift text-white/60 hover:text-white text-sm">
                    (416) 555-PAINT
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                </div>
                <a href="mailto:info@procoatpainters.ca" className="footer-link-lift text-white/60 hover:text-white text-sm mt-1 inline-block">
                  info@procoatpainters.ca
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="text-white/50 text-sm leading-relaxed mt-1">
                  123 Painting Lane, Suite 200<br />
                  Toronto, ON M4B 1B3
                </span>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="mt-6 pt-5 border-t border-white/8">
              <p className="text-xs font-semibold text-gold mb-2.5 tracking-wide uppercase">Business Hours</p>
              <div className="space-y-1.5">
                <p className="text-white/40 text-xs flex justify-between">
                  <span>Mon-Fri</span>
                  <span className="text-white/60">8:00 AM - 6:00 PM</span>
                </p>
                <p className="text-white/40 text-xs flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white/60">9:00 AM - 3:00 PM</span>
                </p>
                <p className="text-white/40 text-xs flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white/50">Closed</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs text-center sm:text-left flex items-center gap-1.5">
              © {new Date().getFullYear()} ProCoat Painters. All rights reserved.
              <span className="hidden sm:inline">Licensed &amp; Insured in Ontario.</span>
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="footer-link-lift text-white/30 hover:text-white/60 text-xs">
                Privacy Policy
              </a>
              <a href="#" className="footer-link-lift text-white/30 hover:text-white/60 text-xs">
                Terms of Service
              </a>
              <span
                onClick={() => setView('dashboard')}
                onContextMenu={(e) => { e.preventDefault(); setView('dashboard'); }}
                className="text-white/15 hover:text-white/40 text-[8px] cursor-pointer select-none transition-colors"
                title=""
              >
                ●
              </span>
              <button
                onClick={scrollToTop}
                className="w-9 h-9 bg-white/5 hover:bg-gold/15 border border-white/8 hover:border-gold/25 rounded-full flex items-center justify-center text-white/30 hover:text-gold transition-all duration-300 social-icon-hover"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Made with love */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-white/15 text-[10px] text-center flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-gold/40 fill-gold/40" /> in Toronto, Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
