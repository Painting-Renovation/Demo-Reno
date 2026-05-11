'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Star, CheckCircle, Award, ThumbsUp, ShieldCheck, BadgeCheck, Clock, TrendingUp, Tag, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { AnimatedCounter } from './AnimatedCounter';

const stats = [
  { icon: CheckCircle, value: 2000, label: 'Projects Completed', suffix: '+', gradient: 'from-gold/20 to-gold/5' },
  { icon: Award, value: 15, label: 'Years Experience', suffix: '+', gradient: 'from-sage/20 to-sage/5' },
  { icon: Star, value: 4.9, label: 'Google Rating', suffix: '★', prefix: '', decimals: 1, gradient: 'from-[#E8B94E]/20 to-[#C8973E]/5' },
  { icon: ThumbsUp, value: 100, label: 'Satisfaction Guaranteed', suffix: '%', gradient: 'from-navy-light/20 to-navy/5' },
];

/* Floating paint droplet SVG decoration */
function PaintDroplet({ className, color, size = 20, delay = 0 }: { className?: string; color: string; size?: number; delay?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.5, 0.4, 0],
        scale: [0.6, 1, 0.9, 0.5],
        y: [0, -30, -50, -80],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <path d="M12 2C12 2 5 11 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 11 12 2 12 2Z" />
    </motion.svg>
  );
}

