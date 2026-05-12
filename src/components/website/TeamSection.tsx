'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Users, Mail, ExternalLink } from 'lucide-react';

const teamMembers = [
  {
    name: 'James Mitchell',
    title: 'Founder & CEO',
    description: '15+ years in the painting industry',
    initials: 'JM',
    color: 'from-navy to-navy-light',
    accentColor: 'text-gold',
    borderColor: 'border-gold/20',
    linkedin: '#',
    email: 'james@procoatpainters.com',
    role: 'Leadership',
  },
  {
    name: 'Sarah Rodriguez',
    title: 'Operations Manager',
    description: 'Ensuring every project runs smoothly',
    initials: 'SR',
    color: 'from-sage to-sage-light',
    accentColor: 'text-sage-light',
    borderColor: 'border-sage/20',
    linkedin: '#',
    email: 'sarah@procoatpainters.com',
    role: 'Operations',
  },
  {
    name: 'David Kim',
    title: 'Lead Painter',
    description: 'Master craftsman with an eye for detail',
    initials: 'DK',
    color: 'from-gold to-gold-light',
    accentColor: 'text-gold-light',
    borderColor: 'border-gold/20',
    linkedin: '#',
    email: 'david@procoatpainters.com',
    role: 'Craftsmanship',
  },
  {
    name: 'Emily Chen',
    title: 'Color Consultant',
    description: 'Helping you find the perfect palette',
    initials: 'EC',
    color: 'from-navy-light to-sage',
    accentColor: 'text-gold',
    borderColor: 'border-gold/20',
    linkedin: '#',
    email: 'emily@procoatpainters.com',
    role: 'Design',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1] as const,
    },
  },
};

function TeamCard({ member }: { member: typeof teamMembers[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -8;
    const tiltY = (x - 0.5) * 8;
    setTiltStyle({
      transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0) rotateY(0) translateY(0)',
      transition: 'transform 0.4s ease-out',
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white/[0.1] hover:border-gold/30 hover:shadow-[0_12px_40px_rgba(200,151,62,0.15)]"
        style={tiltStyle}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(200,151,62,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Role badge */}
        <div className="relative mb-4">
          <span className={`inline-block text-xs font-semibold ${member.accentColor} bg-white/[0.06] border border-white/10 px-3 py-1 rounded-full tracking-wide uppercase`}>
            {member.role}
          </span>
        </div>

        {/* Avatar */}
        <div className="relative mx-auto mb-5 w-22 h-22">
          <div
            className={`w-[88px] h-[88px] mx-auto rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg transition-all duration-300 ${
              isHovered ? 'scale-110 rounded-full' : ''
            }`}
          >
            <span className="text-white text-2xl font-bold tracking-tight">
              {member.initials}
            </span>
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-sage rounded-full border-[3px] border-[#0B1D3A]" />
        </div>

        {/* Info */}
        <h3 className="text-white font-bold text-lg mb-1 transition-colors duration-300 group-hover:text-gold">
          {member.name}
        </h3>
        <p className={`text-sm font-medium mb-3 ${member.accentColor}`}>
          {member.title}
        </p>
        <p className="text-white/40 text-sm leading-relaxed mb-5">
          {member.description}
        </p>

        {/* Social Links - appear on hover */}
        <div className="flex items-center justify-center gap-2">
          <motion.a
            href={member.linkedin}
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0.4,
              scale: isHovered ? 1 : 0.9,
              y: isHovered ? 0 : 8,
            }}
            transition={{ duration: 0.25 }}
            className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-gold hover:border-gold/30 hover:bg-gold/10 flex items-center justify-center transition-colors"
            aria-label={`${member.name} LinkedIn profile`}
          >
            <Linkedin className="w-4 h-4" />
          </motion.a>
          <motion.a
            href={`mailto:${member.email}`}
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0.4,
              scale: isHovered ? 1 : 0.9,
              y: isHovered ? 0 : 8,
            }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-gold hover:border-gold/30 hover:bg-gold/10 flex items-center justify-center transition-colors"
            aria-label={`Email ${member.name}`}
          >
            <Mail className="w-4 h-4" />
          </motion.a>
          <motion.a
            href="#"
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0.4,
              scale: isHovered ? 1 : 0.9,
              y: isHovered ? 0 : 8,
            }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-gold hover:border-gold/30 hover:bg-gold/10 flex items-center justify-center transition-colors"
            aria-label={`${member.name} portfolio`}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

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
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Our dedicated professionals bring passion, expertise, and an unwavering commitment to quality on every project.
          </p>
          {/* Decorative underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-20 h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mt-6"
          />
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
            <TeamCard key={member.name} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
