'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag, Clock, BookOpen } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const articles = [
  {
    title: 'How to Choose the Perfect White Paint',
    excerpt:
      'With hundreds of whites on the market, picking the right one can be overwhelming. We break down the key differences between warm, cool, and neutral whites — and which rooms they work best in.',
    date: 'December 15, 2024',
    category: 'Interior Tips',
    categoryColor: '#3B82F6',
    readTime: '5 min read',
    image: '/images/blog-white-paint.jpg',
  },
  {
    title: '5 Exterior Paint Colors That Boost Curb Appeal',
    excerpt:
      'Your home\'s exterior color makes a lasting first impression. Discover the five top-performing colors that real estate agents say consistently attract buyers in the Toronto market.',
    date: 'December 8, 2024',
    category: 'Exterior Tips',
    categoryColor: '#5B7B5A',
    readTime: '6 min read',
    image: '/images/blog-exterior-colors.jpg',
  },
  {
    title: 'The Complete Guide to Cabinet Refinishing',
    excerpt:
      'Thinking about updating your kitchen without the cost of a full renovation? Cabinet refinishing can transform your space for a fraction of the price. Here\'s everything you need to know.',
    date: 'November 30, 2024',
    category: 'Cabinets',
    categoryColor: '#C8973E',
    readTime: '8 min read',
    image: '/images/blog-cabinets.jpg',
  },
  {
    title: 'When to Paint Your Home\'s Exterior',
    excerpt:
      'Timing matters when it comes to exterior painting. Learn the optimal months, temperature ranges, and weather conditions for a flawless, long-lasting finish on your home\'s exterior.',
    date: 'November 22, 2024',
    category: 'Seasonal',
    categoryColor: '#8B5CF6',
    readTime: '4 min read',
    image: '/images/blog-seasonal.jpg',
  },
  {
    title: 'Commercial Painting: Minimizing Business Disruption',
    excerpt:
      'Painting your commercial space doesn\'t have to mean shutting down operations. We share our strategies for after-hours work, phased scheduling, and zero-downtime transformations.',
    date: 'November 15, 2024',
    category: 'Commercial',
    categoryColor: '#EF4444',
    readTime: '5 min read',
    image: '/images/blog-commercial.jpg',
  },
  {
    title: 'Toronto Neighborhood Color Trends 2024',
    excerpt:
      'From the bold accents of Liberty Village to the timeless neutrals of Rosedale, each Toronto neighborhood has its own signature style. Explore this year\'s most popular color choices across the GTA.',
    date: 'November 8, 2024',
    category: 'Trends',
    categoryColor: '#0B1D3A',
    readTime: '7 min read',
    image: '/images/blog-trends.jpg',
  },
];

const categories = [
  { name: 'Interior Tips', count: 12 },
  { name: 'Exterior Tips', count: 8 },
  { name: 'Color Trends', count: 10 },
  { name: 'Maintenance', count: 6 },
  { name: 'Commercial', count: 5 },
];

export default function BlogPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Painting Tips & Insights"
        subtitle="Expert advice from our professional team."
        breadcrumbs={[{ label: 'Blog' }]}
        compact
      />

      {/* Blog Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content - Articles */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-8"
              >
                <BookOpen className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold text-navy">Latest Articles</h2>
                <span className="text-gray-400 text-sm ml-2">{articles.length} articles</span>
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                className="space-y-6"
              >
                {articles.map((article) => (
                  <motion.article
                    key={article.title}
                    variants={item}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image placeholder */}
                      <div className="sm:w-48 md:w-64 h-48 sm:h-auto bg-gradient-to-br from-navy/10 to-gold/10 relative overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-gold/40" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 sm:p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${article.categoryColor}15`,
                              color: article.categoryColor,
                            }}
                          >
                            <Tag className="w-3 h-3" />
                            {article.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-200">
                          <Link href="#">{article.title}</Link>
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        <Link
                          href="#"
                          className="inline-flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all duration-200"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:sticky lg:top-24 space-y-8"
              >
                {/* Categories */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gold" />
                    Categories
                  </h3>
                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <Link
                          href="#"
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-cream hover:text-gold transition-colors duration-200 group"
                        >
                          <span>{category.name}</span>
                          <span className="text-xs text-gray-400 group-hover:text-gold bg-cream group-hover:bg-gold/10 px-2.5 py-0.5 rounded-full transition-colors duration-200">
                            {category.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter CTA */}
                <div className="bg-navy rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Stay Updated</h3>
                  <p className="text-white/50 text-sm mb-5">
                    Get painting tips, color trends, and exclusive offers delivered to your inbox.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm w-full justify-center"
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-navy mb-5">Quick Links</h3>
                  <ul className="space-y-2">
                    {[
                      { label: 'Free Estimate', href: '/free-estimate' },
                      { label: 'Our Services', href: '/services' },
                      { label: 'Color Consultation', href: '/services/color-consultation' },
                      { label: 'Our Guarantee', href: '/guarantee' },
                      { label: 'Contact Us', href: '/contact' },
                    ].map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold transition-colors duration-200 group"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gold transition-colors duration-200" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
