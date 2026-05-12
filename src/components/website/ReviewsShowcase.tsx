'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Clock, ThumbsUp, ExternalLink, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

type ServiceFilter = 'all' | 'interior' | 'exterior' | 'cabinets' | 'deck' | 'commercial';
type SortOption = 'recent' | 'highest' | 'helpful';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  service: string;
  serviceCategory: ServiceFilter;
  text: string;
  date: string;
  verified: boolean;
  source: 'Google' | 'HomeStars' | 'Houzz';
  helpful: number;
  image: string | null;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'Downtown Toronto, ON',
    rating: 5,
    service: 'Interior Painting',
    serviceCategory: 'interior',
    text: 'ProCoat completely transformed our 2-bedroom condo. Their crew was incredibly meticulous — they taped every edge perfectly and finished ahead of schedule. The Benjamin Moore Aura paint they used has a depth of color we didn\'t think was possible. Our space feels brand new. We\'ve already recommended them to three neighbors.',
    date: '2024-11-15',
    verified: true,
    source: 'Google',
    helpful: 24,
    image: '/images/hero-interior.jpg',
  },
  {
    id: 2,
    name: 'James Kirkpatrick',
    location: 'North York, ON',
    rating: 5,
    service: 'Exterior Painting',
    serviceCategory: 'exterior',
    text: 'We needed our full exterior redone before putting the house on the market. The crew power-washed, prepped, and painted everything in under a week. The color choice they helped us pick — a classic navy with white trim — got us multiple compliments from passersby. Our realtor said it was the best-looking house in the neighborhood. Sold in just 3 days over asking!',
    date: '2024-10-28',
    verified: true,
    source: 'HomeStars',
    helpful: 31,
    image: '/images/hero-exterior.jpg',
  },
  {
    id: 3,
    name: 'Priya Ramaswamy',
    location: 'Mississauga, ON',
    rating: 5,
    service: 'Cabinet Refinishing',
    serviceCategory: 'cabinets',
    text: 'I was skeptical that our 15-year-old oak cabinets could look modern again. The ProCoat team proved me wrong! They sanded, primed, and applied a beautiful soft matte white that makes our entire kitchen feel twice as big. The cost was less than a quarter of what replacement would have been. Absolutely thrilled with the result.',
    date: '2024-11-02',
    verified: true,
    source: 'Google',
    helpful: 19,
    image: '/images/cabinet-refinish.jpg',
  },
  {
    id: 4,
    name: 'Michael Torres',
    location: 'Scarborough, ON',
    rating: 5,
    service: 'Deck & Fence Staining',
    serviceCategory: 'deck',
    text: 'Our cedar deck had faded to a dull gray over the years. ProCoat sanded every board, replaced a few rotting ones we didn\'t even know about, and applied a beautiful semi-transparent stain. It looks better than the day it was installed. They also stained our fence and garden boxes. Fantastic value for the quality of work.',
    date: '2024-09-20',
    verified: false,
    source: 'HomeStars',
    helpful: 14,
    image: '/images/deck-fence.jpg',
  },
  {
    id: 5,
    name: 'Linda & David Williams',
    location: 'Markham, ON',
    rating: 5,
    service: 'Interior Painting',
    serviceCategory: 'interior',
    text: 'This is our third project with ProCoat — living room, master bedroom, and now the nursery. Each time the quality is consistently excellent. Their color consultant brought physical sample boards and helped us visualize the entire space before committing. The crew was patient with our toddler and golden retriever running around. True professionals.',
    date: '2024-11-10',
    verified: true,
    source: 'Houzz',
    helpful: 27,
    image: '/images/hero-interior.jpg',
  },
  {
    id: 6,
    name: 'Anita Sato',
    location: 'Oakville, ON',
    rating: 4,
    service: 'Color Consultation',
    serviceCategory: 'interior',
    text: 'The color consultation alone was worth every minute. Their expert brought sample boards and helped us test colors under different lighting conditions throughout the day. We went with a warm greige that makes our open-concept feel incredibly cohesive. The painting crew was meticulous and left our home spotless every evening.',
    date: '2024-10-05',
    verified: true,
    source: 'Google',
    helpful: 16,
    image: null,
  },
  {
    id: 7,
    name: 'Robert Chen',
    location: 'Richmond Hill, ON',
    rating: 5,
    service: 'Commercial Painting',
    serviceCategory: 'commercial',
    text: 'We hired ProCoat to repaint our 3,000 sq ft dental office during a long weekend. They finished on Monday morning, right on schedule, so we didn\'t lose a single day of business. The new color scheme — a calming sage green with white trim — has received compliments from patients and staff alike. Highly recommend for commercial projects.',
    date: '2024-08-22',
    verified: true,
    source: 'HomeStars',
    helpful: 12,
    image: '/images/commercial.jpg',
  },
  {
    id: 8,
    name: 'Emma Leblanc',
    location: 'Vaughan, ON',
    rating: 4,
    service: 'Exterior Painting',
    serviceCategory: 'exterior',
    text: 'Great experience overall. The team was professional and completed our two-story exterior in just four days. They took extra care with the prep work, which I appreciated since our stucco had some cracks. The only minor issue was a small touch-up needed on one window frame, but they came back within 24 hours to fix it. Would use again.',
    date: '2024-09-14',
    verified: false,
    source: 'Google',
    helpful: 9,
    image: '/images/hero-exterior.jpg',
  },
];

