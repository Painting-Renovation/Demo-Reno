import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/quotes — list quotes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;

    const quotes = await db.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        lead: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ data: quotes });
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

    const quote = await db.quote.create({
      data: {
        title,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        subtotal: parseFloat(String(subtotal)) || 0,
        tax: parseFloat(String(tax)) || 0,
        total: parseFloat(String(total)) || 0,
        status: status || 'draft',
        validUntil: validUntil ? new Date(validUntil) : null,
        notes: notes || null,
        leadId: leadId || null,
        projectId: projectId || null,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('POST /api/quotes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
