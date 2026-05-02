"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BookOpen, Calendar, ChevronLeft, ChevronRight, MapPin, Rocket, Trophy, Users, Search, Sparkles, Zap, Lightbulb, Users2, BadgeCheck,
} from "lucide-react";
import { events, stats, chapters } from "@/lib/data";

const WORDS = ["Community.", "Competitions.", "Events.", "Mentors.", "Resources."];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="relative inline-block"
      style={{ height: "1.16em", minWidth: "7.8em", verticalAlign: "0.02em" }}
    >
      {/* Overflow-hidden wrapper keeps the slide animation clipped */}
      <span className="absolute inset-0 overflow-hidden" aria-live="polite">
        {WORDS.map((word, i) => (
          <span
            key={word}
            className={`absolute left-0 right-0 text-secondary-500 font-heading transition-all duration-500 leading-[1.12]
              ${i === idx ? "opacity-100 translate-y-0" : i < idx ? "opacity-0 -translate-y-full" : "opacity-0 translate-y-full"}`}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1100, startT = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - startT) / dur, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick); else setCount(target);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
}

const CATEGORY_IMGS: Record<string, string> = {
  Academic:   "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=75",
  STEM:       "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=75",
  Service:    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=75",
  Arts:       "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=75",
  Cultural:   "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=75",
  Sports:     "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=75",
  Leadership: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=75",
  General:    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=75",
};

const CATEGORY_COLORS: Record<string, string> = {
  Academic:   "text-blue-600 bg-blue-50",
  STEM:       "text-violet-600 bg-violet-50",
  Service:    "text-green-700 bg-green-50",
  Arts:       "text-amber-700 bg-amber-50",
  Cultural:   "text-orange-700 bg-orange-50",
  Sports:     "text-teal-700 bg-teal-50",
  Leadership: "text-secondary-700 bg-secondary-50",
  General:    "text-neutral-600 bg-neutral-100",
};

const HERO_IMGS = [
  {
    src:   "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
    label: "Students collaborating on a group project",
  },
  {
    src:   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    label: "Club members brainstorming new ideas together",
  },
  {
    src:   "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    label: "School community celebration",
  },
];

