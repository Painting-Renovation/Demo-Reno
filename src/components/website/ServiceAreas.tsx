'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, Search, Clock, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';

interface ServiceArea {
  name: string;
  distance: string;
  travelTime: string;
  projects: number;
  tier: 'primary' | 'extended';
}

const serviceAreas: ServiceArea[] = [
  { name: 'Toronto', distance: 'Downtown', travelTime: '10 min', projects: 85, tier: 'primary' },
  { name: 'Mississauga', distance: '25 km west', travelTime: '30 min', projects: 42, tier: 'primary' },
  { name: 'Brampton', distance: '35 km northwest', travelTime: '35 min', projects: 28, tier: 'primary' },
  { name: 'Vaughan', distance: '30 km north', travelTime: '30 min', projects: 35, tier: 'primary' },
  { name: 'Markham', distance: '25 km northeast', travelTime: '25 min', projects: 38, tier: 'primary' },
  { name: 'Richmond Hill', distance: '22 km north', travelTime: '25 min', projects: 31, tier: 'primary' },
  { name: 'Scarborough', distance: '15 km east', travelTime: '20 min', projects: 44, tier: 'primary' },
  { name: 'North York', distance: '10 km north', travelTime: '15 min', projects: 52, tier: 'primary' },
  { name: 'Etobicoke', distance: '12 km west', travelTime: '15 min', projects: 40, tier: 'primary' },
  { name: 'Oakville', distance: '35 km west', travelTime: '35 min', projects: 22, tier: 'extended' },
  { name: 'Burlington', distance: '50 km west', travelTime: '45 min', projects: 15, tier: 'extended' },
  { name: 'Pickering', distance: '30 km east', travelTime: '30 min', projects: 18, tier: 'extended' },
  { name: 'Ajax', distance: '40 km east', travelTime: '40 min', projects: 12, tier: 'extended' },
  { name: 'Whitby', distance: '50 km east', travelTime: '45 min', projects: 10, tier: 'extended' },
  { name: 'Thornhill', distance: '20 km north', travelTime: '20 min', projects: 26, tier: 'primary' },
  { name: 'Unionville', distance: '28 km northeast', travelTime: '28 min', projects: 20, tier: 'primary' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

function LocationCard({ area }: { area: ServiceArea }) {
  const { setEstimateFormOpen } = useAppStore();
  const isPrimary = area.tier === 'primary';

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`group relative rounded-xl p-4 border transition-all duration-300 cursor-default ${
        isPrimary
          ? 'bg-white border-gray-100 shadow-sm hover:border-gold/40 hover:shadow-md'
          : 'bg-white/60 border-gray-200/60 hover:border-gold/30 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isPrimary ? 'bg-gold/10' : 'bg-navy/5'
          }`}>
            <MapPin className={`w-4 h-4 ${isPrimary ? 'text-gold' : 'text-navy/50'}`} />
          </div>
          <div>
            <h4 className="text-navy font-semibold text-sm">{area.name}</h4>
            <p className="text-gray-400 text-xs">{area.distance}</p>
          </div>
        </div>
        {isPrimary && (
          <span className="bg-sage/10 text-sage text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
            Core Area
          </span>
        )}
      </div>

      {/* Info row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock className="w-3 h-3" />
          {area.travelTime}
        </span>
        <span className="text-gray-300 text-xs">•</span>
        <span className="text-gray-500 text-xs">{area.projects}+ projects</span>
      </div>

      {/* CTA button - appears on hover */}
      <motion.button
        initial={false}
        whileHover={{ x: 2 }}
        onClick={() => setEstimateFormOpen(true)}
        className="flex items-center gap-1 text-xs font-medium text-gold hover:text-gold-light transition-colors cursor-pointer opacity-60 group-hover:opacity-100"
      >
        Request service
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </motion.button>
    </motion.div>
  );
}

export function ServiceAreas() {
  const { setEstimateFormOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return serviceAreas;
    const q = searchQuery.toLowerCase();
    return serviceAreas.filter(
      (area) =>
        area.name.toLowerCase().includes(q) ||
        area.distance.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const primaryAreas = filteredAreas.filter((a) => a.tier === 'primary');
  const extendedAreas = filteredAreas.filter((a) => a.tier === 'extended');

  return (
    <section id="service-areas" className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Subtle map grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(11,29,58,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,29,58,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Soft radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            ProCoat Painters
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
            Proudly Serving the Greater Toronto Area
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            From downtown condos to suburban family homes, we bring professional painting
            services to communities across the GTA.
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

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your area..."
              className="w-full pl-10 pr-4 py-3 bg-white border-gray-200 rounded-xl text-sm text-navy placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all shadow-sm"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Map Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 order-2 lg:order-1 lg:sticky lg:top-8"
          >
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {/* GTA Map Stylized Visual */}
              <div className="relative aspect-square max-w-sm mx-auto">
                {/* Central Toronto marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gold/20 rounded-full animate-ping absolute inset-0" />
                    <div className="w-16 h-16 bg-gold/30 rounded-full flex items-center justify-center relative">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Area dots */}
                {[
                  { top: '20%', left: '30%' },
                  { top: '25%', left: '65%' },
                  { top: '35%', left: '15%' },
                  { top: '40%', left: '80%' },
                  { top: '60%', left: '20%' },
                  { top: '55%', left: '75%' },
                  { top: '75%', left: '35%' },
                  { top: '80%', left: '60%' },
                  { top: '15%', left: '45%' },
                  { top: '85%', left: '45%' },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="absolute"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className="w-3 h-3 bg-sage/60 rounded-full" />
                  </motion.div>
                ))}

                {/* Decorative circles */}
                <div className="absolute inset-4 border-2 border-dashed border-navy/10 rounded-full" />
                <div className="absolute inset-12 border-2 border-dashed border-gold/15 rounded-full" />

                <p className="absolute -bottom-2 left-0 right-0 text-center text-xs text-gray-400 font-medium">
                  GTA Coverage Area
                </p>
              </div>
            </div>
          </motion.div>

          {/* Area Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 order-1 lg:order-2"
          >
            {filteredAreas.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No areas found matching &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <>
                {/* Primary Areas */}
                {primaryAreas.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-navy font-semibold text-sm mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" />
                      Primary Service Areas
                    </h3>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                    >
                      {primaryAreas.map((area) => (
                        <LocationCard key={area.name} area={area} />
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* Extended Areas */}
                {extendedAreas.length > 0 && (
                  <div>
                    <h3 className="text-navy font-semibold text-sm mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-navy/30 rounded-full" />
                      Extended Service Areas
                    </h3>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                    >
                      {extendedAreas.map((area) => (
                        <LocationCard key={area.name} area={area} />
                      ))}
                    </motion.div>
                  </div>
                )}
              </>
            )}

            {/* Don't see your area */}
            <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-navy font-semibold text-sm mb-1">
                    Don&apos;t see your area?
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    Contact us — we may still be able to help! We regularly extend our services
                    to surrounding communities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setEstimateFormOpen(true)}
                      size="sm"
                      className="bg-gold hover:bg-gold-light text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                    >
                      Request Service in Your Area
                    </Button>
                    <a
                      href="tel:+14375350494"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-gold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      (437) 535-0494
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
