"use client";

import { useState, useEffect, useRef } from "react";
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
import { getCreatedResources } from "@/lib/clientState";
import { resourcesApi } from "@/lib/api";

const CAT_ICONS: Record<string, React.ElementType> = {
  "All":                    BookOpen,
  "Getting Started":        Lightbulb,
  "Recruiting & Promoting": Users,
  "Meetings & Operations":  ClipboardList,
  "Events & Funding":       Calendar,
  "Leadership & Legacy":    Target,
  "Community":              Heart,
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

function BannerPattern({ patternId }: { patternId: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} x="0" y="0" width="520" height="300" patternUnits="userSpaceOnUse">
            <path d="M-20,80 C60,40 120,120 200,90 C280,60 320,130 400,100 C460,78 500,110 540,95" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" fill="none"/>
            <path d="M-20,160 C50,130 100,180 180,155 C260,130 310,175 390,150 C450,132 490,165 540,148" stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none"/>
            <path d="M-20,240 C70,210 140,255 220,230 C300,205 360,248 440,222 C490,207 520,232 540,220" stroke="rgba(255,255,255,0.06)" strokeWidth="1.8" fill="none"/>
            <ellipse cx="80" cy="60" rx="48" ry="32" fill="rgba(255,255,255,0.045)" />
            <ellipse cx="300" cy="200" rx="60" ry="38" fill="rgba(255,255,255,0.035)" />
            <ellipse cx="450" cy="80" rx="42" ry="28" fill="rgba(255,255,255,0.04)" />
            <g opacity="0.30" fill="white">
              <circle cx="460" cy="30" r="2.2"/><circle cx="470" cy="30" r="2.2"/><circle cx="480" cy="30" r="2.2"/>
              <circle cx="460" cy="40" r="2.2"/><circle cx="470" cy="40" r="2.2"/><circle cx="480" cy="40" r="2.2"/>
              <circle cx="460" cy="50" r="2.2"/><circle cx="470" cy="50" r="2.2"/><circle cx="480" cy="50" r="2.2"/>
            </g>
            <g opacity="0.25" fill="white">
              <circle cx="20" cy="230" r="2"/><circle cx="30" cy="230" r="2"/><circle cx="40" cy="230" r="2"/>
              <circle cx="20" cy="240" r="2"/><circle cx="30" cy="240" r="2"/><circle cx="40" cy="240" r="2"/>
              <circle cx="20" cy="250" r="2"/><circle cx="30" cy="250" r="2"/><circle cx="40" cy="250" r="2"/>
            </g>
            <circle cx="100" cy="185" r="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
            <circle cx="310" cy="55" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
            <circle cx="415" cy="245" r="6" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
            <circle cx="510" cy="190" r="8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

export default function ResourcesPage() {
  const router = useRouter();
  const resourcesSectionRef = useRef<HTMLDivElement | null>(null);
  const [category, setCategory] = useState("All");
  const [stage, setStage]       = useState("Beginner");
  const [query, setQuery]       = useState("");
  const [saved, setSaved]       = useState<Set<string>>(new Set());
  const [toolInputs, setToolInputs] = useState<Record<string, string>>({});
  const [communityResources, setCommunityResources] = useState<Array<(typeof RESOURCES)[number] & { source?: "local" | "db" }>>([]);
  const [createdIds, setCreatedIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("cc_deleted_resources");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setDeletedIds(new Set(parsed));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("cc_deleted_resources", JSON.stringify(Array.from(deletedIds)));
  }, [deletedIds]);

  // Auto-select "Community" from query param ?cat=Community
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat && CATEGORIES.includes(cat)) setCategory(cat);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldScroll = params.get("scroll") === "community";
    const cat = params.get("cat");
    if (!shouldScroll || cat !== "Community") return;

    const timer = window.setTimeout(() => {
      resourcesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);

    return () => window.clearTimeout(timer);
  }, []);

  // Load community resources from clientState + Supabase
  useEffect(() => {
    const TYPE_IMAGES: Record<string, string> = {
      guide:     "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
      template:  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
      checklist: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
      handbook:  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    };

    const local = getCreatedResources().map(r => ({
      id: r.id,
      title: r.title,
      details: r.description,
      type: (r.type as ResourceType) || "guide",
      category: "Community",
      stage: "Active",
      downloads: 0,
      format: "PDF",
      tags: [r.subject || "community"],
      img: r.imageUrl || TYPE_IMAGES[r.type] || TYPE_IMAGES.guide,
      rating: 5.0,
      saved: 0,
      downloadUrl: r.resourceUrl || undefined,
      source: "local" as const,
    })).filter((r) => !deletedIds.has(r.id));
    setCreatedIds(new Set(local.map(r => r.id)));

    // Also try Supabase
    resourcesApi.getAll().then(({ data }) => {
      if (data && data.length > 0) {
        const dbCommunity = (data as any[])
          .filter((r: any) => r.category === "Community")
          .map((r: any) => ({
            id: r.id,
            title: r.name || r.title || "Untitled",
            details: r.description || "",
            type: (r.type as ResourceType) || "guide",
            category: "Community",
            stage: "Active",
            downloads: r.downloads || 0,
            format: r.format || "PDF",
            tags: [],
            img: (typeof r.resource_link === "string" && /\.(png|jpe?g|webp|gif)(\?|$)/i.test(r.resource_link))
              ? r.resource_link
              : (TYPE_IMAGES[r.type] || TYPE_IMAGES.guide),
            rating: 5.0,
            saved: 0,
            downloadUrl: r.resource_link || undefined,
            source: "db" as const,
          }))
          .filter((r) => !deletedIds.has(r.id));
        // Merge: DB entries take priority; remove local duplicates by title
        const merged = [
          ...dbCommunity,
          ...local.filter(l => !dbCommunity.some((d: any) => d.title === l.title)),
        ];
        setCommunityResources(merged);
      } else {
        setCommunityResources(local);
      }
    }, () => setCommunityResources(local));
  }, [deletedIds]);

  const allResources = category === "Community"
    ? communityResources
    : RESOURCES;

  const filtered = allResources.filter(r => {
    const matchCat   = category === "All" || category === "Community" || r.category === category;
    const matchStage = category === "Community" || stage === "All Stages" || r.stage === stage;
    const matchQ     = !query || r.title.toLowerCase().includes(query.toLowerCase()) ||
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
      <div className="relative z-0 bg-cream-200 min-h-screen">

      <HeroSection
        eyebrow="Community Resources"
        title="Resource"
        highlightWord="Directory"
        description={<>Resources that help students create their own club at their school and take initiative of their passions.</>}
        texture="diagonal"
        images={[
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=75",
        ]}
        actions={
          <Link
            href="/portal?tab=resource"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-500 hover:bg-secondary-400 text-white font-bold text-sm transition-colors shadow-md"
          >
            <span className="text-base leading-none">+</span> Suggest a Resource
          </Link>
        }
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

            {/* Stage filter above category */}
            <div className="bg-white rounded-2xl border border-cream-300 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">Club Stage</p>
              <div className="space-y-1.5">
                {STAGES.map(s => {
                  const active = stage === s;
                  const dotColors: Record<string, string> = {
                    "All Stages": "bg-primary-900",
                    "Beginner": "bg-emerald-500",
                    "Growing": "bg-blue-500", 
                    "Active": "bg-amber-500",
                    "Advanced": "bg-purple-500"
                  };
                  return (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                        active
                          ? (STAGE_COLORS[s] ?? "bg-primary-900 text-white") + " font-bold"
                          : "text-neutral-600 hover:bg-cream-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-current opacity-70" : dotColors[s] || "bg-neutral-300"}`} />
                      {s}
                    </button>
                  );
                })}
              </div>
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
                        ? "bg-primary-900 text-white font-semibold"
                        : "text-neutral-600 hover:bg-cream-100 hover:text-primary-700"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-secondary-300" : "text-neutral-400"} />
                    {cat}
                  </button>
                );
              })}
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

            {/* ClubConnect Feature Tools */}
            <div>
              {/* Section header */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-secondary-600 mb-1">ClubConnect Feature Tools</p>
                <h2 className="text-3xl font-heading font-extrabold text-primary-900 leading-tight">A dedicated tool for every stage of your club</h2>
                <p className="mt-1.5 text-sm text-neutral-500 font-medium">No matter where your club is in its journey, ClubConnect has a built-in tool to help you level up.</p>
              </div>

              {/* Stage-aware banner cards */}
              {(() => {
                const toolCards = [
                  {
                    id: "t1",
                    stageKey: "Beginner",
                    name: "Ideas Board",
                    href: "/hub/ideas",
                    desc: "Turn early club concepts into clear, vote-backed plans your team can execute.",
                    outcomes: ["Collect ideas", "Rank by interest", "Start with confidence"],
                    stat: "156 ideas proposed this month",
                    solidBg: "#059669",   /* emerald-600 */
                    patternColor: "rgba(255,255,255,0.10)",
                    diagonalColor: "rgba(255,255,255,0.06)",
                  },
                  {
                    id: "t2",
                    stageKey: "Growing",
                    name: "Goal Tracker",
                    href: "/hub/goals",
                    desc: "Set measurable milestones, track weekly progress, and keep every member accountable.",
                    outcomes: ["Define milestones", "Measure progress", "Celebrate wins"],
                    stat: "89% goal completion rate",
                    solidBg: "#2563eb",   /* blue-600 */
                    patternColor: "rgba(255,255,255,0.10)",
                    diagonalColor: "rgba(255,255,255,0.06)",
                  },
                  {
                    id: "t3",
                    stageKey: "Active",
                    name: "Club Health",
                    href: "/hub/health",
                    desc: "Monitor attendance, momentum, and engagement before small issues become big ones.",
                    outcomes: ["Spot weak points", "Improve consistency", "Boost retention"],
                    stat: "342 clubs improved health scores",
                    solidBg: "#d97706",   /* amber-600 */
                    patternColor: "rgba(255,255,255,0.10)",
                    diagonalColor: "rgba(255,255,255,0.06)",
                  },
                  {
                    id: "t4",
                    stageKey: "Advanced",
                    name: "Compare Clubs",
                    href: "/hub/compare",
                    desc: "Benchmark your chapter against peers to find proven strategies worth adopting.",
                    outcomes: ["Benchmark performance", "Find best practices", "Plan improvements"],
                    stat: "67% found strong growth opportunities",
                    solidBg: "#7c3aed",   /* violet-600 */
                    patternColor: "rgba(255,255,255,0.10)",
                    diagonalColor: "rgba(255,255,255,0.06)",
                  },
                ] as const;

                const visibleCards = stage === "All Stages"
                  ? toolCards
                  : toolCards.filter(card => card.stageKey === stage);

                return (
                  <div className={stage === "All Stages" ? "grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr" : "grid grid-cols-1"}>
                    {visibleCards.map(({ id, stageKey, name, href, desc, outcomes, stat, solidBg, diagonalColor }, idx) => (
                      <Link
                        key={id}
                        href={href}
                        className={`group relative rounded-3xl overflow-hidden flex flex-col h-full hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 ${idx % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"}`}
                        style={{ background: solidBg, animationDelay: `${idx * 0.08}s` }}
                      >
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 18px, ${diagonalColor} 18px, ${diagonalColor} 19px)`,
                          }}
                        />
                        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id={`tool-pattern-${id}`} x="0" y="0" width="520" height="300" patternUnits="userSpaceOnUse">
                                <path d="M-20,80 C60,40 120,120 200,90 C280,60 320,130 400,100 C460,78 500,110 540,95" stroke="rgba(255,255,255,0.13)" strokeWidth="2.5" fill="none"/>
                                <path d="M-20,160 C50,130 100,180 180,155 C260,130 310,175 390,150 C450,132 490,165 540,148" stroke="rgba(255,255,255,0.09)" strokeWidth="2" fill="none"/>
                                <path d="M-20,240 C70,210 140,255 220,230 C300,205 360,248 440,222 C490,207 520,232 540,220" stroke="rgba(255,255,255,0.07)" strokeWidth="1.8" fill="none"/>
                                <ellipse cx="80" cy="60" rx="48" ry="32" fill="rgba(255,255,255,0.06)" />
                                <ellipse cx="300" cy="200" rx="60" ry="38" fill="rgba(255,255,255,0.045)" />
                                <ellipse cx="450" cy="80" rx="42" ry="28" fill="rgba(255,255,255,0.05)" />
                                <g opacity="0.35" fill="white">
                                  <circle cx="460" cy="30" r="2.2"/><circle cx="470" cy="30" r="2.2"/><circle cx="480" cy="30" r="2.2"/>
                                  <circle cx="460" cy="40" r="2.2"/><circle cx="470" cy="40" r="2.2"/><circle cx="480" cy="40" r="2.2"/>
                                  <circle cx="460" cy="50" r="2.2"/><circle cx="470" cy="50" r="2.2"/><circle cx="480" cy="50" r="2.2"/>
                                </g>
                                <g opacity="0.28" fill="white">
                                  <circle cx="20" cy="230" r="2"/><circle cx="30" cy="230" r="2"/><circle cx="40" cy="230" r="2"/>
                                  <circle cx="20" cy="240" r="2"/><circle cx="30" cy="240" r="2"/><circle cx="40" cy="240" r="2"/>
                                  <circle cx="20" cy="250" r="2"/><circle cx="30" cy="250" r="2"/><circle cx="40" cy="250" r="2"/>
                                </g>
                                <circle cx="100" cy="185" r="8" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" fill="none"/>
                                <circle cx="310" cy="55" r="10" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
                                <circle cx="415" cy="245" r="6" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none"/>
                                <circle cx="510" cy="190" r="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#tool-pattern-${id})`} />
                          </svg>
                        </div>

                        <div className={stage === "All Stages" ? "relative z-10 p-4 flex flex-col flex-1" : "relative z-10 p-4 md:p-5 grid gap-3 md:grid-cols-[1.25fr_1fr] md:items-center"}>
                          <div>
                            <span className="self-start inline-block text-[9px] font-extrabold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-white/20 text-white mb-3">
                              {stageKey}
                            </span>
                            <h3 className="text-xl md:text-2xl font-heading font-extrabold text-white leading-tight mb-1.5">{name}</h3>
                            <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium mb-3 line-clamp-2">{desc}</p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {outcomes.slice(0, 2).map(o => (
                                <span key={o} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white">{o}</span>
                              ))}
                            </div>
                          </div>

                          <div className="md:justify-self-end">
                            <div className="rounded-2xl bg-white/15 border border-white/25 px-6 py-4 flex items-center gap-3 group-hover:bg-white/25 transition-colors">
                              <span className="text-base font-extrabold text-white tracking-wide">Open Tool</span>
                              <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Divider + count */}
            <div ref={resourcesSectionRef} className="flex items-center gap-3 scroll-mt-28">
              <div className="flex-1 h-px bg-cream-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {filtered.length} Resource{filtered.length !== 1 ? "s" : ""}
                {category !== "All" && ` | ${category}`}
              </p>
              <div className="flex-1 h-px bg-cream-400" />
              <Link
                href="/portal?tab=resource"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900 hover:bg-primary-900 text-white text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
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
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
                {filtered.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.11)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col h-full">
                    <div className="relative h-40 overflow-hidden bg-primary-900">
                      <Image src={r.img} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/65 to-transparent" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(28,53,87,0.75) 72%, #1c3557 100%)" }} />
                      <button
                        onClick={() => toggleSave(r.id)}
                        className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors text-xs font-bold ${
                          saved.has(r.id) ? "bg-secondary-500 text-white" : "bg-white/80 text-neutral-600 hover:bg-white"
                        }`}
                      >
                        {saved.has(r.id) ? "★" : "☆"}
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary-400 mb-1">{r.category}</span>
                      <h3 className="font-heading font-bold text-primary-800 text-sm mb-1.5 leading-snug group-hover:text-secondary-700 transition-colors">{r.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed mb-3 flex-1 line-clamp-2">{r.details}</p>
                      <div className="flex items-center justify-between border-t border-cream-200 pt-3 mt-auto">
                        <StarRow rating={r.rating} />
                        <a href={r.downloadUrl || `/api/resources/${r.id}/download`} download className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] text-primary-600 hover:text-primary-700 hover:bg-cream-100 transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Download size={9} /> Download PDF
                        </a>
                      </div>
                      <Link href={`/resources/${r.id}`}
                        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cream-100 hover:bg-primary-900 hover:text-white text-primary-700 text-xs font-bold transition-colors">
                        View Details <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
      </div>
    </div>
  );
}

