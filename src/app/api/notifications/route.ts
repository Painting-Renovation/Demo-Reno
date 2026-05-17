import { NextRequest, NextResponse } from 'next/server';
import { supabase, toSnakeCase, toCamelCase } from '@/lib/supabase-server';

// GET /api/notifications — fetch notification settings
export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from('NotificationSettings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows found — create default settings
      const { data: newSettings, error: createError } = await supabase
        .from('NotificationSettings')
        .insert({})
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      return NextResponse.json(toCamelCase(newSettings));
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(settings));
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/notifications — update notification settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { data: existingSettings, error: findError } = await supabase
      .from('NotificationSettings')
      .select('*')
      .limit(1)
      .single();

    // PGRST116 = no rows returned
    const noSettings = findError && findError.code === 'PGRST116';
    if (findError && !noSettings) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (noSettings) {
      // Create with the body data
      const { data: newSettings, error: createError } = await supabase
        .from('NotificationSettings')
        .insert(toSnakeCase(body))
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      return NextResponse.json(toCamelCase(newSettings));
    }

    // Update existing settings
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'newLead', 'newAppointment', 'quoteSent', 'projectUpdate',
      'dailySummary', 'weeklyReport', 'emailEnabled', 'slackEnabled',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: updatedSettings, error: updateError } = await supabase
      .from('NotificationSettings')
      .update(toSnakeCase(updateData))
      .eq('id', (existingSettings as Record<string, unknown>).id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(updatedSettings));
  } catch (error) {
    console.error('PUT /api/notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
