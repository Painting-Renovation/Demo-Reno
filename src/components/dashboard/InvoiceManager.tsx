'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Download,
  Send,
  CheckCircle2,
  ArrowLeft,
  Trash2,
  FileText,
  DollarSign,
  AlertCircle,
  Clock,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';

// --- Types ---
type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

interface LineItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
}

interface PaymentEntry {
  date: string;
  amount: number;
  method: string;
  note: string;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  email: string;
  address: string;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  hst: number;
  total: number;
  payments: PaymentEntry[];
  notes: string;
}

// --- Demo Data ---
const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'INV-2025-001',
    client: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    address: '3300 Highway 7 W, Suite 600, Vaughan ON L4K 4M3',
    status: 'Paid',
    date: '2025-01-15',
    dueDate: '2025-02-15',
    lineItems: [
      { id: 'li-1', description: 'Living room painting – walls & ceiling', hours: 8, rate: 65 },
      { id: 'li-2', description: 'Hallway & stairwell – 2 coats', hours: 5, rate: 65 },
      { id: 'li-3', description: 'Trim & baseboards – white semi-gloss', hours: 3, rate: 70 },
    ],
    subtotal: 1060,
    hst: 137.8,
    total: 1197.8,
    payments: [
      { date: '2025-01-15', amount: 598.9, method: 'E-Transfer', note: '50% deposit' },
      { date: '2025-01-28', amount: 598.9, method: 'E-Transfer', note: 'Final payment' },
    ],
    notes: 'Client requested Benjamin Moore Simply White for trim.',
  },
  {
    id: 'inv-2',
    number: 'INV-2025-002',
    client: 'David Chen',
    email: 'dchen@corp.ca',
    address: '18 Bay St, Suite 1204, Toronto, ON M5J 2Z5',
    status: 'Sent',
    date: '2025-02-01',
    dueDate: '2025-03-01',
    lineItems: [
      { id: 'li-4', description: 'Office repaint – 3 rooms', hours: 16, rate: 65 },
      { id: 'li-5', description: 'Accent wall – custom colour match', hours: 4, rate: 75 },
      { id: 'li-6', description: 'Cabinet lacquer touch-up', hours: 3, rate: 80 },
    ],
    subtotal: 1540,
    hst: 200.2,
    total: 1740.2,
    payments: [
      { date: '2025-02-05', amount: 870.1, method: 'Credit Card', note: '50% deposit' },
    ],
    notes: 'After-hours work required. Weekend scheduling.',
  },
  {
    id: 'inv-3',
    number: 'INV-2025-003',
    client: 'Jennifer Williams',
    email: 'jen.williams@gmail.com',
    address: '305 Kingston Rd, Toronto, ON M4L 1V3',
    status: 'Overdue',
    date: '2025-01-05',
    dueDate: '2025-02-05',
    lineItems: [
      { id: 'li-7', description: 'Exterior window frames – prep & paint', hours: 10, rate: 65 },
      { id: 'li-8', description: 'Front door & garage door', hours: 6, rate: 70 },
    ],
    subtotal: 1070,
    hst: 139.1,
    total: 1209.1,
    payments: [
      { date: '2025-01-10', amount: 604.55, method: 'E-Transfer', note: '50% deposit' },
    ],
    notes: 'Follow up – payment overdue since Feb 5.',
  },
  {
    id: 'inv-4',
    number: 'INV-2025-004',
    client: 'Mark Thompson',
    email: 'mark.t@rogers.com',
    address: '77 Ellesmere Rd, Scarborough, ON M1R 4B5',
    status: 'Paid',
    date: '2024-12-10',
    dueDate: '2025-01-10',
    lineItems: [
      { id: 'li-9', description: 'Full basement repaint – drywall touch-up', hours: 20, rate: 60 },
      { id: 'li-10', description: 'Staircase railing & spindles', hours: 6, rate: 70 },
    ],
    subtotal: 1620,
    hst: 210.6,
    total: 1830.6,
    payments: [
      { date: '2024-12-10', amount: 915.3, method: 'Cheque', note: '50% deposit' },
      { date: '2024-12-28', amount: 457.65, method: 'E-Transfer', note: 'Partial payment' },
      { date: '2025-01-08', amount: 457.65, method: 'E-Transfer', note: 'Final payment' },
    ],
    notes: '',
  },
  {
    id: 'inv-5',
    number: 'INV-2025-005',
    client: 'Priya Patel',
    email: 'priya.patel@outlook.com',
    address: '12 High Park Blvd, Toronto, ON M6P 2S5',
    status: 'Draft',
    date: '2025-02-20',
    dueDate: '2025-03-20',
    lineItems: [
      { id: 'li-11', description: 'Master bedroom – feature wall & trim', hours: 8, rate: 65 },
      { id: 'li-12', description: 'Guest bedroom – full room', hours: 6, rate: 65 },
    ],
    subtotal: 910,
    hst: 118.3,
    total: 1028.3,
    payments: [],
    notes: 'Client considering colour consultation add-on.',
  },
  {
    id: 'inv-6',
    number: 'INV-2025-006',
    client: 'Robert & Linda Fraser',
    email: 'fraser.family@bell.ca',
    address: '201 Royal York Rd, Etobicoke, ON M8Y 2R5',
    status: 'Sent',
    date: '2025-02-10',
    dueDate: '2025-03-10',
    lineItems: [
      { id: 'li-13', description: 'Kitchen cabinet refinishing – full set', hours: 30, rate: 75 },
      { id: 'li-14', description: 'Kitchen backsplash tile painting', hours: 8, rate: 70 },
    ],
    subtotal: 2810,
    hst: 365.3,
    total: 3175.3,
    payments: [
      { date: '2025-02-12', amount: 1587.65, method: 'Credit Card', note: '50% deposit' },
    ],
    notes: 'Using Benjamin Moore Advance – satin finish. Colour: Cloud White OC-130.',
  },
  {
    id: 'inv-7',
    number: 'INV-2025-007',
    client: 'Amanda Cho',
    email: 'amanda.cho@icloud.com',
    address: '55 College St, Suite 810, Toronto, ON M5G 1E4',
    status: 'Paid',
    date: '2025-01-20',
    dueDate: '2025-02-20',
    lineItems: [
      { id: 'li-15', description: 'Condo living/dining – 2 coats walls', hours: 10, rate: 65 },
      { id: 'li-16', description: 'Accent niche & built-in shelving', hours: 4, rate: 70 },
    ],
    subtotal: 930,
    hst: 120.9,
    total: 1050.9,
    payments: [
      { date: '2025-01-22', amount: 1050.9, method: 'E-Transfer', note: 'Paid in full' },
    ],
    notes: 'HOA requires move-in/move-out window: 9am–5pm.',
  },
  {
    id: 'inv-8',
    number: 'INV-2025-008',
    client: 'Greenfield HOA',
    email: 'management@greenfieldhoa.ca',
    address: '400 The Queensway, Etobicoke, ON M8Y 1H8',
    status: 'Draft',
    date: '2025-03-01',
    dueDate: '2025-03-31',
    lineItems: [
      { id: 'li-17', description: 'Exterior stairwell & railing – building A', hours: 12, rate: 60 },
      { id: 'li-18', description: 'Mailbox kiosk repaint', hours: 4, rate: 60 },
      { id: 'li-19', description: 'Garage door striping (2 units)', hours: 6, rate: 65 },
    ],
    subtotal: 1410,
    hst: 183.3,
    total: 1593.3,
    payments: [],
    notes: 'Bulk commercial rate applied. Pending HOA board approval.',
  },
];

