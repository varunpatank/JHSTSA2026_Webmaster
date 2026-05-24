"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { chapters as staticChapters, quizQuestions } from "@/lib/data";
import { getCreatedChapters, removeCreatedChapter } from "@/lib/clientState";
import { organizationsApi } from "@/lib/api";
import type { Chapter } from "@/types";
import type { Organization } from "@/lib/apiTypes";
import { getLocationScopeKey } from "@/lib/location";
import { inferDay, matchesSize } from "@/lib/directoryConstants";
import DirectoryFilters, {
  type DirectoryFilterState,
} from "@/components/directory/DirectoryFilters";
import ClubGrid from "@/components/directory/ClubGrid";
import HeroSection from "@/components/HeroSection";
import {
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

const DirectoryLeafletMap = dynamic(
  () => import("@/components/DirectoryLeafletMap"),
  { ssr: false },
);

/* ── URL ↔ state helpers ── */

const FILTER_KEYS: (keyof DirectoryFilterState)[] = [
  "search",
  "meetingDay",
  "meetingTime",
  "category",
  "scopeFilter",
  "size",
  "status",
];

const DEFAULT_FILTERS: DirectoryFilterState = {
  search: "",
  meetingDay: "Any",
  meetingTime: "Any",
  category: "Any",
  scopeFilter: "Any",
  size: "Any",
  status: "Any",
};

function filtersFromParams(params: URLSearchParams): DirectoryFilterState {
  return {
    search: params.get("search") ?? DEFAULT_FILTERS.search,
    meetingDay: params.get("meetingDay") ?? DEFAULT_FILTERS.meetingDay,
    meetingTime: params.get("meetingTime") ?? DEFAULT_FILTERS.meetingTime,
    category: params.get("category") ?? DEFAULT_FILTERS.category,
    scopeFilter: params.get("scopeFilter") ?? DEFAULT_FILTERS.scopeFilter,
    size: params.get("size") ?? DEFAULT_FILTERS.size,
    status: params.get("status") ?? DEFAULT_FILTERS.status,
  };
}

function filtersToParams(filters: DirectoryFilterState): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    const def = DEFAULT_FILTERS[key];
    if (value && value !== def) {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function DirectoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [quizOpen, setQuizOpen] = useState(true);
  const highlightId = searchParams.get("highlight");
  const highlightRef = useRef<HTMLDivElement>(null);

  // Merge static chapters with user-created chapters and DB orgs
  const [chapterVersion, setChapterVersion] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dbChapters, setDbChapters] = useState<Chapter[]>([]);
  const [deletedOrgIds, setDeletedOrgIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load locally-tracked deleted org IDs so stale router-cache entries are hidden
    try {
      const raw = window.localStorage.getItem("cc_deleted_org_ids");
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        if (Array.isArray(parsed)) setDeletedOrgIds(new Set(parsed));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    setMounted(true);
    organizationsApi.getAll().then(({ data }) => {
      if (!data) return;
      const orgs = (data as Organization[]).map((org): Chapter => ({
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
        meetingLocation: { lat: 47.705, lng: -122.14, parentOrg: "Other Clubs", room: org.meeting_location || "" },
        membershipRequirements: org.membership_requirements || "",
        dues: org.dues || "",
        socialLinks: (org.social_links as Record<string, string>) || {},
        achievements: [],
        photoGallery: org.banner_url ? [org.banner_url] : [],
        memberCount: org.member_count || 0,
        foundedYear: org.founded_year || new Date().getFullYear(),
        isActive: org.is_active ?? true,
      }));
      setDbChapters(orgs);
    });
  }, []);
  const chapters = useMemo(() => {
    if (!mounted) return [...staticChapters];
    const created = getCreatedChapters();
    const staticIds = new Set(staticChapters.map((c) => c.id));
    const unique = created.filter((c) => !staticIds.has(c.id) && !deletedOrgIds.has(c.id));
    const allIds = new Set([...staticChapters.map(c => c.id), ...unique.map(c => c.id)]);
    const fromDb = dbChapters.filter((c) => !allIds.has(c.id) && !deletedOrgIds.has(c.id));
    return [...unique, ...fromDb, ...staticChapters];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterVersion, mounted, dbChapters, deletedOrgIds]);

  const handleDeleteClub = useCallback((id: string) => {
    removeCreatedChapter(id);
    try {
      const raw = window.localStorage.getItem("cc_deleted_org_ids");
      const existing: string[] = raw ? JSON.parse(raw) : [];
      if (!existing.includes(id)) {
        window.localStorage.setItem("cc_deleted_org_ids", JSON.stringify([...existing, id]));
      }
    } catch { /* ignore */ }
    setChapterVersion((v) => v + 1);
    setDeletedOrgIds((prev) => new Set([...prev, id]));
  }, []);

  // Scroll to highlighted club after render
  useEffect(() => {
    if (highlightId && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 600);
    }
  }, [highlightId]);

  const interestToCategory: Record<string, string> = {
    "Academic competitions": "Academic",
    "Creative arts": "Arts",
    "Community service": "Service",
    "Technology & Engineering": "STEM",
    "Sports & Recreation": "Sports",
  };

  const quizRecommendations = useMemo(() => {
    if (!quizDone || quizAnswers.length === 0) return [];
    const preferredCategory = interestToCategory[quizAnswers[0]] || "";
    const preferredFrequency = quizAnswers[1] || "";
    const preferredTime = quizAnswers[2] || "";
    return chapters
      .map((c) => {
        let score = 0;
        if (c.category === preferredCategory) score += 3;
        if (c.meetingFrequency === preferredFrequency) score += 2;
        if (c.meetingTime.toLowerCase() === preferredTime.toLowerCase())
          score += 1;
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [quizDone, quizAnswers, chapters]);

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (quizStep + 1 >= quizQuestions.length) {
      setQuizDone(true);
    } else {
      setQuizStep(quizStep + 1);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizDone(false);
  };

  const filters = useMemo(
    () => filtersFromParams(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (
      next:
        | DirectoryFilterState
        | ((prev: DirectoryFilterState) => DirectoryFilterState),
    ) => {
      const resolved = typeof next === "function" ? next(filters) : next;
      router.replace(`/directory${filtersToParams(resolved)}`, {
        scroll: false,
      });
    },
    [filters, router],
  );

  const filtered = useMemo(() => {
    return chapters.filter((chapter) => {
      const query = filters.search.trim().toLowerCase();
      if (query) {
        const fields = [
          chapter.name,
          chapter.description,
          chapter.category,
          chapter.meetingLocation.parentOrg,
          chapter.meetingLocation.room,
          chapter.meetingLocation.internalLocation,
        ]
          .join(" ")
          .toLowerCase();
        if (!fields.includes(query)) return false;
      }
      if (
        filters.meetingDay !== "Any" &&
        inferDay(chapter.meetingSchedule) !== filters.meetingDay
      )
        return false;
      if (
        filters.meetingTime !== "Any" &&
        chapter.meetingTime !== filters.meetingTime
      )
        return false;
      if (filters.category !== "Any" && chapter.category !== filters.category)
        return false;
      if (
        filters.scopeFilter !== "Any" &&
        getLocationScopeKey(chapter.meetingLocation) !== filters.scopeFilter
      )
        return false;
      if (!matchesSize(chapter.memberCount, filters.size)) return false;
      if (
        filters.status !== "Any" &&
        chapter.meetingFrequency !== filters.status
      )
        return false;
      return true;
    });
  }, [filters, chapters]);

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-cream-200 min-h-screen">
        <HeroSection
        eyebrow="Discover · Filter · Engage"
        title="Club"
        highlightWord="Directory"
        description={<>Browse <strong className="text-secondary-700 font-bold">active clubs</strong> across STEM, arts, service, leadership, cultural, and more. Filter by interest area, meeting schedule, or open enrollment status, then <strong className="text-primary-700 font-semibold">connect directly with club officers</strong> to join your community.</>}
        texture="diagonal"
        images={[
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=75",
        ]}
        actions={
          <Link href="/portal" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-bold transition-colors">
            <ArrowRight size={15} /> Create a Club
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Map + Filters Island ── */}
        <section className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="bg-white border border-neutral-200 rounded-none p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-heading font-bold text-primary-900">
                Interactive Map
              </h2>
              <span className="text-sm font-medium text-primary-800">
                {filtered.length} clubs shown
              </span>
            </div>
            <div className="relative rounded-none overflow-hidden">
              <DirectoryLeafletMap
                chapters={filtered}
                activeRoom={filters.scopeFilter}
                onSelectRoom={(room: string) =>
                  setFilters((f) => ({ ...f, scopeFilter: room }))
                }
              />
              <DirectoryFilters
                filters={filters}
                onFilterChange={setFilters}
                resultCount={filtered.length}
                totalCount={chapters.length}
              />
            </div>
          </div>
        </section>

        <section
          className="animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-heading font-bold text-primary-900">
                All Clubs
              </h2>
              <span className="text-sm text-primary-800">
                {filtered.length} of {chapters.length} clubs
              </span>
            </div>
          </div>

          <div className="relative">
            {/* Floating sidebar toggle */}
            <button
              type="button"
              aria-expanded={sidebarOpen}
              aria-controls="directory-sidebar"
              onClick={() => setSidebarOpen((o) => !o)}
              className={`hidden lg:flex absolute top-5 z-10 items-center justify-center w-7 h-14 text-white shadow-lg transition-all duration-300 group ${
                sidebarOpen
                  ? "-left-3.5 bg-primary-900 hover:bg-primary-900"
                  : "left-0 bg-secondary-500 hover:bg-secondary-600"
              }`}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              className={`grid gap-5 transition-all duration-300 ${
                sidebarOpen
                  ? "lg:grid-cols-[340px_1fr]"
                  : "lg:grid-cols-1 lg:pl-9"
              }`}
            >
              {sidebarOpen && (
                <aside
                  id="directory-sidebar"
                  className="border border-primary-200 bg-white shadow-sm overflow-hidden rounded-none max-h-[820px] flex flex-col"
                >
                  {/* Sidebar header */}
                  <div className="bg-primary-900 px-4 py-3.5 flex items-center justify-between gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                    <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                      Club List Tools
                    </h3>
                    <span className="text-[10px] font-semibold text-primary-200 uppercase tracking-widest">Refine</span>
                  </div>

                  <div className="p-3.5 flex flex-col gap-3.5 overflow-hidden flex-1 bg-gradient-to-b from-white to-cream-50">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: chapters.length, label: "Total Clubs" },
                        { value: filtered.length, label: "Showing" },
                        {
                          value: new Set(chapters.map((c) => c.category)).size,
                          label: "Categories",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-white border border-neutral-200 px-2 py-1.5 text-center"
                        >
                          <p className="text-lg font-bold text-primary-900 leading-none">
                            {stat.value}
                          </p>
                          <p className="text-[10px] text-primary-700 mt-1 uppercase tracking-wide font-medium">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Club Finder Quiz */}
                    <div className="bg-white border border-neutral-200 overflow-hidden">
                      <button
                        onClick={() => setQuizOpen((o) => !o)}
                        className="w-full bg-primary-900 text-white px-3.5 py-2.5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <HelpCircle size={14} />
                          <h3 className="text-xs font-heading font-bold uppercase tracking-wider">
                            Club Finder Quiz
                          </h3>
                        </div>
                        {quizOpen ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                      {quizOpen && (
                        <div className="p-3.5">
                          {!quizDone ? (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] text-primary-700">
                                  Q{quizStep + 1}/{quizQuestions.length}
                                </p>
                                <div className="flex gap-0.5">
                                  {quizQuestions.map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-1 w-5 ${i <= quizStep ? "bg-primary-500" : "bg-neutral-200"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm font-bold text-primary-800 mb-3">
                                {quizQuestions[quizStep].question}
                              </p>
                              <div className="space-y-1.5">
                                {quizQuestions[quizStep].options.map(
                                  (option) => (
                                    <button
                                      key={option}
                                      onClick={() => handleQuizAnswer(option)}
                                      className="w-full text-left px-3 py-2 border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-xs font-medium"
                                    >
                                      {option}
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <Sparkles
                                  size={14}
                                  className="text-secondary-500"
                                />
                                <p className="text-xs font-bold text-primary-800">
                                  Your Matches
                                </p>
                              </div>
                              <div className="space-y-1.5">
                                {quizRecommendations.map((club, i) => (
                                  <Link
                                    key={club.id}
                                    href={`/directory/${club.id}`}
                                    className="flex items-center gap-2.5 p-2 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/40 transition-all"
                                  >
                                    <div className="w-6 h-6 bg-primary-100 text-primary-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                                      {i + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-xs text-primary-900 truncate">
                                        {club.name}
                                      </p>
                                      <p className="text-[10px] text-primary-700">
                                        {club.category} · {club.memberCount}{" "}
                                        members
                                      </p>
                                    </div>
                                    <ArrowRight
                                      size={12}
                                      className="text-neutral-400 shrink-0"
                                    />
                                  </Link>
                                ))}
                              </div>
                              <button
                                onClick={resetQuiz}
                                className="mt-2 w-full text-center text-[10px] text-primary-900 font-semibold hover:text-primary-800"
                              >
                                Retake Quiz
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Most Popular Clubs — fills remaining space */}
                    <div className="bg-white border border-neutral-200 overflow-hidden flex-1 flex flex-col min-h-0">
                      <div className="bg-secondary-500/10 border-b border-neutral-200 px-3.5 py-2.5 flex items-center gap-2">
                        <Sparkles size={13} className="text-secondary-600" />
                        <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-primary-900">Most Popular</h3>
                      </div>
                      <div className="divide-y divide-neutral-100 overflow-y-auto flex-1">
                        {[...chapters]
                          .sort((a, b) => b.memberCount - a.memberCount)
                          .slice(0, 12)
                          .map((club, i) => (
                            <Link
                              key={club.id}
                              href={`/directory/${club.id}`}
                              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-primary-50/50 transition-colors group"
                            >
                              <span className="text-[10px] font-bold text-neutral-400 w-4 shrink-0">{i + 1}</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-primary-900 truncate group-hover:text-primary-700">{club.name}</p>
                                <p className="text-[10px] text-neutral-400">{club.memberCount} members · {club.category}</p>
                              </div>
                              <ArrowRight size={11} className="text-neutral-300 group-hover:text-primary-400 shrink-0" />
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </aside>
              )}

              <div className="overflow-y-auto overflow-x-auto max-h-[820px] pr-1 pt-1 pl-1 -ml-1 rounded-none">
                <ClubGrid
                  clubs={filtered}
                  highlightId={highlightId}
                  highlightRef={highlightRef}
                  onDeleteClub={handleDeleteClub}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense>
      <DirectoryPageContent />
    </Suspense>
  );
}

