import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import { MEDIA } from '@/lib/mediaConfig';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export { cloudinary };
export const FOLDER = MEDIA.folder;

// رابط Cloudinary سليم = بتاعنا + بدون transformations + جوه الفولدر بتاعنا.
// (رابط فيه q_auto / w_800 ... بيتحسب transformation، فبنرفضه)
export function parseAsset(url) {
  const m = /^https:\/\/res\.cloudinary\.com\/([^/]+)\/(image|video)\/upload\/(?:v\d+\/)?([^?#]+)$/.exec(url || '');
  if (!m || m[1] !== process.env.CLOUDINARY_CLOUD_NAME) return null;
  let id;
  try { id = decodeURIComponent(m[3]).replace(/\.[a-z0-9]{2,5}$/i, ''); } catch { return null; }
  if (!id.startsWith(`${FOLDER}/`) || id.includes('..')) return null;
  return { resourceType: m[2], publicId: id };
}

// كل الـ assets المستخدمة جوه أي object (بيمشي على كل النصوص)
export function assetsIn(value, map = new Map()) {
  if (typeof value === 'string') {
    const a = parseAsset(value);
    if (a) map.set(`${a.resourceType}:${a.publicId}`, a);
  } else if (Array.isArray(value)) value.forEach((v) => assetsIn(v, map));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => assetsIn(v, map));
  return map;
}

export async function deleteAssets(list) {
  let n = 0;
  for (const rt of ['image', 'video']) {
    const ids = list.filter((a) => a.resourceType === rt).map((a) => a.publicId);
    for (let i = 0; i < ids.length; i += 100) {
      await cloudinary.api.delete_resources(ids.slice(i, i + 100), { resource_type: rt });
      n += ids.slice(i, i + 100).length;
    }
  }
  return n;
}

export async function listFolder() {
  const out = [];
  for (const resourceType of ['image', 'video']) {
    let cursor;
    let pages = 0;
    do {
      const r = await cloudinary.api.resources({
        resource_type: resourceType, type: 'upload', prefix: `${FOLDER}/`, max_results: 500, next_cursor: cursor,
      });
      for (const a of r.resources) out.push({ resourceType, publicId: a.public_id, bytes: a.bytes || 0, createdAt: a.created_at });
      cursor = r.next_cursor;
      pages += 1;
    } while (cursor && pages < 6);
  }
  return out;
}
