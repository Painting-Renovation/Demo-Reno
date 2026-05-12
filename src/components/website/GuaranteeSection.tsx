'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  BadgeCheck,
  Star,
  Leaf,
  UserCheck,
} from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────────── */

const pillars = [
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description:
      'We use only premium materials and our work meets the highest industry standards.',
    accent: 'from-gold/20 to-gold/5',
  },
  {
    icon: Clock,
    title: 'On-Time, Every Time',
    description:
      "If we're late, you get 10% off your project. We respect your schedule.",
    accent: 'from-sage/20 to-sage/5',
  },
  {
    icon: Sparkles,
    title: 'Clean & Respectful',
    description:
      'We treat your home like our own, guaranteed. Spotless cleanup every time.',
    accent: 'from-[#E8B94E]/20 to-gold/5',
  },
];

const trustBadges = [
  { icon: BadgeCheck, label: 'Licensed & Insured' },
  { icon: ShieldCheck, label: 'WSIB Covered' },
  { icon: Star, label: '5-Star Rated' },
  { icon: Leaf, label: 'Eco-Friendly' },
  { icon: UserCheck, label: 'Background Checked' },
];

/* ─── Animation Variants ───────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
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

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ─── Sub-Components ────────────────────────────────────────────────── */

function BackgroundPattern({ parallaxY }: { parallaxY: number }) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ y: parallaxY }}
    >
      {/* Gradient orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gold/[0.04] blur-3xl" />
      <div className="absolute top-1/2 -right-16 w-80 h-80 rounded-full bg-sage/[0.03] blur-3xl" />
      <div className="absolute -bottom-10 left-1/3 w-64 h-64 rounded-full bg-gold-light/[0.03] blur-3xl" />

      {/* Dot pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="guarantee-dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="white" />
            <circle cx="18" cy="10" r="0.7" fill="white" />
            <circle cx="10" cy="22" r="0.9" fill="white" />
            <circle cx="26" cy="28" r="0.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#guarantee-dots)" />
      </svg>

      {/* Floating paint drops */}
      <motion.div
        className="absolute top-16 right-[8%] opacity-[0.05]"
        animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 0 C40 0 80 50 80 70 C80 88 62 100 40 100 C18 100 0 88 0 70 C0 50 40 0 40 0Z" fill="white" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-[5%] opacity-[0.04]"
        animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <svg width="60" height="75" viewBox="0 0 60 75" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0 C30 0 60 38 60 53 C60 66 47 75 30 75 C13 75 0 66 0 53 C0 38 30 0 30 0Z" fill="white" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[40%] left-[12%] opacity-[0.03]"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0 C20 0 40 25 40 35 C40 44 31 50 20 50 C9 50 0 44 0 35 C0 25 20 0 20 0Z" fill="white" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function ShimmerLine({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div
      className={`absolute left-0 right-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-[2px] overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-light/80 to-transparent"
        animate={{ x: ['-100%', '400%'] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 2,
        }}
      />
    </div>
  );
}

function GuaranteeBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center mx-auto mb-12 md:mb-16"
    >
      {/* Outer pulsing glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, #C8973E, #E8B94E, #C8973E, #A67C2E, #C8973E)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-[3px] rounded-full bg-[#0B1D3A]" />
      </motion.div>

      {/* Pulsing glow aura */}
      <motion.div
        className="absolute rounded-full bg-gold/20 blur-xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 'calc(100% + 40px)', height: 'calc(100% + 40px)' }}
      />

      {/* Inner content */}
      <div className="relative z-10 flex flex-col items-center justify-center rounded-full"
        style={{
          width: 'clamp(140px, 22vw, 200px)',
          height: 'clamp(140px, 22vw, 200px)',
          background: 'radial-gradient(circle at 40% 35%, #162F55, #0B1D3A)',
          border: '2px solid rgba(200, 151, 62, 0.3)',
        }}
      >
        {/* Gold inner ring */}
        <motion.div
          className="absolute inset-3 rounded-full border border-gold/20"
          animate={{ borderColor: ['rgba(200,151,62,0.15)', 'rgba(200,151,62,0.4)', 'rgba(200,151,62,0.15)'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <ShieldCheck className="w-10 h-10 md:w-14 md:h-14 text-gold mb-2 drop-shadow-lg" />
        <span className="text-gold text-xs md:text-sm font-bold tracking-wide uppercase">
          100%
        </span>
        <span className="text-white text-sm md:text-base font-bold">
          Satisfaction
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */

export function GuaranteeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #0B1D3A 0%, #0F2647 35%, #132D5E 65%, #0B1D3A 100%)',
      }}
    >
      {/* Background layers */}
      <BackgroundPattern parallaxY={parallaxY} />
      <ShimmerLine position="top" />
      <ShimmerLine position="bottom" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '3rem' } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent to-gold mx-auto mb-6"
          />
          <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
            Our Promise to You
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Satisfaction{' '}
            <span className="text-shimmer-gold text-shadow-gold">
              Guaranteed
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            If you&apos;re not 100% satisfied with our work, we&apos;ll come back and
            make it right at no additional cost. That&apos;s our promise to every
            customer.
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '3rem' } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[2px] bg-gradient-to-l from-transparent to-gold mx-auto mt-6"
          />
        </motion.div>

        {/* ── Guarantee Badge ── */}
        <GuaranteeBadge />

        {/* ── Three Guarantee Pillars ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-14 md:mb-18"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={cardVariants}
              className="group relative"
            >
              <div
                className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:scale-[1.02] cursor-default"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Hover gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${pillar.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                />

                {/* Card shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl">
                  <div
                    className="absolute top-0 left-0 w-full h-full rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(200,151,62,0.06) 0%, transparent 50%, rgba(200,151,62,0.04) 100%)',
                    }}
                  />
                </div>

                {/* Icon */}
                <div className="relative z-10 mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.07] group-hover:bg-white/[0.12] transition-all duration-300 group-hover:scale-110">
                  <pillar.icon className="w-7 h-7 text-gold" />
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-lg sm:text-xl font-bold text-white mb-2">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-white/50 text-sm leading-relaxed">
                  {pillar.description}
                </p>

                {/* Bottom gold accent line on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-gold to-gold-light group-hover:w-3/4 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Trust Badges Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-white/30 text-xs uppercase tracking-widest mb-6 font-medium">
            Trusted Credentials
          </p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8"
          >
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.label}
                variants={badgeVariants}
                className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors duration-300 group/badge"
              >
                <badge.icon className="w-5 h-5 text-gold/70 group-hover/badge:text-gold transition-colors duration-300" />
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
