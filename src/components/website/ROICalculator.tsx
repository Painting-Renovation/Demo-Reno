'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Home,
  BedDouble,
  ChefHat,
  Bath,
  Briefcase,
  Building2,
  TrendingUp,
  ArrowRight,
  Info,
  Check,
  X,
  Sparkles,
  DollarSign,
  Shield,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

type RoomType = 'living-room' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'whole-house';
type Condition = 'poor' | 'fair' | 'good' | 'excellent';

interface RoomOption {
  id: RoomType;
  label: string;
  icon: React.ElementType;
  avgSqFt: number;
  description: string;
}

const roomOptions: RoomOption[] = [
  { id: 'living-room', label: 'Living Room', icon: Home, avgSqFt: 250, description: 'High-traffic space' },
  { id: 'bedroom', label: 'Bedroom', icon: BedDouble, avgSqFt: 180, description: 'Personal retreat' },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat, avgSqFt: 200, description: 'Heart of the home' },
  { id: 'bathroom', label: 'Bathroom', icon: Bath, avgSqFt: 100, description: 'Moisture-prone area' },
  { id: 'office', label: 'Office', icon: Briefcase, avgSqFt: 150, description: 'Professional space' },
  { id: 'whole-house', label: 'Whole House', icon: Building2, avgSqFt: 2000, description: 'Complete refresh' },
];

const conditionOptions: { value: Condition; label: string; multiplier: number; emoji: string }[] = [
  { value: 'poor', label: 'Poor', multiplier: 1.8, emoji: '🔴' },
  { value: 'fair', label: 'Fair', multiplier: 1.3, emoji: '🟡' },
  { value: 'good', label: 'Good', multiplier: 1.0, emoji: '🟢' },
  { value: 'excellent', label: 'Excellent', multiplier: 0.7, emoji: '🔵' },
];

// Value increase per sq ft by room type (in dollars)
const valuePerSqFt: Record<RoomType, number> = {
  'living-room': 4.5,
  'bedroom': 3.8,
  'kitchen': 6.2,
  'bathroom': 7.5,
  'office': 3.5,
  'whole-house': 4.0,
};

// Professional cost per sq ft
const proCostPerSqFt: Record<RoomType, number> = {
  'living-room': 3.5,
  'bedroom': 3.2,
  'kitchen': 4.8,
  'bathroom': 5.5,
  'office': 3.0,
  'whole-house': 3.8,
};

// DIY cost per sq ft (lower quality, longer time)
const diyCostPerSqFt: Record<RoomType, number> = {
  'living-room': 1.8,
  'bedroom': 1.6,
  'kitchen': 2.5,
  'bathroom': 2.8,
  'office': 1.5,
  'whole-house': 1.9,
};