const ratingBreakdown = [
  { stars: 5, percent: 85 },
  { stars: 4, percent: 10 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const sourceColors: Record<string, string> = {
  Google: 'bg-blue-50 text-blue-700 border-blue-100',
  HomeStars: 'bg-green-50 text-green-700 border-green-100',
  Houzz: 'bg-orange-50 text-orange-700 border-orange-100',
};

const avatarGradients: Record<number, string> = {
  5: 'from-amber-400 to-yellow-500',
  4: 'from-blue-400 to-indigo-500',
  3: 'from-gray-300 to-gray-400',
};

const filterTabs: { id: ServiceFilter; label: string }[] = [
  { id: 'all', label: 'All Reviews' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'cabinets', label: 'Cabinets' },
  { id: 'deck', label: 'Deck' },
  { id: 'commercial', label: 'Commercial' },
];

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'highest', label: 'Highest Rated' },
  { id: 'helpful', label: 'Most Helpful' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function ReviewsShowcase() {
  const { setEstimateFormOpen } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const filteredReviews = useMemo(() => {
    let filtered = activeFilter === 'all' ? reviews : reviews.filter((r) => r.serviceCategory === activeFilter);

    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'highest':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating || b.helpful - a.helpful);
        break;
      case 'helpful':
        filtered = [...filtered].sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return filtered;
  }, [activeFilter, sortBy]);

  const formatDate = (dateStr: string) => {
    // Parse date parts directly from ISO string to avoid timezone-dependent
    // hydration mismatches between server and client (new Date('2024-11-15')
    // is parsed as UTC midnight, which shifts to the previous day in negative UTC offsets).
    const [year, month, day] = dateStr.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month - 1]} ${day}, ${year}`;
  };

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gold/30" />
            <div className="inline-flex items-center gap-2 bg-cream rounded-full px-4 py-1.5">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-sm font-medium text-navy/70">Customer Reviews</span>
            </div>
            <div className="w-12 h-px bg-gold/30" />
          </div>
          {/* Decorative quotation mark */}
          <div className="flex justify-center mb-3">
            <Quote className="w-8 h-8 text-gold/20" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            What Our Clients Really Think
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real reviews from real homeowners across the Greater Toronto Area. See why we maintain a 4.9-star rating.
          </p>
        </motion.div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-cream rounded-2xl p-6 md:p-8 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Big rating with gold circle badge */}
            <div className="flex items-center gap-6">
              <div className="rating-gold-circle flex-shrink-0">
                <span className="text-2xl font-bold text-white leading-none">4.9</span>
                <span className="text-[10px] text-white/80 font-medium">/ 5.0</span>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= 4 ? 'fill-gold text-gold' : 'fill-gold/40 text-gold/40'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 mt-1">Based on <strong className="text-navy">350+ verified reviews</strong></span>
                <div className="flex gap-2 mt-3">
                  {['Google', 'HomeStars', 'Houzz'].map((source) => (
                    <span
                      key={source}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sourceColors[source]}`}
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Breakdown bars */}
            <div className="space-y-2">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-navy w-12 text-right">{item.stars}★</span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                      className="h-full bg-gold rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-10">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filter & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === tab.id
                    ? 'bg-navy text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews Grid with premium card design */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="review-card-premium bg-white border border-gray-100 rounded-xl p-6 group"
            >
              {/* Top row with larger gradient avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${avatarGradients[review.rating] || avatarGradients[3]} rounded-full flex items-center justify-center shadow-sm`}>
                    <span className="text-white font-bold text-sm">{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy text-sm">{review.name}</span>
                      {review.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{review.location}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${sourceColors[review.source]}`}
                >
                  {review.source}
                </span>
              </div>

              {/* Stars + service badge */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= review.rating ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0 border-gold/30 text-gold bg-gold/5"
                >
                  {review.service}
                </Badge>
                <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {formatDate(review.date)}
                </span>
              </div>

              {/* Project photo */}
              {review.image && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <div
                    className="h-32 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${review.image})` }}
                  />
                </div>
              )}

              {/* Review text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.helpful})
                </button>
                {review.verified && (
                  <span className="text-[10px] font-medium text-sage flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Customer
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA with animate-glow-pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => setEstimateFormOpen(true)}
            className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl animate-glow-pulse"
          >
            Write a Review
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
