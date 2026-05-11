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
    const includeScore = searchParams.get('score') === 'true';

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          _count: { select: { appointments: true, projects: true, quotes: true, activities: true } },
        },
      }),
      db.lead.count({ where }),
    ]);

    // Compute lead scores if requested
    const data = includeScore
      ? leads.map((lead) => {
          const activityCount = lead._count.activities;
          const statusOrder = ['new', 'contacted', 'qualified', 'proposal', 'won'];
          const statusIdx = statusOrder.indexOf(lead.status) || 0;
          const engagementScore = Math.min(30, Math.round((statusIdx * 4) + (activityCount * 3)));

          const sourceQualityMap: Record<string, number> = {
            referral: 20,
            organic: 16,
            website: 14,
            google: 15,
            social: 10,
            phone: 12,
            'walk-in': 18,
          };
          const sourceQuality = sourceQualityMap[lead.leadSource] || 10;

          const priorityMap: Record<string, number> = { urgent: 30, high: 22, medium: 14, low: 6 };
          const timelineUrgency = priorityMap[lead.priority] || 14;

          const estValue = lead.estimatedValue || 0;
          const projectValue = estValue > 5000 ? 30 : estValue > 2000 ? 22 : estValue > 500 ? 14 : 6;

          const funnelOrder = ['awareness', 'interest', 'consideration', 'intent', 'evaluation', 'purchase'];
          const funnelIdx = funnelOrder.indexOf(lead.funnelStage) || 0;
          const responseRate = Math.min(20, Math.round(2 + (funnelIdx * 3.5)));

          const totalScore = engagementScore + sourceQuality + timelineUrgency + projectValue + responseRate;
          const overallScore = Math.min(100, Math.round(totalScore / 130 * 100));

          return {
            ...lead,
            score: overallScore,
            scoreBreakdown: {
              engagement: { score: engagementScore, max: 30 },
              sourceQuality: { score: sourceQuality, max: 20 },
              timelineUrgency: { score: timelineUrgency, max: 30 },
              projectValue: { score: projectValue, max: 30 },
              responseRate: { score: responseRate, max: 20 },
            },
          };
        })
      : leads;

    return NextResponse.json({
      data,
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
