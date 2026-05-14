import { NextRequest, NextResponse } from 'next/server';
import { supabase, toCamelCase, rowsToCamelCase, toSnakeCase } from '@/lib/supabase-server';

// GET /api/leads/[id] — get lead with activities
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: lead, error: leadError } = await supabase
      .from('Lead')
      .select('*')
      .eq('id', id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Fetch activities separately (relation)
    const { data: activities, error: actError } = await supabase
      .from('LeadActivity')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false });

    if (actError) {
      return NextResponse.json({ error: actError.message }, { status: 500 });
    }

    const result = {
      ...toCamelCase(lead),
      activities: rowsToCamelCase(activities || []),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/leads/[id] — update a lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if lead exists
    const { data: existingLead, error: findError } = await supabase
      .from('Lead')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const camelLead = toCamelCase(existingLead);
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'status', 'priority', 'funnelStage', 'notes', 'phone',
      'address', 'city', 'postalCode', 'serviceType', 'projectDesc',
      'budget', 'estimatedValue', 'assignedTo',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Track status changes as activity
    if (body.status && body.status !== (camelLead as Record<string, unknown>).status) {
      await supabase
        .from('LeadActivity')
        .insert(toSnakeCase({
          leadId: id,
          type: 'status_change',
          description: `Status changed from "${(camelLead as Record<string, unknown>).status}" to "${body.status}"`,
          outcome: body.status,
        }));

      // Update lastContacted when status changes
      updateData.lastContacted = new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from('Lead')
      .update(toSnakeCase(updateData))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(updated));
  } catch (error) {
    console.error('PUT /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/leads/[id] — delete a lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('Lead')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
