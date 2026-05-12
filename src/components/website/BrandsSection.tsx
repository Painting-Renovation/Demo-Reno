'use client';

import { motion } from 'framer-motion';

interface Brand {
  name: string;
  tagline: string;
  color: string;
  weight: string;
  style: string;
}

const brands: Brand[] = [
  {
    name: 'Benjamin Moore',
    tagline: 'Premium Performance',
    color: '#C41E3A',
    weight: '700',
    style: 'italic',
  },
  {
    name: 'Sherwin-Williams',
    tagline: 'Cover The Earth',
    color: '#003DA5',
    weight: '800',
    style: 'normal',
  },
  {
    name: 'BEHR',
    tagline: 'Seriously Good Paint',
    color: '#2D2D2D',
    weight: '900',
    style: 'normal',
  },
  {
    name: 'Dulux',
    tagline: 'Transform Your Home',
    color: '#E31837',
    weight: '700',
    style: 'italic',
  },
  {
    name: 'Farrow & Ball',
    tagline: 'Artisanal Craftsmanship',
    color: '#1A1A2E',
    weight: '400',
    style: 'normal',
  },
  {
    name: 'PARA Paints',
    tagline: 'Colour Your World',
    color: '#0066B3',
    weight: '800',
    style: 'normal',
  },
];

const BrandLogo = ({ brand }: { brand: Brand }) => (
  <div className="flex-shrink-0 mx-8 md:mx-12 py-4 group">
    <div className="flex flex-col items-center gap-1.5 transition-all duration-300 group-hover:opacity-100 opacity-50">
      {/* Brand name as text logo */}
      <span
        className="text-xl md:text-2xl lg:text-3xl tracking-tight transition-all duration-300 group-hover:scale-105"
        style={{
          color: brand.color,
          fontWeight: parseInt(brand.weight),
          fontStyle: brand.style as React.CSSProperties['fontStyle'],
          fontFamily: brand.name === 'Farrow & Ball' ? 'Georgia, serif' : 'inherit',
        }}
      >
        {brand.name}
      </span>
      {/* Subtle tagline */}
      <span className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase font-medium opacity-0 group-hover:opacity-60 transition-opacity duration-300">
        {brand.tagline}
      </span>
    </div>
  </div>
);

export function BrandsSection() {
  // Duplicate brands for seamless infinite loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-14 md:py-20 bg-white overflow-hidden" id="brands">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            Our Partners
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mt-2 mb-3 text-balance">
            Brands We <span className="text-gradient-gold">Trust &amp; Use</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            We exclusively use premium paints from industry-leading brands to ensure exceptional, lasting results for every project.
          </p>
        </motion.div>

        {/* Faded edges */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee container */}
          <div className="overflow-hidden">
            <div className="brand-marquee">
              {duplicatedBrands.map((brand, index) => (
                <BrandLogo key={`${brand.name}-${index}`} brand={brand} />
              ))}
            </div>
          </div>
        </div>

        {/* Decorative divider line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xs mx-auto mt-10"
        >
          <div className="section-divider" />
        </motion.div>
      </div>
    </section>
  );
}
