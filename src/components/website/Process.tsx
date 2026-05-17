'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { Phone, FileText, PaintBucket, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const steps = [
  {
    icon: Phone,
    step: '01',
    title: 'Free Consultation',
    description: 'Contact us for a free, no-obligation estimate. We\'ll discuss your vision, timeline, and budget to understand your needs.',
    timeEstimate: '15 min call',
    color: 'bg-gold',
    glowColor: 'rgba(200,151,62,0.25)',
    ringColor: 'ring-gold/30',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Custom Proposal',
    description: 'Receive a detailed, transparent proposal tailored to your project. No hidden fees — just clear, honest pricing.',
    timeEstimate: '24-48 hours',
    color: 'bg-navy',
    glowColor: 'rgba(11,29,58,0.25)',
    ringColor: 'ring-navy/30',
  },
  {
    icon: PaintBucket,
    step: '03',
    title: 'Expert Painting',
    description: 'Our skilled, background-checked team brings your vision to life with premium materials and meticulous craftsmanship.',
    timeEstimate: '3-7 days',
    color: 'bg-sage',
    glowColor: 'rgba(91,123,90,0.25)',
    ringColor: 'ring-sage/30',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Final Walkthrough',
    description: 'We ensure every detail meets your expectations with a comprehensive walkthrough and clean-up before we leave.',
    timeEstimate: 'Same day',
    color: 'bg-gold',
    glowColor: 'rgba(200,151,62,0.25)',
    ringColor: 'ring-gold/30',
  },
];

