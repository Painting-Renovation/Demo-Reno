'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, CheckCircle2, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    title: 'Modern Condo Refresh',
    location: 'Downtown Toronto',
    serviceType: 'Interior Painting',
    image: '/images/hero-interior.jpg',
  },
  {
    title: 'Victorian Home Restoration',
    location: 'The Annex',
    serviceType: 'Exterior Painting',
    image: '/images/hero-exterior.jpg',
  },
  {
    title: 'Commercial Office Makeover',
    location: 'Financial District',
    serviceType: 'Commercial Painting',
    image: '/images/commercial.jpg',
  },
  {
    title: 'Kitchen Cabinet Transformation',
    location: 'Mississauga',
    serviceType: 'Cabinet Refinishing',
    image: '/images/cabinet-refinish.jpg',
  },
  {
    title: 'Ranch Home Exterior',
    location: 'Markham',
    serviceType: 'Exterior Painting',
    image: '/images/before-after.jpg',
  },
  {
    title: 'Deck & Fence Restoration',
    location: 'Oakville',
    serviceType: 'Deck & Fence',
    image: '/images/deck-fence.jpg',
  },
];

export function PortfolioShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative bg-white py-20 md:py-28 overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(11,29,58,0.4) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-4 py-1.5 mb-5">
              <Briefcase className="w-4 h-4 text-navy" />
              <span className="text-navy text-sm font-medium">Our Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-3">
              Recent{' '}
              <span className="text-gradient-gold">Projects</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-lg">
              Browse through our latest completed projects and see the quality we deliver.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-navy hover:text-white hover:border-navy text-gray-400 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-navy hover:text-white hover:border-navy text-gray-400 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[320px] snap-start"
              >
                <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

                    {/* Service type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-navy text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        <Briefcase className="w-3 h-3" />
                        {project.serviceType}
                      </span>
                    </div>

                    {/* Completion badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-navy font-bold text-base mb-2 group-hover:text-gold transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View Full Portfolio CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10 md:mt-14"
        >
          <Button
            variant="outline"
            className="border-navy text-navy hover:bg-navy hover:text-white font-semibold px-8 py-5 rounded-xl text-sm transition-all group"
          >
            View Full Portfolio
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
