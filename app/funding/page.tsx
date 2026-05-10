"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters, sponsorsData } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import {
  ArrowRight, BarChart2, CheckCircle, ChevronDown, CreditCard, DollarSign,
  Download, FileText, Filter, PieChart, Plus, Search, TrendingUp, Users
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

interface BudgetEntry {
  id: string; club: string; category: string; allocated: number; spent: number; remaining: number;
}

const BUDGETS: BudgetEntry[] = [
  { id: "b1", club: "Robotics Club", category: "STEM", allocated: 8500, spent: 5200, remaining: 3300 },
  { id: "b2", club: "Model United Nations", category: "Academic", allocated: 3200, spent: 2100, remaining: 1100 },
  { id: "b3", club: "Drama Club", category: "Arts", allocated: 6000, spent: 4800, remaining: 1200 },
  { id: "b4", club: "Community Service Club", category: "Service", allocated: 2000, spent: 800, remaining: 1200 },
  { id: "b5", club: "Art Club", category: "Arts", allocated: 2500, spent: 1900, remaining: 600 },
  { id: "b6", club: "Environmental Club", category: "STEM", allocated: 1500, spent: 700, remaining: 800 },
  { id: "b7", club: "CS Club", category: "STEM", allocated: 3000, spent: 1200, remaining: 1800 },
  { id: "b8", club: "Science Olympiad", category: "Academic", allocated: 4000, spent: 2800, remaining: 1200 },
];

interface Grant {
  id: string; name: string; provider: string; amount: string; deadline: string; status: "open" | "closing-soon" | "closed"; eligibility: string; description: string;
}

const GRANTS: Grant[] = [
  { id: "gr1", name: "STEM Education Innovation Grant", provider: "Washington STEM", amount: "$500 - $2,000", deadline: "2026-03-31", status: "open", eligibility: "STEM clubs", description: "Supports innovative hands-on STEM projects and equipment." },
  { id: "gr2", name: "Youth Service Leadership Award", provider: "Rotary Club of Kirkland", amount: "Up to $1,000", deadline: "2026-03-15", status: "closing-soon", eligibility: "Service-focused clubs", description: "For clubs demonstrating exceptional community service impact." },
  { id: "gr3", name: "Arts in Schools Micro-Grant", provider: "Kirkland Arts Center", amount: "$250 - $750", deadline: "2026-04-15", status: "open", eligibility: "Arts clubs", description: "Supports student-led art exhibitions, performances, and workshops." },
  { id: "gr4", name: "Student Innovation Fund", provider: "LWSD Foundation", amount: "$500 - $5,000", deadline: "2026-02-28", status: "closed", eligibility: "All clubs", description: "District-wide grant for innovative student projects and programs." },
  { id: "gr5", name: "Environmental Action Grant", provider: "Green Schools Alliance", amount: "$300 - $1,500", deadline: "2026-04-30", status: "open", eligibility: "Environmental clubs", description: "Fund sustainability projects, garden programs, and eco-initiatives." },
];

interface FundraiserEvent {
  id: string; name: string; club: string; date: string; raised: number; goal: number; type: string;
}

const FUNDRAISERS: FundraiserEvent[] = [
  { id: "f1", name: "Robot-a-thon Pledge Drive", club: "Robotics Club", date: "2026-02-15", raised: 2800, goal: 3000, type: "Pledge" },
  { id: "f2", name: "Spring Bake Sale", club: "Model UN", date: "2026-02-22", raised: 450, goal: 500, type: "Sale" },
  { id: "f3", name: "Drama Dinner Theater", club: "Drama Club", date: "2026-03-01", raised: 1200, goal: 1500, type: "Event" },
  { id: "f4", name: "Car Wash for a Cause", club: "Community Service", date: "2026-03-08", raised: 380, goal: 400, type: "Service" },
  { id: "f5", name: "Art Print Sale", club: "Art Club", date: "2026-03-15", raised: 620, goal: 800, type: "Sale" },
];

