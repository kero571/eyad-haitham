import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { guardApi } from '@/lib/security';
import { assetsIn, deleteAssets, listFolder } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRACE_MS = 60 * 60 * 1000; // مبنمسحش ملف عمره أقل من ساعة (ممكن يكون لسه مترفعش في المحتوى)

export async function POST(req) {
  const { error } = await guardApi(req, { limit: 10 });
  if (error) return error;
  const { dryRun = true } = await req.json().catch(() => ({}));

  try {
    const saved = (await adminDb().doc('content/site').get()).data() ?? {};
    const used = assetsIn(saved);
    const all = await listFolder();
    const unused = all.filter((a) => !used.has(`${a.resourceType}:${a.publicId}`) && Date.now() - Date.parse(a.createdAt) > GRACE_MS);
    const sum = (l) => l.reduce((n, a) => n + a.bytes, 0);
    const res = { ok: true, total: all.length, totalBytes: sum(all), unused: unused.length, unusedBytes: sum(unused), deleted: 0 };
    if (dryRun === false && unused.length) res.deleted = await deleteAssets(unused);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ ok: false, error: 'Cleanup failed' }, { status: 500 });
  }
}
