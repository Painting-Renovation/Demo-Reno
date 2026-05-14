import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import ZAI from 'z-ai-web-dev-sdk';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Addon {
  id: string;
  label: string;
  low: number;
  high: number;
  isPercentage: boolean;
}

interface ProjectDetails {
  address: string | null;
  roomWidth: number | null;
  roomLength: number | null;
  ceilingHeight: string | null;
  numRooms: number | null;
  totalSqft: number | null;
  condition: string | null;
  specialNotes: string | null;
}

interface ClientSideEstimate {
  low: number;
  high: number;
  recommended: number;
}

interface EstimateRequestBody {
  serviceType: string;
  serviceLabel: string;
  areaId: string | null;
  areaLabel: string | null;
  areaBaseLow: number;
  areaBaseHigh: number;
  qualityTier: string;
  qualityLabel: string;
  qualityBrand: string;
  qualityMultiplier: number;
  selectedAddons: Addon[];
  projectDetails: ProjectDetails;
  clientSideEstimate: ClientSideEstimate;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUserMessage(body: EstimateRequestBody): string {
  const lines: string[] = [];

  lines.push('## Pricing Calculator Data\n');

  lines.push('### Service Selection');
  lines.push(`- Service Type: ${body.serviceType}`);
  lines.push(`- Service Label: ${body.serviceLabel}`);

  lines.push('\n### Area / Scope');
  lines.push(`- Area ID: ${body.areaId ?? 'Not selected'}`);
  lines.push(`- Area Label: ${body.areaLabel ?? 'Not selected'}`);
  lines.push(`- Area Base Low: $${body.areaBaseLow}`);
  lines.push(`- Area Base High: $${body.areaBaseHigh}`);

  lines.push('\n### Paint Quality');
  lines.push(`- Quality Tier: ${body.qualityTier}`);
  lines.push(`- Quality Label: ${body.qualityLabel}`);
  lines.push(`- Quality Brand: ${body.qualityBrand}`);
  lines.push(`- Quality Multiplier: ${body.qualityMultiplier}x`);

  lines.push('\n### Selected Add-ons');
  if (body.selectedAddons.length === 0) {
    lines.push('- None');
  } else {
    for (const addon of body.selectedAddons) {
      const priceDesc = addon.isPercentage
        ? `+${addon.low}% to +${addon.high}%`
        : `$${addon.low} – $${addon.high}`;
      lines.push(`- ${addon.label} (${addon.id}): ${priceDesc} ${addon.isPercentage ? '[percentage]' : '[fixed]'}`);
    }
  }

  const d = body.projectDetails;
  lines.push('\n### Project Details');
  lines.push(`- Address: ${d.address ?? 'Not provided'}`);
  lines.push(`- Room Width: ${d.roomWidth !== null ? `${d.roomWidth} ft` : 'Not provided'}`);
  lines.push(`- Room Length: ${d.roomLength !== null ? `${d.roomLength} ft` : 'Not provided'}`);
  lines.push(`- Ceiling Height: ${d.ceilingHeight ?? 'Not provided (assume 8ft)'}`);
  lines.push(`- Number of Rooms: ${d.numRooms !== null ? d.numRooms : 'Not provided'}`);
  lines.push(`- Total Sq Ft: ${d.totalSqft !== null ? d.totalSqft : 'Not provided'}`);
  lines.push(`- Condition: ${d.condition ?? 'Not provided (assume Good)'}`);
  lines.push(`- Special Notes: ${d.specialNotes ?? 'None'}`);

  // Add calculated dimensions if room dimensions provided
  if (d.roomWidth && d.roomLength) {
    const ceilingH = (() => {
      switch (d.ceilingHeight) {
        case '9 ft': return 9;
        case '10 ft': return 10;
        case '11 ft or higher': return 11;
        case 'Vaulted/Cathedral': return 12;
        default: return 8;
      }
    })();
    const wallArea = 2 * (d.roomWidth + d.roomLength) * ceilingH;
    const ceilingArea = d.roomWidth * d.roomLength;
    lines.push(`- CALCULATED Wall Surface Area: ${wallArea} sq ft (2×(${d.roomWidth}+${d.roomLength})×${ceilingH})`);
    lines.push(`- CALCULATED Ceiling Area: ${ceilingArea} sq ft (${d.roomWidth}×${d.roomLength})`);
    lines.push(`- CALCULATED Total Paintable Area: ${wallArea + ceilingArea} sq ft`);
  }
  if (d.totalSqft) {
    const wallArea = Math.round(d.totalSqft * 2.5);
    lines.push(`- CALCULATED Estimated Wall Area (from floor sq ft): ${wallArea} sq ft (${d.totalSqft}×2.5)`);
  }

  const c = body.clientSideEstimate;
  lines.push('\n### Client-Side Estimate (for reference)');
  lines.push(`- Low: $${c.low}`);
  lines.push(`- High: $${c.high}`);
  lines.push(`- Recommended: $${c.recommended}`);

  lines.push('\n---');
  lines.push('Generate a detailed, AI-powered estimate using the calculation logic and output schema defined above. Return ONLY valid JSON.');

  return lines.join('\n');
}

function parseJsonResponse(raw: string | undefined | null): Record<string, unknown> {
  if (!raw || typeof raw !== 'string' || raw.trim().length === 0) {
    throw new Error('Empty LLM response');
  }

  const text = raw.trim();

  // Attempt 1: Direct JSON parse
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // continue to extraction
  }

