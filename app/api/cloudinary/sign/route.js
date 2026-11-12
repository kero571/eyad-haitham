import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { cloudinary, FOLDER } from '@/lib/cloudinary';
import { guardApi } from '@/lib/security';
import { MEDIA } from '@/lib/mediaConfig';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// توقيع رفع: بنوقّع بس {allowed_formats, public_id, timestamp}.
// مفيش eager / transformations / notification = مفيش credits بتتصرف على الرفع.
export async function POST(req) {
  const { error } = await guardApi(req, { limit: 120 });
  if (error) return error;

  const { resourceType } = await req.json().catch(() => ({}));
  if (resourceType !== 'image' && resourceType !== 'video') return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });

  const params = {
    allowed_formats: resourceType === 'image' ? MEDIA.imageFormats : MEDIA.videoFormats, // مفيش SVG
    public_id: `${FOLDER}/${resourceType}s/${crypto.randomUUID()}`, // اسم عشوائي من السيرفر (مفيش overwrite لملف موجود)
    timestamp: Math.round(Date.now() / 1000),
  };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  return NextResponse.json({ ok: true, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, signature, ...params });
}
