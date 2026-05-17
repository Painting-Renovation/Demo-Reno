'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Zap,
} from 'lucide-react';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import('@/components/website/ContactSection').then((m) => ({ default: m.ContactSection })),
  { ssr: false }
);

const contactDetails = [
  {
    icon: Phone,
    title: 'Phone',
    value: '(437) 535-0494',
    link: 'tel:+14375350494',
    description: 'Call us anytime during business hours for a free consultation.',
    color: 'bg-gold/10 text-gold',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'infoinandoutdemolition@gmail.com',
    link: 'mailto:infoinandoutdemolition@gmail.com',
    description: 'We respond within 2 hours during business hours.',
    color: 'bg-navy/10 text-navy',
  },
  {
    icon: MapPin,
    title: 'Office Address',
    value: '3300 Highway 7 W, Suite 600',
    subValue: 'Vaughan ON L4K 4M3',
    link: 'https://maps.google.com/?q=3300+Highway+7+W+Suite+600+Vaughan+ON',
    description: 'Visit us or request an on-site estimate at your location.',
    color: 'bg-sage/10 text-sage',
  },
];

const businessHours = [
  { day: 'Monday', hours: '8:00 AM – 6:00 PM', open: true },
  { day: 'Tuesday', hours: '8:00 AM – 6:00 PM', open: true },
  { day: 'Wednesday', hours: '8:00 AM – 6:00 PM', open: true },
  { day: 'Thursday', hours: '8:00 AM – 6:00 PM', open: true },
  { day: 'Friday', hours: '8:00 AM – 6:00 PM', open: true },
  { day: 'Saturday', hours: '9:00 AM – 3:00 PM', open: true },
  { day: 'Sunday', hours: 'Closed', open: false },
];

const faqTeaser = [
  {
    question: 'How much does a painting project typically cost?',
    answer: 'Costs vary based on scope, room size, and paint quality. We offer free estimates with no hidden fees.',
  },
  {
    question: 'How long does a typical job take?',
    answer: 'A standard room takes 1–2 days. Full interiors take 3–7 days depending on size and complexity.',
  },
  {
    question: 'Do you provide paint and materials?',
    answer: 'Yes! We use premium Benjamin Moore and Sherwin-Williams paints. All materials are included.',
  },
  {
    question: 'Are you licensed and insured?',
    answer: 'Absolutely. We are fully licensed in Ontario with comprehensive liability insurance and WSIB coverage.',
  },
];

export default function ContactPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our team for a free consultation, estimate, or any questions about our painting services. We're here to help."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      {/* Contact Information Cards */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Contact <span className="text-gold">Information</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Reach us through any of the channels below. We&apos;re always happy to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactDetails.map((detail, i) => (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <a
                  href={detail.link}
                  className="block bg-cream rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group h-full"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${detail.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <detail.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{detail.title}</h3>
                  <p className="text-navy font-semibold mb-1">{detail.value}</p>
                  {detail.subValue && (
                    <p className="text-gray-500 text-sm mb-3">{detail.subValue}</p>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed">{detail.description}</p>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 sm:py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hours Table */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-6">
                <Clock className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Hours</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-8">
                Business Hours
              </h2>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {businessHours.map((item, i) => (
                  <div
                    key={item.day}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i < businessHours.length - 1 ? 'border-b border-gray-50' : ''
                    } ${!item.open ? 'opacity-60' : ''}`}
                  >
                    <span className="text-navy font-medium">{item.day}</span>
                    <div className="flex items-center gap-2">
                      {item.open && (
                        <span className="w-2 h-2 bg-sage rounded-full" />
                      )}
                      <span className={`text-sm font-medium ${item.open ? 'text-gray-600' : 'text-gray-400'}`}>
                        {item.hours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 bg-sage/10 border border-sage/20 rounded-xl px-5 py-3">
                <Zap className="w-5 h-5 text-sage flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  <strong className="text-navy">Quick response guaranteed:</strong> We respond to all inquiries within 2 hours during business hours.
                </p>
              </div>
            </motion.div>

            {/* Map Placeholder & Service Areas */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <div className="map-placeholder rounded-2xl aspect-video h-56 sm:h-72 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-navy/30" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
                    <MapPin className="w-8 h-8 text-gold" />
                  </div>
                  <p className="text-white/90 font-semibold mb-1">3300 Highway 7 W, Suite 600</p>
                  <p className="text-white/50 text-sm mb-4">Vaughan ON L4K 4M3</p>
                  <a
                    href="https://maps.google.com/?q=3300+Highway+7+W+Suite+600+Vaughan+ON"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 rounded-full px-5 py-2.5 border border-white/20 transition-all duration-300 text-white text-sm font-semibold hover:-translate-y-0.5"
                  >
                    Open in Google Maps
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Service Areas CTA */}
              <div className="bg-navy rounded-2xl p-6 sm:p-8 text-center">
                <MapPin className="w-8 h-8 text-gold mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Service Areas</h3>
                <p className="text-white/60 text-sm mb-5 leading-relaxed">
                  We serve the entire Greater Toronto Area including Toronto, North York, Scarborough, Mississauga, Markham, Vaughan, Richmond Hill, and more.
                </p>
                <Link
                  href="/service-areas"
                  className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:text-gold-light transition-colors"
                >
                  View Full Service Areas
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactSection />

      {/* FAQ Teaser */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-5">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Quick answers to the most common questions about our painting services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {faqTeaser.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300"
              >
                <h3 className="text-white font-semibold text-sm mb-2">{faq.question}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
            >
              View All FAQs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
