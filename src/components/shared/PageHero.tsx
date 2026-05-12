'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
  overlay?: 'dark' | 'light' | 'gradient';
  compact?: boolean;
  children?: React.ReactNode;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  backgroundImage,
  overlay = 'dark',
  compact = false,
  children,
}: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden ${compact ? 'pt-32 pb-12 md:pt-40 md:pb-16' : 'pt-32 pb-16 md:pt-40 md:pb-24'}`}>
      {/* Background Image */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className={`absolute inset-0 ${
            overlay === 'dark' ? 'bg-navy/85' :
            overlay === 'light' ? 'bg-white/90' :
            'bg-gradient-to-br from-navy/90 via-navy-light/85 to-navy/90'
          }`} />
        </>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <ol className="flex items-center gap-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/50 hover:text-gold transition-colors flex items-center gap-1"
                >
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                  {crumb.href && i < breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="text-white/50 hover:text-gold transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gold font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className={`font-bold text-white mb-4 ${
            compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl lg:text-6xl'
          }`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-white/70 max-w-3xl leading-relaxed ${
              compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
            }`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Extra content slot */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
