"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { supabase, profilesApi, storageApi } from "@/lib/api";
import {
  Download,
  FileText,
  Heart,
  ImageIcon,
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
    author: "Elena Ruiz",
    avatar: "ER",
    club: "TSA",
    time: "12 minutes ago",
    text: "Posted the final judging checklist and pitch slides we used at state. If you're presenting this month, steal anything useful and make it your own.",
    type: "resource",
    fileName: "State_Pitch_Kit.zip",
    fileSize: "4.6 MB",
    likes: 38,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Drew Kim",
        avatar: "DK",
        text: "This is so clean. We're using the checklist for our mock round tonight.",
        time: "8m ago",
      },
      {
        id: 2,
        author: "Maya Singh",
        avatar: "MS",
        text: "The slide structure is perfect. Thanks for sharing the full pack.",
        time: "5m ago",
      },
    ],
  },
  {
    id: 2,
    author: "Noah Bennett",
    avatar: "NB",
    club: "Robotics",
    time: "1 hour ago",
    text: "Need a fresh idea: should we use a mecanum base or keep it simple with a tank drive for our first FTC bot? Looking for opinions from teams that already tested both.",
    type: "discussion",
    likes: 21,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Lila Park",
        avatar: "LP",
        text: "Mecanum looks cool, but tank drive is way easier to debug on a tight timeline.",
        time: "42m ago",
      },
      {
        id: 2,
        author: "Owen Hart",
        avatar: "OH",
        text: "We started tank drive, then swapped later. For a first build, simpler usually wins.",
        time: "28m ago",
      },
    ],
  },
  {
    id: 3,
    author: "Ava Thompson",
    avatar: "AT",
    club: "NHS",
    time: "3 hours ago",
    text: "We crossed 650 volunteer hours this semester. Honestly proud of the team for showing up every week and keeping the momentum going.",
    type: "achievement",
    likes: 54,
    liked: false,
    saved: false,
    replies: [],
  },
  {
    id: 4,
    author: "Mateo Alvarez",
    avatar: "MA",
    club: "FBLA",
    time: "5 hours ago",
    text: "Dropped the fundraiser tracker I made for our chapter. It has a cleaner summary dashboard now and auto-updates totals after every sale.",
    type: "resource",
    fileName: "FBLA_Fundraiser_Tracker.xlsx",
    fileSize: "1.9 MB",
    likes: 29,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Grace Lee",
        avatar: "GL",
        text: "This dashboard is exactly what our treasurer needed. Great work.",
        time: "2h ago",
      },
    ],
  },
  {
    id: 5,
    author: "Zoe Carter",
    avatar: "ZC",
    club: "Drama",
    time: "8 hours ago",
    text: "Auditions are next week and we're building a huge sign-up sheet. If you have any warm-up routines or monologue picks that helped you, drop them here.",
    type: "text",
    likes: 18,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Ethan Moss",
        avatar: "EM",
        text: "Physical warm-ups before lines made a huge difference for me last year.",
        time: "6h ago",
      },
    ],
  },
  {
    id: 6,
    author: "Priya Nair",
    avatar: "PN",
    club: "Debate",
    time: "1 day ago",
    text: "Uploaded our case briefs and evidence blocks from the winter tournament. Hopefully these help someone build a stronger flow for districts.",
    type: "resource",
    fileName: "Debate_Case_Briefs.pdf",
    fileSize: "2.7 MB",
    likes: 26,
    liked: false,
    saved: false,
    replies: [
      {
        id: 1,
        author: "Amir Patel",
        avatar: "AP",
        text: "This is a huge help. We're reorganizing our evidence library right now.",
        time: "20h ago",
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
    live: false,
  },
  {
    id: 3,
    title: "NHS Volunteer Planning",
    club: "NHS",
    time: "Tomorrow, 3:00 PM",
    attendees: 15,
    live: false,
  },
  {
    id: 4,
    title: "FBLA Competition Prep",
    club: "FBLA",
    time: "Wed, 4:00 PM",
    attendees: 6,
    live: false,
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [userName, setUserName] = useState("Guest123");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    async function loadUser() {
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
        setUserName(res.data.name || data.user.email || "Guest123");
        setAvatarUrl(res.data.avatar_url || null);
      } else {
        setUserName(data.user.email || "Guest123");
      }
    }
    loadUser();
  }, []);

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
    "all" | "discussions" | "resources" | "achievements"
  >("all");
  const [connectedMentors, setConnectedMentors] = useState<Set<string>>(
    new Set(),
  );

  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set(),
  );
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});

  const [communityTab, setCommunityTab] = useState<"feed" | "mentors" | "stories">("feed");

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

  function deletePost(postId: number) {
    if (!confirm("Delete this message?")) return;
    setFeed((prev) => prev.filter((post) => post.id !== postId));
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
  }

  function deleteReply(postId: number, replyId: number) {
    if (!confirm("Delete this reply?")) return;
    setFeed((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, replies: post.replies.filter((reply) => reply.id !== replyId) }
          : post,
      ),
    );
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
    if (activeFilter === "achievements") return p.type === "achievement";
    return true;
  });

  const typeColors: Record<string, string> = {
    resource: "bg-primary-100 text-primary-700",
    discussion: "bg-secondary-100 text-secondary-700",
    achievement: "bg-accent-100 text-accent-700",
    image: "bg-primary-50 text-primary-600",
    text: "bg-neutral-100 text-neutral-600",
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
              <span className="absolute pointer-events-none select-none z-20" style={{ top: "calc(-0.52em - 1px)", right: "-0.45em", transform: "rotate(12deg)", transformOrigin: "50% 100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }} aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
                  <polygon points="20,7 35,15 20,23 5,15" fill="#0d1b2b" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" />
                  <path d="M12 16 L12 24 Q20 30 28 24 L28 16" fill="#0d1b2b" fillOpacity="0.85" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3" strokeLinejoin="round" />
                  <line x1="35" y1="15" x2="35" y2="27" stroke="#b8860b" strokeWidth="1.9" strokeLinecap="round" />
                  <circle cx="35" cy="29" r="2.5" fill="#b8860b" />
                </svg>
              </span>
            </span>
          </h1>
          <div className="mt-3 cream-textured border border-cream-400 rounded-xl px-5 py-3.5 max-w-xl">
            <p className="text-primary-900 font-medium text-sm leading-relaxed">
              Share resources, start discussions, and connect with clubs across your school community.
            </p>
          </div>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 42" preserveAspectRatio="none" className="block w-full h-8 md:h-10">
            <path d="M0,42 L0,20 C360,42 720,0 1080,20 C1260,30 1380,16 1440,20 L1440,42 Z" fill="#f5f0e8" />
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Compact profile bar */}
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur border border-secondary-200/70 rounded-2xl px-5 py-4 mb-5 shadow-[0_10px_30px_rgba(28,53,87,0.10)]">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={userName} width={44} height={44} className="w-11 h-11 rounded-xl object-cover border-2 border-cream-300 shrink-0" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-900 to-primary-700 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
              {userInitials}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-primary-900 leading-tight truncate">{userName}</h3>
            <p className="text-[11px] text-neutral-500">{isGuest ? "Guest" : "Club Member"}</p>
          </div>
          {isGuest ? (
            <Link href="/login" className="ml-auto text-xs font-bold text-primary-700 border border-primary-200 rounded-xl px-4 py-2 hover:bg-primary-50 transition-colors shrink-0">
              Sign In
            </Link>
          ) : (
            <div className="ml-auto flex items-center gap-3 text-[11px] text-neutral-600 shrink-0">
              <span><strong className="text-primary-700">3</strong> Clubs</span>
              <span><strong className="text-primary-700">12</strong> Posts</span>
              <Link href="/profile" className="text-xs font-bold text-primary-700 border border-primary-200 rounded-xl px-4 py-2 hover:bg-primary-50 transition-colors">
                My Profile
              </Link>
            </div>
          )}
        </div>

        <div className="flex gap-5 items-start">
          {/*  MAIN CONTENT  */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Tab Navigation */}
            <div className="bg-white/90 backdrop-blur border border-primary-200 rounded-[1.5rem] overflow-hidden shadow-[0_8px_24px_rgba(28,53,87,0.08)]">
              <div className="h-1.5 bg-gradient-to-r from-secondary-400 via-primary-500 to-accent-400" />
              <div className="flex flex-wrap gap-2 p-2.5">
                {([
                  { key: "feed",     label: "Community Feed", icon: MessageCircle },
                  { key: "mentors",  label: "Mentors",        icon: GraduationCap },
                  { key: "stories",  label: "Stories",        icon: Trophy },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setCommunityTab(key)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all border ${
                      communityTab === key
                        ? "bg-primary-900 text-white border-primary-900 shadow-sm"
                        : "bg-primary-50/70 text-primary-700 border-primary-100 hover:bg-primary-100/80 hover:border-primary-200"
                    }`}
                  >
                    <Icon size={14} style={key === "mentors" ? { transform: "translateY(-1px)" } : undefined} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* MENTORS TAB */}
            {communityTab === "mentors" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-primary-900 text-lg">Mentor Network</h2>
                  <Link href="/hub/mentors" className="text-xs font-semibold text-secondary-700 hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "m1", name: "Dr. Sarah Chen",   role: "Senior Software Engineer, Microsoft",  specialty: "Software Dev & AI/ML",      available: true, img: MENTOR_PHOTOS["m1"], email: "sarah.chen@microsoft.com", areas: ["Software","AI/ML","Internships"] },
                    { id: "m4", name: "David Park",        role: "Mechanical Engineer, Boeing",          specialty: "Robotics & Engineering",     available: true, img: MENTOR_PHOTOS["m4"], email: "david.park@boeing.com", areas: ["Robotics","Engineering","FRC"] },
                    { id: "m3", name: "Maria Gonzalez",    role: "Community Organizer, United Way",      specialty: "Nonprofit & Leadership",     available: true, img: MENTOR_PHOTOS["m3"], email: "maria.gonzalez@unitedway.org", areas: ["Leadership","Service","Nonprofits"] },
                    { id: "m5", name: "James Liu",         role: "Product Manager, Amazon",              specialty: "Business & Strategy",        available: false, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", email: "james.liu@amazon.com", areas: ["Business","DECA","Strategy"] },
                    { id: "m6", name: "Priya Nair",        role: "Attorney, Public Defender's Office",   specialty: "Law & Public Policy",        available: true, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", email: "priya.nair@defenders.org", areas: ["Law","Debate","Policy"] },
                    { id: "m7", name: "Carlos Rivera",     role: "Biology Professor, UW",                specialty: "STEM Research & Science",    available: false, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", email: "crivera@uw.edu", areas: ["Research","Science","College"] },
                  ].map(m => (
                    <div key={m.id} className="bg-gradient-to-br from-white via-primary-50/20 to-secondary-50/20 border border-primary-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-32">
                        <Image src={m.img} alt={m.name} fill sizes="300px" className="object-cover object-top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-1 rounded-full ${m.available ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                          {m.available ? "Available" : "Busy"}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-primary-900 text-sm">{m.name}</h3>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{m.role}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {m.areas.map(a => (
                            <span key={a} className="text-[9px] font-semibold bg-secondary-100 text-secondary-700 border border-secondary-200 px-2 py-0.5 rounded-full">{a}</span>
                          ))}
                        </div>
                        {connectedMentors.has(m.id) ? (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 mb-1.5"><Check size={12} /> Connected</div>
                            <a href={`mailto:${m.email}`} className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 break-all">{m.email}</a>
                          </div>
                        ) : (
                          <button
                            onClick={() => connectMentor(m.id)}
                            className="mt-3 w-full py-2 rounded-xl text-xs font-bold bg-primary-900 text-white hover:bg-primary-800 transition-colors"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STORIES TAB */}
            {communityTab === "stories" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-primary-900 text-lg">Success Stories</h2>
                  <Link href="/hub/stories" className="text-xs font-semibold text-secondary-700 hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {SUCCESS_STORIES.map(s => (
                    <div key={s.id} className="group bg-white border border-primary-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-default">
                      <div className="relative h-48">
                        <Image src={s.image} alt={s.title} fill sizes="400px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                        <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-1 rounded-full ${s.tagColor}`}>{s.tag}</span>
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[10px] font-bold text-secondary-300 uppercase tracking-wider">{s.club}</span>
                          <h3 className="text-white font-bold text-base leading-tight mt-0.5">{s.title}</h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-neutral-600 leading-relaxed mb-4">{s.excerpt}</p>
                        <div className="flex items-center gap-3 border-t border-neutral-100 pt-3">
                          <div className="w-8 h-8 rounded-xl bg-primary-900 text-white flex items-center justify-center text-xs font-bold">
                            {s.author.charAt(0)}
                          </div>
                          <div>
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

            {/* FEED TAB */}
            {communityTab === "feed" && (<>
            {/*  Post Composer  */}
            <div
              className={`bg-white/95 backdrop-blur border-2 transition-colors rounded-[1.6rem] overflow-hidden shadow-[0_12px_34px_rgba(28,53,87,0.10)] ${dragOver ? "border-primary-400 bg-primary-50/50" : "border-primary-200"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="h-1.5 bg-gradient-to-r from-secondary-400 via-primary-500 to-accent-400" />
              <div className="flex items-start gap-3 px-5 pt-4 pb-3">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={userName} width={40} height={40} className="w-10 h-10 object-cover shrink-0 rounded-xl" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-900 to-primary-700 text-white flex items-center justify-center text-sm font-bold shrink-0 rounded-xl shadow-sm">
                    {userInitials}
                  </div>
                )}
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share a resource, start a discussion, or post an update..."
                  rows={3}
                  className="w-full border border-primary-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary-400 placeholder:text-neutral-400 bg-white"
                />
              </div>

              {attachedFile && (
                <div className="mx-5 mb-3 flex items-center gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl px-4 py-3">
                  <FileText size={18} className="text-primary-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-700 truncate">{attachedFile.name}</p>
                    <p className="text-xs text-primary-500">{(attachedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => { setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-neutral-400 hover:text-neutral-600">
                    <X size={16} />
                  </button>
                </div>
              )}

              {dragOver && !attachedFile && (
                <div className="mx-5 mb-3 border-2 border-dashed border-primary-400 bg-primary-50/40 rounded-xl py-6 flex flex-col items-center gap-2 pointer-events-none">
                  <Upload size={24} className="text-primary-400" />
                  <p className="text-sm font-semibold text-primary-600">Drop to attach</p>
                </div>
              )}

              <div className="flex items-center justify-between px-5 py-3 border-t border-primary-100 bg-gradient-to-r from-white to-primary-50/30">
                <div className="flex gap-1.5">
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors">
                    <Upload size={13} /> Attach
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors">
                    <ImageIcon size={13} /> Photo
                  </button>
                </div>
                <button
                  onClick={submitPost}
                  disabled={uploading || (!postText.trim() && !attachedFile)}
                  className="flex items-center gap-1.5 px-5 py-2 bg-primary-900 text-white text-xs font-bold rounded-xl hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={13} /> {uploading ? "Posting…" : "Post"}
                </button>
              </div>
            </div>

            {/* Feed Body: posts on top, filters pinned at bottom */}
            <div className="h-[520px] flex flex-col">
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 rounded-xl">
            {filtered.slice(0, 4).map((post) => (
              <div key={post.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${post.type === "discussion" ? "border-secondary-200" : post.type === "achievement" ? "border-accent-200" : "border-primary-200/70"}`}>
                <div className={`flex items-center gap-3 px-5 pt-4 pb-2 ${post.type === "discussion" ? "bg-secondary-50/60" : post.type === "achievement" ? "bg-accent-50/60" : "bg-primary-50/50"}`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0 rounded-xl">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-700">{post.author}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 font-semibold rounded-full ${typeColors[post.type]}`}>{post.club}</span>
                    </div>
                    <p className="text-xs text-neutral-400">{post.time}</p>
                  </div>
                  <button className="text-neutral-300 hover:text-neutral-500"><MoreHorizontal size={16} /></button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-300 hover:text-red-600 transition-colors"
                    aria-label="Delete message"
                    title="Delete message"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="px-5 pb-3">
                  <p className="text-sm text-neutral-700 leading-relaxed">{post.text}</p>
                  {post.type === "achievement" && (
                    <div className="mt-3 bg-accent-50 border border-accent-200 rounded-xl px-4 py-3 flex items-center gap-3">
                      <Award size={18} className="text-accent-600 shrink-0" />
                      <span className="text-sm font-semibold text-accent-700">Achievement Unlocked</span>
                    </div>
                  )}
                  {post.fileName && (
                    <div className="mt-3 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl px-4 py-3 flex items-center gap-3">
                      <FileText size={18} className="text-primary-700 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary-700 truncate">{post.fileName}</p>
                        <p className="text-xs text-primary-500">{post.fileSize}</p>
                      </div>
                      {post.fileUrl ? (
                        <a href={post.fileUrl} download={post.fileName} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-primary-900 text-white text-xs font-bold rounded-lg hover:bg-primary-800 transition-colors flex items-center gap-1">
                          <Download size={12} /> Download
                        </a>
                      ) : (
                        <span className="px-3 py-1.5 bg-neutral-300 text-neutral-500 text-xs font-bold rounded-lg cursor-not-allowed">Demo</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center border-t border-primary-100 px-2 bg-white/70">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${post.liked ? "text-accent-600" : "text-neutral-400 hover:text-accent-500"}`}>
                    {post.liked ? <Heart size={15} fill="currentColor" /> : <Heart size={15} />}
                    <span>{post.likes}</span>
                  </button>
                  <button onClick={() => toggleReplies(post.id)} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-primary-600 transition-colors">
                    <MessageCircle size={15} /> {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
                  </button>
                  <button onClick={() => toggleSave(post.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${post.saved ? "text-secondary-600" : "text-neutral-400 hover:text-secondary-500"}`}>
                    {post.saved ? <Bookmark size={15} fill="currentColor" /> : <Bookmark size={15} />} Save
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-primary-600 transition-colors ml-auto">
                    <Share2 size={15} /> Share
                  </button>
                </div>

                {expandedReplies.has(post.id) && (
                  <div className="border-t border-primary-100 bg-gradient-to-b from-white to-primary-50/30">
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-primary-100">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt={userName} width={30} height={30} className="w-8 h-8 object-cover shrink-0 rounded-lg" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-900 to-primary-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 rounded-lg">{userInitials}</div>
                      )}
                      <input
                        value={replyInputs[post.id] || ""}
                        onChange={(e) => setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && submitReply(post.id)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
                      />
                      <button onClick={() => submitReply(post.id)} className="px-3 py-2 bg-primary-900 text-white rounded-xl hover:bg-primary-800 transition-colors">
                        <Send size={13} />
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {post.replies.map((r) => (
                        <div key={r.id} className="flex gap-3 px-5 py-3 border-b border-primary-100 last:border-b-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 rounded-lg">{r.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-primary-700">{r.author}</span>
                              <span className="text-xs text-neutral-400">{r.time}</span>
                              <button
                                onClick={() => deleteReply(post.id, r.id)}
                                className="ml-auto text-red-300 hover:text-red-600 transition-colors"
                                aria-label="Delete reply"
                                title="Delete reply"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <p className="text-sm text-neutral-600 leading-relaxed">{r.text}</p>
                          </div>
                        </div>
                      ))}
                      {post.replies.length === 0 && (
                        <p className="text-sm text-neutral-400 px-5 py-5 text-center">No replies yet. Be the first to respond!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white border border-primary-200 rounded-2xl py-12 text-center">
                <p className="text-sm text-neutral-400">No posts match this filter.</p>
              </div>
            )}
            </div>

            {/*  Feed Filters (bottom)  */}
            <div className="mt-3 flex gap-1 bg-white border border-primary-200 rounded-2xl p-1.5 shadow-sm">
              {(["all", "discussions", "resources", "achievements"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-1 px-3 py-2 text-xs font-semibold capitalize rounded-xl transition-colors ${activeFilter === f ? "bg-primary-900 text-white" : "text-primary-700 hover:bg-primary-50"}`}
                >
                  {f === "all" ? "All Posts" : f}
                </button>
              ))}
            </div>
            </div>
            </>)}
          </div>

          {/*  RIGHT SIDEBAR — Meetings only  */}
          <div className="hidden lg:flex lg:flex-col w-64 shrink-0 gap-4">
            <div className="bg-white/95 backdrop-blur border border-primary-200 rounded-2xl overflow-hidden shadow-[0_10px_26px_rgba(28,53,87,0.12)]">
              <div className="px-4 py-3 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-secondary-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary-700 flex items-center gap-2">
                  <Video size={14} /> Upcoming Meetings
                </h3>
                <Link href="/events" className="text-[10px] font-semibold text-secondary-600 hover:text-secondary-700">All</Link>
              </div>
              <div className="divide-y divide-primary-100">
                {MEETINGS.map((mt) => (
                  <div key={mt.id} className="px-4 py-3 hover:bg-primary-50/45 transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                      {mt.live && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0 mt-1" />}
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold bg-primary-50 text-primary-700 border border-primary-100 rounded-full px-2 py-0.5">{mt.club}</span>
                        <p className="text-xs font-semibold text-primary-700 mt-1 leading-snug">{mt.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                          <Clock size={10} /> {mt.time} · {mt.attendees} attending
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/call/${encodeURIComponent(`Meeting-${mt.club}-${mt.id}`)}`)}
                      className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-colors ${mt.live ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100"}`}
                    >
                      {mt.live ? "Join Live" : "RSVP"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
