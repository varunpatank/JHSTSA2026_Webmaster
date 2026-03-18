"use client";

import { RefObject } from "react";
import Link from "next/link";
import { MapPin, Users, Trash2 } from "lucide-react";
import type { Chapter } from "@/types";
import { formatChapterLocation } from "@/lib/location";
import { getCreatedChapters } from "@/lib/clientState";

interface Props {
  clubs: Chapter[];
  highlightId?: string | null;
  highlightRef?: RefObject<HTMLDivElement | null>;
  onDeleteClub?: (id: string) => void;
}

export default function ClubGrid({ clubs, highlightId, highlightRef, onDeleteClub }: Props) {
  const createdIds = new Set(getCreatedChapters().map(c => c.id));
  if (clubs.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center">
        <p className="font-bold text-primary-700">No clubs match your filters</p>
        <p className="text-sm text-neutral-500 mt-1">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {clubs.map((ch) => {
        const isHighlighted = highlightId === ch.id;
        return (
          <div key={ch.id} ref={isHighlighted ? highlightRef : undefined} className="relative">
            {isHighlighted && (
              <>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute pointer-events-none z-20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-${Math.random() * 10 + 5}%`,
                      width: `${Math.random() * 8 + 4}px`,
                      height: `${Math.random() * 10 + 4}px`,
                      background: ['#1e3a5f', '#b8860b', '#8b0000', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#ec4899'][i % 8],
                      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                      animation: `confetti-burst ${Math.random() * 1.5 + 1.5}s ease-out ${Math.random() * 0.8}s forwards`,
                      opacity: 0,
                    }}
                  />
                ))}
                <style>{`
                  @keyframes confetti-burst {
                    0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
                    100% { opacity: 0; transform: translateY(120px) rotate(${360 + Math.random() * 360}deg) scale(0.3); }
                  }
                `}</style>
              </>
            )}
            <Link
              href={`/directory/${ch.id}`}
              className={`flex flex-col bg-white border p-4 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group min-h-[180px] ${
                isHighlighted
                  ? "border-secondary-400 ring-2 ring-secondary-300 shadow-lg animate-pulse"
                  : "border-neutral-200"
              }`}
            >
              {isHighlighted && (
                <div className="mb-2 text-center">
                  <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-bold border border-secondary-300 animate-bounce">
                    🎉 Your New Club!
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-primary-200 bg-primary-50 text-primary-700">
                  {ch.category}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    ch.membershipStatus === "Open Enrollment"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {ch.membershipStatus === "Open Enrollment" ? "Open" : "Apply"}
                </span>
              </div>
              <h3 className="font-heading font-bold text-primary-600 group-hover:text-primary-500 transition-colors">
                {ch.name}
              </h3>
              <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                {ch.description}
              </p>
              <div className="mt-3 space-y-1 text-xs text-neutral-500">
                <p className="flex items-center gap-1">
                  <Users size={12} /> {ch.memberCount} members &middot;{" "}
                  {ch.meetingFrequency}
                </p>
                <p className="flex items-center gap-1">
                  <MapPin size={12} /> {formatChapterLocation(ch.meetingLocation)}
                </p>
              </div>
            </Link>
            {createdIds.has(ch.id) && onDeleteClub && (
              <button
                onClick={() => { if (confirm(`Delete "${ch.name}" from the directory?`)) onDeleteClub(ch.id); }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors rounded"
                title="Delete your club"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
