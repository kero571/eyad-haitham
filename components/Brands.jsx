import Image from 'next/image';
import { getContent } from '@/lib/content';

export default async function Brands() {
  const { brands } = await getContent();
  const { logos, title } = brands;
  if (!logos.length) return null;
  // كل نص لازم يكون أعرض من أي شاشة (≈30 لوجو) عشان مفيش فراغ في اللف
  const repeat = Math.ceil(30 / logos.length);
  const group = Array.from({ length: repeat }, () => logos).flat();

  return (
    <section aria-label={title} className="pinstripe py-5 md:py-6">
      <p className="mb-4 text-center font-serif text-xs text-espresso/70 md:text-sm">{title}</p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee flex">
          {[0, 1].map((half) => (
            <ul key={half} aria-hidden={half === 1} className="flex shrink-0 items-center gap-10 pr-10">
              {group.map((logo, i) => (
                <li key={i} className="shrink-0">
                  <Image src={logo.src} alt={half === 0 && i < logos.length ? logo.name : ''} width={48} height={48} loading="eager"
                    className="h-10 w-10 rounded-full object-contain md:h-12 md:w-12" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
