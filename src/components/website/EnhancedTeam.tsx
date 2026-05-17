'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Users,
  Linkedin,
  Mail,
  ExternalLink,
  Award,
  Coffee,
  Instagram,
  Briefcase,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  name: string;
  role: string;
  yearsExperience: number;
  initials: string;
  colorFrom: string;
  colorTo: string;
  accentColor: string;
  bio: string;
  specialties: string[];
  funFact: string;
  linkedin: string;
  email: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'James Mitchell',
    role: 'Founder & Master Painter',
    yearsExperience: 18,
    initials: 'JM',
    colorFrom: '#0B1D3A',
    colorTo: '#132D5E',
    accentColor: '#C8973E',
    bio: 'James founded ProCoat Painters with a simple mission: deliver the quality of a custom artist with the reliability of a professional crew. With nearly two decades of experience, he has personally overseen 2,000+ projects across the GTA.',
    specialties: ['Color Matching', 'Exterior Finishes', 'Historic Restoration', 'Team Leadership'],
    funFact: 'James once painted a mural that was featured in Toronto Life magazine.',
    linkedin: '#',
    email: 'infoinandoutdemolition@gmail.com',
  },
  {
    name: 'Sarah Rodriguez',
    role: 'Operations Manager',
    yearsExperience: 12,
    initials: 'SR',
    colorFrom: '#5B7B5A',
    colorTo: '#7A9E79',
    accentColor: '#7A9E79',
    bio: 'Sarah is the organizational backbone of ProCoat. She ensures every project runs on time, on budget, and exceeds expectations. Her background in project management and interior design makes her the perfect bridge between clients and crews.',
    specialties: ['Project Planning', 'Client Relations', 'Quality Control', 'Interior Design'],
    funFact: 'Sarah can identify over 200 paint colors by sight alone — no joke!',
    linkedin: '#',
    email: 'infoinandoutdemolition@gmail.com',
  },
  {
    name: 'David Kim',
    role: 'Lead Painter & Crew Chief',
    yearsExperience: 14,
    initials: 'DK',
    colorFrom: '#C8973E',
    colorTo: '#E8B94E',
    accentColor: '#C8973E',
    bio: 'David is a master craftsman with an obsessive attention to detail. He leads our largest and most complex projects, from commercial spaces to full-home transformations. His crew consistently earns 5-star reviews from clients.',
    specialties: ['Fine Finishes', 'Cabinet Refinishing', 'Faux Finishes', 'Eco-Friendly Coatings'],
    funFact: 'David competed in a national painting competition and placed 2nd in Canada.',
    linkedin: '#',
    email: 'infoinandoutdemolition@gmail.com',
  },
  {
    name: 'Emily Chen',
    role: 'Color Consultant & Designer',
    yearsExperience: 9,
    initials: 'EC',
    colorFrom: '#3B82A0',
    colorTo: '#0B1D3A',
    accentColor: '#3B82A0',
    bio: 'Emily transforms homes with color. With a degree in Interior Design from Ryerson University and partnerships with Benjamin Moore and Farrow & Ball, she helps clients discover palettes they never knew they would love.',
    specialties: ['Color Psychology', 'Trend Forecasting', 'Benjamin Moore Expert', 'Farrow & Ball Specialist'],
    funFact: 'Emily has a side business painting custom pet portraits on reclaimed wood.',
    linkedin: '#',
    email: 'infoinandoutdemolition@gmail.com',
  },
];

const totalExperience = teamMembers.reduce((sum, m) => sum + m.yearsExperience, 0);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.32, 0.72, 0, 1] as const,
    },
  },
};

