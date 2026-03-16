"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import {
  ArrowRight, Calendar, CheckCircle, GitMerge, Handshake, Search, Star, Tag, Users, Zap
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

interface Collaboration {
  id: string; title: string; description: string; type: "event" | "project" | "fundraiser" | "competition" | "workshop";
  clubs: string[]; status: "seeking-partners" | "active" | "completed"; spots: number; filled: number;
  timeline: string; skills: string[]; contact: string; postedDate: string;
}

const COLLABORATIONS: Collaboration[] = [
  { id: "cl1", title: "STEM Fair Showcase", description: "Joint robotics demonstration and science experiments for elementary school outreach. Need clubs for booth design, demonstrations, and student mentoring.", type: "event", clubs: ["Robotics Club", "Science Olympiad"], status: "seeking-partners", spots: 4, filled: 2, timeline: "March 15-16, 2026", skills: ["Teaching", "Presentation", "STEM Knowledge"], contact: "robotics@school.edu", postedDate: "2026-01-15" },
  { id: "cl2", title: "Spring Carnival Fundraiser", description: "Annual school-wide carnival with club-run booths, food vendors, and entertainment. All proceeds split between participating clubs.", type: "fundraiser", clubs: ["Student Council", "Key Club", "Art Club"], status: "active", spots: 10, filled: 6, timeline: "May 3, 2026", skills: ["Event Planning", "Food Service", "Entertainment", "Marketing"], contact: "studentcouncil@school.edu", postedDate: "2026-01-10" },
  { id: "cl3", title: "Environmental Documentary", description: "Create a short documentary about local environmental issues. Need writers, videographers, researchers, and environmental science students.", type: "project", clubs: ["Environmental Club", "Film Club"], status: "seeking-partners", spots: 3, filled: 2, timeline: "Feb-April 2026", skills: ["Video Production", "Writing", "Research", "Science"], contact: "enviroclub@school.edu", postedDate: "2026-01-20" },
  { id: "cl4", title: "Hackathon for Good", description: "24-hour coding event focused on building apps for community nonprofits. Need designers, coders, and project managers.", type: "competition", clubs: ["CS Club"], status: "seeking-partners", spots: 5, filled: 1, timeline: "April 12, 2026", skills: ["Programming", "UI/UX Design", "Project Management"], contact: "csclub@school.edu", postedDate: "2026-01-22" },
  { id: "cl5", title: "Cultural Heritage Night", description: "Evening showcase of food, performances, and presentations from diverse cultural backgrounds. Looking for performance groups and cultural clubs.", type: "event", clubs: ["Cultural Exchange Club", "Drama Club", "Dance Team"], status: "active", spots: 8, filled: 5, timeline: "March 28, 2026", skills: ["Performance", "Cooking", "Presentation", "Organization"], contact: "culture@school.edu", postedDate: "2026-01-08" },
  { id: "cl6", title: "Mental Health Awareness Week", description: "Week-long campaign with workshops, peer counseling pop-ups, and resource distribution. Need clubs to support various initiatives.", type: "workshop", clubs: ["Psychology Club", "Peer Counselors"], status: "seeking-partners", spots: 6, filled: 2, timeline: "March 3-7, 2026", skills: ["Communication", "Counseling", "Graphic Design", "Social Media"], contact: "wellness@school.edu", postedDate: "2026-01-18" },
];

const TYPE_COLORS: Record<string, string> = {
  event: "bg-blue-100 text-blue-700", project: "bg-purple-100 text-purple-700",
  fundraiser: "bg-green-100 text-green-700", competition: "bg-red-100 text-red-700",
  workshop: "bg-yellow-100 text-yellow-700",
};
const STATUS_COLORS: Record<string, { label: string; color: string }> = {
  "seeking-partners": { label: "Seeking Partners", color: "bg-orange-100 text-orange-700" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  completed: { label: "Completed", color: "bg-neutral-100 text-neutral-500" },
};

export default function CollaboratePage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const types = ["All", "event", "project", "fundraiser", "competition", "workshop"];

  const filtered = COLLABORATIONS.filter(c => {
    if (typeFilter !== "All" && c.type !== typeFilter) return false;
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.clubs.some(cl => cl.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-primary-600 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-indigo-200 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><Handshake size={36} /> Collaboration Finder</h1>
          <p className="mt-3 max-w-2xl text-indigo-100 text-lg">Find cross-club partnerships, joint events, and collaborative projects to amplify your impact.</p>
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{COLLABORATIONS.length}</p><p className="text-xs text-indigo-100">Opportunities</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{COLLABORATIONS.filter(c => c.status === "seeking-partners").length}</p><p className="text-xs text-indigo-100">Seeking Partners</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{COLLABORATIONS.reduce((s, c) => s + c.clubs.length, 0)}</p><p className="text-xs text-indigo-100">Clubs Involved</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick Benefits */}
        <Reveal>
          <div className="grid sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: <Users size={18} />, title: "Expand Your Network", desc: "Meet students from other clubs" },
              { icon: <Zap size={18} />, title: "Bigger Impact", desc: "Combined resources go further" },
              { icon: <Star size={18} />, title: "Build Your Resume", desc: "Cross-functional experience" },
              { icon: <GitMerge size={18} />, title: "New Perspectives", desc: "Diverse approaches to problems" },
            ].map(b => (
              <div key={b.title} className="card p-3 text-center">
                <div className="text-indigo-500 flex justify-center mb-1">{b.icon}</div>
                <h4 className="font-bold text-primary-700 text-xs">{b.title}</h4>
                <p className="text-[11px] text-neutral-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Filters */}
        <div className="card p-4 mb-6 grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search collaborations..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="select-field text-sm capitalize">{types.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field text-sm">
            <option value="All">All Status</option>
            {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Collaboration Cards */}
        <div className="space-y-4">
          {filtered.map(collab => (
            <Reveal key={collab.id}>
              <div className="card p-5 ux-hover-lift-sm">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-semibold ${TYPE_COLORS[collab.type]}`}>{collab.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[collab.status].color}`}>{STATUS_COLORS[collab.status].label}</span>
                </div>
                <h3 className="font-bold text-primary-800 text-lg">{collab.title}</h3>
                <p className="text-sm text-neutral-600 mt-1">{collab.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-neutral-600 font-semibold">Involved:</span>
                  {collab.clubs.map(cl => <span key={cl} className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">{cl}</span>)}
                </div>

                <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-neutral-600">
                  <span className="flex items-center gap-1"><Calendar size={14} className="text-primary-400" /> {collab.timeline}</span>
                  <span className="flex items-center gap-1"><Users size={14} className="text-primary-400" /> {collab.filled}/{collab.spots} clubs joined</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-2 bg-neutral-200 rounded-full"><div className="h-2 bg-indigo-500 rounded-full transition-all" style={{ width: `${(collab.filled / collab.spots) * 100}%` }} /></div>
                  <p className="text-xs text-neutral-400 mt-1">{collab.spots - collab.filled} spots remaining</p>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {collab.skills.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{s}</span>)}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="text-xs text-neutral-400">Posted {new Date(collab.postedDate).toLocaleDateString()}</span>
                  {collab.status === "seeking-partners" && <button className="btn-primary text-sm px-4 py-1.5">Express Interest</button>}
                  {collab.status === "active" && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Partnership Active</span>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center"><Handshake size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No collaborations match your filters.</p></div>
        )}
      </div>
    </div>
  );
}
