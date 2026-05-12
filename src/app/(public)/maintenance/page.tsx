'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { motion } from 'framer-motion';
const MaintenanceTips = dynamic(
  () => import('@/components/website/MaintenanceTips').then((m) => ({ default: m.MaintenanceTips })),
  { ssr: false }
);
const SeasonalTips = dynamic(
  () => import('@/components/website/SeasonalTips').then((m) => ({ default: m.SeasonalTips })),
  { ssr: false }
);
import { ArrowRight, Shield, Clock, Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Maintenance Tips"
        subtitle="Keep your paint looking fresh year-round."
        breadcrumbs={[{ label: 'Maintenance' }]}
        compact
      />

      {/* Maintenance Tips Component */}
      <MaintenanceTips />

      {/* Seasonal Tips Component */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Seasonal <span className="text-gold">Care Guide</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Every season brings unique challenges for your paint. Follow our season-by-season
              guide to extend the life of your finish.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SeasonalTips />
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-navy py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: '5-Year Protection',
                description:
                  'With proper maintenance, a quality paint job can last 5–8 years before needing a refresh.',
              },
              {
                icon: Clock,
                title: '2 Hours / Month',
                description:
                  'That\'s all it takes — a quick wipe-down and inspection each month keeps your paint in top shape.',
              },
              {
                icon: Wrench,
                title: '$2,700 – $4,700 Saved',
                description:
                  'Proactive maintenance saves thousands by catching small issues before they become costly repaints.',
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center p-6 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{stat.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{stat.description}</p>
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
                <Wrench className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Time for a <span className="text-gold">Refresh</span>?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                If your paint is showing signs of wear, our team will inspect your space for free
                and recommend the best course of action — whether it&apos;s a touch-up or a full repaint.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Schedule a Free Inspection
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
