'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaintBucket, Phone, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const { setEstimateFormOpen, setMobileMenuOpen, mobileMenuOpen } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);

    // Determine active section based on scroll position
    const sections = navLinks.map((link) => link.href.replace('#', ''));
    let current = '';
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = id;
        }
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    // Initialize on mount via event dispatch rather than direct setState in effect
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Use a microtask to avoid calling setState synchronously in effect
    const init = () => queueMicrotask(handleScroll);
    init();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-navy/97 backdrop-blur-lg shadow-lg nav-scrolled-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                <span className="text-white font-bold text-lg leading-tight tracking-tight">
                  ProCoat
                </span>
                <span className="text-gold text-xs font-medium tracking-widest uppercase">
                  Painters
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-gold font-semibold'
                      : 'text-white/80 hover:text-gold'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${
                    activeSection === link.href.replace('#', '') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <a
                href="tel:4165557246"
                className="hidden md:flex items-center gap-2 text-white/90 hover:text-gold transition-colors text-sm font-medium group"
              >
                <Phone className="w-4 h-4" />
                <span>(416) 555-PAINT</span>
                <span className="ml-1 inline-flex items-center gap-1 bg-gold/15 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold/20 uppercase tracking-wider group-hover:bg-gold/25 transition-colors">
                  <Sparkles className="w-2.5 h-2.5" />
                  Free
                </span>
              </a>
              <Button
                onClick={() => setEstimateFormOpen(true)}
                className="hidden sm:flex bg-gold hover:bg-gold-light text-white font-semibold px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg animate-pulse-glow"
                size="sm"
              >
                Get Free Estimate
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Slide from Right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-navy shadow-2xl"
            >
              {/* Decorative top bar */}
              <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />

              <div className="pt-24 px-6 pb-8 flex flex-col h-full">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.06, duration: 0.35, ease: 'easeOut' }}
                      onClick={() => handleNavClick(link.href)}
                      className={`text-left px-4 py-3.5 rounded-xl text-base transition-all duration-200 ${
                        activeSection === link.href.replace('#', '')
                          ? 'text-gold bg-gold/10 font-semibold'
                          : 'text-white/80 hover:text-gold hover:bg-white/5 font-medium'
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-4">
                  {/* Phone with badge */}
                  <a
                    href="tel:4165557246"
                    className="flex items-center gap-3 text-white/80 hover:text-gold px-4 py-3 rounded-xl bg-white/5 transition-all group"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">(416) 555-PAINT</span>
                    <span className="ml-auto inline-flex items-center gap-1 bg-gold/15 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold/20 uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5" />
                      Free
                    </span>
                  </a>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setEstimateFormOpen(true);
                    }}
                    className="w-full bg-gold hover:bg-gold-light text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg"
                  >
                    Get Free Estimate
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
