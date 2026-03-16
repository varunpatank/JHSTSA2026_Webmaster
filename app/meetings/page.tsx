"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import {
  Calendar, CheckCircle, ChevronDown, Clock, MapPin, PhoneCall, Plus, Search, Users, Video
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

interface Meeting {
  id: string; title: string; club: string; date: string; time: string;
  location: string; type: "regular" | "special" | "workshop" | "planning";
  agenda: string[]; attendees: number; maxAttendees: number;
  isVirtual: boolean; status: "upcoming" | "in-progress" | "completed";
}

const MEETINGS: Meeting[] = [
  { id: "mt1", title: "Weekly Build Session", club: "Robotics Club", date: "2026-03-05", time: "3:30 PM - 5:30 PM", location: "Room 204 (Engineering Lab)", type: "regular", agenda: ["Review build progress", "Work on autonomous programming", "Test drivetrain modifications"], attendees: 22, maxAttendees: 30, isVirtual: false, status: "upcoming" },
  { id: "mt2", title: "Conference Prep Meeting", club: "Model United Nations", date: "2026-03-07", time: "3:30 PM - 4:30 PM", location: "Room 115", type: "special", agenda: ["Assign committee placements", "Distribution of position paper guidelines", "Practice caucusing techniques", "Review conference logistics"], attendees: 18, maxAttendees: 25, isVirtual: false, status: "upcoming" },
  { id: "mt3", title: "Open Studio & Critique", club: "Art Club", date: "2026-03-10", time: "3:00 PM - 5:00 PM", location: "Art Room B210", type: "workshop", agenda: ["Open work time", "Group critique circle", "Spring Showcase planning"], attendees: 15, maxAttendees: 20, isVirtual: false, status: "upcoming" },
  { id: "mt4", title: "Spring Service Planning", club: "Community Service Club", date: "2026-03-06", time: "12:00 PM - 12:30 PM", location: "Room 108", type: "planning", agenda: ["Review upcoming service opportunities", "Sign up for beach cleanup", "Discuss Earth Day event", "Volunteer hour tracking reminder"], attendees: 12, maxAttendees: 35, isVirtual: false, status: "upcoming" },
  { id: "mt5", title: "Coding Workshop: APIs", club: "CS Club", date: "2026-03-08", time: "3:30 PM - 5:00 PM", location: "Computer Lab A", type: "workshop", agenda: ["REST API fundamentals", "Hands-on: build a weather app", "Q&A and debugging help"], attendees: 20, maxAttendees: 25, isVirtual: false, status: "upcoming" },
  { id: "mt6", title: "Rehearsal: Into the Woods", club: "Drama Club", date: "2026-03-09", time: "4:00 PM - 6:00 PM", location: "Auditorium", type: "regular", agenda: ["Act 2 scene blocking", "Musical rehearsal with orchestra", "Costume fitting (select cast)"], attendees: 35, maxAttendees: 60, isVirtual: false, status: "upcoming" },
  { id: "mt7", title: "Virtual Study Session", club: "Science Olympiad", date: "2026-03-06", time: "7:00 PM - 8:30 PM", location: "Google Meet", type: "workshop", agenda: ["Anatomy & Physiology review", "Practice test walkthrough", "Strategy for invitational"], attendees: 14, maxAttendees: 15, isVirtual: true, status: "upcoming" },
  { id: "mt8", title: "Officer Transition Planning", club: "Student Council", date: "2026-03-11", time: "3:30 PM - 4:15 PM", location: "Room 102", type: "planning", agenda: ["Review election timeline", "Discuss transition documents", "Plan candidate info session"], attendees: 8, maxAttendees: 12, isVirtual: false, status: "upcoming" },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  regular: { bg: "bg-blue-100", text: "text-blue-700" },
  special: { bg: "bg-purple-100", text: "text-purple-700" },
  workshop: { bg: "bg-green-100", text: "text-green-700" },
  planning: { bg: "bg-orange-100", text: "text-orange-700" },
};

export default function MeetingsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const types = ["All", "regular", "special", "workshop", "planning"];

  const filtered = MEETINGS.filter(m => {
    if (typeFilter !== "All" && m.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.club.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-gradient-to-br from-slate-700 via-primary-600 to-primary-700 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h1 className="text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><Calendar size={36} /> Meetings Schedule</h1>
          <p className="mt-3 max-w-2xl text-primary-100 text-lg">View upcoming club meetings, RSVPs, and agendas all in one place.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/call/preview" className="btn-secondary inline-flex items-center gap-2">
              <PhoneCall size={16} /> Start Quick Call
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{MEETINGS.length}</p><p className="text-xs text-primary-200">This Week</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{MEETINGS.filter(m => m.isVirtual).length}</p><p className="text-xs text-primary-200">Virtual</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{types.length - 1}</p><p className="text-xs text-primary-200">Types</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search meetings..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="select-field text-sm w-auto capitalize">
            {types.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map(meeting => (
            <Reveal key={meeting.id}>
              <div className="card overflow-hidden ux-hover-lift-sm">
                <button onClick={() => setExpandedId(expandedId === meeting.id ? null : meeting.id)} className="w-full p-5 text-left hover:bg-neutral-50/30 transition-colors">
                  <div className="flex items-start gap-4">
                    {}
                    <div className="text-center min-w-[50px] shrink-0">
                      <p className="text-xs text-neutral-400 uppercase">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(meeting.date + "T12:00:00").getDay()]}</p>
                      <p className="text-2xl font-bold text-primary-700">{new Date(meeting.date + "T12:00:00").getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${TYPE_COLORS[meeting.type].bg} ${TYPE_COLORS[meeting.type].text}`}>{meeting.type}</span>
                        {meeting.isVirtual && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1"><Video size={10} /> Virtual</span>}
                      </div>
                      <h3 className="font-bold text-primary-800 text-lg">{meeting.title}</h3>
                      <p className="text-xs text-neutral-500">{meeting.club}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><Clock size={12} /> {meeting.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {meeting.location}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {meeting.attendees}/{meeting.maxAttendees}</span>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-neutral-400 shrink-0 mt-1 transition-transform ${expandedId === meeting.id ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expandedId === meeting.id && (
                  <div className="px-5 pb-5 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mt-3 mb-2">Agenda</h4>
                    <ul className="space-y-1.5">
                      {meeting.agenda.map((item, i) => (
                        <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-neutral-200 rounded-full"><div className="h-2 bg-primary-500 rounded-full" style={{ width: `${(meeting.attendees / meeting.maxAttendees) * 100}%` }} /></div>
                      <span className="text-xs text-neutral-500">{meeting.maxAttendees - meeting.attendees} spots left</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="btn-primary text-sm">RSVP</button>
                      {meeting.isVirtual && (
                        <Link href={`/call/preview?room=${encodeURIComponent(`ClubConnect-${meeting.club.replace(/\s+/g, "-")}-${meeting.id}`)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-sm font-semibold  hover:bg-green-600 transition-colors">
                          <Video size={14} /> Join Call
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center"><Calendar size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No meetings match your search.</p></div>
        )}
      </div>
    </div>
  );
}
