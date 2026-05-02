"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BarChart2, BookOpen, Calendar, CheckSquare, ClipboardList,
  Download, FileText, Heart, HelpCircle, Lightbulb, MessageCircle,
  Search, Sparkles, Star, Target, Users, X,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { RESOURCES, CATEGORIES, STAGES, TYPE_COLORS, STAGE_COLORS, type ResourceType } from "@/lib/resourcesData";

const CAT_ICONS: Record<string, React.ElementType> = {
  "All":                    BookOpen,
  "Getting Started":        Lightbulb,
  "Recruiting & Promoting": Users,
  "Meetings & Operations":  ClipboardList,
  "Events & Funding":       Calendar,
  "Leadership & Legacy":    Target,
};

const TOOLS = [
  { label: "Goal Tracker",       href: "/hub/goals",       icon: Target,        color: "bg-blue-500",    border: "border-l-blue-400",    prompt: "What is your top goal this month?",           placeholder: "Ex: Reach 25 active members",            queryParam: "goal" },
  { label: "Events Calendar",    href: "/events",          icon: Calendar,      color: "bg-emerald-500", border: "border-l-emerald-400",  prompt: "What event are you planning next?",           placeholder: "Ex: Spring coding workshop",             queryParam: "event" },
  { label: "Club Health",        href: "/hub/health",      icon: Heart,         color: "bg-violet-500",  border: "border-l-violet-400",   prompt: "What part of your club needs attention?",     placeholder: "Ex: Meeting attendance",                 queryParam: "focus" },
  { label: "Compare Clubs",      href: "/hub/compare",     icon: BarChart2,     color: "bg-rose-500",    border: "border-l-rose-400",     prompt: "Which club do you want to compare with?",     placeholder: "Ex: Robotics Club",                      queryParam: "club" },
  { label: "Club Guides",        href: "/guides",          icon: BookOpen,      color: "bg-teal-500",    border: "border-l-teal-400",     prompt: "What topic do you need a guide for?",         placeholder: "Ex: Officer elections",                  queryParam: "topic" },
  { label: "Find Collaborators", href: "/hub/collaborate", icon: Users,         color: "bg-purple-500",  border: "border-l-purple-400",   prompt: "Who are you hoping to collaborate with?",     placeholder: "Ex: STEM clubs",                         queryParam: "group" },
  { label: "Discussions",        href: "/hub/discussions", icon: MessageCircle, color: "bg-pink-500",    border: "border-l-pink-400",     prompt: "What would you like to discuss?",             placeholder: "Ex: Fundraising ideas",                  queryParam: "topic" },
  { label: "Club Wizard Guide",  href: "/start-a-club",    icon: Sparkles,      color: "bg-indigo-500",  border: "border-l-indigo-400",   prompt: "What club idea are you exploring?",           placeholder: "Ex: Cybersecurity club",                 queryParam: "idea" },
  { label: "Ideas Board",        href: "/hub/ideas",       icon: Lightbulb,     color: "bg-green-500",   border: "border-l-green-400",    prompt: "What challenge do you want ideas for?",       placeholder: "Ex: Recruiting new members",             queryParam: "challenge" },
  { label: "Club Finder Quiz",   href: "/hub/quiz",        icon: HelpCircle,    color: "bg-fuchsia-500", border: "border-l-fuchsia-400",  prompt: "What are you most interested in?",            placeholder: "Ex: Leadership and public speaking",     queryParam: "interest" },
];

const STAGE_TO_TOOL_LABELS: Record<string, string[]> = {
  Beginner: ["Club Wizard Guide", "Club Guides", "Goal Tracker", "Club Finder Quiz"],
  Growing: ["Find Collaborators", "Discussions", "Ideas Board", "Events Calendar"],
  Active: ["Events Calendar", "Club Health", "Compare Clubs", "Goal Tracker"],
  Advanced: ["Compare Clubs", "Goal Tracker", "Club Health", "Discussions"],
};

