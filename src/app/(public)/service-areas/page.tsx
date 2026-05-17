'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const ServiceAreas = dynamic(
  () => import('@/components/website/ServiceAreas').then((m) => ({ default: m.ServiceAreas })),
  { ssr: false }
);
import { MapPin, ArrowRight, Phone } from 'lucide-react';

const coverageAreas = [
  'Toronto',
  'Mississauga',
  'Brampton',
  'Vaughan',
  'Markham',
  'Richmond Hill',
  'Oakville',
  'Burlington',
  'Scarborough',
  'North York',
  'Etobicoke',
  'Pickering',
  'Ajax',
  'Whitby',
];

export default function ServiceAreasPage() {
  return (
    <main className="bg-cream">
      {/* Hero */}
      <PageHero
        title="Service Areas"
        subtitle="Proudly serving Toronto & the GTA with professional painting services. Check if your area is covered."
        breadcrumbs={[{ label: 'Service Areas' }]}
      />

      {/* Interactive Service Areas Component */}
      <ServiceAreas />

      {/* Our Coverage Section */}
      <section className="bg-navy py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 dark-texture-bg">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our <span className="text-gold">Coverage</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              We serve communities right across the Greater Toronto Area.
              Here&apos;s a quick look at where we operate.
            </p>
          </motion.div>

          {/* Area Tags Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto"
          >
            {coverageAreas.map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -2, scale: 1.05 }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-gold/15 hover:border-gold/30 transition-all cursor-default"
              >
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-white font-medium text-sm">{area}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { number: '14+', label: 'Cities Served' },
              { number: '2,000+', label: 'Projects Completed' },
              { number: '30 min', label: 'Avg. Response Time' },
              { number: '100%', label: 'Coverage Confidence' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-gold mb-1 number-glow">
                  {stat.number}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't See Your Area CTA */}
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
              <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-7 h-7 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Don&apos;t See Your Area?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                We&apos;re always expanding! Contact us and we&apos;ll let you know
                if we can accommodate your location. We regularly serve surrounding
                communities outside our listed areas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+14375350494"
                  className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  <Phone className="w-5 h-5" />
                  (437) 535-0494
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
