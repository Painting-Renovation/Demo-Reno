'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Flower2, Sun, Leaf, Snowflake, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tip {
  id: number;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  title: string;
  excerpt: string;
  readTime: string;
  icon: typeof Flower2;
  featured?: boolean;
}

const seasonConfig: Record<string, { color: string; bg: string; border: string; icon: typeof Flower2; hoverClass: string; gradientBg: string }> = {
  Spring: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Flower2, hoverClass: 'tip-spring', gradientBg: 'from-green-50/50 to-white' },
  Summer: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Sun, hoverClass: 'tip-summer', gradientBg: 'from-amber-50/50 to-white' },
  Fall: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: Leaf, hoverClass: 'tip-fall', gradientBg: 'from-orange-50/50 to-white' },
  Winter: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Snowflake, hoverClass: 'tip-winter', gradientBg: 'from-blue-50/50 to-white' },
};

const tips: Tip[] = [
  {
    id: 1,
    season: 'Spring',
    title: '5 Best Interior Colors for Spring 2024',
    excerpt:
      'Discover this year\'s trending colors from Benjamin Moore and Sherwin-Williams that will freshen up any space. From soft sage greens to warm terracottas, these palettes bring new life to your home.',
    readTime: '4 min read',
    icon: Flower2,
    featured: true,
  },
  {
    id: 2,
    season: 'Summer',
    title: 'How to Prepare Your Home for Exterior Painting',
    excerpt:
      'Essential prep steps homeowners should take before our crew arrives for a flawless finish. From pressure washing to landscaping protection, proper prep ensures the longest-lasting results.',
    readTime: '6 min read',
    icon: Sun,
  },
  {
    id: 3,
    season: 'Fall',
    title: 'Kitchen Cabinet Refinishing: Worth It or Not?',
    excerpt:
      'A cost-benefit analysis comparing refinishing vs. replacement with real numbers. Learn when refinishing makes sense and when you should consider a full upgrade for your kitchen.',
    readTime: '5 min read',
    icon: Leaf,
  },
  {
    id: 4,
    season: 'Winter',
    title: 'Winter Painting: Is It Possible in Toronto?',
    excerpt:
      'What you need to know about painting during Toronto\'s cold months and when to schedule instead. Interior painting is absolutely doable — here\'s how we make it work flawlessly.',
    readTime: '3 min read',
    icon: Snowflake,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function SeasonalTips() {
  const featuredTip = tips.find((t) => t.featured);
  const otherTips = tips.filter((t) => !t.featured);

  return (
    <section id="tips" className="py-20 bg-cream relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-navy/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Lightbulb className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-navy/70">Expert Knowledge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3 text-balance">
            Painting Tips &amp; Insights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Seasonal guides, expert advice, and industry tips to help you make informed decisions about your painting projects.
          </p>
        </motion.div>

        {/* Featured Tip Card - Full Width */}
        {featuredTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <motion.article
              className="relative rounded-2xl overflow-hidden group cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Large background image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src="/images/hero-interior.jpg"
                  alt={featuredTip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-navy/30" />
                <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                  <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 bg-gold/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      <Flower2 className="w-3.5 h-3.5" />
                      Featured: Spring Guide
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                      {featuredTip.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-2 hidden sm:block">
                      {featuredTip.excerpt}
                    </p>
                  </div>
                </div>
              </div>
              {/* Featured card footer */}
              <div className="px-6 sm:px-10 py-4 flex items-center justify-between bg-white">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredTip.readTime}
                </span>
                <span className="text-sm font-semibold text-gold flex items-center gap-2 group-hover:gap-3 transition-all duration-300 link-underline-visible">
                  Read Full Guide
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.article>
          </motion.div>
        )}

        {/* Other Tips Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {otherTips.map((tip) => {
            const config = seasonConfig[tip.season];
            const SeasonIcon = config.icon;

            return (
              <motion.article
                key={tip.id}
                variants={itemVariants}
                className={`bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col tip-hover-border ${config.hoverClass}`}
              >
                {/* Season badge + icon */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${config.color} ${config.bg} border ${config.border}`}
                  >
                    <SeasonIcon className="w-3.5 h-3.5" />
                    {tip.season}
                  </span>
                  <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <BookOpen className={`w-5 h-5 ${config.color}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-navy mb-3 leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
                  {tip.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow line-clamp-3">
                  {tip.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tip.readTime}
                  </span>
                  <span className="text-xs font-semibold text-gold flex items-center gap-1 group-hover:gap-2 transition-all duration-300 link-underline-visible">
                    Read More
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button
            variant="outline"
            className="border-navy/20 text-navy hover:bg-navy hover:text-white font-semibold px-8 py-3 rounded-lg transition-all"
          >
            View All Tips
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
