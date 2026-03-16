"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { chapters, schoolWideStats } from "@/lib/data";
import {
  Award, BarChart3, Calendar, Heart, PieChart, TrendingUp, Users, Zap, Target, Activity,
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

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame: number;
    const dur = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * ease).toLocaleString()}${suffix}`;
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, suffix]);
  return <span ref={ref}>0</span>;
}

function BarChart({ data, max, color = "bg-primary-500" }: { data: { label: string; value: number }[]; max: number; color?: string }) {
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-neutral-600 w-20 text-right shrink-0">{d.label}</span>
          <div className="flex-1 bg-neutral-100 rounded-full h-5 overflow-hidden">
            <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-neutral-700 w-12">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {segments.map(seg => {
          const pct = seg.value / total;
          const offset = cumulative;
          cumulative += pct;
          return (
            <circle key={seg.label} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={seg.color}
              strokeWidth={strokeWidth} strokeDasharray={`${circumference * pct} ${circumference * (1 - pct)}`}
              strokeDashoffset={-circumference * offset} transform={`rotate(-90 ${size / 2} ${size / 2})`}
              strokeLinecap="round" className="transition-all duration-700" />
          );
        })}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold fill-primary-700">{total}</text>
      </svg>
      <div className="space-y-1">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-neutral-600">{seg.label}</span>
            <span className="font-bold text-neutral-700">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"month" | "semester" | "year">("semester");

  const stats = schoolWideStats;
  const catData = stats.clubCategories;
  const growthData = stats.monthlyGrowth;
  const topClubs = stats.topClubs;

  const catColors = ["#1e3a5f", "#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#db2777"];

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs sm:text-sm uppercase tracking-[0.12em] font-semibold text-primary-100">Insights</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold">School-Wide Analytics</h1>
          <p className="mt-3 max-w-2xl text-primary-100 text-lg">Live statistics, growth trends, and engagement metrics across all {stats.totalClubs} clubs.</p>
          <div className="mt-6 flex gap-2">
            {(["month", "semester", "year"] as const).map(t => (
              <button key={t} onClick={() => setTimeRange(t)}
                className={`px-4 py-2  text-sm font-semibold transition-colors ${timeRange === t ? "bg-white text-primary-600" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {t === "month" ? "This Month" : t === "semester" ? "This Semester" : "This Year"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Clubs", value: stats.totalClubs, icon: BarChart3, color: "bg-primary-50 text-primary-600", suffix: "" },
            { label: "Total Members", value: stats.totalMembers, icon: Users, color: "bg-blue-50 text-blue-600", suffix: "" },
            { label: "Events This Year", value: stats.totalEvents, icon: Calendar, color: "bg-green-50 text-green-600", suffix: "" },
            { label: "Service Hours", value: stats.totalServiceHours, icon: Heart, color: "bg-red-50 text-red-600", suffix: "" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5 text-center ux-hover-lift-sm">
                <div className={`w-12 h-12  ${s.color} flex items-center justify-center mx-auto`}><Icon size={22} /></div>
                <p className="text-3xl font-bold text-primary-800 mt-3"><Counter target={s.value} suffix={s.suffix} /></p>
                <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Avg Club Size", value: stats.avgClubSize, suffix: "", icon: Target },
            { label: "Retention Rate", value: stats.clubRetentionRate, suffix: "%", icon: TrendingUp },
            { label: "Participation", value: stats.studentParticipationRate, suffix: "%", icon: Activity },
            { label: "Total Donations", value: stats.totalDonations, suffix: "", icon: Zap },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-4 flex items-center gap-3 ux-hover-lift-sm">
                <div className="w-10 h-10  bg-secondary-50 text-secondary-600 flex items-center justify-center shrink-0"><Icon size={18} /></div>
                <div>
                  <p className="text-xl font-bold text-primary-800"><Counter target={Math.round(s.value)} suffix={s.suffix} /></p>
                  <p className="text-xs text-neutral-500">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Club Categories Donut */}
          <Reveal>
            <div className="card p-6">
              <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><PieChart size={18} /> Clubs by Category</h2>
              <DonutChart segments={catData.map((c, i) => ({ label: c.category, value: c.count, color: catColors[i % catColors.length] }))} />
            </div>
          </Reveal>

          {/* Monthly Growth */}
          <Reveal>
            <div className="card p-6">
              <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><TrendingUp size={18} /> Membership Growth</h2>
              <BarChart data={growthData.map(g => ({ label: g.month.split(" ")[0], value: g.members }))} max={Math.max(...growthData.map(g => g.members)) * 1.1} color="bg-primary-500" />
              <h3 className="text-sm font-semibold text-neutral-700 mt-5 mb-2">Events Per Month</h3>
              <BarChart data={growthData.map(g => ({ label: g.month.split(" ")[0], value: g.events }))} max={Math.max(...growthData.map(g => g.events)) * 1.2} color="bg-secondary-500" />
            </div>
          </Reveal>
        </div>

        {/* Top Performing Clubs */}
        <Reveal>
          <div className="card p-6">
            <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><Award size={18} /> Top Performing Clubs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-2 text-neutral-500 font-semibold">Rank</th>
                    <th className="text-left py-3 px-2 text-neutral-500 font-semibold">Club</th>
                    <th className="text-center py-3 px-2 text-neutral-500 font-semibold">Members</th>
                    <th className="text-center py-3 px-2 text-neutral-500 font-semibold">Events</th>
                    <th className="text-center py-3 px-2 text-neutral-500 font-semibold">Score</th>
                    <th className="text-left py-3 px-2 text-neutral-500 font-semibold">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {topClubs.map((club, i) => (
                    <tr key={club.name} className="border-b border-neutral-100 hover:bg-primary-50/30 transition-colors">
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-700" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-neutral-50 text-neutral-600"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-primary-700">{club.name}</td>
                      <td className="py-3 px-2 text-center">{club.members}</td>
                      <td className="py-3 px-2 text-center">{club.events}</td>
                      <td className="py-3 px-2 text-center font-bold text-primary-700">{club.score}</td>
                      <td className="py-3 px-2">
                        <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`h-full rounded-full ${club.score >= 90 ? "bg-green-500" : club.score >= 80 ? "bg-blue-500" : "bg-yellow-500"}`} style={{ width: `${club.score}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Category Breakdown */}
        <Reveal>
          <div className="card p-6">
            <h2 className="text-lg font-heading font-bold text-primary-600 mb-4">Category Breakdown</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {catData.map((cat, i) => (
                <div key={cat.category} className="bg-neutral-50 border border-neutral-200  p-4 ux-hover-lift-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: catColors[i % catColors.length] }} />
                    <span className="font-semibold text-neutral-800 text-sm">{cat.category}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-700 mt-2">{cat.count}</p>
                  <p className="text-xs text-neutral-500">clubs · {Math.round((cat.count / stats.totalClubs) * 100)}% of total</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Engagement Insights */}
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-5 bg-gradient-to-br from-green-50 to-white border-green-100 text-center">
              <TrendingUp size={24} className="mx-auto text-green-600" />
              <p className="text-3xl font-bold text-green-700 mt-2">+{growthData.length > 1 ? growthData[growthData.length - 1].members - growthData[0].members : 0}</p>
              <p className="text-xs text-neutral-500">New members this semester</p>
            </div>
            <div className="card p-5 bg-gradient-to-br from-blue-50 to-white border-blue-100 text-center">
              <Calendar size={24} className="mx-auto text-blue-600" />
              <p className="text-3xl font-bold text-blue-700 mt-2">{growthData.reduce((s, g) => s + g.events, 0)}</p>
              <p className="text-xs text-neutral-500">Events this semester</p>
            </div>
            <div className="card p-5 bg-gradient-to-br from-purple-50 to-white border-purple-100 text-center">
              <Award size={24} className="mx-auto text-purple-600" />
              <p className="text-3xl font-bold text-purple-700 mt-2">{chapters.reduce((s, c) => s + c.achievements.length, 0)}</p>
              <p className="text-xs text-neutral-500">Achievements earned</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="card p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center">
            <h2 className="text-xl font-heading font-bold">Want to see your club&apos;s analytics?</h2>
            <p className="text-primary-100 mt-2">Dashboard with detailed metrics is available for officers and advisors.</p>
            <Link href="/dashboard" className="btn-secondary inline-block mt-4">Go to Dashboard</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
