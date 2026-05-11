'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Check,
  ShieldCheck,
  Star,
  BadgeCheck,
  ArrowRight,
  Timer,
  AlertTriangle,
  Phone,
  Paintbrush,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

interface ExpressOption {
  id: string;
  title: string;
  subtitle: string;
  timeline: string;
  timelineBadge: string;
  priceRange: string;
  priceNote: string;
  urgencyLevel: 'high' | 'medium' | 'standard';
  includes: string[];
  icon: React.ElementType;
  popular?: boolean;
}

const expressOptions: ExpressOption[] = [
  {
    id: 'same-day',
    title: 'Same-Day Touch-Up',
    subtitle: 'Emergency fix for scuffs, marks & small areas',
    timeline: 'Today',
    timelineBadge: '⚡ Same Day',
    priceRange: '$199 – $499',
    priceNote: 'Perfect for inspections & showings',
    urgencyLevel: 'high',
    includes: [
      'Up to 3 rooms / areas',
      'Touch-up on walls, trim & baseboards',
      'Premium touch-up paint included',
      '2-hour arrival window',
      'Full cleanup & spot-check',
      '30-day touch-up warranty',
    ],
    icon: Zap,
  },
  {
    id: '48-hour',
    title: '48-Hour Room Refresh',
    subtitle: 'Complete room repaint in just 2 days',
    timeline: '48 Hours',
    timelineBadge: '🔥 48 Hours',
    priceRange: '$599 – $1,499',
    priceNote: 'Most popular for home staging',
    urgencyLevel: 'medium',
    includes: [
      'Full room painting (1-2 rooms)',
      'Professional color matching',
      'Furniture moved & protected',
      'Complete surface preparation',
      'Two coats of premium paint',
      '5-year satisfaction warranty',
    ],
    icon: Clock,
    popular: true,
  },
  {
    id: 'one-week',
    title: '1-Week Full Paint',
    subtitle: 'Complete home transformation in 5-7 days',
    timeline: '5–7 Days',
    timelineBadge: '🏠 1 Week',
    priceRange: '$2,499 – $7,999',
    priceNote: 'Best value for whole-home projects',
    urgencyLevel: 'standard',
    includes: [
      'Up to 8 rooms painted',
      'Ceilings, trim & doors included',
      'Free color consultation',
      'Cabinet refresh option',
      'Professional crew of 3-4 painters',
      '10-year craftsmanship warranty',
    ],
    icon: Paintbrush,
  },
];

// Countdown timer for availability slots
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(18, 0, 0, 0);
    if (now > endOfDay) {
      endOfDay.setDate(endOfDay.getDate() + 1);
    }
    const diff = endOfDay.getTime() - now.getTime();
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(18, 0, 0, 0);
      if (now > endOfDay) {
        endOfDay.setDate(endOfDay.getDate() + 1);
      }
      const diff = endOfDay.getTime() - now.getTime();
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

const trustBadges = [
  { icon: ShieldCheck, label: 'Satisfaction Guaranteed', color: 'text-sage' },
  { icon: BadgeCheck, label: 'Fully Licensed & Insured', color: 'text-gold' },
  { icon: Star, label: '4.9★ Average Rating', color: 'text-gold' },
  { icon: Check, label: 'Free On-Site Assessment', color: 'text-sage' },
];

export function ExpressService() {
  const { setEstimateFormOpen } = useAppStore();
  const timeLeft = useCountdown();
  const [slotsLeft, setSlotsLeft] = useState(3);

  // Simulate slots decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      setSlotsLeft((prev) => {
        if (prev > 1) {
          if (Math.random() > 0.7) return prev - 1;
        }
        return prev;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-cream to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sage/5 rounded-full blur-[80px]" />

      {/* Urgency top banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-4 md:p-5 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            {/* Pulsing indicator */}
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <motion.div
                className="absolute inset-0 bg-red-500 rounded-full"
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gold" />
                <span className="text-white font-bold text-sm md:text-base">Limited Express Slots Available</span>
              </div>
              <p className="text-white/50 text-xs mt-0.5">
                Only {slotsLeft} express slots remaining this week
              </p>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Timer className="w-3.5 h-3.5" />
              <span>Book before end of day:</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { value: timeLeft.hours, label: 'hr' },
                { value: timeLeft.minutes, label: 'min' },
                { value: timeLeft.seconds, label: 'sec' },
              ].map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-1">
                  <div className="bg-white/10 rounded-lg px-2 py-1 min-w-[40px] text-center">
                    <span className="text-white font-mono font-bold text-sm md:text-base">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                  </div>
                  {i < 2 && <span className="text-white/30 text-xs font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-5">
            <Zap className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Express Service</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Need It Done{' '}
            <span className="text-gradient-gold">Fast?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Life happens fast. Whether it&apos;s an inspection tomorrow or a surprise showing, our express painting services deliver professional results on your timeline.
          </p>
        </motion.div>

        {/* Express Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {expressOptions.map((option, index) => {
            const Icon = option.icon;
            const urgencyColors = {
              high: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-500' },
              medium: { border: 'border-gold/30', bg: 'bg-gold/5', text: 'text-gold', badge: 'bg-gold' },
              standard: { border: 'border-sage/20', bg: 'bg-sage/5', text: 'text-sage', badge: 'bg-sage' },
            };
            const colors = urgencyColors[option.urgencyLevel];

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  option.popular ? 'border-2 border-gold/30' : 'border border-gray-100'
                }`}
              >
                {/* Popular badge */}
                {option.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gold text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Top color bar */}
                <div className={option.popular ? 'h-1.5 bg-gradient-to-r from-gold to-gold-light' : option.urgencyLevel === 'high' ? 'h-1.5 bg-gradient-to-r from-red-400 to-red-500' : option.urgencyLevel === 'medium' ? 'h-1.5 bg-gradient-to-r from-gold to-gold-light' : 'h-1.5 bg-gradient-to-r from-sage to-sage-light'} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <Badge className={`${colors.badge} text-white text-[10px] font-bold border-0`}>
                      {option.timelineBadge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-navy mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{option.subtitle}</p>

                  {/* Price */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5">
                    <p className="text-2xl font-bold text-navy">{option.priceRange}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{option.priceNote}</p>
                  </div>

                  {/* Includes */}
                  <div className="space-y-2.5 mb-6">
                    {option.includes.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-sage mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => setEstimateFormOpen(true)}
                    className={`w-full font-semibold py-5 rounded-xl transition-all ${
                      option.popular
                        ? 'bg-gold hover:bg-gold-light text-white shadow-lg hover:shadow-xl animate-pulse-glow'
                        : 'bg-navy hover:bg-navy-light text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="trust-badge-mini"
              >
                <Icon className={`w-5 h-5 ${badge.color}`} />
                <span className="text-xs font-medium text-gray-600">{badge.label}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 mb-4 text-sm">Need immediate help? Call us directly.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="tel:+14165551234"
              className="inline-flex items-center gap-2 text-navy font-bold text-lg hover:text-gold transition-colors"
            >
              <Phone className="w-5 h-5" />
              (416) 555-1234
            </a>
            <span className="text-gray-300">|</span>
            <Button
              onClick={() => setEstimateFormOpen(true)}
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 font-semibold"
            >
              Book Online
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
