"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
 chapters, events, stats, spotlights, announcements,
 sponsorsData, schoolWideStats,
} from "@/lib/data";
import {
 ArrowLeft, ArrowRight, BookOpen, Brain, CalendarCheck, CalendarPlus,
 CheckCircle, ChevronDown, ChevronUp, Clock, Compass, Gift,
 GraduationCap, Handshake, Heart, MapPin, Play,
 Rocket, Search, Sparkles, Star, TrendingUp, Users, Quote,
 Shield, Target, X, BookMarked,
} from "lucide-react";


const CLUB_ICONS: Record<string, { emoji: string; pixels: string }> = {
 "Model United Nations": { emoji: "\u{1F30D}", pixels: "#1e3a5f" },
 "Robotics Engineering Club": { emoji: "\u{1F916}", pixels: "#4a90d9" },
 "Community Service League": { emoji: "\u2764\uFE0F", pixels: "#e74c3c" },
 "Drama & Theatre Society": { emoji: "\u{1F3AD}", pixels: "#9b59b6" },
 "Debate Team": { emoji: "\u{1F3A4}", pixels: "#e67e22" },
 "Cultural Heritage Club": { emoji: "\u{1F30F}", pixels: "#27ae60" },
 "Environmental Action Group": { emoji: "\u{1F33F}", pixels: "#2ecc71" },
 "School Newspaper": { emoji: "\u{1F4F0}", pixels: "#34495e" },
};

