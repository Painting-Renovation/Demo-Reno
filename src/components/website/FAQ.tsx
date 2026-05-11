'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: 'How much does interior painting cost?',
    answer:
      'Interior painting costs vary depending on the size of the space, the condition of the walls, and the quality of paint used. On average, you can expect to pay between $2.50 and $5.00 per square foot. We provide free, no-obligation estimates so you know exactly what to expect before we start.',
  },
  {
    question: 'How long does a typical painting project take?',
    answer:
      'The timeline depends on the scope of the project. A single room typically takes 1-2 days, while a full home interior can take 3-7 days. Exterior projects usually take 3-5 days, weather permitting. We provide a detailed timeline with every estimate so you can plan accordingly.',
  },
  {
    question: 'Do you provide free estimates?',
    answer:
      'Yes! We offer completely free, no-obligation estimates for all our services. Our team will visit your property, assess the work needed, and provide a detailed written quote within 24-48 hours. You can request an estimate online or give us a call.',
  },
  {
    question: 'What brands of paint do you use?',
    answer:
      'We use premium paint brands including Benjamin Moore, Sherwin-Williams, and Dulux. We can also accommodate specific brand preferences if you have one. Our team recommends the best paint type and finish for each surface to ensure lasting results.',
  },
  {
    question: 'Do you offer a warranty on your work?',
    answer:
      'Absolutely. We stand behind our work with a comprehensive written warranty covering both labor and materials. Our standard warranty covers 2 years for residential projects and 1 year for commercial work. We also offer extended warranty options for additional peace of mind.',
  },
  {
    question: 'How do I prepare my home for painting?',
    answer:
      'We handle most of the preparation work ourselves, including moving furniture, covering floors, and masking off areas. We ask that you remove small fragile items, wall decorations, and items from shelves near painting areas. Our team will provide a detailed preparation checklist before the project begins.',
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Yes, ProCoat Painters is fully licensed and insured. We carry comprehensive liability insurance and WSIB coverage to protect both our team and your property. Copies of our licenses and insurance certificates are available upon request.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We serve the entire Greater Toronto Area including Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, Milton, Pickering, Ajax, Whitby, Oshawa, and surrounding communities. Contact us to confirm service availability in your area.',
  },
];

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
  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-cream rounded-full px-4 py-1.5 mb-4">
            <HelpCircle className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-navy/70">Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our painting services. Can&apos;t find what you&apos;re looking for? 
            Feel free to contact us directly.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem
                  value={`item-${index}`}
                  className="border-b border-gray-100"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-navy hover:text-navy-light hover:no-underline py-5 [&[data-state=open]]:text-gold [&[data-state=open]>svg]:text-gold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
