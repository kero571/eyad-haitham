'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase-client';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const auth = clientAuth();
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken();
      const res = await fetch('/api/auth/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }),
      });
      await signOut(auth); // مش محتاجين Firebase client بعد ما الكوكي اتعملت
      if (!res.ok) throw new Error('denied');
      router.replace('/dashboard');
      router.refresh();
    } catch {
      setErr('Wrong email or password, or this account is not allowed.'); // رسالة واحدة (مفيش user enumeration)
      setBusy(false);
    }
  }

  const inp = 'w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30';
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-3xl bg-cream p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="text-sm text-espresso/60">Sign in to edit your portfolio.</p>
        </div>
        <input className={inp} type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={inp} type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p role="alert" className="text-sm font-medium text-red-700">{err}</p>}
        <button disabled={busy} className="press w-full rounded-full bg-espresso px-6 py-3 text-sm font-bold text-cream disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
