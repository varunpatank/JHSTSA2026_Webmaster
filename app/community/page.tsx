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
  Paperclip,
  Send,
  Upload,
  X,
  Bookmark,
  Share2,
  TrendingUp,
  Users,
  Calendar,
  Phone,
  MoreHorizontal,
  GraduationCap,
  Video,
  BookOpen,
  Award,
  Star,
  ArrowRight,
  Globe,
  Clock,
  Trophy,
  Trash2,
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
  },
  {
    id: "m4",
    name: "David Park",
    avatar: "DP",
    role: "Mechanical Engineer, Boeing",
    specialty: "Robotics & Engineering Design",
    available: true,
  },
  {
    id: "m3",
    name: "Maria Gonzalez",
    avatar: "MG",
    role: "Community Organizer, United Way",
    specialty: "Nonprofit Leadership & Service",
    available: true,
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
      if (!data.user) return;
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

  const [chatMessages, setChatMessages] = useState<
    { user: string; text: string; time: string }[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clubconnect_community_chat");
      if (saved)
        try {
          return JSON.parse(saved);
        } catch {}
    }
    return [
      {
        user: "Sophie K.",
        text: "TSA rubric breakdown is so helpful!",
        time: "1h",
      },
      {
        user: "Taylor M.",
        text: "Anyone have the meeting agenda template?",
        time: "3h",
      },
      {
        user: "Maria G.",
        text: "Check the fundraising playbook I posted!",
        time: "6h",
      },
      {
        user: "Alex J.",
        text: "Robotics meeting moved to Room 204",
        time: "8h",
      },
    ];
  });
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    localStorage.setItem("clubconnect_community_feed", JSON.stringify(feed));
  }, [feed]);
  useEffect(() => {
    localStorage.setItem(
      "clubconnect_community_chat",
      JSON.stringify(chatMessages),
    );
  }, [chatMessages]);

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

  function sendChat() {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      { user: "You", text: chatInput.trim(), time: "now" },
      ...prev,
    ]);
    setChatInput("");
  }

  function connectMentor(mentorId: string) {
    setConnectedMentors((prev) => new Set(prev).add(mentorId));
    router.push(`/hub/mentors?mentor=${encodeURIComponent(mentorId)}`);
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
    <div className="min-h-screen bg-neutral-100">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.gif,.svg,.txt,.md,.csv"
        onChange={handleFileSelect}
      />

      <HeroSection align="left" contentClassName="!max-w-full">
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <h1 className="hero-title mt-0">
              <span>Community</span>
            </h1>
            <p className="hero-description mt-1 text-sm">
              Share resources, start discussions, connect with clubs
            </p>
          </div>
          <div className="hidden sm:grid grid-cols-5 gap-2 ml-auto">
            <div className="bg-primary-500/40 border border-primary-400/30 px-5 py-3.5 text-center min-w-[90px]">
              <p className="text-2xl font-heading font-bold text-white">
                {feed.length}
              </p>
              <p className="text-[10px] text-primary-200 uppercase tracking-wider mt-0.5">
                Posts
              </p>
            </div>
            <div className="bg-secondary-500/30 border border-secondary-400/30 px-5 py-3.5 text-center min-w-[90px]">
              <p className="text-2xl font-heading font-bold text-secondary-300">
                47
              </p>
              <p className="text-[10px] text-secondary-200/70 uppercase tracking-wider mt-0.5">
                Online
              </p>
            </div>
            <div className="bg-accent-500/30 border border-accent-400/30 px-5 py-3.5 text-center min-w-[90px]">
              <p className="text-2xl font-heading font-bold text-accent-300">
                25
              </p>
              <p className="text-[10px] text-accent-200/70 uppercase tracking-wider mt-0.5">
                Clubs
              </p>
            </div>
            <div className="bg-emerald-500/25 border border-emerald-400/30 px-5 py-3.5 text-center min-w-[90px]">
              <p className="text-2xl font-heading font-bold text-emerald-300">
                847
              </p>
              <p className="text-[10px] text-emerald-200/70 uppercase tracking-wider mt-0.5">
                Members
              </p>
            </div>
            <div className="bg-violet-500/25 border border-violet-400/30 px-5 py-3.5 text-center min-w-[90px]">
              <p className="text-2xl font-heading font-bold text-violet-300">
                12
              </p>
              <p className="text-[10px] text-violet-200/70 uppercase tracking-wider mt-0.5">
                Events
              </p>
            </div>
          </div>
        </div>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex gap-5">
          {/*  LEFT SIDEBAR (LinkedIn-style nav)  */}
          <div className="hidden lg:block w-56 shrink-0 space-y-4">
            {/* Profile Card */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="h-14 bg-primary-600" />
              <div className="px-4 pb-4 -mt-5">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={48}
                    height={48}
                    className="w-12 h-12 border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 border-2 border-white flex items-center justify-center text-sm font-bold text-primary-700">
                    {userInitials}
                  </div>
                )}
                <h3 className="font-bold text-sm text-primary-700 mt-2">
                  {userName}
                </h3>
                <p className="text-[11px] text-neutral-500">{isGuest ? "Guest" : "Club Member"}</p>
                {isGuest && (
                  <Link href="/login" className="mt-2 block text-xs text-primary-600 font-semibold hover:underline">
                    Sign in to get official profile
                  </Link>
                )}
                {!isGuest && (
                  <div className="mt-2 flex gap-3 text-[10px] text-neutral-500">
                    <span>
                      <strong className="text-primary-700">3</strong> Clubs
                    </span>
                    <span>
                      <strong className="text-primary-700">12</strong> Posts
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Club Accomplishments */}
            <div className="bg-white border border-neutral-200">
              <div className="px-4 py-3 border-b border-neutral-200">
                <h3 className="text-sm font-bold text-primary-700 flex items-center gap-1.5">
                  <Award size={14} /> Club Highlights
                </h3>
              </div>
              <div className="divide-y divide-neutral-100">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy size={13} className="text-secondary-600 shrink-0" />
                    <span className="text-xs font-bold text-primary-700">
                      Model UN
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Best Delegation — Pacific NW Conference 2025
                  </p>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={13} className="text-accent-600 shrink-0" />
                    <span className="text-xs font-bold text-primary-700">
                      Robotics Team
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Regional Champions — FIRST Robotics 2025
                  </p>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={13} className="text-primary-600 shrink-0" />
                    <span className="text-xs font-bold text-primary-700">
                      NHS Chapter
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    500+ volunteer hours this semester
                  </p>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={13} className="text-green-600 shrink-0" />
                    <span className="text-xs font-bold text-primary-700">
                      Drama Club
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    3 sold-out performances — Spring Musical
                  </p>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={13} className="text-primary-500 shrink-0" />
                    <span className="text-xs font-bold text-primary-700">
                      CS Club
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    1st Place — HackNW Hackathon 2025
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-neutral-100">
                <Link
                  href="/hub/stories"
                  className="text-[10px] font-semibold text-secondary-600 hover:underline flex items-center gap-1"
                >
                  See all stories <ArrowRight size={10} />
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-neutral-200 p-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                Community Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Active Clubs</span>
                  <span className="font-bold text-primary-700">25</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Total Members</span>
                  <span className="font-bold text-primary-700">847</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Events This Month</span>
                  <span className="font-bold text-primary-700">12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Service Hours</span>
                  <span className="font-bold text-primary-700">2,450+</span>
                </div>
              </div>
            </div>
          </div>

          {/*  CENTER FEED  */}
          <div className="flex-1 min-w-0 space-y-4">
            {/*  Upload / Post Composer (LARGE & DETAILED)  */}
            <div
              className={`bg-white border-2 transition-colors ${dragOver ? "border-primary-400 bg-primary-50/50" : "border-neutral-200"}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {/* Composer header */}
              <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={44}
                    height={44}
                    className="w-11 h-11 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 bg-primary-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {userInitials}
                  </div>
                )}
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share a resource, start a discussion, or post an update..."
                  rows={3}
                  className="w-full border border-neutral-200 px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary-400 placeholder:text-neutral-400"
                />
              </div>

              {/* Attached file preview */}
              {attachedFile && (
                <div className="mx-5 mb-2 flex items-center gap-3 bg-primary-50 border border-primary-200 px-4 py-3">
                  <div className="w-10 h-10 bg-primary-200 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-primary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-700 truncate">
                      {attachedFile.name}
                    </p>
                    <p className="text-xs text-primary-500">
                      {(attachedFile.size / 1024 / 1024).toFixed(2)} MB &middot;
                      Ready to upload
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAttachedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Drag-drop zone (shown when no file attached) */}
              {!attachedFile && (
                <div
                  className="mx-5 mb-3 border-2 border-dashed border-neutral-300 bg-neutral-50 py-5 flex flex-col items-center gap-2 cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={28} className="text-neutral-400" />
                  <p className="text-sm font-semibold text-neutral-600">
                    Drop files here or click to browse
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    PDF, DOCX, PPTX, XLSX, ZIP, Images &middot; Max 25MB
                  </p>
                </div>
              )}

              {/* Action bar */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    <Upload size={14} /> Upload
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <ImageIcon size={14} /> Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Video size={14} /> Video
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Paperclip size={14} /> Attach
                  </button>
                </div>
                <button
                  onClick={submitPost}
                  disabled={uploading || (!postText.trim() && !attachedFile)}
                  className="flex items-center gap-1.5 px-5 py-2 bg-secondary-500 text-white text-xs font-bold hover:bg-secondary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} /> {uploading ? "Uploading..." : "Post"}
                </button>
              </div>
            </div>

            {/*  Feed Filters  */}
            <div className="flex gap-1 bg-white border border-neutral-200 p-1.5">
              {(
                ["all", "discussions", "resources", "achievements"] as const
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-1 px-3 py-2 text-xs font-semibold capitalize transition-colors ${activeFilter === f ? "bg-primary-600 text-white" : "text-neutral-500 hover:bg-neutral-50"}`}
                >
                  {f === "all" ? "All Posts" : f}
                </button>
              ))}
            </div>

            {/*  Feed Posts  */}
            {filtered.slice(0, 4).map((post) => (
              <div key={post.id} className="bg-white border border-neutral-200">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-700">
                        {post.author}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 font-semibold ${typeColors[post.type]}`}
                      >
                        {post.club}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{post.time}</p>
                  </div>
                  <button className="text-neutral-300 hover:text-neutral-500">
                    <MoreHorizontal size={16} />
                  </button>
                  {(post.author === userName || post.author === "You") && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this post?"))
                          setFeed((prev) =>
                            prev.filter((p) => p.id !== post.id),
                          );
                      }}
                      className="text-red-300 hover:text-red-600 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="px-5 pb-3">
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {post.text}
                  </p>
                  {post.type === "achievement" && (
                    <div className="mt-3 bg-accent-50 border border-accent-200 px-4 py-3 flex items-center gap-3">
                      <Award size={20} className="text-accent-600 shrink-0" />
                      <span className="text-sm font-semibold text-accent-700">
                        Achievement Unlocked
                      </span>
                    </div>
                  )}
                  {post.fileName && (
                    <div className="mt-3 bg-primary-50 border border-primary-200 px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-200 flex items-center justify-center shrink-0">
                        <FileText size={20} className="text-primary-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary-700 truncate">
                          {post.fileName}
                        </p>
                        <p className="text-xs text-primary-500">
                          {post.fileSize}
                        </p>
                      </div>
                      {post.fileUrl ? (
                        <a
                          href={post.fileUrl}
                          download={post.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors flex items-center gap-1"
                        >
                          <Download size={13} /> Download
                        </a>
                      ) : (
                        <span className="px-3 py-1.5 bg-neutral-300 text-neutral-500 text-xs font-bold cursor-not-allowed">
                          Demo File
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center border-t border-neutral-100 px-2">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${post.liked ? "text-accent-600" : "text-neutral-400 hover:text-accent-500"}`}
                  >
                    {post.liked ? (
                      <Heart size={16} fill="currentColor" />
                    ) : (
                      <Heart size={16} />
                    )}
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleReplies(post.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-primary-600 transition-colors"
                  >
                    <MessageCircle size={16} /> {post.replies.length}{" "}
                    {post.replies.length === 1 ? "Reply" : "Replies"}
                  </button>
                  <button
                    onClick={() => toggleSave(post.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors ${post.saved ? "text-secondary-600" : "text-neutral-400 hover:text-secondary-500"}`}
                  >
                    {post.saved ? (
                      <Bookmark size={16} fill="currentColor" />
                    ) : (
                      <Bookmark size={16} />
                    )}{" "}
                    Save
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-primary-600 transition-colors ml-auto">
                    <Share2 size={16} /> Share
                  </button>
                </div>

                {/* Threaded Replies (VERTICAL) */}
                {expandedReplies.has(post.id) && (
                  <div className="border-t border-neutral-100 bg-neutral-50/70">
                    {/* Reply composer */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={userName}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {userInitials}
                        </div>
                      )}
                      <input
                        value={replyInputs[post.id] || ""}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && submitReply(post.id)
                        }
                        placeholder="Write a reply..."
                        className="flex-1 bg-white border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
                      />
                      <button
                        onClick={() => submitReply(post.id)}
                        className="px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                    {/* Replies list  vertical layout with spacing */}
                    <div className="max-h-[350px] overflow-y-auto">
                      {post.replies.map((r) => (
                        <div
                          key={r.id}
                          className="flex gap-3 px-5 py-3 border-b border-neutral-100 last:border-b-0"
                        >
                          <div className="w-8 h-8 bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {r.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-primary-700">
                                {r.author}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {r.time}
                              </span>
                              {(r.author === userName ||
                                r.author === "You") && (
                                <button
                                  onClick={() =>
                                    setFeed((prev) =>
                                      prev.map((p) =>
                                        p.id === post.id
                                          ? {
                                              ...p,
                                              replies: p.replies.filter(
                                                (rr) => rr.id !== r.id,
                                              ),
                                            }
                                          : p,
                                      ),
                                    )
                                  }
                                  className="ml-auto text-red-300 hover:text-red-600 transition-colors"
                                  title="Delete reply"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-neutral-600 leading-relaxed">
                              {r.text}
                            </p>
                          </div>
                        </div>
                      ))}
                      {post.replies.length === 0 && (
                        <p className="text-sm text-neutral-400 px-5 py-5 text-center">
                          No replies yet. Be the first to respond!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white border border-neutral-200 py-12 text-center">
                <p className="text-sm text-neutral-400">
                  No posts match this filter.
                </p>
              </div>
            )}

            {filtered.length > 4 && (
              <button
                onClick={() => setActiveFilter("all")}
                className="w-full bg-white border border-neutral-200 py-3 text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
              >
                View All {filtered.length} Posts →
              </button>
            )}
          </div>

          {/*  RIGHT SIDEBAR  */}
          <div className="hidden xl:block w-72 shrink-0 space-y-4">
            {/* Mentor Hub */}
            <div className="bg-white border border-neutral-200">
              <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary-700 flex items-center gap-2">
                  <GraduationCap size={15} /> Mentor Hub
                </h3>
                <Link
                  href="/hub/mentors"
                  className="text-[10px] font-semibold text-secondary-600 hover:text-secondary-700"
                >
                  See All
                </Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {MENTORS.map((m) => (
                  <div key={m.id} className="px-4 py-3 flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                        {m.avatar}
                      </div>
                      {m.available && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary-700">
                        {m.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">{m.role}</p>
                      <p className="text-[10px] text-neutral-400">
                        {m.specialty}
                      </p>
                    </div>
                    <button
                      onClick={() => connectMentor(m.id)}
                      className={`px-2 py-1 text-[10px] font-semibold border transition-colors shrink-0 ${connectedMentors.has(m.id) ? "bg-green-50 border-green-200 text-green-700" : "bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100"}`}
                    >
                      {connectedMentors.has(m.id) ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Meetings */}
            <div className="bg-white border border-neutral-200">
              <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary-700 flex items-center gap-2">
                  <Video size={15} /> Meetings
                </h3>
                <Link
                  href="/meetings"
                  className="text-[10px] font-semibold text-secondary-600 hover:text-secondary-700"
                >
                  All
                </Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {MEETINGS.map((mt) => (
                  <div key={mt.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {mt.live && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                          )}
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-primary-50 text-primary-700 border border-primary-100">
                            {mt.club}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-primary-700 truncate">
                          {mt.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {mt.time}
                          </span>
                          <span>{mt.attendees} attending</span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          router.push(
                            `/call/${encodeURIComponent(`Meeting-${mt.club}-${mt.id}`)}`,
                          )
                        }
                        className={`px-3 py-1.5 text-[11px] font-bold shrink-0 transition-colors ${mt.live ? "bg-accent-600 text-white hover:bg-accent-700" : "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100"}`}
                      >
                        {mt.live ? "Join Live" : "RSVP"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-white border border-neutral-200">
              <div className="px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-xs font-bold text-primary-700 flex items-center gap-1.5">
                  <MessageCircle size={13} /> Messages
                </h3>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="h-44 overflow-y-auto p-3 space-y-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 text-xs ${msg.user === "You" ? "bg-primary-50 border-l-2 border-primary-400" : "bg-neutral-50"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-primary-700">
                        {msg.user}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-neutral-600">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex border-t border-neutral-200">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Message..."
                  className="flex-1 px-3 py-2.5 text-xs focus:outline-none"
                />
                <button
                  onClick={sendChat}
                  className="px-3 text-primary-600 hover:text-primary-700"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
