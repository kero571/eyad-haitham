'use client';
import { useRef, useState } from 'react';
import { useEd } from './ctx';
import { isVideo } from '@/lib/ui';
import { MEDIA } from '@/lib/mediaConfig';
import { compressImage, captureVideoFrame, uploadAsset } from '@/lib/upload';

const inp = 'w-full rounded-xl border border-espresso/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-caramel focus:ring-2 focus:ring-caramel/30';
const lab = 'mb-1 block text-xs font-semibold text-espresso/70';
const btn = 'press rounded-full px-3.5 py-1.5 text-xs font-bold';
const ghost = `${btn} border border-espresso/20 bg-white hover:bg-sand/60`;

export const Group = ({ title, hint, children }) => (
  <section className="rounded-3xl bg-cream p-4 shadow-sm md:p-6">
    <h3 className="text-base font-extrabold">{title}</h3>
    {hint && <p className="mt-0.5 text-xs text-espresso/60">{hint}</p>}
    <div className="mt-4 space-y-4">{children}</div>
  </section>
);

export function Text({ path, label, hint, multiline, rows = 3, placeholder }) {
  const { get, set } = useEd();
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label className="block">
      <span className={lab}>{label}</span>
      <Tag className={inp} rows={multiline ? rows : undefined} value={get(path) ?? ''} placeholder={placeholder} onChange={(e) => set(path, e.target.value)} />
      {hint && <span className="mt-1 block text-[11px] text-espresso/50">{hint}</span>}
    </label>
  );
}

export function Num({ path, label, min = 0, max = 100, hint }) {
  const { get, set } = useEd();
  return (
    <label className="block">
      <span className={lab}>{label}</span>
      <input className={inp} type="number" min={min} max={max} value={get(path) ?? ''} onChange={(e) => set(path, e.target.value === '' ? min : Number(e.target.value))} />
      {hint && <span className="mt-1 block text-[11px] text-espresso/50">{hint}</span>}
    </label>
  );
}

export function Check({ path, label }) {
  const { get, set } = useEd();
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" className="h-4 w-4 accent-[#B98A5B]" checked={!!get(path)} onChange={(e) => set(path, e.target.checked)} />
      {label}
    </label>
  );
}

