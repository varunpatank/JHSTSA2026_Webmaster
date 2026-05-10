import { ReactNode } from "react";

type HeroStat = { label: string; value: ReactNode };

// Texture patterns: each page hero gets a different subtle background texture
export const HERO_TEXTURES = {
  dots:      { backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)", backgroundSize: "20px 20px" },
  grid:      { backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "40px 40px" },
  diagonal:  { backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)", backgroundSize: "20px 20px" },
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
  texture = "dots",
  align = "left",
}: HeroSectionProps) {
  // Use only the first image — no cycling
  const allImages = images ?? (bgImage ? [bgImage] : []);
  const heroImage = allImages[0] ?? null;

  return (
    <section className="relative overflow-hidden bg-primary-900">
      {/* Shared banner pattern — wavy blobs + social icons on navy */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hsBannerPat" x="0" y="0" width="520" height="300" patternUnits="userSpaceOnUse">
              {/* Wavy blob shapes */}
              <path d="M-20,80 C60,40 120,120 200,90 C280,60 320,130 400,100 C460,78 500,110 540,95" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" fill="none"/>
              <path d="M-20,160 C50,130 100,180 180,155 C260,130 310,175 390,150 C450,132 490,165 540,148" stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none"/>
              <path d="M-20,240 C70,210 140,255 220,230 C300,205 360,248 440,222 C490,207 520,232 540,220" stroke="rgba(255,255,255,0.06)" strokeWidth="1.8" fill="none"/>
              {/* Organic blob fills */}
              <ellipse cx="80" cy="60" rx="48" ry="32" fill="rgba(255,255,255,0.045)" />
              <ellipse cx="300" cy="200" rx="60" ry="38" fill="rgba(255,255,255,0.035)" />
              <ellipse cx="450" cy="80" rx="42" ry="28" fill="rgba(255,255,255,0.04)" />
              {/* Dots grid top-right */}
              <g opacity="0.30" fill="white">
                <circle cx="460" cy="30" r="2.2"/><circle cx="470" cy="30" r="2.2"/><circle cx="480" cy="30" r="2.2"/>
                <circle cx="460" cy="40" r="2.2"/><circle cx="470" cy="40" r="2.2"/><circle cx="480" cy="40" r="2.2"/>
                <circle cx="460" cy="50" r="2.2"/><circle cx="470" cy="50" r="2.2"/><circle cx="480" cy="50" r="2.2"/>
              </g>
              {/* Dots grid bottom-left */}
              <g opacity="0.25" fill="white">
                <circle cx="20" cy="230" r="2"/><circle cx="30" cy="230" r="2"/><circle cx="40" cy="230" r="2"/>
                <circle cx="20" cy="240" r="2"/><circle cx="30" cy="240" r="2"/><circle cx="40" cy="240" r="2"/>
                <circle cx="20" cy="250" r="2"/><circle cx="30" cy="250" r="2"/><circle cx="40" cy="250" r="2"/>
              </g>
              {/* Small circles scatter */}
              <circle cx="100" cy="185" r="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
              <circle cx="310" cy="55" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
              <circle cx="415" cy="245" r="6" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
              <circle cx="510" cy="190" r="8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hsBannerPat)"/>
        </svg>
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-11 pb-20 md:pt-12 md:pb-24 ${align === "center" ? "text-center" : ""}`}>
        {eyebrow && (
          <span className="inline-block cream-textured border border-cream-400 text-primary-900 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
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
          <div className={`mt-4 max-w-xl ${align === "center" ? "mx-auto" : ""}`}>
            <div className="cream-textured border border-cream-400 rounded-xl px-5 py-3.5">
                <div className="text-[13px] text-primary-900 font-medium leading-[1.75] [&_strong]:text-secondary-700 [&_strong]:font-bold [&_a]:text-primary-700">
                {description}
              </div>
            </div>
          </div>
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