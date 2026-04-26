"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import { supabase } from "@/lib/api";
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

const SEED_MEETINGS: Meeting[] = [
  { id: "mt1", title: "Weekly Build Session", club: "Robotics Club", date: "2026-03-05", time: "3:30 PM - 5:30 PM", location: "Room 204 (Engineering Lab)", type: "regular", agenda: ["Review build progress", "Work on autonomous programming", "Test drivetrain modifications"], attendees: 22, maxAttendees: 30, isVirtual: false, status: "upcoming" },
  { id: "mt2", title: "Conference Prep Meeting", club: "Model United Nations", date: "2026-03-07", time: "3:30 PM - 4:30 PM", location: "Room 115", type: "special", agenda: ["Assign committee placements", "Distribution of position paper guidelines", "Practice caucusing techniques", "Review conference logistics"], attendees: 18, maxAttendees: 25, isVirtual: false, status: "upcoming" },
  { id: "mt3", title: "Open Studio & Critique", club: "Art Club", date: "2026-03-10", time: "3:00 PM - 5:00 PM", location: "Art Room B210", type: "workshop", agenda: ["Open work time", "Group critique circle", "Spring Showcase planning"], attendees: 15, maxAttendees: 20, isVirtual: false, status: "upcoming" },
  { id: "mt4", title: "Spring Service Planning", club: "Community Service Club", date: "2026-03-06", time: "12:00 PM - 12:30 PM", location: "Room 108", type: "planning", agenda: ["Review upcoming service opportunities", "Sign up for beach cleanup", "Discuss Earth Day event", "Volunteer hour tracking reminder"], attendees: 12, maxAttendees: 35, isVirtual: false, status: "upcoming" },
  { id: "mt5", title: "Coding Workshop: APIs", club: "CS Club", date: "2026-03-08", time: "3:30 PM - 5:00 PM", location: "Computer Lab A", type: "workshop", agenda: ["REST API fundamentals", "Hands-on: build a weather app", "Q&A and debugging help"], attendees: 20, maxAttendees: 25, isVirtual: false, status: "upcoming" },
  { id: "mt6", title: "Rehearsal: Into the Woods", club: "Drama Club", date: "2026-03-09", time: "4:00 PM - 6:00 PM", location: "Auditorium", type: "regular", agenda: ["Act 2 scene blocking", "Musical rehearsal with orchestra", "Costume fitting (select cast)"], attendees: 35, maxAttendees: 60, isVirtual: false, status: "upcoming" },
  { id: "mt7", title: "Virtual Study Session", club: "Science Olympiad", date: "2026-03-06", time: "7:00 PM - 8:30 PM", location: "Google Meet", type: "workshop", agenda: ["Anatomy & Physiology review", "Practice test walkthrough", "Strategy for invitational"], attendees: 14, maxAttendees: 15, isVirtual: true, status: "upcoming" },
  { id: "mt8", title: "Officer Transition Planning", club: "Student Council", date: "2026-03-11", time: "3:30 PM - 4:15 PM", location: "Room 102", type: "planning", agenda: ["Review election timeline", "Discuss transition documents", "Plan candidate info session"], attendees: 8, maxAttendees: 12, isVirtual: false, status: "upcoming" },
];

const MEETINGS_LS_KEY = "clubconnect_meetings";
const RSVPS_LS_KEY = "clubconnect_meetings_rsvps";

