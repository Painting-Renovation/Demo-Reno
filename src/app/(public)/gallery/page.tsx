'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ImageIcon, Sparkles } from 'lucide-react';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const Gallery = dynamic(
  () => import('@/components/website/Gallery').then((m) => ({ default: m.Gallery })),
  { ssr: false }
);
const BeforeAfterSlider = dynamic(
  () => import('@/components/website/BeforeAfterSlider').then((m) => ({ default: m.BeforeAfterSlider })),
  { ssr: false }
);

const stats = [
  { value: '2,000+', label: 'Projects Completed' },
  { value: '500+', label: 'Happy Homeowners' },
  { value: '15+', label: 'Years of Experience' },
  { value: '4.9/5', label: 'Average Rating' },
];

export default function GalleryPage() {
  return (
    <main className="bg-cream">
      <PageHero
        title="Our Portfolio"
        subtitle="Browse our completed projects and see the quality craftsmanship we bring to every home and business across the Greater Toronto Area."
        breadcrumbs={[{ label: 'Gallery' }]}
        backgroundImage="/images/hero-exterior.jpg"
        overlay="dark"
      />

      {/* Portfolio Stats Bar */}
      <section className="bg-navy py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      {/* Before & After Showcase */}
      <section className="bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center pt-16 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">Interactive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
            Before &amp; After Showcase
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Drag the slider to compare our dramatic transformations side by side. See the difference professional painting makes.
          </p>
        </motion.div>
        <BeforeAfterSlider />
      </section>

      {/* Process Overview */}
      <section className="bg-cream py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              How We Achieve <span className="text-gold">Perfect Results</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our proven process ensures consistent, high-quality results on every project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Consultation',
                description: 'We visit your space, discuss your vision, and provide expert colour recommendations.',
              },
              {
                step: '02',
                title: 'Preparation',
                description: 'Thorough surface prep including patching, sanding, and protecting your furnishings.',
              },
              {
                step: '03',
                title: 'Execution',
                description: 'Our skilled painters apply premium paints with precision and attention to detail.',
              },
              {
                step: '04',
                title: 'Final Walkthrough',
                description: 'We review every detail together to ensure you are 100% satisfied with the results.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-4xl font-bold text-gold/20 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sage/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                See your own space transformed. Get a free, no-obligation estimate
                and let our team bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/free-estimate"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gold/25 text-lg"
                >
                  Get Your Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
