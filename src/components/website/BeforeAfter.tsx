'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface BeforeAfterItem {
  id: number;
  title: string;
  location: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

const comparisonItems: BeforeAfterItem[] = [
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
];

function BeforeAfterSlider({ item }: { item: BeforeAfterItem }) {
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

  // Set cursor style on drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg group hover-lift"
    >
      {/* Slider Container */}
      <div
        ref={containerRef}
        className="relative h-72 sm:h-80 md:h-96 overflow-hidden select-none cursor-ew-resize"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Before Image (full) */}
        <img
          src={item.beforeImage}
          alt={`${item.title} - Before`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* After Image (clipped) */}
        <div
          className="absolute inset-0"
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
          className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Glow effect on line */}
          <div className="absolute inset-0 w-1 -ml-[1.5px] bg-gold/40 blur-sm" />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20"
          style={{ left: `${sliderPosition}%`, transform: `translate(-50%, -50%)` }}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gold/50 transition-transform duration-200 group-hover:scale-110">
            <GripVertical className="w-5 h-5 text-navy" />
          </div>
        </div>

        {/* Before Label */}
        <div
          className="absolute top-4 left-4 z-10 pointer-events-none"
          style={{ opacity: sliderPosition > 15 ? 1 : 0, transition: 'opacity 0.3s' }}
        >
          <span className="bg-navy/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
            BEFORE
          </span>
        </div>

        {/* After Label */}
        <div
          className="absolute top-4 right-4 z-10 pointer-events-none"
          style={{ opacity: sliderPosition < 85 ? 1 : 0, transition: 'opacity 0.3s' }}
        >
          <span className="bg-gold/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
            AFTER
          </span>
        </div>

        {/* Center hint (fades when dragged) */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-500"
          style={{ opacity: isDragging ? 0 : 0.8 }}
        >
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
            ← Drag to compare →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base md:text-lg font-bold text-navy text-balance">
            {item.title}
          </h3>
          <span className="text-[11px] bg-sage/10 text-sage font-semibold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            {item.category}
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-2">
          📍 {item.location}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export function BeforeAfter() {
  return (
    <section id="before-after" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            See The Difference
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4 text-balance">
            Before &amp; After <span className="text-gradient-gold">Transformations</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Drag the slider to reveal the stunning results our team delivers for homeowners across the GTA.
          </p>
        </motion.div>

        {/* Before/After Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {comparisonItems.map((item) => (
            <BeforeAfterSlider key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
