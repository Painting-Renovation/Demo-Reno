'use client';

import { motion } from 'framer-motion';
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
  },
  {
    icon: FileText,
    step: '02',
    title: 'Custom Proposal',
    description: 'Receive a detailed, transparent proposal tailored to your project. No hidden fees — just clear, honest pricing.',
    color: 'bg-navy',
  },
  {
    icon: PaintBucket,
    step: '03',
    title: 'Expert Painting',
    description: 'Our skilled, background-checked team brings your vision to life with premium materials and meticulous craftsmanship.',
    color: 'bg-sage',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Final Walkthrough',
    description: 'We ensure every detail meets your expectations with a comprehensive walkthrough and clean-up before we leave.',
    color: 'bg-gold',
  },
];

export function Process() {
  const { setEstimateFormOpen } = useAppStore();

  return (
    <section id="process" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            ProCoat Painters
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our simple 4-step process makes it easy to transform your space with confidence.
          </p>
        </motion.div>

        {/* Steps - Desktop Horizontal */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-gold via-navy to-sage" />
          {/* Dashed overlay */}
          <div className="absolute top-24 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-white/30" />

          <div className="grid grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Number Circle */}
                <div className="relative z-10 mb-6">
                  <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gold">
                    <span className="text-xs font-bold text-navy">{step.step}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-[88px] -right-4 z-10">
                    <ArrowRight className="w-6 h-6 text-gold/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps - Mobile Vertical */}
        <div className="md:hidden space-y-8 relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-navy to-sage" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 relative"
            >
              {/* Circle */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center shadow-md`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-8 border-l-2 border-dashed border-gray-300" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gold">STEP {step.step}</span>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Ready to get started? The first step is just a phone call away.
          </p>
          <Button
            onClick={() => setEstimateFormOpen(true)}
            className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Schedule Your Free Estimate
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
