import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { csrfToken } from '@/lib/security';
import { getContentFresh } from '@/lib/content';
import Editor from '@/components/dashboard/Editor';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireAdmin();
  if (!user) redirect('/dashboard/login');
  const [content, csrf] = await Promise.all([getContentFresh(), csrfToken()]);
  const id = process.env.NEXT_PUBLIC_CLARITY_ID || '';
  const clarity = { projectId: /^[a-z0-9]{6,20}$/i.test(id) ? id : '', configured: Boolean(process.env.CLARITY_API_TOKEN) };
  return <Editor initial={content} email={user.email} csrf={csrf} clarity={clarity} />;
}
