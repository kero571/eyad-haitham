'use client';
import { useState } from 'react';
import Image from 'next/image';

const ratios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[4/5]', 'aspect-[3/4]'];

export default function Gallery({ photos }) {
  const [more, setMore] = useState(false);
  const [big, ...rest] = photos;
  const shown = more ? rest : rest.slice(0, 4);
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand md:row-span-2 md:aspect-auto md:min-h-[560px]">
          <Image src={big} alt="Eyad Zayed modelling, fashion editorial" fill sizes="(min-width:768px) 560px, 92vw" className="object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {shown.map((src, i) => (
            <div key={src} className={`rise relative overflow-hidden rounded-2xl bg-sand ${ratios[i % 4]} ${i % 2 ? 'mt-6' : ''}`} style={{ '--i': i > 3 ? i - 4 : 0 }}>
              <Image src={src} alt={`Eyad Zayed model portfolio photo ${i + 2}`} fill sizes="(min-width:768px) 280px, 46vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      {!more && rest.length > 4 && (
        <button onClick={() => setMore(true)} className="press mx-auto mt-8 block w-full max-w-sm rounded-full border-2 border-espresso/20 bg-gold/40 px-6 py-3.5 text-sm font-bold">
          Show More
        </button>
      )}
    </>
  );
}
