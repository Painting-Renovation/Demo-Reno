'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Briefcase,
  Clock,
  Users,
  PaintBucket,
  ArrowRight,
  X,
  Calendar,
  DollarSign,
  Filter,
  Sparkles,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Project {
  id: number;
  title: string;
  location: string;
  category: 'Residential' | 'Commercial' | 'Cabinet Refinishing';
  description: string;
  completionDate: string;
  projectValue: number;
  beforeImage: string;
  afterImage: string;
  tags: string[];
  rating: number;
  duration: string;
  teamSize: number;
  paintUsed: string;
}

// ─── Project Data ────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    id: 1,
    title: 'Modern Condo Full Refresh',
    location: 'Downtown Toronto',
    category: 'Residential',
    description:
      'Complete interior repaint of a 1,200 sq ft modern condo. Transformed the space with a warm neutral palette, accent walls in the living room, and crisp white trim throughout.',
    completionDate: '2024-11-15',
    projectValue: 4500,
    beforeImage: '/images/before-after.jpg',
    afterImage: '/images/hero-interior.jpg',
    tags: ['Interior', 'Modern', 'Accent Walls'],
    rating: 5.0,
    duration: '3 days',
    teamSize: 2,
    paintUsed: 'Benjamin Moore Regal Select (12 gal)',
  },
  {
    id: 2,
    title: 'Victorian Home Exterior Restoration',
    location: 'The Annex, Toronto',
    category: 'Residential',
    description:
      'Historic exterior restoration of a 3-storey Victorian home. Meticulous prep work including lead-safe paint removal, wood repair, and a historically accurate colour scheme.',
    completionDate: '2024-10-22',
    projectValue: 12800,
    beforeImage: '/images/hero-exterior.jpg',
    afterImage: '/images/service-painting.jpg',
    tags: ['Exterior', 'Heritage', 'Historic'],
    rating: 4.9,
    duration: '8 days',
    teamSize: 4,
    paintUsed: 'Sherwin-Williams SuperPaint (28 gal)',
  },
  {
    id: 3,
    title: 'Corporate Office Transformation',
    location: 'Financial District, Toronto',
    category: 'Commercial',
    description:
      'Full office repaint across 15,000 sq ft including open workspaces, 12 private offices, conference rooms, and common areas. Completed over weekends to minimize disruption.',
    completionDate: '2024-09-30',
    projectValue: 24500,
    beforeImage: '/images/commercial.jpg',
    afterImage: '/images/service-painting.jpg',
    tags: ['Commercial', 'Office', 'Low-VOC'],
    rating: 4.8,
    duration: '12 days',
    teamSize: 6,
    paintUsed: 'Dulux Diamond Eggshell (45 gal)',
  },
  {
    id: 4,
    title: 'Kitchen Cabinet Makeover',
    location: 'Mississauga',
    category: 'Cabinet Refinishing',
    description:
      'Full kitchen cabinet refinishing including 28 doors, 6 drawer fronts, and all exposed frames. Upgraded from dated oak to a sleek two-tone navy and cream finish.',
    completionDate: '2024-12-01',
    projectValue: 3200,
    beforeImage: '/images/cabinet-refinish.jpg',
    afterImage: '/images/hero-interior.jpg',
    tags: ['Cabinet', 'Kitchen', 'Two-Tone'],
    rating: 5.0,
    duration: '4 days',
    teamSize: 2,
    paintUsed: 'General Finishes Milk Paint (6 gal)',
  },
  {
    id: 5,
    title: 'Ranch Home Exterior & Fence',
    location: 'Markham',
    category: 'Residential',
    description:
      'Complete exterior repaint including siding, trim, front porch, and 120 ft of cedar fence. Durability-focused with premium exterior-grade coatings for long-lasting protection.',
    completionDate: '2024-08-18',
    projectValue: 8900,
    beforeImage: '/images/deck-fence.jpg',
    afterImage: '/images/hero-exterior.jpg',
    tags: ['Exterior', 'Fence', 'Eco-Friendly'],
    rating: 4.7,
    duration: '6 days',
    teamSize: 3,
    paintUsed: 'Benjamin Moore Aura Exterior (22 gal)',
  },
  {
    id: 6,
    title: 'Retail Store Brand Refresh',
    location: 'Yorkville, Toronto',
    category: 'Commercial',
    description:
      'High-end retail space repaint featuring a dramatic dark accent wall, metallic gold accents, and custom colour matching to brand guidelines. Night work to avoid business impact.',
    completionDate: '2024-11-05',
    projectValue: 7600,
    beforeImage: '/images/commercial.jpg',
    afterImage: '/images/hero-interior.jpg',
    tags: ['Commercial', 'Retail', 'Branding'],
    rating: 4.9,
    duration: '5 days',
    teamSize: 3,
    paintUsed: 'Farrow & Ball Estate Eggshell (14 gal)',
  },
  {
    id: 7,
    title: 'Bathroom Vanity & Cabinet Refinishing',
    location: 'Oakville',
    category: 'Cabinet Refinishing',
    description:
      'Transformed a dated bathroom vanity and built-in medicine cabinet with a modern sage green finish. Included new hardware installation and countertop coordination.',
    completionDate: '2024-12-10',
    projectValue: 1800,
    beforeImage: '/images/cabinet-refinish.jpg',
    afterImage: '/images/before-after.jpg',
    tags: ['Cabinet', 'Bathroom', 'Modern'],
    rating: 5.0,
    duration: '2 days',
    teamSize: 1,
    paintUsed: 'Benjamin Moore Advance Satin (3 gal)',
  },
  {
    id: 8,
    title: 'Townhouse Interior Accent Refresh',
    location: 'Liberty Village, Toronto',
    category: 'Residential',
    description:
      'Strategic accent wall installation across 3 floors of a modern townhouse. Bold yet balanced colour choices that flow naturally between living spaces and bedrooms.',
    completionDate: '2024-10-08',
    projectValue: 3800,
    beforeImage: '/images/hero-interior.jpg',
    afterImage: '/images/before-after.jpg',
    tags: ['Interior', 'Accent Walls', 'Modern'],
    rating: 4.8,
    duration: '3 days',
    teamSize: 2,
    paintUsed: 'Sherwin-Williams Emerald (10 gal)',
  },
  {
    id: 9,
    title: 'Restaurant Full Interior Overhaul',
    location: 'King West, Toronto',
    category: 'Commercial',
    description:
      'Complete interior repaint of a 4,500 sq ft restaurant including dining area, bar, kitchen ceilings, and washrooms. Used low-odour products to allow continued partial operation.',
    completionDate: '2024-07-20',
    projectValue: 15200,
    beforeImage: '/images/commercial.jpg',
    afterImage: '/images/service-painting.jpg',
    tags: ['Commercial', 'Restaurant', 'Low-Odour'],
    rating: 4.7,
    duration: '7 days',
    teamSize: 4,
    paintUsed: 'Dulux Professional (30 gal)',
  },
];

