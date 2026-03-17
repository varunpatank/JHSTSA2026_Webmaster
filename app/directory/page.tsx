"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { chapters, quizQuestions } from "@/lib/data";
import { getLocationScopeKey } from "@/lib/location";
import { inferDay, matchesSize } from "@/lib/directoryConstants";
import DirectoryFilters, {
  type DirectoryFilterState,
} from "@/components/directory/DirectoryFilters";
import ClubGrid from "@/components/directory/ClubGrid";
import { HelpCircle, Sparkles, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

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
        if (c.meetingTime.toLowerCase() === preferredTime.toLowerCase()) score += 1;
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [quizDone, quizAnswers]);

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
        chapter.membershipStatus !== filters.status
      )
        return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* ── Hero Header ── */}
      <section className="bg-primary-600 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 animate-fade-up">
          <p className="text-xs sm:text-sm uppercase tracking-[0.12em] font-semibold text-primary-100">
            Discover &middot; Filter &middot; Connect
          </p>
          <h1 className="mt-2 text-2xl md:text-5xl font-heading font-bold">
            Organization Directory
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Map + Filters Island ── */}
        <section className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="bg-white border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-heading font-bold text-primary-700">
                Interactive Map
              </h2>
              <span className="text-sm font-medium text-neutral-500">
                {filtered.length} clubs shown
              </span>
            </div>
            <div className="relative">
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

        {/* ── Orgs Grid + AI Chat Row ── */}
        <section
          className="animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-heading font-bold text-primary-700">
                All Clubs
              </h2>
              <span className="text-sm text-neutral-500">
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
                  ? "-left-3.5 bg-primary-600 hover:bg-primary-700"
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
                  className="border border-primary-200 bg-gradient-to-b from-primary-50/60 to-white shadow-sm overflow-hidden"
                >
                  {/* Sidebar header */}
                  <div className="bg-primary-700 px-4 py-3 flex items-center gap-2.5">
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
                      Quick Tools
                    </h3>
                  </div>

                  <div className="p-3.5 space-y-3.5">
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
                          className="bg-white border border-neutral-200 px-2 py-2.5 text-center"
                        >
                          <p className="text-lg font-bold text-primary-600 leading-none">
                            {stat.value}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wide font-medium">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Club Finder Quiz */}
                    <div className="bg-white border border-neutral-200 overflow-hidden">
                      <button onClick={() => setQuizOpen(o => !o)}
                        className="w-full bg-primary-600 text-white px-3.5 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HelpCircle size={14} />
                          <h3 className="text-xs font-heading font-bold uppercase tracking-wider">Club Finder Quiz</h3>
                        </div>
                        {quizOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      {quizOpen && (
                        <div className="p-3.5">
                          {!quizDone ? (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] text-neutral-500">Q{quizStep + 1}/{quizQuestions.length}</p>
                                <div className="flex gap-0.5">
                                  {quizQuestions.map((_, i) => (
                                    <div key={i} className={`h-1 w-5 ${i <= quizStep ? "bg-primary-500" : "bg-neutral-200"}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm font-bold text-primary-800 mb-3">{quizQuestions[quizStep].question}</p>
                              <div className="space-y-1.5">
                                {quizQuestions[quizStep].options.map((option) => (
                                  <button key={option} onClick={() => handleQuizAnswer(option)}
                                    className="w-full text-left px-3 py-2 border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-xs font-medium">
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <Sparkles size={14} className="text-secondary-500" />
                                <p className="text-xs font-bold text-primary-800">Your Matches</p>
                              </div>
                              <div className="space-y-1.5">
                                {quizRecommendations.map((club, i) => (
                                  <Link key={club.id} href={`/directory/${club.id}`}
                                    className="flex items-center gap-2.5 p-2 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/40 transition-all">
                                    <div className="w-6 h-6 bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px] shrink-0">{i + 1}</div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-xs text-primary-700 truncate">{club.name}</p>
                                      <p className="text-[10px] text-neutral-500">{club.category} · {club.memberCount} members</p>
                                    </div>
                                    <ArrowRight size={12} className="text-neutral-400 shrink-0" />
                                  </Link>
                                ))}
                              </div>
                              <button onClick={resetQuiz} className="mt-2 w-full text-center text-[10px] text-primary-600 font-semibold hover:text-primary-700">
                                Retake Quiz
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Student Resources Quick Links */}
                    <div className="bg-white border border-neutral-200 p-3.5 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 text-secondary-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <h3 className="text-xs font-heading font-bold text-primary-700 uppercase tracking-wider">
                          Student Resources
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          {
                            icon: "\uD83C\uDF93",
                            label: "Alumni Network",
                            desc: "Connect with past members",
                            href: "/alumni",
                          },
                          {
                            icon: "\uD83D\uDCC5",
                            label: "Counselor Meetings",
                            desc: "Schedule advisor time",
                            href: "/meetings",
                          },
                          {
                            icon: "\uD83D\uDCDA",
                            label: "Resource Library",
                            desc: "Templates, guides & forms",
                            href: "/resources",
                          },
                          {
                            icon: "\uD83D\uDE80",
                            label: "Start a Club",
                            desc: "Proposal guide & forms",
                            href: "/start-a-club",
                          },
                        ].map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="group/link flex items-center gap-3 border border-neutral-100 bg-neutral-50/50 p-2.5 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                          >
                            <span className="text-lg leading-none group-hover/link:scale-110 transition-transform duration-200">
                              {item.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-primary-700 text-sm leading-tight group-hover/link:text-primary-600 transition-colors">
                                {item.label}
                              </p>
                              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 text-neutral-300 group-hover/link:text-primary-400 ml-auto shrink-0 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>
              )}

              <ClubGrid clubs={filtered} />
            </div>
          </div>
        </section>


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
