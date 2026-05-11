'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, CheckCircle, Award, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const stats = [
  { icon: CheckCircle, value: '2000+', label: 'Projects Completed' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Star, value: '4.9★', label: 'Google Rating' },
  { icon: ThumbsUp, value: '100%', label: 'Satisfaction Guaranteed' },
];

export function Hero() {
  const { setEstimateFormOpen, setAppointmentFormOpen } = useAppStore();
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setParallaxOffset(scrollY * 0.3);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-exterior.jpg"
          alt="Professional painting services"
          className="w-full h-full object-cover parallax-bg"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pt-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-morphism rounded-full px-5 py-2.5 mb-8"
          >
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Toronto&apos;s Trusted Painting Professionals
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Transform Your Space{' '}
            <br className="hidden sm:block" />
            With{' '}
            <span className="text-shimmer-gold text-shadow-gold">Professional Painting</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            Premium residential &amp; commercial painting services across the Greater Toronto Area.
            Licensed, insured, and committed to excellence since 2009.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              onClick={() => setEstimateFormOpen(true)}
              size="lg"
              className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-4 text-base rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 animate-pulse-glow"
            >
              Get a Free Estimate
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setAppointmentFormOpen(true)}
              className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 text-base rounded-lg transition-all glass-morphism"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book a Consultation
            </Button>
          </motion.div>
        </motion.div>

        {/* Paint Brush Stroke Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="paint-stroke-divider" />
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="stat-card-glow glass-morphism rounded-2xl px-4 py-6 text-center group cursor-default"
            >
              <stat.icon className="w-6 h-6 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 animate-count text-shadow-gold">
                {stat.value}
              </div>
              <div className="text-white/70 text-xs sm:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator with floating animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
      >
        <div className="w-7 h-11 border-2 border-white/25 rounded-full flex justify-center pt-2 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2.5 bg-gold rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
