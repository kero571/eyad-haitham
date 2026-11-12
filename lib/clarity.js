import 'server-only';
import { adminDb } from '@/lib/firebase-admin';

// Clarity Data Export API: آخر 1-3 أيام بس، وحوالي 10 طلبات في اليوم لكل project.
// علشان كده: كاش في Firestore + عداد يومي (بنقف عند 8 ونسيب هامش).
export const DIMENSIONS = ['', 'Device', 'Country/Region', 'Source', 'Browser', 'OS', 'URL'];
const ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';
const TTL_MS = 3 * 60 * 60 * 1000; // الكاش صالح 3 ساعات
const MIN_REFRESH_MS = 15 * 60 * 1000; // مفيش refresh يدوي قبل 15 دقيقة
const DAILY_LIMIT = 8;

export class ClarityError extends Error {
  constructor(code) { super(code); this.code = code; }
}

const today = () => new Date().toISOString().slice(0, 10);

async function callsLeft(db) {
  const q = (await db.doc('analytics/clarity_quota').get()).data();
  return q && q.day === today() ? Math.max(0, DAILY_LIMIT - q.calls) : DAILY_LIMIT;
}

export async function getClarity({ days, dimension, refresh }) {
  if (!process.env.CLARITY_API_TOKEN) throw new ClarityError('not_configured');
  const db = adminDb();
  const ref = db.doc(`analytics/clarity_${days}_${dimension ? dimension.replace(/\W/g, '') : 'all'}`);
  const cached = (await ref.get()).data() || null;
  const age = cached ? Date.now() - cached.fetchedAt : Infinity;
  const fromCache = (extra = {}) => callsLeft(db).then((left) => ({
    ok: true, cached: true, fetchedAt: cached.fetchedAt, data: JSON.parse(cached.json), callsLeft: left, ...extra,
  }));

  if (cached && ((!refresh && age < TTL_MS) || (refresh && age < MIN_REFRESH_MS))) return fromCache();

  // نحجز طلب من العدّاد اليومي قبل ما نكلم Clarity (transaction = مفيش سباق)
  const quotaRef = db.doc('analytics/clarity_quota');
  const allowed = await db.runTransaction(async (tx) => {
    const q = (await tx.get(quotaRef)).data();
    const used = q && q.day === today() ? q.calls : 0;
    if (used >= DAILY_LIMIT) return false;
    tx.set(quotaRef, { day: today(), calls: used + 1 });
    return true;
  });
  if (!allowed) {
    if (cached) return fromCache({ stale: true });
    throw new ClarityError('quota');
  }

  const url = new URL(ENDPOINT); // host ثابت: مفيش SSRF
  url.searchParams.set('numOfDays', String(days));
  if (dimension) url.searchParams.set('dimension1', dimension);
  let res;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.CLARITY_API_TOKEN}`, 'Content-Type': 'application/json' },
      cache: 'no-store', signal: AbortSignal.timeout(12000),
    });
  } catch { throw new ClarityError('upstream'); }
  if (res.status === 401 || res.status === 403) throw new ClarityError('auth');
  if (res.status === 429) throw new ClarityError('quota');
  if (!res.ok) throw new ClarityError('upstream');

  const data = await res.json().catch(() => null);
  const json = JSON.stringify(data);
  if (!data || json.length > 900_000) throw new ClarityError('upstream');
  const fetchedAt = Date.now();
  await ref.set({ fetchedAt, json });
  return { ok: true, cached: false, fetchedAt, data, callsLeft: await callsLeft(db) };
}
