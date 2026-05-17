'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Phone,
  CalendarCheck,
  FileText,
  ShieldCheck,
  Paintbrush,
  CheckCircle2,
  Clock,
  ArrowRight,
  Lightbulb,
  X,
  Eye,
  UserCheck,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

/* ─── Stage Data ─────────────────────────────────────────────────── */

interface StageDetail {
  whatToExpect: string[];
  whatYouDo: string[];
  whatWeHandle: string[];
}

interface Stage {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
  duration: string;
  funFact: string;
  detail: StageDetail;
}

const stages: Stage[] = [
  {
    icon: Phone,
    number: '01',
    title: 'Get In Touch',
    description:
      'Reach out via phone, email, or our online form. Tell us about your project and we\'ll respond within hours.',
    duration: 'Same Day',
    funFact:
      'Did you know? Most homeowners reach out on a Monday — and wish they had contacted us sooner!',
    detail: {
      whatToExpect: [
        'Quick response within 2-4 hours',
        'Friendly initial conversation',
        'Preliminary project scope discussion',
        'Flexible scheduling options',
      ],
      whatYouDo: [
        'Share your vision and goals',
        'Provide basic project details',
        'Choose a convenient time for a visit',
      ],
      whatWeHandle: [
        'Answering all your questions',
        'Checking availability in your area',
        'Preparing for your on-site consultation',
      ],
    },
  },
  {
    icon: CalendarCheck,
    number: '02',
    title: 'Free Consultation',
    description:
      'Our expert visits your space to assess the project, discuss color options, and take precise measurements.',
    duration: '1-2 Days',
    funFact:
      'Fun fact: Most homeowners change their color choice at least once during consultation — we love helping you find "the one"!',
    detail: {
      whatToExpect: [
        'On-site visit at your convenience',
        'Detailed measurements and assessment',
        'Color consultation with samples',
        'Surface condition evaluation',
      ],
      whatYouDo: [
        'Show us the areas to be painted',
        'Share inspiration and preferences',
        'Ask any questions you may have',
      ],
      whatWeHandle: [
        'Professional assessment of surfaces',
        'Bringing color sample decks',
        'Identifying any prep work needed',
        'Taking precise measurements',
      ],
    },
  },
  {
    icon: FileText,
    number: '03',
    title: 'Custom Proposal',
    description:
      'Receive a detailed, transparent proposal with itemized pricing — no hidden fees, no surprises.',
    duration: '1-3 Days',
    funFact:
      'Our proposals average 4 pages of detail — because transparency is part of the ProCoat promise.',
    detail: {
      whatToExpect: [
        'Itemized cost breakdown',
        'Material specifications',
        'Project timeline with milestones',
        'Warranty and guarantee details',
      ],
      whatYouDo: [
        'Review the proposal at your pace',
        'Ask for any adjustments',
        'Approve and schedule the project',
      ],
      whatWeHandle: [
        'Preparing accurate estimates',
        'Sourcing premium materials',
        'Coordinating crew scheduling',
        'Handling all paperwork',
      ],
    },
  },
  {
    icon: ShieldCheck,
    number: '04',
    title: 'Preparation & Protection',
    description:
      'Our team meticulously prepares every surface, protects your furnishings, and sets up a clean workspace.',
    duration: '1 Day',
    funFact:
      'Prep work makes up 40% of a great paint job — it\'s the secret to results that last 10+ years!',
    detail: {
      whatToExpect: [
        'Furniture and floor protection',
        'Wall repair and patching',
        'Sanding and priming',
        'Taping and masking precision edges',
      ],
      whatYouDo: [
        'Clear small personal items from surfaces',
        'Point out any areas of concern',
        'Sit back and relax — we handle the rest',
      ],
      whatWeHandle: [
        'Moving and covering furniture',
        'Repairing nail holes and cracks',
        'Priming all surfaces properly',
        'Setting up dust containment',
      ],
    },
  },
  {
    icon: Paintbrush,
    number: '05',
    title: 'Expert Painting',
    description:
      'Our skilled painters bring your vision to life with premium materials, clean lines, and flawless finishes.',
    duration: '2-5 Days',
    funFact:
      'Our painters average 8+ years of experience and are background-checked for your peace of mind.',
    detail: {
      whatToExpect: [
        'Professional-grade application',
        'Clean, precise cut-in lines',
        'Multiple coats for durability',
        'Daily progress updates',
      ],
      whatYouDo: [
        'Go about your daily routine',
        'Communicate any preferences during the job',
        'Enjoy watching the transformation!',
      ],
      whatWeHandle: [
        'Applying premium Benjamin Moore / Sherwin-Williams paint',
        'Maintaining a spotless work area',
        'Daily cleanup and organization',
        'Quality checks at every step',
      ],
    },
  },
  {
    icon: CheckCircle2,
    number: '06',
    title: 'Final Walkthrough',
    description:
      'We do a detailed walkthrough together, touch up any spots, and leave your space spotless and beautiful.',
    duration: 'Same Day',
    funFact:
      '95% of our clients say the walkthrough is their favorite part — seeing the finished result never gets old!',
    detail: {
      whatToExpect: [
        'Comprehensive room-by-room inspection',
        'Touch-ups on any imperfections',
        'Professional cleanup of all areas',
        'Final care and maintenance tips',
      ],
      whatYouDo: [
        'Walk through with your project manager',
        'Confirm everything meets your expectations',
        'Share your feedback — we want to hear it',
      ],
      whatWeHandle: [
        'Performing final quality inspection',
        'Completing all touch-ups',
        'Full cleanup and furniture replacement',
        'Providing care instructions and warranty card',
      ],
    },
  },
];

