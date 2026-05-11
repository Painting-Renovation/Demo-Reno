'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudRain, Wind, Snowflake, Droplets, Thermometer, Sparkles, Leaf, Download, PiggyBank, CheckCircle2, Paintbrush, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SeasonTip {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Season {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  tips: SeasonTip[];
}

const seasons: Season[] = [
  {
    id: 'spring',
    name: 'Spring',
    icon: Sun,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    tips: [
      { icon: Droplets, title: 'Inspect for Winter Damage', description: 'Check for peeling, cracking, or blistering caused by freeze-thaw cycles. Address these issues early before moisture seeps deeper.' },
      { icon: Leaf, title: 'Clean Exterior Surfaces', description: 'Power wash siding, trim, and decks to remove dirt, mildew, and salt residue. Clean surfaces ensure new paint adheres properly.' },
      { icon: Paintbrush, title: 'Plan Your Summer Projects', description: 'Spring is the ideal time to schedule exterior painting. Book early to secure the best dates and avoid the summer rush.' },
      { icon: Thermometer, title: 'Check Interior Humidity', description: 'As temperatures rise, condensation can cause paint to bubble. Ensure proper ventilation in bathrooms and kitchens.' },
    ],
  },
  {
    id: 'summer',
    name: 'Summer',
    icon: CloudRain,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    tips: [
      { icon: Thermometer, title: 'Avoid Painting in Extreme Heat', description: 'Paint above 35°C dries too fast, leading to lap marks and poor adhesion. Paint early morning or late afternoon for best results.' },
      { icon: ShieldCheck, title: 'Protect Against UV Damage', description: 'South-facing walls receive the most sun exposure. Consider UV-resistant paints for these surfaces to prevent fading and chalking.' },
      { icon: Sparkles, title: 'Touch Up Trim and Moldings', description: 'Summer is perfect for quick trim touch-ups. Scuff sand, clean, and apply a fresh coat to keep your home looking sharp.' },
      { icon: Droplets, title: 'Monitor Humidity Levels', description: 'High summer humidity can extend drying times and cause mildew. Use a dehumidifier indoors and watch the forecast for exterior work.' },
    ],
  },
  {
    id: 'fall',
    name: 'Fall',
    icon: Wind,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    tips: [
      { icon: Paintbrush, title: 'Seal and Protect Exteriors', description: 'Apply a protective clear coat or sealer to exterior surfaces before winter. This barrier prevents moisture penetration and frost damage.' },
      { icon: Leaf, title: 'Clean Gutters and Downspouts', description: 'Clogged gutters cause water to overflow onto painted surfaces. Clean them to prevent water staining and wood rot near paint lines.' },
      { icon: CheckCircle2, title: 'Interior Painting Season', description: 'Fall offers ideal indoor painting conditions — moderate temperatures and lower humidity. It\'s the best time for interior refresh projects.' },
      { icon: ShieldCheck, title: 'Check Caulking and Weatherstripping', description: 'Inspect caulk lines around windows and doors. Re-caulk any gaps to prevent drafts and moisture from compromising your paint.' },
    ],
  },
  {
    id: 'winter',
    name: 'Winter',
    icon: Snowflake,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    tips: [
      { icon: Thermometer, title: 'Maintain Indoor Temperature', description: 'Keep indoor temperatures above 10°C for optimal paint drying. Use space heaters in poorly heated rooms before and during painting.' },
      { icon: Droplets, title: 'Control Indoor Moisture', description: 'Winter heating dries the air but condensation on cold windows increases humidity. Ventilate properly to prevent paint issues.' },
      { icon: Sparkles, title: 'Plan Next Year\'s Projects', description: 'Winter is the perfect time to research colors, get quotes, and plan your spring/summer painting projects. Book early for better rates.' },
      { icon: CheckCircle2, title: 'Inspect for Ice Dams', description: 'Ice dams can push water behind siding, damaging paint. Ensure proper attic insulation and ventilation to prevent costly repaints.' },
    ],
  },
];