const demoClients = [
  'Sarah Mitchell',
  'David Chen',
  'Jennifer Williams',
  'Mark Thompson',
  'Priya Patel',
  'Robert & Linda Fraser',
  'Amanda Cho',
  'Greenfield HOA',
];

const statusConfig: Record<InvoiceStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Draft: { color: 'text-gray-600', bg: 'bg-gray-100', icon: FileText },
  Sent: { color: 'text-blue-600', bg: 'bg-blue-100', icon: Send },
  Paid: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 },
  Overdue: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle },
};

type SortField = 'date' | 'amount';
type SortDir = 'asc' | 'desc';

// --- Helper ---
function fmt(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);
}

// --- Component ---
export function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState<'All' | InvoiceStatus>('All');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // --- Create Invoice State ---
  const [newClient, setNewClient] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newLineItems, setNewLineItems] = useState<LineItem[]>([
    { id: 'nli-1', description: '', hours: 1, rate: 65 },
  ]);

  // --- Filters ---
  const filtered = useMemo(() => {
    let list = invoices;
    if (activeTab !== 'All') list = list.filter((inv) => inv.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.client.toLowerCase().includes(q) ||
          inv.number.toLowerCase().includes(q) ||
          inv.email.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'date') return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.total - b.total);
    });
    return list;
  }, [invoices, activeTab, search, sortField, sortDir]);

  // --- KPIs ---
  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((s, i) => s + i.total, 0);
  const outstanding = totalInvoiced - totalPaid;
  const paidCount = invoices.filter((i) => i.status === 'Paid').length;

  const selectedInvoice = invoices.find((i) => i.id === selectedId) || null;

  // --- Handlers ---
  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function markAsPaid(id: string) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: 'Paid' as InvoiceStatus,
              payments: [
                ...inv.payments,
                {
                  date: new Date().toISOString().slice(0, 10),
                  amount: inv.total - inv.payments.reduce((s, p) => s + p.amount, 0),
                  method: 'Manual',
                  note: 'Balance paid',
                },
              ],
            }
          : inv
      )
    );
  }

  function sendInvoice(id: string) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id && inv.status === 'Draft'
          ? { ...inv, status: 'Sent' as InvoiceStatus }
          : inv
      )
    );
  }

  function handleCreateInvoice() {
    const subtotal = newLineItems.reduce((s, li) => s + li.hours * li.rate, 0);
    const hst = Math.round(subtotal * 0.13 * 100) / 100;
    const total = Math.round((subtotal + hst) * 100) / 100;
    const invNum = `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInv: Invoice = {
      id: `inv-new-${Date.now()}`,
      number: invNum,
      client: newClient || 'Unnamed Client',
      email: '',
      address: '',
      status: 'Draft',
      date: new Date().toISOString().slice(0, 10),
      dueDate: newDueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      lineItems: newLineItems.filter((li) => li.description.trim()),
      subtotal,
      hst,
      total,
      payments: [],
      notes: newNotes,
    };
    setInvoices((prev) => [newInv, ...prev]);
    setCreateOpen(false);
    setNewClient('');
    setNewDueDate('');
    setNewNotes('');
    setNewLineItems([{ id: 'nli-1', description: '', hours: 1, rate: 65 }]);
  }

  function addNewLineItem() {
    setNewLineItems((prev) => [
      ...prev,
      { id: `nli-${Date.now()}`, description: '', hours: 1, rate: 65 },
    ]);
  }

  function removeNewLineItem(id: string) {
    setNewLineItems((prev) => prev.filter((li) => li.id !== id));
  }

  function updateNewLineItem(id: string, field: keyof LineItem, value: string | number) {
    setNewLineItems((prev) =>
      prev.map((li) => (li.id === id ? { ...li, [field]: value } : li))
    );
  }

  // ==================== DETAIL VIEW ====================
  if (selectedInvoice) {
    const paidAmount = selectedInvoice.payments.reduce((s, p) => s + p.amount, 0);
    const payPercent = selectedInvoice.total > 0 ? Math.min(100, Math.round((paidAmount / selectedInvoice.total) * 100)) : 0;
    const remaining = selectedInvoice.total - paidAmount;

    return (
      <motion.div
        key="detail"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <Button variant="ghost" onClick={() => setSelectedId(null)} className="gap-2 text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Button>

        {/* Invoice Header */}
        <Card>
          <div className="bg-navy text-white rounded-t-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold">
                    <span className="font-bold text-navy text-lg">P</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">ProCoat Painters</h2>
                    <p className="text-sm text-white/70">Toronto &amp; GTA</p>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <h3 className="text-2xl font-bold">{selectedInvoice.number}</h3>
                <p className="text-sm text-white/70">{new Date(selectedInvoice.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Client & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Bill To</p>
                <p className="text-base font-semibold text-navy">{selectedInvoice.client}</p>
                {selectedInvoice.email && <p className="text-sm text-muted-foreground">{selectedInvoice.email}</p>}
                {selectedInvoice.address && <p className="text-sm text-muted-foreground">{selectedInvoice.address}</p>}
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge className={cn('text-sm px-3 py-1', statusConfig[selectedInvoice.status].bg, statusConfig[selectedInvoice.status].color)}>
                  {selectedInvoice.status}
                </Badge>
                <p className="text-xs text-muted-foreground">Due: {new Date(selectedInvoice.dueDate).toLocaleDateString('en-CA')}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right w-20">Hours</TableHead>
                  <TableHead className="text-right w-24">Rate</TableHead>
                  <TableHead className="text-right w-28">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedInvoice.lineItems.map((li) => (
                  <TableRow key={li.id}>
                    <TableCell className="font-medium">{li.description}</TableCell>
                    <TableCell className="text-right">{li.hours}</TableCell>
                    <TableCell className="text-right">{fmt(li.rate)}</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(li.hours * li.rate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{fmt(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HST (13%)</span>
                  <span className="font-medium">{fmt(selectedInvoice.hst)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-navy">Total</span>
                  <span className="font-bold text-navy">{fmt(selectedInvoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Progress */}
            {selectedInvoice.status !== 'Paid' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-navy">Payment Progress</span>
                  <span className="text-muted-foreground">{fmt(paidAmount)} of {fmt(selectedInvoice.total)} ({payPercent}%)</span>
                </div>
                <Progress value={payPercent} className="h-2" />
                {remaining > 0 && (
                  <p className="text-xs text-muted-foreground">Outstanding: {fmt(remaining)}</p>
                )}
              </div>
            )}

            {/* Payment History */}
            {selectedInvoice.payments.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-navy">Payment History</p>
                <div className="space-y-2">
                  {selectedInvoice.payments.map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium">{p.note}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString('en-CA')} · {p.method}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{fmt(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedInvoice.notes && (
              <div>
                <p className="text-sm font-medium text-navy mb-1">Notes</p>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">{selectedInvoice.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {selectedInvoice.status === 'Draft' && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => sendInvoice(selectedInvoice.id)}>
                  <Send className="h-4 w-4 mr-1.5" /> Send Invoice
                </Button>
              )}
              {selectedInvoice.status !== 'Paid' && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => markAsPaid(selectedInvoice.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark as Paid
                </Button>
              )}
              <Button size="sm" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ==================== LIST VIEW ====================
  const tabs: Array<'All' | InvoiceStatus> = ['All', 'Draft', 'Sent', 'Paid', 'Overdue'];

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Invoices</h2>
          <p className="text-sm text-muted-foreground">Manage and track all invoices</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-white">
              <Plus className="h-4 w-4 mr-1.5" /> Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto sm:max-w-lg w-[calc(100%-2rem)]">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={newClient} onValueChange={setNewClient}>
                  <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                  <SelectContent>
                    {demoClients.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Line Items</Label>
                <div className="space-y-2">
                  {newLineItems.map((li) => (
                    <div key={li.id} className="grid grid-cols-[1fr_60px_80px_auto] gap-2 items-end">
                      <Input
                        placeholder="Description"
                        value={li.description}
                        onChange={(e) => updateNewLineItem(li.id, 'description', e.target.value)}
                      />
                      <Input
                        type="number"
                        min={0}
                        value={li.hours}
                        onChange={(e) => updateNewLineItem(li.id, 'hours', Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        min={0}
                        value={li.rate}
                        onChange={(e) => updateNewLineItem(li.id, 'rate', Number(e.target.value))}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeNewLineItem(li.id)} disabled={newLineItems.length <= 1}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addNewLineItem}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Line Item
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Auto-calculated totals preview */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(newLineItems.reduce((s, li) => s + li.hours * li.rate, 0))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">HST (13%)</span><span>{fmt(Math.round(newLineItems.reduce((s, li) => s + li.hours * li.rate, 0) * 0.13 * 100) / 100)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold"><span>Total</span><span>{fmt(Math.round((newLineItems.reduce((s, li) => s + li.hours * li.rate, 0) * 1.13) * 100) / 100)}</span></div>
              </div>

              <Button className="w-full bg-gold hover:bg-gold/90 text-white" onClick={handleCreateInvoice} disabled={!newClient}>
                Create Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="dashboard-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/10">
              <DollarSign className="h-5 w-5 text-navy" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Invoiced</p>
              <p className="text-xl font-bold text-navy">{fmt(totalInvoiced)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Paid ({paidCount})</p>
              <p className="text-xl font-bold text-green-600">{fmt(totalPaid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Outstanding</p>
              <p className="text-xl font-bold text-amber-600">{fmt(outstanding)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1 bg-muted rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                activeTab === tab
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1 text-[10px] opacity-60">
                  ({invoices.filter((i) => i.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Invoice Table */}
      <Card className="dashboard-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-xs">Invoice #</TableHead>
                  <TableHead className="text-xs">Client</TableHead>
                  <TableHead
                    className="text-xs cursor-pointer select-none"
                    onClick={() => toggleSort('amount')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Amount
                      {sortField === 'amount' ? (
                        sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : null}
                    </span>
                  </TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead
                    className="text-xs cursor-pointer select-none"
                    onClick={() => toggleSort('date')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Date
                      {sortField === 'date' ? (
                        sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : null}
                    </span>
                  </TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((inv) => {
                    const sc = statusConfig[inv.status];
                    return (
                      <TableRow
                        key={inv.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedId(inv.id)}
                      >
                        <TableCell className="font-mono text-sm font-medium text-navy">{inv.number}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{inv.client}</p>
                            <p className="text-xs text-muted-foreground">{inv.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-semibold">{fmt(inv.total)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn('text-xs gap-1', sc.bg, sc.color)}>
                            {sc.icon && <sc.icon className="h-3 w-3" />}
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(inv.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            {inv.status === 'Draft' && (
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => sendInvoice(inv.id)}>
                                <Send className="h-3 w-3 mr-1" /> Send
                              </Button>
                            )}
                            {inv.status !== 'Paid' && (
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-green-600 hover:text-green-700" onClick={() => markAsPaid(inv.id)}>
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Pay
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
