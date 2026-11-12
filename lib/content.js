import 'server-only';
import { unstable_cache } from 'next/cache';
import * as d from '@/lib/data';
import { adminDb, firebaseConfigured } from '@/lib/firebase-admin';

// القيم الافتراضية = lib/data.js (بتتستخدم لو Firestore لسه فاضي أو مش متظبط)
export function defaults() {
  const c = structuredClone({
    site: d.site, seo: d.seo, nav: d.nav, header: d.header, hero: d.hero, brands: d.brands, about: d.about,
    contentCreator: d.contentCreator, reelEditor: d.reelEditor, ugc: d.ugc, interviewer: d.interviewer,
    model: d.model, process: d.process, footer: d.footer,
  });
  // Firestore مبيدعمش nested arrays: كل track بقى { segments: [...] }
  c.reelEditor.timeline.tracks = c.reelEditor.timeline.tracks.map((r) => (Array.isArray(r) ? { segments: r } : r));
  return c;
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const merge = (def, val) => {
  if (Array.isArray(def)) return Array.isArray(val) ? val : def;
  if (isObj(def)) {
    const out = { ...def };
    if (isObj(val)) for (const k of Object.keys(val)) out[k] = k in def ? merge(def[k], val[k]) : val[k];
    return out;
  }
  return val ?? def;
};

async function read() {
  if (!firebaseConfigured()) return defaults(); // قبل ما تظبط Firebase
  const snap = await adminDb().doc('content/site').get(); // لو فشل بيرمي error (الكاش مش بيخزن فشل)
  return snap.exists ? merge(defaults(), snap.data()) : defaults();
}

export const getContentFresh = read; // للداشبورد (من غير كاش)
export const getContent = unstable_cache(read, ['site-content'], { tags: ['content'], revalidate: 3600 });
