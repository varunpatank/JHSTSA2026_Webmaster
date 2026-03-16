"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { announcements } from "@/lib/data";
import { Bell, Calendar, ChevronDown, Filter, Megaphone, Pin, Search, Tag } from "lucide-react";

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

const EXTRA_ANNOUNCEMENTS = [
  { id: "ea-1", title: "Spring Club Fair Registration Open", content: "All clubs must register by March 20 to participate in the Spring Club Fair on April 5. Set up your booth and showcase your achievements this year!", date: "2026-03-10", priority: "high" as const, category: "Events", author: "Activities Office" },
  { id: "ea-2", title: "Budget Submission Deadline Extended", content: "The deadline for submitting budget proposals for next year has been extended to March 28. Submit your itemized budget through the Resources page.", date: "2026-03-08", priority: "medium" as const, category: "Administrative", author: "Finance Office" },
  { id: "ea-3", title: "New Club Proposal Window", content: "Proposals for new clubs for the 2026-2027 school year are now being accepted. The review committee meets bi-weekly. Submit via the Start a Club page.", date: "2026-03-05", priority: "medium" as const, category: "General", author: "Activities Office" },
  { id: "ea-4", title: "Volunteer Hour Verification", content: "All service hours must be verified by March 31 to count toward this year's community service awards. Submit verification forms to your advisor.", date: "2026-03-01", priority: "low" as const, category: "Service", author: "Community Service Coord." },
  { id: "ea-5", title: "TSA State Conference Prep", content: "All TSA members competing at the state conference should attend the mandatory prep session on March 15. Room 204, 3:30 PM.", date: "2026-02-28", priority: "high" as const, category: "Competitions", author: "TSA Advisor" },
  { id: "ea-6", title: "Club Photo Day", content: "Official club photos for the yearbook will be taken on March 22. Sign up for your club's time slot on the Activities Office door.", date: "2026-02-25", priority: "low" as const, category: "General", author: "Yearbook Staff" },
];

type Priority = "high" | "medium" | "low";

export default function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const allAnnouncements = [
    ...EXTRA_ANNOUNCEMENTS,
    ...announcements.map(a => ({
      id: a.id, title: a.title, content: a.content || a.title,
      date: a.date, priority: (a.priority || "medium") as Priority,
      category: "General", author: a.author || "ClubConnect",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = ["All", ...Array.from(new Set(allAnnouncements.map(a => a.category)))];

  const filtered = allAnnouncements.filter(a => {
    if (priorityFilter !== "all" && a.priority !== priorityFilter) return false;
    if (categoryFilter !== "All" && a.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
    }
    return true;
  });

  const priorityColors: Record<Priority, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs sm:text-sm uppercase tracking-[0.12em] font-semibold text-primary-100">Stay Updated</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><Megaphone size={36} /> Announcements</h1>
          <p className="mt-3 max-w-2xl text-primary-100 text-lg">Important updates, deadlines, and news from clubs, advisors, and the Activities Office.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="card p-5 grid sm:grid-cols-4 gap-4 mb-6">
          <div className="sm:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search announcements..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as Priority | "all")} className="select-field">
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="select-field">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <p className="text-sm text-neutral-600 mb-4">{filtered.length} announcement{filtered.length !== 1 ? "s" : ""}</p>

        {/* Pinned / High Priority */}
        {filtered.filter(a => a.priority === "high").length > 0 && (
          <Reveal>
            <div className="mb-6 space-y-3">
              <h2 className="text-sm font-bold text-red-600 flex items-center gap-1 uppercase tracking-wider"><Pin size={14} /> Priority Announcements</h2>
              {filtered.filter(a => a.priority === "high").map(a => (
                <div key={a.id} className="card p-5 border-l-4 border-red-500 bg-gradient-to-r from-red-50/50 to-white ux-hover-lift-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityColors.high}`}>Urgent</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">{a.category}</span>
                      </div>
                      <h3 className="font-bold text-primary-800 text-lg">{a.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{a.content}</p>
                      <p className="text-xs text-neutral-400 mt-2">{a.author} · {new Date(a.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* All Announcements */}
        <div className="space-y-3">
          {filtered.filter(a => a.priority !== "high").map(a => (
            <Reveal key={a.id}>
              <div className="card p-5 ux-hover-lift-sm">
                <div className="flex items-start gap-4">
                  <div className="text-center bg-primary-500 text-white p-2 min-w-[48px]  shrink-0">
                    <div className="text-[10px]">{new Date(a.date).toLocaleDateString("en-US", { month: "short" })}</div>
                    <div className="text-lg font-bold">{new Date(a.date).getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityColors[a.priority]}`}>{a.priority}</span>
                      <span className="text-xs text-neutral-500">{a.category}</span>
                    </div>
                    <h3 className="font-bold text-primary-700">{a.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{a.content}</p>
                    <p className="text-xs text-neutral-400 mt-2">{a.author}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <Bell size={40} className="mx-auto text-neutral-300" />
            <p className="mt-3 text-neutral-500">No announcements match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
