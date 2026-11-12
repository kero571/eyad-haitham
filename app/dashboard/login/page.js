import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import LoginForm from '@/components/dashboard/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await requireAdmin()) redirect('/dashboard');
  return <LoginForm />;
}