export default function HomePage() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [search, setSearch]       = useState("");
  const [tIdx, setTIdx]           = useState(0);
  const router                    = useRouter();

  const upcomingEvents = events.slice(0, 6);
  const featuredClubs  = chapters.slice(0, 6);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % HERO_IMGS.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTIdx((i) => (i + 1) % testimonials.length), 3000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/directory?q=${encodeURIComponent(search.trim())}`);
    else router.push("/directory");
  };

  const testimonials = [
    { quote: "I found my people through the Robotics Club and we won regionals. ClubConnect made it easy to get started.", name: "Alex K.", role: "11th Grade &middot; STEM" },
    { quote: "Submitting our charity drive results and finding other service clubs took five minutes. Everything is in one place.", name: "Maya R.", role: "Student Council President" },
    { quote: "I started a brand-new club in under a week using the creation wizard. The template library saved hours.", name: "Jordan T.", role: "Club Founder &middot; 10th Grade" },
    { quote: "The resource library has everything I need for Model UN prep. I use it every week and it saves me so much time.", name: "Priya S.", role: "Model UN &middot; 12th Grade" },
    { quote: "We recruited 20 new members in our first month just by listing our club here. The visibility is incredible.", name: "Marcus B.", role: "Photography Club President" },
  ];

  return (
    <div className="bg-cream-200 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none texture-curvy-lines opacity-[0.24]" />
      <div className="relative z-0">

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "#1c3557" }}>
        {/* Background image — shifted up, fades into navy at bottom */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80"
            alt=""
            fill
            priority
            className="object-cover opacity-[0.55]"
            style={{ objectPosition: "center 75%" }}
            aria-hidden="true"
          />
          {/* Fade photo into navy — clean bottom transition */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 25%, #1c3557 70%)" }} />
        </div>
        {/* Gold glow top-left */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(214,162,30,0.09) 0%, transparent 70%)" }} />

        {/* ── Shared content container ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-0 md:pt-7">

          {/* TOP BAR — crosshatch/dashes texture only, no icons */}
          <div className="hero-anim-bar relative overflow-hidden rounded-xl border border-primary-700/50 bg-primary-900 text-white px-6 py-3 mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            {/* Crosshatch dashes — the only texture here */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.07) 12px, rgba(255,255,255,0.07) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255,255,255,0.07) 12px, rgba(255,255,255,0.07) 13px)" }} />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.17em] text-sky-200/90">
                Your Journey Starts Here
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {[
                  { icon: Rocket,     label: "Launch Your Club" },
                  { icon: BookOpen,   label: "Step-by-Step Guides" },
                  { icon: BadgeCheck, label: "Highlight Success" },
                  { icon: Sparkles,   label: "Share Your Story" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/18 transition-colors">
                    <Icon size={10} className="text-secondary-300 shrink-0" />
                    <span className="font-semibold text-white/90">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HERO GRID */}
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4 items-stretch pb-8 md:pb-10">

            {/* LEFT — solid dark navy, icon pattern only (no crosshatch) */}
            <div className="hero-anim-left relative overflow-hidden rounded-2xl border border-primary-700/50 bg-primary-900 px-7 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {/* Community icon pattern — only texture in this box */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ opacity: 0.09 }}>
                <svg width="100%" height="100%"><defs>
                  <pattern id="homeBoxAccent" x="0" y="0" width="280" height="200" patternUnits="userSpaceOnUse">
                    <circle cx="28" cy="30" r="9" stroke="white" strokeWidth="1.3" fill="none"/>
                    <path d="M11 54 Q11 43 28 43 Q45 43 45 54" stroke="white" strokeWidth="1.3" fill="none"/>
                    <rect x="90" y="14" width="54" height="28" rx="7" stroke="white" strokeWidth="1.3" fill="none"/>
                    <path d="M100 42 L96 54 L110 42" stroke="white" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
                    <path d="M238 22 L240 28 L246 28 L241 32 L243 38 L238 34 L233 38 L235 32 L230 28 L236 28Z" stroke="white" strokeWidth="1.3" fill="none"/>
                    <rect x="18" y="118" width="40" height="46" rx="3" stroke="white" strokeWidth="1.3" fill="none"/>
                    <line x1="38" y1="118" x2="38" y2="164" stroke="white" strokeWidth="1.2"/>
                    <line x1="18" y1="132" x2="58" y2="132" stroke="white" strokeWidth="0.7"/>
                    <line x1="18" y1="144" x2="58" y2="144" stroke="white" strokeWidth="0.7"/>
                    <circle cx="150" cy="126" r="4" stroke="white" strokeWidth="1.1" fill="none"/>
                    <circle cx="182" cy="114" r="4" stroke="white" strokeWidth="1.1" fill="none"/>
                    <circle cx="192" cy="144" r="4" stroke="white" strokeWidth="1.1" fill="none"/>
                    <line x1="154" y1="126" x2="178" y2="116" stroke="white" strokeWidth="0.8"/>
                    <line x1="154" y1="128" x2="188" y2="142" stroke="white" strokeWidth="0.8"/>
                    <line x1="182" y1="118" x2="190" y2="140" stroke="white" strokeWidth="0.8"/>
                    <path d="M90 100 L91.5 105 L97 105 L92.5 108 L94 113 L90 110 L86 113 L87.5 108 L83 105 L88.5 105Z" stroke="white" strokeWidth="0.9" fill="none"/>
                    <circle cx="250" cy="80" r="2.5" stroke="white" strokeWidth="0.9" fill="none"/>
                  </pattern>
                </defs><rect width="100%" height="100%" fill="url(#homeBoxAccent)"/></svg>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center pt-4">

                <h1 className="text-3xl md:text-[2.6rem] lg:text-[3rem] font-heading font-bold text-white leading-[1.12] tracking-tight">
                  Find your place{" "}
                  <span className="relative inline-block">
                    for
                    <span
                      className="absolute pointer-events-none select-none z-20"
                      style={{ top: "-0.52em", right: "-0.55em", transform: "rotate(12deg)", transformOrigin: "50% 100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
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
                  <br />
                  <span className="text-secondary-400 italic"><RotatingWord /></span>
                </h1>

                <p className="mt-3 text-white/75 text-[13px] leading-[1.65] max-w-[400px] font-light tracking-wide">
                  Discover clubs, launch your own organization, and stay connected with everything happening at your school.
                </p>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="mt-5 flex gap-2 w-full max-w-sm">
                  <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search clubs, events..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/95 border border-primary-300/40 text-primary-800 placeholder:text-primary-400 text-sm outline-none focus:border-secondary-400 focus:ring-2 focus:ring-secondary-200/30 transition-all shadow-sm"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2.5 rounded-lg bg-primary-700 hover:bg-primary-600 text-white text-sm font-bold transition-colors shrink-0 shadow-sm border border-primary-600/50">
                    Search
                  </button>
                </form>

                {/* CTA buttons */}
                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  <Link href="/directory" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-bold transition-colors shadow-sm">
                    Browse Clubs <ArrowRight size={12} />
                  </Link>
                  <Link href="/start-a-club" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/12 border border-white/22 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                    <Rocket size={12} /> Start a Club
                  </Link>
                  <Link href="/resources" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/12 border border-white/22 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                    <BookOpen size={12} /> Resources
                  </Link>
                </div>

                {/* Slideshow dots */}
                <div className="mt-5 flex items-center gap-2">
                  {HERO_IMGS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBannerIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === bannerIdx ? "w-8 bg-secondary-400" : "w-2.5 bg-white/25 hover:bg-white/45"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — image + diagonal card + TSA info */}
            <div className="hero-anim-right hidden lg:flex lg:flex-col h-full relative">

              {/* Diagonal stacked image — overlaps top-right of main image */}
              <div
                className="absolute overflow-hidden"
                style={{
                  width: "52%",
                  aspectRatio: "4/3",
                  top: "-14px",
                  right: "-10px",
                  transform: "rotate(6.5deg)",
                  zIndex: 10,
                  border: "3px solid white",
                  borderRadius: "12px",
                  boxShadow: "0 10px 36px rgba(0,0,0,0.60)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"
                  alt="Students at a team workshop"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Main image — stretches to fill left panel height */}
              <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.40)]">
                {HERO_IMGS.map((img, i) => (
                  <div
                    key={img.src}
                    className={`absolute inset-0 transition-opacity duration-[350ms] ${i === bannerIdx ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image src={img.src} alt={img.label} fill priority={i === 0} className="object-cover" />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* TSA club card */}
              <div className="hero-anim-card mt-3 bg-white rounded-xl px-4 py-4 border border-[#D9CDB8] shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-secondary-600 mb-1">Featured Chapter</p>
                <p className="text-base font-heading font-bold text-primary-800 leading-tight">Washington D.C. TSA Chapter</p>
                <p className="text-[11px] text-secondary-600 font-semibold mt-0.5">Capitol Hill Magnet · Founded 2014</p>
                <p className="mt-2.5 text-[12px] text-primary-600 leading-[1.6] font-normal">
                  One of the nation’s top-ranked TSA chapters — 10 national podium finishes, 3 consecutive state titles, and a community of 80+ student innovators. Open to all skill levels.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary-600 bg-secondary-50 border border-secondary-200 rounded-full px-2.5 py-1">#1 in DC</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-200 rounded-full px-2.5 py-1">Now Recruiting</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Wave bottom */}
        <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="block w-full h-10 md:h-12">
            <path d="M0,48 L0,24 C360,48 720,4 1080,24 C1260,34 1380,18 1440,22 L1440,48 Z" fill="#F7F1E8" />
          </svg>
        </div>
      </section>


      {/* STATS STRIP */}
      <section className="relative bg-cream-200 pt-24 pb-10 texture-stats-lines -mt-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { target: stats.activeChapters, label: "Active Clubs",    icon: Trophy,   iconColor: "text-secondary-500", bgColor: "bg-secondary-50 border-secondary-200" },
              { target: stats.totalMembers,   label: "Student Members", icon: Users,    iconColor: "text-primary-600",   bgColor: "bg-primary-50  border-primary-100"  },
              { target: stats.upcomingEvents, label: "Upcoming Events", icon: Calendar, iconColor: "text-primary-600",   bgColor: "bg-primary-50  border-primary-100"  },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.label} delay={i * 200} className="reveal-stat">
                  <div className="bg-white rounded-2xl p-5 text-center shadow-[0_2px_12px_rgba(23,64,112,0.08)] border border-[#D9CDB8] h-full hover:shadow-[0_4px_18px_rgba(23,64,112,0.13)] hover:border-primary-200 transition-all">
                    <div className={`w-11 h-11 rounded-xl ${s.bgColor} border flex items-center justify-center mx-auto mb-3`}>
                      <Icon size={20} className={s.iconColor} />
                    </div>
                    <p className="text-[2.1rem] font-heading font-bold text-primary-800 leading-none">
                      <Counter target={s.target} suffix={"suffix" in s ? (s as { suffix?: string }).suffix ?? "" : ""} />
                    </p>
                    <p className="text-[11px] text-primary-400 mt-2 font-semibold uppercase tracking-widest">{s.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PATHWAY - What are you looking for? */}
      <section className="relative bg-[#EAF2F8] border-y border-sky-200 py-14 overflow-hidden">
        {/* Subtle crosshatch texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(23,64,112,0.04) 18px, rgba(23,64,112,0.04) 19px), repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(23,64,112,0.04) 18px, rgba(23,64,112,0.04) 19px)"
        }} />
        {/* Soft radial accents */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(214,162,30,0.07) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(23,64,112,0.07) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-600 mb-2">Start Here</p>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-800">What are you looking for?</h2>
              <p className="mt-2 text-sm text-primary-500 max-w-xl mx-auto">Choose your next step: launch a club, build your plan, connect with other clubs, and share your chapter stories.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {[
              {
                href: "/start-a-club",
                icon: Rocket,
                label: "Start Your Own Club",
                desc: "Launch a chapter with step-by-step guidance.",
                color: "text-secondary-600",
                bg: "bg-white border-sky-200 hover:border-secondary-300 hover:bg-secondary-50",
              },
              {
                href: "/resources",
                icon: BookOpen,
                label: "Club Creation Resources",
                desc: "Free templates, guides, and step-by-step help to start your own club.",
                color: "text-primary-700",
                bg: "bg-white border-sky-200 hover:border-primary-400 hover:bg-sky-50",
              },
              {
                href: "/community",
                icon: Users,
                label: "Discover Clubs & Network",
                desc: "Browse advertised clubs, see discussions, and connect with other student leaders.",
                color: "text-primary-700",
                bg: "bg-white border-sky-200 hover:border-primary-400 hover:bg-sky-50",
              },
              {
                href: "/hub/stories",
                icon: Sparkles,
                label: "Post Stories",
                desc: "Share wins, updates, and club moments.",
                color: "text-secondary-600",
                bg: "bg-white border-sky-200 hover:border-secondary-300 hover:bg-secondary-50",
              },
            ].map(({ href, icon: Icon, label, desc, color, bg }, i) => (
              <Reveal key={href} delay={i * 50} className="h-full">
                <Link href={href} className={`group flex flex-col items-start gap-2.5 p-5 rounded-2xl border transition-all shadow-sm hover:shadow-md h-full ${bg}`}>
                  <div className="w-12 h-12 rounded-2xl bg-cream-200 border border-[#D9CDB8] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={22} className={color} />
                  </div>
                  <span className={`text-[13px] font-bold leading-snug ${color}`}>{label}</span>
                  <p className="text-[12px] text-primary-500 leading-relaxed flex-1">{desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE CLUBS - warm cream background */}
      <section className="bg-cream-200 py-20 texture-canvas-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users2 size={14} className="text-secondary-600" />
                <p className="eyebrow">Growing Together</p>
              </div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-primary-800">Active Clubs Across Our Schools</h2>
              <p className="mt-1 text-sm text-neutral-500 max-w-lg">
                Spanning STEM, arts, service, debate, and more &mdash; find a chapter that fits you.
              </p>
            </div>
            <Link href="/directory" className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline">
              View all {chapters.length} clubs <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredClubs.slice(0, 4).map((club, i) => (
              <Reveal key={club.id} delay={i * 55}>
                <Link
                  href={`/directory/${club.id}`}
                  className="group flex flex-col bg-white border border-[#e8dfc8] hover:border-primary-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full"
                >
                  {/* Club image */}
                  <div className="relative h-40 bg-primary-900 shrink-0 overflow-hidden">
                    <Image
                      src={CATEGORY_IMGS[club.category] ?? CATEGORY_IMGS.General}
                      alt={club.name}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-transparent" />
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[club.category] ?? CATEGORY_COLORS.General}`}>
                      {club.category}
                    </span>
                    <span className={`absolute top-4 right-4 text-[9px] px-3 py-1 font-semibold rounded-full ${club.membershipStatus === "Open Enrollment" ? "bg-green-500/90 text-white" : "bg-secondary-500/90 text-white"}`}>
                      {club.membershipStatus === "Open Enrollment" ? "Open" : "Apply"}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-bold text-[1rem] text-primary-800 group-hover:text-primary-600 transition-colors leading-snug mb-3">{club.name}</h3>
                    <p className="text-[0.82rem] text-neutral-600 line-clamp-3 leading-relaxed flex-1 mb-4">{club.description}</p>
                    
                    {/* Statistics row */}
                    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-cream-200">
                      <div className="text-center">
                        <p className="text-lg font-bold font-heading text-primary-700">{club.memberCount}</p>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Members</p>
                      </div>
                      <div className="text-center border-l border-r border-cream-300">
                        <p className="text-lg font-bold font-heading text-primary-700">{club.foundedYear ? new Date().getFullYear() - club.foundedYear : 5}</p>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Years</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold font-heading text-primary-700">{club.achievements?.length || 3}</p>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Awards</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-[10px] text-neutral-400">
                      <span className="flex items-center gap-1"><MapPin size={10} /> {club.meetingLocation.room}</span>
                      <span className="flex items-center gap-1.5 text-primary-600 font-semibold group-hover:text-primary-700">View <ChevronRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



      {/* ACHIEVEMENT SPOTLIGHT */}
      <section className="relative bg-primary-800 overflow-hidden py-12 lg:py-16">
        {/* Faded background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
            alt="Students at conference"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800/95 via-primary-800/85 to-primary-800/70" />
        </div>
        {/* Diagonal lines on dark */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.055) 12px, rgba(255,255,255,0.055) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255,255,255,0.055) 12px, rgba(255,255,255,0.055) 13px)"
        }} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ opacity: 0.09 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="commAchieve" x="0" y="0" width="240" height="180" patternUnits="userSpaceOnUse">
                <circle cx="28" cy="28" r="9" stroke="rgba(255,255,255,0.98)" strokeWidth="1.4" fill="none"/>
                <path d="M12 52 Q12 41 28 41 Q44 41 44 52" stroke="rgba(255,255,255,0.98)" strokeWidth="1.4" fill="none"/>
                <rect x="92" y="12" width="52" height="28" rx="7" stroke="rgba(255,255,255,0.98)" strokeWidth="1.4" fill="none"/>
                <path d="M102 40 L98 52 L112 40" stroke="rgba(255,255,255,0.98)" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
                <path d="M200 20 L202 26 L208 26 L203 30 L205 36 L200 32 L195 36 L197 30 L192 26 L198 26Z" stroke="rgba(255,255,255,0.98)" strokeWidth="1.2" fill="none"/>
                <rect x="18" y="108" width="40" height="44" rx="3" stroke="rgba(255,255,255,0.98)" strokeWidth="1.4" fill="none"/>
                <line x1="38" y1="108" x2="38" y2="152" stroke="rgba(255,255,255,0.98)" strokeWidth="1.4"/>
                <circle cx="130" cy="116" r="4" stroke="rgba(255,255,255,0.98)" strokeWidth="1.2" fill="none"/>
                <circle cx="162" cy="106" r="4" stroke="rgba(255,255,255,0.98)" strokeWidth="1.2" fill="none"/>
                <circle cx="170" cy="134" r="4" stroke="rgba(255,255,255,0.98)" strokeWidth="1.2" fill="none"/>
                <line x1="134" y1="116" x2="158" y2="108" stroke="rgba(255,255,255,0.98)" strokeWidth="0.9"/>
                <line x1="134" y1="118" x2="166" y2="132" stroke="rgba(255,255,255,0.98)" strokeWidth="0.9"/>
                <circle cx="76" cy="80" r="2" stroke="rgba(255,255,255,0.98)" strokeWidth="1" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#commAchieve)"/>
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 items-center">
            <div className="py-4">
              <div className="flex items-center gap-2 mb-5">
                <BadgeCheck size={16} className="text-secondary-400" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-400">School Achievement</p>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                Our clubs competed at <em className="text-secondary-400 not-italic">nationals</em> this year.
              </h2>
              <p className="mt-5 text-primary-200 text-base leading-relaxed max-w-lg">
                From TSA to DECA, Model UN to Robotics &mdash; ClubConnect students represented their school on the national stage.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-5">
                {[{ n: "14", l: "Awards Won" }, { n: "6", l: "National Events" }, { n: "300+", l: "Participants" }].map(({ n, l }) => (
                  <div key={l} className="relative bg-white/[0.07] border border-white/15 rounded-2xl px-4 py-4 overflow-hidden">
                    {/* Gold top border accent */}
                    <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl" style={{ background: "linear-gradient(90deg, #b8860b, #d4a520)" }} />
                    <p className="text-[2.4rem] font-heading font-bold text-white leading-none mt-1">{n}</p>
                    <p className="text-[10px] text-primary-300 uppercase tracking-widest mt-2">{l}</p>
                  </div>
                ))}
              </div>
              <Link href="/directory" className="mt-10 inline-flex items-center gap-2 text-base font-semibold text-secondary-400 hover:text-secondary-300 transition-colors">
                View our clubs <ArrowRight size={16} />
              </Link>
            </div>
            {/* Right side: visual stats block */}
            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-400 mb-6">2025–2026 Season</p>
                {[
                  { label: "TSA Nationals", result: "Top 3 Placement",   bar: "#b8860b" },
                  { label: "DECA ICDC",     result: "2 Finalists",       bar: "#10b981" },
                  { label: "Robotics FRC",  result: "Regional Champions", bar: "#8b5cf6" },
                  { label: "Model UN",      result: "Best Delegation",    bar: "#0ea5e9" },
                ].map(({label, result, bar}) => (
                  <div key={label} className="flex items-center gap-4 mb-5 last:mb-0">
                    <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: bar }} />
                    <div>
                      <p className="text-sm font-bold text-white">{label}</p>
                      <p className="text-xs text-primary-300">{result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY VOICES + CTA COMBINED */}
      <section className="relative bg-[#faf7f2] border-t border-[#e8dfc8] overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-secondary-500 via-primary-800 to-secondary-500" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-4">
              <Lightbulb size={13} className="text-secondary-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-700">Community</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900">
              Students love{" "}
              <em className="text-secondary-600 not-italic">ClubConnect.</em>
            </h2>
            <p className="mt-3 text-sm text-neutral-500 max-w-md mx-auto">Join thousands of students already using ClubConnect to find their community.</p>
          </div>

          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-stretch">
            {/* Left: Testimonial card */}
            <div className="flex flex-col">
              <div className="flex flex-col flex-1 bg-white rounded-3xl border border-[#e8dfc8] shadow-[0_4px_24px_rgba(30,58,95,0.07)] overflow-hidden">
                {/* Accent top stripe */}
                <div className="h-1 bg-gradient-to-r from-secondary-500 to-primary-800" />
                <div className="p-10">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-6">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-5 h-5 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-neutral-400 font-medium">5.0 avg. rating</span>
                  </div>

                  <p className="text-2xl md:text-3xl text-primary-800 leading-relaxed mb-8 font-medium min-h-[120px]">
                    &ldquo;{testimonials[tIdx].quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-lg font-bold font-heading shrink-0">
                        {testimonials[tIdx].name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-base text-primary-900">{testimonials[tIdx].name}</p>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mt-0.5" dangerouslySetInnerHTML={{ __html: testimonials[tIdx].role }} />
                      </div>
                    </div>
                    {/* Dot nav */}
                    <div className="flex items-center gap-2">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setTIdx(i)}
                          className={`rounded-full transition-all duration-300 ${
                            i === tIdx ? "w-6 h-2.5 bg-primary-900" : "w-2.5 h-2.5 bg-neutral-300 hover:bg-neutral-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini stats below testimonial */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[{v:"4.9★",l:"Avg. Rating"},{v:"2,400+",l:"Active Users"},{v:"98%",l:"Would Recommend"}].map(({v,l})=>(
                  <div key={l} className="bg-white rounded-2xl p-4 text-center border border-[#e8dfc8]">
                    <p className="text-lg font-bold font-heading text-primary-800">{v}</p>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA card */}
            <div className="lg:sticky lg:top-24 flex flex-col">
              <div className="flex flex-col flex-1 bg-primary-900 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(30,58,95,0.25)] relative">
                {/* Diagonal lines on dark CTA box */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.04) 12px, rgba(255,255,255,0.04) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255,255,255,0.04) 12px, rgba(255,255,255,0.04) 13px)",
                }} />
                {/* Gold top accent */}
                <div className="h-1 bg-gradient-to-r from-secondary-500 to-secondary-400" />
                <div className="p-8 relative z-10 flex flex-col flex-1">
                  <span className="inline-block bg-secondary-500/20 text-secondary-300 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4">Ready to join?</span>
                  <h3 className="text-2xl font-heading font-bold text-white mb-6">
                    Be part of something{" "}
                    <em className="text-secondary-400 not-italic">bigger.</em>
                  </h3>

                  {/* Benefits list */}
                  <ul className="space-y-3 mb-8">
                    {[
                      { icon: Trophy,   text: "Compete at state & national levels" },
                      { icon: Users,    text: "Connect with 2,400+ students" },
                      { icon: BookOpen, text: "Access 200+ resources & templates" },
                      { icon: Rocket,   text: "Launch your own club in minutes" },
                    ].map(({icon: Icon, text}) => (
                      <li key={text} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <Icon size={13} className="text-secondary-400" />
                        </div>
                        <span className="text-sm text-primary-200">{text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3 mt-auto">
                    <Link href="/directory" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-500 hover:bg-secondary-400 text-white font-bold text-sm px-7 py-3.5 transition-colors w-full shadow-md">
                      Browse All Clubs <ArrowRight size={15} />
                    </Link>
                    <Link href="/propose" className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 border border-white/20 text-white/80 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all w-full">
                      Propose a New Club
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
