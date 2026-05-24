"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  chapters, events, resources as RESOURCES,
} from "@/lib/data";
import { addJoinedClub, getCreatedChapters, getCreatedEvents, removeCreatedChapter, removeJoinedClub } from "@/lib/clientState";
import { supabase, membershipsApi, organizationsApi, profilesApi } from "@/lib/api";
import type { Organization } from "@/lib/apiTypes";
import type { Chapter } from "@/types";
import { formatChapterLocation } from "@/lib/location";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle, ChevronLeft, ChevronRight,
  Clock, Mail, MapPin, Star, Users, Video, UserPlus, Trash2, X,
} from "lucide-react";
import DonationForm from "@/components/DonationForm";

const CLUB_IMAGES: Record<string, string[]> = {
  Academic:  [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
  ],
  STEM: [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
  ],
  Service: [
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
  ],
  Arts: [
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
  ],
  Cultural: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  ],
  Sports: [
    "https://images.unsplash.com/photo-1461896836934-bd45ba688b72?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1461308345553-de4d1d7d8dc0?auto=format&fit=crop&w=1200&q=80",
  ],
  Leadership: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  ],
  General: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  ],
};

const RESOURCE_LINKS = [
  { label: "How to Start a Club", href: "/resources/ig-1", type: "guide" },
  { label: "Running Effective Meetings", href: "/resources/ob-1", type: "template" },
  { label: "Event Planning Toolkit", href: "/resources/ex-1", type: "template" },
  { label: "Fundraising Playbook", href: "/resources/ex-2", type: "guide" },
  { label: "Officer Roles & Responsibilities", href: "/resources/ob-3", type: "handbook" },
  { label: "Social Media Best Practices", href: "/resources/lo-1", type: "guide" },
];

const TYPE_PILL: Record<string, string> = {
  guide:    "bg-blue-100 text-blue-700",
  template: "bg-amber-100 text-amber-700",
  handbook: "bg-purple-100 text-purple-700",
};

