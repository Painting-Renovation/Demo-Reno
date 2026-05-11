import { NextRequest, NextResponse } from 'next/server';

// Mock communication data
const mockCommunications = [
  { id: 'c1', leadId: '1', leadName: 'Sarah Johnson', type: 'email', direction: 'outbound', summary: 'Sent welcome email with service brochure', notes: 'Included pricing PDF and portfolio link. Follow up in 3 days.', duration: null, followUpDate: null, followUpNotes: null, createdAt: '2024-12-01T09:15:00Z' },
  { id: 'c2', leadId: '1', leadName: 'Sarah Johnson', type: 'call', direction: 'inbound', summary: 'Initial inquiry about interior painting', notes: 'Interested in living room and bedroom repainting. Wants estimate for 1200 sq ft.', duration: 12, followUpDate: null, followUpNotes: null, createdAt: '2024-11-30T14:30:00Z' },
  { id: 'c3', leadId: '2', leadName: 'Michael Chen', type: 'call', direction: 'outbound', summary: 'Follow-up on estimate request', notes: 'Discussed timeline and color preferences. They want to proceed with Benjamin Moore colors.', duration: 8, followUpDate: '2024-12-05', followUpNotes: 'Send revised estimate', createdAt: '2024-11-29T11:00:00Z' },
  { id: 'c4', leadId: '2', leadName: 'Michael Chen', type: 'email', direction: 'inbound', summary: 'Requested detailed quote for exterior painting', notes: 'Attached photos of current exterior. Wants quote for full exterior repaint.', duration: null, followUpDate: null, followUpNotes: null, createdAt: '2024-11-28T16:45:00Z' },
  { id: 'c5', leadId: '3', leadName: 'Emily Rodriguez', type: 'text', direction: 'inbound', summary: 'Asked about cabinet refinishing availability', notes: 'Has 15 cabinets in kitchen. Looking for white conversion.', duration: null, followUpDate: null, followUpNotes: null, createdAt: '2024-11-27T10:20:00Z' },
  { id: 'c6', leadId: '3', leadName: 'Emily Rodriguez', type: 'call', direction: 'outbound', summary: 'Discussed cabinet refinishing options', notes: 'Provided estimate range $3000-$4500. Scheduled in-person consultation.', duration: 15, followUpDate: '2024-12-03', followUpNotes: 'In-home consultation scheduled', createdAt: '2024-11-27T10:45:00Z' },
  { id: 'c7', leadId: '4', leadName: 'David Thompson', type: 'in-person', direction: 'outbound', summary: 'Site visit for commercial painting quote', notes: 'Measured office space ~3500 sq ft. Taking photos for estimate. Need specialty paint for accent walls.', duration: null, followUpDate: '2024-12-08', followUpNotes: 'Deliver commercial estimate', createdAt: '2024-11-26T09:00:00Z' },
  { id: 'c8', leadId: '5', leadName: 'Amanda Williams', type: 'email', direction: 'outbound', summary: 'Sent estimate for bedroom repaint', notes: '2 bedrooms, trim work included. Estimate $2,800. Offered 10% seasonal discount.', duration: null, followUpDate: null, followUpNotes: null, createdAt: '2024-11-25T13:30:00Z' },
  { id: 'c9', leadId: '5', leadName: 'Amanda Williams', type: 'call', direction: 'inbound', summary: 'Accepted estimate with minor changes', notes: 'Wants to add accent wall in master bedroom. New total $3,100. Ready to book.', duration: 5, followUpDate: null, followUpNotes: null, createdAt: '2024-11-25T15:00:00Z' },
  { id: 'c10', leadId: '6', leadName: 'Robert Kim', type: 'call', direction: 'outbound', summary: 'Cold call follow-up from website inquiry', notes: 'No answer left voicemail. Will try again tomorrow.', duration: 1, followUpDate: null, followUpNotes: null, createdAt: '2024-11-24T16:00:00Z' },
  { id: 'c11', leadId: '7', leadName: 'Lisa Park', type: 'email', direction: 'inbound', summary: 'Re-engagement response from seasonal campaign', notes: 'Interested in spring painting. Has a 3-bedroom home. Wants color consultation first.', duration: null, followUpDate: '2024-12-10', followUpNotes: 'Schedule color consultation', createdAt: '2024-11-23T08:15:00Z' },
  { id: 'c12', leadId: '8', leadName: 'James Cooper', type: 'in-person', direction: 'outbound', summary: 'Completed final walkthrough for exterior project', notes: 'Client happy with results. Requested Google review. Project completed on time and under budget.', duration: null, followUpDate: null, followUpNotes: null, createdAt: '2024-11-22T14:00:00Z' },
];

// In-memory store for new communications
let communications = [...mockCommunications];

// GET /api/communications — list communication logs (filterable by leadId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const type = searchParams.get('type');

    let data = [...communications];

    if (leadId) {
      data = data.filter((c) => c.leadId === leadId);
    }
    if (type) {
      data = data.filter((c) => c.type === type);
    }

    // Sort by date descending
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/communications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/communications — create a new communication log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      leadId,
      leadName,
      type,
      direction,
      summary,
      notes,
      duration,
      followUpDate,
      followUpNotes,
    } = body;

    if (!leadId || !notes) {
      return NextResponse.json(
        { error: 'Lead ID and notes are required' },
        { status: 400 }
      );
    }

    // If no leadName provided, try to construct from mock data
    const name = leadName || 'Unknown Lead';

    const newComm = {
      id: `c${Date.now()}`,
      leadId,
      leadName: name,
      type: type || 'call',
      direction: direction || 'outbound',
      summary: summary || notes.substring(0, 100),
      notes,
      duration: duration || null,
      followUpDate: followUpDate || null,
      followUpNotes: followUpNotes || null,
      createdAt: new Date().toISOString(),
    };

    communications.unshift(newComm);

    return NextResponse.json(newComm, { status: 201 });
  } catch (error) {
    console.error('POST /api/communications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
