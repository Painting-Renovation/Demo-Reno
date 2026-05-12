'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const ReviewsShowcase = dynamic(
  () => import('@/components/website/ReviewsShowcase').then((m) => ({ default: m.ReviewsShowcase })),
  { ssr: false }
);
import { Star, ExternalLink, ArrowRight } from 'lucide-react';

const reviewSources = [
  {
    name: 'Google',
    rating: 4.9,
    reviews: '250+',
    color: 'bg-blue-50 border-blue-100',
    text: 'text-blue-700',
    accent: 'from-blue-400 to-blue-600',
  },
  {
    name: 'HomeStars',
    rating: 4.8,
    reviews: '75+',
    color: 'bg-green-50 border-green-100',
    text: 'text-green-700',
    accent: 'from-green-400 to-green-600',
  },
  {
    name: 'Houzz',
    rating: 5.0,
    reviews: '25+',
    color: 'bg-orange-50 border-orange-100',
    text: 'text-orange-700',
    accent: 'from-orange-400 to-orange-600',
  },
];

export default function ReviewsPage() {
  return (
    <main className="bg-cream">
      {/* Hero */}
      <PageHero
        title="Client Reviews"
        subtitle="350+ verified reviews from real homeowners across the GTA. See why our customers consistently rate us among the best painting companies in Toronto."
        breadcrumbs={[{ label: 'Reviews' }]}
      />

      {/* Reviews Showcase Component */}
      <ReviewsShowcase />

      {/* Review Sources Section */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-8 dark-texture-bg">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Review <span className="text-gold">Sources</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Our reputation is verified across the most trusted review
              platforms in the home improvement industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {reviewSources.map((source, i) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                {/* Platform icon circle */}
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${source.accent} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                >
                  <span className="text-white font-bold text-lg">
                    {source.name.charAt(0)}
                  </span>
                </div>

                <h3 className="text-white font-bold text-xl mb-2">
                  {source.name}
                </h3>

                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${
                        s <= Math.floor(source.rating)
                          ? 'fill-gold text-gold'
                          : s === Math.ceil(source.rating) &&
                            source.rating % 1 !== 0
                            ? 'fill-gold/40 text-gold/40'
                            : 'fill-gold text-gold'
                      }`}
                    />
                  ))}
                </div>

                {/* Rating */}
                <div className="text-gold font-bold text-3xl mb-1 number-glow">
                  {source.rating}
                </div>

                {/* Review count */}
                <div className="text-white/50 text-sm">
                  {source.reviews} verified reviews
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-white/40 text-sm">
              Combined average across all platforms:{' '}
              <span className="text-gold font-bold">4.9 out of 5.0</span>{' '}
              from{' '}
              <span className="text-gold font-bold">350+ verified reviews</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Write a Review CTA */}
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
              <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center mx-auto mb-6">
                <Star className="w-7 h-7 text-gold fill-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Write a Review
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Had a great experience with ProCoat? We&apos;d love to hear about
                it! Your feedback helps us improve and helps other homeowners find
                the right painter.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Write a Review
                  <ExternalLink className="w-5 h-5" />
                </Link>
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  Get Your Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
