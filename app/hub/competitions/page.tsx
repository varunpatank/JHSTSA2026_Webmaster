"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import {
  Award, Calendar, CheckCircle, ChevronDown, Clock, ExternalLink,
  Filter, Globe, MapPin, Search, Shield, Star, Trophy, Users, Zap, Check,
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

interface Competition {
  id: string; name: string; organization: string; description: string; category: string;
  deadline: string; dates: string; location: string; locationType: "In-Person" | "Virtual" | "Hybrid";
  entryFee: string; prizes: string[]; teamSize: string; difficulty: string;
  featured: boolean; prepResources: { title: string; type: string }[];
}

const COMPETITIONS: Competition[] = [
  { id: "c1", name: "Washington State TSA Conference", organization: "Technology Student Association", description: "Compete in 40+ technology-focused events including coding, engineering, communication, and leadership challenges.", category: "STEM", deadline: "2026-03-20", dates: "April 10-12, 2026", location: "Bellevue Convention Center", locationType: "In-Person", entryFee: "$45/student", prizes: ["State Champion Trophies", "National Conference Qualifying"], teamSize: "Individual or Team (2-6)", difficulty: "All Levels", featured: true, prepResources: [{ title: "TSA Event Guide", type: "Guide" }, { title: "Past Competition Results", type: "Reference" }] },
  { id: "c2", name: "FIRST Robotics District Event", organization: "FIRST", description: "Design, build, and program a robot to compete in this year's challenge. Collaborate with mentors from Boeing and Microsoft.", category: "STEM", deadline: "2026-02-15", dates: "March 22-23, 2026", location: "Kent ShoWare Center", locationType: "In-Person", entryFee: "$5,000/team", prizes: ["District Championship Qualification", "Sponsor Awards"], teamSize: "Team (15-30)", difficulty: "Advanced", featured: true, prepResources: [{ title: "Robot Design Handbook", type: "Guide" }, { title: "Programming Tutorials", type: "Video" }] },
  { id: "c3", name: "Model UN Northwest Conference", organization: "UW Model UN", description: "Represent assigned countries and debate global issues in simulated UN committees.", category: "Academic", deadline: "2026-04-01", dates: "April 18-20, 2026", location: "University of Washington", locationType: "In-Person", entryFee: "$35/delegate", prizes: ["Best Delegate", "Outstanding Delegation", "Position Paper Awards"], teamSize: "Team (5-15)", difficulty: "Intermediate", featured: false, prepResources: [{ title: "Research Guide", type: "Guide" }, { title: "Position Paper Template", type: "Template" }] },
  { id: "c4", name: "National History Day", organization: "National History Day", description: "Create exhibits, documentaries, papers, or performances exploring historical topics.", category: "Academic", deadline: "2026-03-01", dates: "March 15, 2026 (Regional)", location: "Juanita HS", locationType: "In-Person", entryFee: "Free", prizes: ["Regional Winner advances to State", "National Competition"], teamSize: "Individual or Team (2-3)", difficulty: "Beginner-Friendly", featured: false, prepResources: [{ title: "Project Planning Guide", type: "Guide" }] },
  { id: "c5", name: "Science Olympiad Invitational", organization: "Science Olympiad", description: "Compete in 23 team events spanning life science, earth science, technology, and engineering.", category: "STEM", deadline: "2026-02-20", dates: "March 8, 2026", location: "Virtual & In-Person", locationType: "Hybrid", entryFee: "$100/team", prizes: ["Event Medals", "Overall Team Trophy"], teamSize: "Team (15)", difficulty: "Intermediate", featured: false, prepResources: [{ title: "Event Rules", type: "Reference" }, { title: "Study Guides", type: "Guide" }] },
  { id: "c6", name: "Debate State Qualifiers", organization: "NSDA", description: "Policy, Lincoln-Douglas, and Public Forum debate events for state tournament qualification.", category: "Academic", deadline: "2026-03-10", dates: "March 28-29, 2026", location: "Eastside Prep", locationType: "In-Person", entryFee: "$20/event", prizes: ["State Qualifier Bids", "Speaker Awards"], teamSize: "Individual or Pair", difficulty: "Advanced", featured: false, prepResources: [{ title: "Debate Prep Toolkit", type: "Guide" }] },
  { id: "c7", name: "Art Portfolio Showcase", organization: "Scholastic Art & Writing", description: "Submit original artwork for regional and national recognition.", category: "Arts", deadline: "2026-04-15", dates: "May 2026 (Exhibition)", location: "Seattle Art Museum", locationType: "In-Person", entryFee: "Free", prizes: ["Gold Key", "Silver Key", "Honorable Mention", "National Medals"], teamSize: "Individual", difficulty: "All Levels", featured: false, prepResources: [{ title: "Submission Guidelines", type: "Guide" }] },
  { id: "c8", name: "Environmental Innovation Challenge", organization: "Green Schools Alliance", description: "Develop creative solutions to local environmental problems. Present to a panel of judges.", category: "Service", deadline: "2026-04-05", dates: "April 26, 2026", location: "Zoom", locationType: "Virtual", entryFee: "Free", prizes: ["$500 Implementation Grant", "Mentorship from Green Earth Foundation"], teamSize: "Team (3-5)", difficulty: "Beginner-Friendly", featured: false, prepResources: [{ title: "Innovation Framework", type: "Template" }] },
];

const COMP_LS_KEY = "clubconnect_competitions_registered";

function loadRegistered(): Set<string> {
  try { const s = localStorage.getItem(COMP_LS_KEY); if (s) return new Set(JSON.parse(s)); } catch {}
  return new Set();
}

