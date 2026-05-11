'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Shield } from 'lucide-react';

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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50"
        >
          {/* Collapsed state: compact pill bar */}
          {!expanded && (
            <motion.div
              layoutId="cookie-bar"
              className="cookie-glass rounded-2xl sm:rounded-2xl px-4 sm:px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                {/* Cookie icon */}
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/10">
                  <Cookie className="w-4 h-4 text-gold" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm leading-snug">
                    We use cookies to enhance your experience.
                    <span className="hidden sm:inline"> Manage preferences or accept all.</span>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(true)}
                    className="hidden sm:flex items-center gap-1 text-white/50 hover:text-white text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRejectOptional}
                    className="text-white/50 hover:text-white text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-gold/20 cta-button-enhanced"
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
                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: 'auto', opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="cookie-glass rounded-2xl overflow-hidden"
              >
                {/* Header row */}
                <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-white/5">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/10">
                    <Shield className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm">Cookie Preferences</h3>
                    <p className="text-white/40 text-xs truncate">Manage how we use your data</p>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close cookie preferences"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Preferences */}
                <div className="px-4 sm:px-5 py-4 space-y-2.5">
                  {cookieCategories.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
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
                        className={`relative flex-shrink-0 rounded-full transition-all duration-300 cursor-pointer ${
                          preferences[item.key]
                            ? 'bg-gold shadow-sm shadow-gold/30'
                            : 'bg-white/15'
                        } ${item.disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
                        style={{ width: 40, height: 22 }}
                      >
                        <motion.div
                          layout
                          className="absolute top-1 bg-white rounded-full shadow-sm"
                          style={{ width: 16, height: 16 }}
                          animate={{ left: preferences[item.key] ? 21 : 3 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>

                      {/* Label + description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium">{item.label}</p>
                          {item.disabled && (
                            <span className="text-[10px] text-gold/80 font-medium bg-gold/10 px-1.5 py-0.5 rounded-md border border-gold/15">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-white/35 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-t border-white/5">
                  <button
                    onClick={handleRejectOptional}
                    className="text-white/50 hover:text-white text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Reject Optional
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={handleCustomizeSave}
                    className="bg-white/10 hover:bg-white/15 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer border border-white/5"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-lg shadow-gold/20 cta-button-enhanced"
                  >
                    Accept All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
