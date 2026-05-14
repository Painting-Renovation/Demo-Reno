'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  Clock,
  Search,
  PhoneOutgoing,
  PhoneIncoming,
  MailPlus,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  PhoneCall,
  CalendarCheck,
  CalendarX,
  FileCheck,
  Briefcase,
  ArrowRight,
  Star,
  DollarSign,
  Hash,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Demo data: 8 leads from seed.ts                                   */
/* ------------------------------------------------------------------ */

interface DemoLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  serviceType: string;
  status: string;
  priority: string;
  leadScore: number;
  totalRevenue: number;
  projectCount: number;
  lastContact: string;
}

const DEMO_LEADS: DemoLead[] = [
  {
    id: 'lead-1',
    firstName: 'Sarah',
    lastName: 'Thompson',
    email: 'sarah.thompson@email.com',
    phone: '(437) 535-0494',
    address: '45 King Street West, Toronto',
    city: 'Toronto',
    postalCode: 'M5H 1C1',
    serviceType: 'Interior Painting',
    status: 'won',
    priority: 'high',
    leadScore: 92,
    totalRevenue: 4200,
    projectCount: 1,
    lastContact: '2025-01-10',
  },
  {
    id: 'lead-2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@email.com',
    phone: '(647) 882-3145',
    address: '78 Bayview Avenue, North York',
    city: 'North York',
    postalCode: 'M2N 5P3',
    serviceType: 'Exterior Painting',
    status: 'qualified',
    priority: 'high',
    leadScore: 78,
    totalRevenue: 0,
    projectCount: 0,
    lastContact: '2025-01-12',
  },
  {
    id: 'lead-3',
    firstName: 'Jennifer',
    lastName: 'Adams',
    email: 'j.adams@email.com',
    phone: '(905) 812-4470',
    address: '123 Queen Street, Mississauga',
    city: 'Mississauga',
    postalCode: 'L5M 1A2',
    serviceType: 'Cabinet Refinishing',
    status: 'proposal',
    priority: 'medium',
    leadScore: 71,
    totalRevenue: 0,
    projectCount: 0,
    lastContact: '2025-01-14',
  },
  {
    id: 'lead-4',
    firstName: 'David',
    lastName: 'Williams',
    email: 'd.williams@email.com',
    phone: '(416) 332-7891',
    address: '456 Lawrence Avenue, Scarborough',
    city: 'Scarborough',
    postalCode: 'M1R 2X1',
    serviceType: 'Interior Painting',
    status: 'new',
    priority: 'medium',
    leadScore: 45,
    totalRevenue: 0,
    projectCount: 0,
    lastContact: '2025-01-08',
  },
  {
    id: 'lead-5',
    firstName: 'Lisa',
    lastName: 'Park',
    email: 'lisa.park@email.com',
    phone: '(905) 471-6238',
    address: '789 Main Street, Markham',
    city: 'Markham',
    postalCode: 'L3R 5H2',
    serviceType: 'Commercial Painting',
    status: 'contacted',
    priority: 'high',
    leadScore: 83,
    totalRevenue: 0,
    projectCount: 0,
    lastContact: '2025-01-15',
  },
  {
    id: 'lead-6',
    firstName: 'Robert',
    lastName: 'Garcia',
    email: 'r.garcia@email.com',
    phone: '(905) 629-8154',
    address: '321 Lakeshore Road, Oakville',
    city: 'Oakville',
    postalCode: 'L6J 3A1',
    serviceType: 'Deck & Fence',
    status: 'new',
    priority: 'low',
    leadScore: 32,
    totalRevenue: 0,
    projectCount: 0,
    lastContact: '2025-01-06',
  },
  {
    id: 'lead-7',
    firstName: 'Amanda',
    lastName: 'Taylor',
    email: 'a.taylor@email.com',
    phone: '(647) 903-4521',
    address: '567 Dundas Street, Toronto',
    city: 'Toronto',
    postalCode: 'M5T 1G1',
    serviceType: 'Interior Painting',
    status: 'new',
    priority: 'medium',
    leadScore: 55,
    totalRevenue: 0,
    projectCount: 0,
    lastContact: '2025-01-09',
  },
  {
    id: 'lead-8',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'j.wilson@email.com',
    phone: '(905) 746-3180',
    address: '890 Hurontario Street, Brampton',
    city: 'Brampton',
    postalCode: 'L6Y 4H8',
    serviceType: 'Exterior Painting',
    status: 'lost',
    priority: 'medium',
    leadScore: 60,
    totalRevenue: 0,
    projectCount: 0,
    lastContact: '2024-12-20',
  },
];

