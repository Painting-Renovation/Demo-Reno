'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  Star,
  ThumbsUp,
  Users,
  Clock,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

const stats = [
  {
    icon: Briefcase,
    value: 2500,
    suffix: '+',
    prefix: '',
    decimals: 0,
    label: 'Projects Completed',
    accent: 'from-gold/25 to-gold/5',
  },
  {
    icon: Calendar,
    value: 15,
    suffix: '+',
    prefix: '',
    decimals: 0,
    label: 'Years Experience',
    accent: 'from-sage/25 to-sage/5',
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    prefix: '',
    decimals: 1,
    label: 'Google Rating',
    accent: 'from-[#E8B94E]/25 to-[#C8973E]/5',
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: '%',
    prefix: '',
    decimals: 0,
    label: 'Client Satisfaction',
    accent: 'from-navy-light/25 to-navy/5',
  },
  {
    icon: Users,
    value: 50,
    suffix: '+',
    prefix: '',
    decimals: 0,
    label: 'Expert Painters',
    accent: 'from-gold/25 to-gold/5',
  },
  {
    icon: Clock,
    value: 3,
    suffix: '-Day',
    prefix: '',
    decimals: 0,
    label: 'Avg Project Completion',
    accent: 'from-sage/25 to-sage/5',
  },
  {
    icon: ShieldCheck,
    value: 5,
    suffix: '-Year',
    prefix: '',
    decimals: 0,
    label: 'Written Warranty',
    accent: 'from-[#E8B94E]/25 to-[#C8973E]/5',
  },
  {
    icon: Headphones,
    value: 24,
    suffix: '/7',
    prefix: '',
    decimals: 0,
    label: 'Online Support Available',
    accent: 'from-navy-light/25 to-navy/5',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* Decorative paint-splash dot pattern with sparkle dots */
function BackgroundPattern({ parallaxY }: { parallaxY: number }) {
  // Generate deterministic sparkle positions
  const sparkles = useMemo(() => [
    { top: '15%', left: '10%', delay: '0s', size: 5 },
    { top: '25%', left: '80%', delay: '1s', size: 4 },
    { top: '45%', left: '20%', delay: '2s', size: 6 },
    { top: '60%', left: '70%', delay: '0.5s', size: 3 },
    { top: '80%', left: '40%', delay: '1.5s', size: 5 },
    { top: '35%', left: '55%', delay: '2.5s', size: 4 },
    { top: '70%', left: '15%', delay: '3s', size: 3 },
    { top: '20%', left: '50%', delay: '0.8s', size: 4 },
    { top: '55%', left: '90%', delay: '1.2s', size: 5 },
    { top: '85%', left: '60%', delay: '2s', size: 3 },
    { top: '10%', left: '35%', delay: '1.8s', size: 4 },
    { top: '50%', left: '45%', delay: '2.8s', size: 6 },
  ], []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ y: parallaxY }}
    >
      {/* Large faded circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gold/[0.03] blur-3xl" />
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-sage/[0.03] blur-3xl" />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 rounded-full bg-gold-light/[0.02] blur-3xl" />

      {/* Scattered dots pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="stats-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="white" />
            <circle cx="22" cy="12" r="0.8" fill="white" />
            <circle cx="12" cy="28" r="1" fill="white" />
            <circle cx="32" cy="34" r="0.6" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stats-dots)" />
      </svg>

      {/* Floating sparkle dots */}
      {sparkles.map((sp, i) => (
        <div
          key={i}
          className="sparkle-dot"
          style={{
            top: sp.top,
            left: sp.left,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            animationDelay: sp.delay,
            animationDuration: `${2.5 + (i % 3)}s`,
          }}
        />
      ))}

      {/* Paint-splash SVG accents */}
      <motion.div
        className="absolute top-6 right-12 opacity-[0.06]"
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="40" fill="white" />
          <circle cx="25" cy="35" r="12" fill="white" />
          <circle cx="90" cy="40" r="8" fill="white" />
          <circle cx="45" cy="95" r="10" fill="white" />
          <circle cx="100" cy="80" r="6" fill="white" />
          <circle cx="15" cy="70" r="7" fill="white" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 opacity-[0.04]"
        animate={{ y: [0, 6, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="white" />
          <circle cx="20" cy="25" r="10" fill="white" />
          <circle cx="80" cy="30" r="7" fill="white" />
          <circle cx="35" cy="85" r="8" fill="white" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* Gold shimmer line component */
function ShimmerLine({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div className={`absolute left-0 right-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-[2px] overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-light/80 to-transparent"
        animate={{ x: ['-100%', '400%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
      />
    </div>
  );
}

export function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // More dramatic parallax (increased range)
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Track if counters should animate (only after in view)
  const [countersActive, setCountersActive] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Small delay so cards have started animating before numbers count
      const timer = setTimeout(() => setCountersActive(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B1D3A 0%, #0F2647 40%, #132D5E 70%, #0B1D3A 100%)',
      }}
    >
      {/* Parallax background pattern */}
      <BackgroundPattern parallaxY={parallaxY} />

      {/* Gold shimmer lines at top and bottom */}
      <ShimmerLine position="top" />
      <ShimmerLine position="bottom" />

      {/* Subtle top gold accent line (static) */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      {/* Subtle bottom gold accent line (static) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '3rem' } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent to-gold mx-auto mb-6"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Our Track Record{' '}
            <span className="text-shimmer-gold text-shadow-gold">Speaks for Itself</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto">
            Numbers that reflect our unwavering commitment to quality and customer satisfaction.
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '3rem' } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[2px] bg-gradient-to-l from-transparent to-gold mx-auto mt-6"
          />
        </motion.div>

        {/* Stats Grid: 2x4 on mobile, 4x2 on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="relative group"
            >
              <div
                className="glassmorphism-strong relative overflow-hidden rounded-2xl p-4 sm:p-5 md:p-6 text-center transition-all duration-300 hover:scale-[1.03]"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                {/* Icon */}
                <div className="relative z-10 mb-2 sm:mb-3 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.07] group-hover:bg-white/[0.12] transition-colors duration-300">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Number with tabular-nums and gradient underline */}
                <div className="relative z-10 text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 text-shadow-glow">
                  <span className="tabular-nums">
                    {countersActive ? (
                      <AnimatedCounter
                        target={stat.value}
                        duration={2000 + index * 200}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        decimals={stat.decimals}
                        immediate={false}
                      />
                    ) : (
                      <span>{stat.prefix}0{stat.suffix}</span>
                    )}
                  </span>
                  {/* Gradient underline beneath the stat number */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={countersActive ? { width: '60%' } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[2px] bg-gradient-to-r from-gold/80 via-gold to-gold/40 mx-auto mt-1 rounded-full"
                  />
                </div>

                {/* Label */}
                <div className="relative z-10 text-white/50 text-[11px] sm:text-xs md:text-sm leading-tight">
                  {stat.label}
                </div>

                {/* Bottom gold accent line on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-gold to-gold-light group-hover:w-3/4 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
