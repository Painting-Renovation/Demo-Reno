'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, Users, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const DISMISS_KEY = 'procoat-promo-dismissed';

// Default offer end date 14 days from now
function getDefaultOfferEnd(): Date {
  const end = new Date();
  end.setDate(end.getDate() + 14);
  return end;
}

function calcTimeLeft(targetDate: Date) {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;
  if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

function useCountdown(targetDate: Date) {
  // Use static initial state to avoid hydration mismatch (Date differs on server vs client)
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Defer first tick to next frame to avoid set-state-in-effect lint rule & hydration mismatch
    const raf = requestAnimationFrame(() => setTimeLeft(calcTimeLeft(targetDate)));
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => { cancelAnimationFrame(raf); clearInterval(timer); };
  }, [targetDate]);

  return timeLeft;
}

function PaintBrushSVG({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 120"
      className={className}
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      {/* Brush handle */}
      <rect x="16" y="0" width="8" height="50" rx="2" fill="rgba(200,151,62,0.3)" />
      {/* Ferrule */}
      <rect x="14" y="45" width="12" height="12" rx="1" fill="rgba(200,151,62,0.4)" />
      {/* Bristles */}
      <path d="M12 57 Q12 80 14 100 Q16 115 20 118 Q24 115 26 100 Q28 80 28 57 Z" fill="rgba(200,151,62,0.2)" />
      <path d="M14 57 Q14 78 16 98 Q18 112 20 115 Q22 112 24 98 Q26 78 26 57 Z" fill="rgba(200,151,62,0.3)" />
      {/* Paint drip */}
      <circle cx="20" cy="118" r="4" fill="rgba(200,151,62,0.25)" />
    </svg>
  );
}

export function PromotionsBanner() {
  const { setEstimateFormOpen } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  // Use static initial date to avoid hydration mismatch — will be updated in useEffect
  const [offerEndDate, setOfferEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(23, 59, 59, 0); // Round to end of day to minimize server/client drift
    return d;
  });
  const countdown = useCountdown(offerEndDate);

  // Load or initialize offer end date from localStorage on mount
  useEffect(() => {
    // Use setTimeout(0) to defer setState out of the synchronous effect body
    const initTimer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('procoat-promo-end');
        if (stored) {
          const d = new Date(stored);
          if (d > new Date()) {
            setOfferEndDate(d);
            return;
          }
        }
        const end = getDefaultOfferEnd();
        localStorage.setItem('procoat-promo-end', end.toISOString());
        setOfferEndDate(end);
      } catch {
        // localStorage unavailable
      }
    }, 0);
    return () => clearTimeout(initTimer);
  }, []);

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
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      localStorage.setItem(DISMISS_KEY, new Date().toISOString());
      setIsVisible(false);
      setIsDismissing(false);
    }, 400);
  };

  const handleLearnMore = () => {
    const el = document.querySelector('#services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0, scale: isDismissing ? 0.98 : 1 }}
          transition={{ duration: isDismissing ? 0.4 : 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-40 overflow-hidden"
        >
          <div className="relative bg-gradient-to-r from-navy via-navy-light to-navy">
            {/* Shimmer animation overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(200,151,62,0.06), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              />
            </div>

            {/* Diagonal pattern overlay */}
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

            {/* Decorative paint brush SVGs */}
            <PaintBrushSVG className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-14 sm:w-6 sm:h-20 opacity-40 hidden sm:block" />
            <PaintBrushSVG className="absolute right-14 sm:right-20 top-1/2 -translate-y-1/2 w-5 h-14 sm:w-6 sm:h-20 opacity-30 hidden sm:block" flip />

            {/* Bottom gold accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                {/* Content */}
                <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left flex-wrap justify-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-5 h-5 text-gold flex-shrink-0" />
                  </motion.div>
                  <p className="text-white text-sm sm:text-base font-medium">
                    <span className="text-gold font-bold">Spring Special:</span> 15% Off All Interior Painting Projects!
                  </p>

                  {/* Urgency indicators */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="hidden md:inline-flex items-center gap-1 bg-red-500/20 text-red-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-500/30">
                      <Flame className="w-3 h-3" />
                      Limited Availability
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1 bg-gold/15 text-gold text-xs font-semibold px-2.5 py-1 rounded-full border border-gold/25">
                      <Users className="w-3 h-3" />
                      12 spots left
                    </span>
                  </div>
                </div>

                {/* Right side: Countdown + Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
                  {/* Countdown Timer */}
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-gold mr-1" />
                    <div className="flex items-center gap-1 text-xs font-mono">
                      <span className="bg-navy/50 text-white px-1.5 py-0.5 rounded font-bold">{pad(countdown.days)}d</span>
                      <span className="text-white/40">:</span>
                      <span className="bg-navy/50 text-white px-1.5 py-0.5 rounded font-bold">{pad(countdown.hours)}h</span>
                      <span className="text-white/40">:</span>
                      <span className="bg-navy/50 text-white px-1.5 py-0.5 rounded font-bold">{pad(countdown.minutes)}m</span>
                    </div>
                  </div>

                  {/* Buttons */}
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

          {/* Professional close button */}
          <motion.button
            onClick={handleDismiss}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white/90 transition-all cursor-pointer backdrop-blur-sm border border-white/10 hover:border-white/20"
            aria-label="Dismiss promotion"
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
