'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { motion } from 'framer-motion';
const GuaranteeSection = dynamic(
  () => import('@/components/website/GuaranteeSection').then((m) => ({ default: m.GuaranteeSection })),
  { ssr: false }
);
import { ArrowRight, ShieldCheck, Phone, Search, Wrench, BadgeCheck, Layers, Droplets, Target, Award } from 'lucide-react';

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

const whatCovered = [
  {
    icon: Layers,
    title: 'Peeling',
    description: 'Paint lifting or flaking from the surface within the warranty period.',
  },
  {
    icon: Droplets,
    title: 'Blistering',
    description: 'Bubbles or blisters forming under the paint due to moisture or application issues.',
  },
  {
    icon: Target,
    title: 'Adhesion Failure',
    description: 'Paint not properly bonding to the surface, leading to chipping or peeling.',
  },
  {
    icon: BadgeCheck,
    title: 'Color Match Issues',
    description: 'The final color doesn\'t match the approved sample or swatch you selected.',
  },
  {
    icon: Award,
    title: 'Workmanship Quality',
    description: 'Visible brush marks, drips, uneven coverage, or poor edge work from our team.',
  },
];

const claimSteps = [
  {
    step: 1,
    icon: Phone,
    title: 'Call Us',
    description: 'Reach out to our team at any time. Describe the issue and we\'ll log your claim immediately.',
  },
  {
    step: 2,
    icon: Search,
    title: 'We\'ll Inspect',
    description: 'A project manager will visit your property within 48 hours to assess the issue firsthand.',
  },
  {
    step: 3,
    icon: Wrench,
    title: 'We Fix It',
    description: 'Our crew will complete the necessary repairs using the same premium materials and methods.',
  },
  {
    step: 4,
    icon: ShieldCheck,
    title: 'No Charge',
    description: 'If the issue falls under our guarantee, the repair is completely free — no questions asked.',
  },
];

export default function GuaranteePage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Our Satisfaction Guarantee"
        subtitle="We stand behind every brushstroke."
        breadcrumbs={[{ label: 'Guarantee' }]}
      />

      {/* Guarantee Section Component */}
      <GuaranteeSection />

      {/* What's Covered */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold font-semibold px-4 py-2 rounded-full text-sm mb-6">
              <ShieldCheck className="w-4 h-4" />
              5-Year Workmanship Warranty
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              What&apos;s <span className="text-gold">Covered</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our comprehensive guarantee protects you against common paint failures and
              workmanship issues for up to 5 years after project completion.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {whatCovered.map((coverage) => {
              const Icon = coverage.icon;
              return (
                <motion.div
                  key={coverage.title}
                  variants={item}
                  className="group bg-cream rounded-2xl p-8 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{coverage.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{coverage.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Warranty badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm">
              All claims must be filed within the warranty period. Normal wear and tear, damage
              from environmental factors beyond our control, and modifications by third parties
              are not covered. Full terms provided with every project contract.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How to Make a Claim */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How to Make a <span className="text-gold">Claim</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              We keep the process simple and stress-free. Four steps is all it takes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {claimSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center h-full hover:border-gold/30 transition-colors duration-300">
                    {/* Step number */}
                    <div className="w-10 h-10 rounded-full bg-gold text-white font-bold text-lg flex items-center justify-center mx-auto mb-5">
                      {step.step}
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Connector arrow (not on last item) */}
                  {i < claimSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-gold/40" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
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
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Experience the ProCoat <span className="text-gold">Difference</span>
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Every project comes with our 5-year workmanship warranty and 100% satisfaction
                guarantee. Book your free estimate today and paint with confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Get Your Free Estimate
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
