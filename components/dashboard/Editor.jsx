'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ctx, getIn, setIn } from './ctx';
import { SECTIONS } from './sections';

export default function Editor({ initial, email, csrf, clarity }) {
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [active, setActive] = useState('general');
  const [busyN, setBusyN] = useState(0);
  const [status, setStatus] = useState({ kind: '', msg: '', issues: [] });

  const dirty = useMemo(() => JSON.stringify(content) !== saved, [content, saved]);
  const get = useCallback((p) => getIn(content, p), [content]);
  const set = useCallback((p, v) => setContent((c) => setIn(c, p, v)), []);
  const upd = useCallback((p, fn) => setContent((c) => setIn(c, p, fn(getIn(c, p)))), []);
  const begin = useCallback(() => setBusyN((n) => n + 1), []);
  const end = useCallback(() => setBusyN((n) => Math.max(0, n - 1)), []);

  useEffect(() => {
    const h = (e) => { if (dirty || busyN) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty, busyN]);

  async function save() {
    setStatus({ kind: 'saving', msg: 'Saving…', issues: [] });
    try {
      const res = await fetch('/api/content', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify({ content }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSaved(JSON.stringify(content));
        setStatus({ kind: 'ok', msg: 'Published ✓ The site updates within a few seconds.', issues: [] });
      } else if (res.status === 400) {
        setStatus({ kind: 'err', msg: 'Please fix these fields:', issues: data.issues || [] });
      } else if (res.status === 401 || res.status === 403) {
        setStatus({ kind: 'err', msg: 'Your session expired. Your edits are still on this page: open /dashboard/login in a new tab, sign in, then come back and press Save.', issues: [] });
      } else setStatus({ kind: 'err', msg: 'Save failed. Try again.', issues: [] });
    } catch {
      setStatus({ kind: 'err', msg: 'Network error. Try again.', issues: [] });
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    window.location.href = '/dashboard/login';
  }

  const Section = SECTIONS.find((s) => s.id === active)?.Comp ?? SECTIONS[0].Comp;
  const ctx = useMemo(() => ({ get, set, upd, csrf, begin, end, dirty, clarity }), [get, set, upd, csrf, begin, end, dirty, clarity]);

  return (
    <Ctx.Provider value={ctx}>
      <header className="sticky top-0 z-20 border-b border-espresso/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-extrabold">Portfolio dashboard</p>
            <p className="truncate text-[11px] text-espresso/60">{email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-espresso/70" role="status">
              {busyN ? 'Uploading…' : dirty ? '● Unsaved changes' : 'All changes published'}
            </span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="press rounded-full border border-espresso/20 bg-white px-4 py-2 text-xs font-bold">View site</a>
            <button onClick={save} disabled={!dirty || busyN > 0 || status.kind === 'saving'} className="press rounded-full bg-espresso px-5 py-2 text-xs font-bold text-cream disabled:opacity-40">
              {status.kind === 'saving' ? 'Saving…' : 'Save & publish'}
            </button>
            <button onClick={logout} className="press rounded-full border border-espresso/20 px-4 py-2 text-xs font-bold">Sign out</button>
          </div>
        </div>
        {status.msg && (
          <div className={`px-4 py-2 text-xs font-medium ${status.kind === 'err' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`} role="status">
            {status.msg}
            {status.issues.length > 0 && <ul className="mt-1 list-disc pl-5">{status.issues.map((i, k) => <li key={k}><code>{i.path}</code>: {i.message}</li>)}</ul>}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[210px_1fr]">
        <nav aria-label="Sections" className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:flex-col lg:self-start lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => { setActive(s.id); window.scrollTo({ top: 0 }); }} aria-current={s.id === active}
              className={`press shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-semibold ${s.id === active ? 'bg-espresso text-cream' : 'bg-cream hover:bg-sand'}`}>
              {s.label}
            </button>
          ))}
        </nav>
        <main className="min-w-0 space-y-5 pb-24">
          <Section key={active} />
        </main>
      </div>
    </Ctx.Provider>
  );
}
