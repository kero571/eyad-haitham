import Script from 'next/script';

// بيتحمّل بعد ما الصفحة تخلص (lazyOnload) عشان مايأثرش على LCP/INP.
// بيتحط في app/page.js بس (الموقع العام)، مش في الـ layout، عشان الداشبورد مايتسجلش.
// مهم: الـ id مايكونش "clarity"، لأن المتصفح بيحوّله لمتغير window.clarity ويكسر السكريبت.
export default function Clarity() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID || '';
  if (!/^[a-z0-9]{6,20}$/i.test(id)) return null;
  return (
    <Script id="ms-clarity-init" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
    </Script>
  );
}
