import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST: Track visitor action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      page,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      action,
      elementId,
      userAgent,
      leadId,
    } = body;

    // Validate required fields
    if (!sessionId || !page) {
      return NextResponse.json(
        { error: 'Session ID and page are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Store in VisitorTracking
    const tracking = await db.visitorTracking.create({
      data: {
        sessionId,
        page,
        referrer: referrer || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        action: action || null,
        elementId: elementId || null,
        userAgent: userAgent || null,
        leadId: leadId || null,
      },
    });

    // If action is form_submit or estimate_request, also update SiteAudit
    if (action === 'form_submit' || action === 'estimate_request') {
      const metric = action === 'estimate_request' ? 'estimate_request' : 'form_submission';

      await db.siteAudit.create({
        data: {
          metric,
          value: 1,
          metadata: JSON.stringify({
            sessionId,
            page,
            utmSource,
            utmMedium,
            utmCampaign,
            elementId,
            leadId,
          }),
        },
      });
    }

    return NextResponse.json(
      { success: true, data: tracking },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to track visitor action';
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
