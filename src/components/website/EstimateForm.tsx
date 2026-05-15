'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
  FileText,
  ClipboardCheck,
  TrendingUp,
  Sparkles,
  CalendarCheck,
  MessageSquare,
} from 'lucide-react';
import { KoalendarEmbed } from '@/components/website/KoalendarEmbed';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Zod schema for step 1
const step1Schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Valid postal code is required'),
});

// Zod schema for step 2
const step2Schema = z.object({
  serviceType: z.string().min(1, 'Please select a service'),
  description: z.string().min(10, 'Please describe your project (at least 10 characters)'),
  timeline: z.string().min(1, 'Please select a timeline'),
  referralSource: z.string().min(1, 'Please select an option'),
});

// Combined schema for all form fields across all steps
const fullFormSchema = step1Schema.merge(step2Schema);

type FullFormData = z.infer<typeof fullFormSchema>;

const serviceTypes = [
  { name: 'Interior Painting', range: '$1,500 – $8,000' },
  { name: 'Exterior Painting', range: '$3,000 – $15,000' },
  { name: 'Cabinet Refinishing', range: '$800 – $3,500' },
  { name: 'Commercial Painting', range: '$5,000 – $50,000+' },
  { name: 'Deck & Fence Staining', range: '$500 – $2,500' },
  { name: 'Color Consultation', range: '$150 – $400' },
  { name: 'Multiple Services', range: '$2,000 – $25,000+' },
];

const timelines = [
  'Within 1 Week',
  '1-2 Weeks',
  '2-4 Weeks',
  '1-2 Months',
  '2-3 Months',
  'Flexible / No Rush',
];

const referralSources = [
  'Google Search',
  'Social Media',
  'Referral from Friend/Family',
  'Drove By (Saw Sign)',
  'Online Review Site',
  'Home Show / Event',
  'Other',
];

const stepConfig = [
  { label: 'Contact Info', icon: User },
  { label: 'Project Details', icon: FileText },
  { label: 'Confirmation', icon: ClipboardCheck },
];

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      initial={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      }}
      animate={{
        opacity: 0,
        x: (Math.random() - 0.5) * 300,
        y: -(Math.random() * 200 + 50),
        scale: 0,
        rotate: Math.random() * 720 - 360,
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="absolute w-2 h-2 rounded-sm pointer-events-none"
      style={{
        backgroundColor: color,
        left: '50%',
        top: '50%',
      }}
    />
  );
}

function ConfettiBurst() {
  const colors = ['#C8973E', '#E8B94E', '#5B7B5A', '#0B1D3A', '#FDF8F0', '#FF6B6B', '#4ECDC4'];
  return (
    <div className="relative w-0 h-0">
      {Array.from({ length: 24 }).map((_, i) => (
        <ConfettiParticle key={i} delay={i * 0.03} color={colors[i % colors.length]} />
      ))}
    </div>
  );
}

