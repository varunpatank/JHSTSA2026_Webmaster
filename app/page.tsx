"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BookOpen, Calendar, ChevronRight, MapPin, Rocket, Trophy, Users, Search, Sparkles, Zap, Lightbulb, Users2, BadgeCheck, Palette, Compass, Layers, Globe,
} from "lucide-react";
import { events, stats, chapters, spotlights } from "@/lib/data";
import StageBannerPattern from "@/components/StageBannerPattern";

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

function TypedTitle({ prefix, highlight = "", highlightClass = "text-secondary-400", className = "" }: {
  prefix: string; highlight?: string; highlightClass?: string; className?: string;
}) {
  const full = prefix + highlight;
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let i = 0;
        const tick = () => { i++; setCount(i); if (i < full.length) setTimeout(tick, 110); };
        setTimeout(tick, 400);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [full.length]);
  const shownPrefix = prefix.slice(0, Math.min(count, prefix.length));
  const shownHighlight = count > prefix.length ? highlight.slice(0, count - prefix.length) : "";
  return (
    <span ref={ref} className={className}>
      {shownPrefix}
      {highlight && <em className={`not-italic ${highlightClass}`}>{shownHighlight}</em>}
      {count < full.length && <span className="opacity-60 animate-pulse">|</span>}
    </span>
  );
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
    src:   "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80",
    label: "High school students in a classroom",
  },
  {
    src:   "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1600&q=80",
    label: "Students at school working together",
  },
  {
    src:   "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
    label: "High school students in class together",
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
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "0% 30%", opacity: 0.72 }}
            aria-hidden="true"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,53,87,0.88) 0%, rgba(28,53,87,0.48) 45%, rgba(28,53,87,0.14) 70%, transparent 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: "linear-gradient(to bottom, transparent, rgba(28,53,87,0.55) 50%, rgba(28,53,87,0.88))" }} />
        </div>

        {/* ── Content container ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-14 md:pt-6">

          {/* HERO 2-COL GRID */}
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — headline + subtext + search + CTA */}
            <div className="py-4 hero-anim-left">
              {/* Eyebrow badge — cream pill */}
              <div className="mb-5 inline-flex items-center cream-textured border border-cream-400 rounded-full px-5 py-2">
                <span className="text-[13px] font-extrabold text-primary-900 uppercase tracking-[0.2em]">For Students, By Students</span>
              </div>

              <h1 className="text-[2.6rem] md:text-[3.2rem] font-heading font-bold text-white leading-[1.06] tracking-tight">
                Find your place{" "}
                <span className="relative inline-block">
                  for
                  <span
                    className="absolute pointer-events-none select-none z-20 hat-hero-wrap"
                    style={{ top: "calc(0.15em - 32px)", right: "calc(-0.8em + 12px)", transformOrigin: "50% 100%" }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
                      <polygon points="20,7 35,15 20,23 5,15" fill="#0d1b2b" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" />
                      <path d="M12 16 L12 24 Q20 30 28 24 L28 16" fill="#0d1b2b" fillOpacity="0.85" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3" strokeLinejoin="round" />
                      {/* Tassel — swings like a pendulum */}
                      <g>
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="0 35 15; 18 35 15; -12 35 15; 6 35 15; -3 35 15; 0 35 15"
                          keyTimes="0;0.2;0.45;0.65;0.85;1"
                          dur="2.6s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                        <line x1="35" y1="15" x2="35" y2="27" stroke="#b8860b" strokeWidth="1.9" strokeLinecap="round" />
                        <circle cx="35" cy="29" r="2.5" fill="#b8860b" />
                      </g>
                    </svg>
                  </span>
                </span>
                <br />
                <span className="text-secondary-400 italic"><RotatingWord /></span>
              </h1>

              <div className="mt-5 cream-textured border border-cream-400 rounded-xl px-5 py-3.5 max-w-[480px]">
                <p className="text-sm text-primary-900 font-medium leading-relaxed">
                  Student-run clubs, student-run events, and student-run organizations — all in one place. Find your school's community, connect with leaders, and make your mark.
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
            <div className="hidden lg:block pt-4 hero-anim-right">

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

      {/* UPCOMING EVENTS */}
      <div className="relative -mt-[92px]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          {/* Eyebrow */}
          <div className="flex items-center mb-5">
            <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-white/75">Upcoming Events</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
            <div className="h-[3px] bg-gradient-to-r from-secondary-500 via-secondary-300 to-secondary-500" />
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream-100">
              {[
                { month: "May", day: "16", icon: Calendar, title: "Spring Fest 2026",           club: "Student Council",  school: "Juanita High School",    where: "Courtyard",  tag: "All clubs welcome · Free",  color: "bg-secondary-50 border-secondary-200 text-secondary-700" },
                { month: "Jun", day: "7",  icon: Zap, title: "Hack Club × NASA Challenge", club: "Hack Club",         school: "Redmond High School",    where: "STEM Lab",   tag: "Open to all students",       color: "bg-primary-50 border-primary-200 text-primary-700"    },
                { month: "Jun", day: "21", icon: Palette, title: "Arts Fest End-of-Year Show", club: "Arts & Drama Club", school: "Eastlake High School",   where: "Auditorium", tag: "Drama, Music & Visual Arts",  color: "bg-amber-50 border-amber-200 text-amber-700"          },
              ].map(({ month, day, icon: Icon, title, club, school, where, tag, color }) => (
                <div key={title} className="flex items-start gap-4 px-7 py-6 hover:bg-cream-50/80 transition-colors group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center shrink-0 ${color}`}>
                    <span className="text-[8px] font-bold uppercase leading-none">{month}</span>
                    <span className="text-[20px] font-bold leading-none mt-0.5">{day}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-primary-800 leading-tight group-hover:text-primary-600 transition-colors flex items-center gap-2"><Icon size={16} className="shrink-0" /> {title}</p>
                    <p className="text-[11px] font-semibold text-primary-600 mt-1">By {club}</p>
                    <p className="text-[11px] text-primary-500/80 mt-0.5 flex items-center gap-1">
                      <Globe size={9} className="shrink-0" /> {school}
                    </p>
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

      {/* BENEFITS OF CLUBS */}
      <section className="bg-cream-200 pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal variant="pop">
          <div className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-900">
              <TypedTitle prefix="Why Join a " highlight="School Club?" highlightClass="text-secondary-500" />
            </h2>
          </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Trophy,
                  title: "College & Career Edge",
                  desc: "Clubs signal initiative to colleges and employers. Competitions like TSA, DECA, and Science Olympiad produce awards, certifications, and résumé achievements that set you apart.",
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                  topBorder: "border-t-4 border-t-amber-400",
                  tag: "Opportunity",
                },
                {
                  icon: Users,
                  title: "Leadership & Life Skills",
                  desc: "Running a club teaches you to manage teams, organize events, handle budgets, and resolve conflict — practical leadership skills no class can replicate.",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  topBorder: "border-t-4 border-t-blue-400",
                  tag: "Growth",
                },
                {
                  icon: Lightbulb,
                  title: "Belonging & Community",
                  desc: "Students in clubs report higher engagement, better mental health, and stronger friendships. Finding your people makes school feel like home — not just a place you have to be.",
                  iconBg: "bg-violet-100",
                  iconColor: "text-violet-600",
                  topBorder: "border-t-4 border-t-violet-400",
                  tag: "Well-being",
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
        <StageBannerPattern patternId="sjBannerPat" edgeOnly />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <Reveal variant="flip">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
              <TypedTitle prefix="Start Your " highlight="Journey" />
            </h2>
            <div className="w-14 h-[3px] bg-secondary-400 rounded-full mx-auto mt-3 mb-1" />
            <Reveal variant="expand-float" delay={220}>
            <div className="mt-4 cream-textured border border-cream-300 rounded-xl px-5 py-3.5 max-w-lg mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <p className="text-[14px] text-primary-900 font-medium leading-relaxed">Discover clubs, non-profits, support services, and programs — then launch your own idea or lead your school.</p>
            </div>
            </Reveal>
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
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-900">
              <TypedTitle prefix="Active Clubs " highlight="Near You" highlightClass="text-secondary-500" />
            </h2>
          </div></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredClubs.slice(0, 4).map((club, i) => (
              <Reveal key={club.id} delay={i * 55} variant="pop">
                <Link
                  href={`/directory/${club.id}`}
                  className="group flex flex-col bg-white border border-[#e8dfc8] hover:border-primary-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full"
                >
                  {/* Club image / featured logo */}
                  {(
                    <div className="relative h-40 bg-primary-900 shrink-0 overflow-hidden">
                      <Image
                        src={club.id === "model-un"
                          ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80"
                          : (CATEGORY_IMGS[club.category] ?? CATEGORY_IMGS.General)}
                        alt={club.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-110 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-transparent" />
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



      {/* ── COMMUNITY SPOTLIGHT + VOICES (combined navy section) ── */}
      <section id="community-spotlight" className="relative bg-primary-900 overflow-hidden">
        <StageBannerPattern patternId="cvBannerPat" edgeOnly />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">

          {/* ── Header ── */}
          <Reveal variant="up">
          <div className="mb-10">
<div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-stretch">

              {/* Left: title + description + stat tiles */}
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
                  <TypedTitle prefix="Students Love " highlight="ClubConnect." />
                </h2>
                <div className="w-14 h-[3px] bg-secondary-400 rounded-full mt-3 mb-1" />
                <div className="mt-4 cream-textured border border-cream-300 rounded-xl px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <p className="text-sm text-primary-900 font-medium">
                    Hear from real students — and explore the community resources making a difference.
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[{v:"4.9★",l:"Avg. Rating"},{v:"2,400+",l:"Active Users"},{v:"98%",l:"Would Recommend"}].map(({v,l})=>(
                    <div key={l} className="cream-textured rounded-xl p-3 text-center border border-cream-400 shadow-sm">
                      <p className="text-base font-bold font-heading text-primary-800">{v}</p>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: testimonial card */}
              <div className="mt-8 lg:mt-0 lg:flex lg:flex-col">
                <div className="flex flex-col h-full cream-textured rounded-2xl border border-cream-400 shadow-[0_4px_24px_rgba(0,0,0,0.25)] overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-secondary-500 to-primary-900" />
                  <div className="p-6">
                    <div className="flex items-center gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-xs text-neutral-400 font-medium">5.0 avg. rating</span>
                    </div>
                    <p className="text-base md:text-lg text-primary-900 leading-relaxed mb-5 font-medium min-h-[72px]">
                      &ldquo;{testimonials[tIdx].quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-900 text-white flex items-center justify-center text-sm font-bold font-heading shrink-0">
                          {testimonials[tIdx].name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary-900">{testimonials[tIdx].name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5" dangerouslySetInnerHTML={{ __html: testimonials[tIdx].role }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setTIdx(i)}
                            className={`rounded-full transition-all duration-300 ${
                              i === tIdx ? "w-5 h-2 bg-primary-900" : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          </Reveal>

        </div>
      </section>
      </div>
    </div>
  );
}
