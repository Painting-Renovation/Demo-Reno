'use client';

import { motion } from 'framer-motion';
import { Linkedin, Users } from 'lucide-react';

const teamMembers = [
  {
    name: 'James Mitchell',
    title: 'Founder & CEO',
    description: '15+ years in the painting industry',
    initials: 'JM',
    color: 'from-navy to-navy-light',
    accentColor: 'bg-gold',
  },
  {
    name: 'Sarah Rodriguez',
    title: 'Operations Manager',
    description: 'Ensuring every project runs smoothly',
    initials: 'SR',
    color: 'from-sage to-sage-light',
    accentColor: 'bg-navy',
  },
  {
    name: 'David Kim',
    title: 'Lead Painter',
    description: 'Master craftsman with an eye for detail',
    initials: 'DK',
    color: 'from-gold to-gold-light',
    accentColor: 'bg-navy',
  },
  {
    name: 'Emily Chen',
    title: 'Color Consultant',
    description: 'Helping you find the perfect palette',
    initials: 'EC',
    color: 'from-navy-light to-sage',
    accentColor: 'bg-gold',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};

export function TeamSection() {
  return (
    <section className="relative bg-navy py-20 md:py-28 overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(200,151,62,0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-5">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">Our Experts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Meet the{' '}
            <span className="text-gradient-gold">ProCoat Team</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Our dedicated professionals bring passion, expertise, and an unwavering commitment to quality on every project.
          </p>
        </motion.div>

        {/* Team Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              className="group relative"
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white/10 hover:border-gold/30 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(200,151,62,0.15)]">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(200,151,62,0.1) 0%, transparent 70%)',
                  }}
                />

                {/* Avatar */}
                <div className="relative mx-auto mb-5 w-20 h-20">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                    <span className="text-white text-xl font-bold tracking-tight">
                      {member.initials}
                    </span>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-sage rounded-full border-[3px] border-navy" />
                </div>

                {/* Info */}
                <h3 className="text-white font-bold text-lg mb-1 transition-colors duration-300 group-hover:text-gold">
                  {member.name}
                </h3>
                <p className="text-gold/80 text-sm font-medium mb-3">
                  {member.title}
                </p>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {member.description}
                </p>

                {/* Social Link */}
                <button
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all duration-300 cursor-pointer"
                  aria-label={`${member.name} LinkedIn profile`}
                >
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
