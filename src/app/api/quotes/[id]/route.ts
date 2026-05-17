import { NextRequest, NextResponse } from 'next/server';
import { supabase, toSnakeCase, toCamelCase } from '@/lib/supabase-server';

// PUT /api/quotes/[id] — update quote
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if quote exists
    const { data: quote, error: findError } = await supabase
      .from('Quote')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'title', 'items', 'subtotal', 'tax', 'total',
      'status', 'validUntil', 'notes',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.validUntil) updateData.validUntil = new Date(body.validUntil).toISOString();

    const { data: updated, error } = await supabase
      .from('Quote')
      .update(toSnakeCase(updateData))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(updated));
  } catch (error) {
    console.error('PUT /api/quotes/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/quotes/[id] — delete quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('Quote')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/quotes/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
