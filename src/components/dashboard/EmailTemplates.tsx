'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Copy,
  Eye,
  Pencil,
  MoreHorizontal,
  Send,
  FileText,
  CalendarCheck,
  Heart,
  RotateCcw,
  Megaphone,
  Plus,
  Sparkles,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  category: 'transactional' | 'follow-up' | 'marketing';
  lastUsed: string;
  usageCount: number;
  isSystem: boolean;
}

const initialTemplates: EmailTemplate[] = [
  {
    id: 't1',
    name: 'New Lead Welcome',
    description: 'Sent when a lead first submits an inquiry',
    subject: 'Welcome to ProCoat Painters, {{firstName}}!',
    body: 'Hi {{firstName}},\n\nThank you for reaching out to ProCoat Painters! We\'re excited to learn more about your painting project.\n\nWe received your inquiry about {{service}} and would love to discuss your vision. Our team will review your request and get back to you within 24 hours.\n\nIn the meantime, feel free to browse our portfolio at procoatpainters.com/gallery or check out our recent customer reviews.\n\nLooking forward to transforming your space!\n\nBest regards,\nThe ProCoat Painters Team',
    category: 'transactional',
    lastUsed: '2024-12-01',
    usageCount: 156,
    isSystem: true,
  },
  {
    id: 't2',
    name: 'Estimate Follow-up',
    description: 'Sent after providing an estimate to a lead',
    subject: 'Your ProCoat Painters Estimate is Ready, {{firstName}}',
    body: 'Hi {{firstName}},\n\nThank you for your interest in ProCoat Painters! Attached you\'ll find our detailed estimate for your {{service}} project.\n\nHere\'s a quick summary:\n• Project scope as discussed\n• Materials: Premium Benjamin Moore paints\n• Estimated timeline: 3-5 business days\n• Our satisfaction guarantee included\n\nWe\'d love to answer any questions you have. Feel free to reply to this email or give us a call at (416) 555-0123.\n\nWe look forward to working with you!\n\nBest,\nThe ProCoat Painters Team',
    category: 'follow-up',
    lastUsed: '2024-11-30',
    usageCount: 98,
    isSystem: true,
  },
  {
    id: 't3',
    name: 'Appointment Confirmation',
    description: 'Confirms a scheduled appointment with the lead',
    subject: 'Appointment Confirmed — {{date}}',
    body: 'Hi {{firstName}},\n\nGreat news! Your appointment with ProCoat Painters has been confirmed.\n\n📅 Date: {{date}}\n🕐 Time: 10:00 AM\n📍 Location: As discussed\n\nWhat to expect:\n• Our team will arrive on time\n• We\'ll assess the project area and discuss options\n• You\'ll receive color samples and material recommendations\n• We\'ll provide an accurate timeline and any updates\n\nIf you need to reschedule, please let us know at least 24 hours in advance.\n\nSee you soon!\nThe ProCoat Painters Team',
    category: 'transactional',
    lastUsed: '2024-11-29',
    usageCount: 87,
    isSystem: true,
  },
  {
    id: 't4',
    name: 'Thank You After Project',
    description: 'Post-project thank you with review request',
    subject: 'Thank You, {{firstName}}! How Did We Do?',
    body: 'Hi {{firstName}},\n\nWe hope you\'re enjoying your freshly painted space! Thank you for choosing ProCoat Painters for your {{service}} project.\n\nWe take great pride in our work and your satisfaction is our top priority. We\'d be incredibly grateful if you could take a moment to share your experience:\n\n⭐ Leave a Google Review: [Review Link]\n⭐ Share on Facebook: [Share Link]\n\nYour feedback helps other homeowners find reliable painting professionals and means the world to our small team.\n\nDon\'t forget — we offer a 2-year warranty on all our work. If you notice anything that needs attention, don\'t hesitate to reach out.\n\nWarm regards,\nThe ProCoat Painters Team',
    category: 'follow-up',
    lastUsed: '2024-11-28',
    usageCount: 72,
    isSystem: true,
  },
  {
    id: 't5',
    name: 'Re-engagement',
    description: 'For cold leads (30+ days no contact)',
    subject: 'Still thinking about that painting project, {{firstName}}?',
    body: 'Hi {{firstName}},\n\nIt\'s been a while since we last chatted about your {{service}} project, and we wanted to check in.\n\nWe\'ve recently completed several projects in your area and the results have been stunning! If you\'re still considering a refresh, now might be a great time.\n\n🎤 Limited Time Offer: Book before the end of the month and receive:\n• 15% off your project total\n• Free color consultation (value $150)\n• Priority scheduling\n\nNo pressure at all — just wanted to keep you in the loop. If now\'s not the right time, that\'s perfectly okay too.\n\nBest regards,\nThe ProCoat Painters Team',
    category: 'marketing',
    lastUsed: '2024-11-25',
    usageCount: 45,
    isSystem: true,
  },
  {
    id: 't6',
    name: 'Seasonal Promotion',
    description: 'For marketing campaigns and seasonal offers',
    subject: '🎉 Spring Refresh Special — 20% Off Interior Painting!',
    body: 'Hi {{firstName}},\n\nSpring is the perfect time for a fresh start — and a fresh coat of paint! 🌷\n\nProCoat Painters is excited to announce our Spring Refresh Special:\n\n✨ 20% OFF all interior painting projects\n✨ Free accent wall with any full-room project\n✨ Flexible scheduling — evenings & weekends available\n\nWhy ProCoat Painters?\n• 10+ years of experience\n• Premium Benjamin Moore & Sherwin-Williams paints\n• 2-year satisfaction guarantee\n• 5-star rated on Google\n\n📅 Offer valid through April 30th — book your free estimate today!\n\nReply to this email or call (416) 555-0123 to get started.\n\nThe ProCoat Painters Team\nTransforming houses into homes 🏠',
    category: 'marketing',
    lastUsed: '2024-11-20',
    usageCount: 210,
    isSystem: true,
  },
];

