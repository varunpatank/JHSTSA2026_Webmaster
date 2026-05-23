"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Award, Calendar, CheckCircle, ChevronDown, Edit3, Flag, Plus,
  Target, TrendingUp, Trophy, Trash2, Zap
} from "lucide-react";
import StageBannerPattern from "@/components/StageBannerPattern";
import { supabase, goalsApi } from "@/lib/api";

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

interface Goal {
  id: string; title: string; club: string; category: string; description: string;
  targetDate: string; progress: number; milestones: { title: string; done: boolean }[];
  priority: "high" | "medium" | "low"; status: "on-track" | "at-risk" | "behind" | "completed";
}

const LS_KEY = "clubconnect_goals";

const SEED_GOALS: Goal[] = [
  { id: "g1", title: "Recruit 15 new members by March", club: "Robotics Club", category: "Recruitment", description: "Increase membership through demos, social media campaigns, and freshman outreach events.", targetDate: "2026-03-31", progress: 73, milestones: [{ title: "Create recruitment flyers", done: true }, { title: "Host demo at activities fair", done: true }, { title: "Run social media campaign", done: true }, { title: "Hold open build sessions", done: false }], priority: "high", status: "on-track" },
  { id: "g2", title: "Raise $2,000 for state competition", club: "Model UN", category: "Fundraising", description: "Fund delegate registration, travel, and accommodation for 10 delegates to the state conference.", targetDate: "2026-03-20", progress: 85, milestones: [{ title: "Bake sale ($450)", done: true }, { title: "Sponsor outreach ($800)", done: true }, { title: "Car wash ($350)", done: true }, { title: "Online donation campaign ($400)", done: false }], priority: "high", status: "on-track" },
  { id: "g3", title: "Complete 500 community service hours", club: "Community Service Club", category: "Service", description: "Collective goal across all members. Track hours through individual service logs and group events.", targetDate: "2026-05-30", progress: 62, milestones: [{ title: "Fall food drive (120 hrs)", done: true }, { title: "Holiday toy drive (80 hrs)", done: true }, { title: "Park cleanup series (60 hrs)", done: true }, { title: "Spring tutoring program", done: false }, { title: "Year-end service day", done: false }], priority: "medium", status: "on-track" },
  { id: "g4", title: "Win best overall at Spring Art Showcase", club: "Art Club", category: "Competitions", description: "Prepare a cohesive collection of 20+ pieces representing diverse mediums and student artists.", targetDate: "2026-04-15", progress: 45, milestones: [{ title: "Select theme and artists", done: true }, { title: "Complete 10 pieces", done: true }, { title: "Complete remaining 10 pieces", done: false }, { title: "Arrange gallery layout", done: false }, { title: "Submit showcase application", done: false }], priority: "medium", status: "at-risk" },
  { id: "g5", title: "Build and program competition robot", club: "Robotics Club", category: "Competitions", description: "Design, build, and program the competition robot for the FIRST Robotics district event.", targetDate: "2026-03-22", progress: 55, milestones: [{ title: "Design phase complete", done: true }, { title: "Chassis and drivetrain built", done: true }, { title: "Mechanism prototyping", done: false }, { title: "Programming and testing", done: false }, { title: "Driver practice", done: false }], priority: "high", status: "behind" },
  { id: "g6", title: "Launch school podcast", club: "Media Club", category: "Projects", description: "Produce and release the first 4 episodes of a student-run school podcast.", targetDate: "2026-04-01", progress: 25, milestones: [{ title: "Choose format and name", done: true }, { title: "Set up recording equipment", done: false }, { title: "Record pilot episode", done: false }, { title: "Publish first 4 episodes", done: false }], priority: "low", status: "behind" },
  { id: "g7", title: "Establish mentorship program", club: "CS Club", category: "Programs", description: "Pair experienced coders with beginners for weekly 1-on-1 learning sessions.", targetDate: "2026-02-28", progress: 100, milestones: [{ title: "Recruit mentors", done: true }, { title: "Create curriculum", done: true }, { title: "Match mentor-mentee pairs", done: true }, { title: "Launch first sessions", done: true }], priority: "medium", status: "completed" },
];

const STATUS_COLORS: Record<string, { label: string; bg: string; text: string }> = {
  "on-track": { label: "On Track", bg: "bg-green-100", text: "text-green-700" },
  "at-risk": { label: "At Risk", bg: "bg-yellow-100", text: "text-yellow-700" },
  behind: { label: "Behind", bg: "bg-red-100", text: "text-red-700" },
  completed: { label: "Completed", bg: "bg-blue-100", text: "text-blue-700" },
};

const PRIORITY_COLORS: Record<string, string> = { high: "text-red-600", medium: "text-yellow-600", low: "text-neutral-400" };

