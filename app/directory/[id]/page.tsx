"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  chapters,
  events,
  clubHistoryData,
  projectsData,
  meetingNotesData,
  sponsorsData,
} from "@/lib/data";
import {
  addJoinedClub,
  getCreatedChapters,
  updateCreatedChapter,
} from "@/lib/clientState";
import {
  supabase,
  membershipsApi,
  organizationsApi,
  profilesApi,
  eventsApi,
} from "@/lib/api";
import { formatChapterLocation } from "@/lib/location";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  History,
  Instagram,
  LinkIcon,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Milestone,
  PenTool,
  Phone,
  Plus,
  Rocket,
  Send,
  Settings,
  Shield,
  Star,
  Target,
  Trophy,
  Twitter,
  TrendingUp,
  UserPlus,
  Users,
  Video,
  Zap,
} from "lucide-react";

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </div>
  );
}

function BarSegment({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-600 font-medium">{label}</span>
        <span className="font-bold text-primary-700">{value}%</span>
      </div>
      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} animate-progress-fill`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

function DonutChart({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="text-center">
      <svg width="88" height="88" className="mx-auto">
        <circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          strokeWidth="8"
          stroke="#f0f0f0"
        />
        <circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          strokeWidth="8"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          transform="rotate(-90 44 44)"
        />
        <text
          x="44"
          y="48"
          textAnchor="middle"
          className="fill-primary-700 text-lg font-bold"
        >
          {value}
        </text>
      </svg>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

interface LocalComment {
  id: number;
  author: string;
  text: string;
  time: string;
}

const clubIcons: Record<string, { emoji: string; label: string }> = {
  "model-un": { emoji: "🌍", label: "Global Diplomacy" },
  robotics: { emoji: "🤖", label: "Innovation & Engineering" },
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
    setRotation((r) => ({
      x: Math.max(-40, Math.min(40, r.x - dy * 0.5)),
      y: r.y + dx * 0.5,
    }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleClick = () => {
    setClickSpark(true);
    setTimeout(() => setClickSpark(false), 600);
  };

  const baseColor =
    clubIcons[clubId]?.emoji === "🌍"
      ? "#1e3a5f"
      : clubIcons[clubId]?.emoji === "🤖"
        ? "#4a90d9"
        : clubIcons[clubId]?.emoji === "🤝"
          ? "#e74c3c"
          : clubIcons[clubId]?.emoji === "🎭"
            ? "#9b59b6"
            : clubIcons[clubId]?.emoji === "⚖️"
              ? "#e67e22"
              : clubIcons[clubId]?.emoji === "🌎"
                ? "#27ae60"
                : clubIcons[clubId]?.emoji === "🌱"
                  ? "#2ecc71"
                  : clubIcons[clubId]?.emoji === "📰"
                    ? "#34495e"
                    : "#b8860b";

  return (
    <div
      className="relative shrink-0 select-none flex flex-col items-center"
      style={{ width: 240 }}
    >
      {/* Glow */}
      <div
        className="absolute inset-4 blur-2xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${baseColor}55, transparent 70%)`,
        }}
      />
      {/* Sparks */}
      {clickSpark && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2"
              style={{
                left: "50%",
                top: "50%",
                background: baseColor,
                animation: `sparkOut 0.6s ease-out forwards`,
                transform: `rotate(${i * 45}deg) translateX(0)`,
                imageRendering: "pixelated",
              }}
            />
          ))}
        </div>
      )}
      {/* 3D cube on swivel */}
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: 220,
          height: 220,
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
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px), repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
              imageRendering: "pixelated",
            }}
          />
          {/* Shine */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)`,
            }}
          />
          <span
            className="text-8xl drop-shadow-lg relative z-10"
            style={{ imageRendering: "pixelated", filter: "contrast(1.1)" }}
          >
            {info.emoji}
          </span>
        </div>
      </div>
      {/* Swivel stand */}
      <div className="relative -mt-1 flex flex-col items-center">
        <div
          className="w-3 h-6 bg-white/20"
          style={{ imageRendering: "pixelated" }}
        />
        <div
          className="w-20 h-3 bg-white/15 border-t border-white/20"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

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
  const cx = 120,
    cy = 120,
    r = 90;
  const n = data.length;
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (d.value / 100) * r;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      lx: cx + Math.cos(angle) * (r + 18),
      ly: cy + Math.sin(angle) * (r + 18),
      label: d.label,
      value: d.value,
    };
  });
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[320px] mx-auto">
      <defs>
        <radialGradient id="radarFill">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.08" />
        </radialGradient>
      </defs>
      {[20, 40, 60, 80, 100].map((pct) => {
        const ring = data
          .map((_, i) => {
            const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            const d = (pct / 100) * r;
            return `${cx + Math.cos(angle) * d},${cy + Math.sin(angle) * d}`;
          })
          .join(" ");
        return (
          <polygon
            key={pct}
            points={ring}
            fill={pct === 100 ? "rgba(0,0,0,0.01)" : "none"}
            stroke="#d1d5db"
            strokeWidth="0.5"
          />
        );
      })}
      {data.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(angle) * r}
            y2={cy + Math.sin(angle) * r}
            stroke="#d1d5db"
            strokeWidth="0.5"
          />
        );
      })}
      <polygon
        points={polygon}
        fill="url(#radarFill)"
        stroke="#1e3a5f"
        strokeWidth="2"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#1e3a5f" strokeWidth="2" />
          <text
            x={p.lx}
            y={p.ly - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-neutral-600"
            fontSize="8"
            fontWeight="600"
          >
            {p.label}
          </text>
          <text
            x={p.lx}
            y={p.ly + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-primary-700"
            fontSize="8"
            fontWeight="700"
          >
            {p.value}%
          </text>
        </g>
      ))}
    </svg>
  );
}

function GrowthLineChart({ data }: { data: { month: string; value: number }[] }) {
  const W = 440, H = 200, padL = 38, padR = 16, padT = 16, padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = Math.max(1, ...data.map(d => d.value));
  const yTicks = 5;
  const stepY = Math.ceil(maxVal / yTicks);
  const yMax = stepY * yTicks;

  const pts = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - (d.value / yMax) * chartH,
    ...d,
  }));

  // Build smooth curve path
  const linePath = pts.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }).join(" ");

  const areaPath = `${linePath} L${pts[pts.length - 1].x},${padT + chartH} L${pts[0].x},${padT + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Y-axis grid lines and labels */}
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const val = (i * yMax) / yTicks;
        const y = padT + chartH - (val / yMax) * chartH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4 3"} />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{Math.round(val)}</text>
          </g>
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill="url(#growthGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points and labels */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#1e3a5f" strokeWidth="2.5" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e3a5f">{p.value}</text>
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="500">{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

function AttendanceChart({ data }: { data: { month: string; value: number }[] }) {
  const W = 440, H = 200, padL = 38, padR = 16, padT = 16, padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barGap = 6;
  const barW = Math.min(32, (chartW - barGap * (data.length - 1)) / data.length);
  const totalBarsW = data.length * barW + (data.length - 1) * barGap;
  const offsetX = padL + (chartW - totalBarsW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8860b" />
          <stop offset="100%" stopColor="#d4a843" />
        </linearGradient>
      </defs>
      {/* Y-axis grid lines */}
      {[0, 25, 50, 75, 100].map((val) => {
        const y = padT + chartH - (val / 100) * chartH;
        return (
          <g key={val}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={val === 0 ? "0" : "4 3"} />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{val}%</text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const x = offsetX + i * (barW + barGap);
        const barH = (d.value / 100) * chartH;
        const y = padT + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill="url(#attendGrad)" rx="2" />
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400e">{d.value}%</text>
            <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="8" fill="#6b7280" fontWeight="500">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Deterministic seed from string
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function generateClubTabData(id: string, name: string) {
  const h = hashStr(id);
  const cat = name.split(/\s+/)[0] || "Club";
  const genEvents: import("@/types").Event[] = [
    {
      id: `${id}-e1`,
      title: `${name} Welcome Meeting`,
      description: `Introductory meeting for all interested students.`,
      date: "2026-01-20",
      startTime: "3:30 PM",
      endTime: "4:30 PM",
      location: `Room ${100 + (h % 200)}`,
      chapterId: id,
      chapterName: name,
      category: "Academic" as any,
      isPublic: true,
      requiresRSVP: false,
      currentAttendees: 12 + (h % 20),
    },
    {
      id: `${id}-e2`,
      title: `${cat} Workshop`,
      description: `Hands-on workshop covering key skills and fundamentals.`,
      date: "2026-02-10",
      startTime: "3:30 PM",
      endTime: "5:00 PM",
      location: `Room ${100 + (h % 200)}`,
      chapterId: id,
      chapterName: name,
      category: "Academic" as any,
      isPublic: true,
      requiresRSVP: true,
      maxAttendees: 30,
      currentAttendees: 18 + (h % 10),
    },
    {
      id: `${id}-e3`,
      title: `${name} Social Event`,
      description: `End-of-month social and team building activity.`,
      date: "2026-03-05",
      startTime: "4:00 PM",
      endTime: "5:30 PM",
      location: "Student Commons",
      chapterId: id,
      chapterName: name,
      category: "Academic" as any,
      isPublic: true,
      requiresRSVP: false,
      currentAttendees: 22 + (h % 15),
    },
  ];
  const genHistory = [
    {
      id: "h1",
      eventType: "founded",
      title: "Club Founded",
      description: `${name} was established by a group of passionate students.`,
      eventDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`,
    },
    {
      id: "h2",
      eventType: "milestone",
      title: "First Meeting Held",
      description: `The inaugural meeting drew ${10 + (h % 15)} enthusiastic members.`,
      eventDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-08`,
    },
    {
      id: "h3",
      eventType: "achievement",
      title: "Interest Growing",
      description: `Membership quickly grew as word spread across campus.`,
      eventDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-15`,
    },
  ];
  const genProjects = [
    {
      id: "p1",
      title: `${cat} Community Outreach`,
      description: `Planning outreach events to invite more students and build community partnerships.`,
      status: "in_progress",
      startDate: "2026-01-15",
    },
    {
      id: "p2",
      title: `${name} Website`,
      description: `Building a club website and social media presence.`,
      status: "planning",
      startDate: "2026-02-01",
    },
  ];
  const genNotes = [
    {
      id: "mn1",
      title: "Founding Meeting",
      meetingDate: new Date().toISOString().slice(0, 10),
      attendeeCount: 8 + (h % 12),
      content: `Discussed club goals, meeting schedule, and officer roles. Set up communication channels and planned first activities.`,
      actionItems: [
        { task: "Create group chat", assignee: "President", completed: true },
        { task: "Draft first event plan", assignee: "VP", completed: false },
        { task: "Design club logo", assignee: "Secretary", completed: false },
      ],
    },
    {
      id: "mn2",
      title: "Planning Session",
      meetingDate: new Date(Date.now() + 7 * 86400000)
        .toISOString()
        .slice(0, 10),
      attendeeCount: 10 + (h % 10),
      content: `Reviewed progress on action items. Discussed upcoming workshop and assigned roles for the event.`,
      actionItems: [
        {
          task: "Book room for workshop",
          assignee: "Treasurer",
          completed: true,
        },
        {
          task: "Create sign-up form",
          assignee: "Secretary",
          completed: false,
        },
      ],
    },
  ];
  return { genEvents, genHistory, genProjects, genNotes };
}

export default function ClubDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const allChapters = mounted
    ? [...chapters, ...getCreatedChapters()]
    : chapters;
  const chapter = allChapters.find((c) => c.id === params.id);

  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "stats" | "projects" | "history" | "notes"
  >("overview");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<LocalComment[]>([
    {
      id: 1,
      author: "Student",
      text: "Great club! Learned a lot this semester.",
      time: "3 days ago",
    },
    {
      id: 2,
      author: "Officer",
      text: "Reminder: next meeting agenda is posted.",
      time: "1 week ago",
    },
    {
      id: 3,
      author: "Alex T.",
      text: "Does anyone have the study guide from last week?",
      time: "2 weeks ago",
    },
  ]);
  const [showOfficerPanel, setShowOfficerPanel] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      text: "Welcome to the new semester! First meeting is next Tuesday.",
      date: "Mar 10, 2026",
    },
    {
      id: 2,
      text: "Club t-shirt orders due by Friday. See sign-up sheet.",
      date: "Mar 5, 2026",
    },
  ]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState("");
  const [draftSchedule, setDraftSchedule] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [draftDues, setDraftDues] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [addingEvent, setAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [localEvents, setLocalEvents] = useState<
    { id: string; title: string; date: string }[]
  >([]);
  const [dbEvents, setDbEvents] = useState<
    { id: string; title: string; date: string }[]
  >([]);
  const isFounder =
    mounted && getCreatedChapters().some((c) => c.id === params.id);

  // Fetch events saved to Supabase for this club
  useEffect(() => {
    if (!mounted || !params.id) return;
    (async () => {
      try {
        const { data: matchedOrg } = await organizationsApi.getBySlug(
          params.id as string,
        );
        if (matchedOrg) {
          const { data: evts } = await eventsApi.getByOrg(matchedOrg.id);
          if (evts && evts.length > 0) {
            setDbEvents(
              evts.map((e: any) => ({
                id: e.id,
                title: e.name,
                date: e.time ? e.time.slice(0, 10) : "",
              })),
            );
          }
        }
      } catch (e) {
        console.error("Fetch events error:", e);
      }
    })();
  }, [mounted, params.id]);

  if (!chapter) {
    if (!mounted) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <p className="text-neutral-400 text-sm">Loading...</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
        <div className="card p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-heading font-bold text-primary-600">
            Club Not Found
          </h1>
          <p className="text-neutral-600 mt-2">
            The selected club could not be located.
          </p>
          <Link href="/directory" className="btn-primary inline-block mt-5">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const _generated = generateClubTabData(chapter.id, chapter.name);
  const chapterEvents =
    events.filter((e) => e.chapterId === chapter.id).length > 0
      ? events.filter((e) => e.chapterId === chapter.id)
      : _generated.genEvents;
  const history = clubHistoryData[chapter.id] || _generated.genHistory;
  const projects = projectsData[chapter.id] || _generated.genProjects;
  const notes = meetingNotesData[chapter.id] || _generated.genNotes;
  const chapterSponsors = sponsorsData
    .filter((_s, i) => i % 2 === (chapter.id === "robotics" ? 0 : 1))
    .slice(0, 3);
  const visibleHistory = showAllHistory ? history : history.slice(0, 4);
  const yearsSinceFounded = new Date().getFullYear() - chapter.foundedYear;

  const engagement = Math.min(95, 60 + chapter.memberCount);
  const retention = Math.min(92, 55 + chapter.memberCount / 2);
  const satisfaction = Math.min(98, 70 + yearsSinceFounded * 2);
  const growthRate = Math.floor(Math.random() * 15) + 5;

  const safeMemberCount =
    typeof chapter.memberCount === "number" &&
    Number.isFinite(chapter.memberCount)
      ? Math.max(0, chapter.memberCount)
      : 0;
  const monthlyMembers = [
    { month: "Sep", value: Math.floor(safeMemberCount * 0.6) },
    { month: "Oct", value: Math.floor(safeMemberCount * 0.7) },
    { month: "Nov", value: Math.floor(safeMemberCount * 0.8) },
    { month: "Dec", value: Math.floor(safeMemberCount * 0.85) },
    { month: "Jan", value: Math.floor(safeMemberCount * 0.9) },
    { month: "Feb", value: Math.floor(safeMemberCount * 0.95) },
    { month: "Mar", value: safeMemberCount },
  ];
  const maxMembers = Math.max(1, ...monthlyMembers.map((m) => m.value));
  const hasGrowthData = monthlyMembers.some((m) => m.value > 0);

  const handleJoin = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      router.push(
        `/login?redirect=/directory/${chapter.id}&action=join&club=${chapter.id}`,
      );
      return;
    }
    const status =
      chapter.membershipStatus === "Open Enrollment" ? "member" : "pending";
    addJoinedClub({ id: chapter.id, name: chapter.name, status });

    // Also create membership in Supabase if an org exists for this club
    try {
      if (authData.user) {
        // Ensure profile exists first (FK constraint)
        const { data: profile } = await profilesApi.getById(authData.user.id);
        if (!profile) {
          await profilesApi.create({
            id: authData.user.id,
            name: authData.user.email?.split("@")[0] || "Student",
            email: authData.user.email || "",
          });
        }
        const { data: matchedOrg } = await organizationsApi.getBySlug(
          chapter.id,
        );
        if (matchedOrg) {
          await membershipsApi.create({
            org_id: matchedOrg.id,
            user_id: authData.user.id,
          });
        }
      }
    } catch (e) {
      console.error("Join error:", e);
    }

    router.push("/dashboard?tab=clubs&joined=true");
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: BookOpen },
    { key: "stats", label: "Statistics", icon: BarChart3 },
    {
      key: "events",
      label: "Events",
      icon: Calendar,
      count: chapterEvents.length + localEvents.length + dbEvents.length,
    },
    {
      key: "projects",
      label: "Projects",
      icon: Rocket,
      count: projects.length,
    },
    { key: "history", label: "History", icon: History, count: history.length },
    { key: "notes", label: "Notes", icon: FileText, count: notes.length },
  ] as const;

  const categoryImages: Record<string, string> = {
    Academic:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80",
    STEM: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80",
    Service:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80",
    Arts: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1400&q=80",
    Cultural:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    Media:
      "https://images.unsplash.com/photo-1504711434969-e33886168d6c?auto=format&fit=crop&w=1400&q=80",
    Sports:
      "https://images.unsplash.com/photo-1461896836934-bd45ba688b72?auto=format&fit=crop&w=1400&q=80",
    Leadership:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
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
          <Link
            href="/directory"
            className="text-sm text-neutral-300 hover:text-white hover:underline inline-flex items-center gap-1 transition-colors"
          >
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
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white text-primary-700">
                  {chapter.category}
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-primary-400/30 text-white border border-white/20">
                  {chapter.membershipStatus}
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-100 border border-green-400/30">
                  Active
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tight">
                {chapter.name}
              </h1>

              {/* Description */}
              <p className="text-neutral-200 text-base leading-relaxed max-w-xl">
                {chapter.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                {[
                  { label: "Members", value: chapter.memberCount, icon: Users },
                  { label: "Founded", value: chapter.foundedYear, icon: Clock },
                  {
                    label: "Events",
                    value:
                      chapterEvents.length +
                      localEvents.length +
                      dbEvents.length,
                    icon: Calendar,
                  },
                  {
                    label: "Growth",
                    value: `+${growthRate}%`,
                    icon: TrendingUp,
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-2">
                      <Icon size={16} className="text-secondary-300" />
                      <span className="font-heading font-bold text-lg text-secondary-300">
                        {stat.value}
                      </span>
                      <span className="text-white/50 text-xs uppercase tracking-wide">
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleJoin}
                  className="btn-secondary btn-ripple btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
                >
                  <UserPlus size={16} /> Join Club
                </button>
                <Link
                  href={`/call/preview?room=${chapter.id}`}
                  className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
                >
                  <Video size={16} /> Join Meeting
                </Link>
                <Link
                  href={`/donate?club=${chapter.id}`}
                  className="btn-outline border-white/40 text-white/80 hover:bg-white hover:text-primary-600 inline-flex items-center gap-2 px-4 py-2.5 text-sm"
                >
                  <Heart size={16} /> Donate
                </Link>
              </div>
              <p className="text-xs text-white/75 max-w-xl">
                {chapter.membershipStatus === "Open Enrollment"
                  ? "Engagement path: open enrollment. Join now and start participating in meetings immediately."
                  : "Engagement path: application required. Joining will place you in pending status until the officers approve."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 -mb-px mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              "count" in tab ? (tab as unknown as { count: number }).count : 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? "border-primary-500 text-primary-700 bg-primary-50/50" : "border-transparent text-neutral-500 hover:text-primary-600 hover:border-primary-200"}`}
              >
                <Icon size={14} /> {tab.label}
                {count > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 text-[10px] rounded-full bg-primary-100 text-primary-700">
                    {count}
                  </span>
                )}
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
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-bold text-primary-600">
                      Club Information
                    </h2>
                    {isFounder && !editingField && (
                      <button
                        onClick={() => {
                          setEditingField("info");
                          setDraftDescription(chapter.description);
                          setDraftSchedule(chapter.meetingSchedule);
                          setDraftTime(chapter.meetingTime);
                          setDraftDues(chapter.dues || "");
                        }}
                        className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1"
                      >
                        <Edit size={12} /> Edit
                      </button>
                    )}
                  </div>
                  {editingField === "info" ? (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-600">
                          Description
                        </label>
                        <textarea
                          className="input-field min-h-[60px] resize-none w-full text-sm mt-1"
                          value={draftDescription}
                          onChange={(e) => setDraftDescription(e.target.value)}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-neutral-600">
                            Meeting Schedule
                          </label>
                          <input
                            className="input-field text-sm w-full mt-1"
                            value={draftSchedule}
                            onChange={(e) => setDraftSchedule(e.target.value)}
                            placeholder="e.g. Every Tuesday"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-neutral-600">
                            Meeting Time
                          </label>
                          <input
                            className="input-field text-sm w-full mt-1"
                            value={draftTime}
                            onChange={(e) => setDraftTime(e.target.value)}
                            placeholder="e.g. 3:00 PM – 4:00 PM"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-neutral-600">
                            Dues
                          </label>
                          <input
                            className="input-field text-sm w-full mt-1"
                            value={draftDues}
                            onChange={(e) => setDraftDues(e.target.value)}
                            placeholder="e.g. $10/year or None"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingField(null)}
                          className="btn-outline text-xs px-3 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={savingEdit}
                          onClick={async () => {
                            setSavingEdit(true);
                            const updates: Partial<typeof chapter> = {
                              description: draftDescription,
                              meetingSchedule: draftSchedule,
                              meetingTime:
                                draftTime as typeof chapter.meetingTime,
                              dues: draftDues || "None",
                            };
                            // Update localStorage chapter
                            updateCreatedChapter(chapter.id, updates);
                            // Also try to persist to Supabase
                            try {
                              const { data: matchedOrg } =
                                await organizationsApi.getBySlug(chapter.id);
                              if (matchedOrg) {
                                await organizationsApi.update(matchedOrg.id, {
                                  description: draftDescription,
                                });
                              }
                            } catch (e) {
                              console.error("Save error:", e);
                            }
                            // Reflect changes locally by reloading chapter data
                            Object.assign(chapter, updates);
                            setSavingEdit(false);
                            setEditingField(null);
                          }}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700">
                      {[
                        { label: "Schedule", value: chapter.meetingSchedule },
                        { label: "Frequency", value: chapter.meetingFrequency },
                        { label: "Time", value: chapter.meetingTime },
                        {
                          label: "Location",
                          value: formatChapterLocation(chapter.meetingLocation),
                        },
                        {
                          label: "Founded",
                          value: String(chapter.foundedYear),
                        },
                        { label: "Dues", value: chapter.dues || "None" },
                        { label: "Grade Level", value: chapter.gradeLevel },
                        {
                          label: "Affiliation",
                          value:
                            chapter.meetingLocation.parentOrg ||
                            "Juanita High School",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-start gap-2"
                        >
                          <span className="font-semibold text-primary-700 min-w-[90px]">
                            {item.label}:
                          </span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal>
                <div className="card p-5">
                  <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2">
                    <Target size={16} /> Requirements
                  </h2>
                  <div className="mt-3 space-y-2 text-sm text-neutral-700">
                    <div className="p-3 bg-primary-50/50  border border-primary-100">
                      <span className="font-semibold text-primary-700">
                        Status:
                      </span>{" "}
                      {chapter.membershipStatus}
                    </div>
                    <p>
                      <span className="font-semibold">Requirements:</span>{" "}
                      {chapter.membershipRequirements}
                    </p>
                    <p>
                      <span className="font-semibold">Grade:</span>{" "}
                      {chapter.gradeLevel}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="card p-5">
                  <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2">
                    <Shield size={16} /> Leadership
                  </h2>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    {chapter.officers.map((officer) => (
                      <div
                        key={officer.email}
                        className="bg-gradient-to-br from-primary-50/60 to-white border border-primary-100  p-3 ux-hover-lift-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10  bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform">
                            {officer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-bold text-primary-800 text-sm">
                              {officer.name}
                            </p>
                            <p className="text-xs text-secondary-600 font-semibold">
                              {officer.position}
                            </p>
                            <p className="text-[10px] text-neutral-500">
                              Grade {officer.grade}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-secondary-50/50 border border-secondary-100  flex items-center gap-3">
                    <div className="w-10 h-10  bg-secondary-100 text-secondary-700 flex items-center justify-center">
                      <Star size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-primary-800 text-sm">
                        {chapter.advisor.name}
                      </p>
                      <p className="text-xs text-secondary-600 font-semibold">
                        Faculty Advisor · {chapter.advisor.department}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {chapter.achievements.length > 0 && (
                <Reveal>
                  <div className="card p-5">
                    <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2">
                      <Trophy size={16} /> Achievements
                    </h2>
                    <div className="mt-3 space-y-2">
                      {chapter.achievements.map((ach, i) => (
                        <div
                          key={ach}
                          className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50/60 to-white border border-yellow-100  ux-hover-lift-sm"
                        >
                          <div className="w-7 h-7  bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
                            <Trophy size={12} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary-800">
                              {ach}
                            </p>
                            {i === 0 && (
                              <span className="text-[10px] text-yellow-600 font-medium">
                                Most Recent
                              </span>
                            )}
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
            <div className="space-y-4">
              {/* Quick stat cards */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    label: "Meetings",
                    value: "18",
                    icon: Calendar,
                    color: "text-primary-600",
                    bg: "bg-primary-50",
                  },
                  {
                    label: "Service Hrs",
                    value: chapter.id === "community-service" ? "2,450" : "120",
                    icon: Heart,
                    color: "text-accent-600",
                    bg: "bg-accent-50",
                  },
                  {
                    label: "Competitions",
                    value: chapter.id === "robotics" ? "6" : "3",
                    icon: Award,
                    color: "text-secondary-600",
                    bg: "bg-secondary-50",
                  },
                  {
                    label: "Growth",
                    value: `+${growthRate}%`,
                    icon: TrendingUp,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="card p-3 text-center">
                      <div className={`w-8 h-8 ${stat.bg} flex items-center justify-center mx-auto mb-1.5`}>
                        <Icon size={16} className={stat.color} />
                      </div>
                      <p className="text-xl font-bold text-primary-800 leading-tight">
                        {stat.value}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Member Growth Line Chart */}
              <div className="card p-5">
                <h3 className="text-sm font-bold text-primary-700 mb-1 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary-500" /> Member Growth Over Time
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Tracking total membership from September to March this academic year.
                </p>
                {hasGrowthData ? (
                  <GrowthLineChart data={monthlyMembers} />
                ) : (
                  <div className="h-48 border border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center">
                    <p className="text-sm text-neutral-500">
                      No member growth data yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Monthly Attendance Bar Chart */}
              <div className="card p-5">
                <h3 className="text-sm font-bold text-primary-700 mb-1 flex items-center gap-2">
                  <Calendar size={16} className="text-secondary-500" /> Monthly Attendance Rate
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Average meeting attendance percentage by month.
                </p>
                <AttendanceChart
                  data={[
                    { month: "Sep", value: 78 },
                    { month: "Oct", value: 82 },
                    { month: "Nov", value: 75 },
                    { month: "Dec", value: 88 },
                    { month: "Jan", value: 92 },
                    { month: "Feb", value: 85 },
                    { month: "Mar", value: 90 },
                  ]}
                />
              </div>

              {/* Performance Donuts + Radar side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-5">
                  <h3 className="text-sm font-bold text-primary-700 mb-1 flex items-center gap-2">
                    <BarChart3 size={16} className="text-primary-500" /> Performance Scores
                  </h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Engagement reflects active participation in meetings, events,
                    and ongoing club involvement.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <DonutChart
                      value={engagement}
                      label="Engagement"
                      color="#1e3a5f"
                    />
                    <DonutChart
                      value={retention}
                      label="Retention"
                      color="#b8860b"
                    />
                    <DonutChart
                      value={satisfaction}
                      label="Satisfaction"
                      color="#16a34a"
                    />
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="text-sm font-bold text-primary-700 mb-1 flex items-center gap-2">
                    <Compass size={16} className="text-primary-500" /> Club Health Radar
                  </h3>
                  <p className="text-xs text-neutral-500 mb-2">
                    Multi-dimensional overview of club performance.
                  </p>
                  <RadarChart
                    data={[
                      { label: "Engagement", value: engagement },
                      {
                        label: "Growth",
                        value: Math.min(95, 50 + growthRate * 3),
                      },
                      {
                        label: "Events",
                        value: Math.min(
                          100,
                          (chapterEvents.length +
                            localEvents.length +
                            dbEvents.length) *
                            25,
                        ),
                      },
                      { label: "Retain", value: retention },
                      {
                        label: "Impact",
                        value: Math.min(90, 50 + chapter.memberCount / 2),
                      },
                      {
                        label: "Lead",
                        value: Math.min(95, 60 + chapter.officers.length * 8),
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Key Metrics bars */}
              <div className="card p-5">
                <h3 className="text-sm font-bold text-primary-700 mb-3 flex items-center gap-2">
                  <Award size={16} className="text-secondary-500" /> Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <BarSegment
                    label="Engagement"
                    value={engagement}
                    max={100}
                    color="bg-primary-500"
                  />
                  <BarSegment
                    label="Attendance"
                    value={Math.min(95, 65 + yearsSinceFounded * 3)}
                    max={100}
                    color="bg-primary-400"
                  />
                  <BarSegment
                    label="Retention"
                    value={retention}
                    max={100}
                    color="bg-secondary-500"
                  />
                  <BarSegment
                    label="Impact"
                    value={Math.min(90, 50 + chapter.memberCount / 2)}
                    max={100}
                    color="bg-secondary-400"
                  />
                  <BarSegment
                    label="Leadership"
                    value={Math.min(95, 60 + chapter.officers.length * 8)}
                    max={100}
                    color="bg-primary-600"
                  />
                </div>
              </div>

              {/* Demographics */}
              <div className="card p-5">
                <h3 className="text-sm font-bold text-primary-700 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-primary-500" /> Member Demographics
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { grade: "9th Grade", pct: 15, color: "from-blue-400 to-blue-600" },
                    { grade: "10th Grade", pct: 28, color: "from-primary-400 to-primary-600" },
                    { grade: "11th Grade", pct: 35, color: "from-secondary-400 to-secondary-600" },
                    { grade: "12th Grade", pct: 22, color: "from-green-400 to-green-600" },
                  ].map((g) => (
                    <div key={g.grade} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15.9" fill="none"
                            strokeWidth="3"
                            stroke={g.grade === "9th Grade" ? "#60a5fa" : g.grade === "10th Grade" ? "#1e3a5f" : g.grade === "11th Grade" ? "#b8860b" : "#16a34a"}
                            strokeDasharray={`${g.pct} ${100 - g.pct}`}
                            strokeDashoffset="25"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary-700">{g.pct}%</span>
                      </div>
                      <p className="text-xs font-medium text-neutral-600">{g.grade}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <Reveal>
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2">
                    <Calendar size={16} /> Club Events
                  </h2>
                  {isFounder && !addingEvent && (
                    <button
                      onClick={() => setAddingEvent(true)}
                      className="btn-outline text-xs flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Event
                    </button>
                  )}
                </div>
                {isFounder && addingEvent && (
                  <div className="mb-4 border border-primary-200 bg-primary-50/40 p-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Event title"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="input-field text-sm w-full"
                    />
                    <input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="input-field text-sm w-full"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setAddingEvent(false);
                          setNewEventTitle("");
                          setNewEventDate("");
                        }}
                        className="btn-outline text-xs px-3 py-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!newEventTitle.trim() || !newEventDate) return;
                          const title = newEventTitle.trim();
                          const date = newEventDate;
                          // Save to local state immediately as optimistic update
                          const tempId = `local-${Date.now()}`;
                          setLocalEvents((prev) => [
                            ...prev,
                            { id: tempId, title, date },
                          ]);
                          setNewEventTitle("");
                          setNewEventDate("");
                          setAddingEvent(false);
                          // Persist to Supabase
                          try {
                            const { data: matchedOrg } =
                              await organizationsApi.getBySlug(chapter.id);
                            if (matchedOrg) {
                              const { data: session } =
                                await supabase.auth.getSession();
                              const userId = session?.session?.user?.id;
                              const { data: saved } = await eventsApi.create({
                                name: title,
                                org_id: matchedOrg.id,
                                time: new Date(date).toISOString(),
                                is_public: true,
                                ...(userId ? { created_by: userId } : {}),
                              });
                              if (saved) {
                                // Move from local to db events so it persists on refresh
                                setLocalEvents((prev) =>
                                  prev.filter((e) => e.id !== tempId),
                                );
                                setDbEvents((prev) => [
                                  ...prev,
                                  {
                                    id: saved.id,
                                    title: saved.name,
                                    date: saved.time?.slice(0, 10) || date,
                                  },
                                ]);
                              }
                            }
                          } catch (e) {
                            console.error("Event save error:", e);
                          }
                        }}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                {chapterEvents.length === 0 &&
                localEvents.length === 0 &&
                dbEvents.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">
                    No upcoming events scheduled.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {localEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="block border border-secondary-200 bg-secondary-50/30 p-4 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center bg-gradient-to-b from-secondary-500 to-secondary-600 text-white p-2 min-w-[48px] shadow-sm">
                            <div className="text-[9px]">
                              {new Date(ev.date).toLocaleDateString("en-US", {
                                month: "short",
                              })}
                            </div>
                            <div className="text-lg font-bold">
                              {new Date(ev.date).getDate()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-primary-700 text-sm">
                              {ev.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {new Date(ev.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-secondary-100 text-secondary-700 font-semibold">
                            New
                          </span>
                        </div>
                      </div>
                    ))}
                    {dbEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="block border border-emerald-200 bg-emerald-50/30 p-4 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center bg-gradient-to-b from-emerald-500 to-emerald-600 text-white p-2 min-w-[48px] shadow-sm">
                            <div className="text-[9px]">
                              {new Date(ev.date).toLocaleDateString("en-US", {
                                month: "short",
                              })}
                            </div>
                            <div className="text-lg font-bold">
                              {new Date(ev.date).getDate()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-primary-700 text-sm">
                              {ev.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {new Date(ev.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 font-semibold">
                            Saved
                          </span>
                        </div>
                      </div>
                    ))}
                    {chapterEvents.map((event) => (
                      <Link
                        href={`/events/${event.id}`}
                        key={event.id}
                        className="block  border border-neutral-200 p-4 hover:border-primary-300 hover:bg-primary-50/40 ux-hover-lift-sm group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center bg-gradient-to-b from-primary-500 to-primary-600 text-white p-2 min-w-[48px] shadow-sm ">
                            <div className="text-[9px]">
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                { month: "short" },
                              )}
                            </div>
                            <div className="text-lg font-bold">
                              {new Date(event.date).getDate()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-primary-700 group-hover:text-primary-600 text-sm">
                              {event.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {event.startTime} - {event.endTime} ·{" "}
                              {event.location}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {event.requiresRSVP && (
                              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                RSVP
                              </span>
                            )}
                            <span className="text-[10px] text-neutral-400">
                              {event.currentAttendees} attending
                            </span>
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
                <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4">
                  <Rocket size={16} /> Club Projects
                </h2>
                {projects.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">
                    No projects listed yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className=" border border-neutral-200 p-4 hover:border-primary-200 transition-colors ux-hover-lift-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${project.status === "in_progress" ? "bg-blue-100 text-blue-700" : project.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                            >
                              {project.status === "in_progress"
                                ? "In Progress"
                                : project.status === "completed"
                                  ? "Completed"
                                  : "Planning"}
                            </span>
                            <h3 className="font-bold text-primary-800 mt-2 text-sm">
                              {project.title}
                            </h3>
                            <p className="text-sm text-neutral-600 mt-1">
                              {project.description}
                            </p>
                          </div>
                          <div
                            className={`w-8 h-8  flex items-center justify-center shrink-0 ${project.status === "in_progress" ? "bg-blue-50 text-blue-600" : project.status === "completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}
                          >
                            {project.status === "completed" ? (
                              <CheckCircle size={16} />
                            ) : project.status === "in_progress" ? (
                              <Zap size={16} />
                            ) : (
                              <Target size={16} />
                            )}
                          </div>
                        </div>
                        {project.status === "in_progress" && (
                          <div className="mt-3 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full animate-progress-fill"
                              style={{ width: "65%" }}
                            />
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
                <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4">
                  <History size={16} /> Club Timeline
                </h2>
                {history.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">
                    No history available yet.
                  </p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-100" />
                    <div className="space-y-3">
                      {visibleHistory.map((event) => {
                        const typeColors: Record<string, string> = {
                          founded: "bg-green-100 text-green-700",
                          milestone: "bg-blue-100 text-blue-700",
                          achievement: "bg-yellow-100 text-yellow-700",
                          competition_result: "bg-purple-100 text-purple-700",
                          membership_milestone: "bg-teal-100 text-teal-700",
                          event_highlight: "bg-orange-100 text-orange-700",
                        };
                        const color =
                          typeColors[event.eventType] ||
                          "bg-primary-100 text-primary-700";
                        return (
                          <div key={event.id} className="relative pl-12">
                            <div
                              className={`absolute left-[11px] w-7 h-7 rounded-full ${color} flex items-center justify-center text-xs z-10`}
                            >
                              {event.eventType === "founded" ? (
                                <Star size={12} />
                              ) : event.eventType === "achievement" ? (
                                <Trophy size={12} />
                              ) : (
                                <Milestone size={12} />
                              )}
                            </div>
                            <div className=" border border-neutral-200 p-3 hover:border-primary-200 transition-colors ux-hover-lift-sm">
                              <div className="flex items-baseline justify-between gap-2">
                                <h3 className="font-bold text-primary-800 text-sm">
                                  {event.title}
                                </h3>
                                <span className="text-[10px] text-neutral-400 shrink-0">
                                  {new Date(event.eventDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", year: "numeric" },
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-neutral-600 mt-1">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {history.length > 4 && (
                      <button
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="mt-3 ml-12 text-sm font-semibold text-primary-600 hover:underline flex items-center gap-1"
                      >
                        {showAllHistory
                          ? "Show less"
                          : `Show all ${history.length} events`}{" "}
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${showAllHistory ? "rotate-180" : ""}`}
                        />
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
                <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4">
                  <FileText size={16} /> Meeting Notes
                </h2>
                {notes.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-8 text-center">
                    No meeting notes available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className=" border border-neutral-200 p-4 ux-hover-lift-sm"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-primary-800 text-sm">
                              {note.title}
                            </h3>
                            <p className="text-[10px] text-neutral-500">
                              {new Date(note.meetingDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}{" "}
                              · {note.attendeeCount} attendees
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-700">
                          {note.content}
                        </p>
                        {note.actionItems.length > 0 && (
                          <div className="mt-3 bg-primary-50/40 border border-primary-100  p-3">
                            <h4 className="text-[10px] font-bold text-primary-700 mb-1.5">
                              ACTION ITEMS
                            </h4>
                            <div className="space-y-1">
                              {note.actionItems.map((item) => (
                                <div
                                  key={item.task}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <span
                                    className={`mt-0.5 ${item.completed ? "text-green-600" : "text-neutral-400"}`}
                                  >
                                    {item.completed ? (
                                      <CheckCircle size={12} />
                                    ) : (
                                      <div className="w-3 h-3 rounded-full border-2 border-neutral-300" />
                                    )}
                                  </span>
                                  <span
                                    className={`text-xs ${item.completed ? "line-through text-neutral-400" : "text-neutral-700"}`}
                                  >
                                    {item.task}{" "}
                                    <span className="text-neutral-400">
                                      — {item.assignee}
                                    </span>
                                  </span>
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
        </div>

        <aside className="space-y-5">
          <div className="card p-5 bg-gradient-to-br from-primary-50/60 to-white border-primary-100">
            <h2 className="text-base font-heading font-bold text-primary-600">
              Quick Facts
            </h2>
            <div className="mt-3 text-sm text-neutral-700 space-y-2">
              {[
                {
                  label: "Members",
                  value: String(chapter.memberCount),
                  icon: Users,
                },
                { label: "Category", value: chapter.category, icon: BookOpen },
                { label: "Status", value: "Active", icon: CheckCircle },
                {
                  label: "Meets",
                  value: `${chapter.meetingFrequency}, ${chapter.meetingTime}`,
                  icon: Clock,
                },
                {
                  label: "Founded",
                  value: String(chapter.foundedYear),
                  icon: Calendar,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <Icon size={12} className="text-primary-400 shrink-0" />
                    <span className="font-semibold text-primary-700 text-xs">
                      {item.label}:
                    </span>
                    <span className="text-xs">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2">
              <Mail size={14} /> Contact
            </h2>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-8 h-8  bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Star size={14} />
              </div>
              <div>
                <p className="font-semibold text-neutral-800 text-sm">
                  {chapter.advisor.name}
                </p>
                <p className="text-[10px] text-neutral-500">
                  {chapter.advisor.department}
                </p>
                <a
                  href={`mailto:${chapter.advisor.email}`}
                  className="text-xs text-primary-600 hover:underline"
                >
                  {chapter.advisor.email}
                </a>
                {chapter.advisor.phone && (
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Phone size={9} /> {chapter.advisor.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2">
              <MapPin size={14} /> Location
            </h2>
            <div className="mt-3 text-sm space-y-1">
              <p className="font-semibold text-neutral-700">
                {chapter.meetingLocation.room || "Campus"}
              </p>
              {chapter.meetingLocation.internalLocation && (
                <p className="text-xs text-neutral-500">
                  {chapter.meetingLocation.internalLocation}
                </p>
              )}
              <Link
                href="/directory"
                className="text-primary-600 hover:underline text-xs mt-2 inline-block"
              >
                View on Map →
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2">
              <Globe size={14} /> Links
            </h2>
            <div className="mt-3 space-y-1.5 text-sm">
              {chapter.socialLinks.website && (
                <a
                  href={chapter.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary-600 hover:underline p-1.5  hover:bg-primary-50 text-xs"
                >
                  <ExternalLink size={12} /> Website
                </a>
              )}
              {chapter.socialLinks.instagram && (
                <div className="flex items-center gap-2 text-neutral-700 text-xs p-1.5">
                  <Instagram size={12} className="text-pink-500" />{" "}
                  {chapter.socialLinks.instagram}
                </div>
              )}
              {chapter.socialLinks.twitter && (
                <div className="flex items-center gap-2 text-neutral-700 text-xs p-1.5">
                  <Twitter size={12} className="text-blue-400" />{" "}
                  {chapter.socialLinks.twitter}
                </div>
              )}
              {chapter.socialLinks.discord && (
                <div className="flex items-center gap-2 text-neutral-700 text-xs p-1.5">
                  <MessageSquare size={12} className="text-indigo-500" />{" "}
                  {chapter.socialLinks.discord}
                </div>
              )}
            </div>
          </div>

          {chapterSponsors.length > 0 && (
            <div className="card p-5">
              <h2 className="text-base font-heading font-bold text-primary-600 flex items-center gap-2">
                <Heart size={14} /> Sponsors
              </h2>
              <div className="mt-3 space-y-2">
                {chapterSponsors.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-sm p-1.5  hover:bg-primary-50/50"
                  >
                    <div className="w-7 h-7  bg-secondary-50 text-secondary-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {s.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 text-xs">
                        {s.name}
                      </p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.tier === "platinum" ? "bg-purple-100 text-purple-700" : s.tier === "gold" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {s.tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h2 className="text-base font-heading font-bold text-primary-600">
              Related Clubs
            </h2>
            <div className="mt-3 space-y-2">
              {chapters
                .filter(
                  (c) => c.category === chapter.category && c.id !== chapter.id,
                )
                .slice(0, 3)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/directory/${c.id}`}
                    className="flex items-center gap-2 p-1.5  hover:bg-primary-50 transition-colors group"
                  >
                    <div className="w-7 h-7  bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold group-hover:scale-110 transition-transform">
                      {c.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary-700 truncate">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {c.memberCount} members
                      </p>
                    </div>
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
