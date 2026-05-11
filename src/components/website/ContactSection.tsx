'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Send,
  ChevronDown,
  Star,
  Shield,
  Award,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '(416) 555-PAINT',
    href: 'tel:4165557246',
    color: 'bg-gold/10 text-gold',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@procoatpainters.ca',
    href: 'mailto:info@procoatpainters.ca',
    color: 'bg-navy/10 text-navy',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Painting Lane, Suite 200\nToronto, ON M4B 1B3',
    href: '#',
    color: 'bg-sage/10 text-sage',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 3:00 PM',
    href: '#',
    color: 'bg-gold/10 text-gold',
  },
];

const serviceOptions = [
  'Interior Painting',
  'Exterior Painting',
  'Cabinet Refinishing',
  'Commercial Painting',
  'Deck & Fence Staining',
  'Color Consultation',
  'Other',
];

const socialProofBadges = [
  {
    icon: Star,
    label: 'Google',
    value: '4.9/5',
    reviews: '350+ Reviews',
    color: 'from-gold/10 to-gold/5 border-gold/15',
    iconColor: 'text-gold',
  },
  {
    icon: ThumbsUp,
    label: 'HomeStars',
    value: '9.8/10',
    reviews: 'Best of 2024',
    color: 'from-sage/10 to-sage/5 border-sage/15',
    iconColor: 'text-sage',
  },
  {
    icon: Shield,
    label: 'BBB',
    value: 'A+ Rated',
    reviews: 'Accredited',
    color: 'from-navy/10 to-navy/5 border-navy/15',
    iconColor: 'text-navy',
  },
  {
    icon: Award,
    label: 'Homestars',
    value: 'Top Pro',
    reviews: '2019–2024',
    color: 'from-gold/10 to-gold/5 border-gold/15',
    iconColor: 'text-gold',
  },
];

const faqItems = [
  {
    question: 'How much does a painting project typically cost?',
    answer:
      'Costs vary based on the scope of work, room size, and paint quality. We offer free estimates so you know exactly what to expect — no hidden fees or surprises.',
  },
  {
    question: 'How long does a typical interior painting job take?',
    answer:
      'A standard room takes 1–2 days. A full interior home typically takes 3–7 days depending on size and complexity. We always provide a detailed timeline upfront.',
  },
  {
    question: 'Do you provide the paint and materials?',
    answer:
      'Yes! We use premium Benjamin Moore and Sherwin-Williams paints. All materials are included in our estimate, and we handle all prep work, cleanup, and disposal.',
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Absolutely. ProCoat Painters is fully licensed in Ontario and carries comprehensive liability insurance. We also provide a written warranty on all our work.',
  },
];

function FAQAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-semibold text-navy pr-4">{question}</span>
        <ChevronDown
          className={`faq-chevron w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone || undefined,
          serviceType: formData.service || undefined,
          projectDesc: formData.message || undefined,
          leadSource: 'website',
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setSubmitError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white relative">
      {/* Subtle noise texture */}
      <div className="noise-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4 text-shadow-navy">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Ready to start your project? Contact us today for a free consultation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-5"
          >
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-cream transition-all duration-300 group border border-transparent hover:border-gold/10"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{item.label}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-line mt-0.5">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}

            {/* Social Media */}
            <div className="pt-4">
              <p className="text-sm font-semibold text-navy mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 bg-navy/5 hover:bg-navy hover:text-white rounded-xl flex items-center justify-center text-navy transition-all duration-300 border border-transparent hover:border-navy/20 hover:-translate-y-0.5"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-navy/5 hover:bg-navy hover:text-white rounded-xl flex items-center justify-center text-navy transition-all duration-300 border border-transparent hover:border-navy/20 hover:-translate-y-0.5"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Send message"
                  className="w-10 h-10 bg-navy/5 hover:bg-navy hover:text-white rounded-xl flex items-center justify-center text-navy transition-all duration-300 border border-transparent hover:border-navy/20 hover:-translate-y-0.5"
                >
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Map Placeholder with gradient/pattern */}
            <div className="mt-4 map-placeholder rounded-2xl h-52 flex items-center justify-center relative">
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <p className="text-sm text-white/80 font-medium">Google Maps</p>
                <p className="text-xs text-white/50 mt-1">123 Painting Lane, Toronto</p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/15">
                  <div className="w-1.5 h-1.5 bg-sage rounded-full" />
                  <span className="text-[10px] text-white/70 font-medium">Serving the GTA</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-cream rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-navy mb-6">
                Quick Contact Form
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-sage" />
                  </div>
                  <h4 className="text-xl font-bold text-navy mb-2">Message Sent!</h4>
                  <p className="text-gray-600">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name" className="text-sm font-medium text-navy">
                        Name
                      </Label>
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white border-gray-200 form-input-glow transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-sm font-medium text-navy">
                        Email
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white border-gray-200 form-input-glow transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone" className="text-sm font-medium text-navy">
                        Phone
                      </Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="(416) 555-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white border-gray-200 form-input-glow transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-service" className="text-sm font-medium text-navy">
                        Service Interest
                      </Label>
                      <Select
                        value={formData.service}
                        onValueChange={(val) => setFormData({ ...formData, service: val })}
                      >
                        <SelectTrigger className="bg-white border-gray-200 form-input-glow w-full transition-all">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-sm font-medium text-navy">
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your project..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="bg-white border-gray-200 form-input-glow resize-none transition-all"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gold hover:bg-gold-light text-white font-semibold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  {submitError && (
                    <p className="text-xs text-red-500 text-center">{submitError}</p>
                  )}

                  <p className="text-xs text-gray-400 text-center">
                    We typically respond within 24 hours on business days.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Social Proof Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <p className="text-center text-sm font-semibold text-navy mb-6">
            Trusted &amp; Verified by
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {socialProofBadges.map((badge) => (
              <div
                key={badge.label}
                className={`social-proof-badge rounded-xl bg-gradient-to-br ${badge.color} border p-4 text-center cursor-default`}
              >
                <badge.icon className={`w-6 h-6 ${badge.iconColor} mx-auto mb-2`} />
                <p className="text-lg font-bold text-navy">{badge.value}</p>
                <p className="text-xs text-gray-500 font-medium">{badge.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{badge.reviews}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-navy mb-3">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600 text-sm">
              Quick answers to common questions about our painting services.
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq) => (
              <FAQAccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
