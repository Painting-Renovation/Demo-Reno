import Link from 'next/link';
import { ArrowRight, PaintBucket, ShieldCheck, Clock, Star, CheckCircle } from 'lucide-react';
import { ClientSections } from './ClientSections';

const trustItems = [
  { icon: PaintBucket, value: '2,000+', label: 'Projects Completed' },
  { icon: Star, value: '4.9★', label: 'Google Rating' },
  { icon: ShieldCheck, value: '15+', label: 'Years Experience' },
  { icon: Clock, value: '5-Year', label: 'Warranty' },
];

const navCards = [
  { title: 'Our Process', desc: 'See how we deliver exceptional results from start to finish.', href: '/process', icon: Clock, color: 'bg-navy' },
  { title: 'Gallery', desc: 'Browse our portfolio of completed residential and commercial projects.', href: '/gallery', icon: PaintBucket, color: 'bg-sage' },
  { title: 'Pricing', desc: 'Get instant estimates with our interactive pricing calculator.', href: '/pricing', icon: ShieldCheck, color: 'bg-gold' },
  { title: 'Testimonials', desc: 'Read what real homeowners say about their ProCoat experience.', href: '/testimonials', icon: Star, color: 'bg-navy-light' },
  { title: 'Free Estimate', desc: 'Get a detailed, no-obligation quote for your painting project.', href: '/free-estimate', icon: CheckCircle, color: 'bg-sage' },
  { title: 'Service Areas', desc: 'We serve Toronto and the entire Greater Toronto Area.', href: '/service-areas', icon: ShieldCheck, color: 'bg-gold' },
];

export default function HomePage() {
  return (
    <>
      {/* Heavy client-only sections (Hero, Services, etc.) */}
      <ClientSections />

      {/* Trust Indicators Bar — server-rendered static HTML */}
      <section className="py-6 sm:py-8 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <item.icon className="w-6 h-6 text-gold" />
                <span className="text-xl sm:text-2xl font-bold text-white">{item.value}</span>
                <span className="text-white/60 text-xs sm:text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards — server-rendered static HTML */}
      <section className="py-12 sm:py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-3">Explore More</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover everything ProCoat Painters has to offer for your home or business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {navCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{card.desc}</p>
                <span className="text-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — server-rendered static HTML */}
      <section className="py-12 sm:py-16 md:py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-navy" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(200,151,62,0.3) 20px, rgba(200,151,62,0.3) 21px)',
          }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to <span className="text-gold">Transform</span> Your Space?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Get a free, no-obligation estimate from Toronto&apos;s most trusted painting professionals.
            Our expert team is ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/free-estimate"
              className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-white font-semibold px-10 py-4 text-base rounded-lg shadow-md hover:shadow-lg transition-all min-h-[44px]"
            >
              Get Your Free Estimate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 text-base rounded-lg transition-all min-h-[44px]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
