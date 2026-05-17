'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const Process = dynamic(
  () => import('@/components/website/Process').then((m) => ({ default: m.Process })),
  { ssr: false }
);
const ProjectJourney = dynamic(
  () => import('@/components/website/ProjectJourney').then((m) => ({ default: m.ProjectJourney })),
  { ssr: false }
);
import {
  ArrowRight,
  ShieldCheck,
  PaintBucket,
  ClipboardCheck,
  ThumbsUp,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const timelineSteps = [
  {
    day: 'Day 1',
    title: 'Preparation & Protection',
    description:
      'We arrive on time, cover and protect your furniture and floors, fill any holes or cracks, sand surfaces, and apply primer where needed. Your space is treated with the utmost care.',
    icon: ShieldCheck,
    color: 'bg-navy',
  },
  {
    day: 'Day 2–3',
    title: 'Painting & Application',
    description:
      'Our skilled painters apply premium paint using professional techniques — cutting clean edges, rolling even coats, and maintaining a pristine work area throughout the process.',
    icon: PaintBucket,
    color: 'bg-gold',
  },
  {
    day: 'Day 4',
    title: 'Quality Inspection',
    description:
      'Our crew lead performs a thorough inspection of every surface. We check coverage, touch up any imperfections, and ensure the finish meets our exacting standards.',
    icon: ClipboardCheck,
    color: 'bg-sage',
  },
  {
    day: 'Day 5',
    title: 'Final Walkthrough & Handoff',
    description:
      'We walk through the completed project with you, answer questions, provide care instructions, and make sure you are 100% satisfied before we pack up.',
    icon: ThumbsUp,
    color: 'bg-navy-light',
  },
];

export default function ProcessPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Our Process"
        subtitle="A proven approach that delivers flawless results every time. From consultation to walkthrough, we keep you informed and comfortable throughout."
        breadcrumbs={[{ label: 'Our Process' }]}
      />

      {/* Process Component */}
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
              How We <span className="text-gold">Work</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our streamlined process has been refined over 2,000+ projects to ensure efficiency, quality, and a stress-free experience.
            </p>
          </motion.div>

          <Process />
        </div>
      </section>

      {/* Project Journey */}
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
              Your Project <span className="text-gold">Journey</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Follow along as your project progresses from estimate to completion.
            </p>
          </motion.div>

          <ProjectJourney />
        </div>
      </section>

      {/* What to Expect — Timeline */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              What to <span className="text-gold">Expect</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A typical residential painting project follows this timeline. We&apos;ll communicate any adjustments based on your specific needs.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="relative"
          >
            {/* Vertical connector line - desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-navy via-gold to-sage -translate-x-1/2" />

            {/* Vertical connector line - mobile */}
            <div className="lg:hidden absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-navy via-gold to-sage" />

            <div className="space-y-8 lg:space-y-0">
              {timelineSteps.map((step, i) => {
                const Icon = step.icon;
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={step.day}
                    variants={item}
                    className={`relative lg:flex lg:items-center lg:mb-16 ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Dot on the center line - desktop */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gold border-4 border-cream z-10 shadow-md" />

                    {/* Dot on the line - mobile */}
                    <div className="lg:hidden absolute left-3.5 -translate-x-1/2 top-8 w-5 h-5 rounded-full bg-gold border-4 border-cream z-10 shadow-md" />

                    {/* Content card */}
                    <div
                      className={`w-full lg:w-5/12 ${
                        isEven ? 'lg:pr-16' : 'lg:pl-16'
                      } pl-10 lg:pl-0`}
                    >
                      <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-gold font-bold text-sm tracking-wide uppercase">
                              {step.day}
                            </span>
                            <h3 className="text-lg font-bold text-navy">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden lg:block lg:w-5/12" />
                  </motion.div>
                );
              })}
            </div>
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
                Ready to <span className="text-gold">Get Started</span>?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Let&apos;s walk through your project together. Book a free
                consultation and see our process in action.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Book a Free Consultation
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
