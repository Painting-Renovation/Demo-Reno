import {
  PaintBucket,
  Paintbrush,
  Home as HomeIcon,
  Building2,
  Fence,
  Palette,
  Clock,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceDetail {
  slug: string;
  name: string;
  shortName: string;
  category: 'interior' | 'exterior' | 'cabinets' | 'commercial' | 'deck' | 'consultation';
  icon: LucideIcon;
  heroImage: string;
  color: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  process: { step: string; description: string }[];
  faq: { question: string; answer: string }[];
  cta: string;
  relatedServices: string[];
  avgPrice: string;
  duration: string;
}

export const servicesData: ServiceDetail[] = [
  {
    slug: 'interior-painting',
    name: 'Interior Painting',
    shortName: 'Interior',
    category: 'interior',
    icon: HomeIcon,
    heroImage: '/images/hero-interior.jpg',
    color: '#C8973E',
    tagline: 'Transform Your Living Spaces',
    description: 'Professional interior painting that breathes new life into your home with premium paints and meticulous attention to detail.',
    longDescription: 'Our interior painting service covers every room in your home — from living rooms and bedrooms to kitchens, bathrooms, and beyond. We use only premium paints from Benjamin Moore, Sherwin-Williams, and Farrow & Ball to ensure rich, lasting color that transforms your space. Our crews are trained to handle everything from simple accent walls to complex multi-color schemes with precision.',
    features: [
      'Premium Benjamin Moore, Sherwin-Williams & Farrow & Ball paints',
      'Professional color consultation included',
      'Meticulous prep work: patching, sanding, priming',
      'Clean-room setup with floor & furniture protection',
      'Trim, crown molding, and accent wall expertise',
      'Low-VOC & zero-VOC paint options available',
      'One-coat coverage on properly prepped surfaces',
      'Full cleanup and touch-up walk-through included',
    ],
    process: [
      { step: 'Consultation', description: 'Free in-home consultation to discuss your vision, color preferences, and project scope.' },
      { step: 'Preparation', description: 'Furniture covered, floors protected, holes patched, sanded smooth, and primed.' },
      { step: 'Painting', description: 'Professional application with premium paints, crisp cut-ins, and even coverage.' },
      { step: 'Inspection', description: 'Detailed walkthrough with you to ensure every detail meets your expectations.' },
    ],
    faq: [
      { question: 'How long does interior painting take?', answer: 'A typical room takes 1-2 days. A full home (3-4 bedrooms) takes 5-7 days depending on complexity.' },
      { question: 'Do I need to move my furniture?', answer: 'No! Our crew carefully moves and covers all furniture. We return everything to its original position when finished.' },
      { question: 'What paint brands do you use?', answer: 'We primarily use Benjamin Moore Aura, Sherwin-Williams SuperPaint, and Farrow & Ball. We can also use any specific brand you prefer.' },
      { question: 'Is there a warranty?', answer: 'Yes! All interior painting comes with our 5-year workmanship warranty covering peeling, blistering, and adhesion issues.' },
    ],
    cta: 'Ready to Transform Your Home?',
    relatedServices: ['cabinet-refinishing', 'color-consultation'],
    avgPrice: '$2,500 - $8,000',
    duration: '2-7 days',
  },
  {
    slug: 'exterior-painting',
    name: 'Exterior Painting',
    shortName: 'Exterior',
    category: 'exterior',
    icon: PaintBucket,
    heroImage: '/images/hero-exterior.jpg',
    color: '#0B1D3A',
    tagline: 'Protect & Beautify Your Home',
    description: 'Expert exterior painting that protects your home from the elements while dramatically enhancing curb appeal.',
    longDescription: 'Toronto\'s harsh winters and humid summers take a toll on your home\'s exterior. Our exterior painting service provides a protective barrier against moisture, UV damage, and temperature extremes while giving your home a stunning fresh look. We handle everything from single-story homes to multi-story properties with the same meticulous attention to detail.',
    features: [
      'Comprehensive exterior prep: power washing, scraping, sanding',
      'Premium exterior-grade paints & stains',
      'Stucco, brick, wood, vinyl, and aluminum siding expertise',
      'Caulking and weatherproofing of all joints and gaps',
      'Sherwin-Williams SuperPaint & Benjamin Moore exterior lines',
      'Color consultation with sample boards at your home',
      'Deck, fence, and garage door painting included',
      'All work backed by our weather-resistant warranty',
    ],
    process: [
      { step: 'Inspection', description: 'Thorough inspection of all surfaces, identifying problem areas that need repair before painting.' },
      { step: 'Preparation', description: 'Power washing, scraping loose paint, sanding rough areas, caulking gaps, and priming bare wood.' },
      { step: 'Painting', description: 'Professional spray and back-roll application for even, durable coverage on all surfaces.' },
      { step: 'Protection', description: 'Final seal coat applied and a full inspection to ensure weather-tight protection.' },
    ],
    faq: [
      { question: 'What is the best time of year for exterior painting?', answer: 'Late spring through early fall (May-October) is ideal in Toronto. We need temperatures above 10°C for proper paint curing.' },
      { question: 'How long does exterior paint last?', answer: 'With proper preparation and premium paints, you can expect 7-10 years before needing a repaint.' },
      { question: 'Do you handle siding repairs?', answer: 'Yes! We patch minor wood rot, replace damaged trim boards, and repair stucco cracks as part of our prep work.' },
      { question: 'Will my landscaping be protected?', answer: 'Absolutely. We use drop cloths and carefully mask all plants, shrubs, walkways, and outdoor fixtures.' },
    ],
    cta: 'Boost Your Curb Appeal Today',
    relatedServices: ['deck-fence', 'commercial-painting'],
    avgPrice: '$3,000 - $12,000',
    duration: '3-10 days',
  },
  {
    slug: 'cabinet-refinishing',
    name: 'Cabinet Refinishing',
    shortName: 'Cabinets',
    category: 'cabinets',
    icon: Paintbrush,
    heroImage: '/images/cabinet-refinish.jpg',
    color: '#5B7B5A',
    tagline: 'Kitchen Upgrade Without Replacement',
    description: 'Transform dated cabinets into stunning focal points for a fraction of the replacement cost.',
    longDescription: 'Replace the look, not the cabinets. Our cabinet refinishing service can completely transform your kitchen or bathroom for 60-80% less than the cost of new cabinetry. We use professional-grade lacquers and conversion varnishes that provide a factory-quality finish far superior to standard paint. From classic whites to bold contemporary colors, we deliver a result that looks and feels brand new.',
    features: [
      'Professional lacquer & conversion varnish finishes',
      '60-80% savings vs. cabinet replacement',
      'Cabinet doors removed and sprayed in our controlled environment',
      'Hardware replacement & upgrade options',
      'Matching island, pantry, and built-in refinishing',
      'Anti-yellowing topcoat for lasting beauty',
      'Interior shelf & drawer refinishing available',
      'Same-week turnaround for most kitchens',
    ],
    process: [
      { step: 'Design', description: 'Consultation on colors, finishes, and hardware options. Sample doors finished for your approval.' },
      { step: 'Removal', description: 'All doors, drawers, and hardware carefully removed, labeled, and transported to our spray facility.' },
      { step: 'Refinishing', description: 'Professional cleaning, sanding, priming, and spray application of your chosen finish in a dust-free environment.' },
      { step: 'Reinstallation', description: 'Precision reinstallation with new hardware (if chosen), alignment adjustment, and final inspection.' },
    ],
    faq: [
      { question: 'How much does cabinet refinishing cost?', answer: 'Typically $3,000-$6,000 for an average kitchen, compared to $15,000-$30,000+ for full replacement.' },
      { question: 'How long does it take?', answer: 'Most kitchens are completed in 4-6 working days. You\'ll have use of your kitchen each evening.' },
      { question: 'Can you match a specific color?', answer: 'Yes! We can match any paint color, or create a custom stain finish to match existing wood tones.' },
      { question: 'Is the finish durable?', answer: 'Very. Our conversion varnish finish is harder and more scratch-resistant than factory-applied finishes.' },
    ],
    cta: 'Give Your Kitchen a Fresh Look',
    relatedServices: ['interior-painting', 'color-consultation'],
    avgPrice: '$3,000 - $6,000',
    duration: '4-6 days',
  },
  {
    slug: 'commercial-painting',
    name: 'Commercial Painting',
    shortName: 'Commercial',
    category: 'commercial',
    icon: Building2,
    heroImage: '/images/commercial.jpg',
    color: '#2C3E50',
    tagline: 'Professional Spaces, Professional Results',
    description: 'Commercial painting services designed for businesses — minimal disruption, maximum impact, flexible scheduling.',
    longDescription: 'We understand that for businesses, time is money. Our commercial painting service is built around your schedule — evenings, weekends, and holidays — to ensure zero disruption to your operations. From offices and retail spaces to restaurants and industrial facilities, we deliver professional results that reflect your brand and create the right impression for clients and employees alike.',
    features: [
      'Flexible scheduling: evenings, weekends, holidays',
      'Large-scale project capability (10,000+ sq ft)',
      'Brand color matching and consistency',
      'Low-odor and fast-drying paint options',
      'Division 9 specification compliance',
      'Licensed for industrial & institutional work',
      'Post-project touch-up maintenance program',
      'Detailed project management & daily reports',
    ],
    process: [
      { step: 'Assessment', description: 'On-site assessment of scope, timeline, and any special requirements (safety, access, hours of work).' },
      { step: 'Planning', description: 'Detailed project plan with schedule, paint specifications, and coordination with your team.' },
      { step: 'Execution', description: 'Professional crew deployment with daily progress updates and quality checkpoints.' },
      { step: 'Handover', description: 'Final walkthrough, touch-up, and project documentation with warranty information.' },
    ],
    faq: [
      { question: 'Can you paint while our business is open?', answer: 'Yes, we can work in sections and use low-odor, fast-drying products to minimize disruption.' },
      { question: 'Do you work on large commercial projects?', answer: 'Absolutely. We\'ve completed projects from 1,000 to 50,000+ square feet for offices, retail, and industrial clients.' },
      { question: 'Are you WSIB covered?', answer: 'Yes, all our crews carry full WSIB coverage and $5M commercial liability insurance.' },
      { question: 'Can you match our brand colors?', answer: 'Yes, we work with your brand guidelines and can match any Pantone or custom color specification.' },
    ],
    cta: 'Elevate Your Business Space',
    relatedServices: ['interior-painting', 'exterior-painting'],
    avgPrice: '$5,000 - $50,000+',
    duration: '3-14 days',
  },
  {
    slug: 'deck-fence',
    name: 'Deck & Fence Staining',
    shortName: 'Deck & Fence',
    category: 'deck',
    icon: Fence,
    heroImage: '/images/deck-fence.jpg',
    color: '#8B6914',
    tagline: 'Restore & Protect Your Outdoor Spaces',
    description: 'Professional deck and fence staining that restores natural beauty and provides long-lasting weather protection.',
    longDescription: 'Toronto\'s freeze-thaw cycles are brutal on outdoor wood surfaces. Our deck and fence staining service goes beyond simple staining — we restore, repair, and protect your outdoor investment. Our process includes thorough cleaning, surface preparation, repairs to damaged boards, and application of premium penetrating stains and sealers that penetrate deep into the wood for long-lasting protection.',
    features: [
      'Professional power washing and wood cleaning',
      'Board-by-board inspection and repair',
      'Premium penetrating stains & sealers',
      'Transparent, semi-transparent, and solid stain options',
      'Cedar, pressure-treated, and composite expertise',
      'Two-coat application for maximum protection',
      'Matching fence, pergola, and garden box staining',
      'Seasonal maintenance programs available',
    ],
    process: [
      { step: 'Cleaning', description: 'Deep power washing to remove dirt, mildew, and old stain. Wood brightener applied for even absorption.' },
      { step: 'Repair', description: 'Inspection and replacement of damaged or rotting boards, tightening loose fasteners and railings.' },
      { step: 'Staining', description: 'Application of premium stain with brush-back method for deep wood penetration and even coverage.' },
      { step: 'Sealing', description: 'Protective topcoat applied for UV resistance and water repellency, with 48-hour drying time.' },
    ],
    faq: [
      { question: 'How often should I stain my deck?', answer: 'Every 2-3 years for transparent stains, 3-5 years for solid stains, depending on sun and weather exposure.' },
      { question: 'What type of stain do you recommend?', answer: 'For cedar, we recommend semi-transparent penetrating stains. For older wood, solid stains provide better coverage.' },
      { question: 'Can you fix a warped deck board?', answer: 'Yes, we can replace individual boards that are warped, cracked, or rotting. We source matching materials.' },
      { question: 'Is staining better than painting a deck?', answer: 'Generally yes. Stain penetrates the wood and expands/contracts naturally, while paint sits on top and can peel.' },
    ],
    cta: 'Restore Your Outdoor Living Space',
    relatedServices: ['exterior-painting', 'commercial-painting'],
    avgPrice: '$1,500 - $5,000',
    duration: '1-3 days',
  },
  {
    slug: 'color-consultation',
    name: 'Color Consultation',
    shortName: 'Colors',
    category: 'consultation',
    icon: Palette,
    heroImage: '/images/hero-interior.jpg',
    color: '#9B59B6',
    tagline: 'Find Your Perfect Colors',
    description: 'Expert color consultation to help you choose the perfect palette for your space — with confidence.',
    longDescription: 'Choosing paint colors can be overwhelming with thousands of options available. Our certified color consultants make the process easy and enjoyable. We bring physical sample boards to your home, test colors under your specific lighting conditions throughout the day, and create a cohesive color scheme that ties your entire space together. Our consultation is complimentary with any painting project.',
    features: [
      'Certified color consultants with 10+ years experience',
      'In-home consultation with physical sample boards',
      'Lighting analysis: natural, artificial, morning to evening',
      'Complementary consultation with any painting project',
      'Full room color schemes with accent color options',
      'Exterior color palette for whole-home harmony',
      'Digital mockups and 3D renderings available',
      'Coordination with existing fixtures, flooring, and furniture',
    ],
    process: [
      { step: 'Discovery', description: 'We learn about your style preferences, existing decor, and the mood you want to create in each space.' },
      { step: 'Testing', description: 'Sample boards placed on your walls and evaluated under different lighting throughout the day.' },
      { step: 'Selection', description: 'Final color selections with a complete palette card showing all colors and their relationships.' },
      { step: 'Confidence', description: 'We apply test patches on your walls so you can live with the colors before we paint the full room.' },
    ],
    faq: [
      { question: 'Is the color consultation really free?', answer: 'Yes, it\'s complimentary when you book any painting project with us. Standalone consultations are available for a fee.' },
      { question: 'How long does a consultation take?', answer: 'Typically 1-2 hours for a full-home consultation. Single rooms take about 30-45 minutes.' },
      { question: 'Can you help with exterior colors?', answer: 'Absolutely! We specialize in creating exterior color schemes that complement your neighborhood and architecture.' },
      { question: 'What if I don\'t like the colors after they\'re applied?', answer: 'That\'s why we do test patches first. And if you\'re still unsure, we\'ll adjust at no extra charge during the project.' },
    ],
    cta: 'Let\'s Find Your Perfect Colors',
    relatedServices: ['interior-painting', 'exterior-painting', 'cabinet-refinishing'],
    avgPrice: 'Free with painting project',
    duration: '1-2 hours',
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return servicesData.find((s) => s.slug === slug);
}

export function getServiceIcon(slug: string) {
  return servicesData.find((s) => s.slug === slug)?.icon || PaintBucket;
}
