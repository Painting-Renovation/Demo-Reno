'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Percent, ArrowRight, Tag } from 'lucide-react';

const EXIT_KEY = 'procoat-exit-intent-shown';

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  // Use static initial state to avoid hydration mismatch (window unavailable on server)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Defer to next frame to avoid set-state-in-effect lint rule (client-only mount)
    const raf = requestAnimationFrame(() => setIsMobile(window.innerWidth < 640));
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize); };
  }, []);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves through the top
    if (e.clientY <= 0) {
      const alreadyShown = localStorage.getItem(EXIT_KEY);
      if (!alreadyShown) {
        setOpen(true);
        localStorage.setItem(EXIT_KEY, 'true');
      }
    }
  }, []);

  useEffect(() => {
    // Delay attaching the listener so it doesn't fire on initial load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] backdrop-blur-sm"
            style={{ background: 'rgba(11,29,58,0.5)' }}
            onClick={handleClose}
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={isMobile
              ? { y: '100%', opacity: 0 }
              : { scale: 0.85, opacity: 0 }
            }
            animate={isMobile
              ? { y: 0, opacity: 1 }
              : { scale: 1, opacity: 1 }
            }
            exit={isMobile
              ? { y: '100%', opacity: 0 }
              : { scale: 0.85, opacity: 0 }
            }
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 28,
            }}
            className={`fixed z-[101] ${
              isMobile
                ? 'inset-x-0 bottom-0 rounded-t-3xl max-h-[90vh] overflow-y-auto'
                : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl'
            }`}
            style={{
              background: 'linear-gradient(145deg, #0B1D3A 0%, #132D5E 50%, #0F2647 100%)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            )}

            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            <div className="p-8 sm:p-10">
              {!submitted ? (
                <>
                  {/* Discount badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
                    className="flex justify-center mb-6"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #C8973E 0%, #E8C277 100%)',
                        boxShadow: '0 8px 24px rgba(200,151,62,0.4)',
                      }}
                    >
                      <Percent className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Heading */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Wait! Before You Go...
                    </h3>
                    <p className="text-white/60 text-sm sm:text-base">
                      Get <span className="font-bold" style={{ color: '#C8973E' }}>15% off</span> your first painting project
                    </p>
                  </div>

                  {/* Discount visual */}
                  <div
                    className="rounded-xl p-4 mb-6 flex items-center gap-3"
                    style={{ background: 'rgba(200,151,62,0.1)', border: '1px solid rgba(200,151,62,0.2)' }}
                  >
                    <Tag className="w-5 h-5 flex-shrink-0" style={{ color: '#C8973E' }} />
                    <p className="text-white/80 text-sm">
                      Exclusive offer for new customers. Use your email to claim your discount code.
                    </p>
                  </div>

                  {/* Email form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none transition-all focus:ring-2 focus:border-white/30"
                      style={{
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C8973E';
                        e.target.style.boxShadow = '0 0 0 3px rgba(200,151,62,0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)';
                      }}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #C8973E 0%, #D4A94E 100%)',
                        boxShadow: '0 6px 20px rgba(200,151,62,0.35)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 8px 28px rgba(200,151,62,0.45)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,151,62,0.35)';
                      }}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          Claim My 15% Discount
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Dismiss */}
                  <button
                    onClick={handleClose}
                    className="w-full text-center mt-4 text-white/40 hover:text-white/60 text-xs transition-colors cursor-pointer py-1"
                  >
                    No thanks, I&apos;ll pay full price
                  </button>
                </>
              ) : (
                /* Success state */
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ background: 'rgba(91,123,90,0.2)' }}
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5B7B5A"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      />
                    </motion.svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    You&apos;re in! 🎉
                  </h3>
                  <p className="text-white/60 text-sm mb-6">
                    Your 15% discount code has been sent to{' '}
                    <span className="font-semibold" style={{ color: '#C8973E' }}>{email}</span>
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Continue browsing
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
