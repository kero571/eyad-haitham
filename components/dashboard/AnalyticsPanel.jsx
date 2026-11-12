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

// ---- قراءة مرنة للرد (أسماء الحقول ممكن تختلف شوية، فبنطابق بدون حساسية للحروف) ----
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const num = (v) => { const n = Number(String(v ?? '').replace(/[^0-9.\-]/g, '')); return v === undefined || v === '' || !Number.isFinite(n) ? null : n; };
const pick = (row, keys) => {
  for (const k of keys) {
    const hit = Object.keys(row || {}).find((x) => norm(x) === norm(k));
    if (hit !== undefined && row[hit] !== null && row[hit] !== '') return row[hit];
  }
  return undefined;
};
const indexData = (data) => {
  const m = {};
  for (const e of Array.isArray(data) ? data : []) m[norm(e?.metricName)] = Array.isArray(e?.information) ? e.information : [];
  return m;
};
const fmtNum = (n) => (n === null || n === undefined ? '—' : new Intl.NumberFormat('en').format(Math.round(n * 10) / 10));
const fmtTime = (s) => (s === null ? '—' : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`);
const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`; };
const NUMERIC_KEYS = /count|percent|total|sessions|users|pages|time|depth|visits|views/i;
const labelOf = (row) => { const e = Object.entries(row || {}).find(([k, v]) => typeof v === 'string' && !NUMERIC_KEYS.test(k) && num(v) === null); return e ? e[1] : '—'; };

const Stat = ({ label, value, hint }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm">
    <p className="text-[11px] font-semibold text-espresso/60">{label}</p>
    <p className="mt-1 text-2xl font-extrabold">{value}</p>
    {hint && <p className="mt-0.5 text-[11px] text-espresso/50">{hint}</p>}
  </div>
);

const FRICTION = [
  ['rageclickcount', 'Rage clicks', 'Sessions with rapid repeated clicks'],
  ['deadclickcount', 'Dead clicks', 'Clicks that did nothing'],
  ['quickbackclick', 'Quick backs', 'Left right after arriving'],
  ['excessivescroll', 'Excessive scroll', 'Scrolled far past content'],
  ['scripterrorcount', 'Script errors', 'Sessions with JavaScript errors'],
  ['errorclickcount', 'Error clicks', 'Clicks followed by an error'],
];

const countOf = (r) => num(pick(r, ['sessionsCount', 'totalSessionCount', 'visitsCount', 'count'])) ?? num(Object.values(r || {}).find((v) => typeof v === 'number'));
const LISTS = [['popularpages', 'Popular pages'], ['pagetitle', 'Page titles'], ['referrerurl', 'Where visitors came from'], ['device', 'Devices'], ['browser', 'Browsers'], ['os', 'Operating systems'], ['country', 'Countries']];

function ListCard({ title, rows }) {
  if (!rows?.length) return null;
  return (
    <div>
      <h4 className="mb-2 text-sm font-extrabold">{title}</h4>
      <ul className="divide-y divide-espresso/10 rounded-2xl bg-white text-sm shadow-sm">
        {rows.slice(0, 8).map((r, i) => (
          <li key={i} className="flex justify-between gap-3 px-4 py-2.5">
            <span className="min-w-0 truncate">{String(pick(r, ['url']) ?? labelOf(r))}</span>
            <b>{fmtNum(countOf(r))}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Overview({ data }) {
  const m = indexData(data);
  const t = m.traffic?.[0] || {};
  const eng = m.engagementtime?.[0] || {};
  const sc = m.scrolldepth?.[0] || {};
  const sessions = num(pick(t, ['totalSessionCount']));
  const noData = !sessions;
  const known = new Set(['traffic', 'engagementtime', 'scrolldepth', ...FRICTION.map((f) => f[0]), ...LISTS.map((l) => l[0])]);
  const other = Object.keys(m).filter((k) => !known.has(k));
  return (
    <>
      {noData && (
        <div className="rounded-2xl bg-amber-100 p-4 text-xs text-amber-900">
          <p className="font-bold">Clarity returned 0 sessions for this period.</p>
          <p className="mt-1">The connection works, but no visits were recorded. Check that the tracking script is live (NEXT_PUBLIC_CLARITY_ID is set and the site was redeployed), open your site in a normal browser window (ad blockers stop Clarity), then wait a few minutes and press "Fetch fresh data".</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Sessions" value={fmtNum(sessions)} />
        <Stat label="Unique visitors" value={fmtNum(num(pick(t, ['distinctUserCount'])))} />
        <Stat label="Pages / session" value={fmtNum(num(pick(t, ['pagesPerSessionPercentage', 'pagesPerSession'])))} />
        <Stat label="Bot sessions" value={fmtNum(num(pick(t, ['totalBotSessionCount'])))} hint="Excluded by Clarity from most metrics" />
        <Stat label="Active time" value={fmtTime(num(pick(eng, ['activeTime'])))} hint="Per session" />
        <Stat label="Total time" value={fmtTime(num(pick(eng, ['totalTime'])))} hint="Per session" />
        <Stat label="Avg scroll depth" value={num(pick(sc, ['averageScrollDepth'])) === null ? '—' : `${fmtNum(num(pick(sc, ['averageScrollDepth'])))}%`} />
      </div>

      <h4 className="pt-2 text-sm font-extrabold">Friction signals</h4>
      <p className="-mt-2 text-xs text-espresso/60">Share of sessions that hit each problem. Lower is better.</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {FRICTION.map(([key, label, hint]) => {
          const p = num(pick(m[key]?.[0] || {}, ['sessionsWithMetricPercentage']));
          return <Stat key={key} label={label} value={noData || p === null ? '—' : `${fmtNum(p)}%`} hint={hint} />;
        })}
      </div>

      <div className="grid gap-5 pt-2 md:grid-cols-2">
        {LISTS.map(([key, title]) => <ListCard key={key} title={title} rows={m[key]} />)}
      </div>
      {other.length > 0 && <p className="text-[11px] text-espresso/50">More metrics returned by Clarity: {other.join(', ')} (see Raw response below).</p>}
    </>
  );
}

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

  const base = clarity.projectId ? `https://clarity.microsoft.com/projects/view/${clarity.projectId}` : 'https://clarity.microsoft.com/projects';
  const links = clarity.projectId
    ? [['Dashboard', '/dashboard', 'Full overview, trends and filters'], ['Recordings', '/recordings', 'Watch real visitor sessions'], ['Heatmaps', '/heatmaps', 'Where people click and scroll'], ['Settings', '/settings', 'Install code, API token, privacy']]
    : [['Open Clarity', '', 'Set NEXT_PUBLIC_CLARITY_ID to link directly to your project']];
  const chip = (active) => `press shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${active ? 'bg-espresso text-cream' : 'border border-espresso/20 bg-white'}`;

  return (
    <>
      <Group title="Visitors (from Microsoft Clarity)" hint="Clarity's API only returns the last 1–3 days. Results are cached for 3 hours so you never hit its daily request limit.">
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

        {res && <Overview data={res.data} />}
        {res && (
          <details className="text-xs">
            <summary className="cursor-pointer font-semibold text-espresso/70">Raw response (for debugging)</summary>
            <pre className="mt-2 max-h-72 overflow-auto rounded-xl bg-espresso p-3 text-[11px] text-cream">{JSON.stringify(res.data, null, 2)}</pre>
          </details>
        )}
      </Group>

      <Group title="Everything else is in Clarity" hint="The API only gives summary numbers. Recordings, heatmaps and detailed filters are only inside Clarity itself.">
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