const savingsData = [
  { task: 'Regular Cleaning', saving: '$300 - $500', prevention: 'Prevents premature repaints' },
  { task: 'Touch-Up Painting', saving: '$1,200 - $2,000', prevention: 'Avoids full room repaints' },
  { task: 'Caulk Maintenance', saving: '$800 - $1,500', prevention: 'Prevents water damage' },
  { task: 'Humidity Control', saving: '$400 - $700', prevention: 'Stops mold and peeling' },
];

export function MaintenanceTips() {
  const [activeSeason, setActiveSeason] = useState('spring');

  const currentSeason = seasons.find((s) => s.id === activeSeason) ?? seasons[0];

  return (
    <section id="maintenance-tips" className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge className="bg-navy/10 text-navy border-navy/20 mb-4 px-4 py-1.5 text-sm font-medium">
            Expert Maintenance Guide
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 text-balance">
            Keep Your Paint <span className="text-gradient-gold">Looking Fresh</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Season-by-season tips to protect your investment and extend the life of your paint for years to come.
          </p>
        </motion.div>

        {/* Season Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100">
            {seasons.map((season) => {
              const isActive = activeSeason === season.id;
              return (
                <button
                  key={season.id}
                  onClick={() => setActiveSeason(season.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-navy text-white shadow-md'
                      : 'text-gray-500 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isActive ? 'active' : 'inactive'}
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0.8, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <season.icon className="w-4 h-4" />
                    </motion.span>
                  </AnimatePresence>
                  <span className="hidden sm:inline">{season.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Season Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="mb-16"
          >
            {/* Season Banner */}
            <div className={`rounded-2xl ${currentSeason.bgColor} ${currentSeason.borderColor} border-2 p-6 md:p-8 mb-8`}>
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-12 h-12 rounded-xl ${currentSeason.bgColor} flex items-center justify-center`}>
                  <motion.div
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <currentSeason.icon className={`w-6 h-6 ${currentSeason.color}`} />
                  </motion.div>
                </div>
                <div>
                  <h3 className={`text-xl md:text-2xl font-bold ${currentSeason.color}`}>
                    {currentSeason.name} Maintenance Checklist
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {currentSeason.tips.length} essential tips to protect your paint this {currentSeason.name.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentSeason.tips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-lg ${currentSeason.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <tip.icon className={`w-5 h-5 ${currentSeason.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-navy mb-1.5">{tip.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${currentSeason.bgColor}`}>
                          <span className={`text-xs font-bold ${currentSeason.color}`}>{index + 1}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Cost Savings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <Card className="border-0 shadow-xl overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-navy to-navy-light p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <PiggyBank className="w-7 h-7 text-gold" />
                <h3 className="text-xl md:text-2xl font-bold text-white">Estimated Annual Savings</h3>
              </div>
              <p className="text-white/70 text-sm">How much you can save with proactive paint maintenance</p>
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {savingsData.map((item) => (
                  <div key={item.task} className="flex items-start gap-3 bg-cream rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-base font-bold text-navy">{item.saving}</div>
                      <div className="text-sm font-medium text-navy/70">{item.task}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.prevention}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-gold/10 to-sage/10 rounded-xl border border-gold/20">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-navy">$2,700 - $4,700</div>
                  <div className="text-sm text-gray-600">Potential savings per year with regular maintenance</div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-sm font-semibold text-sage">7-10 Year Lifespan</div>
                  <div className="text-xs text-gray-500">Well-maintained paint vs 3-5 years without care</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="border-0 shadow-lg bg-white max-w-lg mx-auto">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Download Our Maintenance Checklist</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Get a printable PDF with all 16 seasonal tips, a maintenance calendar, and cost-saving recommendations.
              </p>
              <Button className="w-full bg-gold hover:bg-gold-light text-white py-5 rounded-full font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Download Free Checklist
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
