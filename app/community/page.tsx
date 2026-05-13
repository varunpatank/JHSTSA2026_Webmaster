"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import HeroSection from "@/components/HeroSection";
import { supabase, profilesApi, storageApi } from "@/lib/api";
import {
  Download,
  FileText,
  Heart,
  ImageIcon,
  Loader2,
  MessageCircle,
  Send,
  Upload,
  X,
  Bookmark,
  Share2,
  Calendar,
  MoreHorizontal,
  GraduationCap,
  Video,
  Award,
  ArrowRight,
  Globe,
  Clock,
  Trophy,
  Trash2,
  Check,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  Layers,
} from "lucide-react";

/*  Types  */
interface FeedReply {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

interface FeedPost {
  id: number;
  author: string;
  avatar: string;
  club: string;
  time: string;
  text: string;
  type: "text" | "resource" | "image" | "achievement" | "discussion";
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  replies: FeedReply[];
}

/*  Seed Data  */
const INITIAL_FEED: FeedPost[] = [
  {
    id: 1,
    author: "Maria G.",
    avatar: "MG",
    club: "TSA",
    time: "2 hours ago",
    text: "Just uploaded the full TSA presentation template pack our chapter used at States. Feel free to download and customize!",
    type: "resource",
    fileName: "TSA_Presentation_Templates.zip",
    fileSize: "4.2 MB",
    likes: 24,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "James L.",
        avatar: "JL",
        text: "This is incredible, thanks Maria! Using this for regionals.",
        time: "1h ago",
      },
      {
        id: 2,
        author: "Sophie K.",
        avatar: "SK",
        text: "The slide layouts are really clean. Great work!",
        time: "45m ago",
      },
    ],
  },
  {
    id: 2,
    author: "Alex J.",
    avatar: "AJ",
    club: "Robotics",
    time: "5 hours ago",
    text: "Does anyone have experience with PID tuning for FTC robots? We keep overshooting our target position.",
    type: "discussion",
    likes: 8,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Taylor M.",
        avatar: "TM",
        text: "Try reducing your P gain and adding a small D term. We had the same issue last season.",
        time: "4h ago",
      },
    ],
  },
  {
    id: 3,
    author: "Sophie K.",
    avatar: "SK",
    club: "NHS",
    time: "1 day ago",
    text: "Our chapter just hit 500 community service hours this semester! So proud of everyone who contributed to this milestone.",
    type: "achievement",
    likes: 42,
    liked: false,
    saved: false,
    replies: [],
  },
  {
    id: 4,
    author: "James L.",
    avatar: "JL",
    club: "FBLA",
    time: "1 day ago",
    text: "Here is the fundraiser tracking spreadsheet I made. It auto-calculates profit margins and has a built-in dashboard view.",
    type: "resource",
    fileName: "FBLA_Fundraiser_Tracker.xlsx",
    fileSize: "1.8 MB",
    likes: 31,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Maria G.",
        avatar: "MG",
        text: "The formulas in this are next level. Sharing with our treasurer!",
        time: "22h ago",
      },
    ],
  },
  {
    id: 5,
    author: "Taylor M.",
    avatar: "TM",
    club: "Drama",
    time: "2 days ago",
    text: "Spring musical auditions are next week! Drop your best monologue tips below.",
    type: "text",
    likes: 15,
    liked: false,
    saved: false,
    replies: [],
  },
  {
    id: 6,
    author: "Priya K.",
    avatar: "PK",
    club: "Debate",
    time: "3 days ago",
    text: "Uploading my evidence files and case briefs from last tournament. Hope these help someone prepping for districts!",
    type: "resource",
    fileName: "Debate_Evidence_Briefs.pdf",
    fileSize: "2.5 MB",
    likes: 19,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Alex J.",
        avatar: "AJ",
        text: "These sources are gold. Thank you so much!",
        time: "2d ago",
      },
    ],
  },
];

const MENTORS = [
  {
    id: "m1",
    name: "Dr. Sarah Chen",
    avatar: "SC",
    role: "Senior Software Engineer at Microsoft",
    specialty: "Software Development & AI/ML",
    available: true,
    email: "sarah.chen@microsoft.com",
  },
  {
    id: "m4",
    name: "David Park",
    avatar: "DP",
    role: "Mechanical Engineer, Boeing",
    specialty: "Robotics & Engineering Design",
    available: true,
    email: "david.park@boeing.com",
  },
  {
    id: "m3",
    name: "Maria Gonzalez",
    avatar: "MG",
    role: "Community Organizer, United Way",
    specialty: "Nonprofit Leadership & Service",
    available: true,
    email: "maria.gonzalez@unitedway.org",
  },
];

