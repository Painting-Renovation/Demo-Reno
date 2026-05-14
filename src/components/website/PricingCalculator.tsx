'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Check, ChevronRight, ChevronLeft, Sparkles, Info, Loader2, MapPin, Ruler, AlertTriangle, FileText, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

type ServiceType = 'interior' | 'exterior' | 'cabinet' | 'commercial' | 'deck' | 'consultation';

interface AreaOption {
  id: string;
  label: string;
  sublabel: string;
  low: number;
  high: number;
}

interface QualityTier {
  id: string;
  label: string;
  brand: string;
  multiplier: number;
  features: string[];
}

interface AddOn {
  id: string;
  label: string;
  low: number;
  high: number;
  isPercentage: boolean;
}

const serviceOptions: { id: ServiceType; label: string; icon: string; description: string }[] = [
  { id: 'interior', label: 'Interior Painting', icon: '🏠', description: 'Rooms & living spaces' },
  { id: 'exterior', label: 'Exterior Painting', icon: '🏗️', description: 'Siding, trim & more' },
  { id: 'cabinet', label: 'Cabinet Refinishing', icon: '🗄️', description: 'Kitchen & bathroom' },
  { id: 'commercial', label: 'Commercial', icon: '🏢', description: 'Offices & retail' },
  { id: 'deck', label: 'Deck & Fence', icon: '🪵', description: 'Staining & sealing' },
  { id: 'consultation', label: 'Color Consultation', icon: '🎨', description: 'Expert color advice' },
];

const areaMap: Record<ServiceType, AreaOption[]> = {
  interior: [
    { id: 'bedroom', label: 'Bedroom', sublabel: 'Avg. 12x14 ft', low: 300, high: 800 },
    { id: 'living-room', label: 'Living Room', sublabel: 'Avg. 15x18 ft', low: 400, high: 1200 },
    { id: 'kitchen', label: 'Kitchen', sublabel: 'Avg. 12x12 ft', low: 500, high: 1500 },
    { id: 'bathroom', label: 'Bathroom', sublabel: 'Avg. 8x10 ft', low: 300, high: 800 },
    { id: 'full-home', label: 'Full Home', sublabel: '3-4 bedrooms', low: 2000, high: 8000 },
    { id: 'basement', label: 'Basement', sublabel: 'Finished basement', low: 600, high: 2000 },
  ],
  exterior: [
    { id: 'single-story', label: 'Single Story', sublabel: '~1,200 sq ft', low: 1500, high: 4000 },
    { id: 'two-story', label: 'Two Story', sublabel: '~2,000 sq ft', low: 2500, high: 6000 },
    { id: 'garage', label: 'Garage', sublabel: 'Detached', low: 500, high: 1500 },
    { id: 'fence', label: 'Fence', sublabel: 'Per 100 ft', low: 300, high: 1000 },
    { id: 'full-exterior', label: 'Full Exterior', sublabel: 'Complete repaint', low: 3000, high: 10000 },
  ],
  cabinet: [
    { id: 'kitchen-cabinets', label: 'Kitchen Cabinets', sublabel: '10+ cabinets', low: 1200, high: 3500 },
    { id: 'bathroom-vanity', label: 'Bathroom Vanity', sublabel: 'Single/double', low: 400, high: 1000 },
    { id: 'built-ins', label: 'Built-ins', sublabel: 'Bookshelves & units', low: 600, high: 2000 },
  ],
  commercial: [
    { id: 'office', label: 'Office Space', sublabel: 'Per 1,000 sq ft', low: 800, high: 2000 },
    { id: 'retail', label: 'Retail Store', sublabel: 'Per 1,000 sq ft', low: 1000, high: 3000 },
    { id: 'restaurant', label: 'Restaurant', sublabel: 'Per 1,000 sq ft', low: 1500, high: 4000 },
  ],
  deck: [
    { id: 'small-deck', label: 'Small Deck', sublabel: '~100 sq ft', low: 300, high: 800 },
    { id: 'large-deck', label: 'Large Deck', sublabel: '~300 sq ft', low: 600, high: 1500 },
    { id: 'fence-deck', label: 'Fence', sublabel: 'Per 100 ft', low: 200, high: 500 },
  ],
  consultation: [],
};

