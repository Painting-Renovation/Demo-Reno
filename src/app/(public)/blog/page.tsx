'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag, Clock, BookOpen, Search, TrendingUp, Star, Palette } from 'lucide-react';
import { blogArticles, blogCategories, getFeaturedArticles, getArticlesByCategory, getContrastTextColor } from '@/lib/blog-data';
import type { BlogArticle } from '@/lib/blog-data';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const featuredContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const featuredItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Category icon mapping
const categoryIcons: Record<string, string> = {
  'Residential Demolition': '🏠',
  'Commercial Demolition': '🏢',
  'Safety & Regulations': '🛡️',
  'Cost & Planning': '📊',
  'Environmental': '🌿',
  'DIY vs Pro': '🛠️',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const featured = getFeaturedArticles();
  const filteredArticles = blogArticles.filter((article) => {
    const matchesCategory = !activeCategory || article.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="bg-cream">
      <PageHero
        title="Demolition Tips & Insights"
        subtitle="Expert advice, safety guides, and professional demolition tips from our team of experienced demolition specialists. Stay informed and make confident decisions for your next project."
        breadcrumbs={[{ label: 'Blog' }]}
        compact
      >
        {/* Search bar */}
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search articles — permits, costs, safety tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:bg-white/15 transition-all text-sm sm:text-base"
            />
          </div>
        </div>
      </PageHero>

      {/* Stats bar */}
      <section className="border-b border-gold/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-navy">{blogArticles.length} Articles</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-navy">{blogArticles.length} Unique Colors</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>Updated weekly with new insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featured.length > 0 && !searchQuery && !activeCategory && (
        <section className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-gold" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy">Featured Articles</h2>
            </motion.div>

            <motion.div
              variants={featuredContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {featured.map((article) => (
                <motion.div key={article.slug} variants={featuredItem}>
                  <Link href={`/blog/${article.slug}`}>
                    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                      {/* Cover image header */}
                      <div
                        className="h-48 sm:h-56 relative overflow-hidden"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {/* Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm"
                            style={{ color: article.paintColor }}
                          >
                            <Tag className="w-3 h-3" />
                            {article.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gold text-white">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        </div>
                        {/* Paint swatch badge in corner */}
                        <div className="absolute bottom-4 left-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${getContrastTextColor(article.paintColor) === 'dark' ? 'bg-white/90 text-gray-800' : 'bg-black/50 text-white'}`}
                          >
                            <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: article.paintColor }} />
                            {article.paintColorName}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-navy mb-3 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ backgroundColor: article.paintColor }}
                            >
                              {article.author.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-navy">{article.author}</p>
                              <p className="text-[10px] text-gray-400">{article.authorRole}</p>
                            </div>
                          </div>
                          <span
                            className="inline-flex items-center gap-1.5 font-semibold text-sm group-hover:gap-2.5 transition-all duration-200"
                            style={{ color: article.paintColor }}
                          >
                            Read
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Content */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            {/* Main Content - Articles */}
            <div className="flex-1">
              {/* Category Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                      !activeCategory
                        ? 'bg-navy text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    All Articles
                  </button>
                  {blogCategories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center gap-1.5 ${
                        activeCategory === category.name
                          ? 'bg-navy text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="text-xs">{categoryIcons[category.name] || '📄'}</span>
                      {category.name}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeCategory === category.name
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Results count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-6"
              >
                <BookOpen className="w-5 h-5 text-gold" />
                <h2 className="text-xl sm:text-2xl font-bold text-navy">
                  {activeCategory || 'Latest Articles'}
                </h2>
                <span className="text-gray-400 text-sm ml-2">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                </span>
              </motion.div>

              {/* Articles list */}
              {filteredArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 bg-white rounded-2xl border border-gray-100"
                >
                  <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">No articles found</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Try adjusting your search or category filter.
                  </p>
                  <button
                    onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
                    className="text-gold font-semibold text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-50px' }}
                  className="space-y-6"
                >
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </motion.div>
              )}
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
                    {blogCategories.map((category) => (
                      <li key={category.slug}>
                        <button
                          onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-cream hover:text-gold transition-colors duration-200 group"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-xs">{categoryIcons[category.name] || '📄'}</span>
                            {category.name}
                          </span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full transition-colors duration-200 ${
                            activeCategory === category.name
                              ? 'bg-gold/10 text-gold'
                              : 'bg-cream group-hover:bg-gold/10 text-gray-400 group-hover:text-gold'
                          }`}>
                            {category.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter CTA */}
                <div className="bg-navy rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage/5 rounded-full blur-2xl" />
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Stay Updated</h3>
                    <p className="text-white/50 text-sm mb-5 leading-relaxed">
                      Get demolition tips, safety guides, and exclusive offers delivered to your inbox.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm w-full justify-center"
                    >
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-navy mb-5">Quick Links</h3>
                  <ul className="space-y-2">
                    {[
                      { label: 'Free Estimate', href: '/free-estimate' },
                      { label: 'Our Services', href: '/services' },
                      { label: 'Residential Demolition', href: '/services/residential-demolition' },
                      { label: 'Commercial Demolition', href: '/services/commercial-demolition' },
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

                {/* Popular Tags */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-navy mb-5">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['demolition', 'permits', 'residential', 'cost guide', 'concrete removal', 'Toronto', 'safety', 'asbestos', 'commercial', 'strip-out'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-cream text-gray-600 hover:bg-gold/10 hover:text-gold transition-colors duration-200"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function ArticleCard({ article }: { article: BlogArticle }) {
  const categoryIcon = categoryIcons[article.category] || '📝';

  return (
    <motion.article
      variants={item}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
      style={{ borderLeft: `4px solid ${article.paintColor}` }}
    >
      <Link href={`/blog/${article.slug}`} className="flex flex-col sm:flex-row">
        {/* Cover image area */}
        <div
          className="sm:w-48 md:w-64 h-48 sm:h-auto relative overflow-hidden flex-shrink-0"
        >
          <img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />
          {/* Paint swatch badge in corner */}
          <div className="absolute bottom-3 left-3">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${getContrastTextColor(article.paintColor) === 'dark' ? 'bg-white/90 text-gray-800' : 'bg-black/50 text-white'}`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: article.paintColor }} />
              {article.paintColorName}
            </span>
          </div>
          {article.featured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold text-white uppercase tracking-wider">
                <Star className="w-2.5 h-2.5" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${article.paintColor}15`,
                color: article.paintColor,
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

          <h3 className="text-lg sm:text-xl font-bold text-navy mb-3 group-hover:text-gray-700 transition-colors duration-200">
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: article.paintColor }}
              >
                {article.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-medium text-navy">{article.author}</p>
                <p className="text-[10px] text-gray-400">{article.authorRole}</p>
              </div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 font-semibold text-sm group-hover:gap-2.5 transition-all duration-200"
              style={{ color: article.paintColor }}
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
