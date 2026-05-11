import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/projects — list projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;

    const projects = await db.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects — create project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, description, serviceType, status, startDate, endDate,
      estimatedCost, address, notes, teamMembers, leadId,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        name,
        description: description || null,
        serviceType: serviceType || null,
        status: status || 'pending',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        estimatedCost: estimatedCost ? parseFloat(String(estimatedCost)) : null,
        address: address || null,
        notes: notes || null,
        teamMembers: teamMembers || null,
        leadId: leadId || null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
