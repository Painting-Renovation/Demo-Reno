'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Phone, FileText, PaintBucket, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const steps = [
  {
    icon: Phone,
    step: '01',
    title: 'Free Consultation',
    description: 'Contact us for a free, no-obligation estimate. We\'ll discuss your vision, timeline, and budget to understand your needs.',
    color: 'bg-gold',
    glowColor: 'rgba(200,151,62,0.25)',
    ringColor: 'ring-gold/30',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Custom Proposal',
    description: 'Receive a detailed, transparent proposal tailored to your project. No hidden fees — just clear, honest pricing.',
    color: 'bg-navy',
    glowColor: 'rgba(11,29,58,0.25)',
    ringColor: 'ring-navy/30',
  },
  {
    icon: PaintBucket,
    step: '03',
    title: 'Expert Painting',
    description: 'Our skilled, background-checked team brings your vision to life with premium materials and meticulous craftsmanship.',
    color: 'bg-sage',
    glowColor: 'rgba(91,123,90,0.25)',
    ringColor: 'ring-sage/30',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Final Walkthrough',
    description: 'We ensure every detail meets your expectations with a comprehensive walkthrough and clean-up before we leave.',
    color: 'bg-gold',
    glowColor: 'rgba(200,151,62,0.25)',
    ringColor: 'ring-gold/30',
  },
];

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
        {/* Main circle */}
        <div className={`relative w-24 h-24 ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 cursor-default`}>
          <step.icon className="w-10 h-10 text-white" />
          {/* Step badge */}
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-gold/30 group-hover:border-gold transition-colors duration-300">
            <span className="text-xs font-bold text-navy">{step.step}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[200px]">
        <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">
          {step.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Arrow connector (between cards) */}
      {index < steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.4, delay: index * 0.18 + 0.4 }}
          className="absolute top-[46px] -right-[calc(12.5%+8px)] z-10 hidden lg:block"
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
          className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center shadow-md`}
        >
          <step.icon className="w-5 h-5 text-white" />
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

      {/* Content card */}
      <div className={`flex-1 pb-8 ${isEven ? '' : 'sm:text-right'}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: index * 0.12 + 0.15 }}
          className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all duration-300 group"
        >
          <div className={`flex items-center gap-2 mb-2 ${isEven ? '' : 'sm:justify-end'}`}>
            <span className="text-xs font-bold text-gold tracking-wider">STEP {step.step}</span>
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

  return (
    <section id="process" ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(11,29,58,0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

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

        {/* Steps - Desktop Horizontal */}
        <div className="hidden lg:block relative">
          {/* Animated connecting line background (gray track) */}
          <div className="absolute top-[46px] left-[12%] right-[12%] h-0.5 bg-gray-100 rounded-full" />
          {/* Animated connecting line foreground (gold fill) */}
          <motion.div
            className="absolute top-[46px] left-[12%] h-0.5 bg-gradient-to-r from-gold via-navy to-sage rounded-full origin-left"
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
            className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Schedule Your Free Estimate
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