const CLUB_EVENTS = [
  {
    id: 1,
    title: "TSA State Competition 2026",
    club: "TSA",
    date: "March 15–17, 2026",
    location: "Olympia Convention Center, WA",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    spots: 40,
    registered: 32,
    type: "Competition",
    typeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 2,
    title: "Spring Fundraiser Showcase",
    club: "NHS",
    date: "April 28, 2026",
    location: "Main Gym, Juanita High School",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    spots: 200,
    registered: 145,
    type: "Fundraiser",
    typeColor: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    title: "Robotics Open House",
    club: "Robotics",
    date: "May 3, 2026",
    location: "STEM Lab, Room 204",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    spots: 60,
    registered: 41,
    type: "Open House",
    typeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 4,
    title: "Cultural Night 2026",
    club: "Cultural Club",
    date: "May 10, 2026",
    location: "Auditorium",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    spots: 350,
    registered: 210,
    type: "Cultural",
    typeColor: "bg-orange-100 text-orange-700",
  },
  {
    id: 5,
    title: "DECA Regional Competition",
    club: "DECA",
    date: "May 22, 2026",
    location: "Bellevue College, WA",
    image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=800&q=80",
    spots: 30,
    registered: 28,
    type: "Competition",
    typeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 6,
    title: "End of Year Club Fair",
    club: "Student Council",
    date: "June 5, 2026",
    location: "Front Courtyard",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    spots: 500,
    registered: 180,
    type: "Fair",
    typeColor: "bg-secondary-100 text-secondary-700",
  },
];

const MENTOR_PHOTOS: Record<string, string> = {
  "m1": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "m4": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  "m3": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
};

const SUCCESS_STORIES = [
  {
    id: 1,
    title: "From Regionals to Nationals",
    club: "TSA",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    excerpt: "How Juanita TSA went from regional qualifiers to placing top 3 at the national conference in Louisville.",
    author: "Maria G.",
    role: "TSA Chapter President",
    date: "March 2026",
    tag: "Competition",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 2,
    title: "500 Service Hours in One Semester",
    club: "NHS",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    excerpt: "NHS Chapter hit a record-breaking semester with coordinated volunteer drives across 12 community partner sites.",
    author: "Sophie K.",
    role: "NHS Secretary",
    date: "February 2026",
    tag: "Service",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    title: "1st Place at HackNW 2025",
    club: "CS Club",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    excerpt: "CS Club took first place at the regional hackathon with an AI-powered accessibility tool built in 24 hours.",
    author: "Alex J.",
    role: "CS Club Lead Developer",
    date: "November 2025",
    tag: "Hackathon",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 4,
    title: "Sold-Out Spring Musical",
    club: "Drama Club",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    excerpt: "Three consecutive sold-out performances of Into the Woods — Drama Club's most successful season in school history.",
    author: "Taylor M.",
    role: "Drama Club Director",
    date: "April 2026",
    tag: "Arts",
    tagColor: "bg-amber-100 text-amber-700",
  },
];

