"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Check, MapPin, Clock, Users } from "lucide-react";
import type { Event } from "@/types";
import { getCreatedEvents } from "@/lib/clientState";

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
  events: Event[];
  selectedDate: string | null;
  onSelect: (d: string | null) => void;
}) {
  const today = new Date(2026, 3, 25);
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

export default function EventsClient({ events: staticEvents }: { events: Event[] }) {
  const [filter, setFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "grid">("list");
  const [events, setEvents] = useState<Event[]>(staticEvents);
  const [userEventIds, setUserEventIds] = useState<Set<string>>(new Set());
  const [fromCreated, setFromCreated] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userCreated = getCreatedEvents().map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      chapterId: e.clubId,
      chapterName: e.clubName,
      category: (e.category || "General") as Event["category"],
      isPublic: true,
      requiresRSVP: false,
      currentAttendees: 0,
    } as Event));
    const staticIds = new Set(staticEvents.map(e => e.id));
    const fresh = userCreated.filter(e => !staticIds.has(e.id));
    setUserEventIds(new Set(fresh.map(e => e.id)));
    // Append user events after static events so they don't hijack featured
    setEvents([...staticEvents, ...fresh]);

    // Scroll to schedule section if redirected after creation
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "created") {
      setFromCreated(true);
      const createdId = params.get("id");
      if (createdId) setCreatedEventId(createdId);
      setTimeout(() => scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [staticEvents]);

  const featured = staticEvents[0];

  const filtered = useMemo(() => events.filter(e => {
    const matchCat  = filter === "All" || e.category === filter;
    const matchDate = !selectedDate || e.date === selectedDate;
    return matchCat && matchDate;
  }), [filter, selectedDate, events]);

  const ordered = useMemo(() => {
    if (!createdEventId) return filtered;
    const target = filtered.find((event) => event.id === createdEventId);
    if (!target) return filtered;
    return [target, ...filtered.filter((event) => event.id !== createdEventId)];
  }, [filtered, createdEventId]);

  const schedule = ordered.slice(0, 12);

  return (
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
                  fill
                  priority
                  className="object-cover opacity-85"
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
      <section id="schedule" ref={scheduleRef}>
        {fromCreated && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold">
            <Check size={16} className="shrink-0" />
            Your event was created! It&apos;s now listed below.
          </div>
        )}
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
                {schedule.map((event) => (
                  <div key={event.id}
                    className="group bg-white rounded-2xl border border-cream-300 hover:border-primary-200 hover:shadow-md transition-all overflow-hidden">
                    <div className="flex items-stretch">
                      <div className="flex flex-col items-center justify-center bg-primary-800 text-white px-4 py-3 min-w-[56px] shrink-0">
                        <span className="text-[8px] uppercase font-bold tracking-widest opacity-80">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-2xl font-heading font-bold leading-none mt-0.5">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
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
  );
}
