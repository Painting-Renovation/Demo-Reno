import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/appointments — list appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    } else {
      // By default, show upcoming (non-completed, non-cancelled)
      // But if no filter, show all
    }

    const appointments = await db.appointment.findMany({
      where,
      orderBy: { date: 'asc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ data: appointments });
  } catch (error) {
    console.error('GET /api/appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/appointments — create appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone, address,
      serviceType, notes, date, duration, leadId,
    } = body;

    if (!firstName || !lastName || !email || !date) {
      return NextResponse.json(
        { error: 'Name, email, and date are required' },
        { status: 400 }
      );
    }

    const appointment = await db.appointment.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        serviceType: serviceType || null,
        notes: notes || null,
        date: new Date(date),
        duration: duration || 60,
        leadId: leadId || null,
        status: 'scheduled',
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('POST /api/appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
