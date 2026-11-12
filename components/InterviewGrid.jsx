'use client';
import { useState } from 'react';
import { R } from '@/lib/ui';
import TapMedia from './TapMedia';

// بيعرض pageSize عنصر، وكل ضغطة على الزر بتزود pageSize (أو الباقي لو أقل)
export default function InterviewGrid({ items, pageSize = 6, moreLabel = 'Show More' }) {
  const [count, setCount] = useState(pageSize);
  const [from, setFrom] = useState(pageSize); // أول عنصر جديد بعد الضغط (للأنيميشن)
  const visible = items.slice(0, count);
  const hasMore = count < items.length;

  const more = () => {
    setFrom(count);
    setCount((c) => Math.min(c + pageSize, items.length));
  };

  const card = (item) => (
    <>
      <TapMedia src={item.src} poster={item.poster} alt={item.title} sizes="(min-width:768px) 480px, 46vw" className="aspect-[3/4] rounded-2xl bg-espresso">
        {item.tag && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-bold tracking-wide text-cream backdrop-blur">
            {item.tag}
          </span>
        )}
      </TapMedia>
      <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
      <p className="text-xs text-cream/60">{item.meta}</p>
    </>
  );

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
        {visible.map((item, i) =>
          i < pageSize ? (
            // الأولانيين بيظهروا مع الـ scroll reveal
            <R key={item.src} i={i} className="zoom">{card(item)}</R>
          ) : (
            // اللي بيتضاف بعد الضغط: الـ observer مش بيشوفهم، فبنستخدم rise
            <div key={item.src} className="zoom rise" style={{ '--i': Math.max(0, i - from) }}>{card(item)}</div>
          )
        )}
      </div>
      {hasMore && (
        <button onClick={more} className="press mx-auto mt-8 block w-full max-w-sm rounded-full border-2 border-cream/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-cream hover:bg-white/15">
          {moreLabel}
        </button>
      )}
    </>
  );
}
