"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  chapters, events, clubHistoryData, projectsData, meetingNotesData, sponsorsData,
} from "@/lib/data";
import { addJoinedClub, isLoggedIn } from "@/lib/clientState";
import { supabase, membershipsApi, organizationsApi, profilesApi } from "@/lib/api";
import { formatChapterLocation } from "@/lib/location";
import {
  ArrowRight, Award, BarChart3, BookOpen, Calendar, CheckCircle, ChevronDown,
  ChevronRight, Clock, Compass, Edit, ExternalLink, FileText, Globe, Heart, History,
  Instagram, LinkIcon, Mail, MapPin, Megaphone, MessageSquare, Milestone,
  PenTool, Phone, Rocket, Send, Settings, Shield, Star, Target,
  Trophy, Twitter, TrendingUp, UserPlus, Users, Video, Zap,
} from "lucide-react";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
}

function BarSegment({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-600 font-medium">{label}</span>
        <span className="font-bold text-primary-700">{value}%</span>
      </div>
      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} animate-progress-fill`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function DonutChart({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="text-center">
      <svg width="88" height="88" className="mx-auto">
        <circle cx="44" cy="44" r="36" fill="none" strokeWidth="8" stroke="#f0f0f0" />
        <circle cx="44" cy="44" r="36" fill="none" strokeWidth="8" stroke={color}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" transform="rotate(-90 44 44)" />
        <text x="44" y="48" textAnchor="middle" className="fill-primary-700 text-lg font-bold">{value}</text>
      </svg>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

interface LocalComment { id: number; author: string; text: string; time: string; }

const clubIcons: Record<string, { emoji: string; label: string }> = {
  "model-un": { emoji: "🌍", label: "Global Diplomacy" },
  "robotics": { emoji: "🤖", label: "Innovation & Engineering" },
  "community-service": { emoji: "🤝", label: "Community Impact" },
  "drama-club": { emoji: "🎭", label: "Performing Arts" },
  "debate-team": { emoji: "⚖️", label: "Critical Thinking" },
  "cultural-club": { emoji: "🌎", label: "Cultural Exchange" },
  "environmental-club": { emoji: "🌱", label: "Sustainability" },
  "student-newspaper": { emoji: "📰", label: "Student Media" },
};

function SpinningClubIcon({ clubId, name }: { clubId: string; name: string }) {
  const info = clubIcons[clubId] || { emoji: "⭐", label: name };
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [clickSpark, setClickSpark] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });


  useEffect(() => {
    if (isDragging) return;
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.012;
      setRotation({ x: Math.sin(t * 0.7) * 12, y: Math.sin(t) * 25 });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setRotation(r => ({ x: Math.max(-40, Math.min(40, r.x - dy * 0.5)), y: r.y + dx * 0.5 }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleClick = () => {
    setClickSpark(true);
    setTimeout(() => setClickSpark(false), 600);
  };


  const baseColor = clubIcons[clubId]?.emoji === "🌍" ? "#1e3a5f" : clubIcons[clubId]?.emoji === "🤖" ? "#4a90d9" : clubIcons[clubId]?.emoji === "🤝" ? "#e74c3c" : clubIcons[clubId]?.emoji === "🎭" ? "#9b59b6" : clubIcons[clubId]?.emoji === "⚖️" ? "#e67e22" : clubIcons[clubId]?.emoji === "🌎" ? "#27ae60" : clubIcons[clubId]?.emoji === "🌱" ? "#2ecc71" : clubIcons[clubId]?.emoji === "📰" ? "#34495e" : "#b8860b";

  return (
    <div className="relative shrink-0 select-none flex flex-col items-center" style={{ width: 240 }}>
      {/* Glow */}
      <div className="absolute inset-4 blur-2xl animate-pulse" style={{ background: `radial-gradient(circle, ${baseColor}55, transparent 70%)` }} />
      {/* Sparks */}
      {clickSpark && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2" style={{
              left: "50%", top: "50%", background: baseColor,
              animation: `sparkOut 0.6s ease-out forwards`,
              transform: `rotate(${i * 45}deg) translateX(0)`,
              imageRendering: "pixelated",
            }} />
          ))}
        </div>
      )}
      {/* 3D cube on swivel */}
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: 220, height: 220,
          perspective: "600px",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleClick}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center border-2 border-white/25 shadow-2xl"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.08s linear",
            background: `linear-gradient(135deg, ${baseColor}cc, ${baseColor}88)`,
            imageRendering: "pixelated",
          }}
        >
          {/* Pixel grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px), repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
            imageRendering: "pixelated",
          }} />
          {/* Shine */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)`,
          }} />
          <span className="text-8xl drop-shadow-lg relative z-10" style={{ imageRendering: "pixelated", filter: "contrast(1.1)" }}>{info.emoji}</span>
          <span className="text-[11px] font-bold text-white/90 mt-2 tracking-widest uppercase relative z-10">{info.label}</span>
        </div>
      </div>
      {/* Swivel stand */}
      <div className="relative -mt-1 flex flex-col items-center">
        <div className="w-3 h-6 bg-white/20" style={{ imageRendering: "pixelated" }} />
        <div className="w-20 h-3 bg-white/15 border-t border-white/20" style={{ imageRendering: "pixelated" }} />
      </div>
      {/* Instruction */}
      <span className="text-[10px] text-white/60 mt-2 tracking-wide">🖱️ Drag to swivel &middot; Click for effect</span>
      <style>{`
        @keyframes sparkOut {
          0% { transform: rotate(var(--r, 0deg)) translateX(0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--r, 0deg)) translateX(60px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const cx = 100, cy = 100, r = 80;
  const n = data.length;
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (d.value / 100) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, lx: cx + Math.cos(angle) * (r + 14), ly: cy + Math.sin(angle) * (r + 14), label: d.label, value: d.value };
  });
  const polygon = points.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[240px] mx-auto">
      {[20, 40, 60, 80, 100].map(pct => {
        const ring = data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const d = (pct / 100) * r;
          return `${cx + Math.cos(angle) * d},${cy + Math.sin(angle) * d}`;
        }).join(" ");
        return <polygon key={pct} points={ring} fill="none" stroke="#e5e7eb" strokeWidth="0.5" />;
      })}
      {data.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r} stroke="#e5e7eb" strokeWidth="0.5" />;
      })}
      <polygon points={polygon} fill="rgba(30,58,95,0.2)" stroke="#1e3a5f" strokeWidth="1.5" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#1e3a5f" />
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" className="fill-neutral-500 text-[7px]">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function ActivityHeatmap({ clubId }: { clubId: string }) {
  const seed = clubId.length;
  const weeks = 12;
  const days = 7;
  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];
  return (
    <div>
      <div className="flex gap-0.5">
        <div className="flex flex-col gap-0.5 mr-1">
          {dayLabels.map((d, i) => <div key={i} className="h-3 text-[8px] text-neutral-400 flex items-center">{d}</div>)}
        </div>
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-0.5">
            {Array.from({ length: days }, (_, d) => {
              const val = ((seed * (w + 1) * (d + 3) + w * 7 + d * 13) % 100);
              const level = val < 15 ? "bg-neutral-100" : val < 40 ? "bg-primary-100" : val < 65 ? "bg-primary-300" : val < 85 ? "bg-primary-500" : "bg-primary-700";
              return <div key={d} className={`w-3 h-3 ${level} rounded-[2px]`} title={`Week ${w + 1}, Day ${d + 1}: ${val}% activity`} />;
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 text-[9px] text-neutral-400">
        <span>Less</span>
        {["bg-neutral-100", "bg-primary-100", "bg-primary-300", "bg-primary-500", "bg-primary-700"].map(c => <div key={c} className={`w-3 h-3 ${c} rounded-[2px]`} />)}
        <span>More</span>
      </div>
    </div>
  );
}

export default function ClubDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const chapter = chapters.find((c) => c.id === params.id);

  const [activeTab, setActiveTab] = useState<"overview" | "events" | "stats" | "projects" | "history" | "notes" | "discussion">("overview");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<LocalComment[]>([
    { id: 1, author: "Student", text: "Great club! Learned a lot this semester.", time: "3 days ago" },
    { id: 2, author: "Officer", text: "Reminder: next meeting agenda is posted.", time: "1 week ago" },
    { id: 3, author: "Alex T.", text: "Does anyone have the study guide from last week?", time: "2 weeks ago" },
  ]);
  const [showOfficerPanel, setShowOfficerPanel] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState([
    { id: 1, text: "Welcome to the new semester! First meeting is next Tuesday.", date: "Mar 10, 2026" },
    { id: 2, text: "Club t-shirt orders due by Friday. See sign-up sheet.", date: "Mar 5, 2026" },
  ]);
  const [editingDescription, setEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState("");
  const [showAllHistory, setShowAllHistory] = useState(false);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
        <div className="card p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-heading font-bold text-primary-600">Club Not Found</h1>
          <p className="text-neutral-600 mt-2">The selected club could not be located.</p>
          <Link href="/directory" className="btn-primary inline-block mt-5">Back to Directory</Link>
        </div>
      </div>
    );
  }

  const chapterEvents = events.filter((e) => e.chapterId === chapter.id);
  const history = clubHistoryData[chapter.id] || [];
  const projects = projectsData[chapter.id] || [];
  const notes = meetingNotesData[chapter.id] || [];
  const chapterSponsors = sponsorsData.filter((_s, i) => i % 2 === (chapter.id === "robotics" ? 0 : 1)).slice(0, 3);
  const visibleHistory = showAllHistory ? history : history.slice(0, 4);
  const yearsSinceFounded = new Date().getFullYear() - chapter.foundedYear;

  const engagement = Math.min(95, 60 + chapter.memberCount);
  const retention = Math.min(92, 55 + (chapter.memberCount / 2));
  const satisfaction = Math.min(98, 70 + (yearsSinceFounded * 2));
  const growthRate = Math.floor(Math.random() * 15) + 5;

  const monthlyMembers = [
    { month: "Sep", value: Math.floor(chapter.memberCount * 0.6) },
    { month: "Oct", value: Math.floor(chapter.memberCount * 0.7) },
    { month: "Nov", value: Math.floor(chapter.memberCount * 0.8) },
    { month: "Dec", value: Math.floor(chapter.memberCount * 0.85) },
    { month: "Jan", value: Math.floor(chapter.memberCount * 0.9) },
    { month: "Feb", value: Math.floor(chapter.memberCount * 0.95) },
    { month: "Mar", value: chapter.memberCount },
  ];
  const maxMembers = Math.max(...monthlyMembers.map(m => m.value));

  const handleJoin = async () => {
    if (!isLoggedIn()) {
      router.push(`/login?redirect=/directory/${chapter.id}&action=join&club=${chapter.id}`);
      return;
    }
    const status = chapter.membershipStatus === "Open Enrollment" ? "member" : "pending";
    addJoinedClub({ id: chapter.id, name: chapter.name, status });

    // Also create membership in Supabase if an org exists for this club
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        // Ensure profile exists first (FK constraint)
        const { data: profile } = await profilesApi.getById(authData.user.id);
        if (!profile) {
          await profilesApi.create({
            id: authData.user.id,
            name: authData.user.email?.split('@')[0] || 'Student',
            email: authData.user.email || '',
          });
        }
        const { data: orgs } = await organizationsApi.getAll();
        const matchedOrg = orgs?.find((o: any) => o.slug === chapter.id || o.name === chapter.name);
        if (matchedOrg) {
          await membershipsApi.create({
            org_id: matchedOrg.id,
            user_id: authData.user.id,
          });
        }
      }
    } catch (e) {
      console.error('Join error:', e);
    }

    router.push("/dashboard?tab=clubs&joined=true");
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: BookOpen },
    { key: "stats", label: "Statistics", icon: BarChart3 },
    { key: "events", label: "Events", icon: Calendar, count: chapterEvents.length },
    { key: "projects", label: "Projects", icon: Rocket, count: projects.length },
    { key: "history", label: "History", icon: History, count: history.length },
    { key: "notes", label: "Notes", icon: FileText, count: notes.length },
    { key: "discussion", label: "Discussion", icon: MessageSquare, count: comments.length },
  ] as const;

  const categoryImages: Record<string, string> = {
    Academic: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80",
    STEM: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80",
    Service: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80",
    Arts: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1400&q=80",
    Cultural: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    Media: "https://images.unsplash.com/photo-1504711434969-e33886168d6c?auto=format&fit=crop&w=1400&q=80",
    Sports: "https://images.unsplash.com/photo-1461896836934-bd45ba688b72?auto=format&fit=crop&w=1400&q=80",
    Leadership: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
  };
  const heroBg = categoryImages[chapter.category] || categoryImages.Academic;

  return (
    <div className="bg-neutral-50 min-h-screen">
      <section className="relative text-white border-b-4 border-secondary-500 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-800/80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          <Link href="/directory" className="text-sm text-neutral-300 hover:text-white hover:underline inline-flex items-center gap-1 transition-colors">
            <ChevronRight size={14} className="rotate-180" /> Back to Directory
          </Link>

          {/* Banner: spinning icon LEFT, text RIGHT */}
          <div className="mt-6 flex items-start gap-6">
            {/* Left: large pixelated 3D club logo on swivel stand */}
            <SpinningClubIcon clubId={chapter.id} name={chapter.name} />

            {/* Right: all text content */}
            <div className="flex-1 min-w-0 space-y-3 pt-2">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white text-primary-700">{chapter.category}</span>
                <span className="px-3 py-1 text-xs font-semibold bg-primary-400/30 text-white border border-white/20">{chapter.membershipStatus}</span>
                <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-100 border border-green-400/30">Active</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tight">{chapter.name}</h1>

              {/* Description */}
              <p className="text-neutral-200 text-base leading-relaxed max-w-xl">{chapter.description}</p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                {[
                  { label: "Members", value: chapter.memberCount, icon: Users },
                  { label: "Founded", value: chapter.foundedYear, icon: Clock },
                  { label: "Events", value: chapterEvents.length, icon: Calendar },
                  { label: "Growth", value: `+${growthRate}%`, icon: TrendingUp },
                ].map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-2">
                      <Icon size={16} className="text-secondary-300" />
                      <span className="font-heading font-bold text-lg text-secondary-300">{stat.value}</span>
                      <span className="text-white/50 text-xs uppercase tracking-wide">{stat.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button onClick={handleJoin} className="btn-secondary btn-ripple btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                  <UserPlus size={16} /> Join Club
                </button>
                <Link href={`/call/preview?room=${chapter.id}`} className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                  <Video size={16} /> Join Meeting
                </Link>
                <Link href={`/donate?club=${chapter.id}`} className="btn-outline border-white/40 text-white/80 hover:bg-white hover:text-primary-600 inline-flex items-center gap-2 px-4 py-2.5 text-sm">
                  <Heart size={16} /> Donate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 -mb-px mt-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const count = "count" in tab ? (tab as unknown as { count: number }).count : 0;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? "border-primary-500 text-primary-700 bg-primary-50/50" : "border-transparent text-neutral-500 hover:text-primary-600 hover:border-primary-200"}`}>
                <Icon size={14} /> {tab.label}
                {count > 0 && <span className="ml-0.5 px-1.5 py-0.5 text-[10px] rounded-full bg-primary-100 text-primary-700">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">

          {activeTab === "overview" && (
            <>
              <Reveal>
                <div className="card p-5">
                  <h2 className="text-lg font-heading font-bold text-primary-600">Club Information</h2>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700">
                    {[
                      { label: "Schedule", value: chapter.meetingSchedule },
                      { label: "Frequency", value: chapter.meetingFrequency },
                      { label: "Time", value: chapter.meetingTime },
                      { label: "Location", value: formatChapterLocation(chapter.meetingLocation) },
                      { label: "Founded", value: String(chapter.foundedYear) },
                      { label: "Dues", value: chapter.dues || "None" },
                      { label: "Grade Level", value: chapter.gradeLevel },
                      { label: "Affiliation", value: chapter.meetingLocation.parentOrg || "Juanita High School" },
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-2">
                        <span className="font-semibold text-primary-700 min-w-[90px]">{item.label}:</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="card p-5">
                  <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2"><Target size={16} /> Requirements</h2>
                  <div className="mt-3 space-y-2 text-sm text-neutral-700">
                    <div className="p-3 bg-primary-50/50  border border-primary-100">
                      <span className="font-semibold text-primary-700">Status:</span> {chapter.membershipStatus}
                    </div>
                    <p><span className="font-semibold">Requirements:</span> {chapter.membershipRequirements}</p>
                    <p><span className="font-semibold">Grade:</span> {chapter.gradeLevel}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="card p-5">
                  <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2"><Shield size={16} /> Leadership</h2>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    {chapter.officers.map(officer => (
                      <div key={officer.email} className="bg-gradient-to-br from-primary-50/60 to-white border border-primary-100  p-3 ux-hover-lift-sm group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10  bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform">
                            {officer.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-bold text-primary-800 text-sm">{officer.name}</p>
                            <p className="text-xs text-secondary-600 font-semibold">{officer.position}</p>
                            <p className="text-[10px] text-neutral-500">Grade {officer.grade}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-secondary-50/50 border border-secondary-100  flex items-center gap-3">
                    <div className="w-10 h-10  bg-secondary-100 text-secondary-700 flex items-center justify-center"><Star size={16} /></div>
                    <div>
                      <p className="font-bold text-primary-800 text-sm">{chapter.advisor.name}</p>
                      <p className="text-xs text-secondary-600 font-semibold">Faculty Advisor · {chapter.advisor.department}</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {chapter.achievements.length > 0 && (
                <Reveal>
                  <div className="card p-5">
                    <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2"><Trophy size={16} /> Achievements</h2>
                    <div className="mt-3 space-y-2">
                      {chapter.achievements.map((ach, i) => (
                        <div key={ach} className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50/60 to-white border border-yellow-100  ux-hover-lift-sm">
                          <div className="w-7 h-7  bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0"><Trophy size={12} /></div>
                          <div>
                            <p className="text-sm font-semibold text-primary-800">{ach}</p>
                            {i === 0 && <span className="text-[10px] text-yellow-600 font-medium">Most Recent</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </>
          )}

          {activeTab === "stats" && (
            <div className="grid grid-cols-2 gap-3">
              {}
              {[
                { label: "Meetings", value: "18", icon: Calendar, color: "text-primary-600" },
                { label: "Service Hrs", value: chapter.id === "community-service" ? "2,450" : "120", icon: Heart, color: "text-accent-600" },
                { label: "Competitions", value: chapter.id === "robotics" ? "6" : "3", icon: Award, color: "text-secondary-600" },
                { label: "Growth", value: `+${growthRate}%`, icon: TrendingUp, color: "text-green-600" },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="card p-2.5 text-center">
                    <Icon size={14} className={`mx-auto ${stat.color}`} />
                    <p className="text-lg font-bold text-primary-800 leading-tight">{stat.value}</p>
                    <p className="text-[9px] text-neutral-500">{stat.label}</p>
                  </div>
                );
              })}

              {}
              <div className="card p-3 col-span-2">
                <h3 className="text-xs font-bold text-primary-600 mb-2 flex items-center gap-1"><BarChart3 size={12} /> Performance</h3>
                <div className="grid grid-cols-3 gap-2">
                  <DonutChart value={engagement} label="Engagement" color="#1e3a5f" />
                  <DonutChart value={retention} label="Retention" color="#b8860b" />
                  <DonutChart value={satisfaction} label="Satisfaction" color="#16a34a" />
                </div>
              </div>

              {}
              <div className="card p-3">
                <h3 className="text-xs font-bold text-primary-600 mb-1 flex items-center gap-1"><TrendingUp size={12} /> Growth</h3>
                <div className="flex items-end gap-1 h-24">
                  {monthlyMembers.map(m => (
                    <div key={m.month} className="flex-1 flex flex-col items-center">
                      <span className="text-[7px] font-bold text-primary-700">{m.value}</span>
                      <div className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t animate-progress-fill"
                        style={{ height: `${(m.value / maxMembers) * 100}%` }} />
                      <span className="text-[7px] text-neutral-400">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="card p-3">
                <h3 className="text-xs font-bold text-primary-600 mb-1 flex items-center gap-1"><Compass size={12} /> Radar</h3>
                <RadarChart data={[
                  { label: "Engage", value: engagement },
                  { label: "Growth", value: Math.min(95, 50 + growthRate * 3) },
                  { label: "Events", value: Math.min(100, chapterEvents.length * 25) },
                  { label: "Retain", value: retention },
                  { label: "Impact", value: Math.min(90, 50 + chapter.memberCount / 2) },
                  { label: "Lead", value: Math.min(95, 60 + chapter.officers.length * 8) },
                ]} />
              </div>

              {}
              <div className="card p-3 col-span-2">
                <h3 className="text-xs font-bold text-primary-600 mb-2 flex items-center gap-1"><Award size={12} /> Key Metrics</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <BarSegment label="Engagement" value={engagement} max={100} color="bg-primary-500" />
                  <BarSegment label="Attendance" value={Math.min(95, 65 + yearsSinceFounded * 3)} max={100} color="bg-primary-400" />
                  <BarSegment label="Retention" value={retention} max={100} color="bg-secondary-500" />
                  <BarSegment label="Impact" value={Math.min(90, 50 + chapter.memberCount / 2)} max={100} color="bg-secondary-400" />
                  <BarSegment label="Leadership" value={Math.min(95, 60 + chapter.officers.length * 8)} max={100} color="bg-primary-600" />
                </div>
              </div>

              {}
              <div className="card p-3">
                <h3 className="text-xs font-bold text-primary-600 mb-1.5 flex items-center gap-1"><Users size={12} /> Demographics</h3>
                {[
                  { grade: "9th", pct: 15 },
                  { grade: "10th", pct: 28 },
                  { grade: "11th", pct: 35 },
                  { grade: "12th", pct: 22 },
                ].map(g => (
                  <div key={g.grade} className="mb-1">
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className="text-neutral-500">{g.grade}</span>
                      <span className="font-bold text-primary-700">{g.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-progress-fill" style={{ width: `${g.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {}
              <div className="card p-3">
                <h3 className="text-xs font-bold text-primary-600 mb-1.5 flex items-center gap-1"><Calendar size={12} /> Attendance</h3>
                <div className="flex items-end gap-0.5 h-20">
                  {[78, 82, 75, 88, 92, 85, 90, 94, 87, 91, 95, 89].map((v, i) => (
                    <div key={i} className="flex-1">
                      <div className="w-full bg-gradient-to-t from-secondary-500 to-secondary-400 rounded-t animate-progress-fill" style={{ height: `${v}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[7px] text-neutral-400 mt-0.5">
                  <span>Sep</span><span>Nov</span><span>Jan</span><span>Mar</span>
                </div>
              </div>

              {}
              <div className="card p-3 col-span-2">
                <h3 className="text-xs font-bold text-primary-600 mb-1.5 flex items-center gap-1"><Zap size={12} /> Activity Heatmap</h3>
                <ActivityHeatmap clubId={chapter.id} />
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <Reveal>
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2"><Calendar size={16} /> Club Events</h2>
                  <Link href={`/events/new?club=${chapter.id}`} className="btn-outline text-xs flex items-center gap-1"><PenTool size={12} /> Submit Event</Link>
                </div>
                {chapterEvents.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">No upcoming events scheduled.</p>
                ) : (
                  <div className="space-y-3">
                    {chapterEvents.map(event => (
                      <Link href={`/events/${event.id}`} key={event.id} className="block  border border-neutral-200 p-4 hover:border-primary-300 hover:bg-primary-50/40 ux-hover-lift-sm group transition-all">
                        <div className="flex items-center gap-3">
                          <div className="text-center bg-gradient-to-b from-primary-500 to-primary-600 text-white p-2 min-w-[48px] shadow-sm ">
                            <div className="text-[9px]">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</div>
                            <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-primary-700 group-hover:text-primary-600 text-sm">{event.title}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{event.startTime} - {event.endTime} · {event.location}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {event.requiresRSVP && <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">RSVP</span>}
                            <span className="text-[10px] text-neutral-400">{event.currentAttendees} attending</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {activeTab === "projects" && (
            <Reveal>
              <div className="card p-5">
                <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><Rocket size={16} /> Club Projects</h2>
                {projects.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">No projects listed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {projects.map(project => (
                      <div key={project.id} className=" border border-neutral-200 p-4 hover:border-primary-200 transition-colors ux-hover-lift-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${project.status === "in_progress" ? "bg-blue-100 text-blue-700" : project.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {project.status === "in_progress" ? "In Progress" : project.status === "completed" ? "Completed" : "Planning"}
                            </span>
                            <h3 className="font-bold text-primary-800 mt-2 text-sm">{project.title}</h3>
                            <p className="text-sm text-neutral-600 mt-1">{project.description}</p>
                          </div>
                          <div className={`w-8 h-8  flex items-center justify-center shrink-0 ${project.status === "in_progress" ? "bg-blue-50 text-blue-600" : project.status === "completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                            {project.status === "completed" ? <CheckCircle size={16} /> : project.status === "in_progress" ? <Zap size={16} /> : <Target size={16} />}
                          </div>
                        </div>
                        {project.status === "in_progress" && (
                          <div className="mt-3 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full animate-progress-fill" style={{ width: "65%" }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {activeTab === "history" && (
            <Reveal>
              <div className="card p-5">
                <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><History size={16} /> Club Timeline</h2>
                {history.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">No history available yet.</p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-100" />
                    <div className="space-y-3">
                      {visibleHistory.map(event => {
                        const typeColors: Record<string, string> = {
                          founded: "bg-green-100 text-green-700", milestone: "bg-blue-100 text-blue-700",
                          achievement: "bg-yellow-100 text-yellow-700", competition_result: "bg-purple-100 text-purple-700",
                          membership_milestone: "bg-teal-100 text-teal-700", event_highlight: "bg-orange-100 text-orange-700",
                        };
                        const color = typeColors[event.eventType] || "bg-primary-100 text-primary-700";
                        return (
                          <div key={event.id} className="relative pl-12">
                            <div className={`absolute left-[11px] w-7 h-7 rounded-full ${color} flex items-center justify-center text-xs z-10`}>
                              {event.eventType === "founded" ? <Star size={12} /> : event.eventType === "achievement" ? <Trophy size={12} /> : <Milestone size={12} />}
                            </div>
                            <div className=" border border-neutral-200 p-3 hover:border-primary-200 transition-colors ux-hover-lift-sm">
                              <div className="flex items-baseline justify-between gap-2">
                                <h3 className="font-bold text-primary-800 text-sm">{event.title}</h3>
                                <span className="text-[10px] text-neutral-400 shrink-0">{new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                              </div>
                              <p className="text-sm text-neutral-600 mt-1">{event.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {history.length > 4 && (
                      <button onClick={() => setShowAllHistory(!showAllHistory)} className="mt-3 ml-12 text-sm font-semibold text-primary-600 hover:underline flex items-center gap-1">
                        {showAllHistory ? "Show less" : `Show all ${history.length} events`} <ChevronDown size={14} className={`transition-transform ${showAllHistory ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {activeTab === "notes" && (
            <Reveal>
              <div className="card p-5">
                <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><FileText size={16} /> Meeting Notes</h2>
                {notes.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">No meeting notes available.</p>
                ) : (
                  <div className="space-y-3">
                    {notes.map(note => (
                      <div key={note.id} className=" border border-neutral-200 p-4 ux-hover-lift-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-primary-800 text-sm">{note.title}</h3>
                            <p className="text-[10px] text-neutral-500">{new Date(note.meetingDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {note.attendeeCount} attendees</p>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-700">{note.content}</p>
                        {note.actionItems.length > 0 && (
                          <div className="mt-3 bg-primary-50/40 border border-primary-100  p-3">
                            <h4 className="text-[10px] font-bold text-primary-700 mb-1.5">ACTION ITEMS</h4>
                            <div className="space-y-1">
                              {note.actionItems.map(item => (
                                <div key={item.task} className="flex items-start gap-2 text-sm">
                                  <span className={`mt-0.5 ${item.completed ? "text-green-600" : "text-neutral-400"}`}>
                                    {item.completed ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-neutral-300" />}
                                  </span>
                                  <span className={`text-xs ${item.completed ? "line-through text-neutral-400" : "text-neutral-700"}`}>{item.task} <span className="text-neutral-400">— {item.assignee}</span></span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {activeTab === "discussion" && (
            <Reveal>
              <div className="card p-5">
                <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-3"><MessageSquare size={16} /> Discussion ({comments.length})</h2>
                <div className="space-y-2">
                  {comments.map(c => (
                    <div key={c.id} className="border border-neutral-200  p-3 hover:bg-primary-50/20 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">{c.author[0]}</div>
                        <span className="text-sm font-semibold text-primary-700">{c.author}</span>
                        <span className="text-[10px] text-neutral-400 ml-auto">{c.time}</span>
                      </div>
                      <p className="text-sm text-neutral-700 ml-8">{c.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input type="text" placeholder="Add a comment..." value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && commentText.trim()) { setComments(prev => [...prev, { id: Date.now(), author: "You", text: commentText.trim(), time: "Just now" }]); setCommentText(""); } }}
                    className="flex-1 input-field text-sm" />
                  <button onClick={() => { if (commentText.trim()) { setComments(prev => [...prev, { id: Date.now(), author: "You", text: commentText.trim(), time: "Just now" }]); setCommentText(""); } }} className="btn-primary px-3"><Send size={14} /></button>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div className="card p-5 border-2 border-secondary-200 bg-gradient-to-br from-secondary-50/40 to-white">
              <button onClick={() => setShowOfficerPanel(!showOfficerPanel)} className="w-full flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-secondary-700 flex items-center gap-2"><Shield size={16} /> Officer Portal</h2>
                <span className="text-xs badge bg-secondary-100 text-secondary-700">{showOfficerPanel ? "Hide" : "Show"}</span>
              </button>
              {showOfficerPanel && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-primary-700 flex items-center gap-1 mb-2"><Megaphone size={12} /> Post Announcement</h3>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Write an announcement..." value={announcementText} onChange={e => setAnnouncementText(e.target.value)} className="input-field flex-1 text-sm" />
                      <button onClick={() => { if (announcementText.trim()) { setAnnouncements(prev => [{ id: Date.now(), text: announcementText.trim(), date: "Just now" }, ...prev]); setAnnouncementText(""); } }} className="btn-secondary px-3"><Send size={12} /></button>
                    </div>
                    {announcements.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {announcements.map(a => (
                          <div key={a.id} className="text-sm bg-white border border-neutral-200  p-2.5 flex justify-between items-start">
                            <p className="text-neutral-700 text-xs">{a.text}</p>
                            <span className="text-[10px] text-neutral-400 ml-2 whitespace-nowrap">{a.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-primary-700 flex items-center gap-1 mb-2"><Settings size={12} /> Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => { setEditingDescription(true); setDraftDescription(chapter.description); }} className="btn-outline text-xs py-2 flex items-center justify-center gap-1"><Edit size={10} /> Edit</button>
                      <Link href={`/events/new?club=${chapter.id}`} className="btn-outline text-xs py-2 flex items-center justify-center gap-1"><Calendar size={10} /> Event</Link>
                      <button className="btn-outline text-xs py-2 flex items-center justify-center gap-1"><UserPlus size={10} /> Invite</button>
                      <Link href="/students" className="btn-outline text-xs py-2 flex items-center justify-center gap-1"><Shield size={10} /> Social</Link>
                      <Link href="/resources" className="btn-outline text-xs py-2 flex items-center justify-center gap-1"><Settings size={10} /> Resources</Link>
                      <Link href="/dashboard" className="btn-outline text-xs py-2 flex items-center justify-center gap-1"><BarChart3 size={10} /> Analytics</Link>
                    </div>
                  </div>
                  {editingDescription && (
                    <div className="bg-white border border-primary-200  p-3">
                      <h3 className="text-xs font-bold text-primary-700 mb-2">Edit Description</h3>
                      <textarea value={draftDescription} onChange={e => setDraftDescription(e.target.value)} className="input-field min-h-[60px] resize-none w-full text-sm" />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={() => setEditingDescription(false)} className="btn-outline text-xs px-3 py-1">Cancel</button>
                        <button onClick={() => setEditingDescription(false)} className="btn-primary text-xs px-3 py-1">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <aside className="space-y-5">
          <div className="card p-5 bg-gradient-to-br from-primary-50/60 to-white border-primary-100">
            <h2 className="text-base font-heading font-bold text-primary-600">Quick Facts</h2>
            <div className="mt-3 text-sm text-neutral-700 space-y-2">
              {[
                { label: "Members", value: String(chapter.memberCount), icon: Users },
                { label: "Category", value: chapter.category, icon: BookOpen },
                { label: "Status", value: "Active", icon: CheckCircle },
                { label: "Meets", value: `${chapter.meetingFrequency}, ${chapter.meetingTime}`, icon: Clock },
                { label: "Founded", value: String(chapter.foundedYear), icon: Calendar },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2"><Icon size={12} className="text-primary-400 shrink-0" /><span className="font-semibold text-primary-700 text-xs">{item.label}:</span><span className="text-xs">{item.value}</span></div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2"><Mail size={14} /> Contact</h2>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-8 h-8  bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Star size={14} /></div>
              <div>
                <p className="font-semibold text-neutral-800 text-sm">{chapter.advisor.name}</p>
                <p className="text-[10px] text-neutral-500">{chapter.advisor.department}</p>
                <a href={`mailto:${chapter.advisor.email}`} className="text-xs text-primary-600 hover:underline">{chapter.advisor.email}</a>
                {chapter.advisor.phone && <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5"><Phone size={9} /> {chapter.advisor.phone}</p>}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2"><MapPin size={14} /> Location</h2>
            <div className="mt-3 text-sm space-y-1">
              <p className="font-semibold text-neutral-700">{chapter.meetingLocation.room || "Campus"}</p>
              {chapter.meetingLocation.internalLocation && <p className="text-xs text-neutral-500">{chapter.meetingLocation.internalLocation}</p>}
              <Link href="/directory" className="text-primary-600 hover:underline text-xs mt-2 inline-block">View on Map →</Link>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2"><Globe size={14} /> Links</h2>
            <div className="mt-3 space-y-1.5 text-sm">
              {chapter.socialLinks.website && <a href={chapter.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline p-1.5  hover:bg-primary-50 text-xs"><ExternalLink size={12} /> Website</a>}
              {chapter.socialLinks.instagram && <div className="flex items-center gap-2 text-neutral-700 text-xs p-1.5"><Instagram size={12} className="text-pink-500" /> {chapter.socialLinks.instagram}</div>}
              {chapter.socialLinks.twitter && <div className="flex items-center gap-2 text-neutral-700 text-xs p-1.5"><Twitter size={12} className="text-blue-400" /> {chapter.socialLinks.twitter}</div>}
              {chapter.socialLinks.discord && <div className="flex items-center gap-2 text-neutral-700 text-xs p-1.5"><MessageSquare size={12} className="text-indigo-500" /> {chapter.socialLinks.discord}</div>}
            </div>
          </div>

          {chapterSponsors.length > 0 && (
            <div className="card p-5">
              <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2"><Heart size={14} /> Sponsors</h2>
              <div className="mt-3 space-y-2">
                {chapterSponsors.map(s => (
                  <div key={s.id} className="flex items-center gap-2 text-sm p-1.5  hover:bg-primary-50/50">
                    <div className="w-7 h-7  bg-secondary-50 text-secondary-700 flex items-center justify-center text-[10px] font-bold shrink-0">{s.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                    <div>
                      <p className="font-semibold text-neutral-800 text-xs">{s.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.tier === "platinum" ? "bg-purple-100 text-purple-700" : s.tier === "gold" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{s.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600">Related Clubs</h2>
            <div className="mt-3 space-y-2">
              {chapters.filter(c => c.category === chapter.category && c.id !== chapter.id).slice(0, 3).map(c => (
                <Link key={c.id} href={`/directory/${c.id}`} className="flex items-center gap-2 p-1.5  hover:bg-primary-50 transition-colors group">
                  <div className="w-7 h-7  bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold group-hover:scale-110 transition-transform">{c.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-primary-700 truncate">{c.name}</p><p className="text-[10px] text-neutral-500">{c.memberCount} members</p></div>
                  <ArrowRight size={10} className="text-neutral-400" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
