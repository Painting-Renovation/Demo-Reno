'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { galleryItems, categories, getCategoryCounts, type Category, type GalleryItem } from '@/lib/gallery-data';

const categoryCounts = getCategoryCounts();

/* ─── Enhanced Before / After Slider ─────────────────────── */
function EnhancedSlider({ item, isFullscreen, onToggleFullscreen }: { item: GalleryItem; isFullscreen: boolean; onToggleFullscreen: () => void }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const containerHeight = isFullscreen ? 'h-[80vh]' : 'h-72 sm:h-80 md:h-96';

  return (
    <div className="relative group">
      {/* Slider Container */}
      <div
        ref={containerRef}
        className={`relative ${containerHeight} overflow-hidden select-none rounded-2xl cursor-ew-resize`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* Before Image (full) */}
        <img
          src={item.beforeImage}
          alt={`${item.title} - Before`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* After Image (clipped) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={item.afterImage}
            alt={`${item.title} - After`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transition: isDragging ? 'none' : 'left 0.1s' }}
        >
          <div className="absolute inset-0 w-1 -ml-[1.5px] bg-gold/40 blur-sm" />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: `translate(-50%, -50%)` }}
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gold/50 transition-transform duration-200 hover:scale-110"
            style={isDragging ? { transform: 'scale(1.15)' } : undefined}
          >
            <GripVertical className="w-5 h-5 md:w-6 md:h-6 text-navy" />
          </div>
        </div>

        {/* BEFORE Label */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            top: '16px',
            left: `${Math.max(sliderPosition / 2 - 20, 8)}%`,
            opacity: sliderPosition > 15 ? 1 : 0,
            transition: 'opacity 0.3s, left 0.05s',
          }}
        >
          <span className="bg-navy/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider shadow-lg">
            BEFORE
          </span>
        </div>

        {/* AFTER Label */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            top: '16px',
            right: `${Math.max((100 - sliderPosition) / 2 - 20, 8)}%`,
            opacity: sliderPosition < 85 ? 1 : 0,
            transition: 'opacity 0.3s, right 0.05s',
          }}
        >
          <span className="bg-gold/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider shadow-lg">
            AFTER
          </span>
        </div>

        {/* Drag hint */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-500"
          style={{ opacity: isDragging ? 0 : 0.85 }}
        >
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5">
            <span className="animate-swipe-hint inline-block">←</span> <span className="hidden sm:inline">Drag</span><span className="sm:hidden">Swipe</span> to compare <span className="animate-swipe-hint inline-block" style={{ animationDelay: '0.3s' }}>→</span>
          </span>
        </div>
      </div>

      {/* Fullscreen button */}
      <button
        onClick={onToggleFullscreen}
        className="absolute top-3 right-3 z-30 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </button>
    </div>
  );
}

/* ─── BeforeAfterSlider (with category tabs) ─────────────── */
export function BeforeAfterSlider() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);

  // Filter items by active category
  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(i => i.category === activeCategory);

  const handleCategoryChange = useCallback((cat: Category) => {
    setActiveIndex(0);
    setActiveCategory(cat);
  }, []);

  const goTo = useCallback((newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    const next = (activeIndex + 1) % filteredItems.length;
    setDirection(1);
    setActiveIndex(next);
  }, [activeIndex, filteredItems.length]);

  const goPrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    const prev = (activeIndex - 1 + filteredItems.length) % filteredItems.length;
    setDirection(-1);
    setActiveIndex(prev);
  }, [activeIndex, filteredItems.length]);

  const currentItem = filteredItems[activeIndex] || galleryItems[0];

  const sliderCategories = categories.filter(c => c !== 'All');

  return (
    <section id="before-after-slider" className="py-20 md:py-28 bg-cream">
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
            Interactive Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4 text-balance">
            Before &amp; After <span className="text-gradient-gold">Slider</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Drag the slider to reveal the dramatic transformations. Explore projects by category with our interactive comparison tool.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8 px-4 sm:px-0"
        >
          {/* "All" tab */}
          <button
            onClick={() => handleCategoryChange('All')}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-all cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-navy text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-navy/30 hover:text-navy'
            }`}
          >
            All ({categoryCounts.All})
          </button>
          {sliderCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-navy/30 hover:text-navy'
              }`}
            >
              {cat} ({categoryCounts[cat as Category]})
            </button>
          ))}
        </motion.div>

        {/* Main Slider */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentItem.id}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={isFullscreen ? 'fixed inset-0 z-[100] bg-black flex items-center justify-center p-4' : ''}
          >
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-6 right-6 z-[110] w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            )}
            <EnhancedSlider
              item={currentItem}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            className="gap-1 rounded-full border-navy/20 text-navy hover:bg-navy hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-center">
            <h3 className="text-base md:text-lg font-bold text-navy">{currentItem.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">📍 {currentItem.location}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            className="gap-1 rounded-full border-navy/20 text-navy hover:bg-navy hover:text-white"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Description */}
        <motion.div
          key={`desc-${currentItem.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <Badge className="bg-navy/10 text-navy border-navy/20 text-xs">{currentItem.category}</Badge>
            <span className="text-xs text-gray-400">
              {activeIndex + 1} / {filteredItems.length}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{currentItem.description}</p>
        </motion.div>

        {/* Thumbnail Strip */}
        <div className="flex gap-3 mt-6 justify-center overflow-x-auto pb-2 scrollbar-hide">
          {filteredItems.map((comp, index) => (
            <button
              key={comp.id}
              onClick={() => goTo(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                index === activeIndex ? 'border-gold shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              title={comp.title}
            >
              <div className="relative w-full h-full">
                <img src={comp.beforeImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 border-r-2 border-white" style={{ right: '50%' }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
