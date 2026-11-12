import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { requireAdmin, SESSION_COOKIE } from '@/lib/auth';
import { sameOrigin } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  const user = await requireAdmin();
  if (user) await adminAuth().revokeRefreshTokens(user.uid).catch(() => {}); // يلغي كل الجلسات
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
