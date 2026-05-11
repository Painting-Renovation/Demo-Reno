'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
  BadgeCheck,
  Video,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

interface VideoTestimonial {
  id: number;
  name: string;
  location: string;
  service: string;
  rating: number;
  duration: string;
  testimonial: string;
  color: string;
  initials: string;
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'Downtown Toronto',
    service: 'Interior Painting',
    rating: 5,
    duration: '2:34',
    testimonial:
      'ProCoat completely transformed our downtown condo. The attention to detail was incredible — they even painted behind the radiators and inside the closets. The crew was professional, clean, and finished two days ahead of schedule. Our real estate agent said the fresh paint added at least $15,000 to our property value. We honestly can not recommend them more highly to anyone looking for top-quality painting in Toronto.',
    color: 'from-gold to-gold-light',
    initials: 'SM',
  },
  {
    id: 2,
    name: 'James K.',
    location: 'North York',
    service: 'Exterior Painting',
    rating: 5,
    duration: '3:12',
    testimonial:
      'We needed our exterior completely redone before putting our home on the market. ProCoat gave us a fair and transparent quote, started exactly on time, and the result was absolutely stunning. Our real estate agent said it was the best-looking house on the block. The house sold in just 3 days above asking price! The neighbors even asked for their contact information. Worth every penny.',
    color: 'from-sage to-sage-light',
    initials: 'JK',
  },
  {
    id: 3,
    name: 'Priya R.',
    location: 'Mississauga',
    service: 'Cabinet Refinishing',
    rating: 5,
    duration: '1:58',
    testimonial:
      'I was absolutely amazed at what they could do with our tired, dated oak cabinets. They look brand new in a beautiful soft white that modernized our entire kitchen. We saved thousands compared to a full cabinet replacement. The team was incredibly respectful of our home, covered everything perfectly, and left the space spotless. It honestly feels like a brand new kitchen.',
    color: 'from-navy to-navy-light',
    initials: 'PR',
  },
  {
    id: 4,
    name: 'Michael T.',
    location: 'Scarborough',
    service: 'Deck & Fence Staining',
    rating: 5,
    duration: '2:45',
    testimonial:
      'Our cedar deck had faded badly over the years from the harsh Canadian weather. ProCoat sanded, stained, and sealed it beautifully — it looks like the day it was first installed. They even fixed a few rotting boards we did not even know about and reinforced a weak railing. Their craftsmanship and attention to structural details really sets them apart. Exceptional service from start to finish.',
    color: 'from-[#E8B94E] to-[#C8973E]',
    initials: 'MT',
  },
  {
    id: 5,
    name: 'Linda & David W.',
    location: 'Markham',
    service: 'Full Home Interior',
    rating: 5,
    duration: '3:28',
    testimonial:
      'We have now used ProCoat for three separate projects — our living room, master bedroom, and nursery. Each time, the quality has been consistently excellent. They helped us pick perfect colors that flow beautifully between rooms and were incredibly patient with our kids and golden retriever running around. They truly feel like family after all these projects. We would not trust anyone else.',
    color: 'from-[#3B82A0] to-[#0B1D3A]',
    initials: 'LW',
  },
];

