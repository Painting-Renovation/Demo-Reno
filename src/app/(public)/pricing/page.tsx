'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const PricingCalculator = dynamic(
  () => import('@/components/website/PricingCalculator').then((m) => ({ default: m.PricingCalculator })),
  { ssr: false }
);
const ROICalculator = dynamic(
  () => import('@/components/website/ROICalculator').then((m) => ({ default: m.ROICalculator })),
  { ssr: false }
);
import {
  ArrowRight,
  Ruler,
  DoorOpen,
  ArrowUpFromLine,
  Paintbrush,
  Droplets,
  HardHat,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const factors = [
  {
    icon: Ruler,
    title: 'Square Footage',
    description:
      'The total area to be painted is the biggest factor in determining cost. Larger spaces require more paint, time, and labor.',
  },
  {
    icon: DoorOpen,
    title: 'Number of Rooms',
    description:
      'More rooms mean more transitions, masking, and detail work. Open-concept spaces may be more efficient to paint.',
  },
  {
    icon: ArrowUpFromLine,
    title: 'Ceiling Height',
    description:
      'Vaulted or high ceilings require specialized equipment, scaffolding, and additional safety measures.',
  },
  {
    icon: Paintbrush,
    title: 'Prep Work Needed',
    description:
      'Patchwork, sanding, priming, and repairing damaged surfaces adds to the timeline and cost of any project.',
  },
  {
    icon: Droplets,
    title: 'Paint Quality',
    description:
      'Premium paints like Benjamin Moore and Sherwin-Williams offer better coverage and durability, but come at a higher price.',
  },
  {
    icon: HardHat,
    title: 'Access & Scaffolding',
    description:
      'Difficult-to-reach areas, exterior heights, and tight spaces may require additional equipment and labor.',
  },
];

export default function PricingPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Pricing"
        subtitle="Get instant estimates and understand how we price our services. Transparent, fair, and competitive — no hidden fees."
        breadcrumbs={[{ label: 'Pricing' }]}
        overlay="gradient"
      />

      {/* Pricing Calculator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Instant <span className="text-gold">Price Estimate</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Use our interactive calculator to get a ballpark estimate for your project in seconds.
            </p>
          </motion.div>

          <PricingCalculator />
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              See Your <span className="text-gold">Return on Investment</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              A fresh coat of paint doesn&apos;t just look great — it adds real value to your home.
            </p>
          </motion.div>

          <ROICalculator />
        </div>
      </section>

      {/* Factors That Affect Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Factors That Affect <span className="text-gold">Pricing</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Every project is unique. Here are the key variables that determine the final cost of your painting job.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {factors.map((factor) => {
              const Icon = factor.icon;
              return (
                <motion.div
                  key={factor.title}
                  variants={item}
                  className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">
                    {factor.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {factor.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-navy rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Get a <span className="text-gold">Custom Quote</span>
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Our estimates are free, detailed, and obligation-free. We&apos;ll assess your space,
                discuss your vision, and provide a transparent breakdown of costs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Get a Custom Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
