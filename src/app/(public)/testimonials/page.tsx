'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import('@/components/website/Testimonials').then((m) => ({ default: m.Testimonials })),
  { ssr: false }
);
const VideoTestimonials = dynamic(
  () => import('@/components/website/VideoTestimonials').then((m) => ({ default: m.VideoTestimonials })),
  { ssr: false }
);
const ReviewsShowcase = dynamic(
  () => import('@/components/website/ReviewsShowcase').then((m) => ({ default: m.ReviewsShowcase })),
  { ssr: false }
);
import { ArrowRight, Star, Quote } from 'lucide-react';

export default function TestimonialsPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Client Testimonials"
        subtitle="Real reviews from real homeowners across the Greater Toronto Area. See why 500+ families trust ProCoat Painters."
        breadcrumbs={[{ label: 'Testimonials' }]}
        backgroundImage="/images/hero-interior.jpg"
      />

      {/* Stats banner */}
      <section className="bg-navy py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '500+', label: 'Happy Customers' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '2,000+', label: 'Projects Completed' },
              { value: '98%', label: 'Would Recommend' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Written Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              What Our <span className="text-gold">Clients Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Don&apos;t just take our word for it — hear directly from the homeowners we&apos;ve worked with.
            </p>
          </motion.div>

          <Testimonials />
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Hear It <span className="text-gold">In Their Words</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Watch video testimonials from real ProCoat clients sharing their experience.
            </p>
          </motion.div>

          <VideoTestimonials />
        </div>
      </section>

      {/* Reviews Showcase */}
      <section className="bg-navy py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Reviews From <span className="text-gold">Across the Web</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              We&apos;re proud of our reputation. See what people are saying on Google, HomeStars, Houzz, and more.
            </p>
          </motion.div>

          <ReviewsShowcase />
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Quote className="w-12 h-12 text-gold/30 mx-auto mb-6" />
            <blockquote className="text-2xl sm:text-3xl font-medium text-navy leading-relaxed mb-6">
              &ldquo;ProCoat transformed our home. The attention to detail was incredible — they treated every room as if it were their own. We couldn&apos;t be happier with the result.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
            <p className="font-semibold text-navy">Sarah & Michael T.</p>
            <p className="text-gray-500 text-sm">Homeowners in Leaside, Toronto</p>
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
                Join Our <span className="text-gold">Happy Clients</span>
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Ready to experience the ProCoat difference? Get your free estimate today and see why hundreds of homeowners choose us.
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
