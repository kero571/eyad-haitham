import { R, Wrap, Title, formatViews } from '@/lib/ui';
import { getContent } from '@/lib/content';
import TapMedia from './TapMedia';

const tones = {
  caramel: 'bg-caramel', 'caramel/80': 'bg-caramel/80', 'caramel/70': 'bg-caramel/70', 'caramel/60': 'bg-caramel/60',
  cocoa: 'bg-cocoa', gold: 'bg-gold', 'cream/70': 'bg-cream/70', 'cream/50': 'bg-cream/50',
};

export default async function ReelEditor() {
  const { reelEditor: d } = await getContent();
  return (
    <section id="reels" className="bg-espresso py-16 text-cream md:py-24">
      <Wrap>
        <Title light sub={d.sub}>{d.title}</Title>

        {/* سحب أفقي في الموبايل، grid في الشاشات الكبيرة */}
        <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
          {d.items.map((item, i) => (
            <R key={item.src} i={i} className="zoom w-[42%] shrink-0 snap-start md:w-auto">
              <TapMedia src={item.src} poster={item.poster} alt={item.title} sizes="(min-width:768px) 360px, 42vw" className="aspect-[7/10] rounded-2xl bg-mocha">
                {formatViews(item.views) && (
                  <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-semibold text-cream backdrop-blur">
                    {formatViews(item.views)} views
                  </span>
                )}
              </TapMedia>
              <p className="mt-2 text-[11px] font-medium leading-tight text-cream/90 md:text-sm">{item.title}</p>
            </R>
          ))}
        </div>

        {/* Timeline */}
        <R className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-mocha p-4" aria-hidden="true">
          <div className="flex justify-between text-[10px] text-cream/60">
            <span>{d.timeline.label}</span>
            <span>{d.timeline.marker}</span>
          </div>
          <div className="relative mt-8 space-y-1.5">
            {d.timeline.tracks.map((row, r) => (
              <div key={r} className="flex h-5 gap-1.5">
                {row.segments.map((s, k) => (
                  <div key={k} style={{ flex: s.flex }} className={`flex min-w-0 items-center rounded-md px-2 ${tones[s.tone] ?? 'bg-caramel'}`}>
                    {s.label && <span className="truncate text-[9px] font-semibold text-espresso">{s.label}</span>}
                  </div>
                ))}
              </div>
            ))}
            <div className="playhead pointer-events-none absolute -top-6 bottom-0 left-0 w-full">
              <span className="absolute right-0 top-0 translate-x-1/2 rounded bg-gold px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-espresso">
                {d.timeline.playheadLabel}
              </span>
              <span className="absolute bottom-0 right-0 top-4 w-0.5 bg-gold" />
            </div>
          </div>
        </R>

        <ul className="mt-6 divide-y divide-white/10 text-[13px] md:text-sm">
          {d.features.map((f) => (
            <R as="li" key={f.title} className="flex items-center justify-between gap-4 py-3.5">
              <span className="text-cream">{f.title}</span>
              <span className="shrink-0 text-xs font-semibold text-gold">{f.note}</span>
            </R>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