/* ------------------------------------------------------------------ */
/*  Timeline entries per lead                                          */
/* ------------------------------------------------------------------ */

type EntryType =
  | 'created'
  | 'estimate'
  | 'phone_out'
  | 'phone_in'
  | 'email_out'
  | 'email_in'
  | 'appointment_booked'
  | 'appointment_completed'
  | 'appointment_cancelled'
  | 'quote_created'
  | 'quote_sent'
  | 'project_started'
  | 'project_completed'
  | 'follow_up'
  | 'note';

type EntryStatus = 'completed' | 'pending' | 'cancelled';

interface TimelineEntry {
  id: string;
  date: string;
  time: string;
  type: EntryType;
  direction: 'inbound' | 'outbound' | 'none';
  description: string;
  status: EntryStatus;
}

const TYPE_CONFIG: Record<
  EntryType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  created: { icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Lead Created' },
  estimate: { icon: FileText, color: 'text-gold', bgColor: 'bg-gold/10', label: 'Estimate Sent' },
  phone_out: { icon: PhoneOutgoing, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Call Made' },
  phone_in: { icon: PhoneIncoming, color: 'text-emerald-600', bgColor: 'bg-emerald-100', label: 'Call Received' },
  email_out: { icon: MailPlus, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Email Sent' },
  email_in: { icon: Mail, color: 'text-violet-600', bgColor: 'bg-violet-100', label: 'Email Received' },
  appointment_booked: { icon: Calendar, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Appointment Booked' },
  appointment_completed: { icon: CalendarCheck, color: 'text-green-700', bgColor: 'bg-green-100', label: 'Appointment Completed' },
  appointment_cancelled: { icon: CalendarX, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Appointment Cancelled' },
  quote_created: { icon: FileCheck, color: 'text-gold', bgColor: 'bg-gold/10', label: 'Quote Created' },
  quote_sent: { icon: FileText, color: 'text-gold', bgColor: 'bg-gold/10', label: 'Quote Sent' },
  project_started: { icon: Briefcase, color: 'text-navy', bgColor: 'bg-navy/10', label: 'Project Started' },
  project_completed: { icon: CheckCircle2, color: 'text-green-700', bgColor: 'bg-green-100', label: 'Project Completed' },
  follow_up: { icon: Timer, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Follow-up' },
  note: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Note' },
};

const TIMELINE_DATA: Record<string, TimelineEntry[]> = {
  'lead-1': [
    { id: 't1-1', date: '2024-12-02', time: '09:15', type: 'created', direction: 'inbound', description: 'Lead submitted via website estimate form — Interior Painting, 3-bed home.', status: 'completed' },
    { id: 't1-2', date: '2024-12-02', time: '10:00', type: 'email_out', direction: 'outbound', description: 'Sent automated welcome email with service overview and color consultation offer.', status: 'completed' },
    { id: 't1-3', date: '2024-12-03', time: '14:30', type: 'phone_out', direction: 'outbound', description: 'Called to discuss project scope. Client interested in Benjamin Moore colours. Scheduled site visit.', status: 'completed' },
    { id: 't1-4', date: '2024-12-05', time: '10:00', type: 'appointment_booked', direction: 'none', description: 'Site visit booked for December 7 at 10 AM — 45 King Street West.', status: 'completed' },
    { id: 't1-5', date: '2024-12-07', time: '10:15', type: 'appointment_completed', direction: 'none', description: 'Completed on-site assessment. Measured all rooms, discussed colour options. Took photos for reference.', status: 'completed' },
    { id: 't1-6', date: '2024-12-08', time: '16:00', type: 'quote_created', direction: 'none', description: 'Generated formal quote #QC-2024-042 — Interior repaint, 4 rooms + hallways, premium paint.', status: 'completed' },
    { id: 't1-7', date: '2024-12-08', time: '16:30', type: 'quote_sent', direction: 'outbound', description: 'Quote sent to sarah.thompson@email.com. Valid for 30 days.', status: 'completed' },
    { id: 't1-8', date: '2024-12-10', time: '11:20', type: 'phone_in', direction: 'inbound', description: 'Client called with questions about paint warranty and prep work. Clarified 5-year warranty details.', status: 'completed' },
    { id: 't1-9', date: '2024-12-12', time: '09:00', type: 'email_in', direction: 'inbound', description: 'Client replied — approved quote and requested start date ASAP. Wants to be home during work.', status: 'completed' },
    { id: 't1-10', date: '2024-12-15', time: '08:00', type: 'project_started', direction: 'none', description: 'Project started. Crew of 3 (Mike R., Jason T., Carlos M.) on site. Furniture moved & rooms prepped.', status: 'completed' },
    { id: 't1-11', date: '2024-12-19', time: '17:00', type: 'project_completed', direction: 'none', description: 'Project completed — all 4 rooms + hallways. Client walk-through approved. Final payment received ($4,200).', status: 'completed' },
    { id: 't1-12', date: '2025-01-10', time: '10:00', type: 'follow_up', direction: 'outbound', description: 'Follow-up call — client extremely happy. Asked for business cards to refer friends. Left 5-star review on Google.', status: 'completed' },
  ],
  'lead-2': [
    { id: 't2-1', date: '2024-12-20', time: '11:30', type: 'created', direction: 'inbound', description: 'Lead received from referral (Sarah Thompson). Exterior repaint — 2-story home in North York.', status: 'completed' },
    { id: 't2-2', date: '2024-12-20', time: '12:00', type: 'email_out', direction: 'outbound', description: 'Sent personalized referral thank-you email with exterior painting portfolio attached.', status: 'completed' },
    { id: 't2-3', date: '2024-12-22', time: '15:00', type: 'phone_out', direction: 'outbound', description: 'Initial call with Michael. Discussed timeline (wants spring), current condition of siding, colour preferences.', status: 'completed' },
    { id: 't2-4', date: '2025-01-03', time: '09:30', type: 'phone_in', direction: 'inbound', description: 'Client called back after the holidays. Ready to schedule a site visit for January.', status: 'completed' },
    { id: 't2-5', date: '2025-01-06', time: '14:00', type: 'appointment_booked', direction: 'none', description: 'Site visit scheduled for January 10 — 78 Bayview Avenue, North York.', status: 'completed' },
    { id: 't2-6', date: '2025-01-10', time: '14:00', type: 'appointment_completed', direction: 'none', description: 'Site visit completed. Assessed full exterior — aluminum siding, some peeling near windows. Took measurements.', status: 'completed' },
    { id: 't2-7', date: '2025-01-11', time: '10:00', type: 'quote_created', direction: 'none', description: 'Quote #QC-2025-003 created — Full exterior prep + 2 coats premium exterior paint + trim.', status: 'completed' },
    { id: 't2-8', date: '2025-01-12', time: '11:00', type: 'phone_out', direction: 'outbound', description: 'Called Michael to walk through the quote. He wants to review with spouse. Follow-up in 3 days.', status: 'completed' },
    { id: 't2-9', date: '2025-01-15', time: '10:00', type: 'follow_up', direction: 'outbound', description: 'PENDING: Scheduled follow-up call to discuss quote decision.', status: 'pending' },
  ],
  'lead-3': [
    { id: 't3-1', date: '2024-12-28', time: '13:45', type: 'created', direction: 'inbound', description: 'Lead from Instagram DM — interested in cabinet refinishing. Kitchen has 20 doors + 8 drawer fronts.', status: 'completed' },
    { id: 't3-2', date: '2024-12-28', time: '14:00', type: 'email_out', direction: 'outbound', description: 'Sent cabinet refinishing info package with before/after photos and colour options.', status: 'completed' },
    { id: 't3-3', date: '2025-01-02', time: '16:30', type: 'phone_out', direction: 'outbound', description: 'Called Jennifer. She wants espresso finish. Current cabinets are natural oak — good candidate for refinishing.', status: 'completed' },
    { id: 't3-4', date: '2025-01-05', time: '10:00', type: 'appointment_booked', direction: 'none', description: 'Kitchen assessment booked for January 9 at 10 AM — 123 Queen Street, Mississauga.', status: 'completed' },
    { id: 't3-5', date: '2025-01-09', time: '10:15', type: 'appointment_completed', direction: 'none', description: 'Kitchen assessment completed. Cabinets are solid wood — excellent candidate. Door samples shown to client.', status: 'completed' },
    { id: 't3-6', date: '2025-01-10', time: '11:00', type: 'email_in', direction: 'inbound', description: 'Client sent email requesting sample quote with hardware upgrade options.', status: 'completed' },
    { id: 't3-7', date: '2025-01-11', time: '15:00', type: 'quote_created', direction: 'none', description: 'Quote #QC-2025-004 — Cabinet refinishing (20 doors, 8 drawers) + hardware upgrade + surface prep.', status: 'completed' },
    { id: 't3-8', date: '2025-01-14', time: '09:00', type: 'quote_sent', direction: 'outbound', description: 'Quote sent to j.adams@email.com ($3,175.30). Highlighted 2-week completion time.', status: 'completed' },
    { id: 't3-9', date: '2025-01-17', time: '10:00', type: 'follow_up', direction: 'outbound', description: 'PENDING: Follow-up scheduled to check if Jennifer has reviewed the quote.', status: 'pending' },
  ],
  'lead-4': [
    { id: 't4-1', date: '2025-01-08', time: '10:30', type: 'created', direction: 'inbound', description: 'Lead from website — living room and hallway repaint. First-time homeowner.', status: 'completed' },
    { id: 't4-2', date: '2025-01-08', time: '11:00', type: 'email_out', direction: 'outbound', description: 'Automated welcome email sent with guide to choosing interior paint colours.', status: 'completed' },
    { id: 't4-3', date: '2025-01-08', time: '15:00', type: 'phone_out', direction: 'outbound', description: 'Left voicemail for David. Will try again tomorrow.', status: 'completed' },
    { id: 't4-4', date: '2025-01-09', time: '10:00', type: 'phone_out', direction: 'outbound', description: 'Second call attempt — no answer. Sent follow-up text message.', status: 'completed' },
    { id: 't4-5', date: '2025-01-12', time: '11:00', type: 'follow_up', direction: 'outbound', description: 'PENDING: Third follow-up call scheduled.', status: 'pending' },
  ],
  'lead-5': [
    { id: 't5-1', date: '2025-01-05', time: '08:45', type: 'created', direction: 'inbound', description: 'Lead from Google — commercial painting for office space (~3,000 sq ft) in Markham.', status: 'completed' },
    { id: 't5-2', date: '2025-01-05', time: '09:30', type: 'phone_out', direction: 'outbound', description: 'Called Lisa. Discussed commercial requirements — after-hours work preferred, low-VOC paint needed.', status: 'completed' },
    { id: 't5-3', date: '2025-01-06', time: '10:00', type: 'email_out', direction: 'outbound', description: 'Sent commercial portfolio, insurance certificates, and WHMIS compliance documentation.', status: 'completed' },
    { id: 't5-4', date: '2025-01-08', time: '14:00', type: 'phone_in', direction: 'inbound', description: 'Lisa called to schedule site visit. Needs assessment for weekend/evening work logistics.', status: 'completed' },
    { id: 't5-5', date: '2025-01-10', time: '18:00', type: 'appointment_booked', direction: 'none', description: 'After-hours site visit scheduled for January 15 at 6 PM — 789 Main Street, Markham.', status: 'completed' },
    { id: 't5-6', date: '2025-01-15', time: '18:15', type: 'appointment_completed', direction: 'none', description: 'Evening site visit completed. Large open-plan office, 3 meeting rooms, 2 washrooms. Client very professional.', status: 'completed' },
    { id: 't5-7', date: '2025-01-15', time: '20:00', type: 'email_out', direction: 'outbound', description: 'Sent preliminary scope document and timeline options (weekend vs. phased evenings).', status: 'completed' },
    { id: 't5-8', date: '2025-01-20', time: '10:00', type: 'follow_up', direction: 'outbound', description: 'PENDING: Waiting for Lisa to review scope document and confirm preferred timeline.', status: 'pending' },
  ],
  'lead-6': [
    { id: 't6-1', date: '2025-01-06', time: '12:00', type: 'created', direction: 'inbound', description: 'Lead from neighbor referral — deck staining and fence painting in Oakville.', status: 'completed' },
    { id: 't6-2', date: '2025-01-06', time: '12:30', type: 'email_out', direction: 'outbound', description: 'Sent deck & fence service info with seasonal pricing (winter discount available).', status: 'completed' },
    { id: 't6-3', date: '2025-01-08', time: '14:00', type: 'phone_out', direction: 'outbound', description: 'Called Robert. He is considering a spring project. Will revisit in March. Low urgency.', status: 'completed' },
    { id: 't6-4', date: '2025-03-01', time: '10:00', type: 'follow_up', direction: 'outbound', description: 'PENDING: Spring follow-up scheduled — remind Robert about seasonal pricing.', status: 'pending' },
  ],
  'lead-7': [
    { id: 't7-1', date: '2025-01-09', time: '16:00', type: 'created', direction: 'inbound', description: 'Lead from Facebook ad — bedroom and bathroom repaint. Needs color consultation.', status: 'completed' },
    { id: 't7-2', date: '2025-01-09', time: '16:30', type: 'email_out', direction: 'outbound', description: 'Sent welcome email with color consultation booking link and our top bedroom colour trends.', status: 'completed' },
    { id: 't7-3', date: '2025-01-10', time: '11:00', type: 'phone_out', direction: 'outbound', description: 'Spoke with Amanda. She wants warm neutrals for bedroom, something fresh for bathroom. Booked consultation.', status: 'completed' },
    { id: 't7-4', date: '2025-01-13', time: '14:00', type: 'appointment_booked', direction: 'none', description: 'Color consultation booked for January 17 at 2 PM — 567 Dundas Street, Toronto.', status: 'completed' },
    { id: 't7-5', date: '2025-01-17', time: '14:00', type: 'appointment_completed', direction: 'none', description: 'PENDING: Appointment scheduled — color consultation with Amanda.', status: 'pending' },
  ],
  'lead-8': [
    { id: 't8-1', date: '2024-11-25', time: '09:00', type: 'created', direction: 'inbound', description: 'Lead from website — full exterior repaint including trim and garage door. Brampton location.', status: 'completed' },
    { id: 't8-2', date: '2024-11-26', time: '10:00', type: 'phone_out', direction: 'outbound', description: 'Called James. Discussed project scope. He is also getting quotes from 2 competitors.', status: 'completed' },
    { id: 't8-3', date: '2024-11-28', time: '14:00', type: 'appointment_completed', direction: 'none', description: 'Site visit completed. Extensive prep work needed — some wood rot on fascia boards.', status: 'completed' },
    { id: 't8-4', date: '2024-11-30', time: '16:00', type: 'quote_created', direction: 'none', description: 'Quote #QC-2024-038 created — $5,500 (higher than competitors due to wood repair recommendation).', status: 'completed' },
    { id: 't8-5', date: '2024-12-02', time: '09:00', type: 'quote_sent', direction: 'outbound', description: 'Quote sent to j.wilson@email.com.', status: 'completed' },
    { id: 't8-6', date: '2024-12-10', time: '11:00', type: 'phone_in', direction: 'inbound', description: 'James called to say he went with a lower quote. Mentioned price was the deciding factor.', status: 'completed' },
    { id: 't8-7', date: '2024-12-10', time: '11:30', type: 'note', direction: 'none', description: 'Marked as LOST. Note: Competitor underbid by ~$1,500. No discussion on quality differences — client price-sensitive.', status: 'completed' },
    { id: 't8-8', date: '2024-12-20', time: '10:00', type: 'follow_up', direction: 'outbound', description: 'Sent brief "sorry it didn\'t work out" email. Left door open for future projects or if competitor work has issues.', status: 'completed' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helper components                                                 */
/* ------------------------------------------------------------------ */

function StatusIcon({ status }: { status: EntryStatus }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
    case 'pending':
      return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
    case 'cancelled':
      return <XCircle className="h-3.5 w-3.5 text-red-500" />;
  }
}

function DirectionBadge({ direction }: { direction: string }) {
  if (direction === 'none') return null;
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[10px] px-1.5 py-0 h-5 font-medium',
        direction === 'inbound'
          ? 'border-green-300 text-green-700 bg-green-50'
          : 'border-blue-300 text-blue-700 bg-blue-50'
      )}
    >
      {direction === 'inbound' ? 'Inbound' : 'Outbound'}
    </Badge>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-amber-100';
  if (score >= 40) return 'bg-orange-100';
  return 'bg-red-100';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Hot';
  if (score >= 60) return 'Warm';
  if (score >= 40) return 'Cool';
  return 'Cold';
}

const STATUS_STYLES: Record<string, string> = {
  won: 'bg-green-100 text-green-800',
  qualified: 'bg-blue-100 text-blue-800',
  proposal: 'bg-purple-100 text-purple-800',
  contacted: 'bg-cyan-100 text-cyan-800',
  new: 'bg-gray-100 text-gray-700',
  lost: 'bg-red-100 text-red-800',
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ClientHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return DEMO_LEADS;
    return DEMO_LEADS.filter(
      (l) =>
        l.firstName.toLowerCase().includes(q) ||
        l.lastName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedLead = useMemo(
    () => DEMO_LEADS.find((l) => l.id === selectedLeadId) || null,
    [selectedLeadId]
  );

  const timeline = useMemo(
    () => (selectedLeadId ? TIMELINE_DATA[selectedLeadId] || [] : []),
    [selectedLeadId]
  );

  const handleQuickAction = (action: string) => {
    if (!selectedLead) return;
    toast({
      title: `${action}`,
      description: `${action} initiated for ${selectedLead.firstName} ${selectedLead.lastName}.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Client History</h2>
        <p className="text-sm text-muted-foreground">
          View interaction timelines and client details
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client Selector Dropdown */}
      {!selectedLead && (
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy">
              Select a Client
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              {filteredLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No clients match your search.
                </p>
              ) : (
                filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/70"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy text-sm font-semibold">
                      {lead.firstName[0]}
                      {lead.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] px-1.5 py-0 h-5 capitalize shrink-0',
                            STATUS_STYLES[lead.status]
                          )}
                        >
                          {lead.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.email} · {lead.city}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-muted-foreground">
                        Last contact
                      </p>
                      <p className="text-xs font-medium">
                        {new Date(lead.lastContact).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main View: Timeline + Sidebar */}
      {selectedLead && (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar Toggle (mobile) */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden self-start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Details
              </>
            )}
          </Button>

          {/* Summary Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full lg:w-80 shrink-0"
              >
                <Card className="dashboard-card sticky top-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white text-sm font-bold">
                        {selectedLead.firstName[0]}
                        {selectedLead.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base text-navy truncate">
                          {selectedLead.firstName} {selectedLead.lastName}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] px-1.5 py-0 h-5 capitalize',
                            STATUS_STYLES[selectedLead.status]
                          )}
                        >
                          {selectedLead.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{selectedLead.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Hash className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span className="text-xs">
                          {selectedLead.address}
                          <br />
                          {selectedLead.city}, {selectedLead.postalCode}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Lead Score */}
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Lead Score
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Star className="h-3.5 w-3.5 text-gold" />
                          <span
                            className={cn(
                              'text-lg font-bold',
                              getScoreColor(selectedLead.leadScore)
                            )}
                          >
                            {selectedLead.leadScore}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] px-1.5 py-0 h-5 mt-0.5',
                            getScoreBgColor(selectedLead.leadScore),
                            getScoreColor(selectedLead.leadScore)
                          )}
                        >
                          {getScoreLabel(selectedLead.leadScore)}
                        </Badge>
                      </div>

                      {/* Revenue */}
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Revenue
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <DollarSign className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-lg font-bold text-navy">
                            {selectedLead.totalRevenue > 0
                              ? `$${selectedLead.totalRevenue.toLocaleString()}`
                              : '—'}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {selectedLead.projectCount} project
                          {selectedLead.projectCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="rounded-lg bg-muted/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Service Type
                      </p>
                      <p className="text-sm font-medium text-navy mt-0.5">
                        {selectedLead.serviceType}
                      </p>
                    </div>

                    {/* Last Contact */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Contact</span>
                      <span className="font-medium">
                        {new Date(selectedLead.lastContact).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    </div>

                    <Separator />

                    {/* Quick Actions */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Quick Actions
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleQuickAction('Call Client')}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleQuickAction('Send Email')}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleQuickAction('Schedule Appointment')}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleQuickAction('Create Quote')}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Quote
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Back */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground"
                      onClick={() => setSelectedLeadId(null)}
                    >
                      <ArrowRight className="h-3.5 w-3.5 mr-1 rotate-180" />
                      Back to client list
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-gold" />
              <h3 className="text-lg font-semibold text-navy">
                Interaction Timeline
              </h3>
              <Badge variant="outline" className="ml-auto text-xs">
                {timeline.length} entries
              </Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-1">
                  {timeline.map((entry, index) => {
                    const config = TYPE_CONFIG[entry.type];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        className="relative"
                      >
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            'absolute -left-6 top-3 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white shadow-sm z-10',
                            config.bgColor,
                            entry.status === 'pending' && 'ring-2 ring-amber-300 ring-offset-1'
                          )}
                        >
                          <Icon className={cn('h-3 w-3', config.color)} />
                        </div>

                        {/* Entry card */}
                        <div
                          className={cn(
                            'ml-3 rounded-lg border p-3 transition-colors',
                            entry.status === 'pending'
                              ? 'border-amber-200 bg-amber-50/50'
                              : entry.status === 'cancelled'
                                ? 'border-red-200 bg-red-50/30 opacity-70'
                                : 'bg-card hover:bg-muted/30'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={cn(
                                  'text-[11px] font-medium',
                                  config.color
                                )}
                              >
                                {config.label}
                              </span>
                              <DirectionBadge direction={entry.direction} />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <StatusIcon status={entry.status} />
                              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                {new Date(entry.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                                {entry.time && ` · ${entry.time}`}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {entry.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {timeline.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No interactions recorded for this client.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
