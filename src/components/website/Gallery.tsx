'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight, X, MapPin, ZoomIn, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

type Category = 'All' | 'Interior' | 'Exterior' | 'Cabinets' | 'Deck';

interface GalleryItem {
  id: number;
  title: string;
  location: string;
  category: Category;
  beforeImage: string;
  afterImage: string;
  description: string;
  span?: 'tall' | 'wide' | 'normal';
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Modern Living Room Refresh',
    location: 'Downtown Toronto',
    category: 'Interior',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-interior.jpg',
    description: 'Complete interior repaint with custom color palette, including feature walls and trim work.',
    span: 'tall',
  },
  {
    id: 2,
    title: 'Victorian Home Exterior',
    location: 'North York',
    category: 'Exterior',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-exterior.jpg',
    description: 'Full exterior restoration preserving the classic Victorian charm with modern durability.',
    span: 'normal',
  },
  {
    id: 3,
    title: 'Kitchen Cabinet Makeover',
    location: 'Mississauga',
    category: 'Cabinets',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/cabinet-refinish.jpg',
    description: 'Complete cabinet refinishing from dark oak to crisp white with new hardware.',
    span: 'wide',
  },
  {
    id: 4,
    title: 'Cedar Deck Restoration',
    location: 'Scarborough',
    category: 'Deck',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/deck-fence.jpg',
    description: 'Full deck sanding, staining, and sealing for a beautiful outdoor living space.',
    span: 'normal',
  },
];

const categories: Category[] = ['All', 'Interior', 'Exterior', 'Cabinets', 'Deck'];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="shimmer-skeleton h-64 md:h-72" />
      <div className="p-5 bg-white">
        <div className="shimmer-skeleton h-5 w-3/4 mb-3 rounded" />
        <div className="shimmer-skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}

function LightboxModal({
  item,
  onClose,
  onPrev,
  onNext,
  hasNext,
  hasPrev,
}: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-md" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-4xl w-full max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-navy font-bold text-lg">{item.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.location}</span>
              <span className="bg-sage/10 text-sage text-xs font-medium px-2 py-0.5 rounded-full">{item.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-video bg-gray-50">
          <img
            src={item.afterImage}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-gold/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
              AFTER
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4">
          <p className="text-gray-600 text-sm">{item.description}</p>
        </div>

        {/* Nav arrows */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-navy" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-navy" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export function Gallery() {
  const { setEstimateFormOpen } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate initial load
  useState(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  });

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const lightboxIndex = lightboxItem ? filteredItems.findIndex(i => i.id === lightboxItem.id) : -1;

  const handleLightboxPrev = useCallback(() => {
    if (lightboxIndex > 0) {
      setLightboxItem(filteredItems[lightboxIndex - 1]);
    }
  }, [lightboxIndex, filteredItems]);

  const handleLightboxNext = useCallback(() => {
    if (lightboxIndex < filteredItems.length - 1) {
      setLightboxItem(filteredItems[lightboxIndex + 1]);
    }
  }, [lightboxIndex, filteredItems]);

  // Get grid span classes based on item span property
  const getSpanClasses = (item: GalleryItem) => {
    if (item.span === 'tall') return 'md:row-span-2 md:h-auto';
    if (item.span === 'wide') return 'md:col-span-2';
    return '';
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(11,29,58,0.3) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-4 py-1.5 mb-5">
            <Layers className="w-4 h-4 text-gold" />
            <span className="text-navy text-sm font-medium">Our Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
            Before &amp; After Gallery
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            See the dramatic transformations our team has achieved for homeowners across the GTA.
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

        {/* Category Filter Pills with animated underline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-1 mb-12 relative"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'text-white'
                  : 'text-gray-600 hover:text-navy hover:bg-white'
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-navy rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid - Masonry-style on desktop */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 auto-rows-[280px]"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 ${getSpanClasses(item)}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setLightboxItem(item)}
                >
                  {/* Image Comparison */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Before Image */}
                    <img
                      src={item.beforeImage}
                      alt={`${item.title} - Before`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* After Image (revealed on hover) */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                    >
                      <img
                        src={item.afterImage}
                        alt={`${item.title} - After`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-navy/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      BEFORE
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gold/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      AFTER
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent z-[5] flex flex-col items-center justify-end pb-6"
                  >
                    <motion.div
                      initial={false}
                      animate={{ y: hoveredItem === item.id ? 0 : 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-white/70 text-sm flex items-center gap-1 justify-center">
                        <MapPin className="w-3.5 h-3.5" />{item.location}
                      </p>
                      <span className="inline-block mt-3 bg-gold/90 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gold transition-colors">
                        View Project
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Slide hint (visible when not hovered) */}
                  <motion.div
                    animate={{ opacity: hoveredItem === item.id ? 0 : 1 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10"
                  >
                    <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                      Hover to see result
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

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
            className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 group"
          >
            Request Similar Work
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <LightboxModal
            item={lightboxItem}
            onClose={() => setLightboxItem(null)}
            onPrev={handleLightboxPrev}
            onNext={handleLightboxNext}
            hasNext={lightboxIndex < filteredItems.length - 1}
            hasPrev={lightboxIndex > 0}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
