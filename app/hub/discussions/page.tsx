"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUp, CheckCircle, ChevronDown, Clock, Filter, Loader2, MessageCircle,
  Pin, Plus, Search, ThumbsUp, Users
} from "lucide-react";
import { supabase, discussionsApi } from "@/lib/api";

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

interface Discussion {
  id: string; title: string; author: string; avatar: string; category: string;
  date: string; replies: number; views: number; upvotes: number;
  pinned: boolean; solved: boolean; tags: string[];
  lastReply: { author: string; date: string };
  preview: string;
}

const SEED_DISCUSSIONS: Discussion[] = [
  { id: "d1", title: "Best practices for running a successful fundraiser?", author: "Emma W.", avatar: "EW", category: "Tips & Advice", date: "2026-01-25", replies: 18, views: 245, upvotes: 32, pinned: true, solved: true, tags: ["Fundraising", "Events"], lastReply: { author: "Mrs. Johnson", date: "2026-01-28" }, preview: "We've been trying different approaches for our spring fundraiser. What's worked best for your club? We raised $3,000 last year with..." },
  { id: "d2", title: "How to recruit more freshmen to STEM clubs?", author: "Marcus C.", avatar: "MC", category: "Recruitment", date: "2026-01-23", replies: 12, views: 189, upvotes: 24, pinned: false, solved: false, tags: ["Recruitment", "STEM"], lastReply: { author: "Alex R.", date: "2026-01-27" }, preview: "Our robotics club has been struggling with freshman recruitment. We do demos at the activities fair but most freshmen seem intimidated..." },
  { id: "d3", title: "Meeting format ideas to increase attendance", author: "Sarah K.", avatar: "SK", category: "Tips & Advice", date: "2026-01-20", replies: 25, views: 312, upvotes: 41, pinned: true, solved: false, tags: ["Meetings", "Engagement"], lastReply: { author: "Priya M.", date: "2026-01-26" }, preview: "We switched from lecture-style meetings to workshop format and saw a 40% increase in attendance. What creative formats have you tried?" },
  { id: "d4", title: "Cross-club collaboration: interested in a joint community service day?", author: "Aiden P.", avatar: "AP", category: "Collaboration", date: "2026-01-22", replies: 8, views: 156, upvotes: 19, pinned: false, solved: false, tags: ["Service", "Collaboration"], lastReply: { author: "Maya W.", date: "2026-01-25" }, preview: "Planning a school-wide service day in April. Looking for 5+ clubs to partner. Each club would lead a station..." },
  { id: "d5", title: "How do you handle conflicts between club members?", author: "Jordan K.", avatar: "JK", category: "Leadership", date: "2026-01-18", replies: 15, views: 278, upvotes: 28, pinned: false, solved: true, tags: ["Leadership", "Conflict Resolution"], lastReply: { author: "Dr. Chen", date: "2026-01-24" }, preview: "Had a situation where two officers disagreed on the direction of a project. It was affecting the whole team dynamic..." },
  { id: "d6", title: "Suggestions for TSA competition prep?", author: "Dev G.", avatar: "DG", category: "Competitions", date: "2026-01-15", replies: 20, views: 340, upvotes: 35, pinned: false, solved: true, tags: ["TSA", "Competition", "Preparation"], lastReply: { author: "Jason L.", date: "2026-01-22" }, preview: "State conference is coming up in April. What are the best resources for preparing for events like Webmaster and Coding?" },
  { id: "d7", title: "Budget management tools for club treasurers", author: "Taylor N.", avatar: "TN", category: "Tips & Advice", date: "2026-01-12", replies: 9, views: 134, upvotes: 15, pinned: false, solved: false, tags: ["Budget", "Tools"], lastReply: { author: "Robert T.", date: "2026-01-19" }, preview: "Looking for recommendations on simple tools to track club finances. We've been using spreadsheets but it's getting messy..." },
  { id: "d8", title: "Advisor appreciation ideas?", author: "Lily M.", avatar: "LM", category: "General", date: "2026-01-10", replies: 22, views: 267, upvotes: 44, pinned: false, solved: false, tags: ["Advisors", "Appreciation"], lastReply: { author: "Chris L.", date: "2026-01-18" }, preview: "Our advisor goes above and beyond. We want to do something special at the end of the year. What has your club done?" },
];

const DISCUSSIONS_LS_KEY = "clubconnect_discussions";

function loadDiscussions(): Discussion[] {
  if (typeof window === "undefined") return SEED_DISCUSSIONS;
  try {
    const raw = localStorage.getItem(DISCUSSIONS_LS_KEY);
    if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
  } catch {}
  return SEED_DISCUSSIONS;
}

