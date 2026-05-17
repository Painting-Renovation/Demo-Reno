'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight, X, MapPin, ZoomIn, ChevronLeft, ChevronRight, Layers, Hand, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { galleryItems, categories, getCategoryCounts, type Category, type GalleryItem } from '@/lib/gallery-data';

const categoryCounts = getCategoryCounts();

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

/* ─── Before / After Split-View Lightbox ─────────────────── */
function SplitViewLightbox({
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
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSliderPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePos(e.clientX);
  }, [updatePos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePos(e.clientX);
  }, [isDragging, updatePos]);

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  // Body cursor
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => { document.body.style.cursor = ''; document.body.style.userSelect = ''; };
  }, [isDragging]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-md" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full sm:max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden sm:rounded-2xl bg-white shadow-2xl rounded-b-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-100">
          <div>
            <h3 className="text-navy font-bold text-xl">{item.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.location}</span>
              <span className="bg-navy/10 text-navy text-xs font-medium px-2 py-0.5 rounded-full">{item.category}</span>
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

        {/* Split Before/After comparison */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-lg sm:rounded-xl overflow-hidden select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: 'none' }}
        >
          {/* Before (full) */}
          <img
            src={item.beforeImage}
            alt={`${item.title} - Before`}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          {/* After (clipped) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img
              src={item.afterImage}
              alt={`${item.title} - After`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10 pointer-events-none"
            style={{ left: `${sliderPos}%`, transition: isDragging ? 'none' : 'left 0.1s' }}
          >
            <div className="absolute inset-0 w-1 -ml-[1.5px] bg-gold/40 blur-sm" />
          </div>

          {/* Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gold/50"
              style={isDragging ? { transform: 'scale(1.15)' } : undefined}
            >
              <GripVertical className="w-5 h-5 text-navy" />
            </div>
          </div>

          {/* Labels */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{ top: '12px', left: '12px', opacity: sliderPos > 15 ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            <span className="bg-navy/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
              BEFORE
            </span>
          </div>
          <div
            className="absolute z-10 pointer-events-none"
            style={{ top: '12px', right: '12px', opacity: sliderPos < 85 ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            <span className="bg-gold/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
              AFTER
            </span>
          </div>

          {/* Hint */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-500"
            style={{ opacity: isDragging ? 0 : 0.85 }}
          >
            <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
              ← Drag to compare →
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 sm:px-8 py-4 sm:py-5">
          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
        </div>

        {/* Nav arrows */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-navy" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-navy" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Gallery Grid ──────────────────────────────────── */
export function Gallery() {
  const { setEstimateFormOpen } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const lightboxIndex = lightboxItem ? filteredItems.findIndex(i => i.id === lightboxItem.id) : -1;

  const handleLightboxPrev = useCallback(() => {
    if (lightboxIndex > 0) setLightboxItem(filteredItems[lightboxIndex - 1]);
  }, [lightboxIndex, filteredItems]);

  const handleLightboxNext = useCallback(() => {
    if (lightboxIndex < filteredItems.length - 1) setLightboxItem(filteredItems[lightboxIndex + 1]);
  }, [lightboxIndex, filteredItems]);

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
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/[0.06] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy/[0.04] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4 text-balance">
            Before &amp; After Gallery
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            See the dramatic transformations our demolition team has achieved for homeowners and businesses across the GTA.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-20 h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mt-6"
          />
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-nowrap justify-start sm:justify-center gap-1 mb-8 sm:mb-12 relative overflow-x-auto px-4 sm:px-0 scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'text-white shadow-lg shadow-navy/20'
                  : 'text-gray-600 hover:text-navy hover:bg-white hover:shadow-sm'
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-navy rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {category}
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                  activeCategory === category
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200/80 text-gray-500'
                }`}>
                  {categoryCounts[category]}
                </span>
              </span>
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[220px] sm:auto-rows-[280px]">
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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 auto-rows-[220px] sm:auto-rows-[280px]"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-[0_20px_40px_-8px_rgba(11,29,58,0.18)] transition-all duration-300 border border-gold/10 sm:hover:scale-[1.02] hover:border-gold/20 ${getSpanClasses(item)}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    if (hoveredItem === item.id) {
                      setLightboxItem(item);
                    } else {
                      setHoveredItem(prev => prev === item.id ? null : item.id);
                    }
                  }}
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
                    <span className="bg-navy/90 backdrop-blur-sm text-white text-xs sm:text-sm font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg tracking-wider">
                      BEFORE
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gold/90 backdrop-blur-sm text-white text-xs sm:text-sm font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg tracking-wider">
                      AFTER
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent z-[5] flex flex-col items-center justify-end pb-6"
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
                      <h3 className="text-white font-bold text-base sm:text-xl mb-1 drop-shadow-lg">{item.title}</h3>
                      <p className="text-white/80 text-sm sm:text-base flex items-center gap-1 justify-center drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5" />{item.location}
                      </p>
                      <span className="inline-block mt-3 bg-gold/90 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gold transition-colors">
                        View Project
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Slide hint */}
                  <motion.div
                    animate={{ opacity: hoveredItem === item.id ? 0 : 1 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10"
                  >
                    <span className="bg-white/85 backdrop-blur-sm text-navy text-xs font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                      <Hand className="w-3.5 h-3.5 animate-swipe-hint" />
                      Hover to compare
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <SplitViewLightbox
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