function loadMeetings(): Meeting[] {
  try {
    const raw = localStorage.getItem(MEETINGS_LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_MEETINGS;
}

function loadRsvps(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(RSVPS_LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

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
  const [meetings, setMeetings] = useState<Meeting[]>(() => loadMeetings());
  const [rsvps, setRsvps] = useState<Record<string, boolean>>(() => loadRsvps());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled && user) setCurrentUserId(user.id);
    })();
    return () => { cancelled = true; };
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formClub, setFormClub] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formType, setFormType] = useState<Meeting["type"]>("regular");
  const [formAgenda, setFormAgenda] = useState("");
  const [formMaxAttendees, setFormMaxAttendees] = useState("30");
  const [formVirtual, setFormVirtual] = useState(false);

  useEffect(() => { try { localStorage.setItem(MEETINGS_LS_KEY, JSON.stringify(meetings)); } catch {} }, [meetings]);
  useEffect(() => { try { localStorage.setItem(RSVPS_LS_KEY, JSON.stringify(rsvps)); } catch {} }, [rsvps]);

  function toggleRsvp(id: string) {
    if (!currentUserId) { alert("Please sign in to RSVP."); return; }
    setRsvps(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleCreateMeeting(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) { alert("Please sign in to create a meeting."); return; }
    if (!formTitle.trim() || !formClub.trim() || !formDate || !formStartTime) return;
    const newMeeting: Meeting = {
      id: `local-${Date.now()}`,
      title: formTitle.trim(),
      club: formClub.trim(),
      date: formDate,
      time: formEndTime ? `${formStartTime} - ${formEndTime}` : formStartTime,
      location: formLocation.trim() || "TBD",
      type: formType,
      agenda: formAgenda.split("\n").map(a => a.trim()).filter(Boolean),
      attendees: 0,
      maxAttendees: parseInt(formMaxAttendees) || 30,
      isVirtual: formVirtual,
      status: "upcoming",
    };
    setMeetings(prev => [newMeeting, ...prev]);
    setFormTitle(""); setFormClub(""); setFormDate(""); setFormStartTime(""); setFormEndTime("");
    setFormLocation(""); setFormType("regular"); setFormAgenda(""); setFormMaxAttendees("30"); setFormVirtual(false);
    setShowForm(false);
  }

  const types = ["All", "regular", "special", "workshop", "planning"];

  const filtered = meetings.filter(m => {
    if (typeFilter !== "All" && m.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.club.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-neutral-100 min-h-screen">
      <HeroSection
        title="Meetings Schedule"
        icon={<Calendar size={36} />}
        description="View upcoming club meetings, RSVPs, and agendas all in one place."
        actions={
          <>
            <button onClick={() => setShowForm(!showForm)} className="btn-secondary inline-flex items-center gap-2">
              <Plus size={16} /> Create Meeting
            </button>
            <Link href="/call/preview" className="btn-secondary inline-flex items-center gap-2">
              <PhoneCall size={16} /> Start Quick Call
            </Link>
          </>
        }
        stats={[
          { label: "Total", value: meetings.length },
          { label: "Virtual", value: meetings.filter(m => m.isVirtual).length },
          { label: "Types", value: types.length - 1 },
        ]}
        statsClassName="sm:grid-cols-3 max-w-lg mx-auto"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {showForm && (
          <Reveal>
            <form onSubmit={handleCreateMeeting} className="card p-6 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-primary-700">Create New Meeting</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600"><Plus size={18} className="rotate-45" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Meeting Title *</label>
                  <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Weekly Club Meeting" className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Club Name *</label>
                  <input type="text" value={formClub} onChange={e => setFormClub(e.target.value)} placeholder="e.g. Robotics Club" className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Date *</label>
                  <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1">Start Time *</label>
                    <input type="time" value={formStartTime} onChange={e => setFormStartTime(e.target.value)} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1">End Time</label>
                    <input type="time" value={formEndTime} onChange={e => setFormEndTime(e.target.value)} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">Location</label>
                  <input type="text" value={formLocation} onChange={e => setFormLocation(e.target.value)} placeholder="e.g. Room 204" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1">Type</label>
                    <select value={formType} onChange={e => setFormType(e.target.value as Meeting["type"])} className="select-field">
                      <option value="regular">Regular</option>
                      <option value="special">Special</option>
                      <option value="workshop">Workshop</option>
                      <option value="planning">Planning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1">Max Attendees</label>
                    <input type="number" min="1" value={formMaxAttendees} onChange={e => setFormMaxAttendees(e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">Agenda Items (one per line)</label>
                <textarea value={formAgenda} onChange={e => setFormAgenda(e.target.value)} rows={3} placeholder="Item 1&#10;Item 2&#10;Item 3" className="input-field" />
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input type="checkbox" checked={formVirtual} onChange={e => setFormVirtual(e.target.checked)} className="accent-primary-600" />
                Virtual meeting (online)
              </label>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary inline-flex items-center gap-2"><Plus size={14} /> Create Meeting</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700">Cancel</button>
              </div>
            </form>
          </Reveal>
        )}

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
                      <button onClick={() => toggleRsvp(meeting.id)} className={`text-sm font-semibold px-4 py-1.5 transition-colors ${rsvps[meeting.id] ? "bg-green-600 hover:bg-green-700 text-white" : "btn-primary"}`}>
                        {rsvps[meeting.id] ? <><CheckCircle size={14} className="inline mr-1" />Going</> : "RSVP"}
                      </button>
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
    </div>
  );
}