export function Pick({ path, label, options }) {
  const { get, set } = useEd();
  return (
    <label className="block">
      <span className={lab}>{label}</span>
      <select className={inp} value={get(path) ?? ''} onChange={(e) => set(path, e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function StringList({ path, label, max = 20, placeholder }) {
  const { get, set } = useEd();
  const items = get(path) || [];
  return (
    <div>
      <span className={lab}>{label}</span>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input className={inp} value={v} placeholder={placeholder} onChange={(e) => set(path, items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" aria-label="Remove" className={ghost} onClick={() => set(path, items.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
      {items.length < max && <button type="button" className={`${ghost} mt-2`} onClick={() => set(path, [...items, ''])}>+ Add</button>}
    </div>
  );
}

export function List({ path, label, hint, max = 20, make, title, children }) {
  const { get, set } = useEd();
  const items = get(path) || [];
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    set(path, n);
  };
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <span className="text-sm font-bold">{label}</span>
          {hint && <p className="text-xs text-espresso/60">{hint}</p>}
        </div>
        <span className="text-xs text-espresso/50">{items.length}/{max}</span>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-espresso/10 bg-white/60 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="truncate text-xs font-bold text-espresso/70">{title ? title(it, i) : `#${i + 1}`}</span>
              <span className="flex shrink-0 gap-1">
                <button type="button" aria-label="Move up" disabled={i === 0} className={`${ghost} disabled:opacity-30`} onClick={() => move(i, -1)}>↑</button>
                <button type="button" aria-label="Move down" disabled={i === items.length - 1} className={`${ghost} disabled:opacity-30`} onClick={() => move(i, 1)}>↓</button>
                <button type="button" aria-label="Remove" className={ghost} onClick={() => window.confirm('Remove this item?') && set(path, items.filter((_, j) => j !== i))}>✕</button>
              </span>
            </div>
            <div className="space-y-3">{children(`${path}.${i}`, i)}</div>
          </div>
        ))}
      </div>
      {items.length < max && <button type="button" className={`${ghost} mt-3`} onClick={() => set(path, [...items, make()])}>+ Add</button>}
    </div>
  );
}

const IMG_ACCEPT = 'image/jpeg,image/png,image/webp';
const VID_ACCEPT = 'video/mp4,video/webm,video/quicktime';

export function Media({ path, posterPath, allow = 'image', label, hint, maxW = 1600, alpha = false, format = 'webp' }) {
  const { get, set, csrf, begin, end } = useEd();
  const src = get(path) || '';
  const poster = posterPath ? get(posterPath) || '' : '';
  const video = isVideo(src);
  const [st, setSt] = useState({ pct: 0, busy: '', err: '', note: '' });
  const [auto, setAuto] = useState(true);
  const fileRef = useRef(null);
  const posterRef = useRef(null);
  const accept = allow === 'image' ? IMG_ACCEPT : allow === 'video' ? VID_ACCEPT : `${IMG_ACCEPT},${VID_ACCEPT}`;
  const fail = (err) => setSt({ pct: 0, busy: '', err, note: '' });

  async function onPick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const isVid = file.type.startsWith('video/');
    const isImg = file.type.startsWith('image/');
    if ((isVid && allow === 'image') || (isImg && allow === 'video') || (!isVid && !isImg)) return fail('This file type is not allowed here.');

    if (isVid) {
      const mb = file.size / 1048576;
      if (mb > MEDIA.videoMaxMB) return fail(`This video is ${mb.toFixed(0)}MB. The maximum is ${MEDIA.videoMaxMB}MB. Compress it first (720p is plenty).`);
      if (mb > MEDIA.videoWarnMB &&
        !window.confirm(`⚠️ This video is ${mb.toFixed(0)}MB.\n\nLarge videos use a lot of Cloudinary storage and bandwidth credits.\nTip: compress it first (720p, under 15MB is plenty for a reel).\n\nUpload anyway?`)) return;
    }

    begin();
    setSt({ pct: 0, busy: isVid ? 'Uploading video…' : 'Optimizing & uploading…', err: '', note: '' });
    try {
      const blob = isVid ? file : await compressImage(file, { maxW, alpha, format });
      const url = await uploadAsset(blob, isVid ? 'video' : 'image', csrf, (pct) => setSt((s) => ({ ...s, pct })));
      set(path, url);
      let note = '';
      if (posterPath) {
        if (!isVid || !auto) set(posterPath, '');
        if (isVid && auto) {
          setSt((s) => ({ ...s, busy: 'Creating poster…', pct: 0 }));
          try {
            const frame = await captureVideoFrame(file);
            set(posterPath, await uploadAsset(frame, 'image', csrf));
          } catch {
            set(posterPath, '');
            note = 'Video uploaded, but the poster could not be created automatically. Please upload a poster image.';
          }
        }
      }
      setSt({ pct: 0, busy: '', err: '', note });
    } catch (err) {
      fail(err.message || 'Upload failed.');
    } finally {
      end();
    }
  }

  async function onPoster(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    begin();
    setSt({ pct: 0, busy: 'Uploading poster…', err: '', note: '' });
    try {
      const blob = await compressImage(file, { maxW: 720 });
      set(posterPath, await uploadAsset(blob, 'image', csrf, (pct) => setSt((s) => ({ ...s, pct }))));
      setSt({ pct: 0, busy: '', err: '', note: '' });
    } catch (err) {
      fail(err.message || 'Upload failed.');
    } finally {
      end();
    }
  }

  const remove = () => { set(path, ''); if (posterPath) set(posterPath, ''); setSt({ pct: 0, busy: '', err: '', note: '' }); };

  return (
    <div>
      {label && <span className={lab}>{label}</span>}
      <div className="flex gap-3">
        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-sand sm:h-32 sm:w-24">
          {src ? (
            video ? <video src={src} poster={poster || undefined} controls preload="none" playsInline className="h-full w-full object-cover" />
              : <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : <span className="grid h-full place-items-center text-[10px] text-espresso/50">No file</span>}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!!st.busy} className={`${btn} bg-espresso text-cream disabled:opacity-50`} onClick={() => fileRef.current?.click()}>
              {src ? 'Replace' : allow === 'image' ? 'Upload image' : allow === 'video' ? 'Upload video' : 'Upload image / video'}
            </button>
            {src && <button type="button" disabled={!!st.busy} className={ghost} onClick={remove}>Remove</button>}
          </div>
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={onPick} />
          {hint && <p className="text-[11px] text-espresso/50">{hint}</p>}
          {st.busy && (
            <div role="status">
              <p className="text-xs font-medium">{st.busy} {st.pct > 0 && `${st.pct}%`}</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-espresso/10"><div className="h-full bg-caramel transition-[width]" style={{ width: `${st.pct}%` }} /></div>
            </div>
          )}
          {st.err && <p role="alert" className="text-xs font-medium text-red-700">{st.err}</p>}
          {st.note && <p className="text-xs font-medium text-amber-800">{st.note}</p>}
        </div>
      </div>

      {posterPath && video && (
        <div className="mt-3 flex gap-3 rounded-2xl bg-sand/50 p-3">
          <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-sand">
            {poster ? <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-[9px] text-espresso/50">No poster</span>}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-xs font-bold">Poster (cover image)</p>
            <label className="flex items-center gap-2 text-[11px]">
              <input type="checkbox" className="accent-[#B98A5B]" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
              Create it automatically from the video when I upload one
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!!st.busy} className={ghost} onClick={() => posterRef.current?.click()}>{poster ? 'Replace poster' : 'Upload my own poster'}</button>
              {poster && <button type="button" className={ghost} onClick={() => set(posterPath, '')}>Remove</button>}
            </div>
            <input ref={posterRef} type="file" accept={IMG_ACCEPT} className="hidden" onChange={onPoster} />
            {!poster && <p className="text-[11px] text-amber-800">Without a poster the browser loads part of the video just to show a cover, which uses more bandwidth.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// رفع كذا صورة مرة واحدة (للـ Model)
export function MultiPhotos({ path, max = 100, altPrefix }) {
  const { get, upd, csrf, begin, end } = useEd();
  const [st, setSt] = useState({ done: 0, total: 0, err: '' });
  const ref = useRef(null);
  async function onPick(e) {
    const files = [...(e.target.files || [])].filter((f) => f.type.startsWith('image/'));
    e.target.value = '';
    const take = files.slice(0, Math.max(0, max - (get(path) || []).length));
    if (!take.length) return;
    begin();
    setSt({ done: 0, total: take.length, err: '' });
    try {
      for (const f of take) {
        const url = await uploadAsset(await compressImage(f, { maxW: 1600 }), 'image', csrf);
        upd(path, (a) => [...(a || []), { src: url, alt: `${altPrefix} ${(a || []).length + 1}` }]);
        setSt((s) => ({ ...s, done: s.done + 1 }));
      }
      setSt({ done: 0, total: 0, err: '' });
    } catch (err) {
      setSt({ done: 0, total: 0, err: err.message || 'Upload failed.' });
    } finally {
      end();
    }
  }
  return (
    <div className="rounded-2xl border-2 border-dashed border-caramel/50 bg-white/50 p-4 text-center">
      <button type="button" disabled={st.total > 0} className={`${btn} bg-espresso text-cream disabled:opacity-50`} onClick={() => ref.current?.click()}>
        {st.total ? `Uploading ${st.done + 1}/${st.total}…` : 'Upload several photos at once'}
      </button>
      <input ref={ref} type="file" multiple accept={IMG_ACCEPT} className="hidden" onChange={onPick} />
      <p className="mt-2 text-[11px] text-espresso/50">Photos are resized to 1600px and converted to WebP on your device before upload.</p>
      {st.err && <p role="alert" className="mt-2 text-xs font-medium text-red-700">{st.err}</p>}
    </div>
  );
}
