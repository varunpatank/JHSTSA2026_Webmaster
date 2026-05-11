"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  chapters, events, RESOURCES,
} from "@/lib/data";
import { addJoinedClub, getCreatedChapters } from "@/lib/clientState";
import { supabase, membershipsApi, organizationsApi, profilesApi } from "@/lib/api";
import { formatChapterLocation } from "@/lib/location";
import {
  ArrowLeft, ArrowRight, BookOpen, Calendar, ChevronLeft, ChevronRight,
  Clock, FileText, Mail, MapPin, Star, Users, Video, UserPlus,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "resources">("overview");

  useEffect(() => { setMounted(true); }, []);

  const allChapters = mounted ? [...chapters, ...getCreatedChapters()] : chapters;
  const clubIdx = allChapters.findIndex(c => c.id === params.id);
  const chapter = allChapters[clubIdx];

  const prevClub = clubIdx > 0 ? allChapters[clubIdx - 1] : null;
  const nextClub = clubIdx < allChapters.length - 1 ? allChapters[clubIdx + 1] : null;

  const heroBgs = CLUB_IMAGES[chapter?.category ?? "General"] ?? CLUB_IMAGES.General;
  const heroImage = heroBgs[0];

  const chapterEvents = events.filter(e => e.chapterId === params.id).slice(0, 6);

  const handleJoin = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      router.push(`/login?redirect=/directory/${params.id}&action=join&club=${params.id}`);
      return;
    }
    const status = chapter.membershipStatus === "Open Enrollment" ? "member" : "pending";
    addJoinedClub({ id: chapter.id, name: chapter.name, status });
    try {
      const { data: profile } = await profilesApi.getById(authData.user.id);
      if (!profile) {
        await profilesApi.create({ id: authData.user.id, name: authData.user.email?.split("@")[0] || "Student", email: authData.user.email || "" });
      }
      const { data: matchedOrg } = await organizationsApi.getBySlug(chapter.id);
      if (matchedOrg) await membershipsApi.create({ org_id: matchedOrg.id, user_id: authData.user.id });
    } catch (e) { console.error("Join error:", e); }
    router.push("/portal?tab=clubs&joined=true");
  };

  if (!chapter) {
    if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-cream-200"><p className="text-neutral-400">Loading&hellip;</p></div>;
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
            <p className="mt-2 text-sm max-w-xl leading-relaxed inline-block bg-black/40 backdrop-blur-sm text-white px-3 py-2 rounded">{chapter.description}</p>
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

      {/* ── TABS ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex gap-0 border-b border-cream-400">
          {(["overview", "events", "resources"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-primary-900 text-primary-900" : "border-transparent text-neutral-500 hover:text-primary-700"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">

          {/* ── MAIN (2/3) ── */}
          <div className="md:col-span-2 space-y-5">

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                {/* About */}
                <div className="bg-white rounded-none border border-cream-300 p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-primary-800 text-base mb-4 flex items-center gap-2">
                    <BookOpen size={16} className="text-secondary-500" /> About this Club
                  </h2>
                  <p className="text-sm text-primary-700 leading-relaxed">{chapter.description}</p>
                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
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
                      <div key={item.label} className="flex items-start gap-2 bg-cream-50 rounded-none px-3 py-2">
                        <span className="text-xs font-bold text-primary-600 min-w-[110px]">{item.label}</span>
                        <span className="text-xs text-primary-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leadership */}
                <div className="bg-white rounded-none border border-cream-300 p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-primary-800 text-base mb-4">Leadership</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {chapter.officers.map(officer => (
                      <div key={officer.email} className="flex items-center gap-3 bg-cream-50 rounded-none p-3">
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
                    <div className="flex items-center gap-3 bg-secondary-50 rounded-none border border-secondary-100 p-3 sm:col-span-2">
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
                <div className="bg-white rounded-none border border-cream-300 p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-primary-800 text-base mb-3">Membership Requirements</h2>
                  <p className="text-sm text-primary-700">{chapter.membershipRequirements}</p>
                  <p className="mt-2 text-xs text-primary-500 font-semibold">
                    {chapter.membershipStatus === "Open Enrollment"
                      ? "Open to all students — join and start participating immediately."
                      : "Application required — officers will review your membership request."}
                  </p>
                </div>
              </>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div className="bg-white rounded-none border border-cream-300 p-6 shadow-sm">
                <h2 className="font-heading font-bold text-primary-800 text-base mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-secondary-500" /> Upcoming Events
                </h2>
                {chapterEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar size={32} className="mx-auto text-cream-400 mb-3" />
                    <p className="text-sm text-neutral-500">No upcoming events scheduled yet.</p>
                    <Link href="/portal" className="mt-3 inline-block text-xs font-bold text-primary-600 hover:underline">Create an event &rarr;</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chapterEvents.map(ev => (
                      <Link key={ev.id} href={`/events/${ev.id}`}
                        className="flex items-start gap-4 p-4 rounded-none bg-cream-50 border border-cream-200 hover:border-primary-300 hover:bg-white transition-all group">
                        <div className="bg-primary-800 text-white text-center px-3 py-2 rounded-none shrink-0">
                          <p className="text-[9px] font-bold uppercase opacity-70">{new Date(ev.date).toLocaleDateString("en-US", { month: "short" })}</p>
                          <p className="text-lg font-bold font-heading leading-none">{new Date(ev.date).getDate()}</p>
                        </div>
                        <div>
                          <p className="font-heading font-bold text-primary-800 text-sm group-hover:text-primary-600 transition-colors">{ev.title}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{ev.startTime} &ndash; {ev.endTime} &middot; {ev.location}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === "resources" && (
              <div className="space-y-5">
                <div className="bg-white rounded-none border border-cream-300 p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-primary-800 text-base mb-1 flex items-center gap-2">
                    <FileText size={16} className="text-secondary-500" /> Helpful Resources
                  </h2>
                  <p className="text-xs text-neutral-500 mb-5">Guides and templates curated for clubs like yours.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {RESOURCE_LINKS.map(r => (
                      <Link key={r.href} href={r.href}
                        className="flex items-center gap-3 p-3 rounded-none border border-cream-200 hover:border-primary-300 hover:bg-cream-50 transition-all group">
                        <div className="w-8 h-8 rounded-none bg-primary-100 flex items-center justify-center shrink-0">
                          <BookOpen size={14} className="text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-primary-800 group-hover:text-primary-600 transition-colors leading-snug">{r.label}</p>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${TYPE_PILL[r.type]}`}>{r.type}</span>
                        </div>
                        <ArrowRight size={12} className="text-neutral-300 group-hover:text-primary-400 transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-cream-200">
                    <Link href="/resources" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline">
                      Browse all resources <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR (1/3) ── */}
          <aside className="space-y-5 md:max-h-[620px] md:overflow-y-auto pr-1">
            {/* Quick Info */}
            <div className="bg-white rounded-none border border-cream-300 p-5 shadow-sm">
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

            {/* Tags */}
            {chapter.tags && chapter.tags.length > 0 && (
              <div className="bg-white rounded-none border border-cream-300 p-5 shadow-sm">
                <h3 className="font-heading font-bold text-primary-800 text-sm mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {chapter.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[10px] font-semibold rounded-full border border-primary-100">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            {chapter.contactEmail && (
              <div className="bg-white rounded-none border border-cream-300 p-5 shadow-sm">
                <h3 className="font-heading font-bold text-primary-800 text-sm mb-3">Contact</h3>
                <a href={`mailto:${chapter.contactEmail}`} className="text-xs text-primary-600 hover:underline flex items-center gap-1.5">
                  <Mail size={12} /> {chapter.contactEmail}
                </a>
              </div>
            )}

            {/* Portal CTA */}
            <div className="bg-primary-900 rounded-none p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-300 mb-2">Want to manage a club?</p>
              <p className="text-xs text-primary-200 leading-relaxed mb-4">Use the Portal to create events, manage members, and track your club&apos;s progress.</p>
              <Link href="/portal" className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold transition-colors">
                Go to Portal
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── PREV / NEXT NAVIGATION ────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="border-t border-cream-400 pt-6 flex items-center justify-between gap-4">
          {prevClub ? (
            <Link href={`/directory/${prevClub.id}`}
              className="flex items-center gap-3 bg-white rounded-none border border-cream-300 px-5 py-3 hover:border-primary-300 hover:shadow-sm transition-all group">
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
              className="flex items-center gap-3 bg-white rounded-none border border-cream-300 px-5 py-3 hover:border-primary-300 hover:shadow-sm transition-all group text-right">
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