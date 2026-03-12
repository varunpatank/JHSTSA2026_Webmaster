"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Chapter } from "@/types";
import { formatChapterLocation } from "@/lib/location";
import { CATEGORY_COLORS } from "@/lib/directoryConstants";

const PAGE_SIZE = 10;

interface ClubGridProps {
  clubs: Chapter[];
}

export default function ClubGrid({ clubs }: ClubGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when the filtered list changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [clubs]);

  if (clubs.length === 0) {
    return (
      <div className="text-center py-10 bg-white border border-neutral-200 rounded-xl">
        <p className="text-4xl mb-3">🔍</p>
        <h3 className="text-xl font-heading font-bold text-neutral-700 mb-2">
          No clubs found
        </h3>
        <p className="text-neutral-500">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  const visible = clubs.slice(0, visibleCount);
  const hasMore = visibleCount < clubs.length;

  return (
    <div>
      {/* Quiz Card */}
      <Link
        href="/directory/quiz"
        className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 border border-primary-800 p-5 md:p-6 rounded-xl hover:shadow-lg transition-shadow group mb-4 block"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="text-white flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🎯</span>
              <h2 className="text-2xl font-heading font-bold">
                Club Match Quiz
              </h2>
            </div>
            <p className="text-white/85 leading-relaxed">
              Not sure which club is right for you? Take our quick personality
              quiz to discover clubs that match your interests, goals, and
              schedule.
            </p>
            <p className="text-white/60 text-sm mt-2">
              5 questions · Takes about 1 minute
            </p>
          </div>
          <div className="text-white/60 group-hover:text-white transition-colors shrink-0 text-4xl">
            →
          </div>
        </div>
      </Link>

      <div className="grid md:grid-cols-3 gap-3">
        {visible.map((chapter, idx) => (
          <Link
            href={`/directory/${chapter.id}`}
            key={chapter.id}
            className="bg-white border border-neutral-200 p-4 hover:border-primary-400 transition-all group animate-fade-up rounded-xl"
            style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-heading font-bold text-primary-700 group-hover:text-primary-600 transition-colors">
                {chapter.name}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs font-semibold shrink-0 rounded-md ${CATEGORY_COLORS[chapter.category] || CATEGORY_COLORS.Other}`}
              >
                {chapter.category}
              </span>
            </div>
            <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
              {chapter.description}
            </p>
            <div className="text-sm text-neutral-500 space-y-1">
              <p>
                <span className="font-semibold text-neutral-700">
                  Schedule:
                </span>{" "}
                {chapter.meetingSchedule}
              </p>
              <p>
                <span className="font-semibold text-neutral-700">Where:</span>{" "}
                {formatChapterLocation(chapter.meetingLocation)}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                <span className="text-xs text-neutral-400">
                  {chapter.memberCount} members · {chapter.meetingFrequency}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    chapter.membershipStatus === "Open Enrollment"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {chapter.membershipStatus}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          className="btn-outline w-full mt-4 text-sm"
        >
          Show More ({clubs.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}
