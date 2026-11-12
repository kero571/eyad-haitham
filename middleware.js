import { NextResponse } from 'next/server';

// فلتر أولي بس (وجود الكوكي). التحقق الحقيقي بيحصل في السيرفر: requireAdmin() + guardApi().
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname !== '/dashboard/login' && !req.cookies.has('session')) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url));
  }
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}
export const config = { matcher: ['/dashboard/:path*'] };
