'use client';
import { useState } from 'react';
import { useEd } from './ctx';
import { Group } from './fields';

const fmt = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

export default function StoragePanel() {
  const { csrf, dirty } = useEd();
  const [r, setR] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function run(dryRun) {
    if (!dryRun && !window.confirm('Delete all unused files from Cloudinary? This cannot be undone.')) return;
    setBusy(true); setErr('');
    try {
      const res = await fetch('/api/media/cleanup', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify({ dryRun }) });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setR(data);
    } catch { setErr('Could not check storage. Try again.'); }
    setBusy(false);
  }

  const btn = 'press rounded-full px-4 py-2 text-xs font-bold disabled:opacity-50';
  return (
    <>
      <Group title="Media storage" hint="Files that were uploaded but are no longer used anywhere on the site (older than 1 hour) can be removed to save Cloudinary storage.">
        {dirty && <p className="rounded-xl bg-amber-100 p-3 text-xs font-medium text-amber-900">You have unsaved changes. Save first, otherwise files you just uploaded may look unused.</p>}
        <div className="flex flex-wrap gap-2">
          <button className={`${btn} border border-espresso/20 bg-white`} disabled={busy} onClick={() => run(true)}>{busy ? 'Checking…' : 'Check storage'}</button>
          {r && r.unused > 0 && <button className={`${btn} bg-espresso text-cream`} disabled={busy} onClick={() => run(false)}>Delete {r.unused} unused file{r.unused > 1 ? 's' : ''}</button>}
        </div>
        {err && <p role="alert" className="text-xs font-medium text-red-700">{err}</p>}
        {r && (
          <ul className="space-y-1 text-sm">
            <li>Files in use + unused: <b>{r.total}</b> ({fmt(r.totalBytes)})</li>
            <li>Unused: <b>{r.unused}</b> ({fmt(r.unusedBytes)})</li>
            {r.deleted > 0 && <li className="font-bold text-green-800">Deleted {r.deleted} files ✓</li>}
          </ul>
        )}
      </Group>
      <Group title="How this dashboard saves your Cloudinary credits">
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-espresso/80">
          <li>Photos are resized and converted to WebP on your device before upload.</li>
          <li>Videos over 60MB show a warning. Compress to 720p first.</li>
          <li>No transformations are ever requested: the original file is served as-is.</li>
          <li>Posters are created on your device, not by Cloudinary.</li>
          <li>When you remove a file and save, it is deleted from Cloudinary automatically.</li>
        </ul>
      </Group>
    </>
  );
}