const categoryConfig: Record<string, { color: string; label: string }> = {
  transactional: { color: 'bg-blue-100 text-blue-800', label: 'Transactional' },
  'follow-up': { color: 'bg-amber-100 text-amber-800', label: 'Follow-up' },
  marketing: { color: 'bg-emerald-100 text-emerald-800', label: 'Marketing' },
};

const categoryIcons: Record<string, React.ElementType> = {
  transactional: FileText,
  'follow-up': CalendarCheck,
  marketing: Megaphone,
};

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Editor form
  const [editForm, setEditForm] = useState({
    name: '',
    subject: '',
    body: '',
    category: 'transactional' as EmailTemplate['category'],
  });

  const filtered = categoryFilter === 'all'
    ? templates
    : templates.filter(t => t.category === categoryFilter);

  const openPreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const openEditor = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      category: template.category,
    });
    setEditorOpen(true);
  };

  const handleDuplicate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `t${Date.now()}`,
      name: `${template.name} (Copy)`,
      lastUsed: 'Never',
      usageCount: 0,
      isSystem: false,
    };
    setTemplates([...templates, newTemplate]);
    toast({ title: 'Template duplicated', description: `"${template.name}" has been copied.` });
  };

  const handleSaveEdit = () => {
    if (!selectedTemplate) return;
    setTemplates(templates.map(t =>
      t.id === selectedTemplate.id
        ? { ...t, name: editForm.name, subject: editForm.subject, body: editForm.body, category: editForm.category }
        : t
    ));
    setEditorOpen(false);
    toast({ title: 'Template updated', description: `"${editForm.name}" has been saved.` });
  };

  const handleCreate = () => {
    if (!editForm.name || !editForm.subject || !editForm.body) {
      toast({ title: 'Missing fields', description: 'Name, subject, and body are required.', variant: 'destructive' });
      return;
    }
    const newTemplate: EmailTemplate = {
      id: `t${Date.now()}`,
      name: editForm.name,
      description: 'Custom template',
      subject: editForm.subject,
      body: editForm.body,
      category: editForm.category,
      lastUsed: 'Never',
      usageCount: 0,
      isSystem: false,
    };
    setTemplates([...templates, newTemplate]);
    setCreateOpen(false);
    setEditForm({ name: '', subject: '', body: '', category: 'transactional' });
    toast({ title: 'Template created', description: `"${editForm.name}" has been added.` });
  };

  const handleSendTest = () => {
    toast({
      title: 'Test email sent! 📧',
      description: 'A test email has been sent to your email address.',
    });
  };

  const truncate = (text: string, len: number) => {
    if (text.length <= len) return text;
    return text.substring(0, len) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Email Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage your email communication templates
          </p>
        </div>
        <Button className="bg-gold hover:bg-gold-light text-white" onClick={() => {
          setEditForm({ name: '', subject: '', body: '', category: 'transactional' });
          setCreateOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-1.5" />
          Create Template
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
            categoryFilter === 'all'
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-muted-foreground border-border hover:bg-muted'
          )}
        >
          All ({templates.length})
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = templates.filter(t => t.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
                categoryFilter === key
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-muted-foreground border-border hover:bg-muted'
              )}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => {
          const config = categoryConfig[template.category];
          const CategoryIcon = categoryIcons[template.category];

          return (
            <Card key={template.id} className="dashboard-card group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                      config.color
                    )}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold text-navy leading-tight">
                        {template.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openPreview(template)}>
                        <Eye className="h-4 w-4 mr-2" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditor(template)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Subject line */}
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground truncate">{template.subject}</p>
                </div>

                {/* Body preview */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {truncate(template.body.replace(/\n/g, ' '), 120)}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Used {template.usageCount}x</span>
                    <span>Last: {template.lastUsed}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-gold hover:text-gold-light"
                    onClick={handleSendTest}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-navy flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gold" />
                  {selectedTemplate.name}
                </DialogTitle>
                <DialogDescription>{selectedTemplate.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Subject Line</Label>
                  <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                    {selectedTemplate.subject}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Email Body</Label>
                  <div className="rounded-lg border bg-muted/50 p-4 text-sm whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {selectedTemplate.body}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Available Variables</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {['{{firstName}}', '{{lastName}}', '{{service}}', '{{date}}', '{{companyName}}'].map((v) => (
                      <Badge key={v} variant="outline" className="text-xs font-mono">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Used {selectedTemplate.usageCount} times · Last used {selectedTemplate.lastUsed}</span>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
                <Button className="bg-gold hover:bg-gold-light text-white" onClick={handleSendTest}>
                  <Send className="h-4 w-4 mr-1.5" />
                  Send Test Email
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              <Pencil className="h-5 w-5 text-gold" />
              Edit Template
            </DialogTitle>
            <DialogDescription>Update your email template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Template Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v as EmailTemplate['category'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subject Line</Label>
                <Input
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email Body</Label>
              <Textarea
                value={editForm.body}
                onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Available Variables</Label>
              <div className="flex flex-wrap gap-1.5">
                {['{{firstName}}', '{{lastName}}', '{{service}}', '{{date}}', '{{companyName}}'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setEditForm({ ...editForm, body: editForm.body + ' ' + v })}
                    className="text-xs font-mono px-2 py-1 rounded border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light text-white" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              <Plus className="h-5 w-5 text-gold" />
              Create Template
            </DialogTitle>
            <DialogDescription>Design a new email template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Template Name *</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="e.g. Holiday Promotion"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v as EmailTemplate['category'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subject Line *</Label>
                <Input
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  placeholder="e.g. Happy Holidays from ProCoat!"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email Body *</Label>
              <Textarea
                value={editForm.body}
                onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                rows={12}
                className="font-mono text-sm"
                placeholder="Write your email template here..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Available Variables (click to insert)</Label>
              <div className="flex flex-wrap gap-1.5">
                {['{{firstName}}', '{{lastName}}', '{{service}}', '{{date}}', '{{companyName}}'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setEditForm({ ...editForm, body: editForm.body + ' ' + v })}
                    className="text-xs font-mono px-2 py-1 rounded border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="bg-gold hover:bg-gold-light text-white" onClick={handleCreate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
