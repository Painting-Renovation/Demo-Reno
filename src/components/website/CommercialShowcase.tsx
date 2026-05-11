'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Store, UtensilsCrossed, Warehouse, Shield, Clock, Users, Truck, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const sectors = [
  {
    icon: Building2,
    title: 'Office Spaces',
    description: 'Professional interior and exterior painting for corporate environments. Minimize disruption with our after-hours scheduling.',
    scope: '1,000 - 50,000+ sq ft',
    features: ['After-hours & weekend scheduling', 'Low-VOC & odorless options', 'Color branding consultation', 'Furniture protection'],
    color: 'from-blue-900 to-blue-700',
  },
  {
    icon: Store,
    title: 'Retail Stores',
    description: 'Eye-catching storefronts and inviting interiors that attract customers and elevate your brand experience.',
    scope: '500 - 20,000 sq ft',
    features: ['Brand-aligned color schemes', 'Fixture & display painting', 'Grand opening timelines', 'Seasonal refreshes'],
    color: 'from-purple-900 to-purple-700',
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurants & Hospitality',
    description: 'Create the perfect ambiance with food-safe, durable finishes that meet health code requirements.',
    scope: '800 - 15,000 sq ft',
    features: ['Food-safe coatings', 'Durability-focused finishes', 'Ambiance lighting coordination', 'Quick turnaround'],
    color: 'from-amber-900 to-amber-700',
  },
  {
    icon: Warehouse,
    title: 'Industrial & Warehouse',
    description: 'Heavy-duty coatings for high-traffic areas, warehouses, and manufacturing facilities built to last.',
    scope: '5,000 - 100,000+ sq ft',
    features: ['Epoxy & industrial coatings', 'Floor marking & safety lines', 'High-durability formulations', 'Large crew deployment'],
    color: 'from-gray-900 to-gray-700',
  },
];

const trustedCompanies = [
  'TechCorp', 'MapleLeaf Foods', 'Toronto General', 'Scotiabank', 'Ryerson University', 'Shopify',
];

const caseStudies = [
  {
    title: 'Scotia Plaza Office Renovation',
    client: 'Major Financial Institution',
    size: '35,000 sq ft',
    duration: '3 weeks',
    stats: [
      { label: 'Downtime Reduced', value: '60%', icon: Clock },
      { label: 'Employee Satisfaction', value: '+45%', icon: Users },
      { label: 'Energy Savings', value: '12%', icon: Star },
    ],
    description: 'Complete interior repaint of 12 floors with after-hours scheduling, resulting in minimal business disruption.',
  },
  {
    title: 'Yorkdale Retail Refresh',
    client: 'National Retail Chain',
    size: '8,500 sq ft',
    duration: '10 days',
    stats: [
      { label: 'Customer Traffic', value: '+28%', icon: Users },
      { label: 'Brand Consistency', value: '100%', icon: CheckCircle2 },
      { label: 'Completed On Time', value: 'Yes', icon: CheckCircle2 },
    ],
    description: 'Full brand-aligned renovation across 3 store locations with coordinated color schemes and fixture painting.',
  },
  {
    title: 'Distillery District Restaurant',
    client: 'Fine Dining Establishment',
    size: '3,200 sq ft',
    duration: '5 days',
    stats: [
      { label: 'Health Code Rating', value: 'A+', icon: Shield },
      { label: 'Guest Satisfaction', value: '+52%', icon: Star },
      { label: 'Repeat Visits', value: '+35%', icon: Users },
    ],
    description: 'Atmospheric repaint with custom accent walls, food-safe coatings, and curated color palette for ambiance.',
  },
];

const galleryItems = [
  { title: 'Corporate Lobby', category: 'Office', image: '/images/hero-interior.jpg' },
  { title: 'Retail Frontage', category: 'Retail', image: '/images/hero-exterior.jpg' },
  { title: 'Restaurant Interior', category: 'Hospitality', image: '/images/cabinet-refinish.jpg' },
  { title: 'Warehouse Floor', category: 'Industrial', image: '/images/deck-fence.jpg' },
  { title: 'Office Open Plan', category: 'Office', image: '/images/hero-interior.jpg' },
  { title: 'Medical Clinic', category: 'Office', image: '/images/hero-exterior.jpg' },
];

