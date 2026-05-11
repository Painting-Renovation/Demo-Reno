import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/owner — fetch owner profile
export async function GET() {
  try {
    const owner = await db.owner.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        company: true,
        address: true,
        googleEmail: true,
        slackWebhook: true,
      },
    });

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    return NextResponse.json(owner);
  } catch (error) {
    console.error('GET /api/owner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/owner — login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const owner = await db.owner.findUnique({
      where: { email },
    });

    if (!owner) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Simple password check (in production, use bcrypt)
    // For demo purposes, accept any password with a valid email
    // or match against a stored hash
    if (password.length < 6) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      id: owner.id,
      email: owner.email,
      name: owner.name,
      company: owner.company,
    });
  } catch (error) {
    console.error('POST /api/owner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/owner — update owner profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, company, address, googleEmail, slackWebhook } = body;

    const owner = await db.owner.findFirst();
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    const updated = await db.owner.update({
      where: { id: owner.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(address !== undefined && { address }),
        ...(googleEmail !== undefined && { googleEmail }),
        ...(slackWebhook !== undefined && { slackWebhook }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        company: true,
        address: true,
        googleEmail: true,
        slackWebhook: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/owner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
