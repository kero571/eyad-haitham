'use client';
import { useState } from 'react';
import { useEd } from './ctx';
import { Group } from './fields';

const ERRORS = {
  not_configured: 'Add CLARITY_API_TOKEN to your environment variables first (see the setup box below).',
  quota: "Clarity's daily request limit was reached. Showing cached data if available. Try again tomorrow.",
  auth: 'Clarity rejected the API token. Generate a new one in Clarity → Settings → Data Export.',
  upstream: 'Clarity did not answer. Try again in a few minutes.',
};

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const fmt = (n) => (n === null ? '—' : new Intl.NumberFormat('en').format(Math.round(n * 10) / 10));
const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`; };
const metric = (data, name) => (Array.isArray(data) ? data.find((m) => m?.metricName === name)?.information?.[0] : null) || {};

const Stat = ({ label, value, hint }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm">
    <p className="text-[11px] font-semibold text-espresso/60">{label}</p>
    <p className="mt-1 text-2xl font-extrabold">{value}</p>
    {hint && <p className="mt-0.5 text-[11px] text-espresso/50">{hint}</p>}
  </div>
);

export default function AnalyticsPanel() {
  const { csrf, clarity } = useEd();
  const [days, setDays] = useState(3);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function load(refresh = false, d = days) {
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/analytics/clarity', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify({ days: d, refresh }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(ERRORS[data.code] || ERRORS.upstream);
      setRes(data);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  const sessions = res ? num(metric(res.data, 'Traffic').totalSessionCount) : null;
  const users = res ? num(metric(res.data, 'Traffic').distinctUserCount) : null;
  const scroll = res ? num(metric(res.data, 'ScrollDepth').averageScrollDepth) : null;

  const base = clarity.projectId ? `https://clarity.microsoft.com/projects/view/${clarity.projectId}` : 'https://clarity.microsoft.com/projects';
  const links = clarity.projectId
    ? [['Dashboard', '/dashboard', 'Full overview, trends and filters'], ['Recordings', '/recordings', 'Watch real visitor sessions'], ['Heatmaps', '/heatmaps', 'Where people click and scroll'], ['Settings', '/settings', 'Install code, API token, privacy']]
    : [['Open Clarity', '', 'Set NEXT_PUBLIC_CLARITY_ID to link directly to your project']];
  const chip = (active) => `press shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${active ? 'bg-espresso text-cream' : 'border border-espresso/20 bg-white'}`;

  return (
    <>
      <Group title="Visitors (from Microsoft Clarity)" hint="Quick summary of the last 1–3 days. Results are cached for 3 hours to stay within Clarity's daily request limit. For everything else, use the Clarity buttons below.">
        {!clarity.configured && (
          <div className="rounded-2xl bg-amber-100 p-4 text-xs text-amber-900">
            <p className="font-bold">Setup needed (one time)</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5">
              <li>Open your project in Clarity → <b>Settings → Data Export</b> → <b>Generate new API token</b>.</li>
              <li>Add it as <code>CLARITY_API_TOKEN</code> in Vercel (and <code>.env.local</code>), then redeploy.</li>
              <li>Add the project id as <code>NEXT_PUBLIC_CLARITY_ID</code> so the site tracks visits and the buttons below link to your project.</li>
            </ol>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3].map((d) => <button key={d} className={chip(days === d)} onClick={() => { setDays(d); if (res) load(false, d); }}>Last {d === 1 ? '24 hours' : `${d} days`}</button>)}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="press rounded-full bg-espresso px-5 py-2 text-xs font-bold text-cream disabled:opacity-50" disabled={busy || !clarity.configured} onClick={() => load(false)}>
            {busy ? 'Loading…' : res ? 'Reload' : 'Load analytics'}
          </button>
          {res && <button className="press rounded-full border border-espresso/20 bg-white px-4 py-2 text-xs font-bold disabled:opacity-50" disabled={busy} onClick={() => load(true)}>Fetch fresh data</button>}
          {res && <span className="text-[11px] text-espresso/60">Updated {ago(res.fetchedAt)}{res.cached ? ' (cached)' : ''}{res.stale ? ' · limit reached, showing older data' : ''} · {res.callsLeft} fresh requests left today</span>}
        </div>
        {err && <p role="alert" className="text-xs font-medium text-red-700">{err}</p>}

        {res && !sessions && (
          <div className="rounded-2xl bg-amber-100 p-4 text-xs text-amber-900">
            <p className="font-bold">No sessions recorded for this period yet.</p>
            <p className="mt-1">Clarity can take a while to process the first visits. Check Clarity itself, and press "Fetch fresh data" once numbers appear there.</p>
          </div>
        )}

        {res && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Stat label="Sessions" value={fmt(sessions)} />
            <Stat label="Unique visitors" value={fmt(users)} />
            <Stat label="Avg scroll depth" value={scroll === null ? '—' : `${fmt(scroll)}%`} />
          </div>
        )}
      </Group>

      <Group title="Everything else is in Clarity" hint="Recordings, heatmaps, devices, countries, engagement time and detailed filters are only inside Clarity itself.">
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map(([label, path, hint]) => (
            <a key={label} href={`${base}${path}`} target="_blank" rel="noopener noreferrer" className="press block rounded-2xl bg-white p-4 shadow-sm hover:bg-sand/60">
              <p className="text-sm font-extrabold">{label} ↗</p>
              <p className="mt-0.5 text-xs text-espresso/60">{hint}</p>
            </a>
          ))}
        </div>
      </Group>
    </>
  );
}
