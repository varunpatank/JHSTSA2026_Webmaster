"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Award, CheckCircle, Crown, Lock, Medal, Search, Shield, Star, Trophy, Users, Zap
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

interface AchievementBadge {
  id: string; name: string; description: string; icon: string; category: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  requirement: string; earnedBy: number; progress?: number; unlocked: boolean;
}

const BADGES: AchievementBadge[] = [
  { id: "a1", name: "First Steps", description: "Join your first club", icon: "👣", category: "Getting Started", rarity: "common", requirement: "Join 1 club", earnedBy: 892, progress: 100, unlocked: true },
  { id: "a2", name: "Social Butterfly", description: "Join 3 or more clubs", icon: "🦋", category: "Getting Started", rarity: "uncommon", requirement: "Join 3 clubs", earnedBy: 234, progress: 66, unlocked: false },
  { id: "a3", name: "Event Explorer", description: "Attend 5 club events", icon: "🗺️", category: "Participation", rarity: "common", requirement: "Attend 5 events", earnedBy: 567, progress: 80, unlocked: false },
  { id: "a4", name: "Regular", description: "Attend 10 consecutive meetings", icon: "📅", category: "Participation", rarity: "uncommon", requirement: "10 consecutive meetings", earnedBy: 312, progress: 70, unlocked: false },
  { id: "a5", name: "Helping Hand", description: "Complete 20 hours of community service", icon: "🤝", category: "Service", rarity: "uncommon", requirement: "20 service hours", earnedBy: 189, progress: 100, unlocked: true },
  { id: "a6", name: "Service Star", description: "Complete 100 hours of community service", icon: "⭐", category: "Service", rarity: "rare", requirement: "100 service hours", earnedBy: 45, progress: 52, unlocked: false },
  { id: "a7", name: "Leader", description: "Become a club officer", icon: "👑", category: "Leadership", rarity: "rare", requirement: "Hold officer position", earnedBy: 87, progress: 100, unlocked: true },
  { id: "a8", name: "Visionary", description: "Successfully propose and launch a new club", icon: "🚀", category: "Leadership", rarity: "epic", requirement: "Found a new club", earnedBy: 12, progress: 0, unlocked: false },
  { id: "a9", name: "Champion", description: "Win first place at a state competition", icon: "🏆", category: "Competitions", rarity: "epic", requirement: "1st place at state", earnedBy: 23, progress: 0, unlocked: false },
  { id: "a10", name: "Fundraiser", description: "Help raise $500+ for your club", icon: "💰", category: "Contributions", rarity: "rare", requirement: "Raise $500+", earnedBy: 56, progress: 40, unlocked: false },
  { id: "a11", name: "Mentor", description: "Mentor 3 newer members", icon: "🎓", category: "Leadership", rarity: "rare", requirement: "Mentor 3 members", earnedBy: 67, progress: 33, unlocked: false },
  { id: "a12", name: "Collaborator", description: "Participate in a cross-club project", icon: "🔗", category: "Participation", rarity: "uncommon", requirement: "Join cross-club event", earnedBy: 156, progress: 100, unlocked: true },
  { id: "a13", name: "All-Star", description: "Earn badges in 5 different categories", icon: "🌟", category: "Special", rarity: "epic", requirement: "5 category badges", earnedBy: 8, progress: 60, unlocked: false },
  { id: "a14", name: "Legend", description: "Earn 15+ badges and hold a leadership position", icon: "🏅", category: "Special", rarity: "legendary", requirement: "15 badges + officer", earnedBy: 3, progress: 27, unlocked: false },
  { id: "a15", name: "Innovator", description: "Submit a winning idea to the Ideas Board", icon: "💡", category: "Contributions", rarity: "rare", requirement: "Approved club idea", earnedBy: 34, progress: 0, unlocked: false },
  { id: "a16", name: "Storyteller", description: "Have your success story featured on the hub", icon: "📖", category: "Contributions", rarity: "rare", requirement: "Featured story", earnedBy: 18, progress: 0, unlocked: false },
];

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: "bg-neutral-50", border: "border-neutral-300", text: "text-neutral-600", glow: "" },
  uncommon: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", glow: "" },
  rare: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", glow: "shadow-blue-100" },
  epic: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", glow: "shadow-purple-100 shadow-lg" },
  legendary: { bg: "bg-gradient-to-br from-yellow-50 to-amber-50", border: "border-yellow-400", text: "text-yellow-700", glow: "shadow-yellow-200 shadow-lg" },
};

const LEADERBOARD = [
  { rank: 1, name: "Emma W.", badges: 14, points: 2450 },
  { rank: 2, name: "Jason L.", badges: 12, points: 2100 },
  { rank: 3, name: "Sarah K.", badges: 11, points: 1980 },
  { rank: 4, name: "Marcus C.", badges: 10, points: 1750 },
  { rank: 5, name: "Priya M.", badges: 9, points: 1620 },
  { rank: 6, name: "Alex R.", badges: 9, points: 1580 },
  { rank: 7, name: "Taylor N.", badges: 8, points: 1400 },
  { rank: 8, name: "Dev G.", badges: 7, points: 1250 },
];

