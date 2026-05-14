import { NextRequest, NextResponse } from 'next/server';
import { supabase, toCamelCase, rowsToCamelCase, toSnakeCase } from '@/lib/supabase-server';

// GET /api/projects — list projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('Project')
      .select('*')
      .order('created_at', { ascending: false });

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

    const projects = rowsToCamelCase(data || []);

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects — create project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, description, serviceType, status, startDate, endDate,
      estimatedCost, address, notes, teamMembers, leadId,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from('Project')
      .insert(toSnakeCase({
        name,
        description: description || null,
        serviceType: serviceType || null,
        status: status || 'pending',
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        estimatedCost: estimatedCost ? parseFloat(String(estimatedCost)) : null,
        address: address || null,
        notes: notes || null,
        teamMembers: teamMembers || null,
        leadId: leadId || null,
      }))
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(project), { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