function FlipCard({ member, index }: { member: TeamMember; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    x.set(px - 0.5);
    y.set(py - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      variants={cardVariants}
      className="group"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative h-[380px] sm:h-[420px] md:h-[480px]"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Front Face */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-cream border border-gold/10 shadow-lg overflow-hidden cursor-pointer"
          style={{ backfaceVisibility: 'hidden' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Top gradient strip */}
          <div
            className="h-2"
            style={{
              background: `linear-gradient(90deg, ${member.colorFrom}, ${member.accentColor})`,
            }}
          />

          <div className="p-6 pt-8 flex flex-col items-center h-full text-center">
            {/* Avatar */}
            <div className="relative mb-5">
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20 transition-all duration-500 group-hover:rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${member.colorFrom}, ${member.colorTo})`,
                }}
              >
                <span className="text-white text-3xl font-bold">{member.initials}</span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sage rounded-full border-[3px] border-cream" />
            </div>

            {/* Info */}
            <h3 className="text-xl font-bold text-navy mb-1">{member.name}</h3>
            <p className="text-sm font-medium mb-1" style={{ color: member.accentColor }}>
              {member.role}
            </p>
            <p className="text-xs text-gray-400 mb-4">{member.yearsExperience} years experience</p>

            {/* Specialty Tags Preview */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-5">
              {member.specialties.slice(0, 2).map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="text-[10px] border-gray-200 text-gray-500 py-0"
                >
                  {s}
                </Badge>
              ))}
              {member.specialties.length > 2 && (
                <Badge className="text-[10px] bg-gold/10 text-gold border-0 py-0">
                  +{member.specialties.length - 2} more
                </Badge>
              )}
            </div>

            {/* Fun fact preview */}
            <div className="mt-auto pt-4 border-t border-gray-100 w-full">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Coffee className="w-3.5 h-3.5" />
                <span className="italic truncate max-w-[200px]">&ldquo;{member.funFact}&rdquo;</span>
              </div>
            </div>

            {/* Flip hint */}
            <div className="mt-3 text-[10px] text-gold/60 font-medium tracking-wider uppercase group-hover:text-gold transition-colors">
              Hover to reveal → Click to flip
            </div>
          </div>
        </motion.div>

        {/* Back Face */}
        <motion.div
          className="absolute inset-0 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          style={{
            backfaceVisibility: 'hidden',
            background: `linear-gradient(135deg, ${member.colorFrom}, ${member.colorTo})`,
          }}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="p-6 pt-7 flex flex-col h-full text-white">
            {/* Top gradient strip */}
            <div
              className="absolute top-0 left-0 right-0 h-1 opacity-50"
              style={{
                background: `linear-gradient(90deg, ${member.accentColor}, transparent)`,
              }}
            />

            {/* Name & Role */}
            <h3 className="text-xl font-bold mb-0.5">{member.name}</h3>
            <p className="text-sm font-medium opacity-80 mb-4">{member.role}</p>

            {/* Bio */}
            <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-5">
              {member.bio}
            </p>

            {/* Specialties */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2 flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                Specialties
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1 flex items-center gap-1.5">
                <Coffee className="w-3 h-3" />
                Fun Fact
              </p>
              <p className="text-xs text-white/80">{member.funFact}</p>
            </div>

            {/* Social Links */}
            <div className="mt-auto flex items-center justify-center gap-2 pt-3 border-t border-white/10">
            <a
                href={member.linkedin}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={`${member.name} LinkedIn`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${member.email}`}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={`${member.name} portfolio`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={`${member.name} Instagram`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Flip back hint */}
            <div className="text-center mt-2 text-[10px] text-white/30 font-medium tracking-wider uppercase">
              Click to flip back
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function EnhancedTeam() {
  return (
    <section className="relative bg-navy py-20 md:py-28 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(200,151,62,0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative gradient orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sage/5 rounded-full blur-[100px]" />

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
            Meet Our{' '}
            <span className="text-gradient-gold">Expert Team</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Our dedicated professionals bring passion, expertise, and an unwavering
            commitment to quality on every project.
          </p>

          {/* Collective Experience Counter */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-2xl px-6 py-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-gold" />
            </div>
            <div className="text-left">
              <p className="text-3xl sm:text-4xl font-bold text-gold number-glow">{totalExperience}+</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Years of collective experience</p>
            </div>
          </motion.div>

          {/* Decorative underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
          {teamMembers.map((member, index) => (
            <FlipCard key={member.name} member={member} index={index} />
          ))}
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white/40 text-sm">
            Every team member is background-checked, WSIB-insured, and committed to our 100% satisfaction guarantee.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
