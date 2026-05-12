import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/notifications — fetch notification settings
export async function GET() {
  try {
    let settings = await db.notificationSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await db.notificationSettings.create({
        data: {},
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/notifications — update notification settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    let settings = await db.notificationSettings.findFirst();

    if (!settings) {
      settings = await db.notificationSettings.create({
        data: body,
      });
    } else {
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

      settings = await db.notificationSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('PUT /api/notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
