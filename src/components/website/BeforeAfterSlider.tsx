'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ComparisonItem {
  id: number;
  title: string;
  location: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

const comparisonItems: ComparisonItem[] = [
  {
    id: 1,
    title: 'Modern Living Room Refresh',
    location: 'Downtown Toronto',
    category: 'Interior',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-interior.jpg',
    description: 'Complete interior repaint with a custom warm neutral palette, including feature walls and crisp trim work.',
  },
  {
    id: 2,
    title: 'Victorian Home Exterior',
    location: 'North York',
    category: 'Exterior',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-exterior.jpg',
    description: 'Full exterior restoration preserving classic Victorian charm with modern weather-resistant finishes.',
  },
  {
    id: 3,
    title: 'Kitchen Cabinet Makeover',
    location: 'Mississauga',
    category: 'Cabinets',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/cabinet-refinish.jpg',
    description: 'Complete cabinet refinishing from dark oak to a clean contemporary white with new brushed hardware.',
  },
  {
    id: 4,
    title: 'Cedar Deck Restoration',
    location: 'Scarborough',
    category: 'Deck',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/deck-fence.jpg',
    description: 'Full deck sanding, staining, and sealing to restore natural cedar beauty for outdoor living.',
  },
  {
    id: 5,
    title: 'Condo Master Bedroom',
    location: 'King West',
    category: 'Interior',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-interior.jpg',
    description: 'Elegant bedroom transformation with soothing sage accent wall and crisp white wainscoting.',
  },
  {
    id: 6,
    title: 'Office Lobby Refresh',
    location: 'Financial District',
    category: 'Commercial',
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-exterior.jpg',
    description: 'Professional lobby repaint with brand-aligned colors completed over a single weekend to minimize disruption.',
  },
];

function EnhancedSlider({ item, isFullscreen, onToggleFullscreen }: { item: ComparisonItem; isFullscreen: boolean; onToggleFullscreen: () => void }) {
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
        className={`relative ${containerHeight} overflow-hidden select-none rounded-2xl ${isDragging ? 'cursor-ew-resize' : 'cursor-ew-resize'}`}
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

        {/* BEFORE Label - follows slider */}
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

        {/* AFTER Label - follows slider */}
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
            <span className="animate-swipe-hint inline-block">←</span> Drag to compare <span className="animate-swipe-hint inline-block" style={{ animationDelay: '0.3s' }}>→</span>
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

export function BeforeAfterSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % comparisonItems.length;
    setDirection(1);
    setActiveIndex(next);
  }, [activeIndex]);

  const goPrev = useCallback(() => {
    const prev = (activeIndex - 1 + comparisonItems.length) % comparisonItems.length;
    setDirection(-1);
    setActiveIndex(prev);
  }, [activeIndex]);

  const currentItem = comparisonItems[activeIndex];

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
            Drag the slider to reveal the stunning transformations. Explore all {comparisonItems.length} projects with our interactive comparison tool.
          </p>
        </motion.div>

        {/* Project Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-nowrap justify-start sm:justify-center gap-2 mb-8 overflow-x-auto px-4 sm:px-0 scrollbar-hide"
        >
          {comparisonItems.map((comp, index) => (
            <button
              key={comp.id}
              onClick={() => goTo(index)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                index === activeIndex
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-navy/30 hover:text-navy'
              }`}
            >
              {comp.category}
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
            <div>
              <Badge className="bg-sage/10 text-sage border-sage/20 text-xs">{currentItem.category}</Badge>
            </div>
            <span className="text-xs text-gray-400">
              {activeIndex + 1} / {comparisonItems.length}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{currentItem.description}</p>
        </motion.div>

        {/* Thumbnail Strip */}
        <div className="flex gap-3 mt-6 justify-center overflow-x-auto pb-2">
          {comparisonItems.map((comp, index) => (
            <button
              key={comp.id}
              onClick={() => goTo(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                index === activeIndex ? 'border-gold shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
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
