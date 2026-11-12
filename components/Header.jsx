'use client';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header({ nav, site, header }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onScroll = () => setScrolled(window.scrollY > 24); // setState بيتجاهل نفس القيمة، فمفيش re-render زيادة
    onScroll();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // الزر بتاع اللابتوب بيغطي لينك الـ contact، فبنشيله من اللينكات
  const links = nav.filter((n) => `#${n.id}` !== header.cta.href);

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      {/* خلفية بتظهر بعد الـ scroll */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-espresso/90 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-start px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <a href="#top" className="rise justify-self-start text-white" style={{ '--i': 0 }}>
          <span className="block text-xl font-extrabold leading-none tracking-tight md:text-2xl">{site.name}</span>
          <span className="mt-1 block font-serif text-[11px] italic text-white/85 md:hidden md:text-xs">{header.tagline}</span>
        </a>

        <nav aria-label="Main" className="rise hidden items-center gap-5 lg:flex xl:gap-8" style={{ '--i': 1 }}>
          {links.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="whitespace-nowrap text-sm font-medium text-white/75 transition-colors duration-150 hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <a href={header.cta.href} className="press rise hidden justify-self-end rounded-full bg-white px-6 py-2.5 text-sm font-bold text-espresso lg:inline-block" style={{ '--i': 2 }}>
          {header.cta.label}
        </a>

        <div className="relative lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="press rise grid h-10 w-10 place-items-center rounded-full bg-espresso/80 text-white backdrop-blur-md md:h-11 md:w-11"
            style={{ '--i': 1 }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <nav id="site-menu" data-open={open} aria-hidden={!open} className="menu absolute right-0 mt-2 w-56 rounded-2xl bg-espresso/95 p-2 shadow-2xl backdrop-blur-md">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-cream hover:bg-white/10">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}