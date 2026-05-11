"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import {
  Activity, AlertTriangle, ArrowDown, ArrowUp, CheckCircle, Heart,
  Info, TrendingDown, TrendingUp, Users, Zap
} from "lucide-react";
import StageBannerPattern from "@/components/StageBannerPattern";

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

interface ClubHealthMetrics {
  id: string; name: string; category: string; overallScore: number;
  metrics: { label: string; score: number; trend: "up" | "down" | "stable" }[];
  strengths: string[]; concerns: string[]; recommendations: string[];
}

const CLUB_HEALTH: ClubHealthMetrics[] = [
  { id: "ch1", name: "Model United Nations", category: "Academic", overallScore: 92, metrics: [{ label: "Membership", score: 95, trend: "up" }, { label: "Meeting Attendance", score: 88, trend: "stable" }, { label: "Event Participation", score: 94, trend: "up" }, { label: "Member Retention", score: 90, trend: "stable" }, { label: "Budget Health", score: 85, trend: "up" }], strengths: ["Strong recruitment pipeline", "Active competition schedule", "Experienced leadership team"], concerns: ["Meeting space occasionally insufficient"], recommendations: ["Request larger meeting room for next semester", "Create alumni mentorship program"] },
  { id: "ch2", name: "Robotics Club", category: "STEM", overallScore: 88, metrics: [{ label: "Membership", score: 85, trend: "stable" }, { label: "Meeting Attendance", score: 92, trend: "up" }, { label: "Event Participation", score: 90, trend: "up" }, { label: "Member Retention", score: 82, trend: "down" }, { label: "Budget Health", score: 78, trend: "down" }], strengths: ["High engagement at meetings", "Strong competition results", "Active mentorship from sponsors"], concerns: ["Budget strain from competition costs", "Freshman retention needs improvement"], recommendations: ["Launch targeted fundraising campaign", "Create freshman onboarding buddy system", "Apply for STEM education grants"] },
  { id: "ch3", name: "Community Service Club", category: "Service", overallScore: 85, metrics: [{ label: "Membership", score: 80, trend: "up" }, { label: "Meeting Attendance", score: 78, trend: "down" }, { label: "Event Participation", score: 95, trend: "up" }, { label: "Member Retention", score: 88, trend: "stable" }, { label: "Budget Health", score: 90, trend: "up" }], strengths: ["Highest event participation rate", "Strong community partnerships", "Excellent budget management"], concerns: ["Meeting attendance declining", "Need more consistent weekly activities"], recommendations: ["Restructure meetings with activity-based format", "Add social elements to regular meetings"] },
  { id: "ch4", name: "Environmental Club", category: "STEM", overallScore: 79, metrics: [{ label: "Membership", score: 72, trend: "down" }, { label: "Meeting Attendance", score: 75, trend: "down" }, { label: "Event Participation", score: 88, trend: "stable" }, { label: "Member Retention", score: 70, trend: "down" }, { label: "Budget Health", score: 82, trend: "stable" }], strengths: ["Impactful community projects", "Good partnership with city"], concerns: ["Declining membership trend", "Low meeting attendance", "Leadership transition needed"], recommendations: ["Host a high-visibility Earth Day event to boost recruitment", "Partner with other clubs for joint events", "Identify and train next year's officers now"] },
  { id: "ch5", name: "Art Club", category: "Arts", overallScore: 83, metrics: [{ label: "Membership", score: 88, trend: "up" }, { label: "Meeting Attendance", score: 85, trend: "stable" }, { label: "Event Participation", score: 80, trend: "stable" }, { label: "Member Retention", score: 82, trend: "up" }, { label: "Budget Health", score: 75, trend: "down" }], strengths: ["Growing membership", "Inclusive and welcoming culture", "Regular showcases"], concerns: ["Supply costs rising", "Limited exhibition space"], recommendations: ["Partner with local galleries for exhibition space", "Launch supply donation drive", "Apply for arts education grants"] },
  { id: "ch6", name: "Drama Club", category: "Arts", overallScore: 90, metrics: [{ label: "Membership", score: 90, trend: "stable" }, { label: "Meeting Attendance", score: 95, trend: "up" }, { label: "Event Participation", score: 88, trend: "stable" }, { label: "Member Retention", score: 92, trend: "up" }, { label: "Budget Health", score: 85, trend: "up" }], strengths: ["Outstanding attendance and retention", "Revenue-generating performances", "Strong school community presence"], concerns: ["Audition competitiveness may discourage newcomers"], recommendations: ["Create non-audition ensemble roles", "Add workshop series open to all students"] },
];

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBg(score: number) {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp size={12} className="text-green-500" />;
  if (trend === "down") return <TrendingDown size={12} className="text-red-500" />;
  return <span className="text-neutral-300">—</span>;
}

const HEALTH_LS_KEY = "clubconnect_health_prefs";

function loadHealthPrefs(): { sortBy: "score" | "name" } {
  try { const s = localStorage.getItem(HEALTH_LS_KEY); if (s) return JSON.parse(s); } catch {}
  return { sortBy: "score" };
}