/* ─── Animation Variants ─────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
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

const popVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.2 },
  },
};

/* ─── Stage Detail Popover ───────────────────────────────────────── */

function StageDetailPopover({
  stage,
  onClose,
}: {
  stage: Stage;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" />

        {/* Popover */}
        <motion.div
          variants={popVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white/90 backdrop-blur-xl border border-gold/20 shadow-2xl"
        >
          {/* Gold accent top bar */}
          <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-t-2xl" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <stage.icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gold tracking-wider">
                      STAGE {stage.number}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-cream rounded-full px-2 py-0.5">
                      <Clock className="w-3 h-3 text-gold" />
                      <span className="text-[10px] font-medium text-navy/60">
                        {stage.duration}
                      </span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mt-0.5">
                    {stage.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close details"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Three columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* What to Expect */}
              <div className="bg-cream/60 rounded-xl p-4 border border-cream">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-navy" />
                  <h4 className="text-sm font-bold text-navy">What to Expect</h4>
                </div>
                <ul className="space-y-2">
                  {stage.detail.whatToExpect.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What You Do */}
              <div className="bg-sage/5 rounded-xl p-4 border border-sage/10">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-sage" />
                  <h4 className="text-sm font-bold text-navy">What You Do</h4>
                </div>
                <ul className="space-y-2">
                  {stage.detail.whatYouDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What We Handle */}
              <div className="bg-gold/5 rounded-xl p-4 border border-gold/10">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList className="w-4 h-4 text-gold" />
                  <h4 className="text-sm font-bold text-navy">What We Handle</h4>
                </div>
                <ul className="space-y-2">
                  {stage.detail.whatWeHandle.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Desktop Stage Card ─────────────────────────────────────────── */

function DesktopStageCard({
  stage,
  index,
  onDetail,
}: {
  stage: Stage;
  index: number;
  onDetail: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isAbove = index % 2 === 0; // alternating

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      className="flex flex-col items-center relative"
      style={{ gridColumn: index + 1 }}
    >
      {/* Card - above the line */}
      <div className={`mb-6 ${isAbove ? 'order-1' : 'order-1'}`}>
        <motion.div
          initial={{ opacity: 0, y: isAbove ? -20 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: index * 0.12 + 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`w-full xl:w-64 rounded-2xl p-4 xl:p-5 cursor-pointer group
            glass-morphism-light hover:shadow-xl hover:shadow-gold/5 transition-all duration-500
            hover:-translate-y-1 border border-white/40 hover:border-gold/30`}
          onClick={onDetail}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onDetail();
            }
          }}
        >
          {/* Stage number + duration row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-gold/20 number-glow">
              {stage.number}
            </span>
            <span className="inline-flex items-center gap-1 bg-cream rounded-full px-2.5 py-1">
              <Clock className="w-3 h-3 text-gold" />
              <span className="text-[10px] font-semibold text-navy/60">
                {stage.duration}
              </span>
            </span>
          </div>

          {/* Icon */}
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
            <stage.icon className="w-5 h-5 text-gold" />
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">
            {stage.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {stage.description}
          </p>

          {/* Fun fact */}
          <div className="flex items-start gap-1.5 bg-gold/5 rounded-lg p-2">
            <Lightbulb className="w-3.5 h-3.5 text-gold mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-navy/60 leading-relaxed">
              {stage.funFact}
            </p>
          </div>

          {/* "Click for details" hint */}
          <div className="mt-3 flex items-center gap-1 text-gold/0 group-hover:text-gold/60 transition-colors duration-300">
            <span className="text-[10px] font-medium">View details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>
      </div>

      {/* Node circle on the timeline */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.12 + 0.3,
          type: 'spring',
          stiffness: 200,
        }}
        className="relative z-10 order-2"
      >
        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/20 border-4 border-cream">
          <stage.icon className="w-4 h-4 text-white" />
        </div>
        {/* Pulsing ring */}
        <motion.div
          animate={isInView ? { scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
          className="absolute inset-0 rounded-full border-2 border-gold/30"
        />
      </motion.div>

      {/* Space below for zigzag */}
      <div className="h-6 order-3" />
    </motion.div>
  );
}

/* ─── Mobile Stage Card ──────────────────────────────────────────── */

function MobileStageCard({
  stage,
  index,
  onDetail,
}: {
  stage: Stage;
  index: number;
  onDetail: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex gap-4 relative"
    >
      {/* Timeline node */}
      <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
        <motion.div
          animate={isInView ? { scale: [0, 1.15, 1] } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="w-10 h-10 sm:w-11 sm:h-11 bg-gold rounded-full flex items-center justify-center shadow-md"
        >
          <stage.icon className="w-5 h-5 text-white" />
        </motion.div>
        {/* Connector to next */}
        {index < stages.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            className="w-0.5 flex-1 bg-gradient-to-b from-gold/40 to-gold/10 origin-top mt-2"
            style={{ minHeight: '20px' }}
          />
        )}
      </div>

      {/* Card content */}
      <div className="flex-1 pb-8">
        <div
          className="glass-morphism-light rounded-xl p-4 cursor-pointer group min-w-0
            hover:shadow-lg hover:shadow-gold/5 hover:border-gold/30
            transition-all duration-300 border border-white/40"
          onClick={onDetail}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onDetail();
            }
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gold/25 number-glow">
                {stage.number}
              </span>
              <span className="text-xs font-bold text-gold tracking-wider">
                STAGE {stage.number}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 bg-cream rounded-full px-2 py-0.5">
              <Clock className="w-3 h-3 text-gold" />
              <span className="text-[10px] font-medium text-navy/60">
                {stage.duration}
              </span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-navy mb-1.5 group-hover:text-gold transition-colors duration-300">
            {stage.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-xs leading-relaxed mb-2.5">
            {stage.description}
          </p>

          {/* Fun fact */}
          <div className="flex items-start gap-1.5 bg-gold/5 rounded-lg p-2">
            <Lightbulb className="w-3.5 h-3.5 text-gold mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-navy/60 leading-relaxed">
              {stage.funFact}
            </p>
          </div>

          {/* Detail hint */}
          <div className="mt-2 flex items-center gap-1 text-gold/0 group-hover:text-gold/60 transition-colors duration-300">
            <span className="text-[10px] font-medium">Tap for details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Background Pattern ─────────────────────────────────────────── */

function JourneyBackground({ parallaxY }: { parallaxY: number }) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ y: parallaxY }}
    >
      {/* Gradient orbs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gold/[0.04] blur-3xl animate-float-decor" />
      <div className="absolute top-1/3 -right-16 w-72 h-72 rounded-full bg-sage/[0.03] blur-3xl animate-float-delayed-decor" />
      <div className="absolute -bottom-10 left-1/4 w-56 h-56 rounded-full bg-gold-light/[0.03] blur-3xl animate-float-decor" />

      {/* Dot pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="journey-dots"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#0B1D3A" />
            <circle cx="16" cy="8" r="0.7" fill="#0B1D3A" />
            <circle cx="10" cy="20" r="0.9" fill="#0B1D3A" />
            <circle cx="24" cy="24" r="0.5" fill="#0B1D3A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#journey-dots)" />
      </svg>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */

export function ProjectJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const lineProgress = useTransform(scrollYProgress, [0.15, 0.85], ['0%', '100%']);

  const { setEstimateFormOpen } = useAppStore();
  const [activeStage, setActiveStage] = useState<Stage | null>(null);

  return (
    <>
      <section
        ref={sectionRef}
        className="py-20 md:py-28 bg-cream relative overflow-hidden"
      >
        {/* Background */}
        <JourneyBackground parallaxY={parallaxY} />

        {/* Top shimmer accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-light/60 to-transparent"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Section Header ── */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14 md:mb-20"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={headerInView ? { width: '3rem' } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[2px] bg-gradient-to-r from-transparent to-gold mx-auto mb-6"
            />
            <p className="text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
              Your Painting Project
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 text-balance">
              The Project{' '}
              <span className="text-shimmer-gold text-shadow-gold">Journey</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
              From your first call to the final walkthrough — here&apos;s exactly what to expect at every step.
              Click any stage to explore the details.
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={headerInView ? { width: '3rem' } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-[2px] bg-gradient-to-l from-transparent to-gold mx-auto mt-6"
            />
          </motion.div>

          {/* ── Desktop: Horizontal Zigzag Timeline ── */}
          <div className="hidden lg:block relative">
            {/* Gold connecting line track (gray background) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[8%] right-[8%] h-[3px] bg-gray-200/60 rounded-full" />

            {/* Gold connecting line fill (animated) */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-[8%] h-[3px] bg-gradient-to-r from-gold via-gold-light to-gold rounded-full origin-left"
              style={{ width: lineProgress, right: 'auto' }}
            />

            {/* Connection point diamonds */}
            {stages.map((_, i) => {
              const positions = ['8%', '25.6%', '43.2%', '60.8%', '78.4%', '96%'];
              return (
                <div
                  key={`diamond-${i}`}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-gold/20 rotate-45 -translate-x-1/2"
                  style={{ left: positions[i] }}
                />
              );
            })}

            {/* Stage cards in zigzag grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-6 gap-3 xl:gap-4 relative"
              style={{
                gridTemplateRows: 'auto 48px auto',
                alignItems: 'center',
              }}
            >
              {stages.map((stage, index) => (
                <div
                  key={stage.number}
                  className="flex flex-col items-center"
                  style={{
                    gridRow: index % 2 === 0 ? '1 / 2' : '3 / 4',
                    gridColumn: index + 1,
                  }}
                >
                  <DesktopStageCard
                    stage={stage}
                    index={index}
                    onDetail={() => setActiveStage(stage)}
                  />
                </div>
              ))}

              {/* Center nodes row (row 2) */}
              {stages.map((stage, index) => (
                <div
                  key={`node-${stage.number}`}
                  className="flex justify-center"
                  style={{ gridRow: '2 / 3', gridColumn: index + 1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.12 + 0.3,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className="relative"
                  >
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/25 border-[3px] border-cream">
                      <stage.icon className="w-5 h-5 text-white" />
                    </div>
                    {/* Pulsing ring */}
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                      className="absolute inset-0 rounded-full border-2 border-gold/25"
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Mobile / Tablet: Vertical Timeline ── */}
          <div className="lg:hidden relative">
            {/* Vertical line track */}
            <div className="absolute left-[22px] top-0 bottom-0 w-[3px] bg-gray-200/60 rounded-full" />

            {/* Vertical line fill */}
            <motion.div
              className="absolute left-[22px] top-0 w-[3px] bg-gradient-to-b from-gold via-gold-light to-gold rounded-full origin-top"
              style={{ height: lineProgress }}
            />

            <div className="space-y-1">
              {stages.map((stage, index) => (
                <MobileStageCard
                  key={stage.number}
                  stage={stage}
                  index={index}
                  onDetail={() => setActiveStage(stage)}
                />
              ))}
            </div>
          </div>

          {/* ── Summary Row ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 md:mt-20"
          >
            <div className="glass-morphism-light rounded-2xl p-6 sm:p-8 border border-white/40">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left info */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
                  {/* Timeline stat */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">
                        Average project timeline
                      </p>
                      <p className="text-xs text-gray-500">
                        5-7 days from inquiry to completion
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-10 bg-gray-200" />

                  {/* Relax stat */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-sage" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">
                        Zero-stress experience
                      </p>
                      <p className="text-xs text-gray-500">
                        We handle all prep work, so you can relax
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => setEstimateFormOpen(true)}
                  className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 animate-glow-pulse whitespace-nowrap flex-shrink-0"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stage Detail Popover ── */}
      <AnimatePresence>
        {activeStage && (
          <StageDetailPopover
            stage={activeStage}
            onClose={() => setActiveStage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
