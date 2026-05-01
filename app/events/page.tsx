"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Users, Filter } from "lucide-react";
import { events, chapters } from "@/lib/data";

const EVENT_IMGS: Record<string, string> = {
  Academic: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
  STEM:     "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
  Service:  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
  Arts:     "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
  Cultural: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  Sports:   "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  General:  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
};

const CATEGORY_COLORS: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-700",
  STEM:     "bg-violet-100 text-violet-700",
  Service:  "bg-green-100 text-green-700",
  Arts:     "bg-pink-100 text-pink-700",
  Cultural: "bg-orange-100 text-orange-700",
  Sports:   "bg-teal-100 text-teal-700",
  General:  "bg-neutral-100 text-neutral-700",
};

const FILTERS = ["All", "Academic", "STEM", "Service", "Arts", "Cultural", "Sports"];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function MiniCalendar({ events, selectedDate, onSelect }: {
  events: typeof import("@/lib/data").events;
  selectedDate: string | null;
  onSelect: (d: string | null) => void;
}) {
  const today = new Date(2026, 3, 25); // April 25 2026 (current date)
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const eventDates = new Set(events.map(e => e.date));

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-cream-200 transition-colors"><ChevronLeft size={14} /></button>
        <p className="text-sm font-bold text-primary-800 font-heading">{MONTHS[viewMonth]} {viewYear}</p>
        <button onClick={next} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-cream-200 transition-colors"><ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-neutral-400 uppercase py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEvent = eventDates.has(dateStr);
          const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
          const isSelected = selectedDate === dateStr;
          return (
            <button
              key={idx}
              onClick={() => onSelect(isSelected ? null : dateStr)}
              className={`relative flex flex-col items-center justify-center h-8 rounded-lg text-xs font-medium transition-all
                ${isSelected ? "bg-primary-800 text-white" : isToday ? "bg-secondary-100 text-secondary-700 font-bold" : "text-neutral-600 hover:bg-cream-200"}`}
            >
              {day}
              {hasEvent && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary-500" />}
            </button>
          );
        })}
      </div>
      {selectedDate && (
        <button onClick={() => onSelect(null)} className="mt-3 w-full text-xs text-primary-500 hover:text-primary-700 font-semibold">
          Clear date filter
        </button>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [filter, setFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "grid">("list");
  const [heroImgIdx, setHeroImgIdx] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=75",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=75",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=75",
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroImgIdx(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  const featured = events[0];

  const filtered = useMemo(() => events.filter(e => {
    const matchCat  = filter === "All" || e.category === filter;
    const matchDate = !selectedDate || e.date === selectedDate;
    return matchCat && matchDate;
  }), [filter, selectedDate]);

  const schedule = filtered.slice(0, 12);

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-cream-200 min-h-screen diagonal-texture-light">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ${i === heroImgIdx ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={img}
                alt="" fill className="object-cover opacity-35" priority={i === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/70 to-primary-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
        </div>

        {/* Diagonal texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.06) 12px, rgba(255,255,255,0.06) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255,255,255,0.06) 12px, rgba(255,255,255,0.06) 13px)"
        }} />
        {/* Community icon pattern — same as other page banners */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ opacity: 0.10 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="eventsAccent" x="0" y="0" width="280" height="200" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#eventsAccent)"/>
          </svg>
        </div>
        {/* Decorative graduation cap — upper-right */}
        <div className="absolute pointer-events-none select-none" style={{ top: "8%", right: "5%", opacity: 0.13 }} aria-hidden="true">
          <svg width="150" height="130" viewBox="0 0 170 148" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="85,10 142,40 85,70 28,40" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
            <path d="M46 47 L46 78 Q85 102 124 78 L124 47" stroke="white" strokeWidth="2.5" fill="none"/>
            <line x1="142" y1="40" x2="142" y2="70" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="142" cy="79" r="8" stroke="white" strokeWidth="2.2" fill="none"/>
            <line x1="135" y1="79" x2="128" y2="110" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="142" y1="79" x2="142" y2="112" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="149" y1="79" x2="154" y2="110" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-11 pb-20 md:pt-12 md:pb-24">
          <span className="inline-block bg-white/10 text-primary-100 text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
            Community Gatherings &amp; Workshops
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
            Upcoming Community{" "}
            <span className="relative inline-block text-secondary-400 italic">
              Events
              <span className="absolute pointer-events-none select-none z-20" style={{ top: "-0.52em", right: "-0.45em", transform: "rotate(12deg)", transformOrigin: "50% 100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }} aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
                  <polygon points="20,7 35,15 20,23 5,15" fill="#0d1b2b" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" />
                  <path d="M12 16 L12 24 Q20 30 28 24 L28 16" fill="#0d1b2b" fillOpacity="0.85" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3" strokeLinejoin="round" />
                  <line x1="35" y1="15" x2="35" y2="27" stroke="#b8860b" strokeWidth="1.9" strokeLinecap="round" />
                  <circle cx="35" cy="29" r="2.5" fill="#b8860b" />
                </svg>
              </span>
            </span>
          </h1>
          <p className="mt-3 text-primary-200 text-sm max-w-xl leading-relaxed mb-5">
            Browse upcoming club events, sign up for gatherings, and stay connected with your school community.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="#featured" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-800 text-white text-xs font-bold border border-white/20 hover:bg-primary-700 transition-colors">
              <Calendar size={13} /> Featured Event
            </a>
            <a href="#schedule" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors">
              Full Schedule
            </a>
            <Link href="/events/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors">
              Submit an Event
            </Link>
          </div>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 42" preserveAspectRatio="none" className="block w-full h-8 md:h-10">
            <path d="M0,42 L0,20 C360,42 720,0 1080,20 C1260,30 1380,16 1440,20 L1440,42 Z" fill="#f5f0e8" />
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ══ CALENDAR STRIP ════════════════════════════════ */}
        <section className="bg-cream-100 border border-cream-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
          <Calendar size={20} className="text-primary-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-0.5">Event Calendar</p>
            <p className="font-heading font-bold text-primary-800 text-sm">Need the full month-at-a-glance?</p>
            <p className="text-xs text-neutral-500">Open the community calendar to click dates and review day-specific events instantly.</p>
          </div>
          <a href="#schedule"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-800 text-white text-xs font-bold hover:bg-primary-700 transition-colors">
            <Calendar size={13} /> Open Full Calendar
          </a>
        </section>

        {/* ══ FEATURED EVENT ════════════════════════════════ */}
        {featured && (
          <section id="featured">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">Featured Gathering</p>
            <p className="text-sm text-neutral-500 mb-4">Highlighting a community moment we think you&rsquo;ll want to save to your calendar.</p>
            <div className="bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="grid md:grid-cols-[1fr_340px] gap-0">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[featured.category] ?? "bg-neutral-100 text-neutral-700"}`}>
                      {featured.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {new Date(featured.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-primary-800 mb-3 leading-snug">{featured.title}</h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-5">{featured.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-primary-700">
                      <Calendar size={14} className="text-primary-400" />
                      <span>{new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })} · {featured.startTime} – {featured.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary-700">
                      <MapPin size={14} className="text-primary-400" />
                      <span>{featured.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary-700">
                      <Users size={14} className="text-primary-400" />
                      <span>{featured.chapterName} · {featured.currentAttendees ?? "—"} attending</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/events/${featured.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-800 text-white text-xs font-bold hover:bg-primary-700 transition-colors">
                      View Details
                    </Link>
                    <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary-200 text-primary-700 text-xs font-semibold hover:bg-cream-200 transition-colors">
                      <Calendar size={12} /> Add to Calendar
                    </button>
                  </div>
                </div>
                <div className="relative min-h-[200px] md:min-h-0 bg-primary-900">
                  <Image
                    src={EVENT_IMGS[featured.category] ?? EVENT_IMGS.General}
                    alt={featured.title}
                    fill className="object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
                  <div className="absolute bottom-4 right-4 bg-primary-900/90 rounded-xl px-4 py-3 text-right">
                    <p className="text-3xl font-heading font-bold text-white leading-none">
                      {new Date(featured.date).getDate()}
                    </p>
                    <p className="text-[10px] font-semibold text-secondary-400 uppercase tracking-widest mt-1">
                      {new Date(featured.date).toLocaleDateString("en-US", { month: "short" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ UPCOMING SCHEDULE ═════════════════════════════ */}
        <section id="schedule">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-1">Upcoming Schedule</p>
              <h2 className="font-heading font-bold text-xl text-primary-800">
                {selectedDate
                  ? `Events on ${new Date(selectedDate + "T00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
                  : "All Upcoming Events"}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">Sync any event directly to your Google or Apple calendar.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView(v => v === "list" ? "grid" : "list")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream-400 text-xs font-medium text-primary-600 hover:bg-cream-200 transition-colors"
              >
                {view === "list" ? "Grid view" : "List view"}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Schedule list/grid */}
            <div className="flex-1 min-w-0">
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? "bg-primary-800 text-white shadow-sm" : "bg-white border border-cream-300 text-primary-600 hover:border-primary-300"}`}>
                    {f}
                  </button>
                ))}
              </div>

              {schedule.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-cream-300">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="font-bold text-primary-800">No events found</p>
                  <p className="text-sm text-neutral-500 mt-1">Try a different filter or date.</p>
                </div>
              ) : view === "list" ? (
                <div className="space-y-3">
                  {schedule.map((event, i) => (
                    <div key={event.id}
                      className="group bg-white rounded-2xl border border-cream-300 hover:border-primary-200 hover:shadow-md transition-all overflow-hidden">
                      <div className="flex items-stretch">
                        {/* Date block */}
                        <div className="flex flex-col items-center justify-center bg-primary-800 text-white px-4 py-3 min-w-[56px] shrink-0">
                          <span className="text-[8px] uppercase font-bold tracking-widest opacity-80">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-2xl font-heading font-bold leading-none mt-0.5">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        {/* Content */}
                        <div className="flex flex-1 min-w-0 items-center gap-4 px-4 py-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[event.category] ?? "bg-neutral-100 text-neutral-600"}`}>
                                {event.category}
                              </span>
                              {event.requiresRSVP && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600">RSVP</span>}
                            </div>
                            <p className="font-bold text-sm text-primary-800 group-hover:text-primary-600 transition-colors leading-snug truncate">
                              {event.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] text-neutral-400"><Clock size={9} /> {event.startTime}–{event.endTime}</span>
                              <span className="flex items-center gap-1 text-[10px] text-neutral-400"><MapPin size={9} /> {event.location.split(",")[0]}</span>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 shrink-0">
                            <Link href={`/events/${event.id}`}
                              className="px-3.5 py-1.5 rounded-full border border-primary-200 text-primary-700 text-xs font-semibold hover:bg-cream-100 transition-colors">
                              View Details
                            </Link>
                            <button className="px-3.5 py-1.5 rounded-full border border-cream-300 text-neutral-500 text-xs font-semibold hover:bg-cream-100 transition-colors">
                              + Calendar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Grid view */
                <div className="grid sm:grid-cols-2 gap-4">
                  {schedule.map(event => (
                    <Link key={event.id} href={`/events/${event.id}`}
                      className="group bg-white rounded-2xl overflow-hidden border border-cream-300 hover:shadow-md transition-all">
                      <div className="relative h-40">
                        <Image src={EVENT_IMGS[event.category] ?? EVENT_IMGS.General} alt="" fill className="object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent" />
                        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${CATEGORY_COLORS[event.category] ?? ""}`}>
                          {event.category}
                        </span>
                        <div className="absolute bottom-3 left-3 bg-primary-900/85 rounded-lg px-3 py-1.5">
                          <span className="text-xs text-white font-bold">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-sm text-primary-800 group-hover:text-primary-600 transition-colors leading-snug">{event.title}</p>
                        <p className="text-xs text-neutral-400 mt-1">{event.chapterName} · {event.startTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {filtered.length > 12 && (
                <div className="mt-6 flex justify-center gap-2">
                  {Array.from({ length: Math.min(Math.ceil(filtered.length / 12), 8) }, (_, i) => (
                    <button key={i} className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${i === 0 ? "bg-primary-800 text-white" : "bg-white border border-cream-300 text-primary-600 hover:bg-cream-200"}`}>
                      {i + 1}
                    </button>
                  ))}
                  {Math.ceil(filtered.length / 12) > 8 && <button className="px-3 h-8 rounded-full bg-white border border-cream-300 text-xs font-bold text-primary-600 hover:bg-cream-200">Next →</button>}
                </div>
              )}
            </div>

            {/* Sidebar calendar */}
            <aside className="lg:w-60 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Pick a Date</p>
              <MiniCalendar events={events} selectedDate={selectedDate} onSelect={setSelectedDate} />

              <div className="mt-5 bg-white rounded-2xl border border-cream-300 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <p className="text-xs font-bold text-primary-800 mb-3">Why join community events?</p>
                <ul className="space-y-2 text-xs text-neutral-500 leading-relaxed">
                  {["Build friendships beyond your homeroom", "Network with mentors and college reps", "Discover new clubs and opportunities", "Earn service hours for NHS/scholarships"].map(pt => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="text-secondary-500 shrink-0 mt-0.5">✦</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
