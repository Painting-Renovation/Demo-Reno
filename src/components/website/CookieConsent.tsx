'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, ChevronUp } from 'lucide-react';

const CONSENT_KEY = 'procoat-cookie-consent';

const cookieCategories = [
  {
    key: 'necessary' as const,
    label: 'Necessary',
    desc: 'Required for the website to function properly.',
    disabled: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analytics',
    desc: 'Help us understand how you use the site.',
    disabled: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing',
    desc: 'Used to deliver personalized advertisements.',
    disabled: false,
  },
];

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (data: Record<string, unknown>) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...data, timestamp: new Date().toISOString() }));
    setVisible(false);
    setExpanded(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectOptional = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleCustomizeSave = () => {
    saveConsent(preferences);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="fixed bottom-0 left-4 right-4 sm:left-6 sm:right-6 z-50"
        >
          <div className="max-w-5xl mx-auto">
            {/* Collapsed state: slim single-line bar */}
            {!expanded && (
              <motion.div
                layoutId="cookie-bar"
                className="bg-navy/95 backdrop-blur-xl rounded-t-2xl sm:rounded-t-2xl rounded-b-none border border-white/10 border-b-0 shadow-[0_-8px_32px_rgba(0,0,0,0.3)] px-4 sm:px-6 py-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Cookie icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-gold" />
                  </div>

                  {/* Text - hidden on very small screens, shown on sm+ */}
                  <p className="flex-1 text-white/80 text-sm truncate">
                    We use cookies to improve your experience.{' '}
                    <span className="hidden sm:inline">By continuing, you agree to our cookie policy.</span>
                  </p>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setExpanded(true)}
                      className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Customize
                    </button>
                    <button
                      onClick={handleRejectOptional}
                      className="text-white/60 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="bg-gold hover:bg-gold-light text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-lg shadow-gold/20"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Expanded state: full preferences panel */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="bg-navy/95 backdrop-blur-xl border border-white/10 border-b-0 rounded-t-2xl rounded-b-none shadow-[0_-8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                  {/* Header row (compact) */}
                  <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-white/5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                      <Cookie className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm">Cookie Preferences</h3>
                      <p className="text-white/50 text-xs truncate">Manage how we use your data</p>
                    </div>
                    <button
                      onClick={() => setExpanded(false)}
                      className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Close cookie preferences"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  {/* Preferences */}
                  <div className="px-4 sm:px-6 py-4 space-y-3">
                    {cookieCategories.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        {/* Toggle switch */}
                        <button
                          role="switch"
                          aria-checked={preferences[item.key]}
                          aria-label={`${item.label} cookies`}
                          disabled={item.disabled}
                          onClick={() => {
                            if (!item.disabled) {
                              setPreferences((prev) => ({
                                ...prev,
                                [item.key]: !prev[item.key],
                              }));
                            }
                          }}
                          className={`relative flex-shrink-0 w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
                            preferences[item.key]
                              ? 'bg-gold'
                              : 'bg-white/20'
                          } ${item.disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
                          style={{ height: 22 }}
                        >
                          <motion.div
                            layout
                            className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                            style={{ width: 18, height: 18 }}
                            animate={{ left: preferences[item.key] ? 20 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>

                        {/* Label + description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-medium">{item.label}</p>
                            {item.disabled && (
                              <span className="text-[10px] text-gold/80 font-medium bg-gold/10 px-1.5 py-0.5 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-white/40 text-xs">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-t border-white/5 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={handleRejectOptional}
                      className="text-white/60 hover:text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
                    >
                      Reject Optional
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={handleCustomizeSave}
                      className="bg-white/10 hover:bg-white/15 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="bg-gold hover:bg-gold-light text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-lg shadow-gold/20 flex-shrink-0"
                    >
                      Accept All
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
