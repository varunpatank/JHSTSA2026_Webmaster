"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import Link from "next/link";
import AuthRequiredNotice from "@/components/AuthRequiredNotice";
import HeroSection from "@/components/HeroSection";
import { useRouter } from "next/navigation";
import { useAuthGate } from "@/lib/useAuthGate";
import { addAdminClub, addCreatedChapter } from "@/lib/clientState";
import { supabase, clubProposalsApi, storageApi, myClubsApi } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Image as ImageIcon,
  Info,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Palette,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  Users,
  Gift,
  Globe2,
  Flag,
  Heart,
  FileText,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Type,
  Undo2,
  Redo2,
  Copy,
  Download,
  Eye,
  Edit3,
} from "lucide-react";

const CONSTITUTION_TEMPLATE = `ARTICLE I — NAME
The name of this organization shall be [Club Name].

ARTICLE II — PURPOSE
The purpose of this club is to [describe mission and goals].

ARTICLE III — MEMBERSHIP
Section 1. Membership is open to all students enrolled at [School Name].
Section 2. Members must attend at least [number] meetings per semester.
Section 3. Members shall pay dues of $[amount] per [period], if applicable.

ARTICLE IV — OFFICERS
Section 1. The officers of this club shall be: President, Vice President, Secretary, and Treasurer.
Section 2. Officers shall be elected by majority vote of active members.
Section 3. Officers shall serve a term of one academic year.
Section 4. Officer responsibilities:
  a) President: Presides over meetings, represents the club, sets agenda.
  b) Vice President: Assists the President, assumes duties in their absence.
  c) Secretary: Records minutes, maintains membership roster, handles correspondence.
  d) Treasurer: Manages finances, collects dues, submits budget reports.

ARTICLE V — MEETINGS
Section 1. Regular meetings shall be held [schedule, e.g., every Tuesday at 3:30 PM].
Section 2. Special meetings may be called by the President or by petition of [number] members.
Section 3. A quorum of [number or percentage] members is required for official business.

ARTICLE VI — ADVISOR
Section 1. The club shall have a faculty advisor approved by the school administration.
Section 2. The advisor shall attend meetings when possible and oversee club activities.

ARTICLE VII — AMENDMENTS
Section 1. Amendments may be proposed by any member in good standing.
Section 2. Amendments require a two-thirds vote of members present at a regular meeting.
Section 3. Proposed amendments must be announced at least one meeting in advance.

ARTICLE VIII — DISSOLUTION
In the event of dissolution, all remaining funds shall be donated to [organization or school fund].`;

function ConstitutionEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const pushHistory = (text: string) => {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(text);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  };

  const handleChange = (text: string) => {
    onChange(text);
    pushHistory(text);
  };

  const undo = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      onChange(history[idx]);
    }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      onChange(history[idx]);
    }
  };

  const insertAtCursor = (before: string, after: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newText =
      value.slice(0, start) + before + selected + after + value.slice(end);
    handleChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    }, 0);
  };

  const loadTemplate = () => {
    const club =
      (
        document.querySelector(
          'input[placeholder*="Robotics"]',
        ) as HTMLInputElement
      )?.value || "[Club Name]";
    handleChange(CONSTITUTION_TEMPLATE.replace("[Club Name]", club));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const articleCount = (value.match(/^ARTICLE/gm) || []).length;

  return (
    <div className="border-2 border-primary-200  overflow-hidden bg-white">
      {}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-primary-50 border-b border-primary-200">
        <button
          type="button"
          onClick={undo}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Undo"
        >
          <Undo2 size={14} />
        </button>
        <button
          type="button"
          onClick={redo}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Redo"
        >
          <Redo2 size={14} />
        </button>
        <div className="w-px h-5 bg-primary-200 mx-1" />
        <button
          type="button"
          onClick={() => insertAtCursor("**", "**")}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("_", "_")}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("\nARTICLE — ", "\n")}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Article Heading"
        >
          <Heading1 size={14} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("\nSection ", ". ")}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Section"
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("\n  - ")}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Bullet"
        >
          <List size={14} />
        </button>
        <div className="w-px h-5 bg-primary-200 mx-1" />
        <button
          type="button"
          onClick={copyToClipboard}
          className="p-1.5 rounded hover:bg-primary-100 text-neutral-600"
          title="Copy"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className={`p-1.5 rounded ${preview ? "bg-primary-200 text-primary-700" : "hover:bg-primary-100 text-neutral-600"}`}
          title="Preview"
        >
          {preview ? <Edit3 size={14} /> : <Eye size={14} />}
        </button>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={loadTemplate}
            className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1"
          >
            <FileText size={12} /> Load Template
          </button>
        </div>
      </div>

      {}
      {preview ? (
        <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto prose prose-sm">
          {value.split("\n").map((line, i) => {
            if (line.match(/^ARTICLE/))
              return (
                <h3
                  key={i}
                  className="text-primary-700 font-bold text-sm mt-4 mb-1 border-b border-primary-100 pb-1"
                >
                  {line}
                </h3>
              );
            if (line.match(/^Section/))
              return (
                <h4
                  key={i}
                  className="text-primary-600 font-semibold text-sm mt-2"
                >
                  {line}
                </h4>
              );
            if (line.trim().startsWith("-") || line.trim().startsWith("•"))
              return (
                <li key={i} className="text-sm text-neutral-700 ml-4">
                  {line.replace(/^\s*[-•]\s*/, "")}
                </li>
              );
            if (line.trim().match(/^[a-z]\)/))
              return (
                <li key={i} className="text-sm text-neutral-600 ml-8 list-none">
                  {line.trim()}
                </li>
              );
            if (!line.trim()) return <br key={i} />;
            return (
              <p key={i} className="text-sm text-neutral-700 my-0.5">
                {line}
              </p>
            );
          })}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-3 min-h-[300px] max-h-[500px] resize-y text-sm font-mono leading-relaxed focus:outline-none"
          placeholder="Write your club constitution here, or click 'Load Template' to start with a pre-filled template..."
        />
      )}

      {}
      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500">
        <span>
          {wordCount} words &middot; {articleCount} articles
        </span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
}

