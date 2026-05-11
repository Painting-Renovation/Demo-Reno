'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

type Category = 'All' | 'Interior' | 'Exterior' | 'Cabinets' | 'Deck';

const galleryItems = [
  {
    id: 1,
    title: 'Modern Living Room Refresh',
    location: 'Downtown Toronto',
    category: 'Interior' as Category,
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-interior.jpg',
    description: 'Complete interior repaint with custom color palette, including feature walls and trim work.',
  },
  {
    id: 2,
    title: 'Victorian Home Exterior',
    location: 'North York',
    category: 'Exterior' as Category,
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-exterior.jpg',
    description: 'Full exterior restoration preserving the classic Victorian charm with modern durability.',
  },
  {
    id: 3,
    title: 'Kitchen Cabinet Makeover',
    location: 'Mississauga',
    category: 'Cabinets' as Category,
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/cabinet-refinish.jpg',
    description: 'Complete cabinet refinishing from dark oak to crisp white with new hardware.',
  },
  {
    id: 4,
    title: 'Cedar Deck Restoration',
    location: 'Scarborough',
    category: 'Deck' as Category,
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/deck-fence.jpg',
    description: 'Full deck sanding, staining, and sealing for a beautiful outdoor living space.',
  },
];

const categories: Category[] = ['All', 'Interior', 'Exterior', 'Cabinets', 'Deck'];

export function Gallery() {
  const { setEstimateFormOpen } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Before &amp; After Gallery
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            See the dramatic transformations our team has achieved for homeowners across the GTA.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-navy/10 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md group"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Image Comparison */}
                <div className="relative h-72 md:h-80 overflow-hidden">
                  {/* Before Image (always visible as base) */}
                  <img
                    src={item.beforeImage}
                    alt={`${item.title} - Before`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* After Image (revealed on hover) */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                  >
                    <img
                      src={item.afterImage}
                      alt={`${item.title} - After`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Labels */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-navy/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      BEFORE
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gold/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      AFTER
                    </span>
                  </div>
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 bg-gold/20 flex items-center justify-center transition-opacity duration-300"
                    style={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                  >
                    <div className="bg-white/90 rounded-full p-3">
                      <Eye className="w-6 h-6 text-navy" />
                    </div>
                  </div>
                  {/* Slide hint */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                      Hover to see result
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                    <span className="text-xs bg-sage/10 text-sage font-medium px-3 py-1 rounded-full whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                    📍 {item.location}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => setEstimateFormOpen(true)}
            variant="outline"
            className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold px-8 py-3 rounded-lg transition-all"
          >
            Request Similar Work
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
