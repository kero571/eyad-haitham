import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { requireAdmin, SESSION_COOKIE } from '@/lib/auth';

// Rate limit بسيط في الذاكرة (best-effort على serverless)
const buckets = new Map();
export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
    return true;
  }
  b.n += 1;
  return b.n <= max;
}

// Origin لازم يطابق الـ host (دفاع ضد CSRF مع SameSite=Strict)
export const sameOrigin = (req) => {
  try {
    return new URL(req.headers.get('origin') ?? '').host === req.headers.get('host');
  } catch {
    return false;
  }
};

// CSRF token مربوط بالجلسة: HMAC(CSRF_SECRET, session cookie) — بيتغير مع كل login
const secret = () => {
  const s = process.env.CSRF_SECRET;
  if (!s || s.length < 32) throw new Error('CSRF_SECRET missing or too short');
  return s;
};
export const csrfFor = (sessionToken) => crypto.createHmac('sha256', secret()).update(sessionToken).digest('hex');
export async function csrfToken() {
  const t = (await cookies()).get(SESSION_COOKIE)?.value;
  return t ? csrfFor(t) : '';
}
const eq = (a, b) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

const fail = (status, error) => ({ error: NextResponse.json({ ok: false, error }, { status }) });

// حارس كل API الأدمن: Origin + جلسة أدمن + CSRF token + rate limit
export async function guardApi(req, { limit = 60 } = {}) {
  if (!sameOrigin(req)) return fail(403, 'Forbidden');
  const user = await requireAdmin();
  if (!user) return fail(401, 'Unauthorized');
  const session = (await cookies()).get(SESSION_COOKIE)?.value ?? '';
  const sent = req.headers.get('x-csrf-token') ?? '';
  if (!sent || !eq(sent, csrfFor(session))) return fail(403, 'Forbidden');
  if (!rateLimit(`api:${user.uid}`, limit, 60_000)) return fail(429, 'Too many requests');
  return { user };
}
