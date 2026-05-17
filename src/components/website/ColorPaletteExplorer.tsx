'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Search,
  Layers,
  Eye,
  GitCompareArrows,
  X,
  Paintbrush,
  ArrowRight,
  Home,
  Bed,
  Bath,
  Sofa,
  UtensilsCrossed,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

// ── Types ───────────────────────────────────────────────────────────────────

type Category =
  | 'neutrals'
  | 'warm'
  | 'cool'
  | 'bold'
  | 'pastels'
  | 'trending';

interface PaintColor {
  id: string;
  name: string;
  hex: string;
  category: Category;
  rooms: string[];
  trending?: boolean;
}

interface CategoryConfig {
  label: string;
  emoji: string;
}

// ── Category Definitions ────────────────────────────────────────────────────

const categories: { key: Category; config: CategoryConfig }[] = [
  { key: 'neutrals', config: { label: 'Neutrals', emoji: '⚪' } },
  { key: 'warm', config: { label: 'Warm Tones', emoji: '🧡' } },
  { key: 'cool', config: { label: 'Cool Tones', emoji: '💙' } },
  { key: 'bold', config: { label: 'Bold & Rich', emoji: '🖤' } },
  { key: 'pastels', config: { label: 'Pastels', emoji: '🌸' } },
  { key: 'trending', config: { label: 'Trending 2024', emoji: '✨' } },
];

// ── Room Icon Map ───────────────────────────────────────────────────────────

const roomIcons: Record<string, typeof Home> = {
  'Living Room': Sofa,
  'Bedroom': Bed,
  'Bathroom': Bath,
  'Kitchen': UtensilsCrossed,
  'Dining Room': UtensilsCrossed,
  'Office': Sofa,
  'Nursery': Bed,
  'Entryway': Home,
  'Hallway': Home,
};

// ── Color Data (24 colors, 4 per category) ─────────────────────────────────

const paintColors: PaintColor[] = [
  // Neutrals
  { id: 'n1', name: 'Simply White', hex: '#F8F5F1', category: 'neutrals', rooms: ['Living Room', 'Bedroom', 'Hallway'] },
  { id: 'n2', name: 'Chantilly Lace', hex: '#EDEBE8', category: 'neutrals', rooms: ['Kitchen', 'Bathroom', 'Entryway'] },
  { id: 'n3', name: 'Revere Pewter', hex: '#9A968F', category: 'neutrals', rooms: ['Living Room', 'Bedroom', 'Office'] },
  { id: 'n4', name: 'Agreeable Gray', hex: '#605C56', category: 'neutrals', rooms: ['Living Room', 'Bedroom', 'Hallway'] },
  { id: 'n5', name: 'White Dove', hex: '#F5F2ED', category: 'neutrals', rooms: ['Kitchen', 'Bathroom', 'Nursery'] },

  // Warm Tones
  { id: 'w1', name: 'Caliente', hex: '#A83232', category: 'warm', rooms: ['Dining Room', 'Living Room'] },
  { id: 'w2', name: 'Autumn Sunset', hex: '#CC7A3E', category: 'warm', rooms: ['Living Room', 'Kitchen', 'Entryway'] },
  { id: 'w3', name: 'Golden Straw', hex: '#D4A84B', category: 'warm', rooms: ['Kitchen', 'Dining Room'] },
  { id: 'w4', name: 'Rosemary', hex: '#C26B6B', category: 'warm', rooms: ['Bedroom', 'Nursery'] },
  { id: 'w5', name: 'Terra Rosa', hex: '#B85C4A', category: 'warm', rooms: ['Living Room', 'Entryway'] },

  // Cool Tones
  { id: 'c1', name: 'Hale Navy', hex: '#263238', category: 'cool', rooms: ['Bedroom', 'Office', 'Living Room'] },
  { id: 'c2', name: 'Palladian Blue', hex: '#6A8B9A', category: 'cool', rooms: ['Bedroom', 'Bathroom', 'Nursery'] },
  { id: 'c3', name: 'Sea Salt', hex: '#A6B5C1', category: 'cool', rooms: ['Bathroom', 'Kitchen', 'Bedroom'] },
  { id: 'c4', name: 'Kendall Charcoal', hex: '#4A5D5C', category: 'cool', rooms: ['Office', 'Entryway', 'Hallway'] },
  { id: 'c5', name: 'Ice Mist', hex: '#D0DDE4', category: 'cool', rooms: ['Bathroom', 'Nursery', 'Kitchen'] },

  // Bold & Rich
  { id: 'b1', name: 'Midnight Blue', hex: '#1A2940', category: 'bold', rooms: ['Bedroom', 'Office'] },
  { id: 'b2', name: 'Burgundy Wine', hex: '#5C1A2A', category: 'bold', rooms: ['Dining Room', 'Living Room'] },
  { id: 'b3', name: 'Hunter Green', hex: '#2D4A3E', category: 'bold', rooms: ['Office', 'Library', 'Entryway'] },
  { id: 'b4', name: 'Plum Royale', hex: '#4A2040', category: 'bold', rooms: ['Bedroom', 'Dining Room'] },
  { id: 'b5', name: 'Deep Charcoal', hex: '#2E2E2E', category: 'bold', rooms: ['Office', 'Entryway', 'Living Room'] },

  // Pastels
  { id: 'p1', name: 'Pink Bliss', hex: '#F2C4C8', category: 'pastels', rooms: ['Nursery', 'Bedroom', 'Bathroom'] },
  { id: 'p2', name: 'Lavender Mist', hex: '#C8B8D8', category: 'pastels', rooms: ['Bedroom', 'Nursery', 'Bathroom'] },
  { id: 'p3', name: 'Mint Julep', hex: '#B8D4C8', category: 'pastels', rooms: ['Kitchen', 'Bathroom', 'Bedroom'] },
  { id: 'p4', name: 'Pale Peach', hex: '#F2D8C0', category: 'pastels', rooms: ['Nursery', 'Bedroom', 'Living Room'] },
  { id: 'p5', name: 'Baby Blue', hex: '#C4D8E8', category: 'pastels', rooms: ['Nursery', 'Bathroom', 'Bedroom'] },

  // Trending 2024
  { id: 't1', name: 'Blue Nova', hex: '#3D5A80', category: 'trending', trending: true, rooms: ['Living Room', 'Bedroom', 'Office'] },
  { id: 't2', name: 'Peach Fuzz', hex: '#FFBE98', category: 'trending', trending: true, rooms: ['Bedroom', 'Nursery', 'Living Room'] },
  { id: 't3', name: 'Cracked Pepper', hex: '#3E3E3E', category: 'trending', trending: true, rooms: ['Kitchen', 'Entryway', 'Office'] },
  { id: 't4', name: 'Upward', hex: '#D6CFC7', category: 'trending', trending: true, rooms: ['Living Room', 'Bedroom', 'Hallway'] },
  { id: 't5', name: 'Canyon Dusk', hex: '#9B6E5B', category: 'trending', trending: true, rooms: ['Living Room', 'Dining Room', 'Bedroom'] },
];

// ── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

// ── Helper: Determine text color contrast ───────────────────────────────────

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1A1A1A' : '#FFFFFF';
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ColorCard({
  color,
  isFavorite,
  onToggleFavorite,
  onCompareToggle,
  compareSelected,
  onViewInRoom,
}: {
  color: PaintColor;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCompareToggle: () => void;
  compareSelected: boolean;
  onViewInRoom: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const textColor = getContrastColor(color.hex);

  const handleCopyHex = () => {
    navigator.clipboard.writeText(color.hex).catch(() => {/* ignore */});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Color Swatch */}
      <div
        className="relative h-[140px] cursor-pointer transition-all duration-300 group-hover:h-[150px]"
        style={{
          backgroundColor: color.hex,
          boxShadow: compareSelected
            ? `0 0 0 3px #C8973E, inset 0 4px 12px rgba(0,0,0,0.15)`
            : 'inset 0 4px 12px rgba(0,0,0,0.1)',
        }}
        onClick={onViewInRoom}
      >
        {/* Trending badge */}
        {color.trending && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-navy px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            ✨ Trending
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer shadow-sm"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4.5 h-4.5 transition-all duration-200 ${
              isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-500'
            }`}
          />
        </button>

        {/* Hover overlay actions */}
        <motion.div
          initial={false}
          animate={{ opacity: compareSelected ? 1 : undefined }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle();
              }}
              className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 cursor-pointer ${
                compareSelected
                  ? 'bg-gold text-white shadow-lg'
                  : 'bg-white/80 text-navy hover:bg-white hover:scale-110'
              }`}
              aria-label="Compare color"
            >
              <GitCompareArrows className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyHex();
              }}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-navy hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer"
              aria-label="Copy hex code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewInRoom();
              }}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-navy hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer"
              aria-label="View in room"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Compare selected indicator */}
        <AnimatePresence>
          {compareSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute bottom-3 left-3 bg-gold text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md"
            >
              Selected
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="font-bold text-navy text-sm mb-0.5 truncate group-hover:text-gold transition-colors duration-300">
          {color.name}
        </h3>
        <button
          onClick={handleCopyHex}
          className="text-xs text-gray-400 font-mono hover:text-gold transition-colors duration-200 flex items-center gap-1 cursor-pointer"
        >
          {color.hex.toUpperCase()}
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>

        {/* Room suggestions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {color.rooms.slice(0, 3).map((room) => {
            const RoomIcon = roomIcons[room] || Home;
            return (
              <span
                key={room}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
              >
                <RoomIcon className="w-2.5 h-2.5" />
                {room}
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ComparePanel({
  colors,
  onRemove,
  onClose,
  onGetEstimate,
}: {
  colors: PaintColor[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onGetEstimate: () => void;
}) {
  if (colors.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitCompareArrows className="w-5 h-5 text-gold" />
              <h3 className="font-bold text-navy text-sm">
                Compare Colors ({colors.length}/4)
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close compare panel"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="flex gap-3">
            {colors.map((color) => (
              <div
                key={color.id}
                className="relative flex-1 group/swatch"
              >
                <div
                  className="h-16 md:h-20 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.12)',
                  }}
                />
                <p className="text-xs font-semibold text-navy mt-2 truncate text-center">
                  {color.name}
                </p>
                <p className="text-[10px] text-gray-400 font-mono text-center">
                  {color.hex.toUpperCase()}
                </p>
                <button
                  onClick={() => onRemove(color.id)}
                  className="absolute -top-2 -right-2 w-7 h-7 min-w-[44px] min-h-[44px] rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer opacity-100 sm:opacity-0 sm:group-hover/swatch:opacity-100"
                  aria-label={`Remove ${color.name}`}
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))}

            {/* Empty slot placeholders */}
            {Array.from({ length: 4 - colors.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex-1">
                <div className="h-16 md:h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-gray-300 text-xs">+</span>
                </div>
                <p className="text-xs text-gray-300 mt-2 text-center">Empty</p>
              </div>
            ))}
          </div>

          {colors.length >= 2 && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={onGetEstimate}
                className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-gold/20"
              >
                Get This Color
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RoomPreviewModal({
  color,
  onClose,
}: {
  color: PaintColor;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-md" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full sm:max-w-2xl max-h-[90dvh] sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-2xl bg-white shadow-2xl rounded-b-none sm:rounded-b-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-navy text-lg">{color.name}</h3>
            <p className="text-sm text-gray-400 font-mono">{color.hex.toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Room Mockup */}
        <div className="relative mx-4 sm:mx-6 mt-4 rounded-xl overflow-hidden">
          {/* Simple room using CSS - back wall, side walls, ceiling, floor */}
          <div
            className="relative w-full aspect-[16/10] overflow-hidden"
            style={{
              background: `
                /* Ceiling */
                linear-gradient(to bottom, #E8E4E0 0%, #E8E4E0 15%,
                /* Back wall */
                ${color.hex} 15%, ${color.hex} 60%,
                /* Floor */
                #B8956A 60%, #A07850 100%)
              `,
            }}
          >
            {/* Left wall - slightly darker */}
            <div
              className="absolute top-[15%] left-0 bottom-[40%] w-[25%]"
              style={{
                background: `linear-gradient(to right, rgba(0,0,0,0.12), ${color.hex})`,
              }}
            />

            {/* Right wall - slightly darker */}
            <div
              className="absolute top-[15%] right-0 bottom-[40%] w-[25%]"
              style={{
                background: `linear-gradient(to left, rgba(0,0,0,0.12), ${color.hex})`,
              }}
            />

            {/* Floor shadow */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[40%]"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0) 30%, transparent 50%)`,
              }}
            />

            {/* Window */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[28%] h-[35%]">
              <div className="w-full h-full bg-gradient-to-b from-[#87CEEB] to-[#B0D4E8] rounded-sm shadow-inner border-2 border-white">
                {/* Window cross */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[2px] bg-white/80" />
                  <div className="absolute w-[2px] h-full bg-white/80" />
                </div>
                {/* Light reflection */}
                <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-white/30 rounded-sm rotate-12" />
              </div>
              {/* Window frame shadow */}
              <div className="absolute -inset-2 border-2 border-gray-300 rounded-sm" />
            </div>

            {/* Baseboard */}
            <div className="absolute bottom-[40%] left-0 right-0 h-[3px] bg-white/60" />

            {/* "Painted Wall" label */}
            <div className="absolute bottom-[44%] right-4 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {color.name}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-5">
          <p className="text-sm text-gray-500 mb-4">
            Visualize how <span className="font-semibold text-navy">{color.name}</span> looks in a room setting. For an accurate match, order a physical sample.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {color.rooms.map((room) => {
              const RoomIcon = roomIcons[room] || Home;
              return (
                <span
                  key={room}
                  className="inline-flex items-center gap-1 text-xs font-medium text-sage bg-sage/10 px-3 py-1 rounded-full"
                >
                  <RoomIcon className="w-3 h-3" />
                  Perfect for: {room}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function ColorPaletteExplorer() {
  const { setEstimateFormOpen } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<Category>('neutrals');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [compareMode, setCompareMode] = useState(false);
  const [roomPreview, setRoomPreview] = useState<PaintColor | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filter colors by category, search, and favorites
  const filteredColors = useMemo(() => {
    return paintColors.filter((color) => {
      const matchesCategory = color.category === activeCategory;
      const matchesSearch = searchQuery
        ? color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          color.hex.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesFavorites = showFavoritesOnly ? favorites.has(color.id) : true;
      return matchesCategory && matchesSearch && matchesFavorites;
    });
  }, [activeCategory, searchQuery, favorites, showFavoritesOnly]);

  const compareColors = useMemo(() => {
    return paintColors.filter((c) => compareIds.has(c.id));
  }, [compareIds]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCompare = (id: string) => {
    if (!compareMode) {
      setCompareMode(true);
    }
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (next.size === 0) setCompareMode(false);
      } else {
        if (next.size >= 4) return prev; // Max 4
        next.add(id);
      }
      return next;
    });
  };

  const clearCompare = () => {
    setCompareIds(new Set());
    setCompareMode(false);
  };

  return (
    <section id="color-palette" className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(11,29,58,0.3) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.06] rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/[0.04] rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-4 py-1.5 mb-5">
            <Paintbrush className="w-4 h-4 text-gold" />
            <span className="text-navy text-sm font-medium">Color Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mt-3 mb-4 text-balance">
            Explore Our Color Collection
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Find the perfect shade for your space
          </p>
          {/* Decorative underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-20 h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mx-auto mt-6"
          />
        </motion.div>

        {/* Toolbar: Search + Toggle buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search colors by name or hex code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-navy'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-red-500' : ''}`} />
              Favorites ({favorites.size})
            </button>

            <button
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) clearCompare();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                compareMode
                  ? 'bg-gold/10 text-gold border border-gold/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-navy'
              }`}
            >
              <GitCompareArrows className="w-4 h-4" />
              Compare {compareIds.size > 0 && `(${compareIds.size})`}
            </button>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-nowrap justify-start sm:justify-center gap-1 mb-8 sm:mb-10 relative overflow-x-auto px-4 sm:px-0 scrollbar-hide"
        >
          {categories.map(({ key, config }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === key
                  ? 'text-white shadow-lg shadow-navy/20'
                  : 'text-gray-600 hover:text-navy hover:bg-white hover:shadow-sm'
              }`}
            >
              {activeCategory === key && (
                <motion.div
                  layoutId="activeColorCategory"
                  className="absolute inset-0 bg-navy rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{config.emoji}</span>
                {config.label}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Compare mode banner */}
        <AnimatePresence>
          {compareMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gold/5 border border-gold/20 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-navy/80">
                  <GitCompareArrows className="w-4 h-4 inline mr-1.5 text-gold" />
                  <span className="font-semibold">Compare mode</span> — Select up to 4 colors to compare side by side
                  {compareIds.size > 0 && (
                    <span className="ml-2 text-gold font-bold">({compareIds.size}/4 selected)</span>
                  )}
                </p>
                {compareIds.size > 0 && (
                  <button
                    onClick={clearCompare}
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Color Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${showFavoritesOnly}-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5"
          >
            {filteredColors.map((color) => (
              <ColorCard
                key={color.id}
                color={color}
                isFavorite={favorites.has(color.id)}
                onToggleFavorite={() => toggleFavorite(color.id)}
                onCompareToggle={() => toggleCompare(color.id)}
                compareSelected={compareIds.has(color.id)}
                onViewInRoom={() => setRoomPreview(color)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredColors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-400 text-lg font-medium">No colors found</p>
            <p className="text-gray-300 text-sm mt-1">
              {showFavoritesOnly
                ? "You haven't favorited any colors yet"
                : 'Try a different search term or category'}
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => setEstimateFormOpen(true)}
            className="bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-navy/20"
          >
            Get a Free Color Consultation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-gray-400 mt-3">
            Not sure which color to choose? Our experts will help you pick the perfect shade.
          </p>
        </motion.div>
      </div>

      {/* Compare Panel (glass-morphism floating) */}
      <AnimatePresence>
        {compareMode && compareIds.size > 0 && (
          <ComparePanel
            colors={compareColors}
            onRemove={(id) => {
              setCompareIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                if (next.size === 0) setCompareMode(false);
                return next;
              });
            }}
            onClose={clearCompare}
            onGetEstimate={() => setEstimateFormOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Room Preview Modal */}
      <AnimatePresence>
        {roomPreview && (
          <RoomPreviewModal
            color={roomPreview}
            onClose={() => setRoomPreview(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