export default function DiscussionsPage() {
  const router = useRouter();
  const [discussions, setDiscussions] = useState<Discussion[]>(loadDiscussions);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "replies">("recent");
  const [showNew, setShowNew] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  // New discussion form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Tips & Advice");
  const [newTags, setNewTags] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    localStorage.setItem(DISCUSSIONS_LS_KEY, JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled && user) setCurrentUserId(user.id);
      try {
        const { data } = await discussionsApi.getAll();
        if (!cancelled && data && data.length > 0) {
          const dbDiscs: Discussion[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            author: d.profiles?.name || "Anonymous",
            avatar: (d.profiles?.name || "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2),
            category: d.category || "General",
            date: d.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            replies: d.reply_count || 0,
            views: d.view_count || 0,
            upvotes: d.vote_count || 0,
            pinned: d.is_pinned || false,
            solved: false,
            tags: d.tags || [],
            lastReply: { author: "—", date: d.updated_at?.split("T")[0] || d.created_at?.split("T")[0] || "" },
            preview: (d.content || "").slice(0, 160),
          }));
          const existingIds = new Set(SEED_DISCUSSIONS.map(s => s.id));
          const newFromDb = dbDiscs.filter(d => !existingIds.has(d.id));
          setDiscussions(prev => {
            const localOnly = prev.filter(p => !SEED_DISCUSSIONS.some(s => s.id === p.id) && !newFromDb.some(n => n.id === p.id));
            return [...newFromDb, ...localOnly, ...SEED_DISCUSSIONS];
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const categories = ["All", ...Array.from(new Set(discussions.map(d => d.category)))];

  const filtered = discussions.filter(d => {
    if (category !== "All" && d.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)) || d.preview.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sortBy === "popular") return b.upvotes - a.upvotes;
    if (sortBy === "replies") return b.replies - a.replies;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalReplies = discussions.reduce((s, d) => s + d.replies, 0);

  async function handlePostDiscussion() {
    if (!currentUserId) { router.push("/portal"); return; }
    if (!newTitle.trim() || !newContent.trim() || submitting) return;
    setSubmitting(true);
    const tags = newTags.split(",").map(t => t.trim()).filter(Boolean);
    const newDisc: Discussion = {
      id: `local-${Date.now()}`, title: newTitle.trim(), author: "You", avatar: "Y",
      category: newCategory, date: new Date().toISOString().split("T")[0],
      replies: 0, views: 0, upvotes: 0, pinned: false, solved: false, tags,
      lastReply: { author: "—", date: "" }, preview: newContent.trim().slice(0, 160),
    };
    try {
      if (currentUserId) {
        const { data } = await discussionsApi.create({ author_id: currentUserId, title: newTitle.trim(), content: newContent.trim() });
        if (data) newDisc.id = (data as any).id;
      }
    } catch (e) { console.error("DB save failed, keeping locally:", e); }
    setDiscussions(prev => [newDisc, ...prev]);
    setNewTitle(""); setNewContent(""); setNewTags(""); setShowNew(false);
    setSubmitting(false);
  }

  async function handleVote(discId: string) {
    if (!currentUserId) return;
    const wasVoted = myVotes.has(discId);
    setMyVotes(prev => { const n = new Set(prev); wasVoted ? n.delete(discId) : n.add(discId); return n; });
    setDiscussions(prev => prev.map(d => d.id === discId ? { ...d, upvotes: wasVoted ? d.upvotes - 1 : d.upvotes + 1 } : d));
    if (wasVoted) {
      await discussionsApi.removeVote(discId, currentUserId);
    } else {
      await discussionsApi.vote(discId, currentUserId, 1);
    }
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-900 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-violet-100 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-heading font-bold flex items-start gap-3"><MessageCircle size={28} className="sm:w-9 sm:h-9 shrink-0" /> Discussion Forums</h1>
          <p className="mt-3 max-w-2xl text-violet-50 text-lg">Ask questions, share advice, and connect with fellow club leaders and members.</p>
          <div className="mt-6 grid grid-cols-4 gap-3 max-w-lg">
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{discussions.length}</p><p className="text-xs text-violet-100">Topics</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{totalReplies}</p><p className="text-xs text-violet-100">Replies</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{discussions.filter(d => d.solved).length}</p><p className="text-xs text-violet-100">Solved</p></div>
            <div className="bg-white/10  p-3 text-center"><p className="text-xl font-bold">{categories.length - 1}</p><p className="text-xs text-violet-100">Categories</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {}
          <aside className="space-y-4 mb-6 lg:mb-0">
            <button onClick={() => setShowNew(!showNew)} className="btn-primary w-full text-sm flex items-center justify-center gap-2"><Plus size={16} /> New Discussion</button>
            <div className="card p-4">
              <h3 className="font-bold text-primary-700 text-sm mb-2">Categories</h3>
              <ul className="space-y-1">{categories.map(c => (
                <li key={c}><button onClick={() => setCategory(c)} className={`w-full text-left text-sm px-2 py-1  transition-colors ${category === c ? "bg-primary-100 text-primary-700 font-semibold" : "text-neutral-600 hover:bg-neutral-50"}`}>{c} {c !== "All" && <span className="text-neutral-400">({discussions.filter(d => d.category === c).length})</span>}</button></li>
              ))}</ul>
            </div>
            <div className="card p-4">
              <h3 className="font-bold text-primary-700 text-sm mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(discussions.flatMap(d => d.tags))).map(tag => (
                  <button key={tag} onClick={() => setSearch(tag)} className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100">#{tag}</button>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <h3 className="font-bold text-primary-700 text-sm mb-2">Guidelines</h3>
              <ul className="text-xs text-neutral-600 space-y-1">
                <li>• Be respectful and constructive</li>
                <li>• Search before posting duplicates</li>
                <li>• Mark helpful answers as solutions</li>
                <li>• Keep discussions school-appropriate</li>
              </ul>
            </div>
          </aside>

          {}
          <div className="lg:col-span-3 space-y-4">
            {}
            <div className="card p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" placeholder="Search discussions..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="select-field text-sm w-auto">
                <option value="recent">Most Recent</option><option value="popular">Most Popular</option><option value="replies">Most Replies</option>
              </select>
            </div>

            {showNew && (
              <Reveal>
                <div className="card p-5 border-2 border-violet-200">
                  <h3 className="font-bold text-primary-700 mb-3">Start a New Discussion</h3>
                  <input type="text" placeholder="Discussion title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className="input-field mb-3" />
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="select-field text-sm">{categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select>
                    <input type="text" placeholder="Tags (comma-separated)" value={newTags} onChange={e => setNewTags(e.target.value)} className="input-field text-sm" />
                  </div>
                  <textarea placeholder="Write your discussion..." value={newContent} onChange={e => setNewContent(e.target.value)} className="input-field h-24 resize-none mb-3" />
                  <div className="flex gap-2">
                    <button onClick={handlePostDiscussion} disabled={submitting || !newTitle.trim() || !newContent.trim()} className="btn-primary text-sm disabled:opacity-50 flex items-center gap-1">
                      {submitting ? <><Loader2 size={13} className="animate-spin" /> Posting…</> : "Post Discussion"}
                    </button>
                    <button onClick={() => setShowNew(false)} className="text-sm text-neutral-500 hover:text-neutral-700">Cancel</button>
                  </div>
                  {!currentUserId && <p className="text-xs text-red-500 mt-2">Sign in to post discussions.</p>}
                </div>
              </Reveal>
            )}

            {}
            {filtered.map(disc => (
              <Reveal key={disc.id}>
                <div className={`card p-5 ux-hover-lift-sm ${disc.pinned ? "border-l-4 border-primary-500" : ""}`}>
                  <div className="flex gap-4">
                    {}
                    <div className="flex flex-col items-center gap-0.5 min-w-[40px] text-center">
                      <ArrowUp size={16} onClick={() => handleVote(disc.id)} className={`cursor-pointer transition-colors ${myVotes.has(disc.id) ? "text-primary-600" : "text-neutral-400 hover:text-primary-600"}`} />
                      <span className="font-bold text-primary-700 text-sm">{disc.upvotes}</span>
                    </div>
                    {}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {disc.pinned && <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 flex items-center gap-1"><Pin size={10} /> Pinned</span>}
                        {disc.solved && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle size={10} /> Solved</span>}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{disc.category}</span>
                      </div>
                      <h3 className="font-bold text-primary-800 text-lg hover:text-primary-600 cursor-pointer">{disc.title}</h3>
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{disc.preview}</p>
                      <div className="flex flex-wrap gap-1 mt-2">{disc.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">#{t}</span>)}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-[10px] flex items-center justify-center font-bold">{disc.avatar}</span>
                          {disc.author}
                        </span>
                        <span>{new Date(disc.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} /> {disc.replies} replies</span>
                        <span>{disc.views} views</span>
                        <span>Last reply by {disc.lastReply.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            {filtered.length === 0 && (
              <div className="card p-8 text-center"><MessageCircle size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No discussions match your search.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
