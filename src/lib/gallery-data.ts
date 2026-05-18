export type Category = 'All' | 'Interior' | 'Exterior' | 'Cabinets' | 'Deck';

export interface GalleryItem {
  id: number;
  title: string;
  location: string;
  category: Category;
  beforeImage: string;
  afterImage: string;
  description: string;
  span?: 'tall' | 'wide' | 'normal';
}

export const galleryItems: GalleryItem[] = [
  // ─── Interior ───────────────────────────────────────────────
  {
    id: 1,
    title: 'Living Room Complete Gut',
    location: 'Downtown Toronto',
    category: 'Interior',
    beforeImage: '/images/gallery/interior-living-room-before.webp',
    afterImage: '/images/gallery/interior-living-room-after.webp',
    description: 'Full interior gut of a living room including drywall removal, ceiling tear-down, and carpet extraction. Exposed studs and clean subfloor ready for renovation.',
    span: 'tall',
  },
  {
    id: 2,
    title: 'Kitchen Strip-Out',
    location: 'North York',
    category: 'Interior',
    beforeImage: '/images/gallery/interior-kitchen-before.webp',
    afterImage: '/images/gallery/interior-kitchen-after.webp',
    description: 'Complete kitchen demolition — cabinets, countertops, appliances, flooring, and wall finishes all removed down to the bare framing and concrete subfloor.',
    span: 'wide',
  },
  {
    id: 3,
    title: 'Bathroom Full Demo',
    location: 'Etobicoke',
    category: 'Interior',
    beforeImage: '/images/gallery/interior-bathroom-before.webp',
    afterImage: '/images/gallery/interior-bathroom-after.webp',
    description: 'Total bathroom gut including tile removal, fixture extraction, and wall stripping. Clean shell with exposed plumbing ready for a complete remodel.',
    span: 'normal',
  },
  // ─── Exterior ───────────────────────────────────────────────
  {
    id: 4,
    title: 'House Exterior Siding Removal',
    location: 'Scarborough',
    category: 'Exterior',
    beforeImage: '/images/gallery/exterior-house-before.webp',
    afterImage: '/images/gallery/exterior-house-after.webp',
    description: 'Complete exterior siding removal and site prep. Old damaged vinyl stripped, house wrap installed, yard cleared and graded for the renovation phase.',
    span: 'tall',
  },
  {
    id: 5,
    title: 'Detached Garage Demolition',
    location: 'Mississauga',
    category: 'Exterior',
    beforeImage: '/images/gallery/exterior-garage-before.webp',
    afterImage: '/images/gallery/exterior-garage-after.webp',
    description: 'Full garage demolition and debris removal. Dilapidated structure safely taken down, leaving a clean concrete slab and graded lot.',
    span: 'normal',
  },
  {
    id: 6,
    title: 'Commercial Facade Strip',
    location: 'Markham',
    category: 'Exterior',
    beforeImage: '/images/gallery/exterior-commercial-before.webp',
    afterImage: '/images/gallery/exterior-commercial-after.webp',
    description: 'Commercial building facade demolition including old signage, awnings, and stucco removal. Structure exposed and site secured for rebuild.',
    span: 'wide',
  },
  // ─── Cabinets ───────────────────────────────────────────────
  {
    id: 7,
    title: 'Kitchen Cabinet Removal',
    location: 'Richmond Hill',
    category: 'Cabinets',
    beforeImage: '/images/gallery/cabinets-kitchen-before.webp',
    afterImage: '/images/gallery/cabinets-kitchen-after.webp',
    description: 'Complete upper and lower kitchen cabinet extraction. All cabinetry, countertops, and hardware removed cleanly, exposing wall studs and plumbing.',
    span: 'wide',
  },
  {
    id: 8,
    title: 'Bathroom Vanity Tear-Out',
    location: 'Vaughan',
    category: 'Cabinets',
    beforeImage: '/images/gallery/cabinets-vanity-before.webp',
    afterImage: '/images/gallery/cabinets-vanity-after.webp',
    description: 'Bathroom vanity and medicine cabinet removal. Old fixtures extracted, plumbing capped neatly, and wall prepped for new installation.',
    span: 'normal',
  },
  // ─── Deck ───────────────────────────────────────────────────
  {
    id: 9,
    title: 'Backyard Deck Removal',
    location: 'Brampton',
    category: 'Deck',
    beforeImage: '/images/gallery/deck-before.webp',
    afterImage: '/images/gallery/deck-after.webp',
    description: 'Complete deck demolition including all decking boards, railings, and support posts. Debris cleared, yard graded, and site left clean.',
    span: 'tall',
  },
  {
    id: 10,
    title: 'Front Porch Demolition',
    location: 'Oakville',
    category: 'Deck',
    beforeImage: '/images/gallery/porch-before.webp',
    afterImage: '/images/gallery/porch-after.webp',
    description: 'Full concrete porch and step demolition. Crumbling structure safely removed, ground graded smooth, and foundation prepped for new construction.',
    span: 'normal',
  },
];

export const categories: Category[] = ['All', 'Interior', 'Exterior', 'Cabinets', 'Deck'];

export function getCategoryCounts(): Record<Category, number> {
  return {
    All: galleryItems.length,
    Interior: galleryItems.filter(i => i.category === 'Interior').length,
    Exterior: galleryItems.filter(i => i.category === 'Exterior').length,
    Cabinets: galleryItems.filter(i => i.category === 'Cabinets').length,
    Deck: galleryItems.filter(i => i.category === 'Deck').length,
  };
}