// ─── Category tabs ──────────────────────────────────────────────────────────

const categories = [
  'All Projects',
  'Residential',
  'Commercial',
  'Cabinet Refinishing',
] as const;

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'largest-budget', label: 'Largest Budget' },
] as const;

// ─── Category badge colour mapping ──────────────────────────────────────────

function getCategoryBadgeStyle(category: Project['category']) {
  switch (category) {
    case 'Residential':
      return 'bg-navy/90 text-white';
    case 'Commercial':
      return 'bg-gold/90 text-white';
    case 'Cabinet Refinishing':
      return 'bg-sage/90 text-white';
    default:
      return 'bg-navy/90 text-white';
  }
}

// ─── Star Rating Component ───────────────────────────────────────────────────

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const halfFilled = !filled && i < rating;
        return (
          <Star
            key={i}
            size={iconSize}
            className={
              filled
                ? 'fill-gold text-gold'
                : halfFilled
                  ? 'fill-gold/50 text-gold'
                  : 'fill-gray-200 text-gray-200'
            }
          />
        );
      })}
      <span className={`ml-1 font-semibold ${size === 'sm' ? 'text-xs' : 'text-sm'} text-navy`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function InteractiveShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('All Projects');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter + sort logic
  const filteredProjects = useMemo(() => {
    let filtered =
      activeCategory === 'All Projects'
        ? [...projects]
        : projects.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
        );
        break;
      case 'highest-rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'largest-budget':
        filtered.sort((a, b) => b.projectValue - a.projectValue);
        break;
    }

    return filtered;
  }, [activeCategory, sortBy]);

  // Category counts for tab badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Projects': projects.length };
    for (const p of projects) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <section className="relative bg-cream py-20 md:py-28 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(11,29,58,0.5) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-4 py-1.5 mb-5">
            <Briefcase className="w-4 h-4 text-navy" />
            <span className="text-navy text-sm font-medium">Our Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-3">
            Recent{' '}
            <span className="text-gradient-gold">Projects</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Browse our completed projects, filter by category, and see the
            transformations we deliver for homes and businesses across the GTA.
          </p>
        </motion.div>

        {/* ── Filter Bar ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10"
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0 mr-1" />
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'bg-navy text-white shadow-lg shadow-navy/20'
                        : 'bg-white text-gray-600 hover:bg-navy/5 hover:text-navy border border-gray-200'
                    }
                  `}
                >
                  {cat}
                  <span
                    className={`
                      ml-1.5 text-xs rounded-full px-1.5 py-0.5
                      ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
                    `}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200 text-sm rounded-full px-4">
              <Sparkles className="w-4 h-4 text-gold mr-1" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* ── Project Grid ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + sortBy}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                layout
                className="group relative"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                  {/* Hero Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.afterImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/10 to-transparent" />

                    {/* Category badge (top-left) */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={`${getCategoryBadgeStyle(project.category)} backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full border-0 shadow-sm`}
                      >
                        {project.category}
                      </Badge>
                    </div>

                    {/* Project value badge (top-right) */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        <DollarSign className="w-3 h-3" />
                        {project.projectValue.toLocaleString()}
                      </span>
                    </div>

                    {/* Before/After hint */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-1 bg-navy/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-navy font-bold text-base mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-1">
                      {project.title}
                    </h3>

                    {/* Star rating */}
                    <div className="mb-2">
                      <StarRating rating={project.rating} />
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium bg-cream text-navy/70 px-2.5 py-1 rounded-full border border-navy/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* View Details Button */}
                    <Button
                      onClick={() => setSelectedProject(project)}
                      variant="outline"
                      className="w-full border-navy/20 text-navy hover:bg-navy hover:text-white hover:border-navy font-semibold rounded-xl transition-all group/btn cursor-pointer"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No projects found in this category.</p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-500 mb-4 text-sm">
            Impressed? Let&apos;s discuss your project.
          </p>
          <Button
            className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-5 rounded-xl text-sm transition-all shadow-lg shadow-gold/20 hover:shadow-gold/40 cursor-pointer"
          >
            <Award className="w-4 h-4 mr-1" />
            Get Your Free Estimate
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* ── Project Detail Modal ──────────────────────────────────────── */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0 gap-0 rounded-2xl">
          {selectedProject && (
            <>
              {/* Modal Header Image */}
              <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedProject.afterImage}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <Badge
                    className={`${getCategoryBadgeStyle(selectedProject.category)} mb-2 text-xs font-semibold px-3 py-1 rounded-full border-0`}
                  >
                    {selectedProject.category}
                  </Badge>
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-3 mt-1.5 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedProject.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selectedProject.completionDate).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </DialogDescription>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Before / After Comparison */}
                <div className="mb-8">
                  <h3 className="text-navy font-bold text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    Before &amp; After
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-gray-800/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Before
                        </span>
                      </div>
                      <img
                        src={selectedProject.beforeImage}
                        alt={`${selectedProject.title} - Before`}
                        className="w-full h-48 sm:h-56 object-cover"
                      />
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-gold/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          After
                        </span>
                      </div>
                      <img
                        src={selectedProject.afterImage}
                        alt={`${selectedProject.title} - After`}
                        className="w-full h-48 sm:h-56 object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="mb-8">
                  <h3 className="text-navy font-bold text-lg mb-3">Project Details</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-cream rounded-xl p-4 text-center border border-navy/5">
                    <Clock className="w-5 h-5 text-gold mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                    <p className="text-navy font-bold text-sm">{selectedProject.duration}</p>
                  </div>
                  <div className="bg-cream rounded-xl p-4 text-center border border-navy/5">
                    <Users className="w-5 h-5 text-gold mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500 mb-0.5">Team Size</p>
                    <p className="text-navy font-bold text-sm">{selectedProject.teamSize} painters</p>
                  </div>
                  <div className="bg-cream rounded-xl p-4 text-center border border-navy/5">
                    <PaintBucket className="w-5 h-5 text-gold mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500 mb-0.5">Paint Used</p>
                    <p className="text-navy font-bold text-sm">{selectedProject.paintUsed}</p>
                  </div>
                  <div className="bg-cream rounded-xl p-4 text-center border border-navy/5">
                    <Star className="w-5 h-5 text-gold mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500 mb-0.5">Customer Rating</p>
                    <p className="text-navy font-bold text-sm">
                      <StarRating rating={selectedProject.rating} size="sm" />
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-navy/15 text-navy bg-cream text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Location Map Placeholder */}
                <div className="mb-8">
                  <h3 className="text-navy font-bold text-lg mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold" />
                    Location
                  </h3>
                  <div className="map-placeholder rounded-xl h-36 flex items-center justify-center">
                    <div className="relative z-10 text-center">
                      <MapPin className="w-8 h-8 text-gold mx-auto mb-1.5" />
                      <p className="text-white font-semibold text-sm">{selectedProject.location}</p>
                      <p className="text-white/50 text-xs">Greater Toronto Area</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-navy rounded-xl p-6 sm:p-8 text-center">
                  <h3 className="text-white font-bold text-lg mb-2">
                    Love This Transformation?
                  </h3>
                  <p className="text-white/60 text-sm mb-4 max-w-md mx-auto">
                    Get similar results for your own space. Free estimates with no obligation.
                  </p>
                  <Button className="bg-gold hover:bg-gold-light text-white font-semibold px-8 py-5 rounded-xl text-sm transition-all shadow-lg shadow-gold/30 hover:shadow-gold/50 cursor-pointer">
                    Get Similar Results
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
