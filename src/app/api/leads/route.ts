import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/leads — list leads with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const funnelStage = searchParams.get('funnelStage');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (funnelStage) where.funnelStage = funnelStage;

    const orderBy: Record<string, string> = sort === 'latest'
      ? { createdAt: 'desc' }
      : { createdAt: 'desc' };

    const leads = await db.lead.findMany({
      where,
      orderBy,
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ data: leads });
  } catch (error) {
    console.error('GET /api/leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/leads — create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone, address, city, postalCode,
      serviceType, projectDesc, budget, howHeard, leadSource,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        serviceType: serviceType || null,
        projectDesc: projectDesc || null,
        budget: budget || null,
        howHeard: howHeard || null,
        leadSource: leadSource || 'website',
        status: 'new',
        funnelStage: 'awareness',
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
