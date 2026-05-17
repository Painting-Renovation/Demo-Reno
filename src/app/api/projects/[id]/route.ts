import { NextRequest, NextResponse } from 'next/server';
import { supabase, toSnakeCase, toCamelCase } from '@/lib/supabase-server';

// PUT /api/projects/[id] — update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if project exists
    const { data: project, error: findError } = await supabase
      .from('Project')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'name', 'description', 'serviceType', 'status',
      'estimatedCost', 'actualCost', 'address', 'notes',
      'teamMembers', 'beforeImages', 'afterImages',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.startDate) updateData.startDate = new Date(body.startDate).toISOString();
    if (body.endDate) updateData.endDate = new Date(body.endDate).toISOString();

    const { data: updated, error } = await supabase
      .from('Project')
      .update(toSnakeCase(updateData))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(updated));
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] — delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('Project')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
