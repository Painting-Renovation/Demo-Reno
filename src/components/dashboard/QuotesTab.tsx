'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Send,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  FileText,
  DollarSign,
  Calendar,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Quote {
  id: string;
  title: string;
  items: string; // JSON string
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  validUntil: string | null;
  notes: string | null;
  createdAt: string;
  leadId?: string | null;
  lead?: { firstName: string; lastName: string } | null;
}

const statusOptions = ['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected'];

const statusClassMap: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const emptyLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
});

const emptyForm = {
  title: '',
  leadId: '',
  items: [emptyLineItem()],
  tax: 0,
  notes: '',
  validUntil: '',
};

export default function QuotesTab() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/quotes?${params}`);
      const data = await res.json();
      setQuotes(data.data || data || []);
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const parseItems = (itemsJson: string): LineItem[] => {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  };

  const calcSubtotal = (items: LineItem[]) =>
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const currentSubtotal = calcSubtotal(formData.items);
  const currentTotal = currentSubtotal + (formData.tax || 0);

  const handleCreate = async () => {
    if (!formData.title.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        items: JSON.stringify(formData.items),
        subtotal: currentSubtotal,
        tax: formData.tax || 0,
        total: currentTotal,
        notes: formData.notes || null,
        validUntil: formData.validUntil || null,
        leadId: formData.leadId || null,
      };
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setCreateOpen(false);
      setFormData(emptyForm);
      fetchQuotes();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSend = async (quote: Quote) => {
    try {
      await fetch(`/api/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sent' }),
      });
      fetchQuotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuote) return;
    try {
      await fetch(`/api/quotes/${selectedQuote.id}`, { method: 'DELETE' });
      setDeleteOpen(false);
      setSelectedQuote(null);
      fetchQuotes();
    } catch (err) {
      console.error(err);
    }
  };

  const addLineItem = () => {
    setFormData({ ...formData, items: [...formData.items, emptyLineItem()] });
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, items: updated });
  };

  const removeLineItem = (index: number) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">Quotes</h2>
          <p className="text-sm text-muted-foreground">{quotes.length} total quotes</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s === 'all' ? 'All Statuses' : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-gold hover:bg-gold-light text-white" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Quote
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="dashboard-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Title</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Total</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Valid Until</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No quotes found
                  </TableCell>
                </TableRow>
              ) : (
                quotes.map((quote) => (
                  <TableRow
                    key={quote.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedQuote(quote); setDetailOpen(true); }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{quote.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {quote.lead ? `${quote.lead.firstName} ${quote.lead.lastName}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">${quote.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('text-xs capitalize', statusClassMap[quote.status])}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : 'No expiry'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedQuote(quote); setDetailOpen(true); }}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          {quote.status === 'draft' && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSend(quote); }}>
                              <Send className="mr-2 h-4 w-4" /> Send Quote
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => { e.stopPropagation(); setSelectedQuote(quote); setDeleteOpen(true); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create Quote Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto sm:max-w-2xl w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle>Create New Quote</DialogTitle>
            <DialogDescription>Add line items and set pricing for the quote</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quote Title *</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Kitchen Renovation Quote" />
              </div>
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input type="date" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} />
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Line Items</Label>
                <Button variant="outline" size="sm" className="h-8" onClick={addLineItem}>
                  <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Item
                </Button>
              </div>
              {formData.items.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-20">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-full sm:w-28">
                    <Input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-full sm:w-24 flex items-center justify-end text-sm font-medium">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                    onClick={() => removeLineItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${currentSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Tax</Label>
                <Input
                  type="number"
                  className="w-28 h-8 text-sm"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${currentTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes for the client..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); setFormData(emptyForm); }}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light" onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Quote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quote Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto sm:max-w-2xl w-[calc(100%-2rem)]">
          {selectedQuote && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gold" />
                  <div>
                    <DialogTitle className="text-navy">{selectedQuote.title}</DialogTitle>
                    <DialogDescription>
                      Created {new Date(selectedQuote.createdAt).toLocaleDateString()}
                      {selectedQuote.validUntil && ` · Valid until ${new Date(selectedQuote.validUntil).toLocaleDateString()}`}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={cn('capitalize', statusClassMap[selectedQuote.status])}>
                    {selectedQuote.status}
                  </Badge>
                  {selectedQuote.status === 'draft' && (
                    <Button size="sm" className="bg-gold hover:bg-gold-light text-white" onClick={() => { handleSend(selectedQuote); setDetailOpen(false); }}>
                      <Send className="h-3.5 w-3.5 mr-1" /> Send Quote
                    </Button>
                  )}
                  {selectedQuote.lead && (
                    <span className="text-sm text-muted-foreground">
                      Client: {selectedQuote.lead.firstName} {selectedQuote.lead.lastName}
                    </span>
                  )}
                </div>

                {/* Line Items Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Item</TableHead>
                        <TableHead className="text-xs text-right">Qty</TableHead>
                        <TableHead className="text-xs text-right">Unit Price</TableHead>
                        <TableHead className="text-xs text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parseItems(selectedQuote.items).map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{item.description || 'Unnamed item'}</TableCell>
                          <TableCell className="text-sm text-right">{item.quantity}</TableCell>
                          <TableCell className="text-sm text-right">${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-right font-medium">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-48 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${selectedQuote.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${selectedQuote.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold text-navy">
                      <span>Total</span>
                      <span>${selectedQuote.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedQuote.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Notes</Label>
                    <p className="text-sm mt-0.5 bg-muted rounded-lg p-3">{selectedQuote.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedQuote?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
