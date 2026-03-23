import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO || 'v3n-ky/gymbrosmacros';

interface FeedbackBody {
  type: 'outdated-data' | 'restaurant-request';
  restaurant?: string;
  itemName?: string;
  details: string;
  email?: string;
}

export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Feedback is not configured.' },
      { status: 500 }
    );
  }

  let body: FeedbackBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!body.type || !body.details?.trim()) {
    return NextResponse.json(
      { error: 'Please provide details.' },
      { status: 400 }
    );
  }

  const isOutdated = body.type === 'outdated-data';

  const title = isOutdated
    ? `[Outdated Data] ${body.restaurant || 'Unknown'} — ${body.itemName || 'General'}`
    : `[Restaurant Request] ${body.details.slice(0, 60)}`;

  const lines: string[] = [];
  if (isOutdated) {
    lines.push(`**Restaurant:** ${body.restaurant || 'Not specified'}`);
    if (body.itemName) lines.push(`**Item:** ${body.itemName}`);
  }
  lines.push(`**Details:** ${body.details}`);
  if (body.email) lines.push(`**Contact:** ${body.email}`);
  lines.push('', '_Submitted via EatMacros feedback form_');

  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body: lines.join('\n'),
      labels: [isOutdated ? 'outdated-data' : 'restaurant-request'],
    }),
  });

  if (!res.ok) {
    console.error('GitHub API error:', res.status, await res.text());
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again later.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