function InfoButton({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 inline-flex items-center justify-center hover:bg-primary-200 transition-colors ml-1"
      >
        <Info size={12} />
      </button>
      {open && (
        <div className="absolute z-30 left-1/2 -translate-x-1/2 top-7 w-64 bg-white border border-primary-200  shadow-lg p-3 text-xs text-neutral-700 leading-relaxed animate-fade-up">
          {text}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="block mt-2 text-primary-600 font-semibold hover:underline"
          >
            Got it
          </button>
        </div>
      )}
    </span>
  );
}

function LogoUploader({ onUpload }: { onUpload: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#1e3a5f");
  const [textColor, setTextColor] = useState("#ffffff");
  const [clubInitials, setClubInitials] = useState("CC");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      onUpload(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {}
        <div
          className="w-24 h-24  border-2 border-dashed border-primary-300 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: preview ? "transparent" : bgColor }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Logo preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold" style={{ color: textColor }}>
              {clubInitials}
            </span>
          )}
        </div>
        <div className="space-y-2 flex-1">
          <label className="btn-outline text-xs inline-flex items-center gap-1 cursor-pointer">
            <Upload size={12} /> Upload Logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          <p className="text-xs text-neutral-500">
            Or generate a quick logo below:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={3}
              value={clubInitials}
              onChange={(e) => setClubInitials(e.target.value.toUpperCase())}
              className="input-field w-16 text-center text-sm py-1"
              placeholder="CC"
            />
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border"
              title="Background"
            />
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border"
              title="Text"
            />
          </div>
        </div>
      </div>
      {preview && (
        <button
          type="button"
          onClick={() => setPreview(null)}
          className="text-xs text-red-600 hover:underline"
        >
          Remove uploaded logo
        </button>
      )}
    </div>
  );
}

function PosterDesigner({ clubName }: { clubName: string }) {
  const [template, setTemplate] = useState(0);
  const [tagline, setTagline] = useState("Join us and make a difference!");
  const [headerText, setHeaderText] = useState("New Club");
  const [footerText, setFooterText] = useState(
    "Visit ClubConnect to learn more and join.",
  );
  const templates = [
    { bg: "from-primary-600 to-secondary-600", accent: "text-secondary-300" },
    { bg: "from-purple-600 to-pink-600", accent: "text-pink-300" },
    { bg: "from-green-600 to-teal-600", accent: "text-teal-300" },
    { bg: "from-orange-500 to-red-600", accent: "text-orange-200" },
  ];
  const t = templates[template];

  return (
    <div className="space-y-3">
      <div
        className={`aspect-[3/4] max-w-xs mx-auto bg-gradient-to-br ${t.bg}  p-6 text-white flex flex-col justify-between relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">
            {headerText}
          </p>
          <h3 className="text-2xl font-bold mt-2 leading-tight">
            {clubName || "Your Club Name"}
          </h3>
          <p className={`text-sm mt-2 ${t.accent}`}>{tagline}</p>
        </div>
        <div className="relative">
          <div className="h-px bg-white/30 mb-3" />
          <p className="text-xs text-white/70">{footerText}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-center">
        {templates.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setTemplate(i)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${i === template ? "border-primary-600 scale-110" : "border-neutral-300"}`}
            style={{
              background: `linear-gradient(135deg, ${["#1e3a5f,#b8860b", "#9333ea,#ec4899", "#16a34a,#0d9488", "#f97316,#dc2626"][i]})`,
            }}
          />
        ))}
      </div>
      <div className="space-y-2">
        <input
          type="text"
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          className="input-field text-xs"
          placeholder="Header text (e.g., New Club)"
        />
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="input-field text-sm text-center"
          placeholder="Club tagline..."
        />
        <input
          type="text"
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          className="input-field text-xs"
          placeholder="Footer text..."
        />
      </div>
    </div>
  );
}