function PixelIcon3D({ name, size = 48 }: { name: string; size?: number }) {
 const cf = CLUB_ICONS[name] || { emoji: "\u2B50", pixels: "#b8860b" };
 return (
 <div className="pixel-icon-3d" style={{ width: size, height: size, perspective: "120px" }}>
 <div className="pixel-cube" style={{ width: size, height: size }}>
 <div className="pixel-face" style={{
 width: size, height: size, background: `linear-gradient(135deg, ${cf.pixels}, ${cf.pixels}dd)`,
 imageRendering: "pixelated",
 display: "flex", alignItems: "center", justifyContent: "center",
 fontSize: size * 0.5, boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.2), 0 2px 8px ${cf.pixels}44`,
 border: "2px solid rgba(0,0,0,0.15)",
 }}>
 {cf.emoji}
 </div>
 </div>
 </div>
 );
}


const ROTATING_WORDS = ["Clubs", "Events", "Mentors", "Resources", "Community"];

function RotatingWord({ className = "" }: { className?: string }) {
 const [idx, setIdx] = useState(0);
 useEffect(() => {
 const t = setInterval(() => setIdx(i => (i + 1) % ROTATING_WORDS.length), 2200);
 return () => clearInterval(t);
 }, []);
 return (
 <span className={`inline-grid overflow-hidden ${className}`} style={{ height: "1.15em", lineHeight: "1.15em", verticalAlign: "baseline" }}>
 {ROTATING_WORDS.map((word, i) => (
 <span key={word} className={`col-start-1 row-start-1 transition-all duration-500 ease-in-out text-secondary-600 ${
  i === idx ? "translate-y-0 opacity-100" : i === (idx - 1 + ROTATING_WORDS.length) % ROTATING_WORDS.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
 }`}>{word}</span>
 ))}
 </span>
 );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
 const ref = useRef<HTMLDivElement>(null);
 useEffect(() => {
 const el = ref.current;
 if (!el) return;
 const obs = new IntersectionObserver(
 ([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } },
 { threshold: 0.12 }
 );
 obs.observe(el);
 return () => obs.disconnect();
 }, []);
 return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
}

function GuideAccordion({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
 const [open, setOpen] = useState(false);
 return (
  <div className="border-b border-neutral-100">
   <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-2.5 px-5 py-3 hover:bg-primary-50/50 transition-colors text-left">
    <span className="text-base">{icon}</span>
    <span className="flex-1 text-xs font-bold text-primary-800">{title}</span>
    <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
   </button>
   {open && <div className="px-5 pb-4 animate-fade-up">{children}</div>}
  </div>
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
 const duration = 800;
 const start = performance.now();
 const tick = (now: number) => {
  const progress = Math.min((now - start) / duration, 1);
  setCount(Math.floor(progress * target));
  if (progress < 1) requestAnimationFrame(tick);
  else setCount(target);
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


const HERO_IMAGES = [
 "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
 "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
 "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
 "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
];

const clubImages: Record<string, string> = {
 "Model United Nations": "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=400&q=80",
 "Robotics Engineering Club": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
 "Community Service League": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80",
 "Drama & Theatre Society": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=400&q=80",
 "Debate Team": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80",
 "Cultural Heritage Club": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80",
 "Environmental Action Group": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
 "School Newspaper": "https://images.unsplash.com/photo-1504711434969-e33886168d6c?auto=format&fit=crop&w=400&q=80",
};

const clubRatings = chapters.map(ch => ({
 id: ch.id, name: ch.name, rating: +(3.5 + ((ch.name.length * 7) % 15) / 10).toFixed(1),
 reviews: 10 + ((ch.name.length * 3) % 30),
}));

const testimonials = [
 { name: "Sarah M.", role: "TSA Chapter President", text: "ClubConnect made organizing our chapter so much easier. The resource library and event tools saved us hours every week.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
 { name: "Marcus J.", role: "Robotics Club Founder", text: "I started my club using the Create page wizard. The constitution editor and approval tracker were incredibly helpful.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
 { name: "Emily K.", role: "Faculty Advisor", text: "As an advisor, I love how organized everything is. Events, meeting notes, member tracking all in one place.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" },
 { name: "David L.", role: "Alumni, Class of 2024", text: "Being part of clubs through ClubConnect shaped my college applications and leadership skills. Highly recommend!", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" },
];



export default function HomePage() {
 const [bannerIdx, setBannerIdx] = useState(0);
 const [carouselIdx, setCarouselIdx] = useState(0);
 const [aboutExpanded, setAboutExpanded] = useState(false);
 const [testimonialIdx, setTestimonialIdx] = useState(0);
 const upcomingEvents = events.slice(0, 4);


 const [guideOpen, setGuideOpen] = useState(false);
 const [guideDismissed, setGuideDismissed] = useState(false);

 useEffect(() => {
  if (typeof window !== 'undefined' && !sessionStorage.getItem('guide-seen')) {
   const t = setTimeout(() => { setGuideOpen(true); sessionStorage.setItem('guide-seen', '1'); }, 800);
   return () => clearTimeout(t);
  }
 }, []);

 const startGuide = useCallback(() => {
  setGuideOpen(true);
  setGuideDismissed(false);
 }, []);

 const dismissGuide = useCallback(() => {
  setGuideOpen(false);
  setGuideDismissed(true);
 }, []);

 useEffect(() => {
 let tick = 0;
 const t = setInterval(() => {
  tick++;
  if (tick % 3 === 0) setBannerIdx(i => (i + 1) % HERO_IMAGES.length);
  if (tick % 2 === 0) setTestimonialIdx(i => (i + 1) % testimonials.length);
 }, 3000);
 return () => clearInterval(t);
 }, []);

 const visibleClubs = chapters.slice(carouselIdx, carouselIdx + 3).length === 3
 ? chapters.slice(carouselIdx, carouselIdx + 3)
 : [...chapters.slice(carouselIdx), ...chapters.slice(0, 3 - (chapters.length - carouselIdx))];

 return (
 <div className="relative bg-gradient-to-b from-blue-100 via-primary-50 to-neutral-50 overflow-hidden">
 <div className="absolute inset-0 pointer-events-none">
 <div className="absolute -top-24 right-[-8rem] h-72 w-72 rounded-full bg-blue-300/40 blur-3xl animate-drift-slower" />
 <div className="absolute top-[50%] left-[-7rem] h-80 w-80 rounded-full bg-blue-200/30 blur-3xl animate-drift-slow" />
 <div className="absolute top-[20%] left-[40%] h-64 w-64 rounded-full bg-primary-300/20 blur-3xl animate-drift-slower" />
 </div>

 {}
 <section id="guide-hero" className="relative z-10 border-b border-blue-200 overflow-hidden bg-gradient-to-br from-blue-600/[0.07] via-transparent to-primary-600/[0.05]">
 <div className="absolute inset-0">
 {HERO_IMAGES.map((src, i) => (
  <Image key={src} src={src} alt="" fill className={`object-cover transition-opacity duration-1000 ease-in-out ${i === bannerIdx ? "opacity-[0.12]" : "opacity-0"}`} priority={i === 0} />
 ))}
 </div>
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
 <div className="max-w-3xl mx-auto text-center">
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-full mb-2 animate-scale-bounce">
 <Sparkles size={12} /> Community Resource Hub &mdash; Clubs &middot; Mentors &middot; Events &middot; Social
 </div>
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-800 leading-tight text-center">
 Your Hub for <RotatingWord className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold" />
 </h1>
 <p className="mt-1.5 max-w-2xl mx-auto text-neutral-600 text-sm md:text-base leading-relaxed">
 Browse 30+ clubs, access guides &amp; templates, attend events, connect with mentors, and find resources for every stage of your journey.
 </p>
 <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
 <Link href="/directory" className="btn-primary btn-ripple btn-magnetic inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm">
 <Search size={16} /> Explore Clubs <ArrowRight size={16} />
 </Link>
 <Link href="/students" className="btn-outline btn-magnetic inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm">
 <Users size={16} /> Student Community
 </Link>
 </div>
 <div className="mt-2 flex gap-4 text-xs justify-center flex-wrap">
 <div className="flex items-center gap-1 text-neutral-600"><CheckCircle size={12} className="text-green-600" /> Open to all students</div>
 <div className="flex items-center gap-1 text-neutral-600"><Clock size={12} className="text-blue-600" /> Updated daily</div>
 <div className="flex items-center gap-1 text-neutral-600"><Play size={12} className="text-purple-600" /> Student-Powered Community</div>
 </div>
 <div className="mt-2 flex justify-center gap-1.5">
 {HERO_IMAGES.map((_, i) => (
 <button key={i} onClick={() => setBannerIdx(i)}
 className={`h-1.5 rounded-full transition-all duration-500 ${i === bannerIdx ? "bg-primary-600 w-5" : "bg-primary-300 w-1.5 hover:bg-primary-400"}`} />
 ))}
 </div>
 <div className="mt-3 flex justify-center gap-3">
 <Link href="/references" className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 text-primary-700 text-xs font-semibold border border-primary-200 hover:bg-white hover:border-primary-400 transition-all">
 <BookOpen size={14} /> References &amp; Citations
 </Link>
 <button onClick={startGuide} className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500/90 text-white text-xs font-semibold border border-secondary-400 hover:bg-secondary-600 transition-all">
 <BookMarked size={14} /> Judge&rsquo;s Guide
 </button>
 </div>
 </div>
 </div>
 </section>

 {}
 <Reveal>
 <section id="guide-stats" className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 stagger-children">
 {[
 { value: stats.activeChapters, label: "Active Clubs", icon: Users, iconBg: "bg-primary-100 text-primary-600" },
 { value: stats.totalMembers, label: "Students Served", icon: GraduationCap, iconBg: "bg-secondary-100 text-secondary-600" },
 { value: stats.upcomingEvents, label: "Upcoming Events", icon: CalendarCheck, iconBg: "bg-blue-100 text-blue-600" },
 { value: schoolWideStats.totalServiceHours, label: "Service Hours", icon: Heart, iconBg: "bg-green-100 text-green-600", suffix: "+" },
 ].map(s => {
 const Icon = s.icon;
 return (
 <div key={s.label} className="card p-4 flex items-center gap-3 ux-hover-lift-sm group">
 <div className={`w-10 h-10 ${s.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
 <Icon size={18} />
 </div>
 <div>
 <p className="text-2xl md:text-3xl font-heading font-bold text-primary-700"><Counter target={s.value} suffix={s.suffix} /></p>
 <p className="text-xs text-neutral-500">{s.label}</p>
 </div>
 </div>
 );
 })}
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
 <div className="card p-5 md:p-6 bg-gradient-to-r from-primary-50 via-white to-secondary-50/30 border-primary-200">
 <div className="max-w-4xl mx-auto text-center">
 <p className="eyebrow text-secondary-600">What Is ClubConnect?</p>
 <h2 className="mt-1 text-xl md:text-2xl font-heading text-primary-800">Your School&rsquo;s Community Resource Hub</h2>
 <p className="mt-3 text-neutral-700 text-sm md:text-base leading-relaxed">
  ClubConnect is a centralized platform designed to connect students with the clubs, organizations, and community resources that shape their school experience. School clubs are one of the most valuable community resources available to students &mdash; they build leadership skills, foster friendships, encourage civic engagement, and create lasting impact both on campus and in the wider community.
 </p>
 <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
  Our hub brings together a searchable directory of 30+ clubs, a resource library packed with guides and templates, an events calendar, mentor connections, and tools for starting your own organization. Whether you&rsquo;re looking to join, lead, or support &mdash; everything you need is right here.
 </p>
 <div className="mt-4 flex flex-wrap justify-center gap-3">
  <div className="flex items-center gap-2 text-xs text-primary-700 font-semibold"><Users size={14} className="text-primary-500" /> 30+ Active Clubs</div>
  <div className="flex items-center gap-2 text-xs text-primary-700 font-semibold"><BookOpen size={14} className="text-primary-500" /> Resource Library</div>
  <div className="flex items-center gap-2 text-xs text-primary-700 font-semibold"><CalendarCheck size={14} className="text-primary-500" /> Events &amp; Programs</div>
  <div className="flex items-center gap-2 text-xs text-primary-700 font-semibold"><Handshake size={14} className="text-primary-500" /> Mentor Network</div>
  <div className="flex items-center gap-2 text-xs text-primary-700 font-semibold"><Rocket size={14} className="text-primary-500" /> Club Creation Tools</div>
 </div>
 </div>
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-clubs" className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
 <div className="flex items-end justify-between mb-3">
 <div>
 <p className="eyebrow">Trending Now</p>
 <h2 className="mt-0.5 text-lg md:text-xl font-heading text-primary-800">Featured Clubs &amp; Organizations</h2>
 </div>
 <div className="flex gap-2">
 <button onClick={() => setCarouselIdx(i => i === 0 ? chapters.length - 1 : i - 1)}
 className="p-2 border border-neutral-200 hover:bg-primary-50 transition-colors"><ArrowLeft size={14} /></button>
 <button onClick={() => setCarouselIdx(i => (i + 1) % chapters.length)}
 className="p-2 border border-neutral-200 hover:bg-primary-50 transition-colors"><ArrowRight size={14} /></button>
 </div>
 </div>
 <div className="grid md:grid-cols-3 gap-3">
 {visibleClubs.map(club => (
 <Link key={club.id} href={`/directory/${club.id}`} className="card overflow-hidden group ux-hover-lift">
 <div className="relative h-32 bg-neutral-100">
 <Image src={clubImages[club.name] || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80"} alt={club.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
 <div className="absolute top-2 left-2">
 <PixelIcon3D name={club.name} size={36} />
 </div>
 <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 bg-white/90 text-primary-700 rounded-full font-semibold">{club.category}</span>
 <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-[10px]">
 <Star size={10} className="fill-yellow-400 text-yellow-400" />
 {clubRatings.find(r => r.id === club.id)?.rating ?? "4.2"}
 </div>
 </div>
 <div className="p-3">
 <h3 className="font-bold text-primary-800 text-sm group-hover:text-primary-600">{club.name}</h3>
 <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{club.description}</p>
 <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
 <span className="flex items-center gap-1"><Users size={10} /> {club.memberCount} members</span>
 <span className="flex items-center gap-1"><MapPin size={10} /> {club.meetingLocation.room}</span>
 </div>
 <div className="mt-2 flex gap-2">
 <span className="text-[10px] px-2 py-0.5 bg-primary-600 text-white font-semibold">View</span>
 <span className="text-[10px] px-2 py-0.5 border border-primary-200 text-primary-600 font-semibold">RSVP</span>
 </div>
 </div>
 </Link>
 ))}
 </div>
 <div className="mt-3 text-center">
 <Link href="/directory" className="text-xs font-semibold text-primary-600 hover:underline inline-flex items-center gap-1">
 View all {chapters.length} clubs <ArrowRight size={12} />
 </Link>
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-offer" className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
 <div className="text-center max-w-3xl mx-auto mb-4">
 <p className="eyebrow">What We Offer</p>
 <h2 className="mt-0.5 text-xl md:text-2xl font-heading text-primary-800">One Hub for Everything You Need</h2>
 <p className="mt-1 text-neutral-600 text-sm">From club discovery to mentoring, from student social to competitions &mdash; every resource lives here.</p>
 </div>
 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
 {[
 { href: "/directory", icon: Compass, title: "Discover Clubs", desc: "Interactive directory with map, AI recommendations, and trending clubs.", color: "from-blue-50 to-primary-50/50", iconColor: "bg-blue-100 text-blue-700" },
 { href: "/resources", icon: BookOpen, title: "Resource Library", desc: "Guides, templates, handbooks by launch stage with community uploads.", color: "from-purple-50 to-white", iconColor: "bg-purple-100 text-purple-700" },
 { href: "/students", icon: Users, title: "Student Social", desc: "Connect with peers, join discussions, share resources, and collaborate.", color: "from-indigo-50 to-white", iconColor: "bg-indigo-100 text-indigo-700" },
 { href: "/events", icon: CalendarCheck, title: "Events & Programs", desc: "Community events, RSVP, calendar integration, and event creation.", color: "from-green-50 to-white", iconColor: "bg-green-100 text-green-700" },
 { href: "/start-a-club", icon: Rocket, title: "Create a Club", desc: "Wizard with constitution editor, logo tools, and progress tracking.", color: "from-orange-50 to-white", iconColor: "bg-orange-100 text-orange-700" },
 { href: "/hub/mentors", icon: GraduationCap, title: "Mentor Network", desc: "Connect with professionals and alumni for career guidance.", color: "from-teal-50 to-white", iconColor: "bg-teal-100 text-teal-700" },
 { href: "/hub", icon: Handshake, title: "Student Hub", desc: "Discussions, competitions, achievements, and collaboration tools.", color: "from-pink-50 to-white", iconColor: "bg-pink-100 text-pink-700" },
 { href: "/dashboard", icon: Shield, title: "Dashboard", desc: "Personal command center with clubs, events, and settings.", color: "from-amber-50 to-white", iconColor: "bg-amber-100 text-amber-700" },
 ].map(tile => {
 const Icon = tile.icon;
 return (
 <Link key={tile.title} href={tile.href} className={`card p-4 bg-gradient-to-br ${tile.color} group ux-hover-lift card-3d hover:ring-2 hover:ring-primary-200 transition-all`}>
 <div className={`w-9 h-9 flex items-center justify-center ${tile.iconColor} group-hover:scale-110 transition-transform`}><Icon size={16} /></div>
 <h3 className="mt-2 text-sm font-bold text-primary-800 group-hover:text-primary-600">{tile.title}</h3>
 <p className="mt-1 text-xs text-neutral-600 leading-relaxed">{tile.desc}</p>
 <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">Explore <ArrowRight size={12} /></span>
 </Link>
 );
 })}
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-about" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
 <div className="card overflow-hidden">
 <div className="grid lg:grid-cols-2">
 <div className="relative h-48 lg:h-auto">
 <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" alt="Students collaborating" fill className="object-cover" loading="lazy" />
 </div>
 <div className="p-4 lg:p-5">
 <p className="eyebrow">About ClubConnect</p>
 <h2 className="mt-0.5 text-lg md:text-xl font-heading text-primary-800">Our Mission &amp; Philosophy</h2>
 <p className="mt-1 text-neutral-600 text-sm leading-relaxed">
 ClubConnect is built on the belief that every student deserves access to meaningful extracurricular experiences. We provide the tools, resources, and community infrastructure to make student organizations thrive.
 </p>
 {aboutExpanded && (
 <div className="mt-4 space-y-3 text-neutral-600 leading-relaxed animate-fade-up">
 <p><strong className="text-primary-700">Our Vision:</strong> A school where every student is connected to at least one organization that builds skills, friendships, and purpose.</p>
 <p><strong className="text-primary-700">Our Goals:</strong></p>
 <ul className="list-disc pl-5 space-y-1 text-sm">
 <li>Make club discovery and creation seamless for all students</li>
 <li>Provide professional-grade tools for student leaders</li>
 <li>Connect clubs with community partners, mentors, and funding</li>
 <li>Track and celebrate student achievements and service hours</li>
 <li>Support advisors with streamlined management tools</li>
 </ul>
 <p><strong className="text-primary-700">Built by students, for students</strong> &mdash; ClubConnect is developed by the JHSTSA Webmaster team using modern web technologies.</p>
 </div>
 )}
 <button onClick={() => setAboutExpanded(v => !v)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline">
 {aboutExpanded ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Read More</>}
 </button>
 </div>
 </div>
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
 <div className="text-center max-w-3xl mx-auto mb-3">
 <p className="eyebrow">What Students Say</p>
 <h2 className="mt-0.5 text-lg md:text-xl font-heading text-primary-800">Ratings &amp; Reviews</h2>
 </div>
 <div className="card p-3 md:p-4 bg-gradient-to-br from-primary-50 to-secondary-50/30 mb-3">
 <div className="flex items-start gap-4">
 <Quote size={32} className="text-primary-300 shrink-0 mt-1" />
 <div className="flex-1">
 <p className="text-lg text-neutral-700 leading-relaxed italic">&ldquo;{testimonials[testimonialIdx].text}&rdquo;</p>
 <div className="mt-4 flex items-center gap-3">
 <Image src={testimonials[testimonialIdx].avatar} alt={testimonials[testimonialIdx].name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
 <div>
 <p className="font-bold text-primary-700">{testimonials[testimonialIdx].name}</p>
 <p className="text-xs text-neutral-500">{testimonials[testimonialIdx].role}</p>
 </div>
 <div className="ml-auto flex gap-1">
 {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />)}
 </div>
 </div>
 </div>
 </div>
 <div className="mt-4 flex justify-center gap-2">
 {testimonials.map((_, i) => (
 <button key={i} onClick={() => setTestimonialIdx(i)}
 className={`h-2 rounded-full transition-all ${i === testimonialIdx ? "bg-primary-600 w-5" : "bg-primary-300 w-2"}`} />
 ))}
 </div>
 </div>
 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
 {clubRatings.slice(0, 8).map(club => (
 <Link key={club.id} href={`/directory/${club.id}`} className="card p-4 hover:border-primary-300 transition-all group">
 <h4 className="font-bold text-primary-800 text-sm group-hover:text-primary-600">{club.name}</h4>
 <div className="flex items-center gap-2 mt-2">
 <div className="flex">
 {[1,2,3,4,5].map(s => (
 <Star key={s} size={14} className={s <= Math.round(club.rating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"} />
 ))}
 </div>
 <span className="text-sm font-semibold text-neutral-700">{club.rating}</span>
 </div>
 <p className="text-xs text-neutral-400 mt-1">{club.reviews} reviews</p>
 </Link>
 ))}
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
 <div className="flex items-end justify-between mb-3">
 <div>
 <p className="eyebrow">Spotlight</p>
 <h2 className="mt-0.5 text-lg md:text-xl font-heading text-primary-800">Featured Community Resources</h2>
 </div>
 <Link href="/directory" className="text-sm font-semibold text-primary-600 hover:underline hidden sm:flex items-center gap-1">View all <ArrowRight size={14} /></Link>
 </div>
 <div className="grid md:grid-cols-3 gap-4 stagger-children">
 {spotlights.map(spot => (
 <Link key={spot.id} href={`/directory/${spot.chapterId}`} className="card p-5 bg-gradient-to-br from-secondary-50/30 to-white ux-hover-lift-sm card-3d group relative overflow-hidden">
 <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-secondary-100/40 to-transparent rounded-bl-[3rem]" />
 <span className="text-xs px-2 py-0.5 bg-secondary-100 text-secondary-700 rounded-full font-semibold">{spot.chapter.category}</span>
 <h3 className="mt-3 text-lg font-bold text-primary-800 group-hover:text-primary-600">{spot.title}</h3>
 <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{spot.content}</p>
 <div className="mt-3 flex flex-wrap gap-1">
 {spot.highlights.slice(0, 2).map(h => (
 <span key={h} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full border border-primary-100">{h}</span>
 ))}
 </div>
 <p className="mt-3 text-xs font-semibold text-primary-600 group-hover:underline flex items-center gap-1">Learn more <ArrowRight size={12} /></p>
 </Link>
 ))}
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-events" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
 <div className="grid lg:grid-cols-3 gap-4">
 <div className="lg:col-span-2">
 <div className="flex items-end justify-between mb-3">
 <h2 className="text-xl font-heading font-bold text-primary-700">Upcoming Events</h2>
 <Link href="/events" className="text-sm font-semibold text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
 </div>
 <div className="space-y-3 stagger-children">
 {upcomingEvents.map(event => (
 <Link href={`/events/${event.id}`} key={event.id} className="card p-4 flex items-center gap-4 ux-hover-lift-sm group">
 <div className="text-center bg-gradient-to-b from-primary-500 to-primary-600 text-white px-3 py-2 min-w-[52px] shadow-sm">
 <div className="text-[10px]">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</div>
 <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-semibold text-primary-700 group-hover:text-primary-600">{event.title}</p>
 <p className="text-sm text-neutral-500">{event.chapterName} &middot; {event.startTime}&ndash;{event.endTime}</p>
 </div>
 <div className="hidden sm:flex items-center gap-2">
 <span className="text-xs text-neutral-400 flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
 <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 font-semibold hover:bg-primary-100">RSVP</span>
 </div>
 </Link>
 ))}
 </div>
 </div>
 <div className="card p-4">
 <h3 className="text-base font-heading font-bold text-primary-700 mb-3">Announcements</h3>
 <div className="space-y-3">
 {announcements.slice(0, 4).map(ann => (
 <div key={ann.id} className="p-3 border border-neutral-100 hover:bg-primary-50/30 transition-colors">
 <div className="flex items-start gap-2">
 <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ann.priority === "high" ? "bg-red-500" : "bg-yellow-500"}`} />
 <div>
 <p className="font-semibold text-sm text-primary-800">{ann.title}</p>
 <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{ann.content}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-donate" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
 <div className="card overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
 <div className="grid lg:grid-cols-2">
 <div className="p-4 lg:p-5">
 <p className="eyebrow text-green-600">Support Our Clubs</p>
 <h2 className="mt-1 text-xl md:text-2xl font-heading text-primary-800">Clubs Need Your Help</h2>
 <p className="mt-2 text-neutral-600 text-sm">Many student organizations need funding for equipment, competitions, and events. Your donation directly supports student success.</p>
 <div className="mt-3 grid grid-cols-2 gap-2">
 {chapters.slice(0, 4).map((ch, i) => (
 <div key={ch.id} className="bg-white/80 p-3 border border-green-100">
 <p className="font-bold text-sm text-primary-700">{ch.name}</p>
 <div className="mt-1 h-1.5 bg-green-100 rounded-full overflow-hidden">
 <div className="h-full bg-green-500 rounded-full" style={{ width: `${[42, 78, 35, 61][i % 4]}%` }} />
 </div>
 <p className="text-xs text-neutral-500 mt-1">${[420, 780, 350, 610][i % 4]} / $1,000 goal</p>
 </div>
 ))}
 </div>
 <div className="mt-3 flex gap-2">
 <Link href="/donate" className="btn-primary flex items-center gap-2"><Gift size={16} /> Donate Now</Link>
 <Link href="/donate" className="btn-outline text-sm">Become a Sponsor</Link>
 </div>
 </div>
 <div className="relative hidden lg:block">
 <Image src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80" alt="Students at community event" fill className="object-cover" loading="lazy" />
 </div>
 </div>
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-quicklinks" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
 <div className="text-center max-w-3xl mx-auto mb-3">
 <p className="eyebrow">Quick Access</p>
 <h2 className="mt-0.5 text-lg md:text-xl font-heading text-primary-800">Everything Connected</h2>
 </div>
 <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 stagger-children">
 {[
 { href: "/students", label: "Social", icon: "\u{1F465}" },
 { href: "/directory", label: "Explore Clubs", icon: "\u{1F50D}" },
 { href: "/resources", label: "Resources", icon: "\u{1F4DA}" },
 { href: "/start-a-club", label: "Create a Club", icon: "\u{1F680}" },
 { href: "/events", label: "Events", icon: "\u{1F4C5}" },
 { href: "/hub/mentors", label: "Mentors", icon: "\u{1F468}\u200D\u{1F3EB}" },
 { href: "/hub/quiz", label: "Club Quiz", icon: "\u{1F3AF}" },
 { href: "/hub/competitions", label: "Competitions", icon: "\u{1F3C6}" },
 { href: "/hub/discussions", label: "Discussions", icon: "\u{1F4AC}" },
 { href: "/hub", label: "Student Hub", icon: "\u2B50" },
 { href: "/donate", label: "Donate", icon: "\u{1F4B0}" },
 { href: "/dashboard", label: "Dashboard", icon: "\u{1F6E1}\uFE0F" },
 { href: "/profile", label: "Profile", icon: "\u{1F464}" },
 { href: "/propose", label: "Propose", icon: "\u{1F4DD}" },
 ].map(item => (
 <Link key={item.label} href={item.href} className="card p-3 text-center ux-hover-lift-sm group hover:border-primary-300 transition-all">
 <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
 <span className="text-[10px] font-semibold text-primary-700">{item.label}</span>
 </Link>
 ))}
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section id="guide-partners" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
 <div className="text-center max-w-3xl mx-auto mb-3">
 <p className="eyebrow">Community Partnerships</p>
 <h2 className="mt-0.5 text-lg md:text-xl font-heading text-primary-800">Partners Supporting Our Students</h2>
 </div>
 <div className="flex flex-wrap justify-center gap-3">
 {sponsorsData.map(sponsor => (
 <div key={sponsor.id} className="card px-4 py-3 flex items-center gap-3 ux-hover-lift-sm group">
 <div className="w-10 h-10 bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
 {sponsor.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
 </div>
 <div>
 <p className="font-semibold text-primary-800 text-sm">{sponsor.name}</p>
 <p className={`text-xs capitalize ${sponsor.tier === "platinum" ? "text-purple-600" : sponsor.tier === "gold" ? "text-yellow-600" : "text-neutral-500"}`}>{sponsor.tier} partner</p>
 </div>
 </div>
 ))}
 </div>
 </section>
 </Reveal>

 {}
 <Reveal>
 <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-5">
 <div className=" border border-primary-200 bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 p-4 md:p-6 text-center ux-hover-lift-sm animate-gradient-shift overflow-hidden relative">
 <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" alt="" fill className="object-cover opacity-10" loading="lazy" />
 <div className="relative">
 <h2 className="text-xl font-heading text-white">Ready to get involved?</h2>
 <p className="mt-1 max-w-2xl mx-auto text-white/90 text-sm">Whether you&rsquo;re looking for a club, a mentor, resources, or a way to make an impact &mdash; it all starts here.</p>
 <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
 <Link href="/directory" className="inline-flex items-center gap-2 px-5 py-2 bg-white text-primary-700 font-semibold text-sm hover:bg-neutral-100 btn-magnetic btn-ripple">
 Browse Directory <ArrowRight size={16} />
 </Link>
 <Link href="/students" className="inline-flex items-center gap-2 px-5 py-2 border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-primary-700 btn-magnetic">
 <Brain size={14} /> Student Hub
 </Link>
 </div>
 </div>
 </div>
 </section>
 </Reveal>

 {}
 {}
 <button onClick={startGuide}
  className="fixed top-1/3 right-0 z-50 bg-secondary-600 hover:bg-secondary-700 text-white px-3 py-3 shadow-lg flex items-center gap-2 text-xs font-bold transition-all hover:pr-5 group animate-pulse"
  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
  <BookMarked size={16} className="rotate-90" /> <span>JUDGE GUIDE</span>
 </button>

 {}
 {guideOpen && (
  <>
  <div className="fixed inset-0 z-[55] bg-black/20 transition-opacity" onClick={dismissGuide} />
  <div className="fixed top-0 right-0 z-[60] h-full w-[28rem] max-w-[92vw] bg-white border-l-4 border-secondary-500 shadow-2xl flex flex-col animate-slide-in-right">
   {}
   <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-5 py-5 shrink-0">
    <div className="flex items-center justify-between">
     <h3 className="font-bold text-lg flex items-center gap-2"><BookMarked size={18} /> Judge&rsquo;s Guide</h3>
     <button onClick={dismissGuide} className="p-1.5 hover:bg-white/20 transition-colors"><X size={18} /></button>
    </div>
    <p className="text-[11px] text-primary-200 mt-1 leading-relaxed">
     Welcome! This is a <strong className="text-white">comprehensive overview</strong> of everything ClubConnect offers. Please take your time exploring &mdash; we truly appreciate you reviewing our work.
    </p>
   </div>

   {}
   <div className="flex-1 overflow-y-auto">
    {}
    <div className="px-5 py-4 border-b border-neutral-100 bg-gradient-to-b from-secondary-50/40 to-white">
     <p className="text-xs text-neutral-700 leading-relaxed">
      <strong className="text-primary-800">ClubConnect</strong> is a full-featured <strong>community resource hub</strong> for school clubs and student organizations. It connects students to <strong>30+ active clubs</strong>, mentors, events, downloadable resources, and tools to create their own organizations. School clubs are one of the most impactful community resources available to students.
     </p>
     <p className="text-xs text-neutral-600 leading-relaxed mt-2">
      The <strong>References &amp; Citations</strong> button is located on the <strong>Homepage hero section</strong> at the top of the site. It contains our full work log, copyright checklist, code stack, and image attributions.
     </p>
     <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200">
      <span className="text-lg">📊</span>
      <p className="text-[11px] text-primary-700 font-semibold">56 total pages &middot; 30+ clubs &middot; 20+ resources &middot; 5 API integrations</p>
     </div>
    </div>

    {}
    {[
     { id: "tech", icon: "🛠️", title: "Tech Stack & Architecture", content: (
      <div className="space-y-2.5">
       <div className="flex items-start gap-2.5">
        <span className="mt-0.5 w-6 h-6 bg-black text-white flex items-center justify-center text-[9px] font-bold shrink-0">N</span>
        <div><p className="text-xs font-semibold text-primary-700">Next.js 16 + TypeScript</p><p className="text-[10px] text-neutral-500">App Router with server &amp; client components, Turbopack for fast dev builds, 56 routes across the application</p></div>
       </div>
       <div className="flex items-start gap-2.5">
        <span className="mt-0.5 w-6 h-6 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">S</span>
        <div><p className="text-xs font-semibold text-primary-700">Supabase</p><p className="text-[10px] text-neutral-500">Full auth system (login, signup, sessions), PostgreSQL database, row-level security policies, real-time subscriptions, file storage for avatars &amp; community uploads</p></div>
       </div>
       <div className="flex items-start gap-2.5">
        <span className="mt-0.5 w-6 h-6 bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">$</span>
        <div><p className="text-xs font-semibold text-primary-700">Stripe Payments</p><p className="text-[10px] text-neutral-500">Secure checkout sessions for club donations and fundraising, with progress tracking and test mode</p></div>
       </div>
       <div className="flex items-start gap-2.5">
        <span className="mt-0.5 w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">G</span>
        <div><p className="text-xs font-semibold text-primary-700">Gemini 2.0 Flash (AI)</p><p className="text-[10px] text-neutral-500">Embedded AI chat agents on multiple pages for resource discovery, Q&amp;A, and navigational help</p></div>
       </div>
       <div className="flex items-start gap-2.5">
        <span className="mt-0.5 w-6 h-6 bg-cyan-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">T</span>
        <div><p className="text-xs font-semibold text-primary-700">Tailwind CSS</p><p className="text-[10px] text-neutral-500">Custom school-themed design system with primary (navy), secondary (gold), and accent (maroon) palette</p></div>
       </div>
       <div className="flex items-start gap-2.5">
        <span className="mt-0.5 w-6 h-6 bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">L</span>
        <div><p className="text-xs font-semibold text-primary-700">Leaflet Maps</p><p className="text-[10px] text-neutral-500">Interactive map integration in the Club Directory for location-based discovery</p></div>
       </div>
      </div>
     )},
     { id: "homepage", icon: "🏠", title: "Homepage & Landing", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Rotating hero banners (4 banners, auto-cycle every 6 seconds) with call-to-action buttons</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Animated rotating word effect in the main heading (&ldquo;Your Hub for Clubs / Events / Mentors / Resources / Community&rdquo;)</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Live counters for Active Clubs, Students Served, Upcoming Events, Service Hours</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>&ldquo;What Is ClubConnect?&rdquo; introduction section explaining the platform&rsquo;s purpose</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Featured Clubs Carousel with 3D pixelated icons, ratings, and member counts</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>&ldquo;What We Offer&rdquo; grid: 8 feature tiles linking to major sections</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>About section with expandable &ldquo;Our Mission &amp; Philosophy&rdquo;</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Testimonials carousel with student/faculty reviews and 5-star ratings</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Spotlight section for featured community resources</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Announcements feed, upcoming events, donation progress, partnership logos</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>References &amp; Citations button and this Judge&rsquo;s Guide button in the hero</span></li>
      </ul>
     )},
     { id: "directory", icon: "🔍", title: "Club Discovery & Directory", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Searchable directory of 30+ clubs with real-time filtering</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Filter by day, time, category, grade level, and meeting schedule</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Interactive Leaflet map showing club meeting locations</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Grid and list view toggle for browsing preference</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Individual club profile pages with interactive 3D pixelated logos</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Each club page has: Overview, Statistics (radar chart, heatmap, donut charts), Events, Projects, History timeline, Meeting Notes, and Discussion tabs</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Join Club button with auth check, Video Call / Meeting link, Donate button, Share link</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Officer portal for club management (announcements, edit description)</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Explore page with AI-powered club recommendations and a quiz-based discovery tool</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Side-by-side club comparison tool at the Hub</span></li>
      </ul>
     )},
     { id: "resources", icon: "📚", title: "Resource Library & Guides", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>20+ downloadable resources organized in a 5-stage rocket launch system (Pre-Launch, Ignition, Liftoff, Orbit, Deep Space)</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>PDF preview with embedded viewer before download</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Search and filter resources by category or keyword</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Community resource submission form (3-step wizard at the Propose page) for students to contribute new materials</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Guides index page with categorized how-to articles, reading time, and section counts</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Individual guide pages with step-by-step content and navigation</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Hub Starter Guide with interactive step completion tracking</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>External resources page linking to leadership courses (Harvard, Coursera), event planning tools, and design resources</span></li>
      </ul>
     )},
     { id: "events", icon: "📅", title: "Events & Calendar", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Full events calendar with monthly view, filtering by type (meeting, competition, social, service, workshop, deadline)</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Individual event detail pages with comments, resource downloads, and sharing</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>RSVP system with attendee tracking</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Event creation form for club officers to submit new events</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Meetings page with agenda, location info, and virtual/in-person options</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Announcements board with priority levels (high, medium, low) and category filtering</span></li>
      </ul>
     )},
     { id: "social", icon: "💬", title: "Student Community & Social", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Student Community hub with live social chat and discussion threads</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>File uploads for sharing TSA guides, budget spreadsheets, and templates</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Discussion forum with threading, upvoting, pinning, and solved-status tracking</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Community hub with weekly opportunities, school-wide stats, and success stories</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Collaboration platform for clubs to find partners for joint projects and events</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Ideas Generator where students submit and vote on new club concepts</span></li>
      </ul>
     )},
     { id: "create", icon: "🚀", title: "Club Creation & Management", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>5-step Club Creation Wizard with guided form, constitution template editor, and formatting tools</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Logo uploader, poster designer, and advisor requirement info</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Gamified progress tracking with XP for completing creation steps</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Management Dashboard for editing drafts, managing officers, configuring social links</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Resource Request Board to request materials with status tracking (Submitted, Under Review, In Progress)</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Health Dashboard with membership trends, attendance tracking, and performance recommendations</span></li>
      </ul>
     )},
     { id: "mentors", icon: "🎓", title: "Mentorship & Alumni Network", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Mentor profiles with expertise areas, availability, ratings, and session counts</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Offering types: 1-on-1 mentoring, resume review, mock interviews, career guidance</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Alumni network page with career paths, testimonials, college info, and messaging</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Success stories featuring alumni and club achievements with impact metrics</span></li>
      </ul>
     )},
     { id: "funding", icon: "💰", title: "Funding & Donations", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Stripe-powered donation system with secure checkout sessions</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club-specific fundraising pages with progress bars and goal tracking</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Judge test mode available (promo code &ldquo;test&rdquo; on donate page)</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Funding &amp; Budget dashboard with allocation vs. spent analysis and charts</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>School-wide analytics dashboard with animated counters and performance metrics</span></li>
      </ul>
     )},
     { id: "comms", icon: "📹", title: "Communication & Video Calls", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Video conference rooms with mic/camera controls and participant management</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Built-in whiteboard for collaborative drawing during calls</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Call preview/setup page with room generation and invite link sharing</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Notification center with event, announcement, mention, achievement, and system alerts</span></li>
      </ul>
     )},
     { id: "achieve", icon: "🏆", title: "Achievements & Gamification", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Achievement badge system with rarity levels: Common, Uncommon, Rare, Epic, Legendary</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Finder Quiz that matches students to clubs based on interests</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Goal tracking system with progress bars, milestones, and priority levels</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Bookmarks &amp; Collections to save resources, events, and clubs with public/private settings</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Competition tracker for TSA and club competitions with registration and deadlines</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>TSA Webmaster Rubric page with exemplary examples for each scoring category</span></li>
      </ul>
     )},
     { id: "auth", icon: "🔐", title: "Authentication & Profiles", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Supabase-powered login and signup with email/password authentication</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>User profiles with avatar upload (stored in Supabase), bio, grade, and school info</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Personal dashboard showing joined clubs, submitted events, activity feed, and notifications</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Auth-gated actions: joining clubs redirects to login if not authenticated</span></li>
      </ul>
     )},
     { id: "access", icon: "♿", title: "Accessibility, Safety & Legal", content: (
      <ul className="space-y-1.5 text-xs text-neutral-700">
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>WCAG 2.1 AA/AAA compliant contrast ratios throughout the design</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Keyboard navigation support and alt text on all images</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Dedicated Accessibility Statement page with WCAG compliance details</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Safety Guidelines with emergency contacts, anti-bullying policy, and crisis resources (988, Crisis Text Line)</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Privacy Policy with COPPA/FERPA compliance, Terms of Use, and data handling info</span></li>
       <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>FAQ page with searchable, categorized questions and expandable answers</span></li>
      </ul>
     )},
    ].map(section => (
     <GuideAccordion key={section.id} icon={section.icon} title={section.title}>
      {section.content}
     </GuideAccordion>
    ))}

    {}
    <div className="px-5 py-4 bg-gradient-to-b from-secondary-50/40 to-primary-50/30">
     <p className="text-xs text-neutral-700 leading-relaxed">
      <strong className="text-primary-800">Thank you for taking the time to review ClubConnect.</strong> We put tremendous effort into making this a comprehensive, functional, and accessible platform. We hope you enjoy exploring every feature &mdash; from the interactive club directory and AI-powered agents, to the donation system and video conferencing. We sincerely appreciate your evaluation.
     </p>
     <p className="text-[10px] text-neutral-500 mt-2 italic">
      Tip: Use the navigation bar at the top to access any major section. Look for the floating chat widget on pages like Resources and Students. The References &amp; Citations button is on the homepage.
     </p>
    </div>
   </div>

   {}
   <div className="border-t border-neutral-200 px-5 py-3 flex items-center justify-between shrink-0 bg-neutral-50">
    <p className="text-[10px] text-neutral-400">ClubConnect &mdash; JHSTSA Webmaster 2026</p>
    <button onClick={dismissGuide} className="px-5 py-2 text-xs font-bold bg-secondary-600 text-white hover:bg-secondary-700">
     Got It &mdash; Thank You!
    </button>
   </div>
  </div>
  </>
 )}
 </div>
 );
}
