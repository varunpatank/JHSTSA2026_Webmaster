"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Award, BookOpen, Briefcase, Calendar, CheckCircle, ChevronDown, Clock, GraduationCap,
  Heart, Loader2, Mail, MapPin, MessageCircle, Search, Star, User, Users
} from "lucide-react";
import { supabase, mentorsApi } from "@/lib/api";

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

interface Mentor {
  id: string; name: string; title: string; expertise: string[]; bio: string;
  availability: string; avatar: string; category: string;
  yearsExperience: number; sessionsDone: number; rating: number;
  offering: string[];
}

const SEED_MENTORS: Mentor[] = [
  { id: "m1", name: "Dr. Sarah Chen", title: "Senior Software Engineer at Microsoft", expertise: ["Software Development", "AI/ML", "Career Planning"], bio: "15+ years in tech. Stanford CS grad. Passionate about mentoring the next generation of engineers. Has mentored 20+ students into FAANG internships.", availability: "Biweekly · Tuesdays", avatar: "SC", category: "STEM", yearsExperience: 15, sessionsDone: 48, rating: 4.9, offering: ["1-on-1 Sessions", "Resume Review", "Mock Interviews"] },
  { id: "m2", name: "Prof. James Rodriguez", title: "Political Science Professor, UW", expertise: ["Model UN", "Public Policy", "Debate", "Research"], bio: "Former UN consultant. Coaches college Model UN teams. Advises on college applications and political science pathways.", availability: "Monthly · Thursdays", avatar: "JR", category: "Academic", yearsExperience: 12, sessionsDone: 35, rating: 4.8, offering: ["Group Workshops", "College App Review", "Research Mentorship"] },
  { id: "m3", name: "Maria Gonzalez", title: "Community Organizer, United Way", expertise: ["Community Service", "Nonprofit Management", "Grant Writing", "Fundraising"], bio: "Managed $2M+ in community grants. Helps students turn service ideas into sustainable programs. 10 years in nonprofit sector.", availability: "Weekly · Mondays", avatar: "MG", category: "Service", yearsExperience: 10, sessionsDone: 62, rating: 4.9, offering: ["1-on-1 Sessions", "Grant Proposals", "Project Planning"] },
  { id: "m4", name: "David Park", title: "Mechanical Engineer, Boeing", expertise: ["Robotics", "Engineering Design", "CAD", "Manufacturing"], bio: "Lead engineer on 787 Dreamliner systems. FIRST Robotics mentor since 2015. Loves helping students with hands-on engineering projects and engineering career pathways.", availability: "Biweekly · Saturdays", avatar: "DP", category: "STEM", yearsExperience: 18, sessionsDone: 40, rating: 4.7, offering: ["1-on-1 Sessions", "Project Mentoring", "Career Guidance"] },
  { id: "m5", name: "Amanda Liu", title: "Graphic Designer & Illustrator", expertise: ["Visual Arts", "Digital Design", "Portfolio Building", "Branding"], bio: "Freelance designer with clients including Nike and REI. RISD graduate. Helps students build creative portfolios for college and career.", availability: "Biweekly · Wednesdays", avatar: "AL", category: "Arts", yearsExperience: 8, sessionsDone: 25, rating: 4.8, offering: ["Portfolio Review", "Design Workshops", "1-on-1 Sessions"] },
  { id: "m6", name: "Robert Tanaka", title: "Investment Analyst, BlackRock", expertise: ["Finance", "Economics", "Data Analysis", "Business Strategy"], bio: "Harvard MBA. Manages portfolios and runs financial literacy workshops. Mentors students interested in business and economics.", availability: "Monthly · Fridays", avatar: "RT", category: "Academic", yearsExperience: 10, sessionsDone: 18, rating: 4.6, offering: ["Career Workshops", "Financial Modeling", "College Guidance"] },
];

const MENTORS_LS_KEY = "clubconnect_mentors";
const MENTOR_REQ_LS_KEY = "clubconnect_mentor_requested";

