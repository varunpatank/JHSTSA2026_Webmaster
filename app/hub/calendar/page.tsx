"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { events, chapters } from "@/lib/data";
import {
  Calendar as CalIcon, ChevronLeft, ChevronRight, Clock, Download, Filter, MapPin, Search, Tag, Users
} from "lucide-react";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarEvent {
  id: string; title: string; date: string; time: string; club: string;
  category: string; location: string; type: "meeting" | "competition" | "social" | "service" | "workshop" | "deadline";
}

const CALENDAR_EVENTS: CalendarEvent[] = [
  ...events.map(e => ({
    id: e.id, title: e.title, date: e.date || "2026-03-15", time: "3:30 PM",
    club: chapters.find(c => c.id === e.chapterId)?.name || "School-Wide",
    category: e.category || "General", location: e.location || "TBD",
    type: "meeting" as const,
  })),
  { id: "ce1", title: "Robotics Build Session", date: "2026-03-05", time: "3:30 PM", club: "Robotics Club", category: "STEM", location: "Room 204", type: "workshop" },
  { id: "ce2", title: "Model UN Practice", date: "2026-03-07", time: "3:30 PM", club: "Model United Nations", category: "Academic", location: "Room 115", type: "meeting" },
  { id: "ce3", title: "Art Club Open Studio", date: "2026-03-10", time: "3:00 PM", club: "Art Club", category: "Arts", location: "Art Room", type: "social" },
  { id: "ce4", title: "Beach Cleanup", date: "2026-03-12", time: "9:00 AM", club: "Environmental Club", category: "Service", location: "Juanita Beach", type: "service" },
  { id: "ce5", title: "Spring Dance Committee", date: "2026-03-14", time: "12:00 PM", club: "Student Council", category: "Social", location: "Cafeteria", type: "meeting" },
  { id: "ce6", title: "Science Olympiad Invitational", date: "2026-03-08", time: "8:00 AM", club: "Science Olympiad", category: "STEM", location: "Off-Site", type: "competition" },
  { id: "ce7", title: "Debate Qualifier Deadline", date: "2026-03-10", time: "11:59 PM", club: "Debate Team", category: "Academic", location: "Online", type: "deadline" },
  { id: "ce8", title: "Cultural Food Festival", date: "2026-03-20", time: "5:00 PM", club: "Cultural Exchange", category: "Cultural", location: "Commons", type: "social" },
  { id: "ce9", title: "CS Club Hackathon Prep", date: "2026-03-18", time: "3:30 PM", club: "CS Club", category: "STEM", location: "Computer Lab", type: "workshop" },
  { id: "ce10", title: "Drama Rehearsal", date: "2026-03-22", time: "4:00 PM", club: "Drama Club", category: "Arts", location: "Auditorium", type: "meeting" },
  { id: "ce11", title: "Key Club Volunteering", date: "2026-03-25", time: "10:00 AM", club: "Key Club", category: "Service", location: "Community Center", type: "service" },
  { id: "ce12", title: "TSA Regional Entry Deadline", date: "2026-03-20", time: "11:59 PM", club: "TSA", category: "STEM", location: "Online", type: "deadline" },
];

const TYPE_COLORS: Record<string, string> = {
  meeting: "bg-blue-500", competition: "bg-red-500", social: "bg-purple-500",
  service: "bg-green-500", workshop: "bg-yellow-500", deadline: "bg-orange-500",
};

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year: number, month: number) { return new Date(year, month, 1).getDay(); }

const CALENDAR_LS_KEY = "clubconnect_calendar_events";