export default function ClubDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [donationPopup, setDonationPopup] = useState<{ amount: string; clubName: string } | null>(null);
  const [dbChapter, setDbChapter] = useState<Chapter | null>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [orgCreatedBy, setOrgCreatedBy] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
    setMounted(true);
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("donated") === "true") {
        const amt = sp.get("amount") || "?";
        setDonationPopup({ amount: amt, clubName: chapter?.name || "this club" });
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const allChapters = mounted ? [...chapters, ...getCreatedChapters()] : chapters;
  const clubIdx = allChapters.findIndex(c => c.id === params.id);

  // Fallback: fetch from DB if not found in local/static data
  useEffect(() => {
    if (!mounted) return;
    if (allChapters[clubIdx]) { setDbLoading(false); return; }
    organizationsApi.getById(params.id).then(({ data }) => {
      if (data) {
        const org = data as Organization;
        setOrgCreatedBy(org.created_by || null);
      setDbChapter({
          id: org.id,
          name: org.name,
          description: org.description || "",
          category: (org.category || "General") as Chapter["category"],
          meetingFrequency: (org.meeting_frequency || "Weekly") as Chapter["meetingFrequency"],
          membershipStatus: (org.membership_status || "Open Enrollment") as Chapter["membershipStatus"],
          gradeLevel: (org.grade_level || "All Grades") as Chapter["gradeLevel"],
          meetingTime: (org.meeting_time || "After School") as Chapter["meetingTime"],
          advisor: { name: org.advisor_name || "", email: org.contact_email || "", department: "Staff" },
          officers: [],
          meetingSchedule: org.meeting_schedule || "",
          meetingLocation: { lat: 0, lng: 0, room: org.meeting_location || "" },
          membershipRequirements: org.membership_requirements || "",
          dues: org.dues || "",
          socialLinks: (org.social_links as Record<string, string>) || {},
          achievements: [],
          photoGallery: org.banner_url ? [org.banner_url] : [],
          memberCount: org.member_count || 0,
          foundedYear: org.founded_year || new Date().getFullYear(),
          isActive: org.is_active ?? true,
        });
      }
      setDbLoading(false);
    });
  }, [mounted, clubIdx, params.id]);

  const chapter = allChapters[clubIdx] ?? dbChapter;

  const prevClub = clubIdx > 0 ? allChapters[clubIdx - 1] : null;
  const nextClub = clubIdx < allChapters.length - 1 ? allChapters[clubIdx + 1] : null;

  const defaultHero = (CLUB_IMAGES[chapter?.category ?? "General"] ?? CLUB_IMAGES.General)[0];
  const heroImage = chapter?.photoGallery?.[0]?.startsWith("http") ? chapter.photoGallery[0] : defaultHero;

  const staticEvents = events.filter(e => e.chapterId === params.id).slice(0, 6);
  const userEvents = mounted ? getCreatedEvents()
    .filter(e => e.clubId === params.id)
    .map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      chapterId: e.clubId,
      chapterName: e.clubName,
      category: e.category as import("@/types").ChapterCategory,
      isPublic: true,
      requiresRSVP: false,
      currentAttendees: 0,
    })) : [];
  const chapterEvents = [...userEvents, ...staticEvents].slice(0, 6);

  const isUserCreated = mounted && (
    getCreatedChapters().some(c => c.id === params.id) ||
    (orgCreatedBy !== null && orgCreatedBy === currentUserId)
  );

  const handleDeleteClub = async () => {
    if (!confirm(`Delete "${chapter?.name}"? This cannot be undone.`)) return;
    removeCreatedChapter(params.id);
    removeJoinedClub(params.id);

    // Persist deleted org ID in localStorage so directory hides it immediately
    // even if the router cache is stale.
    try {
      const raw = window.localStorage.getItem("cc_deleted_org_ids");
      const existing: string[] = raw ? JSON.parse(raw) : [];
      if (!existing.includes(params.id)) {
        window.localStorage.setItem(
          "cc_deleted_org_ids",
          JSON.stringify([...existing, params.id])
        );
      }
    } catch { /* ignore */ }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
    if (isUUID) {
      // getUser() validates + auto-refreshes the token; getSession() then returns
      // the fresh access token to pass to the server route.
      await supabase.auth.getUser();
      const { data: { session: supaSession } } = await supabase.auth.getSession();
      const res = await fetch(`/api/clubs/${params.id}`, {
        method: "DELETE",
        headers: supaSession?.access_token
          ? { Authorization: `Bearer ${supaSession.access_token}` }
          : {},
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Club delete failed:", body.error);
      }
    }

    // Full navigation bypasses Next.js router cache so directory re-fetches DB
    window.location.href = "/directory";
  };

  const handleJoin = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      router.push(`/portal`);
      return;
    }
    const status = chapter.membershipStatus === "Open Enrollment" ? "member" : "pending";
    addJoinedClub({ id: chapter.id, name: chapter.name, status });
    try {
      const { data: profile } = await profilesApi.getById(authData.user.id);
      if (!profile) {
        await profilesApi.create({ id: authData.user.id, name: authData.user.email?.split("@")[0] || "Student", email: authData.user.email || "" });
      }
      // If chapter.id is already a UUID (DB-created club), use it directly
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chapter.id);
      if (isUUID) {
        await membershipsApi.create({ org_id: chapter.id, user_id: authData.user.id });
      } else {
        const { data: slugOrg } = await organizationsApi.getBySlug(chapter.id);
        let matchedOrg = slugOrg;
        if (!matchedOrg) {
          const { data: organizations } = await organizationsApi.getAll();
          matchedOrg = ((organizations as any[]) || []).find((org: any) => org.slug === chapter.id || org.name === chapter.name) || null;
        }
        if (matchedOrg) await membershipsApi.create({ org_id: matchedOrg.id, user_id: authData.user.id });
      }
    } catch (e) { console.error("Join error:", e); }
    router.push("/portal?tab=clubs&joined=true");
  };

  if (!chapter) {
    if (!mounted || dbLoading) return <div className="min-h-screen flex items-center justify-center bg-cream-200"><p className="text-neutral-400">Loading&hellip;</p></div>;
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-200 px-4">
        <div className="bg-white rounded-none shadow p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-heading font-bold text-primary-800 mb-2">Club Not Found</h1>
          <Link href="/directory" className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-primary-600 hover:underline"><ArrowLeft size={13} /> Back to Directory</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-200 min-h-screen">

      {/* ── DONATION SUCCESS POPUP ─────────────────────────── */}
      {donationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-cream-300 max-w-sm w-full p-8 relative">
            <button onClick={() => setDonationPopup(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 transition-colors">
              <X size={16} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h2 className="text-xl font-heading font-bold text-primary-800">Thank You!</h2>
              <p className="mt-2 text-sm text-neutral-600">Your donation has been processed successfully.</p>
              <div className="mt-4 w-full border border-cream-300 divide-y divide-cream-300 text-sm">
                <div className="flex justify-between px-4 py-2">
                  <span className="text-neutral-500 font-medium">Amount</span>
                  <span className="font-bold text-primary-800">${donationPopup.amount}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-neutral-500 font-medium">Recipient</span>
                  <span className="font-bold text-primary-800">{donationPopup.clubName}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-neutral-500 font-medium">Processor</span>
                  <span className="font-bold text-primary-800">Stripe</span>
                </div>
              </div>
              <button onClick={() => setDonationPopup(null)}
                className="mt-5 w-full py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-900" style={{ minHeight: "280px" }}>
        {heroImage && (
          <div className="absolute inset-0">
            <Image src={heroImage} alt="" fill className="object-cover opacity-40" priority />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/60 to-primary-900/30" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 md:pt-12 md:pb-24">
          <Link href="/directory" className="inline-flex items-center gap-1 text-xs text-primary-300 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={13} /> Back to Directory
          </Link>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/15 text-white rounded-full">{chapter.category}</span>
              <span className="px-3 py-1 text-xs font-semibold bg-secondary-500/20 text-secondary-300 border border-secondary-500/30 rounded-full">{chapter.membershipStatus}</span>
              <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-200 border border-green-400/30 rounded-full">Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]">{chapter.name}</h1>
            <p className="mt-2 text-sm max-w-xl leading-relaxed inline-block cream-textured border border-cream-400 text-primary-900 px-3 py-2 rounded-lg font-medium">{chapter.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-5 text-white/70 text-xs">
              <span className="flex items-center gap-1"><Users size={12} className="text-secondary-400" /> {chapter.memberCount} members</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-secondary-400" /> Founded {chapter.foundedYear}</span>
              <span className="flex items-center gap-1"><MapPin size={12} className="text-secondary-400" /> {formatChapterLocation(chapter.meetingLocation)}</span>
            </div>
          </div>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 42" preserveAspectRatio="none" className="block w-full h-7 md:h-9">
            <path d="M0,42 L0,20 C360,42 720,0 1080,20 C1260,30 1380,16 1440,20 L1440,42 Z" fill="#f5f0e8" />
          </svg>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">

          {/* ── MAIN (2/3) ── */}
          <div className="md:col-span-2 space-y-5">

            {/* About */}

                <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-primary-800 text-base mb-4 flex items-center gap-2">
                    <BookOpen size={16} className="text-secondary-500" /> About this Club
                  </h2>
                  <p className="text-sm text-primary-700 leading-relaxed line-clamp-3">{chapter.description}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      { label: "Meeting Schedule", value: chapter.meetingSchedule },
                      { label: "Frequency", value: chapter.meetingFrequency },
                      { label: "Time", value: chapter.meetingTime },
                      { label: "Location", value: formatChapterLocation(chapter.meetingLocation) },
                      { label: "Founded", value: String(chapter.foundedYear) },
                      { label: "Dues", value: chapter.dues || "None" },
                      { label: "Grade Level", value: chapter.gradeLevel },
                      { label: "Membership", value: chapter.membershipStatus },
                    ].map(item => (
                      <div key={item.label} className="bg-cream-100 rounded-xl border border-cream-300 px-3 py-2.5">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-primary-400 mb-0.5">{item.label}</dt>
                        <dd className="text-xs font-semibold text-primary-800 leading-snug">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Leadership */}
                <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-primary-800 text-base mb-4">Leadership</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {chapter.officers.map(officer => (
                      <div key={officer.email} className="flex items-center gap-3 bg-cream-50 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {officer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary-800">{officer.name}</p>
                          <p className="text-xs text-secondary-600 font-semibold">{officer.position}</p>
                          <p className="text-[10px] text-neutral-400">Grade {officer.grade}</p>
                        </div>
                      </div>
                    ))}
                    {/* Advisor */}
                    <div className="flex items-center gap-3 bg-secondary-50 rounded-xl border border-secondary-100 p-3 sm:col-span-2">
                      <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center shrink-0">
                        <Star size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary-800">{chapter.advisor.name}</p>
                        <p className="text-xs text-secondary-600 font-semibold">Faculty Advisor &middot; {chapter.advisor.department}</p>
                        <a href={`mailto:${chapter.advisor.email}`} className="text-[10px] text-primary-500 hover:underline flex items-center gap-1 mt-0.5">
                          <Mail size={9} /> {chapter.advisor.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membership Requirements */}
                <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-primary-800 text-base mb-3">Membership Requirements</h2>
                  <p className="text-sm text-primary-700">{chapter.membershipRequirements}</p>
                  <p className="mt-2 text-xs text-primary-500 font-semibold">
                    {chapter.membershipStatus === "Open Enrollment"
                      ? "Open to all students — join and start participating immediately."
                      : "Application required — officers will review your membership request."}
                  </p>
                </div>

          </div>

          {/* ── SIDEBAR (1/3) ── */}
          <aside className="space-y-5">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
              <h3 className="font-heading font-bold text-primary-800 text-sm mb-4">Quick Info</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-primary-700">
                  <Clock size={13} className="text-secondary-500 shrink-0" />
                  <span>{chapter.meetingSchedule}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-700">
                  <MapPin size={13} className="text-secondary-500 shrink-0" />
                  <span>{formatChapterLocation(chapter.meetingLocation)}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-700">
                  <Users size={13} className="text-secondary-500 shrink-0" />
                  <span>{chapter.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2 text-primary-700">
                  <Star size={13} className="text-secondary-500 shrink-0" />
                  <span>Founded {chapter.foundedYear}</span>
                </div>
              </div>
              <button onClick={handleJoin}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold transition-colors">
                <UserPlus size={12} /> Join Club
              </button>
              <Link href={`/call/${encodeURIComponent(chapter.id)}?returnTo=${encodeURIComponent(`/directory/${chapter.id}`)}`}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-primary-300 text-primary-700 text-xs font-semibold hover:bg-primary-50 transition-colors">
                <Video size={12} /> Join Virtual Meeting
              </Link>
            </div>

            {/* Tags — field not on Chapter type, skip */}

            {/* Contact — field not on Chapter type, skip */}

            {/* Portal CTA removed — see portal page */}

            {/* Donation */}
            <div className="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-700 mb-3">Support This Club</p>
              <DonationForm
                selectedClub={{ id: chapter.id, name: chapter.name }}
                compact
                returnPath={`/directory/${chapter.id}`}
              />
            </div>

            {/* Delete (user-created clubs only) */}
            {isUserCreated && (
              <button
                onClick={handleDeleteClub}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors rounded-xl"
              >
                <Trash2 size={13} /> Delete This Club
              </button>
            )}
          </aside>
        </div>
      </div>

      {/* ── PREV / NEXT NAVIGATION ────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="border-t border-cream-400 pt-6 flex items-center justify-between gap-4">
          {prevClub ? (
            <Link href={`/directory/${prevClub.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-cream-300 px-5 py-3 hover:border-primary-300 hover:shadow-sm transition-all group">
              <ChevronLeft size={18} className="text-primary-400 group-hover:text-primary-700 transition-colors" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Previous Club</p>
                <p className="text-sm font-bold text-primary-800 group-hover:text-primary-600 transition-colors">{prevClub.name}</p>
              </div>
            </Link>
          ) : <div />}

          <Link href="/directory" className="text-xs font-bold text-primary-500 hover:text-primary-700 transition-colors">
            All Clubs
          </Link>

          {nextClub ? (
            <Link href={`/directory/${nextClub.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-cream-300 px-5 py-3 hover:border-primary-300 hover:shadow-sm transition-all group text-right">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Next Club</p>
                <p className="text-sm font-bold text-primary-800 group-hover:text-primary-600 transition-colors">{nextClub.name}</p>
              </div>
              <ChevronRight size={18} className="text-primary-400 group-hover:text-primary-700 transition-colors" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}