function loadMentors(): Mentor[] {
  try { const s = localStorage.getItem(MENTORS_LS_KEY); if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) return p; } } catch {}
  return SEED_MENTORS;
}
function loadRequestedIds(): Set<string> {
  try { const s = localStorage.getItem(MENTOR_REQ_LS_KEY); if (s) return new Set(JSON.parse(s)); } catch {}
  return new Set();
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>(() => loadMentors());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(() => loadRequestedIds());
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => { try { localStorage.setItem(MENTORS_LS_KEY, JSON.stringify(mentors)); } catch {} }, [mentors]);
  useEffect(() => { try { localStorage.setItem(MENTOR_REQ_LS_KEY, JSON.stringify([...requestedIds])); } catch {} }, [requestedIds]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled && user) setCurrentUserId(user.id);
      try {
        const { data } = await mentorsApi.getAll();
        if (!cancelled && data && data.length > 0) {
          const dbMentors: Mentor[] = data.map((d: any) => ({
            id: d.id, name: d.name || "Mentor", title: d.title || "",
            expertise: d.expertise || [], bio: d.bio || "",
            availability: d.availability || "TBD",
            avatar: (d.name || "M").split(" ").map((n: string) => n[0]).join("").slice(0, 2),
            category: d.category || "General",
            yearsExperience: d.years_experience || 0, sessionsDone: d.sessions_done || 0,
            rating: d.rating || 5.0, offering: d.offering || [],
          }));
          setMentors(prev => {
            const ids = new Set(prev.map(m => m.id));
            const newFromDb = dbMentors.filter(m => !ids.has(m.id));
            const seedIds = new Set(SEED_MENTORS.map(s => s.id));
            const localOnly = prev.filter(m => !seedIds.has(m.id) && !dbMentors.some(d => d.id === m.id));
            return [...newFromDb, ...localOnly, ...SEED_MENTORS];
          });
        }
      } catch (e) { console.error("DB load failed, using local:", e); }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleRequestMentorship(mentorId: string) {
    if (requestingId) return;
    setRequestingId(mentorId);
    try {
      if (currentUserId) await mentorsApi.requestMentor({ mentor_id: mentorId, mentee_id: currentUserId, message: "I'd like to connect for mentorship." });
    } catch (e) { console.error("DB request failed, keeping locally:", e); }
    setRequestedIds(prev => new Set(prev).add(mentorId));
    setRequestingId(null);
  }

  const categories = ["All", ...Array.from(new Set(mentors.map(m => m.category)))];

  const filtered = mentors.filter(m => {
    if (category !== "All" && m.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.expertise.some(e => e.toLowerCase().includes(q)) || m.title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-600 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-teal-100 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><GraduationCap size={36} /> Mentor Network</h1>
          <p className="mt-3 max-w-2xl text-teal-50 text-lg">Connect with experienced professionals and alumni for guidance, skill development, and career mentorship.</p>
          <div className="mt-6 grid grid-cols-4 gap-3 max-w-lg">
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{mentors.length}</p><p className="text-xs text-teal-100">Mentors</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{mentors.reduce((s, m) => s + m.sessionsDone, 0)}</p><p className="text-xs text-teal-100">Sessions</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{(mentors.reduce((s, m) => s + m.rating, 0) / mentors.length).toFixed(1)}</p><p className="text-xs text-teal-100">Avg Rating</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{categories.length - 1}</p><p className="text-xs text-teal-100">Fields</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Search size={20} />, title: "1. Browse Mentors", desc: "Find mentors in your area of interest" },
              { icon: <Calendar size={20} />, title: "2. Request a Session", desc: "Send a mentorship request with your goals" },
              { icon: <MessageCircle size={20} />, title: "3. Connect & Grow", desc: "Meet regularly and develop your skills" },
            ].map(step => (
              <div key={step.title} className="card p-4 text-center">
                <div className="text-primary-500 mx-auto flex justify-center mb-2">{step.icon}</div>
                <h3 className="font-bold text-primary-700 text-sm">{step.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search mentors, expertise..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="select-field text-sm w-auto">{categories.map(c => <option key={c}>{c}</option>)}</select>
        </div>

        {}
        <div className="space-y-4">
          {filtered.map(mentor => (
            <Reveal key={mentor.id}>
              <div className="card overflow-hidden ux-hover-lift-sm">
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="w-16 h-16  bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0">{mentor.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{mentor.category}</span>
                        <span className="text-xs text-yellow-600 flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {mentor.rating}</span>
                        <span className="text-xs text-neutral-400">{mentor.sessionsDone} sessions</span>
                      </div>
                      <h3 className="font-bold text-primary-800 text-lg">{mentor.name}</h3>
                      <p className="text-sm text-neutral-500">{mentor.title}</p>
                      <p className="text-sm text-neutral-600 mt-2">{mentor.bio}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mentor.expertise.map(e => <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">{e}</span>)}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><Clock size={12} /> {mentor.availability}</span>
                        <span className="flex items-center gap-1"><Briefcase size={12} /> {mentor.yearsExperience}+ years experience</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {mentor.offering.map(o => <span key={o} className="text-xs px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-700 border border-secondary-100">{o}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                  <span className="text-xs text-neutral-400">{mentor.yearsExperience}+ years in field</span>
                  {requestedIds.has(mentor.id) ? (
                    <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Requested</span>
                  ) : (
                    <button onClick={() => handleRequestMentorship(mentor.id)} disabled={!currentUserId || requestingId === mentor.id} className="btn-primary text-sm px-4 py-1.5 disabled:opacity-50 flex items-center gap-1">
                      {requestingId === mentor.id ? <><Loader2 size={13} className="animate-spin" /> Sending…</> : "Request Mentorship"}
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center"><GraduationCap size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No mentors match your search.</p></div>
        )}
      </div>
    </div>
  );
}