export default function FundingPage() {
  const [tab, setTab] = useState<"budgets" | "grants" | "fundraisers">("budgets");

  const totalAllocated = BUDGETS.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = BUDGETS.reduce((s, b) => s + b.spent, 0);
  const totalRaised = FUNDRAISERS.reduce((s, f) => s + f.raised, 0);

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-neutral-100 min-h-screen">
      <HeroSection
        title="Funding & Budgets"
        icon={<DollarSign size={36} />}
        description={<>Manage your club’s <strong className="text-secondary-700 font-bold">budget, track expenses,</strong> discover open grant opportunities, and run fundraising campaigns — all from one dashboard. <strong className="text-primary-700 font-semibold">No spreadsheets required.</strong></>}
        stats={[
          { label: "Total Budget", value: `$${(totalAllocated / 1000).toFixed(1)}k` },
          { label: "Spent", value: `$${(totalSpent / 1000).toFixed(1)}k` },
          { label: "Open Grants", value: GRANTS.filter(g => g.status !== "closed").length },
          { label: "Raised", value: `$${(totalRaised / 1000).toFixed(1)}k` },
        ]}
      >
        <Link href="/hub" className="inline-block text-sm text-primary-100 hover:underline">← Back to Hub</Link>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["budgets", "grants", "fundraisers"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2  text-sm font-semibold transition-all ${tab === t ? "bg-primary-900 text-white" : "bg-white text-neutral-600 hover:bg-primary-50"}`}>
              {t === "budgets" ? "Budget Allocations" : t === "grants" ? `Grants (${GRANTS.filter(g => g.status !== "closed").length} Open)` : "Fundraisers"}
            </button>
          ))}
        </div>

        {tab === "budgets" && (
          <Reveal>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-neutral-200 bg-primary-50/50">
                  <th className="text-left p-4 font-bold text-primary-700">Club</th>
                  <th className="text-left p-4 font-bold text-primary-700">Category</th>
                  <th className="text-right p-4 font-bold text-primary-700">Allocated</th>
                  <th className="text-right p-4 font-bold text-primary-700">Spent</th>
                  <th className="text-right p-4 font-bold text-primary-700">Remaining</th>
                  <th className="p-4 font-bold text-primary-700">Usage</th>
                </tr></thead>
                <tbody>
                  {BUDGETS.map((b, i) => {
                    const pct = Math.round((b.spent / b.allocated) * 100);
                    return (
                      <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                        <td className="p-4 font-semibold text-primary-800">{b.club}</td>
                        <td className="p-4"><span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{b.category}</span></td>
                        <td className="p-4 text-right">${b.allocated.toLocaleString()}</td>
                        <td className="p-4 text-right text-red-600">${b.spent.toLocaleString()}</td>
                        <td className="p-4 text-right text-green-600 font-semibold">${b.remaining.toLocaleString()}</td>
                        <td className="p-4 w-32">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-neutral-200 rounded-full"><div className={`h-2 rounded-full ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} /></div>
                            <span className="text-xs text-neutral-500 w-8 text-right">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot><tr className="border-t-2 border-primary-200 bg-primary-50/30 font-bold">
                  <td className="p-4 text-primary-700">Total</td><td className="p-4" /><td className="p-4 text-right">${totalAllocated.toLocaleString()}</td>
                  <td className="p-4 text-right text-red-600">${totalSpent.toLocaleString()}</td>
                  <td className="p-4 text-right text-green-600">${(totalAllocated - totalSpent).toLocaleString()}</td>
                  <td className="p-4"><span className="text-xs text-neutral-500">{Math.round((totalSpent / totalAllocated) * 100)}% used</span></td>
                </tr></tfoot>
              </table>
            </div>
          </Reveal>
        )}

        {tab === "grants" && (
          <div className="space-y-4">
            {GRANTS.map(grant => (
              <Reveal key={grant.id}>
                <div className={`card p-5 ux-hover-lift-sm ${grant.status === "closed" ? "opacity-60" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${grant.status === "open" ? "bg-green-100 text-green-700" : grant.status === "closing-soon" ? "bg-yellow-100 text-yellow-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {grant.status === "open" ? "Open" : grant.status === "closing-soon" ? "Closing Soon" : "Closed"}
                    </span>
                    <span className="text-xs text-neutral-400">{grant.eligibility}</span>
                  </div>
                  <h3 className="font-bold text-primary-800 text-lg">{grant.name}</h3>
                  <p className="text-xs text-neutral-500">{grant.provider}</p>
                  <p className="text-sm text-neutral-600 mt-2">{grant.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600 font-bold">{grant.amount}</span>
                      <span className="text-neutral-400">Deadline: {new Date(grant.deadline).toLocaleDateString()}</span>
                    </div>
                    {grant.status !== "closed" && <button className="btn-primary text-sm px-4 py-1.5">Apply Now</button>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {tab === "fundraisers" && (
          <div className="space-y-4">
            {FUNDRAISERS.map(f => {
              const pct = Math.round((f.raised / f.goal) * 100);
              return (
                <Reveal key={f.id}>
                  <div className="card p-5 ux-hover-lift-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{f.type}</span>
                      <span className="text-xs text-neutral-400">{new Date(f.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-primary-800 text-lg">{f.name}</h3>
                    <p className="text-xs text-neutral-500">{f.club}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1"><span className="text-green-600 font-bold">${f.raised.toLocaleString()} raised</span><span className="text-neutral-400">Goal: ${f.goal.toLocaleString()}</span></div>
                      <div className="h-3 bg-neutral-200 rounded-full"><div className={`h-3 rounded-full ${pct >= 100 ? "bg-green-500" : "bg-primary-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                      <p className="text-xs text-neutral-400 mt-1">{pct}% of goal</p>
                    </div>
                    {pct >= 100 && <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1"><CheckCircle size={12} /> Goal reached!</p>}
                  </div>
                </Reveal>
              );
            })}
            <div className="card p-5 bg-gradient-to-r from-emerald-50 to-green-50 text-center border-2 border-emerald-200">
              <h3 className="font-bold text-primary-700">Start a Fundraiser</h3>
              <p className="text-sm text-neutral-600 mt-1">Ready to raise funds for your club? Create a campaign and start collecting donations.</p>
              <Link href="/donate" className="btn-primary mt-3 inline-block text-sm">Create Campaign</Link>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

