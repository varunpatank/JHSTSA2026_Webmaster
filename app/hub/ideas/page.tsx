"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUp, ArrowDown, ChevronDown, Filter, Lightbulb, Loader2, MessageCircle, Plus,
  Search, Star, ThumbsUp, Trash2, Users, Zap
} from "lucide-react";
import { supabase, clubIdeasApi } from "@/lib/api";
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

interface ClubIdea {
  id: string; title: string; description: string; category: string;
  proposedBy: string; date: string; upvotes: number; comments: number;
  status: "open" | "in-review" | "approved" | "forming";
  interestCount: number; tags: string[];
}

const SEED_IDEAS: ClubIdea[] = [
  { id: "i1", title: "Astronomy & Stargazing Club", description: "Weekly observation sessions with telescopes, astrophotography workshops, and planetarium trips. Partner with UW astronomy department for guest lectures.", category: "STEM", proposedBy: "Alex R.", date: "2025-12-10", upvotes: 42, comments: 8, status: "approved", interestCount: 35, tags: ["Science", "Outdoors", "Photography"] },
  { id: "i2", title: "Financial Literacy Club", description: "Learn investing, budgeting, and personal finance through simulated trading competitions and guest speakers from local finance firms.", category: "Academic", proposedBy: "Jordan K.", date: "2026-01-05", upvotes: 38, comments: 12, status: "forming", interestCount: 28, tags: ["Business", "Life Skills", "Competition"] },
  { id: "i3", title: "Esports & Game Development", description: "Competitive gaming teams for League of Legends, Valorant, and Rocket League, plus game development workshops using Unity and Godot.", category: "Technology", proposedBy: "Sam T.", date: "2026-01-12", upvotes: 67, comments: 23, status: "in-review", interestCount: 52, tags: ["Gaming", "Programming", "Competition"] },
  { id: "i4", title: "Cultural Exchange Club", description: "Celebrate global cultures through food festivals, language exchanges, film screenings, and partnerships with international student organizations.", category: "Cultural", proposedBy: "Priya M.", date: "2025-11-28", upvotes: 29, comments: 6, status: "approved", interestCount: 22, tags: ["Culture", "Food", "Languages"] },
  { id: "i5", title: "Podcast & Broadcasting", description: "Produce a school podcast covering student life, interview staff, create audio stories. Equipment provided through media department.", category: "Arts", proposedBy: "Chris L.", date: "2026-01-18", upvotes: 24, comments: 5, status: "open", interestCount: 18, tags: ["Media", "Communication", "Technology"] },
  { id: "i6", title: "Urban Gardening & Sustainability", description: "Maintain school garden beds, composting program, and educate about sustainable food systems. Sell produce at farmer's market fundraisers.", category: "Service", proposedBy: "Maya W.", date: "2026-01-20", upvotes: 31, comments: 7, status: "open", interestCount: 20, tags: ["Environment", "Service", "Outdoors"] },
  { id: "i7", title: "Maker Space & 3D Printing", description: "Open lab hours for 3D printing, laser cutting, Arduino projects, and collaborative making. Host monthly showcase events.", category: "STEM", proposedBy: "Drew H.", date: "2026-01-08", upvotes: 45, comments: 10, status: "in-review", interestCount: 38, tags: ["Engineering", "Design", "Hands-on"] },
  { id: "i8", title: "Mental Health Advocates", description: "Peer support network, stress management workshops, mindfulness sessions, and collaboration with school counselors on awareness campaigns.", category: "Service", proposedBy: "Taylor N.", date: "2026-01-22", upvotes: 55, comments: 15, status: "open", interestCount: 41, tags: ["Wellness", "Service", "Community"] },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: "Open for Votes", color: "bg-blue-100 text-blue-700" },
  "in-review": { label: "Under Review", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  forming: { label: "Now Forming!", color: "bg-purple-100 text-purple-700" },
};

const IDEAS_LS_KEY = "clubconnect_ideas";

