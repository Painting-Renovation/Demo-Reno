'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CONSENT_KEY = 'procoat-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
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

  const handleAcceptAll = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setVisible(false);
  };

  const handleCustomizeSave = () => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setShowCustomize(false);
    setVisible(false);
  };

  const handleRejectOptional = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          {!showCustomize ? (
            /* Main Banner */
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-cream rounded-xl flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy mb-1">
                      We use cookies
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      We use cookies to improve your experience, analyze site traffic, and personalize content. 
                      By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomize(true)}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm px-3 h-9"
                  >
                    <Settings className="w-3.5 h-3.5 mr-1.5 hidden sm:block" />
                    Customize
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRejectOptional}
                    className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm px-3 h-9"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-navy hover:bg-navy-light text-white text-xs sm:text-sm px-4 h-9"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Customize Panel */
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="max-w-4xl mx-auto bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-5 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-navy">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {[
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
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences[item.key]}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      disabled={item.disabled}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-navy focus:ring-gold accent-navy"
                    />
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {item.label}
                        {item.disabled && (
                          <span className="text-xs text-gray-400 ml-2">Required</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectOptional}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                >
                  Reject Optional
                </Button>
                <Button
                  size="sm"
                  onClick={handleCustomizeSave}
                  className="bg-navy hover:bg-navy-light text-white text-sm"
                >
                  Save Preferences
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
