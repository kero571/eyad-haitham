import { site } from '@/lib/data';
export default function robots() {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/api'] }, sitemap: `${site.url}/sitemap.xml` };
}
