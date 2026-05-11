'use client';

import { motion } from 'framer-motion';
import { Shield, Star, FileCheck, Leaf, Users, Clock, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const trustItems = [
  {
    icon: Shield,
    title: 'Licensed & Insured',
    description:
      'Fully licensed with comprehensive liability insurance and WSIB coverage for your complete peace of mind.',
  },
  {
    icon: Star,
    title: '5-Star Google Rating',
    description:
      'Rated 4.9 out of 5 stars on Google with hundreds of verified reviews from satisfied customers.',
  },
  {
    icon: FileCheck,
    title: 'Written Warranty',
    description:
      'Every project comes with a written warranty covering both labor and materials for lasting quality.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Paints',
    description:
      'We use low-VOC and zero-VOC paints from premium brands to protect your family and the environment.',
  },
  {
    icon: Users,
    title: 'Clean & Respectful Crew',
    description:
      'Our professional team treats your home with respect — we clean up daily and leave your space spotless.',
  },
  {
    icon: Clock,
    title: 'On-Time Completion',
    description:
      'We respect your schedule and complete every project on time, with clear communication throughout.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function WhyChooseUs() {
  const { setEstimateFormOpen } = useAppStore();

  return (
    <section className="py-24 bg-cream relative overflow-hidden" id="why-choose-us">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(11,29,58,0.4) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 mb-5 shadow-sm border border-gold/10">
            <Award className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-navy/70 tracking-wide">Trusted Excellence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Why Choose{' '}
            <span className="text-gradient-gold relative">
              ProCoat
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="#C8973E" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Thousands of homeowners across the GTA trust ProCoat Painters for quality work,
            reliable service, and exceptional results.
          </p>
          {/* Gold decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-px bg-gold/30" />
            <div className="w-2 h-2 rounded-full bg-gold/40" />
            <div className="w-16 h-px bg-gradient-to-r from-gold/40 to-gold/10" />
            <div className="w-2 h-2 rounded-full bg-gold/40" />
            <div className="w-8 h-px bg-gold/30" />
          </div>
        </motion.div>

        {/* Trusted badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-md border border-gold/10">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    background: ['#C8973E', '#0B1D3A', '#5B7B5A', '#132D5E', '#E8B94E'][i],
                    zIndex: 5 - i,
                  }}
                >
                  {['JD', 'SK', 'MR', 'AT', 'LP'][i]}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-navy">Trusted by 2,500+ homeowners</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                ))}
                <span className="text-xs text-gray-500 ml-1">4.9/5 average rating</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            const borderColor = index % 2 === 0 ? 'bg-gold' : 'bg-sage';
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="card-shine bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group relative border border-transparent hover:border-gold/20 cursor-default"
              >
                {/* Top colored border */}
                <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${borderColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Numbered counter */}
                <div className="absolute top-6 right-6">
                  <span className="text-4xl font-black text-gray-100 group-hover:text-gold/10 transition-colors duration-500 number-glow">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex-shrink-0 w-14 h-14 bg-gold/10 group-hover:bg-gold/20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p className="text-gray-500 text-lg mb-6">
            Ready to experience the ProCoat difference?
          </p>
          <Button
            onClick={() => setEstimateFormOpen(true)}
            className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Your Free Estimate
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
