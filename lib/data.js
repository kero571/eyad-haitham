// ============================================================
//  كل محتوى الموقع من الملف ده (نصوص، صور، فيديوهات، لينكات).
//  لما الداشبورد يجهز: استبدل القيم دي بالـ fetch من الـ API
//  بنفس الشكل بالظبط ومش هتحتاج تلمس أي component.
//
//  الميديا (reels / ugc / interviews): src ممكن يكون صورة أو فيديو
//  (.mp4 .webm .mov) وبيتعرف عليه تلقائياً. poster اختياري للفيديو.
//  مثال: { src: '/videos/reel-1.mp4', poster: '/images/reel-1.jpg', ... }
// ============================================================
const img = (f) => `/images/${f}`;

/* ---------------- Site / SEO ---------------- */
export const site = {
  name: "Eyad Zayed",
  url: "https://eyadzayed.vercel.app",
  title: "Eyad Zayed | Content Creator, Reel Editor, UGC Creator & Model",
  description:
    "Content creator, reel editor, UGC creator, interviewer and model in Egypt. Scripts, edits and on-camera content that people finish watching.",
  keywords: [
    "content creator",
    "UGC creator",
    "reel editor",
    "video editor",
    "interviewer",
    "model",
    "Egypt",
    "Eyad Zayed",
  ],
  jobTitle: "Content Creator, Reel Editor, UGC Creator & Model",
  email: "eyadhaithamzayed@gmail.com",
  phone: "01201724499",
  wa: "201201724499",
  instagram:
    "https://www.instagram.com/eyad_zayedd?obrf=MXA2ZmdtandkajFpMA%3D%3D&utm_source=qr",
  facebook: "https://www.facebook.com/share/1J3iBfT1x2/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@eyad_zayedd?_r=1&_t=ZS-9BHnApoWvUP",
  drive:
    "https://drive.google.com/drive/folders/1lk140lo6jsaGbtA9ZivD2AJPZcSOQpJr",
};
export const waLink = `https://wa.me/${site.wa}`;

export const seo = {
  og: img("seo/og.jpg"), // 1200x630
  favicon: img("seo/favicon.png"),
  apple: img("seo/apple-touch-icon.png"), // 180x180
};

