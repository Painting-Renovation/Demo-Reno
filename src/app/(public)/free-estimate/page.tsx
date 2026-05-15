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
  Phone,
  ShieldCheck,
  Star,
  Award,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  ThumbsUp,
  Send,
  Loader2,
  CheckCircle,
} from 'lucide-react';

const steps = [
  {
    icon: Phone,
    title: 'We\'ll Call You Within 24 Hours',
    description:
      'Our friendly team will reach out to discuss your project, answer your questions, and schedule a convenient time for an on-site visit.',
  },
  {
    icon: CalendarCheck,
    title: 'Free On-Site Consultation',
    description:
      'We visit your property to assess the scope of work, take measurements, and understand your vision for the space.',
  },
  {
    icon: FileText,
    title: 'Detailed Written Estimate',
    description:
      'You\'ll receive a comprehensive, transparent estimate covering materials, labor, timeline, and any preparation work required.',
  },
  {
    icon: ThumbsUp,
    title: 'No Obligation',
    description:
      'Take your time to review. There\'s zero pressure — we want you to feel 100% confident before moving forward.',
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: 'Licensed' },
  { icon: Award, label: 'Insured' },
  { icon: Star, label: '5-Star Rated' },
  { icon: ClipboardCheck, label: '2,000+ Projects' },
];

const serviceLabels: Record<string, string> = {
  interior: 'Interior Painting',
  exterior: 'Exterior Painting',
  cabinets: 'Cabinet Refinishing',
  commercial: 'Commercial Painting',
  deck: 'Deck & Fence',
  consultation: 'Consultation Only',
};

export default function FreeEstimatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: '',
    propertyType: '',
    preferredDate: '',
    message: '',
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
        projectDesc: formData.message || `Property type: ${formData.propertyType}. Preferred date: ${formData.preferredDate}`,
        leadSource: 'website',
      };

      const res = await fetch('/api/leads', {
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
        title="Get Your Free Estimate"
        subtitle="No obligation, no pressure — just an honest, detailed quote for your painting project. Fill out the form below and we'll get back to you within 24 hours."
        breadcrumbs={[{ label: 'Free Estimate' }]}
        overlay="gradient"
      />

      {/* Trust Badges Strip */}
      <section className="bg-navy py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          >
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="trust-badge-mini"
                >
                  <Icon className="w-5 h-5 text-gold" />
                  <span className="text-xs font-semibold text-navy">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Estimate Form Section */}
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
                  Request Received!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 max-w-md mx-auto mb-2"
                >
                  Thank you! We&apos;ve received your estimate request and will contact you
                  within <span className="font-semibold text-[#0B1D3A]">24 hours</span>.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 text-sm mb-8"
                >
                  Check your email at <span className="font-medium text-[#0B1D3A]">{formData.email}</span> for confirmation.
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
                    Request Your <span className="text-gold">Free Estimate</span>
                  </h2>
                  <p className="text-gray-500 max-w-xl mx-auto">
                    Complete the form below and one of our specialists will contact you
                    within 24 hours with a personalized quote.
                  </p>
                  {/* Decorative underline */}
                  <div className="w-16 h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mt-4" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email row */}
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

                  {/* Phone & Service Type row */}
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
                        Service Type <span className="text-red-400">*</span>
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
                        <option value="consultation">Consultation Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Property Type & Preferred Date row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Property Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="propertyType"
                        required
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      >
                        <option value="" disabled>
                          Select property type...
                        </option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Preferred Date
                      </label>
                      <input
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Tell Us About Your Project
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe the areas you'd like painted, any specific colors or finishes you have in mind, and any other details that would help us prepare an accurate estimate..."
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
                            <p className="text-sm font-medium text-red-800">Submission Failed</p>
                            <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
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
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Free Estimate Request
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

      {/* What Happens Next — Navy Section */}
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
              What Happens <span className="text-gold">Next?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              From the moment you submit your request, we keep you informed every
              step of the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="text-gold font-bold text-sm mb-2">
                    Step {i + 1}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {step.description}
                  </p>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Prefer to Talk to Someone?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Our team is available Monday through Saturday. Give us a call or
                send us a message — we&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+14375350494"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  <Phone className="w-5 h-5" />
                  (437) 535-0494
                </a>
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