export default function AchievementsPage() {
  const [tab, setTab] = useState<"all" | "unlocked" | "progress" | "leaderboard">("all");
  const [category, setCategory] = useState("All");
  const [rarity, setRarity] = useState("All");

  const categories = ["All", ...Array.from(new Set(BADGES.map(b => b.category)))];
  const unlocked = BADGES.filter(b => b.unlocked);
  const totalPoints = unlocked.length * 100;

  const filtered = BADGES.filter(b => {
    if (category !== "All" && b.category !== category) return false;
    if (rarity !== "All" && b.rarity !== rarity) return false;
    if (tab === "unlocked") return b.unlocked;
    if (tab === "progress") return !b.unlocked && (b.progress ?? 0) > 0;
    return true;
  });

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-gradient-to-br from-yellow-500 via-amber-500 to-secondary-600 text-white border-b-4 border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-yellow-100 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><Award size={36} /> Achievement Badges</h1>
          <p className="mt-3 max-w-2xl text-yellow-50 text-lg">Track your progress, earn badges, and compete on the leaderboard.</p>
          <div className="mt-6 grid grid-cols-4 gap-3 max-w-lg">
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{unlocked.length}/{BADGES.length}</p><p className="text-xs text-yellow-100">Earned</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{totalPoints}</p><p className="text-xs text-yellow-100">Points</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{BADGES.filter(b => b.rarity === "legendary").length}</p><p className="text-xs text-yellow-100">Legendary</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{categories.length - 1}</p><p className="text-xs text-yellow-100">Categories</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "unlocked", "progress", "leaderboard"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2  text-sm font-semibold transition-all ${tab === t ? "bg-primary-600 text-white" : "bg-white text-neutral-600 hover:bg-primary-50"}`}>
              {t === "all" ? `All Badges (${BADGES.length})` : t === "unlocked" ? `Unlocked (${unlocked.length})` : t === "progress" ? "In Progress" : "Leaderboard"}
            </button>
          ))}
        </div>

        {tab === "leaderboard" ? (
          <Reveal>
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2"><Trophy size={20} /> Achievement Leaderboard</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {LEADERBOARD.map(entry => (
                  <div key={entry.rank} className={`p-4 flex items-center gap-4 ${entry.rank <= 3 ? "bg-yellow-50/30" : ""}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${entry.rank === 1 ? "bg-yellow-400 text-yellow-900" : entry.rank === 2 ? "bg-neutral-300 text-neutral-700" : entry.rank === 3 ? "bg-amber-600 text-white" : "bg-neutral-100 text-neutral-500"}`}>{entry.rank}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-primary-800">{entry.name}</p>
                      <p className="text-xs text-neutral-500">{entry.badges} badges earned</p>
                    </div>
                    <span className="font-bold text-primary-600">{entry.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Filters */}
            <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
              <select value={category} onChange={e => setCategory(e.target.value)} className="select-field text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select>
              <select value={rarity} onChange={e => setRarity(e.target.value)} className="select-field text-sm">
                <option value="All">All Rarities</option>
                {["common", "uncommon", "rare", "epic", "legendary"].map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>

            {/* Badge Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(badge => {
                const rc = RARITY_COLORS[badge.rarity];
                return (
                  <Reveal key={badge.id}>
                    <div className={`card p-4 border-2 ${rc.border} ${rc.bg} ${rc.glow} relative ux-hover-lift-sm ${!badge.unlocked ? "opacity-80" : ""}`}>
                      {!badge.unlocked && <div className="absolute top-2 right-2"><Lock size={14} className="text-neutral-400" /></div>}
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${rc.text} ${rc.bg} border ${rc.border}`}>{badge.rarity}</span>
                      </div>
                      <h3 className="font-bold text-primary-800">{badge.name}</h3>
                      <p className="text-xs text-neutral-600 mt-1">{badge.description}</p>
                      <p className="text-[11px] text-neutral-400 mt-1">{badge.requirement}</p>
                      {/* Progress bar */}
                      {badge.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] text-neutral-500"><span>{badge.progress}%</span><span>{badge.earnedBy} earned</span></div>
                          <div className="h-1.5 bg-neutral-200 rounded-full mt-0.5"><div className={`h-1.5 rounded-full ${badge.unlocked ? "bg-green-500" : "bg-primary-400"}`} style={{ width: `${badge.progress}%` }} /></div>
                        </div>
                      )}
                      {badge.unlocked && <div className="mt-2 text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Earned!</div>}
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="card p-8 text-center"><Award size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No badges match your filters.</p></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
