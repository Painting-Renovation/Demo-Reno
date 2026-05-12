'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Home, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Neighborhood {
  name: string;
  description: string;
  projects: number;
  signatureColor: string;
  gradientFrom: string;
  gradientTo: string;
  accentText: string;
  highlights: string[];
}

const neighborhoods: Neighborhood[] = [
  {
    name: 'Downtown Core',
    description: 'High-rise condos, lofts, and heritage buildings in the heart of the city. Modern finishes meet classic architecture.',
    projects: 87,
    signatureColor: '#0B1D3A',
    gradientFrom: 'from-navy',
    gradientTo: 'to-navy-light',
    accentText: 'text-navy',
    highlights: ['Condo painting', 'Heritage restoration', 'Commercial spaces'],
  },
  {
    name: 'Yorkville',
    description: 'Luxury residences and upscale retail spaces. Premium finishes and meticulous attention to detail for discerning clients.',
    projects: 64,
    signatureColor: '#C8973E',
    gradientFrom: 'from-gold',
    gradientTo: 'to-gold-light',
    accentText: 'text-gold',
    highlights: ['Luxury interiors', 'Custom finishes', 'Designer color work'],
  },
  {
    name: 'The Annex',
    description: 'Charming Victorian and Edwardian homes with unique architectural details. Preserving character while modernizing interiors.',
    projects: 72,
    signatureColor: '#5B7B5A',
    gradientFrom: 'from-sage',
    gradientTo: 'to-sage-light',
    accentText: 'text-sage',
    highlights: ['Heritage homes', 'Wood trim restoration', 'Period colors'],
  },
  {
    name: 'Liberty Village',
    description: 'Converted warehouses and modern townhomes. Open-concept living spaces with contemporary styling and clean lines.',
    projects: 58,
    signatureColor: '#3B82A0',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-400',
    accentText: 'text-blue-600',
    highlights: ['Loft conversions', 'Accent walls', 'Open-concept design'],
  },
  {
    name: 'King West',
    description: 'Trendy condos, townhomes, and retail spaces. Bold colors and statement walls for Toronto\'s most stylish neighborhood.',
    projects: 93,
    signatureColor: '#8B5E3C',
    gradientFrom: 'from-amber-800',
    gradientTo: 'to-amber-600',
    accentText: 'text-amber-800',
    highlights: ['Condo interiors', 'Feature walls', 'Retail spaces'],
  },
  {
    name: 'Leslieville',
    description: 'Hip, artsy neighborhood with Victorian semi-detached homes. Creative color palettes and eclectic design sensibilities.',
    projects: 51,
    signatureColor: '#7C3AED',
    gradientFrom: 'from-violet-600',
    gradientTo: 'to-violet-400',
    accentText: 'text-violet-600',
    highlights: ['Semi-detached homes', 'Creative finishes', 'Eco-friendly paints'],
  },
  {
    name: 'Midtown',
    description: 'Family-friendly neighborhoods with spacious homes. Durable, washable finishes perfect for busy households.',
    projects: 46,
    signatureColor: '#059669',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-emerald-400',
    accentText: 'text-emerald-600',
    highlights: ['Family homes', 'Durability focus', 'Kid-safe finishes'],
  },
  {
    name: 'North York',
    description: 'Diverse suburban homes and growing commercial districts. Professional quality for residential and light commercial projects.',
    projects: 39,
    signatureColor: '#DC2626',
    gradientFrom: 'from-red-600',
    gradientTo: 'to-red-400',
    accentText: 'text-red-600',
    highlights: ['Suburban homes', 'Commercial repaints', 'Multi-unit buildings'],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function NeighborhoodSpotlight() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalProjects = neighborhoods.reduce((sum, n) => sum + n.projects, 0);

  return (
    <section id="neighborhoods" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-40 right-0 w-72 h-72 bg-navy/3 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-4 px-4 py-1.5 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            Local Experts
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 text-balance">
            Painting Excellence <span className="text-gradient-gold">Across Toronto</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            We know every neighborhood, every building style, and every community. Trusted by homeowners from Downtown to North York.
          </p>
        </motion.div>

        {/* Summary Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14 p-6 bg-cream rounded-2xl border border-gold/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center">
              <Home className="w-6 h-6 text-gold" />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">500+</div>
              <div className="text-xs text-gray-500">Homes Painted in Toronto</div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gold/20" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gold" />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">{totalProjects}+</div>
              <div className="text-xs text-gray-500">Total Projects Completed</div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gold/20" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-sage" />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">8</div>
              <div className="text-xs text-gray-500">Neighborhoods Served</div>
            </div>
          </div>
        </motion.div>

        {/* Neighborhood Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {neighborhoods.map((neighborhood, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={neighborhood.name}
                variants={item}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer group"
              >
                <Card className={`h-full border-0 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isHovered ? 'ring-2' : ''
                }`} style={isHovered ? { ringColor: neighborhood.signatureColor } : undefined}>
                  {/* Color bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${neighborhood.gradientFrom} ${neighborhood.gradientTo}`} />

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: neighborhood.signatureColor }} />
                        <h3 className="text-base font-bold text-navy">{neighborhood.name}</h3>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-all duration-300 ${isHovered ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {neighborhood.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {neighborhood.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${neighborhood.signatureColor}15`,
                            color: neighborhood.signatureColor,
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Project count */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                        <span className="text-xs text-gray-500">
                          <span className="font-bold text-navy">{neighborhood.projects}</span> projects completed
                        </span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: neighborhood.signatureColor }}>
                        View →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-navy to-navy-light max-w-2xl mx-auto overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                Serving Your Neighborhood
              </h3>
              <p className="text-white/70 text-sm md:text-base mb-6 max-w-lg mx-auto">
                Don&apos;t see your area listed? We serve the entire Greater Toronto Area. Get in touch and we&apos;ll bring our expertise to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-gold hover:bg-gold-light text-white px-6 py-5 rounded-full font-semibold">
                  <MapPin className="w-4 h-4 mr-2" />
                  Check Your Area
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-5 rounded-full font-semibold"
                >
                  Get a Free Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
