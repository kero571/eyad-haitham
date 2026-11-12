import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

export const SESSION_COOKIE = 'session';
export const SESSION_MS = 3 * 24 * 60 * 60 * 1000; // 3 أيام

const admins = () =>
  (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
export const isAdminEmail = (e) => !!e && admins().includes(String(e).toLowerCase());

// بيرجع { uid, email } لو الجلسة سليمة + الإيميل في الـ allowlist، وإلا null (fail closed)
export async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const d = await adminAuth().verifySessionCookie(token, true); // checkRevoked
    return isAdminEmail(d.email) ? { uid: d.uid, email: d.email } : null;
  } catch {
    return null;
  }
}
