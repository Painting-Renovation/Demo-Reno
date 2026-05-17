import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

// GET /api/quotes — list quotes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('Quote')
      .select('*')
      .order('createdAt', { ascending: false });

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

    // Convert to camelCase immediately so subsequent processing uses camelCase keys
    const quotes = data || [];

    // Enrich with lead info for quotes that have a leadId
    const enrichedQuotes = await Promise.all(quotes.map(async (quote: Record<string, unknown>) => {
      if (quote.leadId) {
        const { data: lead } = await supabase
          .from('Lead')
          .select('firstName, lastName')
          .eq('id', quote.leadId)
          .single();

        if (lead) {
          return {
            ...quote,
            lead: {
              firstName: lead.firstName,
              lastName: lead.lastName,
            },
          };
        }
      }
      return quote;
    }));

    return NextResponse.json({ data: enrichedQuotes });
  } catch (error) {
    console.error('GET /api/quotes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/quotes — create quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, items, subtotal, tax, total, status, validUntil, notes, leadId, projectId } = body;

    if (!title || !items) {
      return NextResponse.json({ error: 'Title and items are required' }, { status: 400 });
    }

    const { data: quote, error } = await supabase
      .from('Quote')
      .insert({
        title,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        subtotal: parseFloat(String(subtotal)) || 0,
        tax: parseFloat(String(tax)) || 0,
        total: parseFloat(String(total)) || 0,
        status: status || 'draft',
        validUntil: validUntil ? new Date(validUntil).toISOString() : null,
        notes: notes || null,
        leadId: leadId || null,
        projectId: projectId || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('POST /api/quotes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
