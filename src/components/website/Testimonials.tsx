'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useAppStore } from '@/lib/store';

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

export function Testimonials() {
  const { setEstimateFormOpen } = useAppStore();
  const [api, setApi] = useState<ReturnType<typeof import('embla-carousel-react').useEmblaCarousel>[1] | null>(null);

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
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
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 h-full flex flex-col hover:bg-white/15 transition-all duration-300">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-gold/40 mb-4 flex-shrink-0" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-white/80 text-sm leading-relaxed mb-6 flex-grow">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-gold font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-white/50 text-xs">{testimonial.location}</p>
                      </div>
                      <span className="ml-auto text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">
                        {testimonial.service}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => scroll('prev')}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/40 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('next')}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/40 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
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
            className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Join Our Happy Clients
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
