'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { motion } from 'framer-motion';
const ColorPaletteExplorer = dynamic(
  () => import('@/components/website/ColorPaletteExplorer').then((m) => ({ default: m.ColorPaletteExplorer })),
  { ssr: false }
);
import { ArrowRight, Sparkles } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const trendingColors = [
  {
    name: 'Warm Ivory',
    hex: '#F5F0E8',
    description:
      'A soft off-white with warm undertones that makes any room feel cozy and welcoming without the starkness of pure white.',
  },
  {
    name: 'Sage Meadow',
    hex: '#5B7B5A',
    description:
      'Nature-inspired green that brings a calming, organic feel to living spaces. Perfect for bedrooms, offices, and reading nooks.',
  },
  {
    name: 'Terracotta Clay',
    hex: '#C75B39',
    description:
      'Earthy, warm tones inspired by Mediterranean design. Adds character and warmth to accent walls, kitchens, and dining rooms.',
  },
  {
    name: 'Midnight Navy',
    hex: '#0B1D3A',
    description:
      'Rich, dramatic dark blue that works beautifully on statement walls, cabinetry, and trim. Adds sophistication to any room.',
  },
  {
    name: 'Blush Rose',
    hex: '#D4A0A0',
    description:
      'Soft pink with muted undertones that brings a modern elegance. A top pick for nurseries, bedrooms, and spa-like bathrooms.',
  },
  {
    name: 'Greige Perfection',
    hex: '#B0A89A',
    description:
      'The best of gray and beige — this versatile neutral pairs beautifully with both warm and cool accent colors throughout the home.',
  },
];

export default function ColorsPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Explore Colors"
        subtitle="Find the perfect palette for your space."
        breadcrumbs={[{ label: 'Color Palette' }]}
        compact
      />

      {/* Color Palette Explorer Component */}
      <ColorPaletteExplorer />

      {/* Color Trends 2024 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold font-semibold px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Trending This Year
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Color Trends <span className="text-gold">2024</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Curated by our color experts — these are the shades making waves in homes across
              the Greater Toronto Area.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {trendingColors.map((color) => (
              <motion.div
                key={color.name}
                variants={item}
                className="group bg-cream rounded-2xl overflow-hidden border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              >
                {/* Color swatch */}
                <div
                  className="h-32 w-full relative flex items-end"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="absolute top-4 right-4 text-xs font-mono font-semibold bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-gray-700">
                    {color.hex}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-200">
                    {color.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {color.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Not Sure Which Colors to Choose?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Our professional color consultants will visit your home, assess your lighting and
                décor, and create a custom palette you&apos;ll love for years to come.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/services/color-consultation"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Book a Color Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  Get Free Estimate
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
