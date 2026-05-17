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
import { ArrowRight, ArrowLeft, Calendar, Tag, Clock, BookOpen, User, Share2, ChevronRight, Phone, Palette } from 'lucide-react';
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
  const pc = article.paintColor;

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

      {/* Paint color swatch bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: pc }} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: pc }}>Article Color</p>
                <p className="text-sm font-medium text-navy">{article.paintColorName}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-gray-400">{pc}</span>
            </div>
          </div>
        </div>
      </div>

      <article className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 mb-8 pb-8"
            style={{ borderBottom: `2px solid ${pc}25` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: pc }}
              >
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
              className="ml-auto flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] px-3 rounded-lg hover:bg-white"
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
              <ContentBlock key={i} block={block} paintColor={pc} />
            ))}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 pt-8"
            style={{ borderTop: `2px solid ${pc}25` }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: pc }} />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-default"
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
            style={{ borderLeft: `4px solid ${pc}` }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                style={{ backgroundColor: pc }}
              >
                {article.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: pc }}>Written by</p>
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
            className="mt-10 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden"
            style={{ backgroundColor: pc }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-white/70" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/60">{article.paintColorName}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Ready to Start Your Demolition Project?
              </h3>
              <p className="text-white/70 text-sm sm:text-base mb-6 max-w-xl mx-auto">
                Get a free, no-obligation estimate from our expert team. We&apos;ll assess your project, recommend the best approach, and provide transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 text-sm min-h-[44px] shadow-lg hover:shadow-xl"
                  style={{ color: pc }}
                >
                  Get Free Estimate
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+14375350494"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm min-h-[44px] border border-white/20"
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
              className="inline-flex items-center gap-2 font-semibold text-sm mb-8 hover:gap-3 transition-all duration-200"
              style={{ color: pc }}
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
                      <div className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-300 h-full"
                        style={{ borderLeft: `3px solid ${related.paintColor}` }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: related.paintColor }} />
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{related.paintColorName}</span>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3"
                          style={{
                            backgroundColor: `${related.paintColor}15`,
                            color: related.paintColor,
                          }}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {related.category}
                        </span>
                        <h4 className="text-sm font-bold text-navy mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{related.excerpt}</p>
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold mt-3 group-hover:gap-2 transition-all"
                          style={{ color: related.paintColor }}
                        >
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

function ContentBlock({ block, paintColor }: { block: BlogContent; paintColor: string }) {
  const pc = paintColor;

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
          <span className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: pc }} />
          {block.text}
        </motion.h2>
      );

    case 'heading3':
      return (
        <motion.h3 variants={item} className="text-lg sm:text-xl font-semibold text-navy mt-8 mb-3 pl-4" style={{ borderLeft: `2px solid ${pc}60` }}>
          {block.text}
        </motion.h3>
      );

    case 'bullets':
      return (
        <motion.ul variants={item} className="space-y-3 mb-6 ml-1">
          {block.items?.map((listItem, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${pc}18` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pc }} />
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
              <span
                className="w-6 h-6 rounded-full text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ backgroundColor: pc }}
              >
                {i + 1}
              </span>
              <span className="text-gray-700 text-base sm:text-[17px] leading-relaxed">{listItem}</span>
            </li>
          ))}
        </motion.ol>
      );

    case 'quote':
      return (
        <motion.blockquote
          variants={item}
          className="my-8 pl-6 sm:pl-8 bg-white/60 rounded-r-xl p-6 sm:p-8"
          style={{ borderLeft: `4px solid ${pc}` }}
        >
          <p className="text-navy/80 text-base sm:text-lg italic leading-relaxed mb-3">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.caption && (
            <cite className="text-sm font-semibold not-italic" style={{ color: pc }}>{block.caption}</cite>
          )}
        </motion.blockquote>
      );

    case 'tip':
      return (
        <motion.div
          variants={item}
          className="my-8 rounded-xl p-5 sm:p-6"
          style={{
            background: `linear-gradient(to right, ${pc}0D, ${pc}05)`,
            border: `1px solid ${pc}25`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${pc}25` }}
            >
              <BookOpen className="w-4 h-4" style={{ color: pc }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: pc }}>Pro Tip</p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{block.text}</p>
            </div>
          </div>
        </motion.div>
      );

    case 'divider':
      return (
        <motion.div variants={item} className="my-10">
          <div
            className="h-px"
            style={{ background: `linear-gradient(to right, transparent, ${pc}40, transparent)` }}
          />
        </motion.div>
      );

    default:
      return null;
  }
}
