'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { R, Wrap, Title, isVideo, formatViews } from '@/lib/ui';

export default function Ugc({ data: ugc }) {
  const { items, categories } = ugc;
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const videoRefs = useRef([]);
  const raf = useRef(0);
  const mid = Math.floor(items.length / 2);
  const [active, setActive] = useState(mid);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [inView, setInView] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(-1);

  const goTo = useCallback((i, behavior = 'smooth') => {
    const el = trackRef.current;
    const n = itemRefs.current[i];
    if (!el || !n) return;
    el.scrollTo({ left: n.offsetLeft + n.offsetWidth / 2 - el.clientWidth / 2, behavior });
  }, []);

  // الكارت الأقرب لمنتصف الشاشة
  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let min = Infinity;
    itemRefs.current.forEach((n, i) => {
      if (!n) return;
      const dist = Math.abs(n.offsetLeft + n.offsetWidth / 2 - center);
      if (dist < min) { min = dist; best = i; }
    });
    setActive(best);
  }, []);

  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    goTo(mid, 'auto');
    const onResize = () => goTo(activeRef.current, 'auto');
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf.current);
    };
  }, [goTo, mid]);

  // الفيديو يشتغل (صامت) على الكارت النشط بس، ومش بيشتغل لو المستخدم مفعّل reduced motion
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView && !reduce) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, inView]);

  // الفيديو ميشتغلش إلا لما القسم يبان (توفير bandwidth)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!items.length) return null;

  const busy = (i) => setLoadingIdx(i);
  const idle = (i) => setLoadingIdx((c) => (c === i ? -1 : c));

  return (
    <section id="ugc" className="bg-caramel py-16 text-espresso md:py-24">
      <Wrap>
        <Title sub={ugc.sub}>{ugc.title}</Title>

        <R className="-mx-5 mt-8 md:mx-0">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="relative flex snap-x snap-mandatory items-center gap-3 overflow-x-auto py-4 [--w:58%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[--w:40%] md:gap-5 md:[--w:28%] lg:[--w:20%]"
          >
            <div aria-hidden="true" className="w-[calc((100%-var(--w))/2-0.75rem)] shrink-0" />

            {items.map((item, i) => {
              const offset = i - active;
              const rot = Math.max(-1, Math.min(1, offset)) * -14;
              const views = formatViews(item.views);
              return (
                <div
                  key={item.src}
                  ref={(n) => (itemRefs.current[i] = n)}
                  onClick={() => goTo(i)}
                  className="w-[var(--w)] shrink-0 cursor-pointer snap-center"
                  style={{
                    transform: `perspective(900px) rotateY(${rot}deg) scale(${offset === 0 ? 1 : 0.86})`,
                    transition: 'transform 450ms var(--ease-out)',
                  }}
                >
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border-[7px] border-[#17100b] bg-cocoa shadow-xl">
                    {isVideo(item.src) ? (
                      <>
                        <video
                          ref={(v) => (videoRefs.current[i] = v)}
                          src={item.poster ? item.src : `${item.src}#t=0.001`}
                          poster={item.poster || undefined}
                          preload={item.poster ? 'none' : 'metadata'}
                          controls
                          controlsList="nodownload noplaybackrate"
                          disablePictureInPicture
                          onContextMenu={(e) => e.preventDefault()}
                          onPlay={() => busy(i)}
                          onWaiting={() => busy(i)}
                          onPlaying={() => idle(i)}
                          onCanPlay={() => idle(i)}
                          onPause={() => idle(i)}
                          onEnded={() => idle(i)}
                          onError={() => idle(i)}
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                        />
                        {loadingIdx === i && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 m-auto h-10 w-10 animate-spin rounded-full border-[3px] border-white/30 border-t-cream"
                          />
                        )}
                      </>
                    ) : (
                      <Image src={item.src} alt={`UGC video example ${i + 1}`} fill draggable={false}
                        sizes="(min-width:1024px) 20vw, (min-width:768px) 28vw, 58vw" className="object-cover" />
                    )}
                    {views && (
                      <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-cream backdrop-blur">
                        {views} views
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <div aria-hidden="true" className="w-[calc((100%-var(--w))/2-0.75rem)] shrink-0" />
          </div>
        </R>

        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              aria-label={`Go to video ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${i === active ? 'w-9 bg-espresso' : 'w-6 bg-espresso/30 hover:bg-espresso/50'}`}
            />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 divide-x divide-espresso/20">
          {categories.map((c, i) => (
            <R key={c.title} i={i} className={i === 0 ? 'pr-4' : 'pl-4 md:pl-8'}>
              <h3 className="text-2xl font-extrabold md:text-4xl">{c.title}</h3>
              <p className="mt-1 text-xs text-espresso/75 md:text-sm">{c.text}</p>
            </R>
          ))}
        </div>
      </Wrap>
    </section>
  );
}