export default function CompetitionsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(() => loadRegistered());

  useEffect(() => { try { localStorage.setItem(COMP_LS_KEY, JSON.stringify([...registeredIds])); } catch {} }, [registeredIds]);

  function handleRegister(compId: string) {
    setRegisteredIds(prev => new Set(prev).add(compId));
  }

  const categories = ["All", ...Array.from(new Set(COMPETITIONS.map(c => c.category)))];
  const difficulties = ["All", "Beginner-Friendly", "Intermediate", "Advanced", "All Levels"];

  const filtered = COMPETITIONS.filter(c => {
    if (catFilter !== "All" && c.category !== catFilter) return false;
    if (diffFilter !== "All" && c.difficulty !== diffFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }
    return true;
  });

  const featured = filtered.filter(c => c.featured);
  const regular = filtered.filter(c => !c.featured);

  const deadlineSoon = COMPETITIONS.filter(c => {
    const d = new Date(c.deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-900 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-purple-200 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><Trophy size={36} /> Competitions Hub</h1>
          <p className="mt-3 max-w-2xl text-purple-100 text-lg">Browse upcoming competitions, register your team, and access preparation resources.</p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{COMPETITIONS.length}</p><p className="text-xs text-purple-200">Competitions</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{deadlineSoon}</p><p className="text-xs text-purple-200">Deadlines Soon</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{categories.length - 1}</p><p className="text-xs text-purple-200">Categories</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {}
        <div className="card p-5 grid sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search competitions..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="select-field">{categories.map(c => <option key={c}>{c}</option>)}</select>
          <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)} className="select-field">{difficulties.map(d => <option key={d}>{d}</option>)}</select>
        </div>

        {}
        {featured.length > 0 && (
          <Reveal>
            <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-3"><Star size={18} /> Featured Competitions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {featured.map(c => (
                <div key={c.id} className="card p-5 border-2 border-secondary-200 bg-gradient-to-br from-secondary-50/30 to-white ux-hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-700 font-bold">Featured</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{c.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.locationType === "Virtual" ? "bg-blue-100 text-blue-700" : c.locationType === "Hybrid" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>{c.locationType}</span>
                  </div>
                  <h3 className="font-bold text-primary-800 text-lg">{c.name}</h3>
                  <p className="text-xs text-neutral-500">{c.organization}</p>
                  <p className="text-sm text-neutral-600 mt-2">{c.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {c.dates}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {c.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> Deadline: {new Date(c.deadline).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {c.teamSize}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.prizes.map(p => <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">{p}</span>)}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Entry: {c.entryFee} · Difficulty: {c.difficulty}</p>
                  <button onClick={() => handleRegister(c.id)} disabled={registeredIds.has(c.id)} className={`mt-3 w-full py-2 text-sm font-bold transition-colors ${registeredIds.has(c.id) ? "bg-green-100 text-green-700 cursor-default" : "bg-primary-900 text-white hover:bg-primary-900"}`}>{registeredIds.has(c.id) ? <span className="flex items-center justify-center gap-1"><Check size={14} /> Registered</span> : "Register Interest"}</button>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {}
        <Reveal>
          <h2 className="text-lg font-heading font-bold text-primary-600 mb-3">{catFilter === "All" ? "All" : catFilter} Competitions ({filtered.length})</h2>
          <div className="space-y-3">
            {(featured.length > 0 ? regular : filtered).map(c => (
              <div key={c.id} className="card overflow-hidden ux-hover-lift-sm">
                <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className="w-full p-5 text-left hover:bg-primary-50/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{c.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.locationType === "Virtual" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{c.locationType}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{c.difficulty}</span>
                      </div>
                      <h3 className="font-bold text-primary-800">{c.name}</h3>
                      <p className="text-xs text-neutral-500">{c.organization} · Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
                    </div>
                    <ChevronDown size={18} className={`text-neutral-400 shrink-0 mt-1 transition-transform ${expandedId === c.id ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expandedId === c.id && (
                  <div className="px-5 pb-5 border-t border-neutral-100 space-y-3">
                    <p className="text-sm text-neutral-700 mt-3">{c.description}</p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2"><Calendar size={14} className="text-primary-400" /> <span><strong>Dates:</strong> {c.dates}</span></div>
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-primary-400" /> <span><strong>Location:</strong> {c.location}</span></div>
                      <div className="flex items-center gap-2"><Users size={14} className="text-primary-400" /> <span><strong>Team Size:</strong> {c.teamSize}</span></div>
                      <div className="flex items-center gap-2"><Zap size={14} className="text-primary-400" /> <span><strong>Entry Fee:</strong> {c.entryFee}</span></div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">Prizes</h4>
                      <div className="flex flex-wrap gap-1">{c.prizes.map(p => <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">{p}</span>)}</div>
                    </div>
                    {c.prepResources.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">Prep Resources</h4>
                        <div className="flex flex-wrap gap-2">{c.prepResources.map(r => <span key={r.title} className="text-xs px-2 py-1  bg-primary-50 text-primary-600">{r.title} ({r.type})</span>)}</div>
                      </div>
                    )}
                    <button onClick={() => handleRegister(c.id)} disabled={registeredIds.has(c.id)} className={`mt-2 px-4 py-2 text-sm font-bold transition-colors ${registeredIds.has(c.id) ? "bg-green-100 text-green-700 cursor-default" : "bg-primary-900 text-white hover:bg-primary-900"}`}>{registeredIds.has(c.id) ? <span className="flex items-center justify-center gap-1"><Check size={14} /> Registered</span> : "Register Interest"}</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 && (
          <div className="card p-8 text-center"><Trophy size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No competitions match your filters.</p></div>
        )}
      </div>
    </div>
  );
}
