'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
const PageHero = dynamic(
  () => import('@/components/shared/PageHero').then((m) => ({ default: m.PageHero })),
  { ssr: false }
);
const NeighborhoodSpotlight = dynamic(
  () => import('@/components/website/NeighborhoodSpotlight').then((m) => ({ default: m.NeighborhoodSpotlight })),
  { ssr: false }
);
import { motion } from 'framer-motion';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NeighborhoodsPage() {
  return (
    <>
      <PageHero
        title="Neighborhoods We Serve"
        subtitle="Proudly painting homes across Toronto and the Greater Toronto Area. See where your neighbors have trusted ProCoat."
        breadcrumbs={[{ label: 'Neighborhoods' }]}
        backgroundImage="/images/hero-exterior.jpg"
        overlay="dark"
      >
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <MapPin className="w-4 h-4 text-gold" />
            <span className="text-white/90 text-sm font-medium">14+ Cities &amp; Neighborhoods</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <span className="text-gold text-lg font-bold">500+</span>
            <span className="text-white/70 text-sm">Homes Painted</span>
          </div>
        </div>
      </PageHero>

      <NeighborhoodSpotlight />

      {/* Full GTA Coverage */}
      <section className="py-12 sm:py-16 md:py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Full GTA Coverage</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Whether you&apos;re in downtown Toronto or the surrounding suburbs, our crews are ready to transform your space.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {[
              'Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham',
              'Richmond Hill', 'Oakville', 'Burlington', 'Scarborough', 'North York',
              'Etobicoke', 'Pickering', 'Ajax', 'Whitby', 'Thornhill',
            ].map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center text-white/70 text-xs sm:text-sm hover:bg-gold/10 hover:border-gold/20 hover:text-gold transition-all cursor-default"
              >
                <MapPin className="w-3 h-3 mx-auto mb-1 text-gold/50" />
                {area}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">Your Neighborhood, Our Expertise</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of homeowners in your area who&apos;ve trusted ProCoat with their painting projects. Get your free estimate today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/free-estimate">
                <Button className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl">
                  Get Free Estimate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="tel:+14375350494">
                <Button variant="outline" className="border-2 border-navy/20 text-navy hover:bg-navy/5 px-6 py-3 rounded-lg transition-all">
                  <Phone className="w-4 h-4 mr-2" />
                  (437) 535-0494
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
