'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

const appointmentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  serviceType: z.string().min(1, 'Please select a service'),
  notes: z.string().optional(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

const serviceTypes = [
  'Interior Painting',
  'Exterior Painting',
  'Cabinet Refinishing',
  'Commercial Painting',
  'Deck & Fence Staining',
  'Color Consultation',
];

const morningSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
const afternoonSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];
const allTimeSlots = [...morningSlots, ...afternoonSlots];

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      animate={{
        opacity: 0,
        x: (Math.random() - 0.5) * 280,
        y: -(Math.random() * 180 + 50),
        scale: 0,
        rotate: Math.random() * 720 - 360,
      }}
      transition={{ duration: 1.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute w-2 h-2 rounded-sm pointer-events-none"
      style={{ backgroundColor: color, left: '50%', top: '50%' }}
    />
  );
}

function ConfettiBurst() {
  const colors = ['#5B7B5A', '#7A9E79', '#C8973E', '#E8B94E', '#0B1D3A', '#FDF8F0'];
  return (
    <div className="relative w-0 h-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <ConfettiParticle key={i} delay={i * 0.03} color={colors[i % colors.length]} />
      ))}
    </div>
  );
}

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

export function AppointmentForm() {
  const { appointmentFormOpen, setAppointmentFormOpen } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = async (data: AppointmentData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Build the API payload - map form fields to what the API expects
      const dateValue = selectedDate
        ? format(selectedDate, 'yyyy-MM-dd') + 'T' + (data.preferredTime || '09:00')
        : data.preferredDate;
      const { preferredDate, preferredTime, ...apiFields } = data;
      const payload = {
        ...apiFields,
        date: dateValue,
      };

      const res = await fetch('/api/appointments', {
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
    setAppointmentFormOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setShowConfetti(false);
      setSubmitError('');
      setSelectedDate(undefined);
      reset();
    }, 300);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue('preferredDate', format(date, 'yyyy-MM-dd'), { shouldValidate: true });
    }
    setCalendarOpen(false);
  };

  return (
    <Dialog open={appointmentFormOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-full h-full sm:w-auto sm:h-auto sm:max-w-[580px] max-h-[100dvh] overflow-y-auto p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-sage to-sage-light rounded-xl flex items-center justify-center shadow-md">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-navy">
                Book a Consultation
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-500">
                Schedule a free on-site or virtual consultation at your convenience.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {!isSuccess ? (
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingField label="First Name *" htmlFor="appt-firstname" error={errors.firstName}>
                  <Input
                    id="appt-firstname"
                    placeholder="First name"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-400 focus-visible:ring-red-200' : ''}
                  />
                </FloatingField>
                <FloatingField label="Last Name *" htmlFor="appt-lastname" error={errors.lastName}>
                  <Input
                    id="appt-lastname"
                    placeholder="Last name"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-400 focus-visible:ring-red-200' : ''}
                  />
                </FloatingField>
              </div>

              <FloatingField label="Email *" htmlFor="appt-email" error={errors.email}>
                <Input
                  id="appt-email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-400 focus-visible:ring-red-200' : ''}
                />
              </FloatingField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingField label="Phone *" htmlFor="appt-phone" error={errors.phone}>
                  <Input
                    id="appt-phone"
                    type="tel"
                    placeholder="(437) 535-0494"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-400 focus-visible:ring-red-200' : ''}
                  />
                </FloatingField>
                <FloatingField label="Address *" htmlFor="appt-address" error={errors.address}>
                  <Input
                    id="appt-address"
                    placeholder="Project address"
                    {...register('address')}
                    className={errors.address ? 'border-red-400 focus-visible:ring-red-200' : ''}
                  />
                </FloatingField>
              </div>

              {/* Date Picker */}
              <FloatingField label="Preferred Date *" error={errors.preferredDate}>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start text-left font-normal h-11 rounded-xl transition-all ${
                        errors.preferredDate ? 'border-red-400' : ''
                      } ${!selectedDate ? 'text-gray-400' : ''} hover:border-gold/40`}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2 text-gold" />
                      {selectedDate ? format(selectedDate, 'EEEE, MMM d, yyyy') : 'Select a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-gold/20 shadow-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </FloatingField>

              {/* Time Slot Picker - Visual Grid */}
              <div className="space-y-1.5">
                <Label className="text-sm text-navy font-medium">Preferred Time *</Label>
                <div className="space-y-3">
                  {/* Morning slots */}
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Morning
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1.5">
                      {morningSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setValue('preferredTime', time, { shouldValidate: true });
                          }}
                          className={`text-[11px] sm:text-xs py-2 px-1 rounded-lg font-medium transition-all cursor-pointer ${
                            watchedFields.preferredTime === time
                              ? 'bg-navy text-white shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-600 hover:border-navy/30 hover:text-navy'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Afternoon slots */}
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gold-light rounded-full" />
                      Afternoon
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1.5">
                      {afternoonSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setValue('preferredTime', time, { shouldValidate: true });
                          }}
                          className={`text-xs py-2 px-1 rounded-lg font-medium transition-all cursor-pointer ${
                            watchedFields.preferredTime === time
                              ? 'bg-navy text-white shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-600 hover:border-navy/30 hover:text-navy'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.preferredTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-500"
                    >
                      {errors.preferredTime.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Service Type */}
              <FloatingField label="Service Type *" error={errors.serviceType}>
                <Select
                  value={watchedFields.serviceType || ''}
                  onValueChange={(val) => setValue('serviceType', val, { shouldValidate: true })}
                >
                  <SelectTrigger className={`rounded-xl ${errors.serviceType ? 'border-red-400' : ''}`}>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FloatingField>

              <div className="space-y-1.5">
                <Label htmlFor="appt-notes" className="text-sm text-navy font-medium">
                  Additional Notes
                </Label>
                <Textarea
                  id="appt-notes"
                  placeholder="Any special requirements or questions..."
                  rows={3}
                  {...register('notes')}
                  className="resize-none rounded-xl"
                />
              </div>

              {/* Error display */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-2"
                  >
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-500 text-xs font-bold">!</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-800">Booking Failed</p>
                        <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-light text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Book Consultation
                      <Sparkles className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                We&apos;ll confirm your appointment via email within a few hours.
              </p>
            </motion.form>
          ) : (
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
                Consultation Booked!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-6 max-w-sm mx-auto"
              >
                Thank you, {watchedFields.firstName}! Your consultation has been scheduled.
              </motion.p>

              {/* Appointment details card */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-cream rounded-xl p-5 mb-6 max-w-xs mx-auto border border-gold/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-navy">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {watchedFields.preferredTime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {watchedFields.serviceType && (
                      <div className="flex items-center gap-2 text-navy">
                        <Sparkles className="w-3.5 h-3.5 text-gold" />
                        <span className="font-medium">{watchedFields.serviceType}</span>
                      </div>
                    )}
                    {watchedFields.address && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{watchedFields.address}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={handleClose}
                  className="bg-navy hover:bg-navy-light text-white font-semibold px-8 transition-all shadow-sm hover:shadow-md rounded-xl"
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
