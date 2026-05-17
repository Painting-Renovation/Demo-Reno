'use client';

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, Tag, Clock, BookOpen, User, Share2, ChevronRight, Phone } from 'lucide-react';
import { blogArticles, getArticleBySlug, getRelatedArticles } from '@/lib/blog-data';
import type { BlogContent } from '@/lib/blog-data';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article);

  return (
    <main className="bg-cream">
      <PageHero
        title={article.title}
        subtitle={`${article.category} · ${article.readTime}`}
        breadcrumbs={[
          { label: 'Blog', href: '/blog' },
          { label: article.category },
          { label: article.title },
        ]}
        compact
      />

      <article className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy">
                {article.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{article.author}</p>
                <p className="text-xs text-gray-500">{article.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="ml-auto flex items-center gap-1.5 text-sm text-gray-400 hover:text-gold transition-colors min-h-[44px] px-3 rounded-lg hover:bg-white"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </motion.div>

          {/* Article content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="prose-custom"
          >
            {article.content.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:border-gold/30 hover:text-gold transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Author box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 p-6 sm:p-8 bg-white rounded-2xl border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy/10 to-gold/10 flex items-center justify-center text-lg font-bold text-navy flex-shrink-0">
                {article.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-1">Written by</p>
                <h4 className="text-lg font-bold text-navy">{article.author}</h4>
                <p className="text-sm text-gray-500 mb-3">{article.authorRole} at In &amp; Out Demolition</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  With years of professional demolition experience in the Greater Toronto Area, our team shares practical knowledge to help homeowners and businesses make informed decisions about their demolition and renovation projects.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 bg-navy rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-sage/5 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Ready to Start Your Demolition Project?
              </h3>
              <p className="text-white/60 text-sm sm:text-base mb-6 max-w-xl mx-auto">
                Get a free, no-obligation estimate from our expert team. We&apos;ll assess your project, recommend the best approach, and provide transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 text-sm min-h-[44px] shadow-lg hover:shadow-xl"
                >
                  Get Free Estimate
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+14375350494"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm min-h-[44px] border border-white/10"
                >
                  <Phone className="w-4 h-4" />
                  (437) 535-0494
                </a>
              </div>
            </div>
          </motion.div>

          {/* Back to blog + related articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-14"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gold font-semibold text-sm mb-8 hover:gap-3 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </Link>

            {relatedArticles.length > 0 && (
              <>
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedArticles.map((related) => (
                    <Link key={related.slug} href={`/blog/${related.slug}`}>
                      <div className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all duration-300 h-full">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3"
                          style={{
                            backgroundColor: `${related.categoryColor}12`,
                            color: related.categoryColor,
                          }}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {related.category}
                        </span>
                        <h4 className="text-sm font-bold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{related.excerpt}</p>
                        <span className="inline-flex items-center gap-1 text-gold text-xs font-semibold mt-3 group-hover:gap-2 transition-all">
                          Read
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </article>
    </main>
  );
}

function ContentBlock({ block }: { block: BlogContent }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <motion.p variants={item} className="text-gray-700 text-base sm:text-[17px] leading-relaxed sm:leading-8 mb-6">
          {block.text}
        </motion.p>
      );

    case 'heading2':
      return (
        <motion.h2 variants={item} className="text-xl sm:text-2xl font-bold text-navy mt-10 mb-4 flex items-center gap-3">
          <span className="w-1 h-7 bg-gold rounded-full flex-shrink-0" />
          {block.text}
        </motion.h2>
      );

    case 'heading3':
      return (
        <motion.h3 variants={item} className="text-lg sm:text-xl font-semibold text-navy mt-8 mb-3 pl-4 border-l-2 border-gold/30">
          {block.text}
        </motion.h3>
      );

    case 'bullets':
      return (
        <motion.ul variants={item} className="space-y-3 mb-6 ml-1">
          {block.items?.map((listItem, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              </span>
              <span className="text-gray-700 text-base sm:text-[17px] leading-relaxed">{listItem}</span>
            </li>
          ))}
        </motion.ul>
      );

    case 'numbered':
      return (
        <motion.ol variants={item} className="space-y-3 mb-6 ml-1">
          {block.items?.map((listItem, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-gray-700 text-base sm:text-[17px] leading-relaxed">{listItem}</span>
            </li>
          ))}
        </motion.ol>
      );

    case 'quote':
      return (
        <motion.blockquote variants={item} className="my-8 pl-6 sm:pl-8 border-l-4 border-gold bg-white/60 rounded-r-xl p-6 sm:p-8">
          <p className="text-navy/80 text-base sm:text-lg italic leading-relaxed mb-3">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.caption && (
            <cite className="text-sm text-gold font-semibold not-italic">{block.caption}</cite>
          )}
        </motion.blockquote>
      );

    case 'tip':
      return (
        <motion.div variants={item} className="my-8 bg-gradient-to-r from-gold/5 to-gold/[0.02] border border-gold/15 rounded-xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-xs font-bold text-gold uppercase tracking-wider mb-1.5">Pro Tip</p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{block.text}</p>
            </div>
          </div>
        </motion.div>
      );

    case 'divider':
      return (
        <motion.div variants={item} className="my-10">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>
      );

    default:
      return null;
  }
}