const qualityTiers: QualityTier[] = [
  {
    id: 'standard',
    label: 'Standard',
    brand: 'Benjamin Moore Regal',
    multiplier: 1.0,
    features: ['Excellent coverage', '5-year warranty', 'Wide color selection', 'Low VOC'],
  },
  {
    id: 'premium',
    label: 'Premium',
    brand: 'Benjamin Moore Aura',
    multiplier: 1.3,
    features: ['Superior durability', '7-year warranty', 'Color-lock technology', 'Zero VOC'],
  },
  {
    id: 'ultra',
    label: 'Ultra Premium',
    brand: 'Farrow & Ball',
    multiplier: 1.6,
    features: ['Luxury formulation', '10-year warranty', 'Heritage colors', 'Eco-friendly'],
  },
];

const addOns: AddOn[] = [
  { id: 'accent-wall', label: 'Accent Wall', low: 150, high: 400, isPercentage: false },
  { id: 'trim', label: 'Trim & Baseboards', low: 200, high: 500, isPercentage: false },
  { id: 'ceiling', label: 'Ceiling Painting', low: 100, high: 300, isPercentage: false },
  { id: 'drywall', label: 'Drywall Repair', low: 75, high: 200, isPercentage: false },
  { id: 'wallpaper', label: 'Wallpaper Removal', low: 150, high: 400, isPercentage: false },
  { id: 'eco', label: 'Eco-Friendly Upgrade', low: 10, high: 10, isPercentage: true },
];

const steps = ['Service', 'Area', 'Quality', 'Add-ons', 'Details', 'Estimate'];

