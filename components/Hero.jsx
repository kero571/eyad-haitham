import Image from 'next/image';
import { BookOpen, Scissors, ShoppingBag, Mic, Camera, MessageCircle } from 'lucide-react';
import { getContent } from '@/lib/content';

const icons = { book: BookOpen, scissors: Scissors, bag: ShoppingBag, mic: Mic, camera: Camera };

export default async function Hero() {
  const { hero, site } = await getContent();
  const waLink = `https://wa.me/${site.wa}`;
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-espresso text-white">
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col md:grid md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:pb-12 md:pt-28">
        <div className="absolute inset-0 -z-10 overflow-hidden md:relative md:inset-auto md:z-0 md:order-2 md:aspect-[4/5] md:max-h-[78svh] md:w-full md:justify-self-end md:rounded-[2rem]">
          {/* LCP: transform بس بدون opacity */}
          <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="(min-width: 768px) 560px, 100vw" quality={80}
            className="settle object-cover object-center md:object-[50%_40%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-transparent via-50% to-espresso/25 md:hidden" />
        </div>

        <div className="relative mt-auto px-5 pb-6 pt-44 md:order-1 md:mt-0 md:p-0">
          <h1
            className="rise block rounded-2xl bg-white/30 px-4 py-3 text-[1.15rem] font-extrabold leading-snug tracking-tight text-espresso backdrop-blur-sm sm:w-fit sm:text-2xl md:max-w-xl md:rounded-none md:bg-transparent md:p-0 md:text-4xl md:leading-[1.08] md:text-white md:backdrop-blur-none"
            style={{ '--i': 2 }}
          >
            {hero.title}
          </h1>

          <p className="rise mt-2 max-w-md font-serif text-[15px] leading-relaxed text-white/90 md:mt-6 md:text-lg md:text-white/75" style={{ '--i': 3 }}>
            {hero.subtitle}
          </p>

          <div className="rise mt-5 flex gap-3 md:mt-8" style={{ '--i': 4 }}>
            <a href={hero.primaryCta.href} className="press flex-1 rounded-full bg-caramel px-5 py-3.5 text-center text-sm font-bold text-espresso md:flex-none md:px-8">
              {hero.primaryCta.label}
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="press inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-espresso md:flex-none md:px-8">
              <MessageCircle size={16} /> {hero.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-4 flex justify-between md:mt-10 md:max-w-md md:justify-start md:gap-6">
            {hero.tiles.map(({ id, label, icon }, i) => {
              const Icon = icons[icon] ?? BookOpen;
              return (
                <li key={id} className="rise" style={{ '--i': 5 + i * 0.6 }}>
                  <a href={`#${id}`} aria-label={`Go to ${label} section`} className="group flex flex-col items-center gap-1.5 text-[10px] font-medium text-white/90 md:text-xs">
                    <span className="lift press grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-espresso/80 backdrop-blur-md md:h-14 md:w-14">
                      <Icon size={20} strokeWidth={1.6} />
                    </span>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
