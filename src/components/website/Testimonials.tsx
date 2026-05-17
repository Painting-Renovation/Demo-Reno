'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useAppStore } from '@/lib/store';

const avatarColors = [
  'bg-gradient-to-br from-gold to-gold-light',
  'bg-gradient-to-br from-sage to-sage-light',
  'bg-gradient-to-br from-navy to-navy-light',
  'bg-gradient-to-br from-[#E8B94E] to-[#C8973E]',
  'bg-gradient-to-br from-[#3B82A0] to-[#0B1D3A]',
  'bg-gradient-to-br from-[#8B5E3C] to-[#C8973E]',
];

interface Testimonial {
  id: number;
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'Downtown Toronto',
    service: 'Interior Painting',
    rating: 5,
    text: 'ProCoat completely transformed our condo. The attention to detail was incredible — they even painted behind the radiators! The crew was professional, clean, and finished ahead of schedule. Could not recommend them more highly.',
  },
  {
    id: 2,
    name: 'James K.',
    location: 'North York',
    service: 'Exterior Painting',
    rating: 5,
    text: 'We needed our exterior redone before selling our home. ProCoat gave us a fair quote, started on time, and the result was stunning. Our real estate agent said it was the best-looking house on the block. Sold in 3 days!',
  },
  {
    id: 3,
    name: 'Priya R.',
    location: 'Mississauga',
    service: 'Cabinet Refinishing',
    rating: 5,
    text: 'I was amazed at what they could do with our tired oak cabinets. They look brand new in a beautiful soft white. Saved us thousands compared to replacement. The team was respectful of our home and left everything spotless.',
  },
  {
    id: 4,
    name: 'Michael T.',
    location: 'Scarborough',
    service: 'Deck & Fence Staining',
    rating: 5,
    text: 'Our cedar deck had faded badly over the years. ProCoat sanded, stained, and sealed it beautifully. It looks like the day it was installed. They also fixed a few rotting boards we didn\'t even know about. Exceptional service.',
  },
  {
    id: 5,
    name: 'Linda & David W.',
    location: 'Markham',
    service: 'Interior Painting',
    rating: 5,
    text: 'We\'ve used ProCoat for three projects now — our living room, master bedroom, and nursery. Each time, the quality is consistently excellent. They helped us pick perfect colors and were great with our kids and dog around.',
  },
  {
    id: 6,
    name: 'Anita S.',
    location: 'Oakville',
    service: 'Color Consultation & Interior',
    rating: 5,
    text: 'The color consultation alone was worth it! They brought sample boards and helped us visualize the whole space. The painting crew was meticulous, covering every surface perfectly. Our home feels completely renewed and modern.',
  },
];

/* Gold gradient star SVG component */
function GoldStar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="url(#goldStarGradient)">
      <defs>
        <linearGradient id="goldStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8973E" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#E8B94E" />
          <stop offset="100%" stopColor="#C8973E" />
        </linearGradient>
      </defs>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

interface EmblaApi {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollNext: () => boolean;
}

export function Testimonials() {
  const { setEstimateFormOpen } = useAppStore();
  const [api, setApi] = useState<EmblaApi | undefined>(undefined);

  const scroll = useCallback((direction: 'prev' | 'next') => {
    if (api) {
      if (direction === 'prev') api.scrollPrev();
      else api.scrollNext();
    }
  }, [api]);

  // Auto-rotate
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-navy relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-sage/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            ProCoat Painters
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4 text-balance">
            What Our Clients Say
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Don&apos;t just take our word for it — hear from the homeowners and businesses
            we&apos;ve had the pleasure of serving.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <Carousel
            setApi={setApi as (api: unknown) => void}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 basis-full sm:basis-1/2">
                  <div className="glassmorphism-card rounded-2xl p-5 sm:p-6 md:p-8 h-full flex flex-col card-hover-lift relative overflow-hidden min-w-0">
                    {/* Large decorative quotation marks */}
                    <div className="quote-decorative">&ldquo;</div>
                    <div className="quote-decorative-end">&ldquo;</div>

                    {/* Stars with gold gradient */}
                    <div className="flex gap-1 mb-4 relative z-10">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <GoldStar
                          key={i}
                          className={`w-5 h-5 transition-transform duration-200 ${i < testimonial.rating ? 'opacity-100' : 'opacity-20'}`}
                        />
                      ))}
                      <span className="text-gold/70 text-xs font-medium ml-2 self-center">{testimonial.rating}.0</span>
                    </div>

                    {/* Text */}
                    <p className="text-white/80 text-sm leading-relaxed mb-6 flex-grow relative z-10">
                      {testimonial.text}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10 relative z-10">
                      <div className={`w-11 h-11 ${avatarColors[testimonial.id % avatarColors.length]} rounded-full flex items-center justify-center shadow-lg avatar-ring-animate`}>
                        <span className="text-white font-bold text-sm">
                          {testimonial.name.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-white font-semibold text-sm truncate">{testimonial.name}</p>
                          <BadgeCheck className="w-4 h-4 text-sage flex-shrink-0" />
                        </div>
                        <p className="text-white/50 text-xs">{testimonial.location}</p>
                      </div>
                      <span className="ml-auto text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full hidden md:inline-flex backdrop-blur-sm">
                        {testimonial.service}
                      </span>
                    </div>

                    {/* Subtle shimmer overlay on hover */}
                    <div className="absolute inset-0 rounded-2xl shimmer-bg opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll('prev')}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/40 hover:bg-gold/10 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex gap-1.5">
                {testimonials.slice(0, 6).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/30" />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll('next')}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/40 hover:bg-gold/10 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </Carousel>
        </motion.div>

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
            className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl cta-button-enhanced"
          >
            Join Our Happy Clients
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
