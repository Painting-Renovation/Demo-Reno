'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Search, Phone, Mail, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const faqItems = [
  {
    question: 'How much does interior painting cost?',
    answer:
      'Interior painting costs vary depending on the size of the space, the condition of the walls, and the quality of paint used. On average, you can expect to pay between $2.50 and $5.00 per square foot. We provide free, no-obligation estimates so you know exactly what to expect before we start.',
    category: 'Pricing' as const,
  },
  {
    question: 'How long does a typical painting project take?',
    answer:
      'The timeline depends on the scope of the project. A single room typically takes 1-2 days, while a full home interior can take 3-7 days. Exterior projects usually take 3-5 days, weather permitting. We provide a detailed timeline with every estimate so you can plan accordingly.',
    category: 'Process' as const,
  },
  {
    question: 'Do you provide free estimates?',
    answer:
      'Yes! We offer completely free, no-obligation estimates for all our services. Our team will visit your property, assess the work needed, and provide a detailed written quote within 24-48 hours. You can request an estimate online or give us a call.',
    category: 'Pricing' as const,
  },
  {
    question: 'What brands of paint do you use?',
    answer:
      'We use premium paint brands including Benjamin Moore, Sherwin-Williams, and Dulux. We can also accommodate specific brand preferences if you have one. Our team recommends the best paint type and finish for each surface to ensure lasting results.',
    category: 'Process' as const,
  },
  {
    question: 'Do you offer a warranty on your work?',
    answer:
      'Absolutely. We stand behind our work with a comprehensive written warranty covering both labor and materials. Our standard warranty covers 2 years for residential projects and 1 year for commercial work. We also offer extended warranty options for additional peace of mind.',
    category: 'Warranty' as const,
  },
  {
    question: 'How do I prepare my home for painting?',
    answer:
      'We handle most of the preparation work ourselves, including moving furniture, covering floors, and masking off areas. We ask that you remove small fragile items, wall decorations, and items from shelves near painting areas. Our team will provide a detailed preparation checklist before the project begins.',
    category: 'Process' as const,
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Yes, ProCoat Painters is fully licensed and insured. We carry comprehensive liability insurance and WSIB coverage to protect both our team and your property. Copies of our licenses and insurance certificates are available upon request.',
    category: 'General' as const,
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We serve the entire Greater Toronto Area including Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, Milton, Pickering, Ajax, Whitby, Oshawa, and surrounding communities. Contact us to confirm service availability in your area.',
    category: 'General' as const,
  },
];

const categories = ['All', 'Pricing', 'Process', 'Warranty', 'General'] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function FAQ() {
  const { setEstimateFormOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section className="py-24 bg-cream relative overflow-hidden" id="faq">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 shadow-sm border border-gold/10">
            <HelpCircle className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-navy/70">Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our painting services. Can&apos;t find what you&apos;re looking for?
            Feel free to contact us directly.
          </p>
        </motion.div>

        {/* 2-Column Layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-start">
          {/* Left: FAQ */}
          <div>
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 text-navy text-sm placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-nowrap gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                    activeCategory === cat
                      ? 'bg-gold text-white shadow-md shadow-gold/20'
                      : 'bg-white text-navy/60 hover:bg-white hover:text-navy border border-gray-200 hover:border-gold/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No questions found matching your search.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="text-gold text-sm font-medium mt-2 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {filteredItems.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <AccordionItem
                        value={`item-${index}`}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden data-[state=open]:border-gold/20 data-[state=open]:shadow-md data-[state=open]:shadow-gold/5 transition-all duration-300 hover:border-gray-200 hover:shadow-sm"
                      >
                        <AccordionTrigger className="text-left text-base font-medium text-navy hover:text-navy hover:no-underline py-5 px-6 data-[state=open]:text-gold [&[data-state=open]>svg]:text-gold [&>svg]:text-gray-400">
                          <div className="flex items-center gap-3">
                            <HelpCircle className="w-4 h-4 text-gold/60 flex-shrink-0" />
                            <span>{item.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-base leading-relaxed pb-5 px-6">
                          <div className="pl-7">
                            {item.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              )}
            </motion.div>

            {/* Still have questions CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 text-center bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
              <MessageCircle className="w-8 h-8 text-gold mx-auto mb-3" />
              <h3 className="text-lg font-bold text-navy mb-2">Still have questions?</h3>
              <p className="text-gray-500 text-sm mb-5">
                Our team is happy to help. Reach out and we&apos;ll get back to you within 24 hours.
              </p>
              <Button
                onClick={() => setEstimateFormOpen(true)}
                className="bg-gold hover:bg-gold-light text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          {/* Right: Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="sticky top-28">
              <div className="bg-navy rounded-2xl p-8 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage/10 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-gold text-sm font-semibold">Get In Touch</span>
                  </div>
                  <h3 className="text-xl font-bold mb-6">We&apos;d love to hear from you</h3>

                  {/* Contact items */}
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Phone</p>
                        <a href="tel:+14375350494" className="text-white font-semibold hover:text-gold transition-colors">
                          (437) 535-0494
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Email</p>
                        <a href="mailto:infoinandoutdemolition@gmail.com" className="text-white font-semibold hover:text-gold transition-colors text-sm">
                          infoinandoutdemolition@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Hours</p>
                        <p className="text-white font-semibold text-sm">Mon–Sat: 8AM–6PM</p>
                        <p className="text-white/60 text-sm">Sun: Closed</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => setEstimateFormOpen(true)}
                    className="w-full bg-gold hover:bg-gold-light text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg mt-8"
                  >
                    Get Free Estimate
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 fill-gold text-gold" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/50 text-xs">4.9/5 on Google</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