const MEETINGS = [
  {
    id: 1,
    title: "TSA Chapter Weekly Sync",
    club: "TSA",
    time: "Today, 4:00 PM",
    attendees: 12,
    live: true,
  },
  {
    id: 2,
    title: "Robotics Build Session",
    club: "Robotics",
    time: "Today, 5:30 PM",
    attendees: 8,
    live: true,
  },
  {
    id: 3,
    title: "NHS Volunteer Planning",
    club: "NHS",
    time: "Today, 3:00 PM",
    attendees: 15,
    live: true,
  },
  {
    id: 4,
    title: "FBLA Competition Prep",
    club: "FBLA",
    time: "Today, 6:00 PM",
    attendees: 6,
    live: true,
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [userName, setUserName] = useState("Guest123");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    // When NextAuth definitively says unauthenticated, reset to guest
    if (status === "unauthenticated") {
      setUserName("Guest123");
      setAvatarUrl(null);
      setIsGuest(true);
      return;
    }
    if (status === "loading") return;

    async function loadUser() {
      // Prefer NextAuth session name if available
      if (session?.user) {
        const nextAuthName = session.user.name || session.user.email?.split("@")[0] || "Member";
        setUserName(nextAuthName);
        setIsGuest(false);
      }

      // Also try Supabase for avatar and richer profile data
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        // Fallback to localStorage identity (Judge login)
        const { isLoggedIn, getUserIdentity } = await import("@/lib/clientState");
        if (isLoggedIn()) {
          const identity = getUserIdentity();
          setUserName(identity.name);
          setIsGuest(false);
        }
        return;
      }
      setIsGuest(false);
      const res = await profilesApi.getById(data.user.id);
      if (!res.error && res.data) {
        setUserName(res.data.name || data.user.email || "Member");
        setAvatarUrl(res.data.avatar_url || null);
      } else {
        setUserName(data.user.email || "Member");
      }
    }
    loadUser();
  }, [status, session?.user?.email]);

  const userInitials = isGuest
    ? "G"
    : userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "G";

  const [feed, setFeed] = useState<FeedPost[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clubconnect_community_feed");
      if (saved)
        try {
          return JSON.parse(saved);
        } catch {}
    }
    return INITIAL_FEED;
  });
  const [postText, setPostText] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "discussions" | "resources"
  >("all");
  const [connectedMentors, setConnectedMentors] = useState<Set<string>>(
    new Set(),
  );

  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set(),
  );
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});

  const [communityTab, setCommunityTab] = useState<"feed" | "mentors" | "stories">("feed");
  const [storyTitle, setStoryTitle] = useState("");
  const [storyBody, setStoryBody] = useState("");
  const [storySubmitting, setStorySubmitting] = useState(false);
  const [storyPosted, setStoryPosted] = useState(false);
  const [userStories, setUserStories] = useState<typeof SUCCESS_STORIES>([]);

  useEffect(() => {
    localStorage.setItem("clubconnect_community_feed", JSON.stringify(feed));
  }, [feed]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setAttachedFile(e.target.files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setAttachedFile(e.dataTransfer.files[0]);
  }

  const [uploading, setUploading] = useState(false);

  async function submitPost() {
    if (!postText.trim() && !attachedFile) return;
    let fileUrl: string | undefined;
    if (attachedFile) {
      setUploading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id || "anonymous";
        const res = await storageApi.uploadFile(userId, attachedFile);
        if (!res.error && res.data) {
          fileUrl = res.data.publicUrl;
        }
      } catch {
      } finally {
        setUploading(false);
      }
    }
    const newPost: FeedPost = {
      id: Date.now(),
      author: userName || "You",
      avatar: userInitials,
      club: "General",
      time: "Just now",
      text: postText.trim(),
      type: attachedFile ? "resource" : "text",
      fileName: attachedFile?.name,
      fileSize: attachedFile
        ? `${(attachedFile.size / 1024 / 1024).toFixed(1)} MB`
        : undefined,
      fileUrl,
      likes: 0,
      liked: false,
      saved: false,
      replies: [],
    };
    setFeed((prev) => [newPost, ...prev]);
    setPostText("");
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function toggleLike(id: number) {
    setFeed((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  }

  function toggleSave(id: number) {
    setFeed((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)),
    );
  }

  function toggleReplies(id: number) {
    setExpandedReplies((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function submitReply(postId: number) {
    const text = replyInputs[postId]?.trim();
    if (!text) return;
    setFeed((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: [
                {
                  id: Date.now(),
                  author: userName || "You",
                  avatar: userInitials,
                  text,
                  time: "Just now",
                },
                ...p.replies,
              ],
            }
          : p,
      ),
    );
    setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
  }

  function connectMentor(mentorId: string) {
    setConnectedMentors((prev) => new Set(prev).add(mentorId));
  }

  const filtered = feed.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "discussions")
      return p.type === "discussion" || p.type === "text";
    if (activeFilter === "resources")
      return p.type === "resource" || p.type === "image";
    return true;
  });

  const postTypeBorder: Record<string, string> = {
    resource:    "border-l-[3px] border-l-emerald-400",
    discussion:  "border-l-[3px] border-l-blue-400",
    achievement: "border-l-[3px] border-l-amber-400",
    image:       "border-l-[3px] border-l-violet-400",
    text:        "border-l-[3px] border-l-slate-300",
  };

  const postTypeBadge: Record<string, string> = {
    resource:    "bg-emerald-100 text-emerald-700 border border-emerald-200",
    discussion:  "bg-blue-100 text-blue-700 border border-blue-200",
    achievement: "bg-amber-100 text-amber-700 border border-amber-200",
    image:       "bg-violet-100 text-violet-700 border border-violet-200",
    text:        "bg-neutral-100 text-neutral-600 border border-neutral-200",
  };

  const typeLabel: Record<string, string> = {
    resource: "Resource", discussion: "Discussion",
    achievement: "Achievement", image: "Photo", text: "Update",
  };

  return (
    <div className="relative">
      <div className="relative z-0 bg-[radial-gradient(circle_at_top_left,_#fff8de_0%,_#f5efe5_38%,_#edf3ff_100%)] min-h-screen">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.gif,.svg,.txt,.md,.csv"
        onChange={handleFileSelect}
      />
      {/* STATS BAR — rendered right below hero wave */}

      {/* ══ HERO BANNER ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="socialHubBannerPat" x="0" y="0" width="520" height="300" patternUnits="userSpaceOnUse">
                <path d="M-20,80 C60,40 120,120 200,90 C280,60 320,130 400,100 C460,78 500,110 540,95" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" fill="none"/>
                <path d="M-20,160 C50,130 100,180 180,155 C260,130 310,175 390,150 C450,132 490,165 540,148" stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none"/>
                <path d="M-20,240 C70,210 140,255 220,230 C300,205 360,248 440,222 C490,207 520,232 540,220" stroke="rgba(255,255,255,0.06)" strokeWidth="1.8" fill="none"/>
                <ellipse cx="80" cy="60" rx="48" ry="32" fill="rgba(255,255,255,0.045)"/>
                <ellipse cx="300" cy="200" rx="60" ry="38" fill="rgba(255,255,255,0.035)"/>
                <ellipse cx="450" cy="80" rx="42" ry="28" fill="rgba(255,255,255,0.04)"/>
                <g opacity="0.30" fill="white"><circle cx="460" cy="30" r="2.2"/><circle cx="470" cy="30" r="2.2"/><circle cx="480" cy="30" r="2.2"/><circle cx="460" cy="40" r="2.2"/><circle cx="470" cy="40" r="2.2"/><circle cx="480" cy="40" r="2.2"/><circle cx="460" cy="50" r="2.2"/><circle cx="470" cy="50" r="2.2"/><circle cx="480" cy="50" r="2.2"/></g>
                <g opacity="0.25" fill="white"><circle cx="20" cy="230" r="2"/><circle cx="30" cy="230" r="2"/><circle cx="40" cy="230" r="2"/><circle cx="20" cy="240" r="2"/><circle cx="30" cy="240" r="2"/><circle cx="40" cy="240" r="2"/><circle cx="20" cy="250" r="2"/><circle cx="30" cy="250" r="2"/><circle cx="40" cy="250" r="2"/></g>
                <circle cx="100" cy="185" r="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
                <circle cx="310" cy="55" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
                <circle cx="415" cy="245" r="6" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
                <circle cx="510" cy="190" r="8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#socialHubBannerPat)"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-11 pb-20 md:pt-12 md:pb-24">
          <span className="inline-block cream-textured border border-cream-400 text-primary-900 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
            Student Community
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
            Social{" "}
            <span className="relative inline-block text-secondary-400 italic">
              Hub
              <span className="absolute pointer-events-none select-none z-20" style={{ top: "calc(-0.82em + 3px)", right: "-0.45em", transform: "rotate(12deg)", transformOrigin: "50% 100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }} aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
                  <polygon points="20,9 35,17 20,25 5,17" fill="#0d1b2b" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" />
                  <path d="M12 18 L12 26 Q20 32 28 26 L28 18" fill="#0d1b2b" fillOpacity="0.85" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3" strokeLinejoin="round" />
                  <line x1="35" y1="17" x2="35" y2="29" stroke="#b8860b" strokeWidth="1.9" strokeLinecap="round" />
                  <circle cx="35" cy="31" r="2.5" fill="#b8860b" />
                </svg>
              </span>
            </span>
          </h1>
          <p className="mt-3 text-sm max-w-xl leading-relaxed inline-block cream-textured border border-cream-400 text-primary-900 px-3 py-2 rounded-lg font-medium">
            Share resources, start discussions, and connect with clubs across your school community.
          </p>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 42" preserveAspectRatio="none" className="block w-full h-8 md:h-10">
            <path d="M0,42 L0,20 C360,42 720,0 1080,20 C1260,30 1380,16 1440,20 L1440,42 Z" fill="#f5f0e8" />
          </svg>
        </div>
      </section>

      {/* ══ COMMUNITY STATS BAR ══════════════════════════════════════ */}
      <div className="bg-cream-200 border-b border-cream-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Community Posts",  value: "128", Icon: MessageCircle, bg: "bg-white", border: "border-primary-200", iconBg: "bg-primary-900/10", iconColor: "text-primary-900", valColor: "text-primary-900" },
              { label: "Members Active",   value: "340", Icon: Users,         bg: "bg-white", border: "border-primary-200", iconBg: "bg-primary-900/10", iconColor: "text-primary-900", valColor: "text-primary-900" },
              { label: "Clubs Online",     value: "18",  Icon: Layers,        bg: "bg-white", border: "border-primary-200", iconBg: "bg-primary-900/10", iconColor: "text-primary-900", valColor: "text-primary-900" },
              { label: "Mentors Available",value: "9",   Icon: GraduationCap, bg: "bg-white", border: "border-primary-200", iconBg: "bg-primary-900/10", iconColor: "text-primary-900", valColor: "text-primary-900" },
            ].map(({ label, value, Icon, bg, border, iconBg, iconColor, valColor }) => (
              <div key={label} className={`flex items-center gap-3 ${bg} border ${border} rounded-xl px-4 py-3`}>
                <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={iconColor} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${valColor} leading-none`}>{value}</p>
                  <p className="text-[10px] text-neutral-500 font-medium mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ══ PROFILE BAR ══ */}
        <div className="flex items-center gap-4 bg-white border-l-4 border-l-secondary-400 rounded-2xl px-5 py-4 mb-5 shadow-[0_4px_20px_rgba(28,53,87,0.07)]">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={userName} width={44} height={44} className="w-11 h-11 rounded-xl object-cover border-2 border-cream-300 shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-800 to-primary-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                {userInitials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-primary-900 leading-tight truncate">{userName}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isGuest ? "bg-neutral-100 text-neutral-500" : "bg-emerald-100 text-emerald-700"}`}>
                  {isGuest ? "Guest" : "Member"}
                </span>
                {!isGuest && <span className="text-[10px] text-neutral-400">Active since 2024</span>}
              </div>
            </div>
          </div>
          {isGuest ? (
            <Link href="/login" className="ml-auto text-xs font-bold text-white bg-primary-900 rounded-xl px-4 py-2 hover:bg-primary-800 transition-colors shrink-0">
              Sign In
            </Link>
          ) : (
            <div className="ml-auto flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-3 text-center">
                <div>
                  <p className="text-sm font-bold text-primary-700 leading-none">3</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Clubs</p>
                </div>
                <div className="w-px h-8 bg-neutral-200" />
                <div>
                  <p className="text-sm font-bold text-primary-700 leading-none">12</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Posts</p>
                </div>
                <div className="w-px h-8 bg-neutral-200" />
                <div>
                  <p className="text-sm font-bold text-secondary-600 leading-none">47</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Likes</p>
                </div>
              </div>
              <Link href="/profile" className="text-xs font-bold text-primary-700 border border-primary-200 rounded-xl px-4 py-2 hover:bg-primary-50 transition-colors">
                My Profile
              </Link>
            </div>
          )}
        </div>

        <div className="flex gap-6 items-start">
          {/* ══ MAIN CONTENT ══ */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Tab Navigation */}
            <div className="bg-white border border-primary-200 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(28,53,87,0.07)]">
              <div className="flex">
                {([
                  { key: "feed",     label: "Community Feed",  icon: MessageCircle },
                  { key: "mentors",  label: "Mentor Network",  icon: GraduationCap },
                  { key: "stories",  label: "Success Stories", icon: Trophy       },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setCommunityTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${
                      communityTab === key
                        ? "text-primary-900 border-primary-900 bg-primary-50/60"
                        : "border-transparent text-neutral-500 hover:text-primary-900 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ══ MENTORS TAB ══ */}
            {communityTab === "mentors" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-2xl px-5 py-3.5">
                  <div>
                    <h2 className="font-bold text-primary-900 text-base">Mentor Network</h2>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Connect with industry professionals for guidance</p>
                  </div>
                  <Link href="/hub/mentors" className="text-xs font-semibold text-secondary-600 hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { id: "m1", name: "Dr. Sarah Chen",  role: "Senior Software Engineer, Microsoft", areas: ["Software","AI/ML","Internships"], available: true,  img: MENTOR_PHOTOS["m1"], email: "sarah.chen@microsoft.com",      grad: "from-primary-800 to-primary-900", sessions: 24, bio: "10+ years building ML systems at scale. Loves guiding students into tech careers." },
                    { id: "m4", name: "David Park",       role: "Mechanical Engineer, Boeing",         areas: ["Robotics","Engineering","FRC"],   available: true,  img: MENTOR_PHOTOS["m4"], email: "david.park@boeing.com",          grad: "from-primary-800 to-primary-900", sessions: 18, bio: "FRC alumnus turned aerospace engineer. Passionate about robotics mentorship." },
                    { id: "m3", name: "Maria Gonzalez",   role: "Community Organizer, United Way",     areas: ["Leadership","Service","Nonprofits"],available: true, img: MENTOR_PHOTOS["m3"], email: "maria.gonzalez@unitedway.org",  grad: "from-primary-800 to-primary-900", sessions: 31, bio: "Nonprofit veteran helping students discover the power of community-driven change." },
                    { id: "m5", name: "James Liu",        role: "Product Manager, Amazon",             areas: ["Business","DECA","Strategy"],     available: false, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", email: "james.liu@amazon.com", grad: "from-primary-800 to-primary-900", sessions: 15, bio: "Former DECA state champion. Now leads product teams at Amazon's retail division." },
                    { id: "m6", name: "Priya Nair",       role: "Attorney, Public Defender's Office",  areas: ["Law","Debate","Policy"],          available: true,  img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", email: "priya.nair@defenders.org", grad: "from-primary-800 to-primary-900", sessions: 20, bio: "Debate coach turned public defender. Mentors students in argumentation and civic engagement." },
                    { id: "m7", name: "Carlos Rivera",    role: "Biology Professor, UW",               areas: ["Research","Science","College"],   available: false, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", email: "crivera@uw.edu", grad: "from-primary-800 to-primary-900", sessions: 9, bio: "UW professor specializing in biotech. Helps students navigate the college research pipeline." },
                  ].map(m => (
                    <div key={m.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
                      {/* Photo banner */}
                      <div className={`relative h-52 bg-gradient-to-br ${m.grad}`}>
                        <Image src={m.img} alt={m.name} fill sizes="500px" className="object-cover object-top opacity-40 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Available badge top-right */}
                        <div className="absolute top-4 right-4">
                          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${
                            m.available ? "bg-emerald-400 text-white" : "bg-white/20 text-white/80 border border-white/30"
                          }`}>
                            {m.available ? "Available" : "Busy"}
                          </span>
                        </div>
                        {/* Name + avatar bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-4">
                          <div className="w-20 h-20 rounded-xl border-2 border-white/60 overflow-hidden shrink-0 relative shadow-xl">
                            <Image src={m.img} alt={m.name} fill sizes="80px" className="object-cover object-top" />
                          </div>
                          <div className="min-w-0 pb-1">
                            <p className="font-heading font-bold text-white text-base leading-tight drop-shadow">{m.name}</p>
                            <p className="text-white/75 text-xs mt-1 leading-snug drop-shadow">{m.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1 gap-4">
                        <p className="text-sm text-neutral-600 leading-relaxed">{m.bio}</p>
                        <div className="flex items-center gap-2">
                          <Star size={13} className="text-amber-400 shrink-0" />
                          <span className="text-sm font-semibold text-neutral-700">{m.sessions} mentoring sessions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.areas.map(a => (
                            <span key={a} className="text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1 rounded-full">{a}</span>
                          ))}
                        </div>
                        {connectedMentors.has(m.id) ? (
                          <div className="mt-auto pt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-2"><Check size={14} /> Connected — email sent!</div>
                            <a href={`mailto:${m.email}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 break-all">{m.email}</a>
                          </div>
                        ) : (
                          <button
                            onClick={() => connectMentor(m.id)}
                            disabled={!m.available}
                            className={`mt-auto w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                              m.available ? "bg-primary-900 text-white hover:bg-primary-800" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            }`}
                          >
                            {m.available ? "Request Connection" : "Currently Unavailable"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* ══ STORIES TAB ══ */}
            {communityTab === "stories" && (
              <div className="space-y-4">
                <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-3.5">
                  <h2 className="font-bold text-primary-900 text-base">Success Stories</h2>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Milestones and achievements from our student community</p>
                </div>

                {/* Create your story — FIRST */}
                <div className="bg-white border border-cream-300 rounded-2xl p-5">
                  <h3 className="font-heading font-bold text-primary-800 text-sm mb-3">Share Your Story</h3>
                  {storyPosted ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <Check size={14} /> Story submitted! Thank you for sharing.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        placeholder="Story title..."
                        value={storyTitle}
                        onChange={e => setStoryTitle(e.target.value)}
                        className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary-400/30"
                      />
                      <textarea
                        placeholder="Tell us about your club's achievement..."
                        value={storyBody}
                        onChange={e => setStoryBody(e.target.value)}
                        rows={3}
                        className="w-full border border-cream-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary-400/30 resize-none"
                      />
                      <button
                        onClick={async () => {
                          if (!storyTitle.trim() || !storyBody.trim() || storySubmitting) return;
                          setStorySubmitting(true);
                          const { data: { user } } = await supabase.auth.getUser();
                          if (user) {
                            await supabase.from("success_stories").insert({ author_id: user.id, title: storyTitle.trim(), content: storyBody.trim() });
                          }
                          const now = new Date();
                          const monthYear = now.toLocaleString("default", { month: "long", year: "numeric" });
                          setUserStories(prev => [{
                            id: Date.now(),
                            title: storyTitle.trim(),
                            club: "Student",
                            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
                            excerpt: storyBody.trim(),
                            author: userName,
                            role: "Student",
                            date: monthYear,
                            tag: "Story",
                            tagColor: "bg-sky-100 text-sky-700",
                          }, ...prev]);
                          setStoryPosted(true);
                          setStoryTitle("");
                          setStoryBody("");
                          setStorySubmitting(false);
                          setTimeout(() => setStoryPosted(false), 3500);
                        }}
                        disabled={storySubmitting || !storyTitle.trim() || !storyBody.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {storySubmitting ? <><Loader2 size={12} className="animate-spin" /> Submitting…</> : <><Send size={12} /> Submit Story</>}
                      </button>
                      {isGuest && <p className="text-[10px] text-neutral-400">Sign in to have your story saved to the community.</p>}
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[...userStories, ...SUCCESS_STORIES].map((s, idx) => (
                    <div key={s.id} className={`group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-default ${idx === 0 ? "sm:col-span-2" : ""}`}>
                      <div className={`relative ${idx === 0 ? "h-56" : "h-44"}`}>
                        <Image src={s.image} alt={s.title} fill sizes="600px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${s.tagColor}`}>{s.tag}</span>
                          {idx === 0 && <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-secondary-400 text-primary-900">Featured</span>}
                        </div>
                        <div className="absolute bottom-3 left-4 right-4">
                          <span className="text-[10px] font-bold text-secondary-300 uppercase tracking-wider">{s.club}</span>
                          <h3 className="text-white font-bold text-base leading-tight mt-0.5">{s.title}</h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-neutral-600 leading-relaxed mb-4">{s.excerpt}</p>
                        <div className="flex items-center gap-3 border-t border-neutral-100 pt-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-800 to-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {s.author.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary-900">{s.author}</p>
                            <p className="text-[10px] text-neutral-400">{s.role} · {s.date}</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ FEED TAB ══ */}
            {communityTab === "feed" && (<>
            {/* Filter Row */}
            <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-r border-neutral-200 pr-3 shrink-0">Filter</span>
              {([
                { key: "all",          label: "All Posts",    Icon: Layers        },
                { key: "discussions",  label: "Discussions",  Icon: MessageCircle },
                { key: "resources",    label: "Resources",    Icon: BookOpen      },
              ] as const).map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${activeFilter === key ? "bg-secondary-400 text-primary-900" : "text-neutral-500 hover:bg-neutral-100 hover:text-primary-700"}`}
                >
                  <Icon size={11} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Feed scroll: composer + posts */}
            <div className="h-[700px] overflow-y-auto pr-1 space-y-5">

              {/* Composer */}
              <div
                className={`bg-white border-2 transition-colors rounded-2xl overflow-hidden shadow-sm ${dragOver ? "border-primary-400 bg-primary-50/50" : "border-neutral-200"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="flex items-start gap-3 px-5 pt-4 pb-3">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={userName} width={40} height={40} className="w-10 h-10 object-cover shrink-0 rounded-xl" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-800 to-primary-600 text-white flex items-center justify-center text-sm font-bold shrink-0 rounded-xl">
                      {userInitials}
                    </div>
                  )}
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Share a resource, start a discussion, or post an update..."
                    rows={3}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary-400 placeholder:text-neutral-400 bg-neutral-50/50"
                  />
                </div>
                {attachedFile && (
                  <div className="mx-5 mb-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <FileText size={18} className="text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-700 truncate">{attachedFile.name}</p>
                      <p className="text-xs text-emerald-500">{(attachedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => { setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-neutral-400 hover:text-neutral-600">
                      <X size={16} />
                    </button>
                  </div>
                )}
                {dragOver && !attachedFile && (
                  <div className="mx-5 mb-3 border-2 border-dashed border-primary-300 bg-primary-50/40 rounded-xl py-6 flex flex-col items-center gap-2 pointer-events-none">
                    <Upload size={24} className="text-primary-400" />
                    <p className="text-sm font-semibold text-primary-600">Drop file to attach</p>
                  </div>
                )}
                <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 bg-neutral-50/50">
                  <div className="flex gap-1.5">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors">
                      <Upload size={12} /> Attach File
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors">
                      <ImageIcon size={12} /> Photo
                    </button>
                  </div>
                  <button
                    onClick={submitPost}
                    disabled={uploading || (!postText.trim() && !attachedFile)}
                    className="flex items-center gap-1.5 px-5 py-2 bg-primary-900 text-white text-xs font-bold rounded-xl hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={12} /> {uploading ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>

              {/* Posts — colored by type */}
              {filtered.map((post) => (
                <div key={post.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-neutral-200 ${postTypeBorder[post.type]}`}>
                  <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                    <div className="w-10 h-10 flex items-center justify-center text-xs font-bold shrink-0 rounded-xl bg-primary-100 text-primary-800">
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-primary-900">{post.author}</span>
                        <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full ${postTypeBadge[post.type]}`}>
                          {typeLabel[post.type]}
                        </span>
                        <span className="text-[10px] font-semibold bg-primary-50 text-primary-600 border border-primary-100 px-2 py-0.5 rounded-full">{post.club}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{post.time}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {(post.author === userName || post.author === "You") && (
                        <button
                          onClick={() => { if (confirm("Delete this post?")) setFeed((prev) => prev.filter((p) => p.id !== post.id)); }}
                          className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-3">
                    <p className="text-sm text-neutral-700 leading-relaxed">{post.text}</p>
                    {post.type === "achievement" && (
                      <div className="mt-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <Award size={18} className="text-amber-500 shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-amber-700">Achievement Unlocked</span>
                          <p className="text-[10px] text-amber-600 mt-0.5">This milestone was shared with the community</p>
                        </div>
                      </div>
                    )}
                    {post.fileName && (
                      <div className="mt-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <FileText size={18} className="text-emerald-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-emerald-700 truncate">{post.fileName}</p>
                          <p className="text-xs text-emerald-500">{post.fileSize} · File</p>
                        </div>
                        {post.fileUrl ? (
                          <a href={post.fileUrl} download={post.fileName} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1">
                            <Download size={12} /> Download
                          </a>
                        ) : (
                          <span className="px-3 py-1.5 bg-neutral-200 text-neutral-400 text-xs font-bold rounded-lg">Demo</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center border-t border-neutral-100 px-2 bg-neutral-50/40">
                    <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${post.liked ? "text-rose-500" : "text-neutral-400 hover:text-rose-400"}`}>
                      {post.liked ? <Heart size={14} fill="currentColor" /> : <Heart size={14} />}
                      <span>{post.likes}</span>
                    </button>
                    <button onClick={() => toggleReplies(post.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${expandedReplies.has(post.id) ? "text-blue-600" : "text-neutral-400 hover:text-blue-500"}`}>
                      <MessageCircle size={14} /> {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
                    </button>
                    <button onClick={() => toggleSave(post.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${post.saved ? "text-secondary-600" : "text-neutral-400 hover:text-secondary-500"}`}>
                      {post.saved ? <Bookmark size={14} fill="currentColor" /> : <Bookmark size={14} />} Save
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-primary-600 transition-colors ml-auto">
                      <Share2 size={14} /> Share
                    </button>
                  </div>

                  {expandedReplies.has(post.id) && (
                    <div className="border-t border-neutral-100 bg-neutral-50/50">
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100">
                        {avatarUrl ? (
                          <Image src={avatarUrl} alt={userName} width={30} height={30} className="w-8 h-8 object-cover shrink-0 rounded-lg" />
                        ) : (
                          <div className="w-8 h-8 bg-primary-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 rounded-lg">{userInitials}</div>
                        )}
                        <input
                          value={replyInputs[post.id] || ""}
                          onChange={(e) => setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && submitReply(post.id)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-300"
                        />
                        <button onClick={() => submitReply(post.id)} className="px-3 py-2 bg-primary-900 text-white rounded-xl hover:bg-primary-800 transition-colors">
                          <Send size={13} />
                        </button>
                      </div>
                      <div className="max-h-[260px] overflow-y-auto">
                        {post.replies.map((r) => (
                          <div key={r.id} className="flex gap-3 px-5 py-3 border-b border-neutral-100/80 last:border-b-0">
                            <div className="w-8 h-8 bg-primary-100 text-primary-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 rounded-lg">{r.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-primary-900">{r.author}</span>
                                <span className="text-[10px] text-neutral-400">{r.time}</span>
                                {(r.author === userName || r.author === "You") && (
                                  <button
                                    onClick={() => setFeed((prev) => prev.map((p) => p.id === post.id ? { ...p, replies: p.replies.filter((rr) => rr.id !== r.id) } : p))}
                                    className="ml-auto text-red-300 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-neutral-600 leading-relaxed">{r.text}</p>
                            </div>
                          </div>
                        ))}
                        {post.replies.length === 0 && (
                          <p className="text-sm text-neutral-400 px-5 py-4 text-center">No replies yet — be the first!</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="bg-white border border-neutral-200 rounded-2xl py-12 text-center">
                  <MessageCircle size={32} className="text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-neutral-500">No posts match this filter.</p>
                  <p className="text-xs text-neutral-400 mt-1">Try switching to &quot;All Posts&quot;</p>
                </div>
              )}
            </div>
            </>)}
          </div>

          {/* ══ RIGHT SIDEBAR ══ */}
          <div className="hidden lg:flex lg:flex-col w-72 shrink-0 gap-5 self-start sticky top-20">

            {/* Upcoming Meetings */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gradient-to-r from-primary-900 to-primary-700 flex items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video size={13} /> Upcoming Meetings
                </h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {MEETINGS.map((mt) => {
                  const clubColors: Record<string, string> = {
                    TSA: "bg-primary-50 text-primary-800 border border-primary-200",
                    Robotics: "bg-blue-50 text-blue-800 border border-blue-200",
                    NHS: "bg-emerald-50 text-emerald-800 border border-emerald-200",
                    FBLA: "bg-amber-50 text-amber-800 border border-amber-200",
                  };
                  return (
                    <div key={mt.id} className="px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
                      {/* Live indicator dot */}
                      {mt.live && (
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse shrink-0" />
                      )}
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${clubColors[mt.club] || "bg-neutral-100 text-neutral-600"}`}>{mt.club}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-primary-800 leading-snug truncate">{mt.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-400">
                          <span className="flex items-center gap-0.5"><Clock size={9} /> {mt.time}</span>
                          <span className="flex items-center gap-0.5"><Users size={9} /> {mt.attendees}</span>
                        </div>
                      </div>
                      {/* Join button — compact, inline */}
                      <button
                        onClick={() => router.push(`/call/${encodeURIComponent(`Meeting-${mt.club}-${mt.id}`)}`)}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-colors whitespace-nowrap"
                      >
                        Join Live
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
