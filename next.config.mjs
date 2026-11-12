const cloud = process.env.CLOUDINARY_CLOUD_NAME;
const dev = process.env.NODE_ENV !== 'production';

// CSP: 'unsafe-inline' للسكريبت لازم عشان Next بيحقن inline scripts (والـ nonce هيخلي الصفحات كلها dynamic).
// الحماية الأساسية من XSS: React escaping + schema validation للمحتوى + تهريب الـ JSON-LD.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.clarity.ms https://scripts.clarity.ms${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.clarity.ms https://c.bing.com",
  "media-src 'self' blob: https://res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self' https://api.cloudinary.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.clarity.ms https://c.bing.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

/** @type {import('next').NextConfig} */
export default {
  serverExternalPackages: ['firebase-admin', 'cloudinary'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 828, 1080, 1440, 1920],
    // مقيّد بحساب Cloudinary بتاعك بس (عشان محدش يستخدم الـ image optimizer بتاعك لصور تانية)
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: cloud ? `/${cloud}/**` : '/**' }],
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
      { source: '/dashboard/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};
