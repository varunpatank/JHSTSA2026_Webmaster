"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import {
  ArrowLeftRight, BarChart2, Calendar, CheckCircle, MapPin, Minus, Plus, Star, Trophy, Users, X
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

const COMPARE_DATA = chapters.map(ch => ({
  ...ch,
  stats: {
    memberCount: ch.memberCount ?? Math.floor(Math.random() * 40) + 15,
    yearFounded: 2020 + Math.floor(Math.random() * 5),
    eventsPerYear: Math.floor(Math.random() * 15) + 5,
    meetingFrequency: ["Weekly", "Biweekly", "Monthly"][Math.floor(Math.random() * 3)],
    competitionsWon: Math.floor(Math.random() * 8),
    communityHours: Math.floor(Math.random() * 200) + 50,
    retentionRate: Math.floor(Math.random() * 25) + 75,
    satisfactionScore: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    budgetPerMember: Math.floor(Math.random() * 40) + 10,
    socialMediaFollowers: Math.floor(Math.random() * 500) + 100,
  },
}));

const METRICS = [
  { key: "memberCount", label: "Members", suffix: "", higherBetter: true },
  { key: "yearFounded", label: "Year Founded", suffix: "", higherBetter: false },
  { key: "eventsPerYear", label: "Events/Year", suffix: "", higherBetter: true },
  { key: "meetingFrequency", label: "Meeting Frequency", suffix: "", higherBetter: null },
  { key: "competitionsWon", label: "Competitions Won", suffix: "", higherBetter: true },
  { key: "communityHours", label: "Community Hours", suffix: "hrs", higherBetter: true },
  { key: "retentionRate", label: "Retention Rate", suffix: "%", higherBetter: true },
  { key: "satisfactionScore", label: "Satisfaction", suffix: "/5.0", higherBetter: true },
  { key: "budgetPerMember", label: "Budget/Member", suffix: "$", higherBetter: null },
  { key: "socialMediaFollowers", label: "Social Followers", suffix: "", higherBetter: true },
] as const;

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggleClub(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  }

  function removeClub(id: string) {
    setSelected(prev => prev.filter(x => x !== id));
  }

  const selectedClubs = COMPARE_DATA.filter(c => selected.includes(c.id));

  function getBest(key: string): string | null {
    if (selectedClubs.length < 2) return null;
    const metric = METRICS.find(m => m.key === key);
    if (!metric || metric.higherBetter === null) return null;
    const vals = selectedClubs.map(c => ({ id: c.id, val: (c.stats as Record<string, number | string>)[key] }));
    const numVals = vals.filter(v => typeof v.val === "number") as { id: string; val: number }[];
    if (numVals.length < 2) return null;
    return metric.higherBetter
      ? numVals.reduce((best, v) => v.val > best.val ? v : best).id
      : numVals.reduce((best, v) => v.val < best.val ? v : best).id;
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-600 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-cyan-100 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><ArrowLeftRight size={36} /> Club Comparison</h1>
          <p className="mt-3 max-w-2xl text-cyan-50 text-lg">Compare up to 4 clubs side-by-side across key metrics to find your best fit.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        <Reveal>
          <div className="card p-5 mb-6">
            <h2 className="font-bold text-primary-700 mb-3">Select Clubs to Compare (up to 4)</h2>
            <div className="flex flex-wrap gap-2">
              {COMPARE_DATA.map(club => (
                <button
                  key={club.id}
                  onClick={() => toggleClub(club.id)}
                  className={`px-3 py-1.5  text-sm border transition-all ${
                    selected.includes(club.id)
                      ? "bg-primary-600 text-white border-primary-600"
                      : selected.length >= 4
                        ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                        : "bg-white text-primary-700 border-primary-200 hover:border-primary-400"
                  }`}
                  disabled={!selected.includes(club.id) && selected.length >= 4}
                >
                  {club.name}
                </button>
              ))}
            </div>
            {selected.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedClubs.map(c => (
                  <span key={c.id} className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700 flex items-center gap-1">
                    {c.name} <button onClick={() => removeClub(c.id)}><X size={12} /></button>
                  </span>
                ))}
                <button onClick={() => setSelected([])} className="text-xs text-red-500 hover:underline ml-2">Clear All</button>
              </div>
            )}
          </div>
        </Reveal>

        {selected.length < 2 ? (
          <div className="card p-12 text-center">
            <ArrowLeftRight size={48} className="mx-auto text-neutral-300" />
            <p className="mt-4 text-neutral-500 text-lg">Select at least 2 clubs to compare</p>
            <p className="text-sm text-neutral-400 mt-1">Click club names above to start comparing</p>
          </div>
        ) : (
          <Reveal>
            {}
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-primary-50/50">
                    <th className="text-left p-4 font-bold text-primary-700 min-w-[160px]">Metric</th>
                    {selectedClubs.map(c => (
                      <th key={c.id} className="p-4 text-center min-w-[140px]">
                        <div className="font-bold text-primary-800">{c.name}</div>
                        <span className="text-xs text-neutral-500 font-normal">{c.category}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((metric, idx) => {
                    const bestId = getBest(metric.key);
                    return (
                      <tr key={metric.key} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                        <td className="p-4 font-semibold text-primary-700">{metric.label}</td>
                        {selectedClubs.map(c => {
                          const val = (c.stats as Record<string, number | string>)[metric.key];
                          const isBest = bestId === c.id;
                          return (
                            <td key={c.id} className={`p-4 text-center ${isBest ? "font-bold text-green-600" : "text-neutral-700"}`}>
                              <span className="inline-flex items-center gap-1">
                                {metric.key === "budgetPerMember" ? `$${val}` : `${val}${metric.suffix}`}
                                {isBest && <Star size={12} className="text-yellow-500" fill="currentColor" />}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {}
            <div className="card p-5 mt-6">
              <h3 className="font-bold text-primary-700 mb-4">Visual Comparison</h3>
              <div className="space-y-4">
                {(["memberCount", "eventsPerYear", "communityHours", "retentionRate"] as const).map(key => {
                  const metric = METRICS.find(m => m.key === key)!;
                  const maxVal = Math.max(...selectedClubs.map(c => Number((c.stats as Record<string, number | string>)[key]) || 0));
                  const colors = ["bg-primary-500", "bg-secondary-500", "bg-rose-500", "bg-teal-500"];
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-neutral-500 mb-1">{metric.label}</p>
                      <div className="space-y-1.5">
                        {selectedClubs.map((c, i) => {
                          const val = Number((c.stats as Record<string, number | string>)[key]) || 0;
                          return (
                            <div key={c.id} className="flex items-center gap-2">
                              <span className="text-xs text-neutral-500 w-28 truncate">{c.name}</span>
                              <div className="flex-1 h-4 bg-neutral-200 rounded-full overflow-hidden">
                                <div className={`h-4 rounded-full ${colors[i]} transition-all`} style={{ width: `${maxVal ? (val / maxVal) * 100 : 0}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-neutral-700 w-12 text-right">{val}{metric.suffix}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
