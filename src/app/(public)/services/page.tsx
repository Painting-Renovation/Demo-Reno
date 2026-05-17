'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { servicesData } from '@/lib/services-data';
import { useAppStore } from '@/lib/store';

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

export default function ServicesPage() {
  const setEstimateFormOpen = useAppStore((s) => s.setEstimateFormOpen);

  return (
    <main className="bg-cream">
      <PageHero
        title="Our Services"
        subtitle="Professional painting services tailored to your needs. From interior transformations to commercial projects, we deliver exceptional results every time."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {servicesData.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.slug} variants={item}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  >
                    {/* Card Top Accent */}
                    <div
                      className="h-2 w-full"
                      style={{ backgroundColor: service.color }}
                    />

                    <div className="p-8">
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${service.color}15` }}
                      >
                        <Icon
                          className="w-7 h-7"
                          style={{ color: service.color }}
                        />
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-200">
                        {service.name}
                      </h3>

                      {/* Tagline */}
                      <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                        {service.tagline}
                      </p>

                      {/* Description */}
                      <p className="text-gray-500 mb-6 text-sm leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      {/* Price & Duration */}
                      <div className="flex items-center gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <DollarSign className="w-4 h-4 text-gold" />
                          <span className="font-medium">{service.avgPrice}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200" />
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Clock className="w-4 h-4 text-gold" />
                          <span className="font-medium">{service.duration}</span>
                        </div>
                      </div>

                      {/* Top Features Preview */}
                      <div className="space-y-1.5 mb-6">
                        {service.features.slice(0, 3).map((feature) => (
                          <div
                            key={feature}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 3 && (
                          <span className="text-xs text-gray-400 pl-6">
                            +{service.features.length - 3} more features
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why ProCoat Section */}
      <section className="bg-navy py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-gold">ProCoat</span>?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Every project is backed by our commitment to quality, transparency,
              and customer satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '2,000+',
                label: 'Projects Completed',
                detail: 'Across the GTA',
              },
              {
                number: '4.9/5',
                label: 'Average Rating',
                detail: 'Based on 500+ reviews',
              },
              {
                number: '5-Year',
                label: 'Workmanship Warranty',
                detail: 'On all services',
              },
              {
                number: '100%',
                label: 'Satisfaction Guarantee',
                detail: 'Or your money back',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-white font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-white/50 text-sm">{stat.detail}</div>
              </motion.div>
            ))}
          </div>
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
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Not Sure Which Service You Need?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Get a free, no-obligation estimate. Our experts will assess your
                space and recommend the best solution for your needs and budget.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setEstimateFormOpen(true)}
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Get Your Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </button>
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