export function Hero() {
  const { setEstimateFormOpen, setAppointmentFormOpen } = useAppStore();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, 250]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const contentScale = useTransform(scrollY, [0, 600], [1, 0.95]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <motion.img
          src="/images/hero-exterior.jpg"
          alt="Professional painting services"
          className="w-full h-[120%] object-cover"
          style={{ y: parallaxY }}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Animated gradient backdrop for text readability */}
      <div className="hero-radial-backdrop absolute inset-0 pointer-events-none" />

      {/* Video-like Shimmer Overlay */}
      <div className="hero-shimmer-overlay" />

      {/* Grain Texture Overlay */}
      <div className="grain-overlay absolute inset-0" />

      {/* Floating Paint Droplets - Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <PaintDroplet color="#C8973E" size={16} delay={0} className="absolute top-[15%] left-[8%]" />
        <PaintDroplet color="#E8B94E" size={12} delay={1.5} className="absolute top-[25%] right-[12%]" />
        <PaintDroplet color="#5B7B5A" size={14} delay={3} className="absolute top-[60%] left-[5%]" />
        <PaintDroplet color="#C8973E" size={10} delay={4.5} className="absolute top-[45%] right-[6%]" />
        <PaintDroplet color="#E8B94E" size={18} delay={2} className="absolute top-[70%] left-[15%]" />
        <PaintDroplet color="#0B1D3A" size={11} delay={5} className="absolute top-[20%] left-[45%]" />
        <PaintDroplet color="#C8973E" size={13} delay={1} className="absolute top-[80%] right-[18%]" />
        <PaintDroplet color="#5B7B5A" size={9} delay={6} className="absolute top-[10%] right-[35%]" />

        {/* Subtle floating paint brush icons */}
        <motion.div
          className="absolute top-[20%] right-[10%] text-gold/10"
          animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Paintbrush className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] left-[8%] text-gold/8"
          animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Paintbrush className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pt-20 hero-content-glow px-6 sm:px-10 md:px-16 py-10 sm:py-14"
        >
          {/* Award pill with glassier effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 glass-morphism-hero rounded-full px-5 py-2.5 mb-8"
          >
            <Award className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="w-px h-4 bg-white/20" />
            <span className="text-white/90 text-sm font-medium">
              Toronto&apos;s Trusted Painting Professionals
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-balance"
          >
            Transform Your Space{' '}
            <br className="hidden sm:block" />
            With{' '}
            <span className="text-shimmer-gold-dramatic text-glow-strong">Professional Painting</span>
          </motion.h1>

          {/* Subtitle with subtle glow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-glow-white"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Premium residential &amp; commercial painting services across the Greater Toronto Area.
            Licensed, insured, and committed to excellence since 2009.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button
              onClick={() => setEstimateFormOpen(true)}
              size="lg"
              className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-4 text-base rounded-lg cta-button-enhanced animate-pulse-glow-enhanced"
            >
              <Tag className="w-4 h-4 mr-2 text-gold-light" />
              Get a <span className="font-black underline decoration-2 decoration-gold-light underline-offset-2">FREE</span> Estimate
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setAppointmentFormOpen(true)}
              className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 text-base rounded-lg transition-all glass-morphism cta-button-enhanced"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book a Consultation
            </Button>
          </motion.div>

          {/* Trusted by homeowners badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col items-center justify-center gap-2 mb-14"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'bg-gold/30',
                  'bg-sage/30',
                  'bg-navy-light/30',
                  'bg-gold-light/30',
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${bg} border-2 border-navy/60 flex items-center justify-center`}
                  >
                    <span className="text-[9px] font-bold text-white/80">
                      {['JM', 'SK', 'AP', 'RL'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span className="text-white/70 text-sm">
                  Trusted by <strong className="text-white/90">
                    <AnimatedCounter target={2000} duration={2500} suffix="+" immediate={true} delay={1200} />
                  </strong> homeowners across GTA
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span>4.9 average rating</span>
              <span>•</span>
              <span>Licensed &amp; Insured</span>
              <span>•</span>
              <span>5-Year Warranty</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative SVG Paint Brush Stroke */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
          className="max-w-lg mx-auto mb-6"
        >
          <svg viewBox="0 0 500 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M2 18 C50 22, 80 8, 140 14 C200 20, 220 6, 280 12 C340 18, 360 4, 420 10 C460 14, 480 8, 498 12"
              stroke="url(#brushGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M10 16 C60 20, 100 10, 160 16 C220 22, 250 8, 310 14 C370 20, 400 6, 450 12 C475 15, 490 10, 498 12"
              stroke="url(#brushGradient2)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="brushGradient" x1="0" y1="0" x2="500" y2="0">
                <stop offset="0%" stopColor="#C8973E" stopOpacity="0" />
                <stop offset="15%" stopColor="#C8973E" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#E8B94E" stopOpacity="1" />
                <stop offset="85%" stopColor="#C8973E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C8973E" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="brushGradient2" x1="0" y1="0" x2="500" y2="0">
                <stop offset="0%" stopColor="#E8B94E" stopOpacity="0" />
                <stop offset="20%" stopColor="#E8B94E" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#E8B94E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E8B94E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Stats Bar with AnimatedCounter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="stat-card-glow glassmorphism-card rounded-2xl px-4 py-6 text-center group cursor-default relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <stat.icon className="w-6 h-6 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 text-glow-strong relative z-10">
                <AnimatedCounter
                  target={stat.value}
                  duration={2000 + index * 300}
                  suffix={stat.suffix}
                  prefix={stat.prefix || ''}
                  decimals={stat.decimals || 0}
                  immediate={true}
                  delay={1500 + index * 200}
                />
              </div>
              <div className="text-white/70 text-xs sm:text-sm relative z-10">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.8 }}
          className="mt-8 mb-4 max-w-3xl mx-auto"
        >
          <div className="glassmorphism-card rounded-xl px-4 py-3">
            <div className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
              {[
                { icon: Star, text: '4.9/5 Google Rating', accent: true },
                { icon: BadgeCheck, text: 'Licensed & Insured', accent: false },
                { icon: Clock, text: '5-Year Warranty', accent: false },
                { icon: TrendingUp, text: '2,000+ Projects', accent: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <item.icon className={`w-4 h-4 ${item.accent ? 'text-gold' : 'text-white/60'}`} />
                  <span className={`text-xs sm:text-sm whitespace-nowrap ${item.accent ? 'text-gold font-semibold' : 'text-white/70'}`}>
                    {item.text}
                  </span>
                  {i < 3 && (
                    <div className="w-px h-4 bg-white/15 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator with elegant design */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#services"
          className="flex flex-col items-center gap-2 group"
          aria-label="Scroll down"
        >
          <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-medium group-hover:text-white/60 transition-colors">
            Scroll
          </span>
          <div className="relative w-6 h-10 border-[1.5px] border-white/20 rounded-full group-hover:border-white/40 transition-colors">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2.5 bg-gold rounded-full absolute left-1/2 -translate-x-1/2"
            />
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold/30" />
          </div>
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-white/30">
              <path d="M5 6L0 0H10L5 6Z" fill="currentColor" />
            </svg>
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