function loadCalendarEvents(): CalendarEvent[] {
  try {
    const s = localStorage.getItem(CALENDAR_LS_KEY);
    if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return CALENDAR_EVENTS;
}

export default function CalendarPage() {
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>(() => loadCalendarEvents());
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [view, setView] = useState<"month" | "list">("month");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => { try { localStorage.setItem(CALENDAR_LS_KEY, JSON.stringify(calEvents)); } catch {} }, [calEvents]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const types = ["All", "meeting", "competition", "social", "service", "workshop", "deadline"];

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null); }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null); }

  function getEventsForDay(day: number): CalendarEvent[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calEvents.filter(e => e.date === dateStr);
  }

  const monthEvents = calEvents.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).filter(e => typeFilter === "All" || e.type === typeFilter).sort((a, b) => a.date.localeCompare(b.date));

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-600 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-sky-100 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><CalIcon size={36} /> Community Calendar</h1>
          <p className="mt-3 max-w-2xl text-sky-50 text-lg">All club events, competitions, and deadlines in one place.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        <div className="card p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 hover:bg-neutral-100 "><ChevronLeft size={18} /></button>
            <h2 className="font-bold text-primary-700 text-lg">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-neutral-100 "><ChevronRight size={18} /></button>
          </div>
          <div className="flex items-center gap-2">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="select-field text-sm w-auto">
              {types.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <div className="flex  border border-neutral-200 overflow-hidden">
              <button onClick={() => setView("month")} className={`px-3 py-1.5 text-sm ${view === "month" ? "bg-primary-600 text-white" : "bg-white text-neutral-600"}`}>Month</button>
              <button onClick={() => setView("list")} className={`px-3 py-1.5 text-sm ${view === "list" ? "bg-primary-600 text-white" : "bg-white text-neutral-600"}`}>List</button>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-wrap gap-3 mb-4 text-xs">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${color}`} /> {type.charAt(0).toUpperCase() + type.slice(1)}</span>
          ))}
        </div>

        {view === "month" ? (
          <div className="lg:grid lg:grid-cols-4 lg:gap-6">
            {}
            <div className="lg:col-span-3">
              <Reveal>
                <div className="card overflow-hidden">
                  <div className="grid grid-cols-7 bg-primary-50 border-b border-neutral-200">
                    {DAYS.map(d => <div key={d} className="p-2 text-center text-xs font-bold text-primary-600">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 divide-x divide-y divide-neutral-100">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="min-h-[80px] bg-neutral-50/50 p-1" />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayEvents = getEventsForDay(day);
                      const isToday = false;
                      const isSelected = selectedDay === day;
                      return (
                        <button key={day} onClick={() => setSelectedDay(day === selectedDay ? null : day)} className={`min-h-[80px] p-1 text-left hover:bg-primary-50/30 transition-colors ${isSelected ? "bg-primary-50 ring-2 ring-primary-300" : ""}`}>
                          <span className={`text-xs font-semibold ${isSelected ? "text-primary-600" : "text-neutral-700"}`}>{day}</span>
                          <div className="mt-0.5 space-y-0.5">
                            {dayEvents.slice(0, 3).map(ev => (
                              <div key={ev.id} className={`text-[9px] px-1 py-0.5 rounded text-white truncate ${TYPE_COLORS[ev.type]}`}>{ev.title}</div>
                            ))}
                            {dayEvents.length > 3 && <span className="text-[9px] text-neutral-400">+{dayEvents.length - 3} more</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>

            {}
            <div className="mt-6 lg:mt-0">
              <div className="card p-4 sticky top-4">
                {selectedDay ? (
                  <>
                    <h3 className="font-bold text-primary-700 mb-3">{MONTHS[month]} {selectedDay}, {year}</h3>
                    {selectedDayEvents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedDayEvents.map(ev => (
                          <div key={ev.id} className="p-3  bg-neutral-50 border border-neutral-100">
                            <div className="flex items-center gap-1 mb-1">
                              <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[ev.type]}`} />
                              <span className="text-[10px] text-neutral-400 capitalize">{ev.type}</span>
                            </div>
                            <h4 className="font-semibold text-primary-800 text-sm">{ev.title}</h4>
                            <p className="text-xs text-neutral-500">{ev.club}</p>
                            <div className="mt-1 text-xs text-neutral-400 space-y-0.5">
                              <p className="flex items-center gap-1"><Clock size={10} /> {ev.time}</p>
                              <p className="flex items-center gap-1"><MapPin size={10} /> {ev.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-400">No events on this day.</p>
                    )}
                  </>
                ) : (
                  <div className="text-center text-sm text-neutral-400">
                    <CalIcon size={24} className="mx-auto text-neutral-300 mb-2" />
                    Click a day to see events
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Reveal>
            <div className="space-y-3">
              {monthEvents.length > 0 ? monthEvents.map(ev => (
                <div key={ev.id} className="card p-4 flex items-center gap-4 ux-hover-lift-sm">
                  <div className="text-center min-w-[50px]">
                    <p className="text-xs text-neutral-400 uppercase">{MONTHS[month].slice(0, 3)}</p>
                    <p className="text-2xl font-bold text-primary-700">{new Date(ev.date).getDate()}</p>
                  </div>
                  <span className={`w-1 h-10 rounded-full ${TYPE_COLORS[ev.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 capitalize">{ev.type}</span>
                    </div>
                    <h3 className="font-bold text-primary-800">{ev.title}</h3>
                    <p className="text-xs text-neutral-500">{ev.club} · {ev.time} · {ev.location}</p>
                  </div>
                </div>
              )) : (
                <div className="card p-8 text-center"><CalIcon size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No events this month.</p></div>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
