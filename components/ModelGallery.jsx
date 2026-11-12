'use client';
import { useState } from 'react';
import Image from 'next/image';

const ratios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-square'];

export default function ModelGallery({ photos, pageSize = 5, moreLabel = 'Show More' }) {
  const [count, setCount] = useState(pageSize);
  const [from, setFrom] = useState(pageSize); // أول صورة جديدة بعد الضغط (للأنيميشن)

  const visible = photos.slice(0, count);
  if (!visible.length) return null;
  const [big, ...rest] = visible;
  const hasMore = count < photos.length;

  const more = () => {
    setFrom(count);
    setCount((c) => c + pageSize);
  };

  // عمودين ثابتين: الصور الجديدة بتتضاف تحت من غير ما القديمة تتحرك
  const cols = [[], []];
  rest.forEach((p, i) => cols[i % 2].push({ p, i }));

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 md:items-start md:gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand md:sticky md:top-6">
          <Image src={big.src} alt={big.alt} fill sizes="(min-width:768px) 560px, 92vw" className="object-cover" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {cols.map((col, c) => (
            <div key={c} className={`flex flex-col gap-3 md:gap-4 ${c === 1 ? 'pt-6' : ''}`}>
              {col.map(({ p, i }) => {
                const fresh = i + 1 >= from;
                return (
                  <div
                    key={p.src}
                    className={`relative overflow-hidden rounded-2xl bg-sand ${ratios[i % ratios.length]} ${fresh ? 'rise' : ''}`}
                    style={fresh ? { '--i': i + 1 - from } : undefined}
                  >
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width:768px) 280px, 46vw" className="object-cover" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {hasMore && (
        <button onClick={more} className="press mx-auto mt-8 block w-full max-w-sm rounded-full border-2 border-espresso/20 bg-gold/40 px-6 py-3.5 text-sm font-bold">
          {moreLabel}
        </button>
      )}
    </>
  );
}