export function PricingCalculator() {
  const { setEstimateFormOpen } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('standard');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState({
    address: '',
    roomWidth: '',
    roomLength: '',
    ceilingHeight: '',
    numRooms: '',
    totalSqft: '',
    condition: '',
    specialNotes: '',
  });
  const [aiEstimate, setAiEstimate] = useState<any>(null);
  const [isGeneratingEstimate, setIsGeneratingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    'Analyzing your project...',
    'Calculating based on Ontario market rates...',
    'Applying quality adjustments...',
    'Generating detailed breakdown...',
  ];

  useEffect(() => {
    if (isGeneratingEstimate) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGeneratingEstimate, loadingMessages.length]);

  const areas = selectedService ? areaMap[selectedService] : [];
  const isConsultation = selectedService === 'consultation';
  const quality = qualityTiers.find((t) => t.id === selectedQuality)!;
  const area = selectedArea ? areas.find((a) => a.id === selectedArea) : null;
  const isFullHome = selectedArea === 'full-home';

  const pricing = useMemo(() => {
    if (!selectedService) return null;
    if (isConsultation) return { low: 0, high: 0, recommended: 0, label: 'Free Consultation' };

    const areaItem = areas.find((a) => a.id === selectedArea);
    if (!areaItem) return null;

    let baseLow = areaItem.low * quality.multiplier;
    let baseHigh = areaItem.high * quality.multiplier;

    let addOnLow = 0;
    let addOnHigh = 0;
    let addOnPercent = 0;

    selectedAddOns.forEach((addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId);
      if (addOn) {
        if (addOn.isPercentage) {
          addOnPercent += addOn.low;
        } else {
          addOnLow += addOn.low;
          addOnHigh += addOn.high;
        }
      }
    });

    const totalLow = (baseLow + addOnLow) * (1 + addOnPercent / 100);
    const totalHigh = (baseHigh + addOnHigh) * (1 + addOnPercent / 100);
    const recommended = totalLow + (totalHigh - totalLow) * 0.4;

    return {
      low: Math.round(totalLow),
      high: Math.round(totalHigh),
      recommended: Math.round(recommended),
      label: `Starting from $${Math.round(totalLow).toLocaleString()}`,
    };
  }, [selectedService, selectedArea, selectedQuality, selectedAddOns, areas, quality, isConsultation]);

  const generateAiEstimate = useCallback(async () => {
    setIsGeneratingEstimate(true);
    setEstimateError(false);
    setLoadingMessageIndex(0);
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: selectedService,
          serviceLabel: serviceOptions.find(s => s.id === selectedService)?.label,
          areaId: selectedArea,
          areaLabel: areaMap[selectedService!]?.find(a => a.id === selectedArea)?.label,
          areaBaseLow: area?.low || 0,
          areaBaseHigh: area?.high || 0,
          qualityTier: selectedQuality,
          qualityLabel: quality.label,
          qualityBrand: quality.brand,
          qualityMultiplier: quality.multiplier,
          selectedAddons: selectedAddOns.map(id => addOns.find(a => a.id === id)).filter(Boolean),
          projectDetails: {
            address: projectDetails.address || null,
            roomWidth: projectDetails.roomWidth ? parseFloat(projectDetails.roomWidth) : null,
            roomLength: projectDetails.roomLength ? parseFloat(projectDetails.roomLength) : null,
            ceilingHeight: projectDetails.ceilingHeight || null,
            numRooms: projectDetails.numRooms ? parseInt(projectDetails.numRooms) : null,
            totalSqft: projectDetails.totalSqft ? parseFloat(projectDetails.totalSqft) : null,
            condition: projectDetails.condition || null,
            specialNotes: projectDetails.specialNotes || null,
          },
          clientSideEstimate: pricing ? { low: pricing.low, high: pricing.high, recommended: pricing.recommended } : null,
        }),
      });
      const data = await response.json();
      if (data.success && data.estimate) {
        setAiEstimate(data.estimate);
      } else {
        setEstimateError(true);
      }
    } catch (err) {
      setEstimateError(true);
    } finally {
      setIsGeneratingEstimate(false);
    }
  }, [selectedService, selectedArea, area, selectedQuality, quality, selectedAddOns, projectDetails, pricing]);

  const retryAiEstimate = useCallback(() => {
    setAiEstimate(null);
    generateAiEstimate();
  }, [generateAiEstimate]);

  useEffect(() => {
    if (currentStep === 5 && !aiEstimate && !isGeneratingEstimate && !isConsultation) {
      generateAiEstimate();
    }
  }, [currentStep, aiEstimate, isGeneratingEstimate, isConsultation, generateAiEstimate]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const updateProjectDetail = (key: string, value: string) => {
    setProjectDetails((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedService !== null;
      case 1: return isConsultation || selectedArea !== null;
      case 2: return true;
      case 3: return true;
      case 4: return true; // Project details is optional
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  return (
    <section id="pricing-calculator" className="py-20 bg-cream relative overflow-hidden">
      <div className="absolute top-10 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-navy/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Calculator className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-navy/70">Instant Estimate</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Pricing Calculator
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get an instant estimate for your painting project. Select your options below and see pricing in real time.
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-xl border border-gold/10 overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="bg-navy px-6 py-4">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      i < currentStep
                        ? 'bg-gold text-white'
                        : i === currentStep
                        ? 'bg-gold text-white ring-4 ring-gold/30'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`hidden sm:block ml-2 text-xs font-medium transition-colors ${
                      i <= currentStep ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-6 lg:w-14 h-0.5 mx-1.5 transition-colors ${
                        i < currentStep ? 'bg-gold' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6 md:p-8 min-h-[380px]">
            <AnimatePresence mode="wait">
              {/* Step 0: Service Type */}
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-navy mb-1">What type of painting service do you need?</h3>
                  <p className="text-sm text-gray-500 mb-6">Select the service that best describes your project</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceOptions.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                          selectedService === service.id
                            ? 'border-gold bg-gold/5 shadow-md'
                            : 'border-gray-100 hover:border-gold/30'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{service.icon}</span>
                        <span className="block text-sm font-semibold text-navy">{service.label}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">{service.description}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Area */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-navy mb-1">
                    {isConsultation ? 'Your Color Consultation' : 'Select the area to paint'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {isConsultation
                      ? 'Great choice! Our color consultation is completely free with any painting project.'
                      : 'Choose the space that matches your project'}
                  </p>

                  {isConsultation ? (
                    <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl p-8 text-center border border-gold/20">
                      <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-navy mb-2">Free Color Consultation</h4>
                      <p className="text-gray-600 text-sm max-w-md mx-auto">
                        Our expert color consultant will visit your home with physical sample boards,
                        analyze your lighting, and help you choose the perfect palette. This service
                        is complimentary when you book any painting project with us.
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="text-3xl font-bold text-gold">FREE</span>
                        <span className="text-sm text-gray-500">with any project</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {areas.map((areaItem) => (
                        <button
                          key={areaItem.id}
                          onClick={() => setSelectedArea(areaItem.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                            selectedArea === areaItem.id
                              ? 'border-gold bg-gold/5 shadow-md'
                              : 'border-gray-100 hover:border-gold/30'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="block text-sm font-semibold text-navy">{areaItem.label}</span>
                              <span className="block text-xs text-gray-500 mt-0.5">{areaItem.sublabel}</span>
                            </div>
                            <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-full whitespace-nowrap">
                              {formatPrice(areaItem.low)} - {formatPrice(areaItem.high)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Quality Tier */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-navy mb-1">Choose your paint quality</h3>
                  <p className="text-sm text-gray-500 mb-6">Higher quality paint lasts longer and looks better for years</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {qualityTiers.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedQuality(tier.id)}
                        className={`p-5 rounded-xl border-2 text-left transition-all duration-200 relative ${
                          selectedQuality === tier.id
                            ? 'border-gold bg-gold/5 shadow-lg'
                            : 'border-gray-100 hover:border-gold/30'
                        }`}
                      >
                        {selectedQuality === tier.id && (
                          <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <span className="block text-xs font-bold uppercase tracking-wider text-gold mb-1">
                          {tier.label}
                        </span>
                        <span className="block text-sm font-semibold text-navy">{tier.brand}</span>
                        <span className="block text-lg font-bold text-navy mt-1">
                          {tier.multiplier === 1 ? 'Base Price' : `${Math.round((tier.multiplier - 1) * 100)}% more`}
                        </span>
                        <ul className="mt-3 space-y-1.5">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Check className="w-3 h-3 text-sage flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Add-ons */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-navy mb-1">Additional services (optional)</h3>
                  <p className="text-sm text-gray-500 mb-6">Select any extra services you may need</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addOns.map((addOn) => (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          selectedAddOns.includes(addOn.id)
                            ? 'border-gold bg-gold/5'
                            : 'border-gray-100 hover:border-gold/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                                selectedAddOns.includes(addOn.id)
                                  ? 'bg-gold border-gold'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedAddOns.includes(addOn.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-semibold text-navy">{addOn.label}</span>
                          </div>
                          <span className="text-xs font-medium text-gold">
                            {addOn.isPercentage
                              ? `+${addOn.low}%`
                              : `+${formatPrice(addOn.low)}-${formatPrice(addOn.high)}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Project Details */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="text-lg font-bold text-navy">Project Details <span className="text-sm font-normal text-gray-400">(Optional)</span></h3>
                      <p className="text-sm text-gray-500">Provide more details for a more accurate estimate</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 italic mb-5">Skip if unsure — we&apos;ll use standard averages</p>

                  <div className="space-y-5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    {/* Property Address */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Property Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 123 Main St, Toronto, ON"
                        value={projectDetails.address}
                        onChange={(e) => updateProjectDetail('address', e.target.value)}
                        className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors"
                      />
                    </div>

                    {/* Room Dimensions */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-1.5">
                        <Ruler className="w-3.5 h-3.5" />
                        Room Dimensions
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          placeholder="Width (ft)"
                          value={projectDetails.roomWidth}
                          onChange={(e) => updateProjectDetail('roomWidth', e.target.value)}
                          className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors"
                          min="0"
                        />
                        <span className="text-gray-400 font-medium text-sm flex-shrink-0">×</span>
                        <input
                          type="number"
                          placeholder="Length (ft)"
                          value={projectDetails.roomLength}
                          onChange={(e) => updateProjectDetail('roomLength', e.target.value)}
                          className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Ceiling Height */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                        Ceiling Height
                      </label>
                      <select
                        value={projectDetails.ceilingHeight}
                        onChange={(e) => updateProjectDetail('ceilingHeight', e.target.value)}
                        className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors bg-white text-navy"
                      >
                        <option value="">Select ceiling height</option>
                        <option value="8 ft (Standard)">8 ft (Standard)</option>
                        <option value="9 ft">9 ft</option>
                        <option value="10 ft">10 ft</option>
                        <option value="11 ft or higher">11 ft or higher</option>
                        <option value="Vaulted/Cathedral">Vaulted / Cathedral</option>
                      </select>
                    </div>

                    {/* Full Home Only Fields */}
                    {isFullHome && (
                      <div className="border border-gold/20 bg-gold/5 rounded-lg p-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5 mb-3">
                          <Building className="w-3.5 h-3.5" />
                          Full Home Details
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium text-navy mb-1 block">Number of Rooms</label>
                            <input
                              type="number"
                              placeholder="e.g. 8"
                              value={projectDetails.numRooms}
                              onChange={(e) => updateProjectDetail('numRooms', e.target.value)}
                              className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-navy mb-1 block">Total Sq Ft</label>
                            <input
                              type="number"
                              placeholder="e.g. 2000"
                              value={projectDetails.totalSqft}
                              onChange={(e) => updateProjectDetail('totalSqft', e.target.value)}
                              className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Property Condition */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
                        Property Condition
                      </label>
                      <select
                        value={projectDetails.condition}
                        onChange={(e) => updateProjectDetail('condition', e.target.value)}
                        className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors bg-white text-navy"
                      >
                        <option value="">Select condition</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Needs Repair">Needs Repair</option>
                      </select>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Special Notes
                      </label>
                      <textarea
                        placeholder="Any additional details about your project..."
                        value={projectDetails.specialNotes}
                        onChange={(e) => updateProjectDetail('specialNotes', e.target.value)}
                        rows={3}
                        className="border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-lg px-3 py-2 text-sm w-full outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Estimate */}
              {currentStep === 5 && pricing && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isConsultation ? (
                    <div className="text-center py-6">
                      <Sparkles className="w-16 h-16 text-gold mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-navy mb-2">Free Color Consultation</h3>
                      <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Your consultation is free when you book any painting project with us. Let&apos;s get started!
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 justify-center mt-6">
                        <Info className="w-3.5 h-3.5" />
                        <span>Prices are estimates only. Final quote provided after on-site assessment.</span>
                      </div>
                      <Button
                        onClick={() => setEstimateFormOpen(true)}
                        size="lg"
                        className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-6 text-base rounded-xl transition-all shadow-lg hover:shadow-xl w-full sm:w-auto mt-6"
                      >
                        Get Your Exact Quote — It&apos;s Free
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Client-Side Instant Estimate */}
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-navy mb-4">Your Estimated Project Cost</h3>
                        <div className="inline-flex flex-col items-center mb-4">
                          <span className="text-sm text-gray-500 mb-1">Instant Price Range</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-bold text-navy">
                              {formatPrice(pricing.low)}
                            </span>
                            <span className="text-xl text-gray-400">—</span>
                            <span className="text-3xl md:text-4xl font-bold text-gold">
                              {formatPrice(pricing.high)}
                            </span>
                          </div>
                          <div className="mt-2 bg-gold/10 rounded-full px-4 py-1.5">
                            <span className="text-sm text-navy font-medium">
                              Recommended budget: <strong>{formatPrice(pricing.recommended)}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="max-w-sm mx-auto text-left bg-gray-50 rounded-xl p-4 mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service</span>
                            <span className="font-medium text-navy">{serviceOptions.find((s) => s.id === selectedService)?.label}</span>
                          </div>
                          {selectedArea && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Area</span>
                              <span className="font-medium text-navy">
                                {areaMap[selectedService!]?.find((a) => a.id === selectedArea)?.label}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Paint Quality</span>
                            <span className="font-medium text-navy">{quality.label} — {quality.brand}</span>
                          </div>
                          {selectedAddOns.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Add-ons</span>
                              <span className="font-medium text-navy">{selectedAddOns.length} selected</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">AI Estimate</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {/* AI Estimate Section */}
                      <div className="rounded-xl border border-gold/20 overflow-hidden bg-gradient-to-br from-white via-gold/5 to-white">
                        {/* Loading State */}
                        {isGeneratingEstimate && (
                          <div className="p-8 text-center">
                            <div className="relative w-16 h-16 mx-auto mb-4">
                              <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
                              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin" />
                              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-gold/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                              <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-gold" />
                            </div>
                            <p className="text-sm font-semibold text-navy transition-all duration-300">
                              {loadingMessages[loadingMessageIndex]}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">This usually takes a few seconds</p>
                          </div>
                        )}

                        {/* Error State */}
                        {estimateError && !isGeneratingEstimate && (
                          <div className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-navy">AI Estimate Unavailable</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  We couldn&apos;t generate the AI estimate right now. Here&apos;s your instant estimate based on standard pricing.
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={generateAiEstimate}
                              variant="outline"
                              size="sm"
                              className="border-gold/30 text-gold hover:bg-gold/5 text-xs"
                            >
                              <Loader2 className="w-3.5 h-3.5 mr-1.5" />
                              Try Again
                            </Button>
                          </div>
                        )}

                        {/* AI Estimate Result */}
                        {aiEstimate && !isGeneratingEstimate && (
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">📊</span>
                              <h4 className="text-sm font-bold text-navy">AI-Powered Detailed Estimate</h4>
                              {aiEstimate.isFallback ? (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium border border-orange-200">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Fallback Estimate
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-sage/10 text-sage text-xs font-medium">
                                  AI Enhanced
                                </Badge>
                              )}
                              {aiEstimate.isFallback && (
                                <Button
                                  onClick={retryAiEstimate}
                                  variant="outline"
                                  size="sm"
                                  className="border-gold/30 text-gold hover:bg-gold/5 text-xs ml-auto"
                                >
                                  <Loader2 className="w-3 h-3 mr-1" />
                                  Retry AI Estimate
                                </Button>
                              )}
                            </div>

                            {/* Project Summary */}
                            {aiEstimate.project_summary && (
                              <div className="bg-gradient-to-r from-navy/5 to-gold/5 rounded-lg p-3.5 mb-4 border border-navy/10">
                                <p className="text-sm text-navy/80 leading-relaxed">
                                  <Sparkles className="w-3.5 h-3.5 text-gold inline mr-1 -mt-0.5" />
                                  {aiEstimate.project_summary}
                                </p>
                              </div>
                            )}

                            {/* Realistic / True Estimate */}
                            <div className="bg-gradient-to-r from-emerald-50 to-gold/5 rounded-lg p-4 mb-3 border border-emerald-100">
                              <p className="text-xs font-medium text-emerald-700 mb-1">True / Realistic Estimate</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-emerald-700">
                                  {formatPrice(aiEstimate.true_estimate?.low ?? pricing.low)}
                                </span>
                                <span className="text-gray-400">—</span>
                                <span className="text-2xl font-bold text-gold">
                                  {formatPrice(aiEstimate.true_estimate?.high ?? pricing.high)}
                                </span>
                              </div>
                            </div>

                            {/* Worst Case */}
                            {aiEstimate.worst_case_estimate && (
                              <div className="bg-orange-50 rounded-lg p-3 mb-3 border border-orange-100">
                                <p className="text-xs font-medium text-orange-600 mb-0.5">Worst-Case Estimate (with contingencies)</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-bold text-orange-600">
                                    {formatPrice(aiEstimate.worst_case_estimate.low)}
                                  </span>
                                  <span className="text-gray-400">—</span>
                                  <span className="text-base font-bold text-orange-700">
                                    {formatPrice(aiEstimate.worst_case_estimate.high)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Recommended Budget */}
                            <div className="bg-navy rounded-lg p-4 mb-4">
                              <p className="text-xs font-medium text-white/70 mb-0.5">Recommended Budget</p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gold">
                                  {formatPrice(aiEstimate.recommended_budget?.amount ?? pricing.recommended)}
                                </span>
                              </div>
                            </div>

                            {/* Line Item Breakdown */}
                            {aiEstimate.line_items && aiEstimate.line_items.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Detailed Breakdown</h5>
                                <div className="space-y-0 divide-y divide-gray-100">
                                  {aiEstimate.line_items.map((item: any, index: number) => (
                                    <div key={index} className="py-2.5 first:pt-0 last:pb-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-navy">{item.item || item.description}</p>
                                          {item.notes && (
                                            <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>
                                          )}
                                        </div>
                                        <span className="text-sm font-semibold text-navy whitespace-nowrap">
                                          {formatPrice(item.low)} – {formatPrice(item.high)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Key Assumptions */}
                            {aiEstimate.assumptions && Array.isArray(aiEstimate.assumptions) && aiEstimate.assumptions.length > 0 && (
                              <details className="group mb-4">
                                <summary className="text-xs font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-navy transition-colors flex items-center gap-1">
                                  <span>Key Assumptions</span>
                                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                                </summary>
                                <ul className="mt-2 space-y-1.5 pl-1">
                                  {aiEstimate.assumptions.map((assumption: string, index: number) => (
                                    <li key={index} className="text-xs text-gray-500 flex items-start gap-1.5">
                                      <span className="text-gold mt-0.5">•</span>
                                      {assumption}
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            )}

                            {/* Data Source Transparency */}
                            {aiEstimate.data_source && (
                              <details className="group mb-4">
                                <summary className="text-xs font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-navy transition-colors flex items-center gap-1">
                                  <span>Estimate Transparency</span>
                                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                                </summary>
                                <div className="mt-2 space-y-3 pl-1">
                                  {aiEstimate.data_source.user_provided && Array.isArray(aiEstimate.data_source.user_provided) && aiEstimate.data_source.user_provided.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-sage mb-1.5 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                                        You Provided
                                      </p>
                                      <ul className="space-y-1">
                                        {aiEstimate.data_source.user_provided.map((item: string, index: number) => (
                                          <li key={index} className="text-xs text-gray-600 flex items-start gap-1.5 pl-5">
                                            <span className="text-sage mt-0.5">•</span>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {aiEstimate.data_source.assumed_defaults && Array.isArray(aiEstimate.data_source.assumed_defaults) && aiEstimate.data_source.assumed_defaults.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
                                        <Info className="w-3.5 h-3.5 text-gray-400" />
                                        Assumed Defaults
                                      </p>
                                      <ul className="space-y-1">
                                        {aiEstimate.data_source.assumed_defaults.map((item: string, index: number) => (
                                          <li key={index} className="text-xs text-gray-400 flex items-start gap-1.5 pl-5">
                                            <span className="text-gray-300 mt-0.5">•</span>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </details>
                            )}

                            {/* Potential Additional Costs */}
                            {aiEstimate.potential_additions && Array.isArray(aiEstimate.potential_additions) && aiEstimate.potential_additions.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Potential Additional Costs</h5>
                                <div className="bg-orange-50/60 rounded-lg p-3 space-y-1.5">
                                  {aiEstimate.potential_additions.map((cost: any, index: number) => (
                                    <p key={index} className="text-xs text-orange-700 flex items-start gap-1.5">
                                      <span className="text-orange-400 mt-0.5">⚠</span>
                                      {typeof cost === 'string' ? cost : cost.description || cost}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Next Steps - Recommended Actions */}
                            {aiEstimate.next_steps && Array.isArray(aiEstimate.next_steps) && aiEstimate.next_steps.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Recommended Next Steps</h5>
                                <div className="space-y-2">
                                  {aiEstimate.next_steps.map((step: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2.5 bg-sage/5 rounded-lg p-2.5 border border-sage/10 group hover:border-sage/20 transition-colors">
                                      <div className="w-5 h-5 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-sage/20 transition-colors">
                                        <ArrowRight className="w-3 h-3 text-sage" />
                                      </div>
                                      <p className="text-xs text-navy/80 leading-relaxed">{step}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* HST Note */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                {aiEstimate.hst_note || 'All prices are before HST (13%). HST will be added to final invoice.'}
                              </p>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">
                              {aiEstimate.disclaimer || 'This AI-generated estimate is for informational purposes only and is based on standard Ontario market rates. Actual pricing may vary based on site conditions, accessibility, paint brand availability, and other factors. A final quote will be provided after a free on-site assessment.'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bottom Info & CTA */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 justify-center mt-6 mb-4">
                        <Info className="w-3.5 h-3.5" />
                        <span>Prices are estimates only. Final quote provided after on-site assessment.</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                          onClick={() => setEstimateFormOpen(true)}
                          size="lg"
                          className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-6 text-base rounded-xl transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
                        >
                          Book a Free On-Site Assessment
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {currentStep < steps.length - 1 && (
            <div className="px-6 md:px-8 pb-6 md:pb-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-gray-500 hover:text-navy"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gold hover:bg-gold-light text-white font-semibold"
              >
                {isConsultation && currentStep === 1 ? 'See Estimate' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
          {currentStep === steps.length - 1 && (
            <div className="px-6 md:px-8 pb-6 md:pb-8 flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={prevStep}
                className="text-gray-500 hover:text-navy"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Modify Selections
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </section>
  );
}
