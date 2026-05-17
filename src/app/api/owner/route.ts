import { NextRequest, NextResponse } from 'next/server';
import { supabase, toSnakeCase, toCamelCase } from '@/lib/supabase-server';

// GET /api/owner — fetch owner profile
export async function GET() {
  try {
    const { data: owner, error } = await supabase
      .from('Owner')
      .select('id, email, name, phone, company, address, google_email, slack_webhook')
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    return NextResponse.json(toCamelCase(owner));
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

    const { data: owner, error } = await supabase
      .from('Owner')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !owner) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Simple password check (in production, use bcrypt)
    // For demo purposes, accept any password with a valid email
    // or match against a stored hash
    if (password.length < 6) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const camelOwner = toCamelCase(owner);

    return NextResponse.json({
      id: camelOwner.id,
      email: camelOwner.email,
      name: camelOwner.name,
      company: camelOwner.company,
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

    // Find the owner
    const { data: owner, error: findError } = await supabase
      .from('Owner')
      .select('id')
      .limit(1)
      .single();

    if (findError || !owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (address !== undefined) updateData.address = address;
    if (googleEmail !== undefined) updateData.googleEmail = googleEmail;
    if (slackWebhook !== undefined) updateData.slackWebhook = slackWebhook;

    const { data: updated, error } = await supabase
      .from('Owner')
      .update(toSnakeCase(updateData))
      .eq('id', owner.id)
      .select('id, email, name, phone, company, address, google_email, slack_webhook')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(updated));
  } catch (error) {
    console.error('PUT /api/owner error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
