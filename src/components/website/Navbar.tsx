'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PaintBucket, Phone, Menu, X, Sparkles, Facebook, Instagram, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const navLinks = [
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: 'Interior Painting', href: '/services/interior-painting' },
      { label: 'Exterior Painting', href: '/services/exterior-painting' },
      { label: 'Cabinet Refinishing', href: '/services/cabinet-refinishing' },
      { label: 'Commercial Painting', href: '/services/commercial-painting' },
      { label: 'Deck & Fence Staining', href: '/services/deck-fence' },
      { label: 'Color Consultation', href: '/services/color-consultation' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Process', href: '/process' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const { setEstimateFormOpen, setMobileMenuOpen, mobileMenuOpen, promoBannerHeight } = useAppStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Reset dropdown on route change (deferred to avoid setState-in-effect)
  useEffect(() => {
    // Dropdown is hover-based, but we ensure it resets on navigation
    return () => { setDropdownOpen(null); };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/services') {
      return pathname === '/services' || pathname.startsWith('/services/');
    }
    return pathname === href;
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setDropdownOpen(label);
  };

  const handleDropdownLeave = () => {
    setDropdownTimeout(setTimeout(() => setDropdownOpen(null), 150));
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ top: promoBannerHeight }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-navy/97 backdrop-blur-2xl shadow-lg nav-scrolled-border'
            : 'bg-navy/80 backdrop-blur-md'
        }`}
      >
        {/* Gold accent line at very top - with shimmer */}
        <div className="h-1 animate-shimmer-line" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="relative w-10 h-10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
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
              </motion.div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-xl leading-tight tracking-tight">
                  ProCoat
                </span>
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                  Painters
                </span>
              </div>
            </Link>

            {/* Rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="hidden md:flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-1 border border-white/10"
            >
              <svg className="w-3 h-3 fill-gold text-gold" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white/70 text-[11px] font-semibold">4.9</span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const hasDropdown = !!link.dropdown;

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => hasDropdown && handleDropdownEnter(link.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-all duration-300 relative group flex items-center gap-1 ${
                        active
                          ? 'text-gold font-semibold nav-active-gradient'
                          : 'text-white/80 hover:text-gold'
                      }`}
                    >
                      {link.label}
                      {hasDropdown && (
                        <motion.span
                          animate={{ rotate: dropdownOpen === link.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-gold transition-colors" />
                        </motion.span>
                      )}
                      {!active && (
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold/60 transition-all duration-300 ${
                          !hasDropdown ? 'w-0 group-hover:w-full' : 'w-0'
                        }`} />
                      )}
                    </Link>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {hasDropdown && dropdownOpen === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-full -left-4 mt-3 w-56 py-2 bg-navy/98 backdrop-blur-2xl rounded-xl border border-white/10 shadow-xl shadow-black/20 overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                          <Link
                            href="/services"
                            onClick={() => setDropdownOpen(null)}
                            className="block w-full text-left px-4 py-2.5 text-sm text-gold hover:bg-white/5 transition-all duration-200 font-medium"
                          >
                            All Services
                          </Link>
                          <div className="h-px bg-white/5 my-1" />
                          {link.dropdown!.map((item, i) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setDropdownOpen(null)}
                                className={`block w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-2 ${
                                  pathname === item.href
                                    ? 'text-gold bg-white/5 font-medium'
                                    : 'text-white/70 hover:text-gold hover:bg-white/5'
                                }`}
                              >
                                <div className="w-1 h-1 rounded-full bg-gold/40" />
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+14375350494"
                className="hidden md:flex items-center gap-2 text-white/90 hover:text-gold transition-colors text-sm font-medium group"
              >
                <Phone className="w-4 h-4" />
                <span>(437) 535-0494</span>
                <span className="ml-1 inline-flex items-center gap-1 bg-gold/15 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold/20 uppercase tracking-wider group-hover:bg-gold/25 transition-colors">
                  <Sparkles className="w-2.5 h-2.5" />
                  Free
                </span>
              </a>
              <div className="relative hidden sm:block">
                <Button
                  onClick={() => setEstimateFormOpen(true)}
                  className="bg-gold hover:bg-gold-light text-white font-semibold px-4 sm:px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg cta-button-enhanced animate-pulse-glow-enhanced min-h-[44px]"
                  size="sm"
                >
                  <span className="hidden sm:inline">Get Free Estimate</span>
                  <span className="sm:hidden">Estimate</span>
                </Button>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-navy animate-pulse" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white p-2.5 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-navy shadow-2xl overflow-y-auto"
            >
              <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-gold animate-shimmer-line" />

              <div className="pt-24 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col h-full">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + index * 0.06, duration: 0.35, ease: 'easeOut' }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block text-left px-4 py-3.5 rounded-xl text-base transition-all duration-200 ${
                            active
                              ? 'text-gold bg-gold/10 font-semibold border-l-2 border-gold'
                              : 'text-white/80 hover:text-gold hover:bg-white/5 font-medium'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Extra mobile nav links */}
                  {[
                    { label: 'Pricing', href: '/pricing' },
                    { label: 'Free Estimate', href: '/free-estimate' },
                    { label: 'FAQ', href: '/faq' },
                    { label: 'About', href: '/about' },
                  ].map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.35, ease: 'easeOut' }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                          pathname === link.href
                            ? 'text-gold bg-gold/10 font-semibold border-l-2 border-gold'
                            : 'text-white/60 hover:text-gold hover:bg-white/5 font-medium'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-4">
                  <a
                    href="tel:+14375350494"
                    className="flex items-center gap-3 text-white/80 hover:text-gold px-4 py-3 rounded-xl bg-white/5 transition-all group"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">(437) 535-0494</span>
                    <span className="ml-auto inline-flex items-center gap-1 bg-gold/15 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold/20 uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5" />
                      Free
                    </span>
                  </a>
                  <Link
                    href="/free-estimate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-gold hover:bg-gold-light text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg cta-button-enhanced text-center"
                  >
                    Get Free Estimate
                  </Link>

                  <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
                    <span className="text-white/20 text-xs tracking-wider uppercase">Follow us</span>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-blue-600/20 border border-white/8 hover:border-blue-400/30 rounded-xl flex items-center justify-center text-white/40 hover:text-blue-400 transition-all duration-300 social-icon-hover">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-pink-600/20 border border-white/8 hover:border-pink-400/30 rounded-xl flex items-center justify-center text-white/40 hover:text-pink-400 transition-all duration-300 social-icon-hover">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-red-600/20 border border-white/8 hover:border-red-400/30 rounded-xl flex items-center justify-center text-white/40 hover:text-red-400 transition-all duration-300 social-icon-hover text-xs font-bold">
                      G
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
