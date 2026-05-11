import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/leads — list leads with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const funnelStage = searchParams.get('funnelStage');
    const search = searchParams.get('search');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';
    const sort = searchParams.get('sort');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (funnelStage) where.funnelStage = funnelStage;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const orderBy: Record<string, string> = sort === 'oldest'
      ? { createdAt: 'asc' }
      : { createdAt: 'desc' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          _count: { select: { appointments: true, projects: true, quotes: true } },
        },
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({
      data: leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
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

    // Create lead activity
    await db.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'estimate',
        description: `New lead created via ${leadSource || 'website'}`,
      },
    });

    // Create site audit entry
    await db.siteAudit.create({
      data: { metric: 'estimate_request', value: 1 },
    });

    // Fire notification to notification service (non-blocking)
    fetch('/api/notify?XTransformPort=3001', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_lead',
        title: `New Lead: ${firstName} ${lastName}`,
        message: `A new lead has been submitted via the website.${serviceType ? ` Service: ${serviceType}` : ''}${city ? ` Location: ${city}` : ''}`,
        leadName: `${firstName} ${lastName}`,
        leadEmail: email,
        service: serviceType || undefined,
      }),
    }).catch(() => {
      // Non-blocking — don't fail the lead creation if notification fails
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
