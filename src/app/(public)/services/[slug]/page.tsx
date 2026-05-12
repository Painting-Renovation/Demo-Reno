'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  DollarSign,
  CheckCircle2,
  ChevronDown,
  Shield,
  Star,
  Phone,
  MapPin,
} from 'lucide-react';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { servicesData, getServiceBySlug } from '@/lib/services-data';
import { useAppStore } from '@/lib/store';

/* ── FAQ Accordion Item ── */
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-colors duration-200 hover:border-gold/40">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left px-6 py-5 bg-white hover:bg-cream/50 transition-colors duration-200"
      >
        <span className="font-semibold text-navy pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 leading-relaxed bg-white">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Process Step ── */
function ProcessStep({
  number,
  step,
  description,
  color,
  isLast,
}: {
  number: number;
  step: string;
  description: string;
  color: string;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-6 relative">
      {/* Vertical Line */}
      {!isLast && (
        <div
          className="absolute left-[19px] top-12 w-0.5 h-[calc(100%-24px)]"
          style={{ backgroundColor: `${color}25` }}
        />
      )}

      {/* Number Circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white z-10"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>

      {/* Content */}
      <div className="pb-10">
        <h4 className="font-bold text-navy text-lg mb-1">{step}</h4>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ── 404 Not Found Component ── */
function ServiceNotFound() {
  return (
    <main className="bg-cream min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-gold mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-3">
          Service Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn&apos;t find the service you&apos;re looking for. It may have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Services
        </Link>
      </div>
    </main>
  );
}

/* ── Main Service Detail Page ── */
export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const service = getServiceBySlug(slug);
  const setEstimateFormOpen = useAppStore((s) => s.setEstimateFormOpen);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Handle 404
  if (!service) {
    return <ServiceNotFound />;
  }

  const Icon = service.icon;

  const relatedServices = servicesData.filter((s) =>
    service.relatedServices.includes(s.slug)
  );

  return (
    <main className="bg-cream">
      {/* Hero */}
      <PageHero
        title={service.name}
        subtitle={service.tagline}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: service.name },
        ]}
      />

      {/* Key Info Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${service.color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color: service.color }} />
              </div>
              <span className="text-navy font-bold text-lg">
                {service.name}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-cream rounded-xl px-5 py-3">
              <DollarSign className="w-5 h-5 text-gold" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Average Price
                </div>
                <div className="text-navy font-bold">{service.avgPrice}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-cream rounded-xl px-5 py-3">
              <Clock className="w-5 h-5 text-gold" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Duration
                </div>
                <div className="text-navy font-bold">{service.duration}</div>
              </div>
            </div>

            <button
              onClick={() => setEstimateFormOpen(true)}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25"
            >
              Get Free Estimate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Long Description */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* About This Service */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-navy mb-6">
                  About This Service
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.longDescription}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-navy mb-8">
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-50 hover:border-gold/20 transition-colors duration-200"
                    >
                      <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-navy mb-3">
                  Our Process
                </h2>
                <p className="text-gray-500 mb-8">
                  A proven 4-step approach that ensures quality results on every
                  project.
                </p>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  {service.process.map((step, i) => (
                    <ProcessStep
                      key={step.step}
                      number={i + 1}
                      step={step.step}
                      description={step.description}
                      color={service.color}
                      isLast={i === service.process.length - 1}
                    />
                  ))}
                </div>
              </motion.div>

              {/* FAQ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-navy mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-500 mb-8">
                  Common questions about our {service.name.toLowerCase()}{' '}
                  service.
                </p>
                <div className="space-y-3">
                  {service.faq.map((faq, i) => (
                    <FAQItem
                      key={faq.question}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFAQ === i}
                      onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Quote Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-navy rounded-2xl p-8 text-white sticky top-32"
              >
                <h3 className="text-xl font-bold mb-2">
                  {service.cta}
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  Get a personalized quote for your{' '}
                  {service.name.toLowerCase()} project. Free, no obligation.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 uppercase">
                        Starting from
                      </div>
                      <div className="font-bold text-gold">
                        {service.avgPrice}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 uppercase">
                        Typical duration
                      </div>
                      <div className="font-bold text-gold">
                        {service.duration}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEstimateFormOpen(true)}
                  className="w-full bg-gold hover:bg-gold-light text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 flex items-center justify-center gap-2"
                >
                  Get Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Or call (416) 555-0123</span>
                </div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h4 className="font-bold text-navy mb-4">Why Trust Us</h4>
                <div className="space-y-4">
                  {[
                    {
                      icon: Shield,
                      title: '5-Year Warranty',
                      desc: 'Full workmanship guarantee',
                    },
                    {
                      icon: Star,
                      title: '4.9/5 Rating',
                      desc: '500+ verified reviews',
                    },
                    {
                      icon: CheckCircle2,
                      title: 'Licensed & Insured',
                      desc: '$5M liability coverage',
                    },
                    {
                      icon: MapPin,
                      title: 'Toronto & GTA',
                      desc: 'Serving since 2009',
                    },
                  ].map((badge) => (
                    <div key={badge.title} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center flex-shrink-0">
                        <badge.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-navy font-semibold text-sm">
                          {badge.title}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {badge.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-navy mb-3">
                Related Services
              </h2>
              <p className="text-gray-500">
                You might also be interested in these services.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((related, i) => {
                const RelIcon = related.icon;
                return (
                  <motion.div
                    key={related.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Link
                      href={`/services/${related.slug}`}
                      className="group block bg-cream rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-transparent hover:border-gold/20"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${related.color}15` }}
                      >
                        <RelIcon
                          className="w-6 h-6"
                          style={{ color: related.color }}
                        />
                      </div>
                      <h3 className="font-bold text-navy text-lg mb-1 group-hover:text-gold transition-colors duration-200">
                        {related.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {related.tagline}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{related.avgPrice}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{related.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gold font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-200">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-navy py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Contact us today for a free estimate on your{' '}
              {service.name.toLowerCase()} project. No obligation, just honest
              advice.
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
                href="/services"
                className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
