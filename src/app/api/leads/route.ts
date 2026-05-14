import { NextRequest, NextResponse } from 'next/server';
import { supabase, toCamelCase, rowsToCamelCase, toSnakeCase } from '@/lib/supabase-server';

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

    let query = supabase
      .from('Lead')
      .select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (funnelStage) {
      query = query.eq('funnel_stage', funnelStage);
    }

    // Text search across multiple fields using OR
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,city.ilike.%${search}%`
      );
    }

    // Sorting
    if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Count total matching records
    const { count: total, error: countError } = await supabase
      .from('Lead')
      .select('*', { count: 'exact', head: true })
      .eq(status && status !== 'all' ? 'status' : 'id', status && status !== 'all' ? status : 'id')
      .ilike(status && status !== 'all' ? 'id' : 'id', status && status !== 'all' ? 'id' : '%');

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const includeScore = searchParams.get('score') === 'true';

    // Apply pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leads = rowsToCamelCase(data || []);

    // Get counts for each lead (appointments, projects, quotes, activities)
    const leadsWithCounts = await Promise.all(leads.map(async (lead: Record<string, unknown>) => {
      const [apptRes, projRes, quoteRes, actRes] = await Promise.all([
        supabase.from('Appointment').select('*', { count: 'exact', head: true }).eq('lead_id', lead.id),
        supabase.from('Project').select('*', { count: 'exact', head: true }).eq('lead_id', lead.id),
        supabase.from('Quote').select('*', { count: 'exact', head: true }).eq('lead_id', lead.id),
        supabase.from('LeadActivity').select('*', { count: 'exact', head: true }).eq('lead_id', lead.id),
      ]);

      return {
        ...lead,
        _count: {
          appointments: apptRes.count || 0,
          projects: projRes.count || 0,
          quotes: quoteRes.count || 0,
          activities: actRes.count || 0,
        },
      };
    }));

    // Compute lead scores if requested
    const dataResult = includeScore
      ? leadsWithCounts.map((lead) => {
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
      : leadsWithCounts;

    // Get accurate total count with all filters applied
    let countQuery = supabase
      .from('Lead')
      .select('*', { count: 'exact', head: true });

    if (status && status !== 'all') countQuery = countQuery.eq('status', status);
    if (funnelStage) countQuery = countQuery.eq('funnel_stage', funnelStage);
    if (search) {
      countQuery = countQuery.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,city.ilike.%${search}%`
      );
    }

    const { count: accurateTotal } = await countQuery;

    return NextResponse.json({
      data: dataResult,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: accurateTotal || 0,
        totalPages: Math.ceil((accurateTotal || 0) / parseInt(limit)),
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

    const { data: lead, error: leadError } = await supabase
      .from('Lead')
      .insert(toSnakeCase({
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
      }))
      .select()
      .single();

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 500 });
    }

    const camelLead = toCamelCase(lead);

    // Create lead activity
    await supabase
      .from('LeadActivity')
      .insert(toSnakeCase({
        leadId: camelLead.id,
        type: 'estimate',
        description: `New lead created via ${leadSource || 'website'}`,
      }));

    // Create site audit entry
    await supabase
      .from('SiteAudit')
      .insert(toSnakeCase({ metric: 'estimate_request', value: 1 }));

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

    return NextResponse.json(camelLead, { status: 201 });
  } catch (error) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
