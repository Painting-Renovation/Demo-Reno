'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const serviceAreas = [
  'Toronto',
  'Mississauga',
  'Brampton',
  'Vaughan',
  'Markham',
  'Richmond Hill',
  'Scarborough',
  'North York',
  'Etobicoke',
  'Oakville',
  'Burlington',
  'Pickering',
  'Ajax',
  'Whitby',
  'Thornhill',
  'Unionville',
];

export function ServiceAreas() {
  const { setEstimateFormOpen } = useAppStore();

  return (
    <section id="service-areas" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            ProCoat Painters
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
            Proudly Serving the Greater Toronto Area
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From downtown condos to suburban family homes, we bring professional painting
            services to communities across the GTA.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Map placeholder / Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {/* GTA Map Stylized Visual */}
              <div className="relative aspect-square max-w-sm mx-auto">
                {/* Central Toronto marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gold/20 rounded-full animate-ping absolute inset-0" />
                    <div className="w-16 h-16 bg-gold/30 rounded-full flex items-center justify-center relative">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Area dots */}
                {[
                  { top: '20%', left: '30%' },
                  { top: '25%', left: '65%' },
                  { top: '35%', left: '15%' },
                  { top: '40%', left: '80%' },
                  { top: '60%', left: '20%' },
                  { top: '55%', left: '75%' },
                  { top: '75%', left: '35%' },
                  { top: '80%', left: '60%' },
                  { top: '15%', left: '45%' },
                  { top: '85%', left: '45%' },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="absolute"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className="w-3 h-3 bg-sage/60 rounded-full" />
                  </motion.div>
                ))}

                {/* Decorative circle */}
                <div className="absolute inset-4 border-2 border-dashed border-navy/10 rounded-full" />
                <div className="absolute inset-12 border-2 border-dashed border-gold/15 rounded-full" />

                <p className="absolute -bottom-2 left-0 right-0 text-center text-xs text-gray-400 font-medium">
                  GTA Coverage Area
                </p>
              </div>
            </div>
          </motion.div>

          {/* Area Tags */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 order-1 lg:order-2"
          >
            <div className="flex flex-wrap gap-3">
              {serviceAreas.map((area, index) => (
                <motion.button
                  key={area}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white border border-gray-200 text-navy px-5 py-2.5 rounded-xl text-sm font-medium hover:border-gold hover:text-gold hover:bg-gold/5 transition-all shadow-sm cursor-default flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {area}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-navy font-semibold text-sm mb-1">
                    Don&apos;t see your area?
                  </p>
                  <p className="text-gray-600 text-sm">
                    Contact us — we may still be able to help! We regularly extend our services
                    to surrounding communities.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
