import { Plus_Jakarta_Sans, Pinyon_Script, Playfair_Display, Great_Vibes } from 'next/font/google';
import './globals.css';
import { getContent } from '@/lib/content';
import RevealObserver from '@/components/RevealObserver';

const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const script = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });
const serif = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const signature = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-signature', display: 'swap' });

export const viewport = { themeColor: '#2A1B12', width: 'device-width', initialScale: 1 };

export async function generateMetadata() {
  const { site, seo } = await getContent();
  let base;
  try { base = new URL(site.url); } catch { base = new URL('http://localhost:3000'); }
  return {
    metadataBase: base,
    title: { default: site.title, template: `%s | ${site.name}` },
    description: site.description,
    keywords: site.keywords,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website', url: site.url, siteName: site.name, title: site.title, description: site.description,
      images: [{ url: seo.og, width: 1200, height: 630, alt: `${site.name} portfolio` }],
    },
    twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [seo.og] },
    icons: { icon: seo.favicon, apple: seo.apple },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }) {
  const { site, hero } = await getContent();
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Person',
    name: site.name, url: site.url, image: `${site.url}${hero.image}`.replace(/^(https?:\/\/[^/]+)(https?:\/\/)/, '$2'),
    jobTitle: site.jobTitle, email: `mailto:${site.email}`, telephone: site.phone,
    sameAs: [site.instagram, site.tiktok, site.facebook].filter(Boolean),
  };
  // نهرّب "<" عشان محتوى الداشبورد مايقدرش يقفل الـ <script> (XSS)
  const safeJson = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
  return (
    <html lang="en" className={`${sans.variable} ${script.variable} ${serif.variable} ${signature.variable}`}>
      <body className="font-sans">
        {children}
        <RevealObserver />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson }} />
      </body>
    </html>
  );
}
