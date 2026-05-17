'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { motion } from 'framer-motion';
const ExpressService = dynamic(
  () => import('@/components/website/ExpressService').then((m) => ({ default: m.ExpressService })),
  { ssr: false }
);
import { ArrowRight, Home as HomeIcon, Calendar, Tag, PartyPopper, AlertTriangle } from 'lucide-react';

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

const whenToChoose = [
  {
    icon: HomeIcon,
    title: 'Closing on a Home',
    description:
      'Need your new home painted before move-in day? Our express service ensures your space is picture-perfect when you walk through the door.',
  },
  {
    icon: Tag,
    title: 'Listing for Sale',
    description:
      'A fresh coat of paint can increase your home\'s perceived value by up to 5%. Get it listed faster with our quick-turnaround painting service.',
  },
  {
    icon: PartyPopper,
    title: 'Special Event',
    description:
      'Hosting a wedding, holiday gathering, or corporate event? We\'ll transform your space in as little as 2–3 days.',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Repair',
    description:
      'Water damage, scuff marks, or last-minute touch-ups? Our emergency crew is ready to respond within 24 hours.',
  },
];

export default function ExpressPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Express Painting Service"
        subtitle="Need it done fast? We've got you covered."
        breadcrumbs={[{ label: 'Express Service' }]}
        overlay="gradient"
      />

      {/* Express Service Component */}
      <ExpressService />

      {/* When to Choose Express */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              When to Choose <span className="text-gold">Express</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Life doesn&apos;t always wait. Here are the most common situations where our express
              service saves the day.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {whenToChoose.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <motion.div
                  key={scenario.title}
                  variants={item}
                  className="group bg-cream rounded-2xl p-8 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-3">{scenario.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{scenario.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
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
                <Calendar className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Need It Done This Week?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Get a free express estimate. Our team will assess your timeline and deliver a
                plan that meets your deadline — guaranteed.
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
