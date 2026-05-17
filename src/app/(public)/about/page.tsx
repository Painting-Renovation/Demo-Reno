'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Clock,
  Heart,
  MessageSquare,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  Users,
} from 'lucide-react';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const TeamSection = dynamic(
  () => import('@/components/website/TeamSection').then((m) => ({ default: m.TeamSection })),
  { ssr: false }
);
const EnhancedTeam = dynamic(
  () => import('@/components/website/EnhancedTeam').then((m) => ({ default: m.EnhancedTeam })),
  { ssr: false }
);

const milestones = [
  { year: '2009', title: 'Founded in Toronto', description: 'James Mitchell starts ProCoat Painters with a mission to deliver artist-quality results with professional reliability.' },
  { year: '2012', title: 'First 500 Projects', description: 'Reached our first major milestone — 500 completed projects across the GTA with a 98% satisfaction rate.' },
  { year: '2015', title: 'Team Expansion', description: 'Grew to a team of 15+ skilled painters and added commercial painting services to our offerings.' },
  { year: '2018', title: 'Color Consultation Service', description: 'Launched our professional color consultation service with certified designers and premium brand partnerships.' },
  { year: '2021', title: '1,500+ Projects', description: 'Crossed 1,500 completed projects and earned a 4.9/5 rating on Google with over 350 reviews.' },
  { year: '2024', title: '2,000+ & Growing', description: 'Surpassed 2,000 projects completed. Voted Best Painting Company in Toronto by HomeStars readers.' },
];

const values = [
  {
    icon: Award,
    title: 'Quality',
    description: 'We use only premium Benjamin Moore and Sherwin-Williams paints. Every surface is meticulously prepared and finished to the highest standard.',
    color: 'bg-gold/10 text-gold',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'We show up on time, stick to our timeline, and always deliver what we promise. Our 98% on-time completion rate speaks for itself.',
    color: 'bg-sage/10 text-sage',
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    description: 'From the first estimate to the final walkthrough, you\'ll always know exactly what\'s happening. We respond within 2 hours during business hours.',
    color: 'bg-navy/10 text-navy',
  },
  {
    icon: Sparkles,
    title: 'Cleanliness',
    description: 'We treat your home like our own. Drop cloths, shoe covers, and thorough daily cleanup are standard on every project we take on.',
    color: 'bg-gold/10 text-gold',
  },
];

const companyStats = [
  { value: '2,000+', label: 'Projects Completed', detail: 'Across the GTA since 2009' },
  { value: '98%', label: 'Satisfaction Rate', detail: 'Based on post-project surveys' },
  { value: '4.9/5', label: 'Google Rating', detail: 'Over 350 five-star reviews' },
  { value: '53+', label: 'Years Combined Experience', detail: 'Across our expert team' },
];

export default function AboutPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="About ProCoat Painters"
        subtitle="Toronto's trusted painting professionals since 2009. We bring colour, quality, and care to every home and business we serve across the Greater Toronto Area."
        breadcrumbs={[{ label: 'About' }]}
      />

      {/* Company Stats Bar */}
      <section className="bg-navy py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {companyStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gold">{stat.value}</div>
                <div className="text-white font-semibold text-sm mt-1">{stat.label}</div>
                <div className="text-white/40 text-xs mt-0.5">{stat.detail}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Story Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-6">
                <Heart className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Our Story</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">
                Painting Toronto Beautiful{' '}
                <span className="text-gold">Since 2009</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  ProCoat Painters was founded in 2009 by James Mitchell with a
                  simple but powerful mission: to bring the quality and care of a
                  custom artist to every residential and commercial painting project
                  in the Greater Toronto Area.
                </p>
                <p>
                  What started as a one-person operation has grown into a
                  dedicated team of skilled professionals who have completed over
                  2,000 projects across Toronto, North York, Scarborough,
                  Mississauga, Markham, Vaughan, and beyond. From cozy condos to
                  grand Victorian homes and commercial offices, we&apos;ve earned
                  the trust of homeowners and businesses alike.
                </p>
                <p>
                  Our commitment to using premium materials, meticulous surface
                  preparation, and open communication has earned us a 4.9/5 rating
                  on Google and recognition as one of Toronto&apos;s top-rated
                  painting companies on HomeStars.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-navy font-medium">
                  <CheckCircle2 className="w-5 h-5 text-sage" />
                  Licensed &amp; Insured
                </div>
                <div className="flex items-center gap-2 text-sm text-navy font-medium">
                  <CheckCircle2 className="w-5 h-5 text-sage" />
                  WSIB Compliant
                </div>
                <div className="flex items-center gap-2 text-sm text-navy font-medium">
                  <CheckCircle2 className="w-5 h-5 text-sage" />
                  5-Year Warranty
                </div>
                <div className="flex items-center gap-2 text-sm text-navy font-medium">
                  <CheckCircle2 className="w-5 h-5 text-sage" />
                  BBB A+ Rated
                </div>
              </div>
            </motion.div>

            {/* Right: Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="space-y-6">
                {milestones.map((milestone, i) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-gold text-xs font-bold">{milestone.year}</span>
                      </div>
                      {i < milestones.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gold/20 mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-navy font-bold text-sm mb-1">{milestone.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why ProCoat Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-4 py-1.5 mb-5">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-navy text-sm font-medium">Our Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
              Why <span className="text-gold">ProCoat</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              These core values guide every brush stroke and every interaction with our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <TeamSection />

      {/* Enhanced Team Flip Cards */}
      <EnhancedTeam />

      {/* CTA Section */}
      <section className="bg-navy py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-sage/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Paintbrush className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Work With the Best?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Let our experienced team transform your space. Get a free
                estimate and discover why thousands of GTA homeowners trust ProCoat.
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
                  href="/gallery"
                  className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  View Our Portfolio
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
