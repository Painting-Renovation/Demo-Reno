import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET: Return approved testimonials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = { isApproved: true };
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return NextResponse.json(
      { success: true, data: testimonials },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch testimonials';
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST: Create testimonial (auto-approve featured ones)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, rating, text, service, isFeatured } = body;

    // Validate required fields
    if (!name || !text) {
      return NextResponse.json(
        { error: 'Name and text are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Auto-approve featured testimonials, otherwise they need manual approval
    const isApproved = isFeatured ? true : false;

    const testimonial = await db.testimonial.create({
      data: {
        name,
        location: location || null,
        rating: rating || 5,
        text,
        service: service || null,
        isFeatured: isFeatured || false,
        isApproved,
      },
    });

    return NextResponse.json(
      { success: true, data: testimonial },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create testimonial';
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