function loadGoals(): Goal[] {
  if (typeof window === "undefined") return SEED_GOALS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Goal[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return SEED_GOALS;
}

function saveGoals(goals: Goal[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(goals)); } catch {}
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(SEED_GOALS);
  const [tab, setTab] = useState<"active" | "completed" | "insights">("active");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClub, setNewClub] = useState("");
  const [newCategory, setNewCategory] = useState("Recruitment");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Try loading from DB first
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (cancelled) return;
        if (user) {
          setUserId(user.id);
          const { data } = await goalsApi.getByUser(user.id);
          if (!cancelled && data && data.length > 0) {
            setGoals(data.map((row: any) => ({
              id: row.id,
              title: row.title,
              club: row.club,
              category: row.category,
              description: row.description,
              targetDate: row.target_date ?? "",
              progress: row.progress,
              milestones: Array.isArray(row.milestones) ? row.milestones : [],
              priority: row.priority as Goal["priority"],
              status: row.status as Goal["status"],
            })));
            return;
          }
        }
      } catch {}
      // Fall back to localStorage / seed data
      if (!cancelled) setGoals(loadGoals());
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const persist = useCallback((next: Goal[]) => {
    setGoals(next);
    saveGoals(next);
  }, []);

  const handleCreateGoal = useCallback(async () => {
    if (!newTitle.trim() || !newClub.trim()) return;
    const targetDate = newDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
    let newId = `g-${Date.now()}`;

    if (userId) {
      try {
        const { data } = await goalsApi.create({
          user_id: userId,
          title: newTitle.trim(),
          club: newClub.trim(),
          category: newCategory,
          description: newDesc.trim(),
          target_date: targetDate,
          progress: 0,
          milestones: [],
          priority: newPriority,
          status: "on-track",
        });
        if (data?.id) newId = data.id;
      } catch {}
    }

    const goal: Goal = {
      id: newId, title: newTitle.trim(), club: newClub.trim(),
      category: newCategory, description: newDesc.trim(),
      targetDate: targetDate,
      progress: 0, milestones: [], priority: newPriority, status: "on-track",
    };
    persist([goal, ...goals]);
    setNewTitle(""); setNewClub(""); setNewDesc(""); setNewDate(""); setShowNew(false);
  }, [newTitle, newClub, newCategory, newDate, newDesc, newPriority, goals, persist, userId]);

  const toggleMilestone = useCallback((goalId: string, mIdx: number) => {
    const next = goals.map(g => {
      if (g.id !== goalId) return g;
      const milestones = g.milestones.map((m, i) => i === mIdx ? { ...m, done: !m.done } : m);
      const doneCount = milestones.filter(m => m.done).length;
      const progress = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : g.progress;
      const status = progress >= 100 ? "completed" as const : g.status;
      return { ...g, milestones, progress, status };
    });
    persist(next);
    if (userId) {
      const updated = next.find(g => g.id === goalId);
      if (updated) {
        void (async () => { try {
          await goalsApi.update(goalId, {
            milestones: updated.milestones,
            progress: updated.progress,
            status: updated.status,
          });
        } catch {} })();
      }
    }
  }, [goals, persist, userId]);

  const deleteGoal = useCallback((goalId: string) => {
    persist(goals.filter(g => g.id !== goalId));
    if (userId) void (async () => { try { await goalsApi.delete(goalId); } catch {} })();
  }, [goals, persist, userId]);

  const active = goals.filter(g => g.status !== "completed");
  const completed = goals.filter(g => g.status === "completed");
  const avgProgress = Math.round(active.reduce((s, g) => s + g.progress, 0) / (active.length || 1));
  const atRisk = active.filter(g => g.status === "at-risk" || g.status === "behind").length;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative overflow-hidden text-white border-b-4 border-blue-300" style={{ background: "#2563eb" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 19px)" }}
        />
        <StageBannerPattern patternId="goals-tool-banner-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 relative z-10">
          <Link href="/hub" className="text-sm text-white/90 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-heading font-bold flex items-start gap-3 drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]"><Target size={28} className="sm:w-9 sm:h-9 shrink-0" /> Goal Tracker</h1>
          <p className="mt-3 max-w-2xl text-white/90 text-lg">Set club goals, track milestones, and celebrate achievements together.</p>
          <div className="mt-6 grid grid-cols-4 gap-3 max-w-lg">
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{goals.length}</p><p className="text-xs text-white/85">Total Goals</p></div>
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{avgProgress}%</p><p className="text-xs text-white/85">Avg Progress</p></div>
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{completed.length}</p><p className="text-xs text-white/85">Completed</p></div>
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{atRisk}</p><p className="text-xs text-white/85">At Risk</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["active", "completed", "insights"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2  text-sm font-semibold transition-all ${tab === t ? "bg-primary-900 text-white" : "bg-white text-neutral-600 hover:bg-primary-50"}`}>
              {t === "active" ? `Active (${active.length})` : t === "completed" ? `Completed (${completed.length})` : "Insights"}
            </button>
          ))}
          <button onClick={() => setShowNew(!showNew)} className="ml-auto btn-primary text-sm flex items-center gap-1"><Plus size={14} /> New Goal</button>
        </div>

        {showNew && (
          <Reveal>
            <div className="card p-5 border-2 border-orange-200 mb-6">
              <h3 className="font-bold text-primary-700 mb-3">Create a New Goal</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Goal title" className="input-field" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <input type="text" placeholder="Club name" className="input-field" value={newClub} onChange={e => setNewClub(e.target.value)} />
                <select className="select-field" value={newCategory} onChange={e => setNewCategory(e.target.value)}><option>Recruitment</option><option>Fundraising</option><option>Competitions</option><option>Service</option><option>Projects</option><option>Programs</option></select>
                <input type="date" className="input-field" value={newDate} onChange={e => setNewDate(e.target.value)} />
                <select className="select-field" value={newPriority} onChange={e => setNewPriority(e.target.value as "high" | "medium" | "low")}><option value="high">High Priority</option><option value="medium">Medium Priority</option><option value="low">Low Priority</option></select>
              </div>
              <textarea placeholder="Describe your goal..." className="input-field mt-3 h-20 resize-none" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              <div className="flex gap-2 mt-3"><button onClick={handleCreateGoal} disabled={!newTitle.trim() || !newClub.trim()} className="btn-primary text-sm disabled:opacity-50">Create Goal</button><button onClick={() => setShowNew(false)} className="text-sm text-neutral-500 hover:text-neutral-700">Cancel</button></div>
            </div>
          </Reveal>
        )}

        {tab === "insights" ? (
          <Reveal>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="card p-5 text-center"><TrendingUp size={24} className="mx-auto text-green-500 mb-2" /><p className="text-3xl font-bold text-primary-700">{avgProgress}%</p><p className="text-sm text-neutral-500">Average Active Goal Progress</p></div>
              <div className="card p-5 text-center"><CheckCircle size={24} className="mx-auto text-blue-500 mb-2" /><p className="text-3xl font-bold text-primary-700">{goals.reduce((s, g) => s + g.milestones.filter(m => m.done).length, 0)}/{goals.reduce((s, g) => s + g.milestones.length, 0)}</p><p className="text-sm text-neutral-500">Milestones Completed</p></div>
              <div className="card p-5 text-center"><Flag size={24} className="mx-auto text-orange-500 mb-2" /><p className="text-3xl font-bold text-primary-700">{atRisk}</p><p className="text-sm text-neutral-500">Goals Needing Attention</p></div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-primary-700 mb-3">Progress by Club</h3>
              <div className="space-y-3">
                {Array.from(new Set(goals.map(g => g.club))).map(club => {
                  const clubGoals = goals.filter(g => g.club === club);
                  const avg = Math.round(clubGoals.reduce((s, g) => s + g.progress, 0) / clubGoals.length);
                  return (
                    <div key={club}>
                      <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-primary-700">{club}</span><span className="text-neutral-500">{avg}% ({clubGoals.length} goals)</span></div>
                      <div className="h-3 bg-neutral-200 rounded-full"><div className={`h-3 rounded-full ${avg >= 80 ? "bg-green-500" : avg >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${avg}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {(tab === "active" ? active : completed).map(goal => (
              <Reveal key={goal.id}>
                <div className="card overflow-hidden ux-hover-lift-sm">
                  <button onClick={() => setExpandedId(expandedId === goal.id ? null : goal.id)} className="w-full p-5 text-left hover:bg-neutral-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 shrink-0">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                          <circle cx="24" cy="24" r="20" fill="none" stroke={goal.progress >= 80 ? "#22c55e" : goal.progress >= 50 ? "#eab308" : "#ef4444"} strokeWidth="4" strokeDasharray={`${(goal.progress / 100) * 125.66} 125.66`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-700">{goal.progress}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[goal.status].bg} ${STATUS_COLORS[goal.status].text}`}>{STATUS_COLORS[goal.status].label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{goal.category}</span>
                          <span className={`text-xs font-bold uppercase ${PRIORITY_COLORS[goal.priority]}`}>{goal.priority}</span>
                        </div>
                        <h3 className="font-bold text-primary-800 text-lg">{goal.title}</h3>
                        <p className="text-xs text-neutral-500">{goal.club} · Due: {new Date(goal.targetDate).toLocaleDateString()}</p>
                      </div>
                      <ChevronDown size={18} className={`text-neutral-400 shrink-0 transition-transform ${expandedId === goal.id ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {expandedId === goal.id && (
                    <div className="px-5 pb-5 border-t border-neutral-100 space-y-3">
                      <p className="text-sm text-neutral-600 mt-3">{goal.description}</p>
                      <div>
                        <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">Milestones</h4>
                        <div className="space-y-1.5">
                          {goal.milestones.map((m, i) => (
                            <button key={i} onClick={() => toggleMilestone(goal.id, i)} className={`flex items-center gap-2 text-sm w-full text-left hover:bg-neutral-50 px-1 py-0.5 ${m.done ? "text-green-600" : "text-neutral-500"}`}>
                              {m.done ? <CheckCircle size={14} className="text-green-500 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300 shrink-0" />}
                              <span className={m.done ? "line-through" : ""}>{m.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full"><div className={`h-2 rounded-full transition-all ${goal.progress >= 80 ? "bg-green-500" : goal.progress >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${goal.progress}%` }} /></div>
                      {goal.id.startsWith("g-") && (
                        <button onClick={() => deleteGoal(goal.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1"><Trash2 size={12} /> Remove Goal</button>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
