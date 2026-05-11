'use client';

import { motion } from 'framer-motion';
import { PaintBucket, Home, Settings2, Building2, Trees, Palette, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const services = [
  {
    icon: PaintBucket,
    title: 'Interior Painting',
    description: 'Transform your living spaces with flawless interior painting. From walls to ceilings, trim to accent features — we deliver a perfect finish every time.',
    image: '/images/hero-interior.jpg',
    features: ['Walls & Ceilings', 'Trim & Baseboards', 'Accent Walls', 'Drywall Repair'],
    price: 'From $800',
    popular: true,
  },
  {
    icon: Home,
    title: 'Exterior Painting',
    description: 'Protect and beautify your home exterior with premium paints built to withstand Toronto\'s diverse weather conditions year-round.',
    image: '/images/hero-exterior.jpg',
    features: ['Siding & Stucco', 'Doors & Windows', 'Garage Doors', 'Weatherproofing'],
    price: 'From $1,500',
    popular: false,
  },
  {
    icon: Settings2,
    title: 'Cabinet Refinishing',
    description: 'Give your kitchen or bathroom a brand new look without the cost of replacement. Cabinet refinishing saves up to 70% compared to new cabinets.',
    image: '/images/cabinet-refinish.jpg',
    features: ['Kitchen Cabinets', 'Bathroom Vanities', 'Color Change', 'Laminate Refinishing'],
    price: 'From $600',
    popular: false,
  },
  {
    icon: Building2,
    title: 'Commercial Painting',
    description: 'Professional commercial painting services with minimal disruption to your business. Available evenings and weekends for your convenience.',
    image: '/images/commercial.jpg',
    features: ['Office Spaces', 'Retail Stores', 'Strata Properties', 'Industrial Units'],
    price: 'From $2,000',
    popular: false,
  },
  {
    icon: Trees,
    title: 'Deck & Fence Staining',
    description: 'Restore and protect your outdoor wood surfaces with professional staining and sealing services that extend the life of your deck and fence.',
    image: '/images/deck-fence.jpg',
    features: ['Deck Staining', 'Fence Painting', 'Wood Sealing', 'Restoration'],
    price: 'From $400',
    popular: false,
  },
  {
    icon: Palette,
    title: 'Color Consultation',
    description: 'Not sure which colors to choose? Our expert color consultants help you select the perfect palette to complement your space and style.',
    image: '/images/service-painting.jpg',
    features: ['Expert Guidance', 'Sample Testing', 'Trend Forecasting', 'Custom Palettes'],
    price: 'Free',
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function Services() {
  const { setEstimateFormOpen } = useAppStore();

  return (
    <section id="services" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle noise texture */}
      <div className="noise-overlay absolute inset-0 pointer-events-none" />

      {/* Background gradient orbs */}
      <div className="absolute top-20 -left-32 w-80 h-80 bg-gold/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sage/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-navy/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            ProCoat Painters
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 mb-4">
            <span className="text-gradient-animate bg-gradient-to-r from-navy via-gold to-navy">Our Professional Services</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From residential homes to commercial properties, we deliver exceptional painting results
            with meticulous attention to detail.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-10"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants as any}
              className="service-card-gradient service-card card-3d-hover group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-[0_25px_50px_-12px_rgba(11,29,58,0.2)] hover:border-gold/20"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-gold to-gold-light ring-1 ring-white/20 icon-rotate-hover">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-navy group-hover:text-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                  {'popular' in service && service.popular && (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 bg-gold/10 text-gold text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30 animate-badge-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-cream text-navy/80 px-3 py-1.5 rounded-full font-medium border border-gold/5 hover:bg-gold/10 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price indicator */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <span className={"text-sm font-semibold " + ('price' in service && service.price === 'Free' ? 'text-sage' : 'text-gold')}>
                    {'price' in service ? service.price : ''}
                  </span>
                  <button className="inline-flex items-center gap-1.5 text-gold font-semibold text-sm group-hover:gap-3 transition-all duration-300 underline-grow">
                    Learn More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Services Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-navy hover:text-gold font-medium transition-colors duration-300 underline-grow text-sm"
          >
            View all services and get a custom quote
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 bg-navy rounded-2xl p-10 md:p-14 relative overflow-hidden noise-overlay"
        >
          {/* Decorative gradient orb */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
            Ready to Transform Your Space?
          </h3>
          <p className="text-white/70 max-w-xl mx-auto mb-8 relative z-10">
            Get a free, no-obligation estimate tailored to your project. Our team is ready to bring
            your vision to life.
          </p>
          <div className="relative z-10">
            <Button
              onClick={() => setEstimateFormOpen(true)}
              className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 animate-pulse-glow"
            >
              Get Free Estimate
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
