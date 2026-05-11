'use client';

import { motion } from 'framer-motion';
import { Shield, Star, FileCheck, Leaf, Users, Clock } from 'lucide-react';

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
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-cream" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Why Choose <span className="text-gradient-gold">ProCoat</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thousands of homeowners across the GTA trust ProCoat Painters for quality work, 
            reliable service, and exceptional results.
          </p>
        </motion.div>

        {/* Trust Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 group-hover:bg-gold/20 rounded-xl flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-navy mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
