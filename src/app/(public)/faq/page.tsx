'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const FAQ = dynamic(
  () => import('@/components/website/FAQ').then((m) => ({ default: m.FAQ })),
  { ssr: false }
);
import { ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react';

export default function FAQPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our painting services, process, pricing, and guarantees. Can't find an answer? We're here to help."
        breadcrumbs={[{ label: 'FAQ' }]}
      />

      {/* FAQ Component */}
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
              Common <span className="text-gold">Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Browse our most frequently asked questions below. Click any question to expand the answer.
            </p>
          </motion.div>

          <FAQ />
        </div>
      </section>

      {/* Still Have Questions — CTA */}
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
              <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-gold" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Still Have <span className="text-gold">Questions</span>?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Our team is happy to help. Reach out through any of the channels below and we&apos;ll get back to you within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  Get a Free Estimate
                </Link>
              </div>

              {/* Contact options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
                <div className="flex flex-col items-center gap-2 text-white/60 p-3 sm:p-4">
                  <Phone className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-white/80">
                    (437) 535-0494
                  </span>
                  <span className="text-xs">Mon–Sat, 8am–6pm</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-white/60 p-4">
                  <Mail className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-white/80">
                    infoinandoutdemolition@gmail.com
                  </span>
                  <span className="text-xs">Response within 24hrs</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-white/60 p-4">
                  <MessageCircle className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-white/80">
                    Live Chat
                  </span>
                  <span className="text-xs">Available during hours</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