  // Attempt 2: Extract from markdown code block — ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch?.[1]) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // continue
    }
  }

  // Attempt 3: Find first { and last } and try to parse that substring
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(candidate);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // continue
    }
  }

  throw new Error(`Could not parse valid JSON from LLM response. Response preview: ${text.substring(0, 200)}`);
}

function buildFallbackEstimate(body: EstimateRequestBody, errorMessage?: string): Record<string, unknown> {
  const c = body.clientSideEstimate;
  const worstCaseLow = Math.round(c.low * 1.25 / 50) * 50;
  const worstCaseHigh = Math.round(c.high * 1.35 / 50) * 50;

  // Track what the user actually provided
  const d = body.projectDetails;
  const userProvided: string[] = [
    `Service: ${body.serviceLabel}`,
    `Area: ${body.areaLabel ?? 'selected'}`,
    `Quality: ${body.qualityLabel} (${body.qualityBrand})`,
  ];
  const assumedDefaults: string[] = [];

  if (d.address) userProvided.push(`Address: ${d.address}`);
  else assumedDefaults.push('Address: Not provided');
  if (d.roomWidth) userProvided.push(`Room Width: ${d.roomWidth} ft`);
  else assumedDefaults.push('Room Width: Standard assumed');
  if (d.roomLength) userProvided.push(`Room Length: ${d.roomLength} ft`);
  else assumedDefaults.push('Room Length: Standard assumed');
  if (d.ceilingHeight) userProvided.push(`Ceiling Height: ${d.ceilingHeight}`);
  else assumedDefaults.push('Ceiling Height: 8 ft');
  if (d.numRooms) userProvided.push(`Number of Rooms: ${d.numRooms}`);
  else assumedDefaults.push('Number of Rooms: Standard assumed');
  if (d.totalSqft) userProvided.push(`Total Sq Ft: ${d.totalSqft}`);
  else assumedDefaults.push('Total Sq Ft: Average assumed');
  if (d.condition) userProvided.push(`Condition: ${d.condition}`);
  else assumedDefaults.push('Condition: Good');
  if (d.specialNotes) userProvided.push(`Special Notes: ${d.specialNotes}`);
  if (body.selectedAddons.length > 0) {
    userProvided.push(`Add-ons: ${body.selectedAddons.map(a => a.label).join(', ')}`);
  }

  return {
    disclaimer:
      'This is a preliminary, non-binding estimate based on the information provided. A final fixed-price quote requires an in-person site assessment. All prices are in CAD and subject to change based on final scope, material price fluctuations, and site conditions.',
    project_summary: `${body.serviceLabel} for ${body.areaLabel ?? 'selected area'}. Quality: ${body.qualityLabel} (${body.qualityBrand}).`,
    service_type: body.serviceType,
    area: body.areaLabel ?? 'Unknown',
    quality: `${body.qualityLabel} — ${body.qualityBrand}`,
    true_estimate: {
      low: c.low,
      high: c.high,
      label: 'True/Realistic Estimate',
    },
    worst_case_estimate: {
      low: worstCaseLow,
      high: worstCaseHigh,
      label: 'Worst-Case (with contingencies)',
    },
    recommended_budget: {
      amount: c.recommended,
      label: 'Recommended Budget',
    },
    line_items: [
      {
        item: `Base ${body.serviceLabel} — ${body.areaLabel ?? 'selected area'}`,
        low: c.low,
        high: c.high,
        notes: 'Client-side calculated estimate (AI estimate unavailable; please book an on-site assessment for accuracy).',
      },
    ],
    assumptions: [
      'Standard 8 ft ceiling height assumed.',
      'Good property condition assumed.',
      'Average-sized room/space for selected area assumed.',
      'Prices are before HST (13% Ontario).',
      ...(errorMessage ? [`⚠️ AI estimation unavailable: ${errorMessage}. Using client-side calculation as fallback.`] : []),
    ],
    potential_additions: [
      'Drywall repair may increase cost if condition is worse than expected.',
      'Complex trim or accents may add to the total.',
    ],
    next_steps: [
      'Book a free on-site assessment for a precise, fixed-price quote.',
      'Contact us to discuss timeline and scheduling.',
    ],
    hst_note: 'All prices shown are before HST (13%). HST will be added to the final invoice.',
    data_source: {
      user_provided: userProvided,
      assumed_defaults: assumedDefaults.length > 0 ? assumedDefaults : ['All required data was provided by user'],
    },
    isFallback: true,
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const MAX_WAIT_MS = 60_000;
  const deadline = Date.now() + MAX_WAIT_MS;

  // Read body once — the stream can only be consumed once
  let body: EstimateRequestBody;
  try {
    body = (await request.json()) as EstimateRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body. Expected valid JSON.' },
      { status: 400 },
    );
  }

  // --- Validate required fields ---------------------------------------------
  if (!body.serviceType || !body.qualityTier) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: serviceType and qualityTier are required.' },
      { status: 400 },
    );
  }

  try {
    // --- Read brain/context files -------------------------------------------
    const skillsDir = join(process.cwd(), 'skills', 'estimator');

    const [agentMd, skillMd] = await Promise.all([
      readFile(join(skillsDir, 'agent.md'), 'utf-8'),
      readFile(join(skillsDir, 'skill.md'), 'utf-8'),
    ]);

    // --- Build system prompt ------------------------------------------------
    const systemPrompt = [
      agentMd,
      '\n\n---\n\n',
      skillMd,
      '\n\nIMPORTANT INSTRUCTIONS:',
      '1. You MUST respond with ONLY valid JSON matching the Output Schema from Section 5 of the skill definition above.',
      '2. Do NOT wrap the JSON in markdown code blocks (no ```json ... ```).',
      '3. Do NOT include any explanation, commentary, or text outside the JSON object.',
      '4. The JSON must be the very first and only content in your response.',
      '5. All monetary values should be numbers (not strings).',
      '6. Follow the 15 Core Principles from the Agent Definition, especially radical transparency.',
      '7. Use the client-side estimate as a sanity check but generate your own independent estimate using the calculation engine.',
      '8. Always include realistic assumptions, potential additions, and clear next steps.',
      '9. The "next_steps" array must contain 3-4 SPECIFIC, ACTIONABLE next steps the customer should take (e.g., "Book a free on-site assessment at [address]" not "Contact us").',
    ].join('\n');

    // --- Build user message -------------------------------------------------
    const userMessage = buildUserMessage(body);

    // --- Call LLM with retry ------------------------------------------------
    const MAX_ATTEMPTS = 3;
    const RETRY_DELAY_MS = 2000;
    let llmResponse: string | undefined;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      if (Date.now() >= deadline) {
        throw new Error('Request timed out before LLM call completed.');
      }

      try {
        const zai = await ZAI.create();
        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          thinking: { type: 'disabled' },
        });

        llmResponse = completion.choices[0]?.message?.content;

        if (llmResponse && llmResponse.trim().length > 0) {
          break;
        }

        // Empty response — retry
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      } catch (err) {
        console.error(`[estimate API] LLM attempt ${attempt} failed:`, err);
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        } else {
          throw err;
        }
      }
    }

    // --- Parse response -----------------------------------------------------
    const estimate = parseJsonResponse(llmResponse);

    return NextResponse.json({ success: true, estimate });
  } catch (error) {
    console.error('[estimate API] Error generating estimate:', error);

    // --- Fallback to client-side estimate -----------------------------------
    const fallbackEstimate = buildFallbackEstimate(body, error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({
      success: true,
      estimate: fallbackEstimate,
      isFallback: true,
    });
  }
}
