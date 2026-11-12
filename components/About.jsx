import { R, Wrap } from '@/lib/ui';
import { getContent } from '@/lib/content';

export default async function About() {
  const { about } = await getContent();
  return (
    <section id="about" className="bg-sand px-0 pb-16 pt-10 md:pb-24 md:pt-16">
      <Wrap>
        <R className="text-center">
          <h2 className="font-signature text-6xl leading-none text-espresso md:text-8xl">{about.title}</h2>
          <span aria-hidden="true" className="mx-auto mt-4 block h-px w-20 bg-caramel md:w-28" />
        </R>
        <div className="mt-8 md:mt-12 md:grid md:grid-cols-2 md:items-start md:gap-16">
          <R i={1} as="h3" className="text-[1.9rem] font-extrabold leading-[1.1] tracking-tight md:text-5xl">{about.heading}</R>
          <R i={2} as="p" className="mt-5 font-serif text-[15px] leading-[1.7] text-espresso/85 md:mt-2 md:text-lg">{about.text}</R>
        </div>
      </Wrap>
    </section>
  );
}