/* ---------------- Header ---------------- */
export const nav = [
  { id: "about", label: "About" },
  { id: "content", label: "Content creator" },
  { id: "reels", label: "Reel editor" },
  { id: "ugc", label: "UGC creator" },
  { id: "interviews", label: "Interviewer" },
  { id: "model", label: "Model" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];
export const header = {
  tagline: "Content creator and model",
  cta: { label: "Contact me", href: "#contact" }, // الزر اللي في اللابتوب
};

/* ---------------- Hero ---------------- */
export const hero = {
  image: img("hero.jpg"),
  imageAlt:
    "Eyad Zayed, content creator and model, portrait in warm window light",
  title: "I create content people finish watching.",
  subtitle: "Content creator, reel editor, UGC creator, interviewer and model.",
  primaryCta: { label: "See my work", href: "#content" },
  secondaryCta: { label: "Message me" }, // بيفتح واتساب
  // icon: book | scissors | bag | mic | camera
  tiles: [
    { id: "content", label: "Content", icon: "book" },
    { id: "reels", label: "Reels", icon: "scissors" },
    { id: "ugc", label: "UGC", icon: "bag" },
    { id: "interviews", label: "Interviews", icon: "mic" },
    { id: "model", label: "Model", icon: "camera" },
  ],
};

/* ---------------- Brands ---------------- */
export const brands = {
  title: "Brands I've worked with",
  logos: [1, 2, 3, 4, 5, 6].map((n) => ({
    src: img(`brands/brand-${n}.png`),
    name: `Brand ${n}`,
  })),
};

/* ---------------- About ---------------- */
export const about = {
  title: "About Me",
  heading: "One creator for the whole idea, from script to screen.",
  text: "I've collaborated with more than 100 local brands as a content creator, editor, UGC creator, interviewer and model. I'm also head of PR and media at ConnectX, a student activity at my university, and I previously worked as a content creator and interviewer at the marketing agency Zenz.",
};

/* ---------------- Content creator ---------------- */
export const contentCreator = {
  title: "Content creator",
  sub: "Ideas, hooks and scripts that give your brand something worth watching.",
  skills: [
    "Reel ideas",
    "Catchy hooks",
    "Scriptwriting",
    "Social media & blog",
    "Trend research",
    "Proofreading",
    "Storyboards",
    "Content strategy",
  ],
  draft: {
    label: "Production draft",
    total: "0:30 total",
    title: "Reel script: new summer collection",
    rows: [
      {
        time: "0:00–0:03",
        label: "HOOK:",
        text: "Stop buying jeans before you see this.",
        highlight: true,
      },
      {
        time: "0:03–0:20",
        label: "BODY:",
        text: "Three outfits, one piece, no repeats.",
      },
      {
        time: "0:20–0:30",
        label: "CALL TO ACTION:",
        text: "Tell me which look wins.",
      },
    ],
  },
  // tone: caramel | gold | mocha
  calendar: {
    caption: "Content calendars that keep publishing on time",
    days: [
      { day: "Mon", type: "Reel", tone: "caramel" },
      { day: "Tue", type: "Story", tone: "gold" },
      { day: "Wed", type: "Post", tone: "mocha" },
      { day: "Thu", type: "Reel", tone: "caramel" },
      { day: "Fri", type: "Story", tone: "gold" },
      { day: "Sat", type: "Post", tone: "mocha" },
      { day: "Sun", type: "Reel", tone: "caramel" },
    ],
  },
};

/* ---------------- Reel editor ---------------- */
export const reelEditor = {
  title: "Reel editor",
  sub: "Short videos cut to keep people watching past the first seconds.",
  // views: رقم (162000) أو نص ('162k')
  items: [
    {
      src: img("reel-1.jpg"),
      poster: "",
      title: "Defacto lookbook cut",
      views: "162k",
    },
    {
      src: img("reel-2.jpg"),
      poster: "",
      title: "Hook retention cut",
      views: "99k",
    },
    { src: img("reel-3.jpg"), poster: "", title: "Audio sync", views: "25k" },
  ],
  // flex = العرض النسبي. tone: caramel caramel/80 caramel/70 caramel/60 cocoa gold cream/70 cream/50
  timeline: {
    label: "Timeline 0:30",
    marker: "0:03",
    playheadLabel: "HOOK",
    tracks: [
      [
        { flex: 34, tone: "caramel", label: "Hook cut" },
        { flex: 30, tone: "cocoa" },
        { flex: 30, tone: "caramel/70" },
      ],
      [
        { flex: 18, tone: "cream/70" },
        { flex: 22, tone: "cream/50" },
        { flex: 26, tone: "caramel/80" },
        { flex: 28, tone: "cocoa" },
      ],
      [
        { flex: 12, tone: "gold" },
        { flex: 38, tone: "cocoa" },
        { flex: 40, tone: "caramel/60" },
      ],
    ],
  },
  features: [
    { title: "Hook-first pacing", note: "0–3s retention" },
    { title: "Captions and transitions", note: "dynamic text" },
    { title: "Sound and beat sync", note: "trending audio" },
    { title: "Delivery on the agreed deadline", note: "guaranteed turnaround" },
  ],
};

/* ---------------- UGC ---------------- */
export const ugc = {
  title: "UGC creator",
  sub: "Content that feels like a real recommendation, made with 15 marketing agencies.",
  items: [
    { src: img("ugc-1.jpg"), poster: "", views: "120k" },
    { src: img("ugc-2.jpg"), poster: "", views: "85k" },
    { src: img("ugc-3.jpg"), poster: "", views: "40k" },
  ],
  categories: [
    { title: "Fashion", text: "Outfit and styling videos" },
    { title: "Lifestyle", text: "Daily routines and everyday products" },
  ],
};

/* ---------------- Interviewer ---------------- */
export const interviewer = {
  title: "Interviewer",
  sub: "I make people comfortable, so they open up and give their best answers.",
  items: [
    {
      src: img("interview-1.jpg"),
      poster: "",
      title: "Brand Founder Dialogue",
      meta: "Multi-cam • Long-form",
      tag: "Ep.04",
    },
    {
      src: img("interview-2.jpg"),
      poster: "",
      title: "C-Level Tech Hiring",
      meta: "Candidate screening interviews",
      tag: "ZENZ STUDIO",
    },
  ],
  quote: "A relaxed room gets the best answers.",
  points: [
    {
      label: "On camera",
      text: "Interviews for brands and agencies that feel like conversations.",
    },
    {
      label: "In hiring",
      text: "Quickly assess technical skills, problem solving and culture fit.",
    },
  ],
  clientsTitle: "Interviews done for",
  clients: ["Zenz", "ConnectX", "Launder", "City Milk", "Gokids", "Byf"],
  pageSize: 6,
  moreLabel: "Show More",
};

/* ---------------- Model (صور بس) ---------------- */
export const model = {
  title: "Model",
  sub: "Fashion and lifestyle looks for brand campaigns and social media.",
  pageSize: 5, // بيظهر 5، وكل ضغطة على Show More بتزود 5
  moreLabel: "Show More",
  photos: Array.from({ length: 9 }, (_, i) => ({
    src: img(`model-${i + 1}.jpg`),
    alt: `Eyad Zayed model portfolio photo ${i + 1}`,
  })),
};

/* ---------------- Process ---------------- */
export const process = {
  title: "How we'll work together",
  steps: [
    {
      title: "You share your vision.",
      text: "I learn about your brand and what you want to achieve.",
    },
    {
      title: "I plan the content.",
      text: "A content strategy, scripts and storyboards made for your brand.",
    },
    {
      title: "I create and review.",
      text: "I shoot, edit and check everything against your brand guidelines.",
    },
    {
      title: "I deliver on time.",
      text: "Every asset arrives on the timeline we agreed.",
    },
  ],
};

/* ---------------- Footer ---------------- */
export const footer = {
  title: "Let's make something",
  titleScript: "worth watching.",
  sub: "Available for creative direction, UGC campaigns, video editing and modeling.",
  whatsappLabel: "Message me on WhatsApp",
  emailLabel: "Email",
  callLabel: "Call",
  driveLabel: "Browse all my work on Google Drive",
};
