import { NextRequest, NextResponse } from 'next/server';
import { supabase, toSnakeCase } from '@/lib/supabase-server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// PUT: Bulk update leads status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status, funnelStage } = body as {
      ids: string[];
      status: string;
      funnelStage?: string;
    };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required and must not be empty' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Build update data
    const updateData: Record<string, string> = { status };
    if (funnelStage) {
      updateData.funnelStage = funnelStage;
    }

    const { error, count } = await supabase
      .from('Lead')
      .update(toSnakeCase(updateData))
      .in('id', ids);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    // Create activities for each updated lead
    for (const leadId of ids) {
      await supabase
        .from('LeadActivity')
        .insert(toSnakeCase({
          leadId,
          type: 'follow-up',
          description: `Bulk update: status changed to "${status}"${funnelStage ? `, funnel stage to "${funnelStage}"` : ''}`,
          outcome: status,
        }));
    }

    return NextResponse.json(
      {
        success: true,
        data: { count: count || ids.length },
        message: `${count || ids.length} leads updated successfully`,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to bulk update leads';
    console.error('Error bulk updating leads:', error);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
