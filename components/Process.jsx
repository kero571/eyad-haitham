import { R, Wrap } from '@/lib/ui';
import { getContent } from '@/lib/content';

export default async function Process() {
  const { process: d } = await getContent();
  return (
    <section id="process" className="bg-sand py-16 md:py-24">
      <Wrap className="md:grid md:grid-cols-2 md:items-start md:gap-16">
        <R as="h2" className="text-[1.9rem] font-extrabold leading-tight tracking-tight md:text-5xl">{d.title}</R>

        <ol className="mt-8 md:mt-3">
          {d.steps.map((s, i) => (
            <R as="li" key={s.title} i={i} className="relative pb-8 pl-11 last:pb-0 md:pl-14">
              {i < d.steps.length - 1 && (
                <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-8 w-px bg-caramel/50 md:left-[15px] md:top-10" />
              )}
              <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-caramel text-[11px] font-bold text-white md:h-8 md:w-8 md:text-sm">
                {i + 1}
              </span>
              <h3 className="text-base font-extrabold leading-6 md:text-xl md:leading-8">{s.title}</h3>
              <p className="mt-1.5 max-w-sm font-serif text-[15px] leading-relaxed text-espresso/85 md:text-lg">{s.text}</p>
            </R>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}
