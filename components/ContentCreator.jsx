import { R, Wrap, Title } from '@/lib/ui';
import { getContent } from '@/lib/content';

const dot = { caramel: 'bg-caramel', gold: 'bg-gold', mocha: 'bg-mocha' };

const SkillList = ({ items }) => (
  <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
    {items.map((t) => (
      <li key={t} className="border-b border-current/10 pb-3">{t}</li>
    ))}
  </ul>
);

export default async function ContentCreator() {
  const { contentCreator: c } = await getContent();
  return (
    <section id="content" className="bg-sand py-16 md:py-24">
      <Wrap className="grid gap-8 md:grid-cols-2 md:items-start md:gap-14">
        <div>
          <Title sub={c.sub}>{c.title}</Title>
          <R i={2} className="mt-8 hidden md:block"><SkillList items={c.skills} /></R>
        </div>

        <div className="space-y-4">
          <R className="rounded-[1.75rem] border border-caramel/30 bg-[#F4E9D3] p-4 shadow-[0_6px_20px_-10px_rgb(107_74_51/0.35)] md:p-6">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-espresso/60 md:text-[11px]">
              <span>{c.draft.label}</span>
              <span className="normal-case tracking-normal">{c.draft.total}</span>
            </div>
            <p className="mt-4 text-[17px] font-extrabold leading-tight tracking-tight md:text-xl">{c.draft.title}</p>
            <div className="mt-4 space-y-1.5">
              {c.draft.rows.map((r) => (
                <div key={r.time} className={`flex gap-4 rounded-xl px-3 py-3.5 md:px-4 ${r.highlight ? 'bg-gold/70' : ''}`}>
                  <span className="w-[4.6rem] shrink-0 font-serif text-xs text-espresso/80 md:w-24 md:text-sm">{r.time}</span>
                  <p className="font-serif text-[13px] leading-snug md:text-[15px]">
                    <b className="font-sans text-[10px] font-extrabold tracking-wide md:text-xs">{r.label}</b> {r.text}
                  </p>
                </div>
              ))}
            </div>
          </R>

          <R i={1} className="rounded-[1.75rem] border border-caramel/30 bg-[#F4E9D3]/80 px-3 pb-4 pt-5 md:px-6 md:pb-5">
            <ul className="grid grid-cols-7 text-center">
              {c.calendar.days.map((d) => (
                <li key={d.day} className="flex flex-col items-center gap-2">
                  <span className="font-serif text-[11px] text-espresso/80 md:text-sm">{d.day}</span>
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full md:h-3 md:w-3 ${dot[d.tone] ?? 'bg-caramel'}`} />
                  <span className="font-serif text-[10px] text-espresso/70 md:text-xs">{d.type}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center font-serif text-xs text-espresso/65 md:text-sm">{c.calendar.caption}</p>
          </R>

          <R i={2} className="md:hidden"><SkillList items={c.skills} /></R>
        </div>
      </Wrap>
    </section>
  );
}
