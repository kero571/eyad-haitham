"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { isVideo } from "@/lib/ui";

/**
 * إطار ميديا: صورة أو فيديو (بيتعرف من الامتداد).
 * الفيديو: زر التشغيل بيظهر قبل أول تشغيل بس، وبعدها الـ controls الأصلية هي المتحكمة.
 * أي فيديو بيشتغل بيوقف أي فيديو تاني شغال.
 * children = بادجات فوق الميديا (views, tag...)
 */
export default function TapMedia({
  src,
  poster,
  alt,
  sizes,
  className = "",
  children,
}) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const video = isVideo(src);

  const pauseOthers = (v) =>
    document
      .querySelectorAll("video[data-tap]")
      .forEach((o) => o !== v && o.pause());

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {video ? (
        <video
          ref={ref}
          data-tap
          src={poster ? src : `${src}#t=0.001`}
          poster={poster || undefined}
          preload={poster ? "none" : "metadata"}
          playsInline
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          loop
          aria-label={alt}
          onPlay={(e) => {
            setStarted(true);
            pauseOthers(e.currentTarget);
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
      />
      <div className="pointer-events-none absolute inset-0">{children}</div>
      {video && !started && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play ${alt}`}
          className="absolute inset-0 grid place-items-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold shadow-lg md:h-12 md:w-12">
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 h-4 w-4 fill-espresso md:h-5 md:w-5"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
