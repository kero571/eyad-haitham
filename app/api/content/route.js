import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { guardApi } from '@/lib/security';
import { contentSchema } from '@/lib/schema';
import { assetsIn, deleteAssets } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req) {
  const { error } = await guardApi(req, { limit: 20 });
  if (error) return error;

  const raw = await req.text();
  if (raw.length > 400_000) return NextResponse.json({ ok: false, error: 'Payload too large' }, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 }); }

  // whitelist: zod بيشيل أي حقل مش في الـ schema (mass assignment) ويرفض أي لينك/ملف مش آمن
  const parsed = contentSchema.safeParse(body?.content);
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 15).map((i) => ({ path: i.path.join('.'), message: i.message }));
    return NextResponse.json({ ok: false, error: 'Validation failed', issues }, { status: 400 });
  }
  const next = JSON.parse(JSON.stringify(parsed.data)); // Firestore مبيقبلش undefined

  try {
    const ref = adminDb().doc('content/site');
    const prev = (await ref.get()).data() ?? {};
    await ref.set(next);
    revalidateTag('content');
    revalidatePath('/');

    // امسح من Cloudinary أي ملف اتشال من المحتوى (توفير storage). best-effort.
    let removed = 0;
    try {
      const used = assetsIn(next);
      const orphans = [...assetsIn(prev).entries()].filter(([k]) => !used.has(k)).map(([, a]) => a);
      if (orphans.length) removed = await deleteAssets(orphans);
    } catch (e) { console.error('orphan cleanup failed'); }

    return NextResponse.json({ ok: true, removed });
  } catch (e) {
    console.error('content save failed');
    return NextResponse.json({ ok: false, error: 'Save failed' }, { status: 500 });
  }
}