const trustBadges = [
  { icon: Shield, label: 'Fully Bonded & Insured' },
  { icon: CheckCircle2, label: 'WSIB Compliant' },
  { icon: Clock, label: 'After-Hours Available' },
  { icon: Users, label: 'Large Crew Capacity' },
  { icon: Truck, label: 'Free On-Site Estimates' },
  { icon: Star, label: 'Commercial Warranty' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CommercialShowcase() {
  const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);

  return (
    <section id="commercial-services" className="relative">
      {/* Hero Banner */}
      <div className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-sage/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-4 px-4 py-1.5 text-sm font-medium">
              Commercial Division
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Professional <span className="text-shimmer-gold">Commercial</span> Painting Services
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-8">
              From offices to warehouses, we deliver large-scale painting projects on time, on budget, and with minimal disruption to your business operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-light text-white px-8 py-6 text-base font-semibold rounded-full animate-pulse-glow"
              >
                Request a Commercial Quote
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base rounded-full"
              >
                View Our Portfolio
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Commercial Sectors */}
      <div className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Industries We Serve</span>
            <h3 className="text-3xl md:text-4xl font-bold text-navy mt-3 mb-4">Specialized Commercial Solutions</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Tailored painting services for every commercial environment with industry-specific expertise.</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {sectors.map((sector) => (
              <motion.div key={sector.title} variants={item}>
                <Card className="group h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${sector.color}`} />
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${sector.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <sector.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-navy mb-2">{sector.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{sector.description}</p>
                    <div className="text-xs text-gold font-semibold mb-3">Typical scope: {sector.scope}</div>
                    <ul className="space-y-1.5 mb-5">
                      {sector.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sage flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full border-navy/20 text-navy hover:bg-navy hover:text-white rounded-full text-sm">
                      Request Quote <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-gray-500 text-sm font-medium tracking-widest uppercase mb-8">Trusted by businesses across the GTA</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {trustedCompanies.map((company) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.random() * 0.3 }}
                  className="flex items-center justify-center h-16 px-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg font-bold text-navy/40 tracking-wide">{company}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Success Stories</span>
            <h3 className="text-3xl md:text-4xl font-bold text-navy mt-3 mb-4">Commercial Case Studies</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Real results from real commercial projects. See how we deliver value beyond paint.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="h-full border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
                  <div className="h-48 bg-gradient-to-br from-navy to-navy-light relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gold/20" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gold text-white text-xs">Case Study</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-navy mb-1">{study.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{study.client} &middot; {study.size} &middot; {study.duration}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{study.description}</p>
                    <div className="grid grid-cols-3 gap-3">
                      {study.stats.map((stat) => (
                        <div key={stat.label} className="text-center bg-cream rounded-lg p-3">
                          <stat.icon className="w-4 h-4 text-gold mx-auto mb-1" />
                          <div className="text-lg font-bold text-navy">{stat.value}</div>
                          <div className="text-[10px] text-gray-500 leading-tight">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Gallery */}
      <div className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">Our Work</span>
            <h3 className="text-3xl md:text-4xl font-bold text-navy mt-3 mb-4">Commercial Project Gallery</h3>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryItems.map((gallery, index) => (
              <motion.div
                key={index}
                variants={item}
                className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onMouseEnter={() => setHoveredGallery(index)}
                onMouseLeave={() => setHoveredGallery(null)}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-navy-light to-navy relative">
                  <img src={gallery.image} alt={gallery.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className={`absolute inset-0 bg-navy/60 transition-opacity duration-300 ${hoveredGallery === index ? 'opacity-100' : 'opacity-0'}`} />
                  <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${hoveredGallery === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h4 className="text-white font-bold text-lg mb-1">{gallery.title}</h4>
                    <Badge className="bg-gold/20 text-gold border-gold/30">{gallery.category}</Badge>
                  </div>
                </div>
                {hoveredGallery !== index && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h4 className="text-white font-semibold text-sm">{gallery.title}</h4>
                    <p className="text-white/60 text-xs">{gallery.category}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.label}
                variants={item}
                className="flex flex-col items-center text-center gap-2 p-4"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <badge.icon className="w-6 h-6 text-gold" />
                </div>
                <span className="text-white/80 text-xs font-medium leading-tight">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