export default function HealthPage() {
  const prefs = loadHealthPrefs();
  const [sortBy, setSortBy] = useState<"score" | "name">(prefs.sortBy);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { try { localStorage.setItem(HEALTH_LS_KEY, JSON.stringify({ sortBy })); } catch {} }, [sortBy]);

  const sorted = [...CLUB_HEALTH].sort((a, b) => sortBy === "score" ? b.overallScore - a.overallScore : a.name.localeCompare(b.name));

  const avgScore = Math.round(CLUB_HEALTH.reduce((s, c) => s + c.overallScore, 0) / CLUB_HEALTH.length);
  const improving = CLUB_HEALTH.filter(c => c.metrics.filter(m => m.trend === "up").length >= 3).length;
  const needsAttention = CLUB_HEALTH.filter(c => c.overallScore < 80).length;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative overflow-hidden text-white border-b-4 border-amber-300" style={{ background: "#d97706" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 19px)" }}
        />
        <StageBannerPattern patternId="health-tool-banner-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 relative z-10">
          <Link href="/hub" className="text-sm text-white/90 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3 drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]"><Activity size={36} /> Club Health Dashboard</h1>
          <p className="mt-3 max-w-2xl text-white/90 text-lg">Monitor club vitality, spot trends, and get recommendations for improvement.</p>
          <div className="mt-6 grid grid-cols-4 gap-3 max-w-lg">
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{CLUB_HEALTH.length}</p><p className="text-xs text-white/85">Tracked</p></div>
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{avgScore}</p><p className="text-xs text-white/85">Avg Score</p></div>
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{improving}</p><p className="text-xs text-white/85">Improving</p></div>
            <div className="bg-white/15 p-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{needsAttention}</p><p className="text-xs text-white/85">Need Help</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        <div className="card p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" /> 90-100 Excellent</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> 80-89 Good</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500" /> 70-79 Fair</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> Below 70</span>
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="select-field text-sm w-auto">
            <option value="score">Sort by Score</option><option value="name">Sort by Name</option>
          </select>
        </div>

        {}
        <div className="space-y-4">
          {sorted.map(club => (
            <Reveal key={club.id}>
              <div className="card overflow-hidden ux-hover-lift-sm">
                <button onClick={() => setExpandedId(expandedId === club.id ? null : club.id)} className="w-full p-5 text-left hover:bg-neutral-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {}
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                        <circle cx="32" cy="32" r="28" fill="none" stroke={club.overallScore >= 90 ? "#22c55e" : club.overallScore >= 80 ? "#3b82f6" : club.overallScore >= 70 ? "#eab308" : "#ef4444"} strokeWidth="5" strokeDasharray={`${(club.overallScore / 100) * 175.93} 175.93`} strokeLinecap="round" />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center font-bold text-sm ${getScoreColor(club.overallScore)}`}>{club.overallScore}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{club.category}</span>
                        {club.overallScore >= 90 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">⭐ Top Performer</span>}
                        {club.overallScore < 80 && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">⚠ Needs Attention</span>}
                      </div>
                      <h3 className="font-bold text-primary-800 text-lg">{club.name}</h3>
                      {}
                      <div className="mt-2 grid grid-cols-5 gap-2">
                        {club.metrics.map(m => (
                          <div key={m.label} className="text-center">
                            <div className="h-1.5 bg-neutral-200 rounded-full"><div className={`h-1.5 rounded-full ${getScoreBg(m.score)}`} style={{ width: `${m.score}%` }} /></div>
                            <span className="text-[9px] text-neutral-400 leading-none mt-0.5 block">{m.label.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
                {expandedId === club.id && (
                  <div className="px-5 pb-5 border-t border-neutral-100 space-y-4">
                    {}
                    <div className="mt-3 grid sm:grid-cols-5 gap-3">
                      {club.metrics.map(m => (
                        <div key={m.label} className="bg-neutral-50 p-3  text-center">
                          <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
                          <p className={`text-xl font-bold ${getScoreColor(m.score)}`}>{m.score}</p>
                          <div className="flex items-center justify-center gap-1 mt-1"><TrendIcon trend={m.trend} /><span className="text-[10px] text-neutral-400 capitalize">{m.trend}</span></div>
                        </div>
                      ))}
                    </div>
                    {}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle size={12} /> Strengths</h4>
                        <ul className="space-y-1">{club.strengths.map(s => <li key={s} className="text-sm text-neutral-600 flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> {s}</li>)}</ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle size={12} /> Areas of Concern</h4>
                        <ul className="space-y-1">{club.concerns.map(c => <li key={c} className="text-sm text-neutral-600 flex items-start gap-2"><span className="text-yellow-500 mt-0.5">!</span> {c}</li>)}</ul>
                      </div>
                    </div>
                    {}
                    <div>
                      <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Zap size={12} /> Recommendations</h4>
                      <ul className="space-y-1">{club.recommendations.map(r => <li key={r} className="text-sm text-neutral-600 flex items-start gap-2"><span className="text-primary-400 mt-0.5">→</span> {r}</li>)}</ul>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
