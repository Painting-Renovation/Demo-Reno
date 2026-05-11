'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const DISMISS_KEY = 'procoat-promo-dismissed';

export function PromotionsBanner() {
  const { setEstimateFormOpen } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = new Date(dismissed).getTime();
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (now - dismissedAt < twentyFourHours) {
        return;
      }
    }
    // Show banner after a short delay for a smoother experience
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    const el = document.querySelector('#services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-40 overflow-hidden"
        >
          {/* Gradient background with subtle pattern */}
          <div className="relative bg-gradient-to-r from-navy via-navy-light to-navy">
            {/* Subtle diagonal pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(200, 151, 62, 0.5) 10px,
                  rgba(200, 151, 62, 0.5) 11px
                )`,
              }}
            />

            {/* Bottom gold accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                {/* Content */}
                <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left">
                  <Sparkles className="w-5 h-5 text-gold flex-shrink-0 animate-float" />
                  <p className="text-white text-sm sm:text-base font-medium">
                    <span className="text-gold font-bold">Spring Special:</span> 15% Off All Interior Painting Projects!
                    <span className="hidden sm:inline text-white/70 ml-1">Limited Time Offer.</span>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    onClick={() => setEstimateFormOpen(true)}
                    size="sm"
                    className="bg-gold hover:bg-gold-light text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg animate-pulse-glow"
                  >
                    Get Free Estimate
                  </Button>
                  <Button
                    onClick={handleLearnMore}
                    variant="outline"
                    size="sm"
                    className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold-light font-medium px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1 cursor-pointer"
            aria-label="Dismiss promotion"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
