'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Loader2,
  CheckCircle,
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

const serviceLabels: Record<string, string> = {
  interior: 'Interior Painting',
  exterior: 'Exterior Painting',
  cabinets: 'Cabinet Refinishing',
  commercial: 'Commercial Painting',
  deck: 'Deck & Fence',
  'color-consultation': 'Color Consultation',
};

export default function BookAppointmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setSubmitError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Split full name into first and last
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        serviceType: serviceLabels[formData.serviceType] || formData.serviceType,
        address: formData.address,
        date: formData.preferredDate,
        notes: formData.notes || `Preferred time: ${formData.preferredTime}`,
        duration: 60,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        let errorMsg = 'Something went wrong. Please try again.';
        try {
          const errData = await res.json();
          errorMsg = errData.error || errData.message || errorMsg;
        } catch {
          // use default error message
        }
        setSubmitError(errorMsg);
      }
    } catch {
      setSubmitError('Something went wrong. Please try again or call us at (437) 535-0494.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#5B7B5A]/10 to-[#5B7B5A]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle className="w-10 h-10 text-[#5B7B5A]" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-[#0B1D3A] mb-3"
                >
                  Appointment Booked!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 max-w-md mx-auto mb-2"
                >
                  Thank you, {formData.fullName}! Your consultation has been scheduled.
                  We&apos;ll confirm via email shortly.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 text-sm mb-8"
                >
                  Confirmation sent to <span className="font-medium text-[#0B1D3A]">{formData.email}</span>.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#0B1D3A] hover:bg-[#0B1D3A]/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
                  >
                    Back to Home
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
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
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(437) 535-0494"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Service Needed <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="serviceType"
                        required
                        value={formData.serviceType}
                        onChange={handleChange}
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
                        name="preferredDate"
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Preferred Time <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="preferredTime"
                        required
                        value={formData.preferredTime}
                        onChange={handleChange}
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
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleChange}
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
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any special requirements, accessibility needs, or details about your project..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white resize-none"
                    />
                  </div>

                  {/* Error display */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-red-500 text-xs font-bold">!</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-800">Booking Failed</p>
                            <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
                    whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Book My Appointment
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            )}
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
