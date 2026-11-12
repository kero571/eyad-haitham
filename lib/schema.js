import "server-only";
import { z } from "zod";
import { parseAsset } from "@/lib/cloudinary";

const s = (max = 200) => z.string().trim().max(max);
const slug = z
  .string()
  .regex(/^[a-z0-9-]{1,40}$/, "Lowercase letters, numbers and dashes only");
// لينكات آمنة بس: https / #section / مسار داخلي / mailto / tel (يمنع javascript: و data:)
const link = s(500).refine(
  (v) =>
    v === "" ||
    /^(#[\w-]*|\/(?!\/)\S*|https:\/\/\S+|mailto:\S+|tel:[+\d\s-]+)$/i.test(v),
  "Use https://, #section, mailto: or tel:",
);
const https = s(500).refine(
  (v) => v === "" || /^https:\/\/\S+$/i.test(v),
  "Must start with https://",
);
// ميديا: مسار محلي في /images /videos، أو ملف Cloudinary بتاعنا (من غير transformations)
const media = s(700).refine(
  (v) =>
    v === "" ||
    (/^\/(images|videos)\/[\w./-]+$/.test(v) && !v.includes("..")) ||
    parseAsset(v) !== null,
  "Upload the file from the dashboard",
);
const views = z.union([s(20), z.number().min(0).max(1e10)]);
const arr = (item, max) => z.array(item).max(max);

const tone = z.enum([
  "caramel",
  "caramel/80",
  "caramel/70",
  "caramel/60",
  "cocoa",
  "gold",
  "cream/70",
  "cream/50",
]);
const calTone = z.enum(["caramel", "gold", "mocha"]);
const icon = z.enum(["book", "scissors", "bag", "mic", "camera"]);

export const contentSchema = z.object({
  site: z.object({
    name: s(80).min(1),
    url: s(200).regex(/^https?:\/\/\S+$/, "Must start with https://"),
    title: s(120),
    description: s(300),
    keywords: arr(s(60), 20),
    jobTitle: s(120),
    email: z.string().trim().email().max(200),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d\s-]{5,20}$/, "Digits only"),
    wa: z
      .string()
      .trim()
      .regex(/^\d{8,15}$/, "Digits only, with country code (e.g. 2012...)"),
    instagram: https,
    facebook: https,
    tiktok: https,
    drive: https,
  }),
  seo: z.object({ og: media, favicon: media, apple: media }),
  nav: arr(z.object({ id: slug, label: s(40) }), 12),
  header: z.object({
    tagline: s(80),
    cta: z.object({ label: s(40), href: link }),
  }),
  hero: z.object({
    image: media,
    imageAlt: s(200),
    title: s(160),
    subtitle: s(240),
    primaryCta: z.object({ label: s(40), href: link }),
    secondaryCta: z.object({ label: s(40) }),
    tiles: arr(z.object({ id: slug, label: s(30), icon }), 8),
  }),
  brands: z.object({
    title: s(80),
    logos: arr(z.object({ src: media, name: s(80) }), 40),
  }),
  about: z.object({ title: s(60), heading: s(200), text: s(2000) }),
  contentCreator: z.object({
    title: s(80),
    sub: s(240),
    skills: arr(s(60), 20),
    draft: z.object({
      label: s(60),
      total: s(30),
      title: s(120),
      rows: arr(
        z.object({
          time: s(20),
          label: s(30),
          text: s(200),
          highlight: z.boolean().optional(),
        }),
        8,
      ),
    }),
    calendar: z.object({
      caption: s(120),
      days: arr(z.object({ day: s(10), type: s(20), tone: calTone }), 7),
    }),
  }),
  reelEditor: z.object({
    title: s(80),
    sub: s(240),
    items: arr(
      z.object({ src: media, poster: media, title: s(120), views }),
      12,
    ),
    timeline: z.object({
      label: s(60),
      marker: s(20),
      playheadLabel: s(20),
      tracks: arr(
        z.object({
          segments: arr(
            z.object({
              flex: z.number().min(1).max(100),
              tone,
              label: s(30).optional(),
            }),
            8,
          ),
        }),
        5,
      ),
    }),
    features: arr(z.object({ title: s(120), note: s(80) }), 8),
  }),
  ugc: z.object({
    title: s(80),
    sub: s(240),
    items: arr(z.object({ src: media, poster: media, views }), 12),
    categories: arr(z.object({ title: s(60), text: s(160) }), 4),
  }),
  interviewer: z.object({
    title: s(80),
    sub: s(240),
    items: arr(
      z.object({
        src: media,
        poster: media,
        title: s(120),
        meta: s(120),
        tag: s(40),
      }),
      40,
    ),
    quote: s(200),
    points: arr(z.object({ label: s(40), text: s(240) }), 4),
    clientsTitle: s(60),
    clients: arr(s(60), 20),
    pageSize: z.number().int().min(1).max(20).optional(),
    moreLabel: s(40).optional(),
  }),
  model: z.object({
    title: s(80),
    sub: s(240),
    pageSize: z.number().int().min(1).max(20),
    moreLabel: s(40),
    photos: arr(z.object({ src: media, alt: s(160) }), 100),
  }),
  process: z.object({
    title: s(120),
    steps: arr(z.object({ title: s(120), text: s(240) }), 8),
  }),
  footer: z.object({
    title: s(120),
    titleScript: s(80),
    sub: s(240),
    whatsappLabel: s(60),
    emailLabel: s(30),
    callLabel: s(30),
    driveLabel: s(80),
  }),
});
