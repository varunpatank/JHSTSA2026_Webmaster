"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BookOpen, Calendar, ChevronRight, GraduationCap, MapPin, Rocket, Trophy, Users, Search, Sparkles, Zap, Lightbulb, Users2, BadgeCheck,
} from "lucide-react";
import { events, stats, chapters } from "@/lib/data";

const WORDS = ["Community.", "Connection.", "Leadership.", "Belonging.", "Friendships."];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="relative inline-block"
      style={{ height: "1.16em", minWidth: "8.2em", verticalAlign: "0.02em" }}
    >
      <span className="absolute inset-0 overflow-hidden" aria-live="polite">
        {WORDS.map((word, i) => (
          <span
            key={word}
            className="absolute left-0 right-0 font-heading leading-[1.12]"
            style={{
              color: "#F2C75C",
              fontStyle: "italic",
              opacity: i === idx ? 1 : 0,
              transform: i === idx
                ? "translateY(0px) scale(1)"
                : i < idx
                  ? "translateY(-110%) scale(0.96)"
                  : "translateY(110%) scale(0.96)",
              filter: i === idx ? "blur(0px)" : "blur(6px)",
              transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1), filter 0.55s ease",
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

type RevealVariant = "up" | "left" | "right" | "pop" | "flip" | "expand-float";
function Reveal({ children, className = "", delay = 0, variant = "up" }: { children: React.ReactNode; className?: string; delay?: number; variant?: RevealVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal-on-scroll reveal-${variant} ${className}`}>{children}</div>;
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
    src:   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    label: "Students collaborating at a table",
  },
  {
    src:   "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80",
    label: "High school students in a classroom",
  },
  {
    src:   "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1600&q=80",
    label: "Students at school working together",
  },
  {
    src:   "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1600&q=80",
    label: "Students learning together in class",
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
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % HERO_IMGS.length), 4500);
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
    <div className="bg-cream-200 min-h-screen">
      <div className="relative z-0">

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "#1c3557" }}>
        {/* Background image — community photo, partially transparent */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "0% center", opacity: 0.62 }}
            aria-hidden="true"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,53,87,0.90) 0%, rgba(28,53,87,0.52) 42%, rgba(28,53,87,0.18) 65%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(28,53,87,0.75) 72%, #1c3557 100%)" }} />
        </div>

        {/* Decorative overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {/* ── Horizontal flow waves ── */}
            <path d="M-20,80  C200,58  440,92  680,72  C920,52  1120,86  1340,66  C1400,58  1440,72  1460,66"  stroke="rgba(255,255,255,0.09)" strokeWidth="2.5" fill="none"/>
            <path d="M-20,160 C240,138 500,170 740,152 C980,132 1180,166 1400,146 C1430,140 1450,152 1460,146" stroke="rgba(255,255,255,0.07)" strokeWidth="2"   fill="none"/>
            <path d="M-20,240 C280,218 560,250 820,230 C1060,210 1260,244 1460,224"                            stroke="rgba(255,255,255,0.055)" strokeWidth="1.8" fill="none"/>
            <path d="M-20,320 C200,300 480,332 740,314 C1000,294 1220,326 1460,306"                            stroke="rgba(255,255,255,0.045)" strokeWidth="1.6" fill="none"/>
            <path d="M-20,400 C260,382 540,408 820,390 C1060,372 1280,400 1460,382"                            stroke="rgba(255,255,255,0.06)" strokeWidth="2"   fill="none"/>
            <path d="M-20,470 C220,452 480,476 740,460 C1000,444 1220,468 1450,452"                            stroke="rgba(255,255,255,0.10)" strokeWidth="2.2" fill="none"/>
            <path d="M-20,500 C260,484 540,506 820,490 C1060,474 1280,498 1452,484"                            stroke="rgba(255,255,255,0.07)" strokeWidth="1.8" fill="none"/>
            {/* ── Large arcing highlight — sweeps across lower-left, feels like stadium light ── */}
            <path d="M-60,600 Q300,180 720,60" stroke="rgba(255,255,255,0.06)" strokeWidth="80" fill="none" strokeLinecap="round"/>
            {/* ── Subtle vertical institutional grid ── */}
            <line x1="400" y1="0" x2="400" y2="520" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            <line x1="720" y1="0" x2="720" y2="520" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            <line x1="1060" y1="0" x2="1060" y2="520" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            {/* ── Diagonal slash accents ── */}
            <line x1="60"   y1="30"  x2="110" y2="130" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="90"   y1="20"  x2="140" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1"   strokeLinecap="round"/>
            <line x1="1350" y1="380" x2="1420" y2="480" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1380" y1="370" x2="1450" y2="470" stroke="rgba(255,255,255,0.05)" strokeWidth="1"   strokeLinecap="round"/>
            {/* ── Plus / cross markers at grid intersections ── */}
            <g stroke="rgba(255,255,255,0.13)" strokeWidth="1.2" strokeLinecap="round">
              <line x1="397" y1="78"  x2="403" y2="82" /><line x1="403" y1="78"  x2="397" y2="82" />
              <line x1="717" y1="152" x2="723" y2="156"/><line x1="723" y1="152" x2="717" y2="156"/>
              <line x1="1057" y1="230" x2="1063" y2="234"/><line x1="1063" y1="230" x2="1057" y2="234"/>
              <line x1="397" y1="314" x2="403" y2="318"/><line x1="403" y1="314" x2="397" y2="318"/>
              <line x1="717" y1="390" x2="723" y2="394"/><line x1="723" y1="390" x2="717" y2="394"/>
            </g>
            {/* ── Corner brackets ── */}
            <path d="M1400,10 L1435,10 L1435,50" stroke="rgba(255,255,255,0.20)" strokeWidth="2" fill="none" strokeLinecap="square"/>
            <path d="M10,510 L10,475 L45,475"   stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeLinecap="square"/>
            <path d="M10,10 L10,45 L45,10"      stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" fill="none" strokeLinecap="square"/>
            {/* ── Gold glows ── */}
            <ellipse cx="1420" cy="20"  rx="90" ry="44" fill="rgba(214,162,30,0.09)"/>
            <ellipse cx="1430" cy="300" rx="60" ry="38" fill="rgba(214,162,30,0.05)"/>
            <ellipse cx="80"   cy="500" rx="70" ry="32" fill="rgba(214,162,30,0.04)"/>
            {/* ── Soft white atmosphere blobs ── */}
            <ellipse cx="120"  cy="100" rx="110" ry="55" fill="rgba(255,255,255,0.025)"/>
            <ellipse cx="300"  cy="390" rx="100" ry="48" fill="rgba(255,255,255,0.02)"/>
            <ellipse cx="820"  cy="450" rx="120" ry="52" fill="rgba(255,255,255,0.018)"/>
            <ellipse cx="1260" cy="430" rx="100" ry="46" fill="rgba(255,255,255,0.022)"/>
            {/* ── Dot grids ── */}
            <g opacity="0.26" fill="white">
              <circle cx="1302" cy="18" r="2.2"/><circle cx="1317" cy="18" r="2.2"/><circle cx="1332" cy="18" r="2.2"/><circle cx="1347" cy="18" r="2.2"/>
              <circle cx="1302" cy="32" r="2.2"/><circle cx="1317" cy="32" r="2.2"/><circle cx="1332" cy="32" r="2.2"/><circle cx="1347" cy="32" r="2.2"/>
              <circle cx="1302" cy="46" r="2.2"/><circle cx="1317" cy="46" r="2.2"/><circle cx="1332" cy="46" r="2.2"/><circle cx="1347" cy="46" r="2.2"/>
            </g>
            <g opacity="0.20" fill="white">
              <circle cx="18" cy="462" r="2"/><circle cx="32" cy="462" r="2"/><circle cx="46" cy="462" r="2"/>
              <circle cx="18" cy="476" r="2"/><circle cx="32" cy="476" r="2"/><circle cx="46" cy="476" r="2"/>
            </g>
            <g opacity="0.16" fill="white">
              <circle cx="620" cy="486" r="2"/><circle cx="634" cy="486" r="2"/><circle cx="648" cy="486" r="2"/>
            </g>
          </svg>
        </div>

        {/* ── Content container ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-0 md:pt-6">

          {/* HERO 2-COL GRID */}
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — headline + subtext + search + CTA */}
            <div className="py-4 hero-anim-left">
              {/* Eyebrow badge — cream pill */}
              <div className="mb-5 inline-flex items-center gap-2.5 cream-textured border border-cream-400 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-bold text-primary-900 uppercase tracking-[0.18em]">For Students, By Students</span>
              </div>

              <h1 className="text-[2.6rem] md:text-[3.2rem] font-heading font-bold text-white leading-[1.06] tracking-tight">
                Find your place{" "}
                <span className="relative inline-block">
                  for
                  <span
                    className="absolute pointer-events-none select-none z-20"
                    style={{ top: "calc(0.15em - 32px)", right: "calc(-0.8em + 12px)", transform: "rotate(12deg)", transformOrigin: "50% 100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
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

              <div className="mt-5 cream-textured border border-cream-400 rounded-xl px-5 py-3.5 max-w-[480px]">
                <p className="text-sm text-primary-900 font-medium leading-relaxed">
                  Discover <strong className="text-secondary-700 font-bold">student-run clubs, events, and mentors</strong> at your school and in your local community. Connect with student leaders and build your story — from TSA competitions to neighborhood drives.
                </p>
              </div>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-[480px]">
                <div className="flex-1 relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search clubs, events..."
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-transparent text-primary-800 placeholder:text-neutral-400 text-sm outline-none focus:border-secondary-400 focus:ring-2 focus:ring-secondary-300/30 transition-all shadow-sm"
                  />
                </div>
                <button type="submit" className="px-5 py-3 rounded-xl bg-primary-900 hover:brightness-110 text-white text-sm font-bold transition-all shadow-sm border border-white/20">
                  Search
                </button>
                <Link href="/resources" className="px-5 py-3 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors whitespace-nowrap">
                  Resources
                </Link>
              </form>
            </div>

            {/* RIGHT — crossfading photo + stats card covering bottom-right */}
            <div className="hidden lg:block pt-0 hero-anim-right">

              {/* Photo panel */}
              <div className="relative h-[360px] rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_56px_rgba(0,0,0,0.55)]">
                {HERO_IMGS.map((img, i) => (
                  <div
                    key={img.src}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === bannerIdx ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image src={img.src} alt={img.label} fill priority={i === 0} className="object-cover" />
                  </div>
                ))}
                {/* Bottom gradient — darkens overlap zone */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              </div>

              {/* STATS CARD — straight, bigger, covers bottom-right of photo */}
              <div className="-mt-[8rem] ml-[24%] mr-0 relative z-10 cream-textured rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.44),0_6px_20px_rgba(0,0,0,0.20)]">
                <div className="h-[4px] bg-gradient-to-r from-secondary-500 via-secondary-300 to-secondary-500" />
                <div className="px-8 py-7">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary-400 mb-5">Our Community</p>
                  <div className="grid grid-cols-3 divide-x divide-cream-100">
                    {[
                      { value: stats.activeChapters,               label: "Active Clubs",  icon: Trophy   },
                      { value: stats.totalMembers.toLocaleString(), label: "Total Members", icon: Users    },
                      { value: stats.upcomingEvents,                label: "Events Soon",   icon: Calendar },
                    ].map(({ value, label, icon: Icon }, idx) => (
                      <div key={label} className={`flex flex-col items-center ${idx === 0 ? "pr-7" : idx === 2 ? "pl-7" : "px-7"}`}>
                        <Icon size={22} className="text-secondary-500 mb-2.5" />
                        <p className="text-[42px] font-bold text-primary-900 leading-none font-heading">{String(value)}</p>
                        <p className="text-[12px] text-primary-400 font-medium mt-2">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* UPCOMING EVENTS — clean split: navy above, cream below, card centered */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 bottom-1/2 bg-[#1c3557]" />

        {/* Pattern on navy band */}
        <div className="absolute inset-x-0 top-0 bottom-1/2 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {/* Waves */}
            <path d="M-20,50  C200,28  440,62  680,42  C920,22  1120,56  1340,36  C1400,28  1440,42  1460,36"  stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" fill="none"/>
            <path d="M-20,95  C240,74  500,106 740,88  C980,68  1180,102 1400,82  C1430,76  1450,88  1460,82"  stroke="rgba(255,255,255,0.07)" strokeWidth="2"   fill="none"/>
            <path d="M-20,140 C280,122 560,150 820,132 C1060,114 1260,146 1460,128"                            stroke="rgba(255,255,255,0.05)" strokeWidth="1.6" fill="none"/>
            {/* Ellipse blobs */}
            <ellipse cx="120"  cy="60"  rx="90"  ry="44" fill="rgba(255,255,255,0.03)"/>
            <ellipse cx="500"  cy="100" rx="110" ry="50" fill="rgba(255,255,255,0.025)"/>
            <ellipse cx="920"  cy="55"  rx="95"  ry="42" fill="rgba(255,255,255,0.03)"/>
            <ellipse cx="1300" cy="110" rx="100" ry="48" fill="rgba(255,255,255,0.035)"/>
            {/* Gold accent */}
            <ellipse cx="1400" cy="20" rx="80" ry="36" fill="rgba(214,162,30,0.07)"/>
            {/* Dot grid — top-right */}
            <g opacity="0.26" fill="white">
              <circle cx="1310" cy="16" r="2"/><circle cx="1324" cy="16" r="2"/><circle cx="1338" cy="16" r="2"/>
              <circle cx="1310" cy="28" r="2"/><circle cx="1324" cy="28" r="2"/><circle cx="1338" cy="28" r="2"/>
              <circle cx="1310" cy="40" r="2"/><circle cx="1324" cy="40" r="2"/><circle cx="1338" cy="40" r="2"/>
            </g>
            {/* Dot grid — bottom-left */}
            <g opacity="0.20" fill="white">
              <circle cx="22"  cy="148" r="2"/><circle cx="36"  cy="148" r="2"/><circle cx="50"  cy="148" r="2"/>
              <circle cx="22"  cy="162" r="2"/><circle cx="36"  cy="162" r="2"/><circle cx="50"  cy="162" r="2"/>
            </g>
            {/* Scatter hollow circles */}
            <circle cx="340"  cy="72"  r="8" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" fill="none"/>
            <circle cx="700"  cy="118" r="7" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none"/>
            <circle cx="1060" cy="80"  r="9" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" fill="none"/>
            <circle cx="1420" cy="155" r="6" stroke="rgba(255,255,255,0.11)" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        <div className="absolute inset-x-0 top-1/2 bottom-0 bg-cream-200" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          {/* Eyebrow */}
          <div className="flex items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full bg-secondary-400" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">Upcoming Events</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
            <div className="h-[3px] bg-gradient-to-r from-secondary-500 via-secondary-300 to-secondary-500" />
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream-100">
              {[
                { month: "May", day: "16", emoji: "🌸", title: "Spring Fest 2026",           club: "Student Council",  where: "Courtyard",  tag: "All clubs welcome · Free",  color: "bg-secondary-50 border-secondary-200 text-secondary-700" },
                { month: "Jun", day: "7",  emoji: "🚀", title: "Hack Club × NASA Challenge", club: "Hack Club",         where: "STEM Lab",   tag: "Open to all students",       color: "bg-primary-50 border-primary-200 text-primary-700"    },
                { month: "Jun", day: "21", emoji: "🎨", title: "Arts Fest End-of-Year Show", club: "Arts & Drama Club", where: "Auditorium", tag: "Drama, Music & Visual Arts",  color: "bg-amber-50 border-amber-200 text-amber-700"          },
              ].map(({ month, day, emoji, title, club, where, tag, color }) => (
                <div key={title} className="flex items-start gap-4 px-7 py-6 hover:bg-cream-50/80 transition-colors group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center shrink-0 ${color}`}>
                    <span className="text-[8px] font-bold uppercase leading-none">{month}</span>
                    <span className="text-[20px] font-bold leading-none mt-0.5">{day}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-primary-800 leading-tight group-hover:text-primary-600 transition-colors">{emoji} {title}</p>
                    <p className="text-[11px] font-semibold text-primary-600 mt-1">By {club}</p>
                    <p className="text-[12px] text-primary-400 mt-1 flex items-center gap-1.5">
                      <MapPin size={10} className="shrink-0 text-secondary-400" /> {where}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WHAT ARE YOU LOOKING FOR? */}
      <section className="bg-cream-200 pt-4 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header - centered */}
          <Reveal variant="pop">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-secondary-100 border border-secondary-200 text-secondary-700 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5">
              <Sparkles size={11} /> Start Here
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-900">
              What are you <span className="text-secondary-500">looking for?</span>
            </h2>
            <div className="mt-5 bg-white border border-cream-400 rounded-xl px-5 py-3 shadow-sm max-w-xl mx-auto">
              <p className="text-sm text-primary-700">
                Student clubs connect you with peers, competitions, and causes — find yours, or start your own.
              </p>
            </div>
            <Link href="/directory" className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-semibold text-primary-600 hover:text-primary-800 transition-colors">
              Browse all clubs <ArrowRight size={12} />
            </Link>
          </div>
          </Reveal>
          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Trophy,
                  title: "Compete & Excel",
                  desc: "TSA, DECA, FBLA, Science Olympiad — compete at district, state, and national levels. Real achievements for your college applications and résumé.",
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                  topBorder: "border-t-4 border-t-amber-400",
                  tag: "Competitions",
                },
                {
                  icon: Users,
                  title: "Connect & Lead",
                  desc: "Robotics, Model UN, Photography — meet like-minded peers, grow leadership skills, and build relationships that last well beyond graduation.",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  topBorder: "border-t-4 border-t-blue-400",
                  tag: "Community",
                },
                {
                  icon: Lightbulb,
                  title: "Explore & Create",
                  desc: "Have a passion without a club? Any student can propose and launch a new organization. Build leadership and shape your school's culture.",
                  iconBg: "bg-violet-100",
                  iconColor: "text-violet-600",
                  topBorder: "border-t-4 border-t-violet-400",
                  tag: "Leadership",
                },
              ].map(({ icon: Icon, title, desc, iconBg, iconColor, topBorder, tag }, i) => (
                <Reveal key={title} delay={i * 110} className="h-full" variant={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <div className={`bg-white rounded-2xl border border-cream-300 ${topBorder} p-7 flex flex-col shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 h-full`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-[52px] h-[52px] rounded-2xl ${iconBg} flex items-center justify-center`}>
                      <Icon size={24} className={iconColor} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 border border-neutral-200 rounded-full px-2.5 py-1">{tag}</span>
                  </div>
                  <h3 className="font-bold text-[17px] text-primary-900 mb-2.5 font-heading">{title}</h3>
                  <p className="text-[13px] text-neutral-500 leading-relaxed flex-grow">{desc}</p>
                </div>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* START YOUR JOURNEY */}
      <section className="relative bg-primary-900 py-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sjBannerPat" x="0" y="0" width="520" height="300" patternUnits="userSpaceOnUse">
                <path d="M-20,80 C60,40 120,120 200,90 C280,60 320,130 400,100 C460,78 500,110 540,95" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" fill="none"/>
                <path d="M-20,160 C50,130 100,180 180,155 C260,130 310,175 390,150 C450,132 490,165 540,148" stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none"/>
                <path d="M-20,240 C70,210 140,255 220,230 C300,205 360,248 440,222 C490,207 520,232 540,220" stroke="rgba(255,255,255,0.06)" strokeWidth="1.8" fill="none"/>
                <ellipse cx="80" cy="60" rx="48" ry="32" fill="rgba(255,255,255,0.045)"/>
                <ellipse cx="300" cy="200" rx="60" ry="38" fill="rgba(255,255,255,0.035)"/>
                <ellipse cx="450" cy="80" rx="42" ry="28" fill="rgba(255,255,255,0.04)"/>
                <g opacity="0.30" fill="white"><circle cx="460" cy="30" r="2.2"/><circle cx="470" cy="30" r="2.2"/><circle cx="480" cy="30" r="2.2"/><circle cx="460" cy="40" r="2.2"/><circle cx="470" cy="40" r="2.2"/><circle cx="480" cy="40" r="2.2"/><circle cx="460" cy="50" r="2.2"/><circle cx="470" cy="50" r="2.2"/><circle cx="480" cy="50" r="2.2"/></g>
                <g opacity="0.25" fill="white"><circle cx="20" cy="230" r="2"/><circle cx="30" cy="230" r="2"/><circle cx="40" cy="230" r="2"/><circle cx="20" cy="240" r="2"/><circle cx="30" cy="240" r="2"/><circle cx="40" cy="240" r="2"/><circle cx="20" cy="250" r="2"/><circle cx="30" cy="250" r="2"/><circle cx="40" cy="250" r="2"/></g>
                <circle cx="100" cy="185" r="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
                <circle cx="310" cy="55" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
                <circle cx="415" cy="245" r="6" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sjBannerPat)"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <Reveal variant="flip">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 cream-textured border border-cream-400 text-primary-900 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-3">
              Your Pathways
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
              Start your <span className="text-secondary-400">journey</span>
            </h2>
            <Reveal variant="expand-float" delay={220}>
            <div className="mt-3 cream-textured border border-cream-400 rounded-xl px-5 py-3.5 max-w-lg mx-auto">
              <p className="text-[14px] text-primary-900 font-medium leading-relaxed">Everything you need to find your place, launch your idea, or lead your school.</p>
            </div>
            </Reveal>
            <div className="mt-3">
              <Link href="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-400 hover:text-secondary-300 transition-colors">
                Browse all clubs <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          </Reveal>

          {/* Pathway cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                href: "/start-a-club",
                icon: Rocket,
                label: "Start a Club",
                desc: "Step-by-step guidance, templates, and everything you need to launch a new organization.",
                iconColor: "text-amber-300",
                pill: "Most Popular",
                pillCn: "bg-amber-500/20 text-amber-300 border border-amber-400/30",
              },
              {
                href: "/resources",
                icon: BookOpen,
                label: "Club Resources",
                desc: "Free constitutions, budget trackers, meeting agendas, and recruitment playbooks.",
                iconColor: "text-sky-300",
                pill: null,
                pillCn: "",
              },
              {
                href: "/directory",
                icon: Users,
                label: "Discover Clubs",
                desc: "Browse the full directory and connect with student leaders across every category.",
                iconColor: "text-blue-300",
                pill: null,
                pillCn: "",
              },
              {
                href: "/hub/stories",
                icon: Sparkles,
                label: "Share Stories",
                desc: "Post your club's wins, event recaps, and milestones to build your community profile.",
                iconColor: "text-violet-300",
                pill: null,
                pillCn: "",
              },
            ].map(({ href, icon: Icon, label, desc, iconColor, pill, pillCn }, i) => (
              <Reveal key={href} delay={i * 100}>
              <Link
                href={href}
                className="group flex flex-col bg-[#162d4a] border border-white/10 rounded-2xl p-6 hover:bg-[#1c3a5c] hover:border-secondary-400/40 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200 h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={28} className={`${iconColor} group-hover:scale-110 transition-transform duration-200`} />
                  {pill && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${pillCn}`}>{pill}</span>
                  )}
                </div>
                <p className="text-[14px] font-bold text-white leading-snug mb-2">{label}</p>
                <p className="text-[12px] text-primary-300 leading-relaxed flex-grow">{desc}</p>
                <div className="flex items-center gap-1 mt-5 text-[11px] font-semibold text-white/40 group-hover:text-secondary-400 transition-colors duration-200">
                  Explore <ArrowRight size={11} />
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE CLUBS - warm cream background */}
      <section className="bg-cream-200 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal variant="left"><div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users2 size={14} className="text-secondary-500" />
              <p className="eyebrow">Growing Together</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-900">
              Active Clubs{" "}
              <span className="text-secondary-500">Across Our Schools</span>
            </h2>
            <div className="mt-3 bg-white border border-cream-400 rounded-xl px-5 py-3 shadow-sm max-w-xl mx-auto">
              <p className="text-sm text-primary-700">
                Spanning <strong className="text-primary-900">STEM, arts, service, debate,</strong> and more &mdash; find a chapter that fits you.
              </p>
            </div>
            <div className="mt-3">
              <Link href="/directory" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline">
                View all {chapters.length} clubs <ArrowRight size={12} />
              </Link>
            </div>
          </div></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredClubs.slice(0, 4).map((club, i) => (
              <Reveal key={club.id} delay={i * 55} variant="pop">
                <Link
                  href={`/directory/${club.id}`}
                  className="group flex flex-col bg-white border border-[#e8dfc8] hover:border-primary-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full"
                >
                  {/* Club image / featured logo */}
                  {i === 0 ? (
                    <div className="relative h-40 bg-primary-900 shrink-0 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.11 }}>
                        <svg width="100%" height="100%"><defs>
                          <pattern id="featuredCardPat" x="0" y="0" width="120" height="100" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="1.2" fill="none"/>
                            <path d="M8 36 Q8 28 20 28 Q32 28 32 36" stroke="white" strokeWidth="1.2" fill="none"/>
                            <polygon points="80,12 100,20 80,28 60,20" stroke="white" strokeWidth="1" fill="none"/>
                            <path d="M64 21 L64 32 Q80 40 96 32 L96 21" stroke="white" strokeWidth="1" fill="none"/>
                            <line x1="100" y1="20" x2="100" y2="32" stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="100" cy="35" r="2" fill="#F5C842"/>
                          </pattern>
                        </defs><rect width="100%" height="100%" fill="url(#featuredCardPat)"/></svg>
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center px-4">
                        <div className="w-14 h-14 bg-white/10 border border-white/25 rounded-xl flex items-center justify-center mb-2.5">
                          <svg viewBox="0 0 44 40" fill="none" className="w-8 h-8">
                            <polygon points="22,5 40,13 22,21 4,13" fill="#7B8FD4"/>
                            <path d="M10 14.5 L10 26 Q22 35 34 26 L34 14.5" fill="#4B5FA6"/>
                            <line x1="40" y1="13" x2="40" y2="23" stroke="#F5C842" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="40" cy="26" r="3" fill="#F5C842"/>
                          </svg>
                        </div>
                        <p className="text-white font-bold text-[13px] font-heading leading-tight">{club.name}</p>
                        <p className="text-primary-300 text-[10px] mt-0.5 uppercase tracking-wider">{club.category}</p>
                      </div>
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-secondary-500/90 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                        ★ Featured
                      </span>
                      <span className={`absolute top-3 right-3 text-[9px] px-2.5 py-1 font-semibold rounded-full ${club.membershipStatus === "Open Enrollment" ? "bg-green-500/90 text-white" : "bg-white/20 text-white"}`}>
                        {club.membershipStatus === "Open Enrollment" ? "Open" : "Apply"}
                      </span>
                    </div>
                  ) : (
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
                  )}
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-bold text-[1rem] text-primary-800 group-hover:text-primary-600 transition-colors leading-snug mb-3">{club.name}</h3>
                    <p className="text-[0.82rem] text-neutral-600 line-clamp-3 leading-relaxed flex-1 mb-4">{club.description}</p>
                    
                    {/* Statistics row */}
                    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-cream-400">
                      <div className="text-center">
                        <p className="text-lg font-bold font-heading text-primary-700">{club.memberCount}</p>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Members</p>
                      </div>
                      <div className="text-center border-l border-r border-cream-400">
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



      {/* COMMUNITY VOICES + CTA COMBINED */}
      <section className="relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cvBannerPat" x="0" y="0" width="520" height="300" patternUnits="userSpaceOnUse">
                <path d="M-20,80 C60,40 120,120 200,90 C280,60 320,130 400,100 C460,78 500,110 540,95" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" fill="none"/>
                <path d="M-20,160 C50,130 100,180 180,155 C260,130 310,175 390,150 C450,132 490,165 540,148" stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none"/>
                <path d="M-20,240 C70,210 140,255 220,230 C300,205 360,248 440,222 C490,207 520,232 540,220" stroke="rgba(255,255,255,0.06)" strokeWidth="1.8" fill="none"/>
                <ellipse cx="80" cy="60" rx="48" ry="32" fill="rgba(255,255,255,0.045)"/>
                <ellipse cx="300" cy="200" rx="60" ry="38" fill="rgba(255,255,255,0.035)"/>
                <ellipse cx="450" cy="80" rx="42" ry="28" fill="rgba(255,255,255,0.04)"/>
                <g opacity="0.30" fill="white"><circle cx="460" cy="30" r="2.2"/><circle cx="470" cy="30" r="2.2"/><circle cx="480" cy="30" r="2.2"/><circle cx="460" cy="40" r="2.2"/><circle cx="470" cy="40" r="2.2"/><circle cx="480" cy="40" r="2.2"/><circle cx="460" cy="50" r="2.2"/><circle cx="470" cy="50" r="2.2"/><circle cx="480" cy="50" r="2.2"/></g>
                <g opacity="0.25" fill="white"><circle cx="20" cy="230" r="2"/><circle cx="30" cy="230" r="2"/><circle cx="40" cy="230" r="2"/><circle cx="20" cy="240" r="2"/><circle cx="30" cy="240" r="2"/><circle cx="40" cy="240" r="2"/><circle cx="20" cy="250" r="2"/><circle cx="30" cy="250" r="2"/><circle cx="40" cy="250" r="2"/></g>
                <circle cx="100" cy="185" r="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
                <circle cx="310" cy="55" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
                <circle cx="415" cy="245" r="6" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cvBannerPat)"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          {/* Section header */}
          <Reveal variant="right">
          <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 cream-textured border border-cream-400 rounded-full px-4 py-1.5 mb-4">
              <GraduationCap size={13} className="text-secondary-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-900">Community <span className="text-secondary-600">Social</span></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Students love{" "}
              <span className="relative inline-block">
                <em className="text-secondary-400 not-italic">ClubConnect.</em>
                <span
                  className="absolute pointer-events-none select-none"
                  style={{ top: "-0.55em", right: "-0.5em", transform: "rotate(12deg)", transformOrigin: "50% 100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                    <polygon points="20,7 35,15 20,23 5,15" fill="#0d1b2b" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" />
                    <path d="M12 16 L12 24 Q20 30 28 24 L28 16" fill="#0d1b2b" fillOpacity="0.85" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3" strokeLinejoin="round" />
                    <line x1="35" y1="15" x2="35" y2="27" stroke="#b8860b" strokeWidth="1.9" strokeLinecap="round" />
                    <circle cx="35" cy="29" r="2.5" fill="#b8860b" />
                  </svg>
                </span>
              </span>
            </h2>
            <div className="mt-3 cream-textured border border-cream-400 rounded-xl px-5 py-3.5 max-w-md mx-auto">
              <p className="text-sm text-primary-900 font-medium">Join thousands of students already using ClubConnect to find their community.</p>
            </div>
          </div>
          </Reveal>

          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-stretch">
            {/* Left: Testimonial card */}
            <div className="flex flex-col">
              <div className="flex flex-col flex-1 cream-textured rounded-2xl border border-cream-400 shadow-[0_4px_24px_rgba(0,0,0,0.25)] overflow-hidden">
                {/* Accent top stripe */}
                <div className="h-1 bg-gradient-to-r from-secondary-500 to-primary-900" />
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

                  <p className="text-2xl md:text-3xl text-primary-900 leading-relaxed mb-8 font-medium min-h-[120px]">
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

                <div className="mt-4 grid grid-cols-3 gap-3">
                {[{v:"4.9★",l:"Avg. Rating"},{v:"2,400+",l:"Active Users"},{v:"98%",l:"Would Recommend"}].map(({v,l})=>(
                  <div key={l} className="cream-textured rounded-xl p-4 text-center border border-cream-400 shadow-sm">
                    <p className="text-lg font-bold font-heading text-primary-800">{v}</p>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA card */}
            <div className="lg:sticky lg:top-24 flex flex-col">
              <div className="flex flex-col flex-1 bg-primary-900 rounded-3xl overflow-hidden border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.3)] relative">
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