export function VideoTestimonials() {
  const { setEstimateFormOpen } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingTestimonial, setPlayingTestimonial] = useState<VideoTestimonial | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToIndex = useCallback(
    (index: number) => {
      const newIndex = ((index % videoTestimonials.length) + videoTestimonials.length) % videoTestimonials.length;
      setCurrentIndex(newIndex);
    },
    []
  );

  // Auto-advance carousel
  useEffect(() => {
    if (isModalOpen) return;
    const interval = setInterval(() => {
      scrollToIndex(currentIndex + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isModalOpen, scrollToIndex]);

  // Modal playback simulation
  useEffect(() => {
    if (isModalOpen && isPlaying && playingTestimonial) {
      progressInterval.current = setInterval(() => {
        setScrollProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          // Auto scroll text
          if (scrollRef.current) {
            const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
            scrollRef.current.scrollTop = (prev / 100) * maxScroll;
          }
          return prev + 1;
        });
      }, 80); // ~8 seconds total
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isModalOpen, isPlaying, playingTestimonial]);

  const openVideoModal = (testimonial: VideoTestimonial) => {
    setPlayingTestimonial(testimonial);
    setScrollProgress(0);
    setIsPlaying(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPlayingTestimonial(null);
    setScrollProgress(0);
    setIsPlaying(false);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  // Visible cards for carousel
  const visibleIndices = Array.from({ length: 3 }, (_, i) => (currentIndex + i) % videoTestimonials.length);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-5">
            <Video className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Video Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Hear It From{' '}
            <span className="text-gradient-gold">Our Clients</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real homeowners share their ProCoat experience. Watch their stories and see the transformations.
          </p>
        </motion.div>

        {/* Video Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {visibleIndices.map((idx) => {
            const t = videoTestimonials[idx];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail / Video Preview */}
                <div
                  className="relative aspect-video bg-gradient-to-br from-navy/90 to-navy-light/90 cursor-pointer overflow-hidden"
                  onClick={() => openVideoModal(t)}
                >
                  {/* Background pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 2px 2px, rgba(200,151,62,0.4) 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Avatar watermark */}
                  <div className="absolute bottom-3 right-3 w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <span className="text-white/40 font-bold text-lg">{t.initials}</span>
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/20"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/15"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                      />
                      <div className="relative w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center shadow-lg shadow-gold/30 group-hover:bg-gold transition-colors">
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < t.rating ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{t.rating}.0</span>
                  </div>

                  {/* Name & Location */}
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-navy">{t.name}</h4>
                    <BadgeCheck className="w-4 h-4 text-sage" />
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{t.location}</p>

                  {/* Service badge */}
                  <Badge variant="outline" className="text-xs border-gold/30 text-gold">
                    {t.service}
                  </Badge>

                  {/* Preview text */}
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                    &ldquo;{t.testimonial.slice(0, 100)}...&rdquo;
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => scrollToIndex(currentIndex - 1)}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/40 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {videoTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-gold w-8'
                  : i === (currentIndex + 1) % videoTestimonials.length || i === (currentIndex + 2) % videoTestimonials.length
                  ? 'bg-gold/30'
                  : 'bg-gray-200'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
          <button
            onClick={() => scrollToIndex(currentIndex + 1)}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/40 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Ready to share your own success story?</p>
          <Button
            onClick={() => setEstimateFormOpen(true)}
            className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Project
          </Button>
        </motion.div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {isModalOpen && playingTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-navy to-navy-light p-5 relative">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${playingTestimonial.color} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white font-bold text-lg">{playingTestimonial.initials}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">{playingTestimonial.name}</h3>
                      <BadgeCheck className="w-4 h-4 text-sage" />
                    </div>
                    <p className="text-white/60 text-sm">{playingTestimonial.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < playingTestimonial.rating ? 'fill-gold text-gold' : 'fill-white/20 text-white/20'}`}
                          />
                        ))}
                      </div>
                      <Badge className="bg-gold/20 text-gold border-0 text-[10px] px-2 py-0">
                        {playingTestimonial.service}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-5 pt-4">
                <div className="flex items-center gap-3 mb-1">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-navy/10 hover:bg-navy/20 flex items-center justify-center text-navy transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-navy rounded-full" />
                        <div className="w-1 h-3 bg-navy rounded-full" />
                      </div>
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gold rounded-full"
                      animate={{ width: `${scrollProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono min-w-[32px] text-right">
                    {Math.round(scrollProgress)}%
                  </span>
                </div>
              </div>

              {/* Testimonial Text */}
              <div
                ref={scrollRef}
                className="px-5 py-4 max-h-48 overflow-y-auto text-sm text-gray-700 leading-relaxed"
              >
                <Quote className="w-6 h-6 text-gold/30 mb-2" />
                <p>{playingTestimonial.testimonial}</p>
              </div>

              {/* Footer CTA */}
              <div className="px-5 pb-5">
                <Button
                  onClick={() => {
                    closeModal();
                    setEstimateFormOpen(true);
                  }}
                  className="w-full bg-gold hover:bg-gold-light text-white font-semibold py-5 rounded-xl transition-all"
                >
                  Get Similar Results — Free Estimate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
