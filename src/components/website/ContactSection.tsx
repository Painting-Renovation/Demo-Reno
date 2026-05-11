'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Send } from 'lucide-react';
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

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // POST to /api/leads would go here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
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
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-cream transition-colors group"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
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
                  className="w-10 h-10 bg-navy/5 hover:bg-navy hover:text-white rounded-xl flex items-center justify-center text-navy transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-navy/5 hover:bg-navy hover:text-white rounded-xl flex items-center justify-center text-navy transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-navy/5 hover:bg-navy hover:text-white rounded-xl flex items-center justify-center text-navy transition-all"
                >
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 bg-cream rounded-2xl h-48 flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gold mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Google Maps</p>
                <p className="text-xs text-gray-400">123 Painting Lane, Toronto</p>
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
            <div className="bg-cream rounded-2xl p-6 md:p-8 border border-gray-100">
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
                        className="bg-white border-gray-200 focus:border-gold"
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
                        className="bg-white border-gray-200 focus:border-gold"
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
                        className="bg-white border-gray-200 focus:border-gold"
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
                        <SelectTrigger className="bg-white border-gray-200 focus:border-gold w-full">
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
                      className="bg-white border-gray-200 focus:border-gold resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-light text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    We typically respond within 24 hours on business days.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
