'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  Phone,
  Mail,
  MessageSquare,
  User,
  Plus,
  Filter,
  Calendar,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ExportButton from './ExportButton';

interface CommunicationLog {
  id: string;
  leadId: string;
  leadName: string;
  type: 'call' | 'email' | 'text' | 'in-person';
  direction: 'inbound' | 'outbound';
  summary: string;
  notes: string;
  duration?: number;
  followUpDate?: string;
  followUpNotes?: string;
  createdAt: string;
}

interface LeadOption {
  id: string;
  name: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  call: { icon: Phone, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Call' },
  email: { icon: Mail, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Email' },
  text: { icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Text' },
  'in-person': { icon: User, color: 'text-purple-600', bg: 'bg-purple-100', label: 'In-Person' },
};

// Mock communication data
const mockCommunications: CommunicationLog[] = [
  { id: 'c1', leadId: '1', leadName: 'Sarah Johnson', type: 'email', direction: 'outbound', summary: 'Sent welcome email with service brochure', notes: 'Included pricing PDF and portfolio link. Follow up in 3 days.', createdAt: '2024-12-01T09:15:00Z' },
  { id: 'c2', leadId: '1', leadName: 'Sarah Johnson', type: 'call', direction: 'inbound', summary: 'Initial inquiry about interior painting', notes: 'Interested in living room and bedroom repainting. Wants estimate for 1200 sq ft.', duration: 12, createdAt: '2024-11-30T14:30:00Z' },
  { id: 'c3', leadId: '2', leadName: 'Michael Chen', type: 'call', direction: 'outbound', summary: 'Follow-up on estimate request', notes: 'Discussed timeline and color preferences. They want to proceed with Benjamin Moore colors.', duration: 8, followUpDate: '2024-12-05', followUpNotes: 'Send revised estimate', createdAt: '2024-11-29T11:00:00Z' },
  { id: 'c4', leadId: '2', leadName: 'Michael Chen', type: 'email', direction: 'inbound', summary: 'Requested detailed quote for exterior painting', notes: 'Attached photos of current exterior. Wants quote for full exterior repaint.', createdAt: '2024-11-28T16:45:00Z' },
  { id: 'c5', leadId: '3', leadName: 'Emily Rodriguez', type: 'text', direction: 'inbound', summary: 'Asked about cabinet refinishing availability', notes: 'Has 15 cabinets in kitchen. Looking for white conversion.', createdAt: '2024-11-27T10:20:00Z' },
  { id: 'c6', leadId: '3', leadName: 'Emily Rodriguez', type: 'call', direction: 'outbound', summary: 'Discussed cabinet refinishing options', notes: 'Provided estimate range $3000-$4500. Scheduled in-person consultation.', duration: 15, followUpDate: '2024-12-03', followUpNotes: 'In-home consultation scheduled', createdAt: '2024-11-27T10:45:00Z' },
  { id: 'c7', leadId: '4', leadName: 'David Thompson', type: 'in-person', direction: 'outbound', summary: 'Site visit for commercial painting quote', notes: 'Measured office space ~3500 sq ft. Taking photos for estimate. Need specialty paint for accent walls.', followUpDate: '2024-12-08', followUpNotes: 'Deliver commercial estimate', createdAt: '2024-11-26T09:00:00Z' },
  { id: 'c8', leadId: '5', leadName: 'Amanda Williams', type: 'email', direction: 'outbound', summary: 'Sent estimate for bedroom repaint', notes: '2 bedrooms, trim work included. Estimate $2,800. Offered 10% seasonal discount.', createdAt: '2024-11-25T13:30:00Z' },
  { id: 'c9', leadId: '5', leadName: 'Amanda Williams', type: 'call', direction: 'inbound', summary: 'Accepted estimate with minor changes', notes: 'Wants to add accent wall in master bedroom. New total $3,100. Ready to book.', duration: 5, createdAt: '2024-11-25T15:00:00Z' },
  { id: 'c10', leadId: '6', leadName: 'Robert Kim', type: 'call', direction: 'outbound', summary: 'Cold call follow-up from website inquiry', notes: 'No answer left voicemail. Will try again tomorrow.', duration: 1, createdAt: '2024-11-24T16:00:00Z' },
  { id: 'c11', leadId: '7', leadName: 'Lisa Park', type: 'email', direction: 'inbound', summary: 'Re-engagement response from seasonal campaign', notes: 'Interested in spring painting. Has a 3-bedroom home. Wants color consultation first.', followUpDate: '2024-12-10', followUpNotes: 'Schedule color consultation', createdAt: '2024-11-23T08:15:00Z' },
  { id: 'c12', leadId: '8', leadName: 'James Cooper', type: 'in-person', direction: 'outbound', summary: 'Completed final walkthrough for exterior project', notes: 'Client happy with results. Requested Google review. Project completed on time and under budget.', createdAt: '2024-11-22T14:00:00Z' },
];

export default function CommunicationLog() {
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add communication form
  const [newComm, setNewComm] = useState({
    leadId: '',
    type: 'call',
    direction: 'outbound',
    notes: '',
    duration: '',
    followUpDate: '',
    followUpNotes: '',
  });

  useEffect(() => {
    fetchLeads();
    fetchCommunications();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads((data.data || data || []).map((l: Record<string, unknown>) => ({
        id: l.id as string,
        name: `${l.firstName} ${l.lastName}` as string,
      })));
    } catch {
      // use mock data
    }
  };

  const fetchCommunications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/communications');
      const data = await res.json();
      setCommunications(data.data || data || mockCommunications);
    } catch {
      setCommunications(mockCommunications);
    } finally {
      setLoading(false);
    }
  };

  const filtered = communications.filter((c) => {
    if (selectedLead !== 'all' && c.leadId !== selectedLead) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  });

  const handleAddCommunication = async () => {
    if (!newComm.leadId) {
      toast({ title: 'Missing fields', description: 'Please select a lead.', variant: 'destructive' });
      return;
    }
    try {
      await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newComm,
          duration: newComm.duration ? parseInt(newComm.duration) : undefined,
          followUpDate: newComm.followUpDate || undefined,
          followUpNotes: newComm.followUpNotes || undefined,
        }),
      });
      toast({ title: 'Communication logged', description: 'New entry has been saved.' });
      fetchCommunications();
      setAddDialogOpen(false);
      setNewComm({ leadId: '', type: 'call', direction: 'outbound', notes: '', duration: '', followUpDate: '', followUpNotes: '' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save communication.', variant: 'destructive' });
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      full: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  };

  const exportColumns = [
    { key: 'leadName', label: 'Lead' },
    { key: 'type', label: 'Type' },
    { key: 'direction', label: 'Direction' },
    { key: 'summary', label: 'Summary' },
    { key: 'duration', label: 'Duration (min)' },
    { key: 'createdAt', label: 'Date' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Communication Log</h2>
          <p className="text-sm text-muted-foreground">
            Track all interactions with your leads
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={filtered.map(c => ({
              leadName: c.leadName,
              type: c.type,
              direction: c.direction,
              summary: c.summary,
              duration: c.duration ?? '',
              createdAt: formatDateTime(c.createdAt).full,
            }))}
            filename="communication-log"
            columns={exportColumns}
          />
          <Button className="bg-gold hover:bg-gold-light text-white" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Communication
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>
        <Select value={selectedLead} onValueChange={setSelectedLead}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Leads" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="in-person">In-Person</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="w-fit">
          {filtered.length} entries
        </Badge>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="dashboard-card">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No communication entries found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or add a new entry</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[18px] top-4 bottom-4 w-px bg-border hidden sm:block" />

          <div className="space-y-4">
            {filtered.map((comm) => {
              const config = typeConfig[comm.type];
              const Icon = config.icon;
              const dt = formatDateTime(comm.createdAt);
              const isOutbound = comm.direction === 'outbound';

              return (
                <Card key={comm.id} className="dashboard-card overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Timeline Icon */}
                      <div className={cn(
                        'flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center z-10 border-2 border-white',
                        config.bg
                      )}>
                        <Icon className={cn('h-4 w-4', config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-navy">{comm.leadName}</span>
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs gap-1',
                                isOutbound ? 'border-blue-200 text-blue-700' : 'border-emerald-200 text-emerald-700'
                              )}
                            >
                              {isOutbound ? (
                                <><ArrowUpRight className="h-3 w-3" /> Outbound</>
                              ) : (
                                <><ArrowDownLeft className="h-3 w-3" /> Inbound</>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {dt.full}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {dt.time}
                            </span>
                            {comm.duration != null && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {comm.duration} min
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-foreground mt-1.5">{comm.summary}</p>

                        {comm.notes && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{comm.notes}</p>
                        )}

                        {/* Follow-up */}
                        {comm.followUpDate && (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                              <Calendar className="h-3 w-3" />
                              Follow-up: {new Date(comm.followUpDate).toLocaleDateString()}
                            </Badge>
                            {comm.followUpNotes && (
                              <span className="text-muted-foreground">{comm.followUpNotes}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Communication Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Log Communication</DialogTitle>
            <DialogDescription>Record a new interaction with a lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Lead *</Label>
                <Select value={newComm.leadId} onValueChange={(v) => setNewComm({ ...newComm, leadId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Direction</Label>
                <Select value={newComm.direction} onValueChange={(v) => setNewComm({ ...newComm, direction: v as 'inbound' | 'outbound' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="inbound">Inbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={newComm.type} onValueChange={(v) => setNewComm({ ...newComm, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newComm.type === 'call' && (
              <div className="space-y-1.5">
                <Label className="text-xs">Duration (minutes)</Label>
                <Input type="number" value={newComm.duration} onChange={(e) => setNewComm({ ...newComm, duration: e.target.value })} placeholder="10" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Notes *</Label>
              <Textarea value={newComm.notes} onChange={(e) => setNewComm({ ...newComm, notes: e.target.value })} placeholder="Summary of the communication..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Follow-up Date</Label>
                <Input type="date" value={newComm.followUpDate} onChange={(e) => setNewComm({ ...newComm, followUpDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Follow-up Notes</Label>
                <Input value={newComm.followUpNotes} onChange={(e) => setNewComm({ ...newComm, followUpNotes: e.target.value })} placeholder="What to follow up on" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-navy hover:bg-navy-light text-white" onClick={handleAddCommunication}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
