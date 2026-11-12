import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { isAdminEmail, SESSION_COOKIE, SESSION_MS } from '@/lib/auth';
import { rateLimit, sameOrigin } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const deny = () => NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 }); // رسالة واحدة لكل الحالات

export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (!rateLimit(`login:${ip}`, 8, 10 * 60_000)) return NextResponse.json({ ok: false, error: 'Too many attempts' }, { status: 429 });

  const { idToken } = await req.json().catch(() => ({}));
  if (typeof idToken !== 'string' || idToken.length > 4096) return deny();

  try {
    const decoded = await adminAuth().verifyIdToken(idToken, true);
    if (!isAdminEmail(decoded.email)) return deny(); // allowlist: أي حساب تاني مرفوض حتى لو اتسجل في Firebase
    if (Date.now() / 1000 - decoded.auth_time > 300) return deny(); // لازم تسجيل دخول جديد
    const cookie = await adminAuth().createSessionCookie(idToken, { expiresIn: SESSION_MS });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, cookie, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: SESSION_MS / 1000,
    });
    return res;
  } catch {
    return deny();
  }
}
