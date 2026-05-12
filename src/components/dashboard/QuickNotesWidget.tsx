'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Plus, X, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- Types ---
interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  rotation: number;
  createdAt: string;
}

type NoteColor = 'yellow' | 'blue' | 'green' | 'pink';

const colorClasses: Record<NoteColor, { bg: string; border: string; header: string }> = {
  yellow: { bg: 'bg-amber-50', border: 'border-amber-200', header: 'text-amber-800' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'text-blue-800' },
  green: { bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'text-emerald-800' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', header: 'text-pink-800' },
};

const colorPickerClasses: Record<NoteColor, string> = {
  yellow: 'bg-amber-300 border-amber-400',
  blue: 'bg-blue-300 border-blue-400',
  green: 'bg-emerald-300 border-emerald-400',
  pink: 'bg-pink-300 border-pink-400',
};

const defaultNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Follow Up',
    content: 'Follow up with Sarah about kitchen repaint quote. She seemed interested.',
    color: 'yellow',
    rotation: -1.2,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Paint Order',
    content: 'Order Benjamin Moore Advance for Chen project. Colour: Cloud White OC-130, satin finish.',
    color: 'blue',
    rotation: 1.5,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'note-3',
    title: 'Team Meeting',
    content: 'Schedule team meeting for Monday. Review Q2 schedule and upcoming projects.',
    color: 'green',
    rotation: -0.8,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'note-4',
    title: 'Delivery Status',
    content: 'Check paint delivery status from Dulux. Expected Thursday.',
    color: 'pink',
    rotation: 2.0,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'note-5',
    title: 'Thank You',
    content: 'Send thank-you email to Williams for the referral. Mention the discount offer.',
    color: 'yellow',
    rotation: -1.8,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'note-6',
    title: 'Q4 Targets',
    content: 'Review Q4 revenue targets. Current run rate: $42k/month. Target: $50k.',
    color: 'blue',
    rotation: 0.6,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];

const STORAGE_KEY = 'procoat-quick-notes';
const colorCycle: NoteColor[] = ['yellow', 'blue', 'green', 'pink'];

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return defaultNotes;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return defaultNotes;
}

// --- Component ---
export function QuickNotesWidget() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  // Persist notes to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore storage errors
    }
  }, [notes]);

  const addNote = useCallback(() => {
    const nextColor = colorCycle[notes.length % colorCycle.length];
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      color: nextColor,
      rotation: (Math.random() - 0.5) * 4,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  }, [notes.length]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const updateNote = useCallback((id: string, field: 'title' | 'content', value: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n))
    );
  }, []);

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-gold" />
            <CardTitle className="text-base font-semibold text-navy">Quick Notes</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-gold hover:text-gold/80" onClick={addNote}>
            <Plus className="h-3.5 w-3.5" /> Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {notes.map((note) => {
                const cc = colorClasses[note.color];
                return (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85, rotate: note.rotation }}
                    animate={{ opacity: 1, scale: 1, rotate: note.rotation }}
                    exit={{ opacity: 0, scale: 0.85, rotate: note.rotation }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={cn(
                      'group relative rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow min-h-[110px] cursor-default',
                      cc.bg,
                      cc.border
                    )}
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20"
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </button>

                    {/* Title */}
                    <textarea
                      value={note.title}
                      onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                      className={cn(
                        'w-full bg-transparent border-none outline-none resize-none font-semibold text-sm leading-tight',
                        cc.header
                      )}
                      rows={1}
                      onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = 'auto';
                        el.style.height = el.scrollHeight + 'px';
                      }}
                    />

                    {/* Content */}
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, 'content', e.target.value)}
                      placeholder="Write something..."
                      className="w-full bg-transparent border-none outline-none resize-none text-xs text-gray-600 leading-relaxed mt-1"
                      rows={3}
                    />

                    {/* Date */}
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {notes.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No notes yet. Click &quot;Add Note&quot; to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