export function ROICalculator() {
  const { setEstimateFormOpen } = useAppStore();
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('living-room');
  const [sqFt, setSqFt] = useState(250);
  const [condition, setCondition] = useState<Condition>('fair');

  const room = roomOptions.find((r) => r.id === selectedRoom)!;
  const conditionData = conditionOptions.find((c) => c.value === condition)!;

  const calculations = useMemo(() => {
    const valueIncrease = sqFt * valuePerSqFt[selectedRoom] * conditionData.multiplier;
    const proCost = sqFt * proCostPerSqFt[selectedRoom];
    const diyCost = sqFt * diyCostPerSqFt[selectedRoom];
    const roi = proCost > 0 ? ((valueIncrease - proCost) / proCost) * 100 : 0;
    const savingsVsRealEstate = valueIncrease * 0.06; // 6% realtor commission on value increase

    return {
      valueIncrease: Math.round(valueIncrease),
      proCost: Math.round(proCost),
      diyCost: Math.round(diyCost),
      roi: Math.max(0, Math.round(roi)),
      savingsVsRealEstate: Math.round(savingsVsRealEstate),
      timeSaved: selectedRoom === 'whole-house' ? '80+' : selectedRoom === 'kitchen' || selectedRoom === 'bathroom' ? '6-8' : '4-6',
      proQualityScore: 95,
      diyQualityScore: 62,
    };
  }, [selectedRoom, sqFt, condition]);

  const handleRoomSelect = (roomId: RoomType) => {
    setSelectedRoom(roomId);
    const roomOpt = roomOptions.find((r) => r.id === roomId)!;
    setSqFt(roomOpt.avgSqFt);
  };

  // Visual room preview scale
  const previewScale = Math.min(1, Math.max(0.3, sqFt / (room.avgSqFt * 2)));

  return (
    <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/5 rounded-full blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sage/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-5 shadow-sm border border-gold/10">
            <Calculator className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-navy/70">Interactive Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4">
            See How Much You Can{' '}
            <span className="text-gradient-gold">Save</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Professional painting isn&apos;t just an expense — it&apos;s an investment. Calculate your potential return on investment.
          </p>
        </motion.div>

        {/* Calculator Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        >
          {/* Left: Input Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Room Type Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10">
              <h3 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                <Home className="w-5 h-5 text-gold" />
                Room Type
              </h3>
              <p className="text-sm text-gray-500 mb-4">Select the space you want to paint</p>
              <div className="grid grid-cols-2 gap-2.5">
                {roomOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = selectedRoom === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleRoomSelect(opt.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? 'border-gold bg-gradient-to-br from-gold/10 to-gold/5 shadow-lg shadow-gold/10'
                          : 'border-gray-100 hover:border-gold/30 hover:shadow-sm'
                      }`}
                    >
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gold shadow-sm shadow-gold/30"
                        />
                      )}
                      <Icon className={`w-5 h-5 mb-1.5 transition-colors duration-300 ${isActive ? 'text-gold' : 'text-gray-400'}`} />
                      <span className={`block text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-gold' : 'text-navy'}`}>{opt.label}</span>
                      <span className="block text-[10px] text-gray-400">{opt.description}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Room Size */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gold" />
                  Room Size
                </h3>
                <Badge variant="outline" className="border-gold/30 text-gold font-bold tabular-nums">
                  {sqFt.toLocaleString()} sq ft
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Average for {room.label}: ~{room.avgSqFt.toLocaleString()} sq ft
              </p>

              {/* Visual Room Preview */}
              <div className="relative w-full h-20 bg-navy/5 rounded-xl mb-4 overflow-hidden border border-navy/10">
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gold/20 to-gold/10 border-2 border-gold/30 rounded-lg flex items-center justify-center"
                  animate={{
                    width: `${Math.max(20, previewScale * 85)}%`,
                    height: `${Math.max(20, previewScale * 80)}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <room.icon className="w-6 h-6 text-gold/60" />
                </motion.div>
                <div className="absolute bottom-1.5 right-2 text-[10px] text-navy/40 font-mono tabular-nums">
                  {sqFt} ft²
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={selectedRoom === 'whole-house' ? 500 : 50}
                max={selectedRoom === 'whole-house' ? 5000 : 600}
                step={selectedRoom === 'whole-house' ? 100 : 10}
                value={sqFt}
                onChange={(e) => setSqFt(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 tabular-nums">
                <span>{selectedRoom === 'whole-house' ? '500' : '50'} sq ft</span>
                <span>{selectedRoom === 'whole-house' ? '5,000' : '600'} sq ft</span>
              </div>
            </div>

            {/* Current Condition */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10">
              <h3 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                Current Condition
              </h3>
              <p className="text-sm text-gray-500 mb-4">How would you rate the current paint?</p>
              <div className="space-y-2">
                {conditionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCondition(opt.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      condition === opt.value
                        ? 'border-gold bg-gold/5 shadow-md'
                        : 'border-gray-100 hover:border-gold/30'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <span className="flex-1 text-sm font-semibold text-navy">{opt.label}</span>
                    <span className="text-xs text-gray-400 tabular-nums">
                      {opt.multiplier > 1 ? `${Math.round((opt.multiplier - 1) * 100)}% more value` : opt.multiplier < 1 ? `${Math.round((1 - opt.multiplier) * 100)}% less value` : 'Baseline'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results Panel */}
          <div className="lg:col-span-3 space-y-5">
            {/* Value Increase Card */}
            <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-gold uppercase tracking-wider">Estimated Value Increase</span>
                </div>
                <motion.div
                  key={calculations.valueIncrease}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                >
                  <p className="text-5xl md:text-6xl font-bold mb-2 tabular-nums">
                    ${calculations.valueIncrease.toLocaleString()}
                  </p>
                  <p className="text-white/60 text-sm">
                    Estimated increase in property value with professional painting
                  </p>
                </motion.div>

                {/* ROI Progress Bar with animated gradient */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">Return on Investment</span>
                    <motion.span
                      key={calculations.roi}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-gold tabular-nums"
                    >
                      {calculations.roi}%
                    </motion.span>
                  </div>
                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, calculations.roi)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      style={{
                        background: 'linear-gradient(90deg, #C8973E, #E8B94E, #C8973E)',
                        backgroundSize: '200% 100%',
                      }}
                    >
                      {/* Animated shimmer on the progress bar */}
                      <div
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s ease-in-out infinite',
                        }}
                      />
                    </motion.div>
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    {calculations.roi > 50
                      ? '🚀 Excellent investment — painting pays for itself many times over'
                      : calculations.roi > 25
                      ? '👍 Solid investment — significant value boost for the cost'
                      : '💰 Good value — professional quality enhances your home'}
                  </p>
                </div>
              </div>
            </div>

            {/* DIY vs Professional Comparison with side-by-side cards and divider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 relative">
              {/* Vertical divider */}
              <div className="hidden md:block absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

              {/* DIY Option */}
              <div className="bg-white rounded-2xl md:rounded-r-none p-5 shadow-lg border border-gray-200 relative md:border-r-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <h4 className="font-bold text-navy">DIY Approach</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Estimated Cost</p>
                    <p className="text-2xl font-bold text-navy tabular-nums">${calculations.diyCost.toLocaleString()}</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500">What you get:</p>
                    {[
                      'Weekend warrior timeline (3-5x longer)',
                      'Consumer-grade materials',
                      'Limited surface preparation',
                      'No warranty or guarantee',
                      'Quality score: 62/100',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs text-gray-500">
                        <X className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Professional Option */}
              <div className="bg-white rounded-2xl md:rounded-l-none p-5 shadow-xl border-2 border-gold/30 relative md:border-l-0">
                <div className="absolute -top-2.5 left-5">
                  <Badge className="bg-gold text-white text-[10px] font-bold px-2.5 py-0.5 shadow-md">
                    RECOMMENDED
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-4 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <h4 className="font-bold text-navy">Professional</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Estimated Cost</p>
                    <p className="text-2xl font-bold text-gold tabular-nums">${calculations.proCost.toLocaleString()}</p>
                  </div>
                  <div className="h-px bg-gold/10" />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500">What you get:</p>
                    {[
                      `Professional results in ${calculations.timeSaved} hours`,
                      'Premium Benjamin Moore / Farrow & Ball paints',
                      'Complete surface prep & cleanup',
                      '5-10 year warranty included',
                      'Quality score: 95/100',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-sage/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-sage" />
                </div>
                <p className="text-lg font-bold text-navy tabular-nums">{calculations.roi}%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">ROI</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <p className="text-lg font-bold text-navy tabular-nums">{calculations.proQualityScore}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pro Quality</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-navy/10 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-navy" />
                </div>
                <p className="text-lg font-bold text-navy tabular-nums">${calculations.savingsVsRealEstate.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Commission Saved</p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-gold/10 to-sage/10 rounded-2xl p-6 border border-gold/20 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Info className="w-4 h-4 text-gold" />
                <span className="text-xs text-gray-500">These are estimates based on Toronto GTA market data</span>
              </div>
              <p className="text-navy font-semibold mb-4">
                Ready to see your actual savings? Get a personalized quote — it&apos;s free.
              </p>
              <Button
                onClick={() => setEstimateFormOpen(true)}
                size="lg"
                className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-6 text-base rounded-xl transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Get Your Free Estimate
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