function ProgressLabel({ progressPercent }: { progressPercent: MotionValue<number> }) {
  const [displayValue, setDisplayValue] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useMotionValueEvent(progressPercent, 'change', (latest) => {
    if (mountedRef.current) {
      setDisplayValue(Math.round(latest));
    }
  });

  return <span className="text-sm font-bold text-navy">{displayValue}%</span>;
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.18, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col items-center text-center group relative"
    >
      {/* Step Card */}
      <div className="relative z-10 mb-6">
        {/* Outer glow ring */}
        <motion.div
          animate={isInView ? { scale: [0.8, 1.05, 1], opacity: [0, 1, 1] } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.6, delay: index * 0.18 + 0.2 }}
          className="absolute -inset-3 rounded-full opacity-0"
          style={{ background: `radial-gradient(circle, ${step.glowColor} 0%, transparent 70%)` }}
        />
        {/* Main circle - larger with inner shadow */}
        <div className={`relative w-28 h-28 ${step.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 cursor-default`}>
          <div className="absolute inset-1 rounded-xl border border-white/10" />
          <div className="absolute inset-2 rounded-lg shadow-inner" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)' }} />
          <step.icon className="w-12 h-12 text-white relative z-10" />
          {/* Pulsing dot */}
          <motion.div
            animate={isInView ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gold shadow-md z-20"
          />
          {/* Step badge */}
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-gold/30 group-hover:border-gold transition-colors duration-300 z-20">
            <span className="text-xs font-bold text-navy">{step.step}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[220px] min-w-0">
        <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300 text-balance">
          {step.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-3">
          {step.description}
        </p>
        {/* Time estimate badge */}
        <div className="inline-flex items-center gap-1.5 bg-cream rounded-full px-3 py-1">
          <Clock className="w-3 h-3 text-gold" />
          <span className="text-xs font-medium text-navy/60">{step.timeEstimate}</span>
        </div>
      </div>

      {/* Arrow connector (between cards) */}
      {index < steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.4, delay: index * 0.18 + 0.4 }}
          className="absolute top-[54px] -right-[calc(12.5%+8px)] z-10 hidden lg:block"
        >
          <div className="relative flex items-center">
            <div className="w-12 h-0.5 bg-gradient-to-r from-gray-200 to-gold/40" />
            <ArrowRight className="w-4 h-4 text-gold/40 -ml-0.5" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function MobileStepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -30 : 30 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.32, 0.72, 0, 1] }}
      className={`flex gap-4 sm:gap-6 relative ${isEven ? '' : 'flex-row-reverse sm:text-right'}`}
    >
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
        <motion.div
          animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.12 }}
          className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center shadow-md relative`}
        >
          <step.icon className="w-5 h-5 text-white" />
          {/* Pulsing dot on visible step */}
          {isInView && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              className="absolute inset-0 rounded-xl border-2 border-gold"
            />
          )}
        </motion.div>
        {/* Animated connector to next */}
        {index < steps.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.4, delay: index * 0.12 + 0.3 }}
            className="w-0.5 flex-1 bg-gradient-to-b from-gold/30 to-transparent origin-top mt-2"
            style={{ minHeight: '40px' }}
          />
        )}
      </div>

      {/* Content card with alternating backgrounds */}
      <div className={`flex-1 pb-8 ${isEven ? '' : 'sm:text-right'}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: index * 0.12 + 0.15 }}
          className={`${isEven ? 'bg-white' : 'bg-cream/60'} rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all duration-300 group`}
        >
          <div className={`flex items-center gap-2 mb-2 ${isEven ? '' : 'sm:justify-end'}`}>
            <span className="text-xs font-bold text-gold tracking-wider">STEP {step.step}</span>
            <div className="inline-flex items-center gap-1 bg-gold/10 rounded-full px-2 py-0.5">
              <Clock className="w-3 h-3 text-gold" />
              <span className="text-[10px] font-medium text-gold">{step.timeEstimate}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">
            {step.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {step.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Process() {
  const { setEstimateFormOpen } = useAppStore();
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Scroll progress for the animated connecting line (desktop)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

  // Progress percentage
  const progressPercent = useTransform(scrollYProgress, [0.1, 0.9], [0, 100]);

  return (
    <section id="process" ref={sectionRef} className="py-16 sm:py-20 md:py-28 lg:py-32 bg-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-cream/30 to-white" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(11,29,58,0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-20 left-[10%] w-16 h-16 bg-gold/5 rounded-full blur-xl animate-float-decor" />
      <div className="absolute top-40 right-[15%] w-20 h-20 bg-sage/5 rounded-full blur-xl animate-float-delayed-decor" />
      <div className="absolute bottom-32 left-[20%] w-12 h-12 bg-navy/5 rounded-full blur-xl animate-float-decor" />
      <div className="absolute bottom-20 right-[25%] w-24 h-24 bg-gold/3 rounded-full blur-2xl animate-float-delayed-decor" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            ProCoat Painters
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Our simple 4-step process makes it easy to transform your space with confidence.
          </p>
          {/* Decorative underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mt-6"
          />
        </motion.div>

        {/* Progress percentage indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden lg:flex justify-center mb-12"
        >
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E1D8" strokeWidth="3" />
              <motion.circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#C8973E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                style={{ pathLength: progressPercent }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressLabel progressPercent={progressPercent} />
            </div>
          </div>
        </motion.div>

        {/* Steps - Desktop Horizontal */}
        <div className="hidden lg:block relative">
          {/* Animated connecting line background (gray track) */}
          <div className="absolute top-[54px] left-[12%] right-[12%] h-0.5 bg-gray-100 rounded-full" />
          {/* Animated connecting line foreground (gold fill) */}
          <motion.div
            className="absolute top-[54px] left-[12%] h-0.5 bg-gradient-to-r from-gold via-navy to-sage rounded-full origin-left"
            style={{ width: lineProgress, right: 'auto' }}
          />

          <div className="grid grid-cols-4 gap-6 xl:gap-8 relative">
            {steps.map((step, index) => (
              <StepCard key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Steps - Mobile/Tablet Vertical Timeline */}
        <div className="lg:hidden relative">
          {/* Vertical line track */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />

          <div className="space-y-2">
            {steps.map((step, index) => (
              <MobileStepCard key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-14 md:mt-20"
        >
          <p className="text-gray-500 mb-6 text-lg">
            Ready to get started? The first step is just a phone call away.
          </p>
          <Button
            onClick={() => setEstimateFormOpen(true)}
            className="bg-gold hover:bg-gold-light text-white font-semibold px-8 sm:px-10 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 animate-glow-pulse text-base sm:text-lg"
          >
            Schedule Your Free Estimate
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
