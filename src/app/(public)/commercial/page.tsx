'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const CommercialShowcase = dynamic(
  () => import('@/components/website/CommercialShowcase').then((m) => ({ default: m.CommercialShowcase })),
  { ssr: false }
);
import { ArrowRight, Building2, ShoppingBag, UtensilsCrossed, HeartPulse, Factory, GraduationCap } from 'lucide-react';

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

const industries = [
  {
    icon: Building2,
    title: 'Office Spaces',
    description:
      'Create a productive and professional environment with minimal downtime. After-hours and weekend scheduling available.',
    color: '#3B82F6',
  },
  {
    icon: ShoppingBag,
    title: 'Retail Stores',
    description:
      'Attract customers with a fresh, inviting storefront. We work around your operating hours to keep your business running.',
    color: '#C8973E',
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurants & Hospitality',
    description:
      'From dining areas to kitchens, we use low-VOC, commercial-grade paints that meet health and safety standards.',
    color: '#5B7B5A',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare Facilities',
    description:
      'Anti-microbial, low-odor paints for clinics, dental offices, and senior care homes. Infection-control compliant.',
    color: '#EF4444',
  },
  {
    icon: Factory,
    title: 'Industrial & Warehouse',
    description:
      'Heavy-duty coatings for high-traffic areas, loading docks, and manufacturing floors that withstand tough conditions.',
    color: '#6B7280',
  },
  {
    icon: GraduationCap,
    title: 'Education Facilities',
    description:
      'Schools, daycares, and universities — we paint during holidays and breaks to ensure a safe, clean learning environment.',
    color: '#8B5CF6',
  },
];

export default function CommercialPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Commercial Painting Services"
        subtitle="Professional spaces deserve professional results."
        breadcrumbs={[{ label: 'Commercial' }]}
        backgroundImage="/images/commercial.jpg"
      />

      {/* Commercial Showcase Component */}
      <CommercialShowcase />

      {/* Industries We Serve */}
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
              Industries <span className="text-gold">We Serve</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From boutique shops to large-scale industrial complexes, we have the expertise,
              crew size, and equipment to handle any commercial project.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.title}
                  variants={item}
                  className="group bg-cream rounded-2xl overflow-hidden border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                >
                  {/* Top accent bar */}
                  <div className="h-1.5 w-full" style={{ backgroundColor: industry.color }} />

                  <div className="p-8">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${industry.color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: industry.color }} />
                    </div>

                    <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-200">
                      {industry.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {industry.description}
                    </p>
                  </div>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your <span className="text-gold">Commercial Space</span>?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Get a detailed commercial painting proposal — includes site assessment, project
                timeline, and a transparent quote. Zero disruption to your operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Request a Proposal
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
