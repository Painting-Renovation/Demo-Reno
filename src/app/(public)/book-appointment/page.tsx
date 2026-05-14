'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import {
  Palette,
  DollarSign,
  Users,
  SquareStack,
  Send,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

const reasons = [
  {
    icon: Palette,
    title: 'Expert Color Advice',
    description:
      'Our color consultant brings physical sample boards to your space, helping you test colors under your actual lighting conditions throughout the day.',
  },
  {
    icon: DollarSign,
    title: 'Accurate Pricing',
    description:
      'Get a detailed, itemized quote on the spot. No hidden fees, no surprises — just transparent pricing you can count on.',
  },
  {
    icon: Users,
    title: 'Meet the Crew',
    description:
      'Get to know the team who will be working in your home or business. We believe trust starts with a face-to-face introduction.',
  },
  {
    icon: SquareStack,
    title: 'See Sample Boards',
    description:
      'Browse our collection of premium finish samples, from Benjamin Moore to Sherwin-Williams, and feel the quality before you commit.',
  },
];

export default function BookAppointmentPage() {
  return (
    <main className="bg-cream">
      {/* Hero */}
      <PageHero
        title="Book an Appointment"
        subtitle="Schedule your free consultation and let our experts bring your vision to life. Choose a time that works best for you."
        breadcrumbs={[{ label: 'Book Appointment' }]}
      />

      {/* Appointment Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
                Schedule Your <span className="text-gold">Consultation</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Pick a date and time that suits you. Our consultations are
                completely free and come with no strings attached.
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mt-4" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-6"
            >
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Phone & Service Needed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(437) 535-0494"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Service Needed <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  >
                    <option value="" disabled>
                      Select a service...
                    </option>
                    <option value="interior">Interior Painting</option>
                    <option value="exterior">Exterior Painting</option>
                    <option value="cabinets">Cabinet Refinishing</option>
                    <option value="commercial">Commercial Painting</option>
                    <option value="deck">Deck &amp; Fence</option>
                    <option value="color-consultation">Color Consultation</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Preferred Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Preferred Time <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  >
                    <option value="" disabled>
                      Select a time...
                    </option>
                    <option value="morning">Morning (8 AM – 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM – 5 PM)</option>
                    <option value="evening">Evening (5 PM – 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Property Address */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Property Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="3300 Highway 7 W, Suite 600, Vaughan ON L4K 4M3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Any special requirements, accessibility needs, or details about your project..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white resize-none"
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg animate-pulse-glow"
              >
                Book My Appointment
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Why Book a Consultation — Navy Section */}
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
              Why Book a <span className="text-gold">Consultation?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Our free in-person consultations are the best way to kick off your
              project with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-10 sm:p-14 text-center border border-gray-100 shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-7 h-7 text-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
              We&apos;re happy to answer any questions before you book. Reach out
              to us directly and we&apos;ll get back to you right away.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg text-lg"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