const TYPE_ICONS: Record<ResourceType, React.ReactNode> = {
  guide: <BookOpen size={10} />, template: <FileText size={10} />,
  checklist: <CheckSquare size={10} />, handbook: <Users size={10} />,
};

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10} className={i <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"} />
      ))}
      <span className="ml-1 text-[10px] text-neutral-400 font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ResourcesPage() {
  const router = useRouter();
  const [category, setCategory] = useState("Getting Started");
  const [stage, setStage]       = useState("All Stages");
  const [query, setQuery]       = useState("");
  const [saved, setSaved]       = useState<Set<string>>(new Set());
  const [toolInputs, setToolInputs] = useState<Record<string, string>>({});

  const filtered = RESOURCES.filter(r => {
    const matchCat   = category === "All"        || r.category === category;
    const matchStage = stage    === "All Stages" || r.stage    === stage;
    const matchQ     = !query   || r.title.toLowerCase().includes(query.toLowerCase()) ||
                       r.tags.some(t => t.includes(query.toLowerCase()));
    return matchCat && matchStage && matchQ;
  });

  const toggleSave = (id: string) => setSaved(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const hasFilters = category !== "All" || stage !== "All Stages" || !!query;
  const stageToolLabels = stage === "All Stages"
    ? ["Club Wizard Guide", "Goal Tracker", "Events Calendar", "Club Guides"]
    : (STAGE_TO_TOOL_LABELS[stage] ?? []);
  const visibleTools = TOOLS.filter((tool) => stageToolLabels.includes(tool.label));

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-cream-200 min-h-screen diagonal-texture-light">

      <HeroSection
        eyebrow="Community Resources"
        title="Resource"
        highlightWord="Directory"
        description="Want to start your own school club or community organization? Here are resources to help you get started for every stage."
        texture="diagonal"
        images={[
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=75",
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-8 items-start">

          {/* -- LEFT SIDEBAR -- */}
          <aside className="w-[240px] shrink-0 sticky top-20 space-y-4">

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search resources..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-cream-300 bg-white text-sm text-primary-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-secondary-400/30 focus:border-secondary-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Category</p>
              </div>
              {CATEGORIES.map(cat => {
                const Icon = CAT_ICONS[cat] ?? BookOpen;
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm ${
                      active
                        ? "bg-primary-800 text-white font-semibold"
                        : "text-neutral-600 hover:bg-cream-100 hover:text-primary-700"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-secondary-300" : "text-neutral-400"} />
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Stage filter */}
            <div className="bg-white rounded-2xl border border-cream-300 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">Club Stage</p>
              <div className="space-y-1.5">
                {STAGES.map(s => {
                  const active = stage === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                        active
                          ? (STAGE_COLORS[s] ?? "bg-primary-800 text-white") + " font-bold"
                          : "text-neutral-600 hover:bg-cream-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-current opacity-70" : "bg-neutral-300"}`} />
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={() => { setCategory("All"); setStage("All Stages"); setQuery(""); }}
                className="w-full py-2 rounded-2xl border border-dashed border-red-200 text-red-400 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <X size={12} /> Clear all filters
              </button>
            )}
          </aside>

          {/* -- MAIN CONTENT -- */}
          <main className="flex-1 min-w-0 space-y-8">

            {/* Tools */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-600 mb-1">Interactive Tools</p>
              <h2 className="text-base font-heading font-bold text-primary-800 mb-1">Stage-specific tools</h2>
              <p className="text-xs text-neutral-500 mb-4">
                {stage === "All Stages"
                  ? "Select a club stage on the left to narrow these tools to the most relevant set."
                  : `Showing tools for ${stage} clubs.`}
              </p>
              <div className="grid lg:grid-cols-2 gap-3">
                {visibleTools.map(tool => {
                  const Icon = tool.icon;
                  const toolValue = toolInputs[tool.label] ?? "";
                  const handleToolSubmit = (e: React.FormEvent) => {
                    e.preventDefault();
                    const value = toolValue.trim();
                    const href = value
                      ? `${tool.href}?${tool.queryParam}=${encodeURIComponent(value)}`
                      : tool.href;
                    router.push(href);
                  };
                  return (
                    <div
                      key={tool.label}
                      className={`bg-white rounded-2xl border border-l-4 border-cream-200 ${tool.border} px-3.5 py-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all group`}
                    >
                      <div className="flex items-start gap-3 mb-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tool.color} text-white`}>
                          <Icon size={15} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary-700 leading-tight">{tool.label}</p>
                          <p className="text-[11px] text-neutral-500 mt-1">{tool.prompt}</p>
                        </div>
                      </div>
                      <form onSubmit={handleToolSubmit} className="flex items-center gap-2">
                        <input
                          value={toolValue}
                          onChange={(e) => setToolInputs((prev) => ({ ...prev, [tool.label]: e.target.value }))}
                          placeholder={tool.placeholder}
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-cream-300 text-xs text-primary-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-secondary-400/25 focus:border-secondary-400"
                        />
                        <button
                          type="submit"
                          className="shrink-0 px-3 py-2 rounded-xl bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold transition-colors"
                        >
                          Go
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider + count */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-cream-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {filtered.length} Resource{filtered.length !== 1 ? "s" : ""}
                {category !== "All" && ` · ${category}`}
              </p>
              <div className="flex-1 h-px bg-cream-400" />
              <Link
                href="/portal?tab=resource"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
              >
                <span className="text-base leading-none">+</span> Add Resource
              </Link>
            </div>

            {/* Resource grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-cream-300">
                <p className="text-4xl mb-3">??</p>
                <p className="font-bold text-primary-800 mb-1">No resources found</p>
                <p className="text-sm text-neutral-500">Try adjusting your filters or search.</p>
                <button onClick={() => { setCategory("All"); setStage("All Stages"); setQuery(""); }}
                  className="mt-4 text-sm font-semibold text-primary-600 hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.11)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-primary-900">
                      <Image src={r.img} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/65 to-transparent" />
                      <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${TYPE_COLORS[r.type]}`}>
                        {TYPE_ICONS[r.type]} {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                      </span>
                      <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${STAGE_COLORS[r.stage] ?? "bg-neutral-100 text-neutral-600"}`}>
                        {r.stage}
                      </span>
                      <button
                        onClick={() => toggleSave(r.id)}
                        className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors text-xs font-bold ${
                          saved.has(r.id) ? "bg-secondary-500 text-white" : "bg-white/80 text-neutral-600 hover:bg-white"
                        }`}
                      >
                        {saved.has(r.id) ? "?" : "?"}
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary-400 mb-1">{r.category}</span>
                      <h3 className="font-heading font-bold text-primary-800 text-sm mb-1.5 leading-snug group-hover:text-secondary-700 transition-colors">{r.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed mb-3 flex-1 line-clamp-2">{r.details}</p>
                      <div className="flex items-center justify-between border-t border-cream-200 pt-3 mt-auto">
                        <StarRow rating={r.rating} />
                        <span className="flex items-center gap-1 text-[10px] text-neutral-400"><Download size={9} /> {r.downloads}</span>
                      </div>
                      <Link href={`/resources/${r.id}`}
                        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cream-100 hover:bg-primary-800 hover:text-white text-primary-700 text-xs font-bold transition-colors">
                        View Details <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggest Resources CTA */}
            <div className="bg-primary-900 rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.15) 18px, rgba(255,255,255,0.15) 19px)" }} />
              <div className="flex-1 relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-400 mb-1">Missing something?</p>
                <h3 className="font-heading font-bold text-lg mb-1">Suggest a Resource</h3>
                <p className="text-sm text-primary-200 leading-relaxed">Know a guide, template, or handbook that would help other clubs? Share it via the portal.</p>
              </div>
              <Link href="/portal"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary-500 hover:bg-secondary-400 text-white font-bold text-sm transition-colors shadow-md relative z-10">
                Go to Portal <ArrowRight size={14} />
              </Link>
            </div>

          </main>
        </div>
      </div>
      </div>
    </div>
  );
}
