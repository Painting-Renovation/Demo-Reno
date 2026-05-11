'use client';

import { PaintBucket, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
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

export function Footer() {
  const { setView } = useAppStore();
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
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
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
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Toronto&apos;s trusted painting professionals since 2009. Licensed, insured,
              and committed to delivering exceptional results for every project.
            </p>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5">
              <div className="w-2 h-2 bg-sage rounded-full" />
              <span className="text-xs font-medium text-white/70">Licensed &amp; Insured</span>
              <div className="w-2 h-2 bg-gold rounded-full ml-2" />
              <span className="text-xs font-medium text-white/70">5-Star Rated</span>
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
                    className="text-white/60 hover:text-gold text-sm transition-colors"
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
                    className="text-white/60 hover:text-gold text-sm transition-colors"
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
                  <a href="tel:4165557246" className="text-white/60 hover:text-gold text-sm transition-colors">
                    (416) 555-PAINT
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <a href="mailto:info@procoatpainters.ca" className="text-white/60 hover:text-gold text-sm transition-colors">
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
              <p className="text-xs font-medium text-gold mb-2">Business Hours</p>
              <p className="text-white/50 text-xs">Mon-Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-white/50 text-xs">Sat: 9:00 AM - 3:00 PM</p>
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
              <a href="#" className="text-white/40 hover:text-gold text-xs transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 hover:text-gold text-xs transition-colors">
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
                className="w-8 h-8 bg-white/5 hover:bg-gold/20 rounded-full flex items-center justify-center text-white/40 hover:text-gold transition-all"
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
