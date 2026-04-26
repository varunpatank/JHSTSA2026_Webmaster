"use client";
import { useState, useEffect } from "react";
import { ReactNode } from "react";

type HeroStat = { label: string; value: ReactNode };

// Texture patterns: each page hero gets a different subtle background texture
export const HERO_TEXTURES = {
  dots:      { backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)", backgroundSize: "22px 22px" },
  grid:      { backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "40px 40px" },
  diagonal:  { backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 9px, rgba(255,255,255,0.07) 9px, rgba(255,255,255,0.07) 10px), repeating-linear-gradient(-45deg, transparent, transparent 9px, rgba(255,255,255,0.07) 9px, rgba(255,255,255,0.07) 10px)" },
  cross:     { backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "20px 20px" },
  waves:     { backgroundImage: "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 22px, rgba(255,255,255,0.06) 22px, rgba(255,255,255,0.06) 23px)" },
};

type TextureKey = keyof typeof HERO_TEXTURES;

type HeroSectionProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  highlightWord?: string;
  description?: ReactNode;
  icon?: ReactNode;
  stats?: HeroStat[];
  statsClassName?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  shellClassName?: string;
  contentClassName?: string;
  align?: "center" | "left";
  /** Single background image URL */
  bgImage?: string;
  /** Multiple images for crossfade carousel */
  images?: string[];
  /** Texture pattern key */
  texture?: TextureKey;
};

export default function HeroSection({
  eyebrow,
  title,
  highlightWord,
  description,
  icon,
  stats,
  actions,
  children,
  bgImage,
  images,
  texture = "diagonal",
  align = "left",
}: HeroSectionProps) {
  const allImages = images ?? (bgImage ? [bgImage] : []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % allImages.length), 5000);
    return () => clearInterval(t);
  }, [allImages.length]);

  return (
    <section className="relative overflow-hidden bg-primary-900">
      {/* Crossfading background images */}
      {allImages.length > 0 && (
        <div className="absolute inset-0">
          {allImages.map((src, i) => (
            <div key={src} className={`absolute inset-0 transition-opacity duration-[2000ms] ${i === idx ? "opacity-100" : "opacity-0"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover opacity-[0.22]" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Diagonal crosshatch + community icon accents on all banners */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.06) 12px, rgba(255,255,255,0.06) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255,255,255,0.06) 12px, rgba(255,255,255,0.06) 13px)"
      }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ opacity: 0.10 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="bannerAccent" x="0" y="0" width="280" height="200" patternUnits="userSpaceOnUse">
              <circle cx="28" cy="30" r="9" stroke="white" strokeWidth="1.4" fill="none"/>
              <path d="M11 54 Q11 43 28 43 Q45 43 45 54" stroke="white" strokeWidth="1.4" fill="none"/>
              <rect x="90" y="14" width="54" height="28" rx="7" stroke="white" strokeWidth="1.4" fill="none"/>
              <path d="M100 42 L96 54 L110 42" stroke="white" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
              <path d="M238 22 L240 28 L246 28 L241 32 L243 38 L238 34 L233 38 L235 32 L230 28 L236 28Z" stroke="white" strokeWidth="1.4" fill="none"/>
              <rect x="18" y="118" width="40" height="46" rx="3" stroke="white" strokeWidth="1.4" fill="none"/>
              <line x1="38" y1="118" x2="38" y2="164" stroke="white" strokeWidth="1.4"/>
              <line x1="18" y1="132" x2="58" y2="132" stroke="white" strokeWidth="0.8"/>
              <line x1="18" y1="144" x2="58" y2="144" stroke="white" strokeWidth="0.8"/>
              <circle cx="150" cy="126" r="4" stroke="white" strokeWidth="1.2" fill="none"/>
              <circle cx="182" cy="114" r="4" stroke="white" strokeWidth="1.2" fill="none"/>
              <circle cx="192" cy="144" r="4" stroke="white" strokeWidth="1.2" fill="none"/>
              <line x1="154" y1="126" x2="178" y2="116" stroke="white" strokeWidth="0.9"/>
              <line x1="154" y1="128" x2="188" y2="142" stroke="white" strokeWidth="0.9"/>
              <line x1="182" y1="118" x2="190" y2="140" stroke="white" strokeWidth="0.9"/>
              <path d="M90 100 L91.5 105 L97 105 L92.5 108 L94 113 L90 110 L86 113 L87.5 108 L83 105 L88.5 105Z" stroke="white" strokeWidth="1" fill="none"/>
              <circle cx="250" cy="80" r="2.5" stroke="white" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bannerAccent)"/>
        </svg>
      </div>

      {/* Decorative graduation cap — upper-right, elegant white outline */}
      <div className="absolute pointer-events-none select-none" style={{ top: "10%", right: "6%", opacity: 0.13 }} aria-hidden="true">
        <svg width="170" height="148" viewBox="0 0 170 148" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Mortarboard top */}
          <polygon points="85,10 142,40 85,70 28,40" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
          {/* Cap body */}
          <path d="M46 47 L46 78 Q85 102 124 78 L124 47" stroke="white" strokeWidth="2.5" fill="none"/>
          {/* Tassel cord */}
          <line x1="142" y1="40" x2="142" y2="70" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Tassel ball */}
          <circle cx="142" cy="79" r="8" stroke="white" strokeWidth="2.2" fill="none"/>
          {/* Tassel strands */}
          <line x1="135" y1="79" x2="128" y2="110" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="142" y1="79" x2="142" y2="112" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="149" y1="79" x2="154" y2="110" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-11 pb-20 md:pt-12 md:pb-24 ${align === "center" ? "text-center" : ""}`}>
        {eyebrow && (
          <span className="inline-block bg-white/10 text-primary-100 text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
            {eyebrow}
          </span>
        )}

        {title && (
          <div className={`relative w-fit max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
              {icon && <span className="inline-block mr-3 opacity-90">{icon}</span>}
              {title}
              {highlightWord && (
                <>
                  {" "}
                  <span className="relative inline-block text-secondary-400 italic">
                    {highlightWord}
                    <span
                      className="absolute pointer-events-none select-none z-20"
                      style={{ top: "-0.52em", right: "-0.45em", transform: "rotate(12deg)", transformOrigin: "50% 100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
                        <polygon points="20,7 35,15 20,23 5,15" fill="#0d1b2b" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" />
                        <path d="M12 16 L12 24 Q20 30 28 24 L28 16" fill="#0d1b2b" fillOpacity="0.85" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3" strokeLinejoin="round" />
                        <line x1="35" y1="15" x2="35" y2="27" stroke="#b8860b" strokeWidth="1.9" strokeLinecap="round" />
                        <circle cx="35" cy="29" r="2.5" fill="#b8860b" />
                      </svg>
                    </span>
                  </span>
                </>
              )}
            </h1>
          </div>
        )}

        {description && (
          <p className={`mt-3 text-primary-200 text-sm leading-relaxed ${align === "center" ? "max-w-xl mx-auto" : "max-w-xl"}`}>
            {description}
          </p>
        )}

        {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}

        {stats && stats.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-8 border-t border-white/10 pt-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold font-heading text-white">{s.value}</p>
                <p className="text-[10px] text-primary-300 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>

      {/* Wave bottom */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
        <svg viewBox="0 0 1440 42" preserveAspectRatio="none" className="block w-full h-7 md:h-9">
          <path d="M0,42 L0,20 C360,42 720,0 1080,20 C1260,30 1380,16 1440,20 L1440,42 Z" fill="#f5f0e8" />
        </svg>
      </div>
    </section>
  );
}