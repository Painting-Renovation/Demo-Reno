'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, FileText, X, Minimize2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function FloatingCTA() {
  const { setEstimateFormOpen } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);
  const isVisibleRef = useRef(false);

  const handleScroll = useCallback(() => {
    const heroHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const shouldShow = scrollY > heroHeight * 0.8;

    if (shouldShow !== isVisibleRef.current) {
      isVisibleRef.current = shouldShow;
      setIsVisible(shouldShow);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isVisible && !hasPulsed) {
      const timer = setTimeout(() => setHasPulsed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasPulsed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
        >
          {!isMinimized && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-end gap-3"
            >
              {/* Phone call button (mobile) */}
              <motion.a
                href="tel:+14375350494"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden flex items-center gap-2 bg-navy hover:bg-navy-light text-white pl-4 pr-5 py-3 rounded-full shadow-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Call Us</span>
              </motion.a>

              {/* Main CTA button */}
              <motion.button
                onClick={() => setEstimateFormOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 bg-navy hover:bg-navy-light text-white pl-5 pr-6 py-3.5 rounded-full shadow-xl transition-colors cursor-pointer ${
                  !hasPulsed ? 'animate-pulse' : ''
                }`}
              >
                <FileText className="w-5 h-5 text-gold" />
                <span className="text-sm font-semibold">Get Estimate</span>

                {/* Gold accent dot */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-white" />
              </motion.button>
            </motion.div>
          )}

          {/* Minimized version */}
          {isMinimized && (
            <motion.button
              onClick={() => setIsMinimized(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-14 h-14 bg-navy hover:bg-navy-light text-white rounded-full shadow-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <FileText className="w-6 h-6 text-gold" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-white" />
            </motion.button>
          )}

          {/* Close/Minimize button */}
          <motion.button
            onClick={() => {
              if (isMinimized) {
                setIsVisible(false);
              } else {
                setIsMinimized(true);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer"
            aria-label={isMinimized ? 'Close floating button' : 'Minimize floating button'}
          >
            {isMinimized ? (
              <X className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5 text-gray-500" />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
