import { R, Wrap, Title } from "@/lib/ui";
import { getContent } from "@/lib/content";
import InterviewGrid from "./InterviewGrid";

export default async function Interviewer() {
  const { interviewer: d } = await getContent();
  return (
    <section id="interviews" className="bg-[#5C5148] py-16 text-cream md:py-24">
      <Wrap>
        <Title light sub={d.sub}>
          {d.title}
        </Title>

        <InterviewGrid items={d.items} pageSize={d.pageSize ?? 6} moreLabel={d.moreLabel ?? "Show More"} />

        <R
          as="p"
          className="mx-auto mt-12 max-w-md text-center font-signature text-4xl leading-[1.15] text-cream md:mt-16 md:max-w-2xl md:text-6xl"
        >
          {d.quote}
        </R>

        <div className="mt-10 grid grid-cols-2 gap-5 text-sm">
          {d.points.map((p, i) => (
            <R key={p.label} i={i}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold">
                {p.label}
              </p>
              <p className="mt-1 font-serif text-cream/80">{p.text}</p>
            </R>
          ))}
        </div>

        <R className="mt-8">
          <p className="text-xs text-cream/60">{d.clientsTitle}</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            {d.clients.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </R>
      </Wrap>
    </section>
  );
}