function loadIdeas(): ClubIdea[] {
  if (typeof window === "undefined") return SEED_IDEAS;
  try {
    const raw = localStorage.getItem(IDEAS_LS_KEY);
    if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
  } catch {}
  return SEED_IDEAS;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<ClubIdea[]>(loadIdeas);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"upvotes" | "newest" | "interest">("newest");
  const [showForm, setShowForm] = useState(false);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("STEM");
  const [formDescription, setFormDescription] = useState("");
  const [formTags, setFormTags] = useState("");

  useEffect(() => {
    localStorage.setItem(IDEAS_LS_KEY, JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled && user) setCurrentUserId(user.id);
      try {
        const { data } = await clubIdeasApi.getAll();
        if (!cancelled && data && data.length > 0) {
          const dbIdeas: ClubIdea[] = data.map((d: any) => ({
            id: d.id, title: d.title, description: d.description || "",
            category: d.category || "General",
            proposedBy: d.profiles?.name || "Anonymous",
            date: d.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            upvotes: d.votes || 0, comments: 0, status: "open" as const,
            interestCount: d.votes || 0, tags: [],
          }));
          const existingIds = new Set(SEED_IDEAS.map(s => s.id));
          const newFromDb = dbIdeas.filter(d => !existingIds.has(d.id));
          setIdeas(prev => {
            const localOnlyIds = new Set(prev.filter(p => !SEED_IDEAS.some(s => s.id === p.id) && !newFromDb.some(n => n.id === p.id)).map(p => p.id));
            const localOnly = prev.filter(p => localOnlyIds.has(p.id));
            return [...newFromDb, ...localOnly, ...SEED_IDEAS];
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const categories = ["All", ...Array.from(new Set(ideas.map(i => i.category)))];
  const statuses = ["All", "open", "in-review", "approved", "forming"];

  const filtered = ideas.filter(i => {
    if (category !== "All" && i.category !== category) return false;
    if (statusFilter !== "All" && i.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "upvotes") return b.upvotes - a.upvotes;
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.interestCount - a.interestCount;
  });

  async function handleVote(id: string) {
    if (!currentUserId) { alert("Please sign in to vote."); return; }
    const wasVoted = myVotes.has(id);
    setMyVotes(prev => { const n = new Set(prev); wasVoted ? n.delete(id) : n.add(id); return n; });
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, upvotes: wasVoted ? i.upvotes - 1 : i.upvotes + 1 } : i));
    if (wasVoted) { await clubIdeasApi.removeVote(id, currentUserId); }
    else { await clubIdeasApi.vote(id, currentUserId, 1); }
  }

  async function handleSubmitIdea() {
    if (!currentUserId) { alert("Please sign in to submit ideas."); return; }
    if (!formTitle.trim() || !formDescription.trim() || submitting) return;
    setSubmitting(true);
    const newIdea: ClubIdea = {
      id: `local-${Date.now()}`, title: formTitle.trim(), description: formDescription.trim(),
      category: formCategory, proposedBy: "You", date: new Date().toISOString().split("T")[0],
      upvotes: 0, comments: 0, status: "open", interestCount: 0,
      tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
    };
    try {
      if (currentUserId) {
        const { data } = await clubIdeasApi.create({ author_id: currentUserId, title: formTitle.trim(), description: formDescription.trim(), category: formCategory });
        if (data) newIdea.id = (data as any).id;
      }
    } catch (e) { console.error("DB save failed, keeping locally:", e); }
    setIdeas(prev => [newIdea, ...prev]);
    setFormTitle(""); setFormDescription(""); setFormTags(""); setShowForm(false);
    setSubmitting(false);
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative overflow-hidden text-white border-b-4 border-emerald-300" style={{ background: "#059669" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 19px)" }}
        />
        <StageBannerPattern patternId="ideas-tool-banner-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 relative z-10">
          <Link href="/hub" className="text-sm text-white/90 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3 drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]"><Lightbulb size={36} /> Club Ideas</h1>
          <p className="mt-3 max-w-2xl text-white/90 text-lg">Propose new clubs, vote on ideas, and help shape the future of our school community.</p>
          <div className="mt-6 flex gap-3">
            <div className="bg-white/15 px-4 py-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{ideas.length}</p><p className="text-xs text-white/85">Ideas</p></div>
            <div className="bg-white/15 px-4 py-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{ideas.reduce((s, i) => s + i.upvotes, 0)}+</p><p className="text-xs text-white/85">Total Votes</p></div>
            <div className="bg-white/15 px-4 py-3 text-center rounded-2xl border border-white/25"><p className="text-xl font-bold">{ideas.filter(i => i.status === "forming").length}</p><p className="text-xs text-white/85">Now Forming</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {}
          <aside className="space-y-4 mb-6 lg:mb-0">
            <div className="card p-4">
              <h3 className="font-bold text-primary-700 mb-2 text-sm uppercase tracking-wider">Filters</h3>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" placeholder="Search ideas..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
              </div>
              <label className="text-xs text-neutral-500 font-semibold block mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="select-field text-sm mb-3">{categories.map(c => <option key={c}>{c}</option>)}</select>
              <label className="text-xs text-neutral-500 font-semibold block mb-1">Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select-field text-sm mb-3">{statuses.map(s => <option key={s} value={s}>{s === "All" ? "All" : STATUS_LABELS[s]?.label}</option>)}</select>
              <label className="text-xs text-neutral-500 font-semibold block mb-1">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="select-field text-sm">
                <option value="upvotes">Most Votes</option><option value="newest">Newest First</option><option value="interest">Most Interest</option>
              </select>
            </div>
            <div className="card p-4">
              <h3 className="font-bold text-primary-700 mb-2 text-sm">💡 How It Works</h3>
              <ol className="text-xs text-neutral-600 space-y-2"><li><strong>1.</strong> Submit your club idea</li><li><strong>2.</strong> Community votes on proposals</li><li><strong>3.</strong> Ideas with 30+ votes get reviewed</li><li><strong>4.</strong> Approved clubs start forming!</li></ol>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary w-full text-sm flex items-center justify-center gap-2"><Plus size={16} /> Propose New Idea</button>
          </aside>

          {}
          <div className="lg:col-span-3 space-y-4">
            {showForm && (
              <Reveal>
                <div className="card p-5 border-2 border-secondary-200">
                  <h3 className="font-bold text-primary-700 mb-3">Submit a New Club Idea</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Club Name" value={formTitle} onChange={e => setFormTitle(e.target.value)} className="input-field" />
                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="select-field">{categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <textarea placeholder="Describe your club idea, activities, and why students would join..." value={formDescription} onChange={e => setFormDescription(e.target.value)} className="input-field mt-3 h-24 resize-none" />
                  <input type="text" placeholder="Tags (comma-separated)" value={formTags} onChange={e => setFormTags(e.target.value)} className="input-field mt-3" />
                  <div className="mt-3 flex gap-2">
                    <button onClick={handleSubmitIdea} disabled={submitting || !formTitle.trim() || !formDescription.trim()} className="btn-primary text-sm disabled:opacity-50 flex items-center gap-1">{submitting ? <><Loader2 size={13} className="animate-spin" /> Submitting…</> : "Submit Idea"}</button>
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700">Cancel</button>
                  </div>
                  {!currentUserId && <p className="text-xs text-red-500 mt-2">Sign in to submit ideas.</p>}
                </div>
              </Reveal>
            )}

            <p className="text-sm text-neutral-500">{filtered.length} idea{filtered.length !== 1 ? "s" : ""}</p>

            {filtered.map((idea) => (
              <Reveal key={idea.id}>
                <div className="card p-5 ux-hover-lift-sm flex gap-4">
                  {}
                  <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    <button onClick={() => handleVote(idea.id)} className={`p-1 rounded hover:bg-primary-50 transition-colors ${myVotes.has(idea.id) ? "text-primary-600" : "text-neutral-400"}`}><ArrowUp size={20} /></button>
                    <span className="font-bold text-lg text-primary-700">{idea.upvotes}</span>
                    <span className="text-[10px] text-neutral-400">votes</span>
                  </div>
                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_LABELS[idea.status].color}`}>{STATUS_LABELS[idea.status].label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{idea.category}</span>
                    </div>
                    <h3 className="font-bold text-primary-800 text-lg">{idea.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{idea.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">{idea.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">#{t}</span>)}</div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                      <span>By {idea.proposedBy}</span>
                      <span>{new Date(idea.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={12} /> {idea.comments} comments</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {idea.interestCount} interested</span>
                      {idea.proposedBy === "You" && (
                        <button onClick={() => { if (confirm(`Delete "${idea.title}"?`)) setIdeas(prev => prev.filter(i => i.id !== idea.id)); }} className="ml-auto text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"><Trash2 size={12} /> Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            {filtered.length === 0 && (
              <div className="card p-8 text-center"><Lightbulb size={40} className="mx-auto text-neutral-300" /><p className="text-neutral-500 mt-3">No ideas match your filters.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
