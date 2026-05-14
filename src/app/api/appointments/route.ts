import { NextRequest, NextResponse } from 'next/server';
import { supabase, toCamelCase, rowsToCamelCase, toSnakeCase } from '@/lib/supabase-server';

// GET /api/appointments — list appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('Appointment')
      .select('*')
      .order('date', { ascending: true });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const appointments = rowsToCamelCase(data || []);

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
      preferredDate,
    } = body;

    // Support both `date` (dashboard) and `preferredDate` (appointment form)
    const resolvedDate = date || preferredDate;

    if (!firstName || !lastName || !email || !resolvedDate) {
      return NextResponse.json(
        { error: 'Name, email, and date are required' },
        { status: 400 }
      );
    }

    const { data: appointment, error } = await supabase
      .from('Appointment')
      .insert(toSnakeCase({
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        serviceType: serviceType || null,
        notes: notes || null,
        date: new Date(resolvedDate).toISOString(),
        duration: duration || 60,
        leadId: leadId || null,
        status: 'scheduled',
      }))
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(appointment), { status: 201 });
  } catch (error) {
    console.error('POST /api/appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
