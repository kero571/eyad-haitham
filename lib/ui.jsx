// Server-safe helpers (بتتستخدم في server و client components)
export function R({ as: T = 'div', i = 0, className = '', children, ...p }) {
  return (
    <T className={`reveal ${className}`} style={{ '--d': `${i * 60}ms` }} {...p}>
      {children}
    </T>
  );
}
export const Script = ({ children, className = '' }) => (
  <span className={`font-script ${className}`}>{children}</span>
);
export const Wrap = ({ className = '', children }) => (
  <div className={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>{children}</div>
);
export const Title = ({ children, sub, light }) => (
  <>
    <R as="h2" className="text-3xl font-extrabold tracking-tight md:text-5xl">{children}</R>
    {sub && (
      <R i={1} as="p" className={`mt-2 max-w-md text-sm md:text-base ${light ? 'text-white/65' : 'text-espresso/65'}`}>
        {sub}
      </R>
    )}
  </>
);

export const isVideo = (src) => /\.(mp4|webm|mov)(\?.*)?$/i.test(String(src || ''));

// 162000 -> "162k" ، والنص ('162k') بيتعرض زي ما هو
export const formatViews = (v) => {
  if (v === null || v === undefined || v === '') return '';
  if (typeof v === 'number') return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v).toLowerCase();
  return String(v);
};
