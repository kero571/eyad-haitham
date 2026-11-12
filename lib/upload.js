'use client';
import { MEDIA } from '@/lib/mediaConfig';

const toBlob = (canvas, type, q) => new Promise((res) => canvas.toBlob(res, type, q));

// ضغط الصورة على جهازك قبل الرفع: أقصى عرض + WebP. ده بيوفر storage و bandwidth على Cloudinary
// (وكمان إعادة الترميز بتشيل أي محتوى مخفي في الملف).
export async function compressImage(file, { maxW = 1600, alpha = false, format = 'webp' } = {}) {
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch { throw new Error('Could not read this image. Use JPG, PNG or WebP.'); }
  const scale = Math.min(1, maxW / bmp.width);
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
  bmp.close?.();
  let blob = null;
  if (format === 'webp') {
    blob = await toBlob(canvas, 'image/webp', 0.82);
    if (blob?.type !== 'image/webp') blob = null;
  }
  if (!blob) blob = await toBlob(canvas, format === 'png' || (format === 'webp' && alpha) ? 'image/png' : 'image/jpeg', 0.85);
  if (!blob) throw new Error('Image processing failed.');
  if (blob.size > MEDIA.imageMaxMB * 1048576) throw new Error(`Image is still bigger than ${MEDIA.imageMaxMB}MB after compression.`);
  return blob;
}

// poster تلقائي: بنسحب فريم من الفيديو على جهازك (مفيش transformation على Cloudinary)
export function captureVideoFrame(file, maxW = 720) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    const finish = (fn, arg) => { URL.revokeObjectURL(url); fn(arg); };
    const timer = setTimeout(() => finish(reject, new Error('timeout')), 15000);
    v.onerror = () => { clearTimeout(timer); finish(reject, new Error('unreadable')); };
    v.onloadedmetadata = () => { v.currentTime = Math.min(1, (v.duration || 2) * 0.1); };
    v.onseeked = async () => {
      clearTimeout(timer);
      const w = Math.min(maxW, v.videoWidth || maxW);
      const h = Math.round((v.videoHeight || w) * (w / (v.videoWidth || w)));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(v, 0, 0, w, h);
      const b = (await toBlob(c, 'image/webp', 0.8)) || (await toBlob(c, 'image/jpeg', 0.85));
      b ? finish(resolve, b) : finish(reject, new Error('frame'));
    };
  });
}

// رفع مباشر لـ Cloudinary بتوقيع من السيرفر (من غير upload preset ومن غير eager)
export async function uploadAsset(blob, resourceType, csrf, onProgress) {
  const sign = await fetch('/api/cloudinary/sign', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify({ resourceType }),
  });
  if (!sign.ok) throw new Error(sign.status === 401 || sign.status === 403 ? 'Session expired. Reload the page and sign in again.' : 'Could not start the upload.');
  const p = await sign.json();

  const fd = new FormData();
  fd.append('file', blob, resourceType === 'video' ? 'video' : 'image');
  fd.append('api_key', p.apiKey);
  fd.append('timestamp', String(p.timestamp));
  fd.append('public_id', p.public_id);
  fd.append('allowed_formats', p.allowed_formats);
  fd.append('signature', p.signature);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${p.cloudName}/${resourceType}/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.onload = () => {
      let r = {};
      try { r = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && /^https:\/\/res\.cloudinary\.com\//.test(r.secure_url || '')) resolve(r.secure_url);
      else reject(new Error(r?.error?.message || 'Upload was rejected.'));
    };
    xhr.send(fd);
  });
}
