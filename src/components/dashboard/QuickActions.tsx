'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UserPlus,
  CalendarPlus,
  FileText,
  Mail,
  Phone,
  Trophy,
  Loader2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LeadOption {
  id: string;
  name: string;
  status: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut: string;
  color: string;
}

const quickActions: QuickAction[] = [
  { id: 'new-lead', label: 'New Lead', icon: UserPlus, shortcut: '⌘1', color: 'bg-gold/10 text-gold hover:bg-gold/20 border-gold/20' },
  { id: 'new-appointment', label: 'New Appointment', icon: CalendarPlus, shortcut: '⌘2', color: 'bg-navy/10 text-navy hover:bg-navy/20 border-navy/20' },
  { id: 'new-quote', label: 'New Quote', icon: FileText, shortcut: '⌘3', color: 'bg-sage/10 text-sage hover:bg-sage/20 border-sage/20' },
  { id: 'send-followup', label: 'Send Follow-up', icon: Mail, shortcut: '⌘4', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
  { id: 'log-call', label: 'Log Call', icon: Phone, shortcut: '⌘5', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
  { id: 'mark-won', label: 'Mark Won', icon: Trophy, shortcut: '⌘6', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
];

const serviceTypes = [
  'Interior Painting',
  'Exterior Painting',
  'Cabinet Refinishing',
  'Commercial Painting',
  'Deck & Fence',
  'Color Consultation',
];

export default function QuickActions() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [loading, setLoading] = useState(false);

  // New Lead form
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
  });

  // New Appointment form
  const [appointment, setAppointment] = useState({
    leadId: '',
    date: '',
    time: '',
    notes: '',
  });

  // New Quote form
  const [quote, setQuote] = useState({
    leadId: '',
    description: '',
    amount: '',
    notes: '',
  });

  // Log Call form
  const [callLog, setCallLog] = useState({
    leadId: '',
    duration: '',
    notes: '',
  });

  // Send Follow-up form
  const [followup, setFollowup] = useState({
    leadId: '',
    message: '',
  });

  // Mark Won form
  const [wonLead, setWonLead] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      const leadList = (data.data || data || []).map((l: Record<string, unknown>) => ({
        id: l.id as string,
        name: `${l.firstName} ${l.lastName}` as string,
        status: l.status as string,
      }));
      setLeads(leadList);
    } catch {
      // silent fail
    }
  };

  const handleActionClick = (actionId: string) => {
    setActiveDialog(actionId);
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
    setNewLead({ firstName: '', lastName: '', email: '', phone: '', serviceType: '' });
    setAppointment({ leadId: '', date: '', time: '', notes: '' });
    setQuote({ leadId: '', description: '', amount: '', notes: '' });
    setCallLog({ leadId: '', duration: '', notes: '' });
    setFollowup({ leadId: '', message: '' });
    setWonLead('');
  };

  const handleNewLead = async () => {
    if (!newLead.firstName || !newLead.lastName || !newLead.email) {
      toast({ title: 'Missing fields', description: 'First name, last name, and email are required.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      toast({ title: 'Lead created', description: `${newLead.firstName} ${newLead.lastName} has been added.` });
      fetchLeads();
      handleCloseDialog();
    } catch {
      toast({ title: 'Error', description: 'Failed to create lead.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleNewAppointment = () => {
    if (!appointment.leadId || !appointment.date) {
      toast({ title: 'Missing fields', description: 'Please select a lead and date.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Appointment scheduled', description: 'Appointment has been created.' });
    handleCloseDialog();
  };

  const handleNewQuote = () => {
    if (!quote.leadId || !quote.description) {
      toast({ title: 'Missing fields', description: 'Please select a lead and add a description.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Quote created', description: 'New quote has been drafted.' });
    handleCloseDialog();
  };

  const handleSendFollowup = () => {
    if (!followup.leadId || !followup.message) {
      toast({ title: 'Missing fields', description: 'Please select a lead and add a message.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Follow-up sent', description: 'Email follow-up has been sent.' });
    handleCloseDialog();
  };

  const handleLogCall = () => {
    if (!callLog.leadId) {
      toast({ title: 'Missing fields', description: 'Please select a lead.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Call logged', description: `Call${callLog.duration ? ` (${callLog.duration} min)` : ''} has been logged.` });
    handleCloseDialog();
  };

  const handleMarkWon = async () => {
    if (!wonLead) {
      toast({ title: 'Missing fields', description: 'Please select a lead.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await fetch(`/api/leads/${wonLead}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'won' }),
      });
      const leadName = leads.find(l => l.id === wonLead)?.name || 'Lead';
      toast({ title: 'Lead marked as Won! 🎉', description: `${leadName} has been converted.` });
      fetchLeads();
      handleCloseDialog();
    } catch {
      toast({ title: 'Error', description: 'Failed to update lead.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
          e.preventDefault();
          setActiveDialog(quickActions[num - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const LeadSelect = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || 'Select a lead'} />
      </SelectTrigger>
      <SelectContent>
        {leads.filter(l => l.status !== 'lost').map((lead) => (
          <SelectItem key={lead.id} value={lead.id}>
            {lead.name} <span className="text-muted-foreground text-xs ml-1">({lead.status})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <div className="rounded-xl border border-navy/10 bg-gradient-to-r from-navy/[0.03] to-cream p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                  action.color
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{action.label}</span>
                <kbd className="hidden sm:inline-flex h-4 items-center gap-0.5 rounded border bg-white/60 px-1 font-mono text-[10px] opacity-60">
                  {action.shortcut}
                </kbd>
              </button>
            );
          })}
        </div>
      </div>

      {/* New Lead Dialog */}
      <Dialog open={activeDialog === 'new-lead'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Add New Lead</DialogTitle>
            <DialogDescription>Create a new lead in your pipeline</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">First Name *</Label>
                <Input value={newLead.firstName} onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })} placeholder="John" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Last Name *</Label>
                <Input value={newLead.lastName} onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })} placeholder="Smith" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email *</Label>
              <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} placeholder="john@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} placeholder="(416) 555-0123" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Service Type</Label>
              <Select value={newLead.serviceType} onValueChange={(v) => setNewLead({ ...newLead, serviceType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button className="bg-gold hover:bg-gold-light text-white" onClick={handleNewLead} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Appointment Dialog */}
      <Dialog open={activeDialog === 'new-appointment'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Schedule Appointment</DialogTitle>
            <DialogDescription>Create a new appointment for a lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Lead *</Label>
              <LeadSelect value={appointment.leadId} onChange={(v) => setAppointment({ ...appointment, leadId: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Date *</Label>
                <Input type="date" value={appointment.date} onChange={(e) => setAppointment({ ...appointment, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Time</Label>
                <Input type="time" value={appointment.time} onChange={(e) => setAppointment({ ...appointment, time: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Textarea value={appointment.notes} onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })} placeholder="Appointment details..." rows={2} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light text-white" onClick={handleNewAppointment}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Quote Dialog */}
      <Dialog open={activeDialog === 'new-quote'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Create Quote</DialogTitle>
            <DialogDescription>Draft a new quote for a lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Lead *</Label>
              <LeadSelect value={quote.leadId} onChange={(v) => setQuote({ ...quote, leadId: v })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description *</Label>
              <Textarea value={quote.description} onChange={(e) => setQuote({ ...quote, description: e.target.value })} placeholder="Describe the project scope..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Amount ($)</Label>
              <Input type="number" value={quote.amount} onChange={(e) => setQuote({ ...quote, amount: e.target.value })} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Textarea value={quote.notes} onChange={(e) => setQuote({ ...quote, notes: e.target.value })} placeholder="Additional notes..." rows={2} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light text-white" onClick={handleNewQuote}>Create Quote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Follow-up Dialog */}
      <Dialog open={activeDialog === 'send-followup'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Send Follow-up</DialogTitle>
            <DialogDescription>Send a quick email follow-up to a lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Lead *</Label>
              <LeadSelect value={followup.leadId} onChange={(v) => setFollowup({ ...followup, leadId: v })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Message *</Label>
              <Textarea value={followup.message} onChange={(e) => setFollowup({ ...followup, message: e.target.value })} placeholder="Hi {{firstName}}, just following up on..." rows={4} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button className="bg-gold hover:bg-gold-light text-white" onClick={handleSendFollowup}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Call Dialog */}
      <Dialog open={activeDialog === 'log-call'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Log Call</DialogTitle>
            <DialogDescription>Record a call with a lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Lead *</Label>
              <LeadSelect value={callLog.leadId} onChange={(v) => setCallLog({ ...callLog, leadId: v })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Duration (minutes)</Label>
              <Input type="number" value={callLog.duration} onChange={(e) => setCallLog({ ...callLog, duration: e.target.value })} placeholder="15" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Call Notes</Label>
              <Textarea value={callLog.notes} onChange={(e) => setCallLog({ ...callLog, notes: e.target.value })} placeholder="Summary of the call..." rows={3} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light text-white" onClick={handleLogCall}>Log Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Won Dialog */}
      <Dialog open={activeDialog === 'mark-won'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-navy">Mark Lead as Won</DialogTitle>
            <DialogDescription>Convert a lead to a won project</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Select Lead *</Label>
              <LeadSelect value={wonLead} onChange={setWonLead} placeholder="Select lead to convert" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleMarkWon} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Mark as Won
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
