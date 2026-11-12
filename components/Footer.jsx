import { Mail, Phone, MessageCircle, Instagram, Music2, Facebook, FolderOpen } from 'lucide-react';
import { R, Script, Wrap } from '@/lib/ui';
import { getContent } from '@/lib/content';

const btn = 'press flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold';


export default async function Footer() {
  const { site, footer: d } = await getContent();
  const waLink = `https://wa.me/${site.wa}`;
  const socials = [
    { label: 'Instagram', href: site.instagram, Icon: Instagram },
    { label: 'TikTok', href: site.tiktok, Icon: Music2 },
    { label: 'Facebook', href: site.facebook, Icon: Facebook },
  ].filter((s) => s.href);
  return (
    <footer id="contact" className="bg-espresso py-16 text-center text-cream md:py-24">
      <Wrap className="max-w-xl">
        <R as="h2" className="text-4xl font-extrabold leading-tight md:text-6xl">
          {d.title} <Script className="text-gold">{d.titleScript}</Script>
        </R>
        <R i={1} as="p" className="mt-3 text-sm text-cream/65">{d.sub}</R>

        <R i={2} className="mt-8 space-y-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className={`${btn} bg-gold text-espresso`}>
            <MessageCircle size={16} /> {d.whatsappLabel}
          </a>
          <a href={`mailto:${site.email}`} className={`${btn} bg-white/10`}>
            <Mail size={16} /> {d.emailLabel} {site.email}
          </a>
          <a href={`tel:${site.phone}`} className={`${btn} bg-white/10`}>
            <Phone size={16} /> {d.callLabel} {site.phone}
          </a>
        </R>

        <R i={3} className="mt-8 flex justify-center gap-3">
          {socials.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="press grid h-11 w-11 place-items-center rounded-full bg-white/10">
              <Icon size={18} />
            </a>
          ))}
        </R>

        {site.drive && (
          <a href={site.drive} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs text-cream/60 underline underline-offset-4">
            <FolderOpen size={14} /> {d.driveLabel}
          </a>
        )}
        <p className="mt-8 text-[11px] text-cream/40">© {new Date().getFullYear()} {site.name}</p>
      </Wrap>
    </footer>
  );
}
