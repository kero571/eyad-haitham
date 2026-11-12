import { NextResponse } from 'next/server';
import { guardApi } from '@/lib/security';
import { getClarity, ClarityError, DIMENSIONS } from '@/lib/clarity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUS = { not_configured: 400, quota: 429, auth: 502, upstream: 502 };

export async function POST(req) {
  const { error } = await guardApi(req, { limit: 30 });
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const days = [1, 2, 3].includes(body.days) ? body.days : 3;
  const dimension = DIMENSIONS.includes(body.dimension) ? body.dimension : ''; // allowlist بس

  try {
    return NextResponse.json(await getClarity({ days, dimension, refresh: body.refresh === true }));
  } catch (e) {
    const code = e instanceof ClarityError ? e.code : 'upstream';
    if (!(e instanceof ClarityError)) console.error('clarity route failed'); // من غير تفاصيل/توكن
    return NextResponse.json({ ok: false, code }, { status: STATUS[code] ?? 502 });
  }
}