function GamifiedProgress({
  stages: stageList,
  completedStages,
  checkedItems,
  formData,
}: {
  stages: typeof stages;
  completedStages: number[];
  checkedItems: Record<string, boolean>;
  formData: Record<string, string>;
}) {
  const totalChecks = stageList.flatMap((s, si) =>
    s.checklist.map((_, ci) => `${s.id}-${ci}`),
  );
  const doneChecks = totalChecks.filter((k) => checkedItems[k]).length;
  const totalFields = stageList
    .flatMap((s) => s.formFields)
    .filter((f) => f.required).length;
  const doneFields = stageList
    .flatMap((s) => s.formFields)
    .filter((f) => f.required && !!formData[f.key]).length;
  const xp = doneChecks * 10 + doneFields * 25 + completedStages.length * 50;
  const level = xp < 100 ? 1 : xp < 250 ? 2 : xp < 400 ? 3 : xp < 600 ? 4 : 5;
  const titles = ["Rookie", "Explorer", "Builder", "Launcher", "Legend"];
  const badges = [
    { name: "First Step", icon: "👣", earned: doneChecks >= 1 },
    { name: "Planner", icon: "📋", earned: doneFields >= 3 },
    { name: "Author", icon: "✍️", earned: !!formData.constitution },
    { name: "Halfway", icon: "🏔️", earned: completedStages.length >= 3 },
    {
      name: "Ready to Launch",
      icon: "🚀",
      earned: completedStages.length === 5,
    },
  ];

  return (
    <div className="card p-5 bg-gradient-to-br from-primary-50 to-secondary-50/30 border-primary-200">
      <h3 className="font-bold text-primary-700 flex items-center gap-2 mb-3">
        <Trophy size={16} /> Your Progress
      </h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-lg font-bold">
          L{level}
        </div>
        <div className="flex-1">
          <p className="font-bold text-primary-800">{titles[level - 1]}</p>
          <p className="text-xs text-primary-600">{xp} XP earned</p>
          <div className="h-1.5 bg-primary-200 rounded-full mt-1">
            <div
              className="h-full bg-primary-600 rounded-full transition-all"
              style={{ width: `${Math.min((xp % 200) / 2, 100)}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <div
            key={b.name}
            className={`px-2 py-1  text-xs font-semibold flex items-center gap-1 ${b.earned ? "bg-secondary-100 text-secondary-700" : "bg-neutral-100 text-neutral-400"}`}
          >
            <span>{b.icon}</span> {b.name}
          </div>
        ))}
      </div>
    </div>
  );
}

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

const stages = [
  {
    id: 1,
    phase: "PHASE 1",
    title: "Dream It Up",
    subtitle: "Discover your passion and validate your idea",
    icon: Lightbulb,
    color: "from-primary-500 to-primary-600",
    bgLight: "bg-primary-50",
    borderColor: "border-primary-300",
    textColor: "text-primary-700",
    badgeColor: "bg-primary-100 text-primary-700",
    duration: "1-2 days",
    stat: { value: "200+", label: "Clubs started" },
    prompt:
      "What excites you most? Think about a gap in your school's club offerings — something you and your friends wish existed. Write down 3 ideas, then narrow it to the one that makes you most excited to show up every week.",
    description:
      "Every great club starts with an idea. Explore what you're passionate about, research existing clubs, and validate that your concept fills a gap.",
    checklist: [
      "Brainstorm 3-5 club ideas you're excited about",
      "Take the Club Finder Quiz to check for similar clubs",
      "Talk to 5+ friends to gauge interest",
      "Research successful clubs in your category",
    ],
    tips: [
      "Look at what's missing — not what already exists",
      "Your passion is contagious — choose something you love",
      "A niche focus attracts more dedicated members",
    ],
    links: [
      { href: "/directory", label: "Browse Existing Clubs", icon: Search },
      { href: "/resources", label: "Resource Library", icon: BookOpen },
    ],
    formFields: [
      {
        key: "name",
        label: "Club Name",
        placeholder: "e.g., Robotics Innovation Club",
        type: "input",
        required: true,
      },
      {
        key: "purpose",
        label: "Mission / Purpose",
        placeholder: "What will your club do and why does it matter?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: 2,
    phase: "PHASE 2",
    title: "Build Your Case",
    subtitle: "Nail down the details for a winning proposal",
    icon: Target,
    color: "from-primary-600 to-primary-700",
    bgLight: "bg-primary-50",
    borderColor: "border-primary-200",
    textColor: "text-primary-700",
    badgeColor: "bg-primary-100 text-primary-700",
    duration: "2-3 days",
    stat: { value: "6", label: "Key fields" },
    prompt:
      "Administration wants specifics. Pick your meeting day, time, and room. Draft a 2-sentence pitch: who is this club for, and what will members gain? A clear, concise proposal wins approval fast.",
    description:
      "Fill in the logistics — category, schedule, meeting location. A specific, well-organized proposal gets approved fast.",
    checklist: [
      "Choose a category that best fits your club",
      "Set a realistic meeting schedule",
      "Reserve a meeting room",
      "Draft a short pitch for the administration",
    ],
    tips: [
      "Admins love specifics — say 'Room 204, Tuesdays 3:30 PM'",
      "Mention how your club benefits the school community",
      "Check the directory for scheduling conflicts",
    ],
    links: [
      { href: "/resources", label: "Constitution Templates", icon: BookOpen },
      { href: "/directory", label: "Check Room Availability", icon: Compass },
    ],
    formFields: [
      {
        key: "category",
        label: "Category",
        placeholder: "",
        type: "select",
        required: true,
        options: [
          "STEM",
          "Arts",
          "Academic",
          "Service",
          "Cultural",
          "Sports",
          "Social",
          "Business",
          "Environmental",
        ],
      },
      {
        key: "meetingSchedule",
        label: "Meeting Schedule",
        placeholder: "e.g., Every Tuesday, 3:30 PM",
        type: "input",
        required: true,
      },
      {
        key: "location",
        label: "Meeting Location",
        placeholder: "e.g., Room 204",
        type: "input",
        required: true,
      },
      {
        key: "expectedMembers",
        label: "Expected Members",
        placeholder: "e.g., 25",
        type: "input",
        required: false,
      },
      {
        key: "budget",
        label: "Budget Requirements",
        placeholder: "e.g., $200/year for materials and competition fees",
        type: "textarea",
        required: false,
      },
      {
        key: "justification",
        label: "Why This Club Matters",
        placeholder: "Explain why this club should exist at your school...",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: 3,
    phase: "PHASE 3",
    title: "Assemble Your Team",
    subtitle: "Find your advisor and founding officers",
    icon: Users,
    color: "from-secondary-500 to-secondary-600",
    bgLight: "bg-secondary-50",
    borderColor: "border-secondary-300",
    textColor: "text-secondary-700",
    badgeColor: "bg-secondary-100 text-secondary-700",
    duration: "1 week",
    stat: { value: "12", label: "Avg founding members" },
    prompt:
      "A great team makes a great club. Approach a teacher who's genuinely interested in your topic — not just any teacher. Then recruit 3-5 friends who will actually commit, and give each person a role so everyone feels ownership.",
    description:
      "A club is only as strong as its people. Secure a faculty advisor, recruit your co-founders, and assign officer roles.",
    checklist: [
      "Secure a faculty advisor",
      "Recruit at least 3-5 founding members",
      "Assign key officer roles",
      "Create a group chat for your team",
    ],
    tips: [
      "Ask passionate people, not just popular ones",
      "Give everyone a meaningful role",
      "A Discord group keeps people engaged between meetings",
    ],
    links: [
      { href: "/events/new", label: "Create Launch Event", icon: Megaphone },
      { href: "/directory", label: "Find Potential Members", icon: Users },
    ],
    formFields: [
      {
        key: "advisor",
        label: "Faculty Advisor",
        placeholder: "e.g., Ms. Johnson",
        type: "input",
        required: true,
      },
      {
        key: "advisorEmail",
        label: "Advisor Email",
        placeholder: "advisor@school.edu",
        type: "input",
        required: false,
      },
      {
        key: "officers",
        label: "Initial Officers (optional)",
        placeholder: "President: Alex M., VP: Jordan L.",
        type: "textarea",
        required: false,
      },
      {
        key: "socialLinks",
        label: "Social Media Links (one per line)",
        placeholder: "instagram: https://...\ndiscord: https://...",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: 4,
    phase: "PHASE 4",
    title: "Launch & Promote",
    subtitle: "Make your debut and recruit your first members",
    icon: Rocket,
    color: "from-primary-700 to-secondary-600",
    bgLight: "bg-primary-50",
    borderColor: "border-primary-300",
    textColor: "text-primary-700",
    badgeColor: "bg-primary-100 text-primary-700",
    duration: "1-2 weeks",
    stat: { value: "3x", label: "Growth in first month" },
    prompt:
      "First impressions matter! Plan a kickoff meeting with a fun activity — not just a boring info session. Design a poster below, share it on social media, and hang it in the hallways. Free snacks boost attendance by 2x!",
    description:
      "Time to go live! Host your first meeting, set up your ClubConnect listing, and make a splash with promotions.",
    checklist: [
      "Host your first official meeting",
      "Create your ClubConnect directory listing",
      "Post your first event on the calendar",
      "Set up social media accounts",
      "Make posters or digital flyers",
    ],
    tips: [
      "Your first meeting sets the tone — fun AND productive",
      "Free food = 2x attendance",
      "Take photos for future recruitment",
    ],
    links: [
      { href: "/events/new", label: "Create First Event", icon: Star },
      { href: "/donate", label: "Start Fundraising", icon: Gift },
    ],
    formFields: [],
  },
  {
    id: 5,
    phase: "PHASE 5",
    title: "Grow & Thrive",
    subtitle: "Scale your club and make a lasting impact",
    icon: TrendingUp,
    color: "from-secondary-600 to-primary-600",
    bgLight: "bg-secondary-50",
    borderColor: "border-secondary-200",
    textColor: "text-secondary-700",
    badgeColor: "bg-secondary-100 text-secondary-700",
    duration: "Ongoing",
    stat: { value: "85%", label: "Clubs active 1yr" },
    prompt:
      "Your club is live — now build lasting traditions. Set one big quarterly goal, enter a competition, create an onboarding doc for new members, and start mentoring underclassmen who'll lead after you graduate.",
    description:
      "Your club is live — now make it legendary. Run competitions, build traditions, track achievements, and mentor new members.",
    checklist: [
      "Establish a regular meeting cadence",
      "Enter at least one competition",
      "Create onboarding docs for new members",
      "Set quarterly goals and track progress",
      "Plan a signature annual event",
    ],
    tips: [
      "Consistency beats intensity",
      "Rotate leadership tasks to develop future officers",
      "Document everything for next year's team",
    ],
    links: [
      { href: "/dashboard", label: "Club Dashboard", icon: TrendingUp },
      { href: "/resources", label: "Growth Resources", icon: Trophy },
    ],
    formFields: [],
  },
];

export default function StartAClubPage() {
  const router = useRouter();
  const { ready, loggedIn } = useAuthGate();
  const [activeStage, setActiveStage] = useState(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [resourceFiles, setResourceFiles] = useState<
    { name: string; file: File }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    category: "",
    meetingSchedule: "",
    location: "",
    advisor: "",
    advisorEmail: "",
    officers: "",
    constitution: "",
    expectedMembers: "",
    socialLinks: "",
    budget: "",
    justification: "",
  });

  const current = stages.find((s) => s.id === activeStage)!;
  const stageChecks = current.checklist.filter(
    (_, i) => checkedItems[`${activeStage}-${i}`],
  ).length;
  const stageProgress = Math.round(
    (stageChecks / current.checklist.length) * 100,
  );

  const totalFormFields = stages
    .flatMap((s) => s.formFields)
    .filter((f) => f.required);
  const completedFields = totalFormFields.filter(
    (f) => !!(formData as Record<string, string>)[f.key],
  ).length;
  const overallProgress = Math.round(
    (completedFields / totalFormFields.length) * 100,
  );

  const isStageReady = (stageId: number) => {
    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return false;

    const allStageFieldsFilled = stage.formFields.every((field) => {
      const value = (formData as Record<string, string>)[field.key] ?? "";
      return value.trim().length > 0;
    });

    if (!allStageFieldsFilled) return false;
    if (stageId === 2) return formData.constitution.trim().length > 0;
    return true;
  };

  const allStagesReady = stages.every((stage) => isStageReady(stage.id));

  if (!ready) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-500">Loading club creator...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <AuthRequiredNotice
        message="You need to log in before you can create a club."
        redirectTo="/start-a-club"
      />
    );
  }

  const markComplete = () => {
    if (!isStageReady(activeStage)) {
      alert(
        "Please fill out all fields for this phase before marking it complete.",
      );
      return;
    }
    if (!completedStages.includes(activeStage))
      setCompletedStages((prev) => [...prev, activeStage]);
    if (activeStage < stages.length) {
      setActiveStage(activeStage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/start-a-club");
        return;
      }

      setSubmitting(true);

      let logoUrl: string | undefined;
      if (logoFile) {
        const res = await storageApi.uploadFile(user.id, logoFile, "uploads");
        if (res.data) logoUrl = res.data.publicUrl;
      }

      const resourceLinksArr: { name: string; url: string }[] = [];
      for (const rf of resourceFiles) {
        const res = await storageApi.uploadFile(user.id, rf.file, "uploads");
        if (res.data)
          resourceLinksArr.push({
            name: rf.name || rf.file.name,
            url: res.data.publicUrl,
          });
      }

      const socialObj: Record<string, string> = {};
      if (formData.socialLinks.trim()) {
        formData.socialLinks.split("\n").forEach((line) => {
          const [key, ...rest] = line.split(":");
          if (key && rest.length)
            socialObj[key.trim().toLowerCase()] = rest.join(":").trim();
        });
      }

      await clubProposalsApi.create({
        submitted_by: user.id,
        club_name: formData.name,
        mission_statement: formData.purpose,
        category: formData.category || undefined,
        proposed_advisor: formData.advisor || undefined,
        advisor_email: formData.advisorEmail || undefined,
        constitution_draft: formData.constitution || undefined,
        meeting_schedule: formData.meetingSchedule || undefined,
        meeting_location: formData.location || undefined,
        meeting_space_needs: formData.location || undefined,
        interested_members: formData.officers || undefined,
        expected_members: formData.expectedMembers
          ? parseInt(formData.expectedMembers)
          : undefined,
        budget_requirements: formData.budget || undefined,
        justification: formData.justification || undefined,
        social_links: Object.keys(socialObj).length ? socialObj : undefined,
        resource_links: resourceLinksArr.length ? resourceLinksArr : undefined,
        logo_url: logoUrl,
      });

      // Also create the actual organization so it appears on the Discover page
      const slug =
        formData.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-") || `club-${Date.now()}`;
      const orgRes = await myClubsApi.createClub({
        name: formData.name,
        slug,
        description: formData.purpose,
        category: formData.category || undefined,
        meeting_schedule: formData.meetingSchedule || undefined,
        meeting_location: formData.location || undefined,
        advisor_name: formData.advisor || undefined,
        contact_email: formData.advisorEmail || undefined,
        logo_url: logoUrl,
        social_links: Object.keys(socialObj).length ? socialObj : undefined,
        created_by: user.id,
        is_published: true,
      });

      const orgId = orgRes.data?.id || slug;
      addAdminClub({ id: orgId, name: formData.name, status: "Published" });

      // Build a Chapter object so it shows up on the directory page immediately
      const newChapter: import("@/types").Chapter = {
        id: slug,
        name: formData.name,
        description: formData.purpose,
        category: (formData.category ||
          "Other") as import("@/types").ChapterCategory,
        meetingFrequency: "Weekly",
        membershipStatus: "Open Enrollment",
        gradeLevel: "All Grades",
        meetingTime: "After School",
        advisor: {
          name: formData.advisor || "TBD",
          email: formData.advisorEmail || "",
          department: "General",
        },
        officers: formData.officers
          ? formData.officers.split(",").map((o, i) => ({
              name: o.trim(),
              position:
                i === 0
                  ? "President"
                  : i === 1
                    ? "Vice President"
                    : i === 2
                      ? "Secretary"
                      : "Treasurer",
              email: "",
              grade: 11,
            }))
          : [{ name: "You", position: "President", email: "", grade: 11 }],
        meetingSchedule: formData.meetingSchedule || "TBD",
        meetingLocation: {
          lat: 47.7148986,
          lng: -122.1997857,
          parentOrg: "Juanita High School",
          room: formData.location || "TBD",
          internalLocation: formData.location || "",
        },
        membershipRequirements: "Open to all students",
        dues: "None",
        socialLinks: Object.keys(socialObj).length ? (socialObj as any) : {},
        achievements: [
          `Founded ${new Date().toLocaleDateString()}`,
          `${Math.floor(Math.random() * 10) + 5} interest signups`,
        ],
        photoGallery: [],
        memberCount: formData.expectedMembers
          ? parseInt(formData.expectedMembers)
          : Math.floor(Math.random() * 20) + 8,
        foundedYear: new Date().getFullYear(),
        isActive: true,
      };
      addCreatedChapter(newChapter);

      // Redirect to the discover page highlighting the new club
      router.push(`/directory?highlight=${slug}`);
      return;
    } catch (err) {
      console.error("Proposal submission failed:", err);
      alert("Failed to submit proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center px-4 overflow-hidden relative">
        <div className="max-w-lg mx-auto text-center relative z-10">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-primary-800 mb-3">
            Club Created!
          </h1>
          <p className="text-neutral-600 mb-6">
            Your club &ldquo;{formData.name}&rdquo; is now live on the
            directory. Redirecting...
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="btn-primary btn-magnetic">
              Go to Dashboard
            </Link>
            <Link href="/directory" className="btn-outline btn-magnetic">
              Browse Clubs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50">
      {}
      <HeroSection
        title="Start a New Club"
        description="Follow the phases, fill in your details along the way, and submit when you&rsquo;re ready."
        icon={<Rocket size={40} className="animate-float" />}
      />

      {}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-neutral-700">
              Phase {activeStage} of {stages.length}
            </span>
            <span className="text-neutral-500">
              Proposal {overallProgress}% complete
            </span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          {}
          <div className="mt-3 flex gap-1">
            {stages.map((s) => {
              const Icon = s.icon;
              const active = activeStage === s.id;
              const done = completedStages.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (s.id > activeStage && !isStageReady(activeStage))
                      return;
                    setActiveStage(s.id);
                  }}
                  className={`flex-1 flex items-center gap-2 p-2 text-xs font-semibold transition-all  ${active ? "text-primary-600 bg-primary-50" : done ? "text-green-600 bg-green-50" : "text-neutral-400 hover:bg-neutral-50"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? "bg-green-500 text-white" : active ? "bg-primary-500 text-white" : "bg-neutral-200 text-neutral-500"}`}
                  >
                    {done ? "✓" : s.id}
                  </div>
                  <span className="hidden sm:inline truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {}
      <div className="max-w-5xl mx-auto px-4 py-8" key={activeStage}>
        {}
        <div
          className={` overflow-hidden border-2 ${current.borderColor} mb-6 animate-slide-up-spring`}
        >
          <div className={`bg-gradient-to-r ${current.color} text-white p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur  flex items-center justify-center animate-float">
                <current.icon size={28} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                  {current.phase}
                </span>
                <h2 className="text-2xl font-heading font-bold mt-1">
                  {current.title}
                </h2>
                <p className="text-white/80 text-sm">{current.subtitle}</p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-xl font-bold">{current.stat.value}</div>
                  <div className="text-xs text-white/70">
                    {current.stat.label}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-white/80">
                    <Clock size={14} /> {current.duration}
                  </div>
                  <div className="text-xs text-white/60">Estimated</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${current.bgLight} px-6 py-2 flex items-center justify-between`}
          >
            <span className={`text-sm font-semibold ${current.textColor}`}>
              {stageChecks}/{current.checklist.length} tasks
            </span>
            <div className="w-24 h-1.5 bg-white/80 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all bg-gradient-to-r ${current.color}`}
                style={{ width: `${stageProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* About + Checklist */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3
                className={`font-bold ${current.textColor} flex items-center gap-2`}
              >
                <MessageCircle size={16} /> About This Phase
              </h3>
              <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                {current.description}
              </p>
              <div
                className={`mt-3 p-3  ${current.bgLight} border ${current.borderColor}`}
              >
                <p
                  className={`text-xs font-bold ${current.textColor} mb-1 flex items-center gap-1`}
                >
                  <Sparkles size={12} /> Phase Prompt
                </p>
                <p className="text-sm text-neutral-700 leading-relaxed italic">
                  {current.prompt}
                </p>
              </div>
              {/* Pro Tips inline */}
              <div className="mt-4 space-y-1.5">
                {current.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className={`w-5 h-5 rounded-full ${current.badgeColor} flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold`}
                    >
                      {i + 1}
                    </div>
                    <p className="text-xs text-neutral-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3
                className={`font-bold ${current.textColor} flex items-center gap-2 mb-3`}
              >
                <CheckCircle2 size={16} /> Checklist
              </h3>
              <div className="space-y-2">
                {current.checklist.map((item, i) => {
                  const key = `${activeStage}-${i}`;
                  const checked = !!checkedItems[key];
                  return (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-2.5 border cursor-pointer transition-all ${checked ? "bg-green-50 border-green-200" : "bg-white border-neutral-100 hover:border-primary-200"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setCheckedItems((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-green-600 focus:ring-green-500"
                      />
                      <span
                        className={`text-sm ${checked ? "line-through text-green-700" : "text-neutral-700"}`}
                      >
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
              {/* Tools & Resources inline */}
              <div className="mt-4 space-y-1.5">
                {current.links.map((link) => {
                  const LI = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 p-2 border ${current.borderColor} ${current.bgLight} hover:shadow-sm transition-all group`}
                    >
                      <LI size={14} className={current.textColor} />
                      <span className="font-medium text-xs text-neutral-700 group-hover:text-primary-700">
                        {link.label}
                      </span>
                      <ArrowRight
                        size={12}
                        className="ml-auto text-neutral-400 group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Logo Designer (Phase 1) */}
          {activeStage <= 1 && (
            <div className="card p-5 border-2 border-secondary-200 bg-secondary-50/30">
              <h3 className="font-bold text-secondary-700 flex items-center gap-2 mb-3">
                <ImageIcon size={16} /> Club Logo Designer
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                Upload your own logo or generate a quick one with initials and
                colors.
              </p>
              <LogoUploader
                onUpload={(file) => {
                  setLogoFile(file);
                }}
              />
            </div>
          )}

          {/* Form Fields */}
          {current.formFields.length > 0 && (
            <form
              onSubmit={handleSubmit}
              className="card p-5 border-2 border-primary-200 bg-primary-50/30"
            >
              <h3 className="font-bold text-primary-700 flex items-center gap-2 mb-4">
                <Sparkles size={16} /> Your Details
              </h3>
              <div className="space-y-4">
                {current.formFields.map((field) => {
                  const infoTexts: Record<string, string> = {
                    name: "Choose a unique, descriptive name. Avoid generic names. Check the directory to make sure it's not taken!",
                    purpose:
                      "A strong mission statement explains WHY your club exists, WHO it serves, and WHAT it will accomplish.",
                    category:
                      "Pick the category that best fits. This helps students find your club in the directory.",
                    meetingSchedule:
                      "Be specific: day, time, and frequency. Check the directory for room/time conflicts.",
                    location:
                      "Reserve your room through the school office first. Include building and room number.",
                    advisor:
                      "Your advisor must be a current faculty member. They'll need to sign off on your proposal.",
                    advisorEmail:
                      "We'll send your advisor a confirmation email and onboarding materials.",
                    officers:
                      "List your founding officers. You need at minimum a President; VP, Secretary, and Treasurer are recommended.",
                  };
                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                        {infoTexts[field.key] && (
                          <InfoButton text={infoTexts[field.key]} />
                        )}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          className="input-field min-h-20"
                          value={
                            (formData as Record<string, string>)[field.key]
                          }
                          placeholder={field.placeholder}
                          required={field.required}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [field.key]: e.target.value,
                            }))
                          }
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="select-field"
                          value={
                            (formData as Record<string, string>)[field.key]
                          }
                          required={field.required}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [field.key]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select...</option>
                          {field.options?.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="input-field"
                          value={
                            (formData as Record<string, string>)[field.key]
                          }
                          placeholder={field.placeholder}
                          required={field.required}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [field.key]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {}
            </form>
          )}

          {}
          {activeStage === 2 && (
            <div className="card p-5 border-2 border-primary-200 bg-primary-50/30 animate-slide-up-spring">
              <h3 className="font-bold text-primary-700 flex items-center gap-2 mb-2">
                <FileText size={16} /> Club Constitution Editor
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Draft your club constitution below. Click &ldquo;Load
                Template&rdquo; in the toolbar for a pre-filled starting point
                with all required articles.
              </p>
              <ConstitutionEditor
                value={formData.constitution}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, constitution: v }))
                }
              />
              {formData.constitution.length > 0 && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Constitution draft saved (
                  {formData.constitution.split(/\s+/).filter(Boolean).length}{" "}
                  words)
                </p>
              )}
            </div>
          )}

          {}
          {activeStage >= 4 &&
            completedStages.length === stages.length &&
            allStagesReady && (
              <form
                onSubmit={handleSubmit}
                className="card p-5 border-2 border-green-200 bg-green-50/50"
              >
                <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} /> Ready to Submit?
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  All stages complete and required details are filled in. You
                  can submit your proposal now!
                </p>
                <div className="text-sm space-y-1 mb-4 text-neutral-700">
                  <p>
                    <strong>Club:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Category:</strong> {formData.category}
                  </p>
                  <p>
                    <strong>Schedule:</strong> {formData.meetingSchedule}
                  </p>
                  <p>
                    <strong>Advisor:</strong> {formData.advisor}
                  </p>
                  {formData.expectedMembers && (
                    <p>
                      <strong>Expected Members:</strong>{" "}
                      {formData.expectedMembers}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary btn-magnetic btn-ripple w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    "Submitting…"
                  ) : (
                    <>
                      <Rocket size={16} /> Submit Club Proposal
                    </>
                  )}
                </button>
              </form>
            )}

          {/* Poster Designer (Phase 4) */}
          {activeStage === 4 && (
            <div className="card p-5 border-2 border-primary-200 bg-primary-50/30">
              <h3 className="font-bold text-primary-700 flex items-center gap-2 mb-3">
                <Palette size={16} /> Poster / Flyer Designer
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                Create a promotional poster for your club. Choose a template and
                customize:
              </p>
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-800 flex items-center gap-1.5">
                  <span className="text-base">📸</span> <strong>Tip:</strong>{" "}
                  Take a screenshot of your finished poster to save it — the
                  design will not be stored after you leave this page.
                </p>
              </div>
              <PosterDesigner clubName={formData.name} />
            </div>
          )}

          <div className="card p-5 border-2 border-primary-200 bg-primary-50/30">
            <h3 className="font-bold text-primary-700 flex items-center gap-2 mb-2">
              <Upload size={16} /> Supporting Resources
            </h3>
            <p className="text-sm text-neutral-600 mb-3">
              Attach proposal files. Every file below includes working preview
              and download actions.
            </p>
            <label className="btn-outline text-xs inline-flex items-center gap-1 cursor-pointer">
              <Upload size={12} /> Add Resource File
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setResourceFiles((prev) => [
                    ...prev,
                    { name: file.name, file },
                  ]);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            {resourceFiles.length > 0 ? (
              <div className="mt-3 space-y-2">
                {resourceFiles.map((resource, idx) => {
                  return (
                    <div
                      key={`${resource.name}-${idx}`}
                      className="border border-neutral-200 bg-white p-3 flex items-center gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-700 truncate">
                          {resource.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {(resource.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const objectUrl = URL.createObjectURL(resource.file);
                          window.open(
                            objectUrl,
                            "_blank",
                            "noopener,noreferrer",
                          );
                          window.setTimeout(
                            () => URL.revokeObjectURL(objectUrl),
                            3000,
                          );
                        }}
                        className="btn-outline text-xs px-2 py-1"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const objectUrl = URL.createObjectURL(resource.file);
                          const a = document.createElement("a");
                          a.href = objectUrl;
                          a.download = resource.file.name;
                          a.click();
                          window.setTimeout(
                            () => URL.revokeObjectURL(objectUrl),
                            3000,
                          );
                        }}
                        className="btn-outline text-xs px-2 py-1"
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setResourceFiles((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-xs text-neutral-500">
                No resource files added yet.
              </p>
            )}
          </div>

          {/* Proposal Progress (compact) */}
          <div className="card p-4">
            <h3 className="font-bold text-primary-700 flex items-center gap-2 mb-3">
              <Shield size={16} /> Proposal Progress
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Club name", done: !!formData.name },
                { label: "Mission defined", done: !!formData.purpose },
                { label: "Category selected", done: !!formData.category },
                { label: "Schedule planned", done: !!formData.meetingSchedule },
                { label: "Location set", done: !!formData.location },
                { label: "Advisor identified", done: !!formData.advisor },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border ${item.done ? "bg-green-50 text-green-700 border-green-200" : "bg-neutral-50 text-neutral-400 border-neutral-200"}`}
                >
                  {item.done ? "✓" : "○"} {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setActiveStage((s) => Math.max(1, s - 1))}
            className={`btn-outline flex items-center gap-2 ${activeStage === 1 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <div className="flex gap-3">
            {!completedStages.includes(activeStage) && (
              <button
                onClick={markComplete}
                className="btn-outline text-green-700 border-green-300 hover:bg-green-50 flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> Mark Complete
              </button>
            )}
            {activeStage < stages.length && (
              <button
                onClick={() => {
                  if (!isStageReady(activeStage)) {
                    alert(
                      "Please fill out all fields in this phase before moving to the next one.",
                    );
                    return;
                  }
                  setActiveStage((s) => s + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn-primary btn-magnetic flex items-center gap-2"
              >
                Next Phase <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {}
        {completedStages.length === stages.length && (
          <Reveal>
            <div className="mt-10 text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50  border-2 border-green-200 animate-scale-bounce">
              <Trophy size={36} className="mx-auto text-green-600 mb-3" />
              <h3 className="text-2xl font-bold text-green-800">
                All Phases Complete!
              </h3>
              <p className="text-green-700 mt-2">
                You&rsquo;re ready to launch an amazing club.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