// Floating label input wrapper
function FloatingField({
  children,
  label,
  htmlFor,
  error,
}: {
  children: React.ReactNode;
  label: string;
  htmlFor?: string;
  error?: { message?: string };
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm text-navy font-medium">
        {label}
      </Label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-red-500 overflow-hidden"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EstimateForm() {
  const { estimateFormOpen, setEstimateFormOpen } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset,
  } = useForm<FullFormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const handleNext = async () => {
    let valid = false;
    if (currentStep === 1) {
      valid = await trigger(['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']);
    } else if (currentStep === 2) {
      valid = await trigger(['serviceType', 'description', 'timeline', 'referralSource']);
    }
    if (valid) {
      setSubmitError('');
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setSubmitError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async () => {
    if (!termsAccepted) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        firstName: watchedFields.firstName,
        lastName: watchedFields.lastName,
        email: watchedFields.email,
        phone: watchedFields.phone,
        address: watchedFields.address,
        city: watchedFields.city,
        postalCode: watchedFields.postalCode,
        serviceType: watchedFields.serviceType,
        description: watchedFields.description,
        timeline: watchedFields.timeline,
        referralSource: watchedFields.referralSource,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowConfetti(true);
        setTimeout(() => setIsSuccess(true), 400);
      } else {
        let errorMsg = 'Something went wrong. Please try again.';
        try {
          const errData = await res.json();
          errorMsg = errData.error || errData.message || errorMsg;
        } catch {
          // use default error message
        }
        setSubmitError(errorMsg);
      }
    } catch {
      setSubmitError('Something went wrong. Please try again or call us at (437) 535-0494.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEstimateFormOpen(false);
    setTimeout(() => {
      setCurrentStep(1);
      setIsSuccess(false);
      setTermsAccepted(false);
      setSubmitError('');
      setShowConfetti(false);
      reset();
    }, 300);
  };

  const progress = ((currentStep - 1) / (stepConfig.length - 1)) * 100;

  // Get estimated value range for selected service
  const selectedService = serviceTypes.find(s => s.name === watchedFields.serviceType);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 60 : -60,
      opacity: 0,
    }),
  };

  return (
    <Dialog open={estimateFormOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[750px] max-h-[92vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-navy">
                Get Your Free Estimate
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Complete the form below and we&apos;ll get back to you within 24 hours.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {!isSuccess ? (
            <>
              {/* Koalendar Booking Widget Section */}
              <div className="mb-6 mt-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#C8973E] to-[#E8B94E] rounded-xl flex items-center justify-center shadow-sm">
                    <CalendarCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0B1D3A]">
                      Book Your Free Appointment
                    </h3>
                    <p className="text-xs text-gray-500">
                      Pick a time that works best for you — no obligation.
                    </p>
                  </div>
                </div>
                <KoalendarEmbed />
              </div>

              {/* Visual Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 py-1.5 text-xs text-gray-400 font-medium flex items-center gap-1.5 rounded-full border border-gray-100">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Prefer to send us a message? Fill out the form below.
                  </span>
                </div>
              </div>

              {/* Step Progress Indicator */}
              <div className="mb-8 mt-2">
                <div className="flex items-center justify-between relative">
                  {/* Connecting line */}
                  <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-100 rounded-full" />
                  <motion.div
                    className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-gold to-gold-light rounded-full origin-left"
                    animate={{ width: `${(progress / 100) * (100 - (12 / 100) * 100)}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ maxWidth: 'calc(100% - 48px)' }}
                  />

                  {stepConfig.map((step, index) => {
                    const StepIcon = step.icon;
                    const stepNum = index + 1;
                    const isActive = currentStep === stepNum;
                    const isCompleted = currentStep > stepNum;

                    return (
                      <div
                        key={step.label}
                        className="relative z-10 flex flex-col items-center"
                        style={{ width: `${100 / stepConfig.length}%` }}
                      >
                        <motion.div
                          animate={{
                            backgroundColor: isActive ? '#C8973E' : isCompleted ? '#5B7B5A' : '#F5F0E8',
                            scale: isActive ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          )}
                        </motion.div>
                        <span className={`text-[11px] font-medium mt-2 transition-colors ${
                          isActive ? 'text-gold' : isCompleted ? 'text-sage' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait" custom={1}>
                {/* Step 1: Contact Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatingField label="First Name *" htmlFor="firstName" error={errors.firstName}>
                        <Input
                          id="firstName"
                          placeholder="John"
                          {...register('firstName')}
                          className={errors.firstName ? 'border-red-400 focus-visible:ring-red-200' : ''}
                        />
                      </FloatingField>
                      <FloatingField label="Last Name *" htmlFor="lastName" error={errors.lastName}>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          {...register('lastName')}
                          className={errors.lastName ? 'border-red-400 focus-visible:ring-red-200' : ''}
                        />
                      </FloatingField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatingField label="Email *" htmlFor="email" error={errors.email}>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register('email')}
                          className={errors.email ? 'border-red-400 focus-visible:ring-red-200' : ''}
                        />
                      </FloatingField>
                      <FloatingField label="Phone *" htmlFor="phone" error={errors.phone}>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(437) 535-0494"
                          {...register('phone')}
                          className={errors.phone ? 'border-red-400 focus-visible:ring-red-200' : ''}
                        />
                      </FloatingField>
                    </div>

                    <FloatingField label="Address *" htmlFor="address" error={errors.address}>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        {...register('address')}
                        className={errors.address ? 'border-red-400 focus-visible:ring-red-200' : ''}
                      />
                    </FloatingField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatingField label="City *" htmlFor="city" error={errors.city}>
                        <Input
                          id="city"
                          placeholder="Toronto"
                          {...register('city')}
                          className={errors.city ? 'border-red-400 focus-visible:ring-red-200' : ''}
                        />
                      </FloatingField>
                      <FloatingField label="Postal Code *" htmlFor="postalCode" error={errors.postalCode}>
                        <Input
                          id="postalCode"
                          placeholder="L4K 4M3"
                          {...register('postalCode')}
                          className={errors.postalCode ? 'border-red-400 focus-visible:ring-red-200' : ''}
                        />
                      </FloatingField>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Details */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="space-y-4"
                  >
                    <FloatingField label="Service Type *" error={errors.serviceType}>
                      <Select
                        value={watchedFields.serviceType || ''}
                        onValueChange={(val) => setValue('serviceType', val, { shouldValidate: true })}
                      >
                        <SelectTrigger className={errors.serviceType ? 'border-red-400' : ''}>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((s) => (
                            <SelectItem key={s.name} value={s.name}>
                              <span className="flex items-center justify-between gap-4 w-full">
                                <span>{s.name}</span>
                                <span className="text-xs text-gray-400">{s.range}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FloatingField>

                    {/* Estimated value range display */}
                    {selectedService && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-r from-gold/5 to-gold-light/5 border border-gold/15 rounded-xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Estimated project value range</p>
                          <p className="text-navy font-bold">{selectedService.range}</p>
                        </div>
                      </motion.div>
                    )}

                    <FloatingField label="Project Description *" htmlFor="description" error={errors.description}>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your project — what areas need painting, any specific requirements, etc."
                        rows={4}
                        {...register('description')}
                        className={errors.description ? 'border-red-400 focus-visible:ring-red-200' : ''}
                      />
                    </FloatingField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatingField label="Preferred Timeline *" error={errors.timeline}>
                        <Select
                          value={watchedFields.timeline || ''}
                          onValueChange={(val) => setValue('timeline', val, { shouldValidate: true })}
                        >
                          <SelectTrigger className={errors.timeline ? 'border-red-400' : ''}>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            {timelines.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FloatingField>
                      <FloatingField label="How did you hear about us? *" error={errors.referralSource}>
                        <Select
                          value={watchedFields.referralSource || ''}
                          onValueChange={(val) => setValue('referralSource', val, { shouldValidate: true })}
                        >
                          <SelectTrigger className={errors.referralSource ? 'border-red-400' : ''}>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {referralSources.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FloatingField>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="space-y-4"
                  >
                    <div className="bg-cream rounded-xl p-5 space-y-3">
                      <h4 className="font-semibold text-navy text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-gold" />
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-400">Name:</span> <span className="text-navy font-medium">{watchedFields.firstName} {watchedFields.lastName}</span></div>
                        <div><span className="text-gray-400">Email:</span> <span className="text-navy font-medium break-all">{watchedFields.email}</span></div>
                        <div><span className="text-gray-400">Phone:</span> <span className="text-navy font-medium">{watchedFields.phone}</span></div>
                        <div><span className="text-gray-400">Location:</span> <span className="text-navy font-medium">{watchedFields.city}</span></div>
                      </div>
                    </div>

                    <div className="bg-cream rounded-xl p-5 space-y-3">
                      <h4 className="font-semibold text-navy text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gold" />
                        Project Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-400">Service:</span> <span className="text-navy font-medium">{watchedFields.serviceType}</span></div>
                        <div><span className="text-gray-400">Timeline:</span> <span className="text-navy font-medium">{watchedFields.timeline}</span></div>
                        {selectedService && (
                          <div><span className="text-gray-400">Est. Range:</span> <span className="text-gold font-bold">{selectedService.range}</span></div>
                        )}
                        <div className="col-span-2"><span className="text-gray-400">Description:</span> <span className="text-navy font-medium">{watchedFields.description}</span></div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                        I agree to the terms and conditions and consent to being contacted regarding
                        my estimate request. I understand that my information will be used solely for
                        the purpose of providing a painting estimate.
                      </Label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error display */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-500 text-xs font-bold">!</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-800">Submission Failed</p>
                        <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="text-gray-500 hover:text-navy disabled:opacity-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-gold hover:bg-gold-light text-white font-semibold px-6 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={!termsAccepted || isSubmitting}
                    className="bg-gold hover:bg-gold-light text-white font-semibold px-6 transition-all disabled:opacity-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Estimate Request
                        <Sparkles className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 relative"
            >
              {/* Confetti */}
              <AnimatePresence>
                {showConfetti && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ConfettiBurst />
                  </div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-sage/10 to-sage/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle className="w-10 h-10 text-sage" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-navy mb-3"
              >
                Estimate Request Sent!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-2 max-w-sm mx-auto"
              >
                Thank you, {watchedFields.firstName}! We&apos;ve received your request and will
                contact you within 24 hours.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 text-sm mb-8"
              >
                Check your email at <span className="text-navy font-medium">{watchedFields.email}</span> for confirmation.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={handleClose}
                  className="bg-navy hover:bg-navy-light text-white font-semibold px-6 transition-all shadow-sm hover:shadow-md"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
