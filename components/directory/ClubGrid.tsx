"use client";

import type { CSSProperties, RefObject } from "react";
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

const highlightParticleColors = [
  "#1e3a5f",
  "#b8860b",
  "#8b0000",
  "#22c55e",
  "#a855f7",
  "#f97316",
  "#06b6d4",
  "#ec4899",
] as const;
const highlightParticles = [
  {
    left: "4%",
    top: "-6%",
    width: 6,
    height: 7,
    radius: "50%",
    duration: "1.6s",
    delay: "0s",
    rotate: 430,
  },
  {
    left: "8%",
    top: "-11%",
    width: 9,
    height: 12,
    radius: "2px",
    duration: "2.1s",
    delay: "0.15s",
    rotate: 590,
  },
  {
    left: "12%",
    top: "-8%",
    width: 7,
    height: 8,
    radius: "50%",
    duration: "1.9s",
    delay: "0.22s",
    rotate: 470,
  },
  {
    left: "16%",
    top: "-13%",
    width: 10,
    height: 9,
    radius: "2px",
    duration: "2.4s",
    delay: "0.35s",
    rotate: 640,
  },
  {
    left: "19%",
    top: "-7%",
    width: 5,
    height: 10,
    radius: "50%",
    duration: "1.8s",
    delay: "0.08s",
    rotate: 520,
  },
  {
    left: "23%",
    top: "-12%",
    width: 8,
    height: 6,
    radius: "2px",
    duration: "2s",
    delay: "0.28s",
    rotate: 405,
  },
  {
    left: "27%",
    top: "-9%",
    width: 11,
    height: 12,
    radius: "50%",
    duration: "2.3s",
    delay: "0.42s",
    rotate: 700,
  },
  {
    left: "31%",
    top: "-14%",
    width: 6,
    height: 9,
    radius: "2px",
    duration: "1.7s",
    delay: "0.12s",
    rotate: 455,
  },
  {
    left: "35%",
    top: "-10%",
    width: 9,
    height: 7,
    radius: "50%",
    duration: "2.2s",
    delay: "0.5s",
    rotate: 615,
  },
  {
    left: "39%",
    top: "-6%",
    width: 7,
    height: 11,
    radius: "2px",
    duration: "1.9s",
    delay: "0.18s",
    rotate: 490,
  },
  {
    left: "42%",
    top: "-12%",
    width: 10,
    height: 10,
    radius: "50%",
    duration: "2.5s",
    delay: "0.6s",
    rotate: 680,
  },
  {
    left: "46%",
    top: "-8%",
    width: 6,
    height: 8,
    radius: "2px",
    duration: "1.6s",
    delay: "0.25s",
    rotate: 440,
  },
  {
    left: "50%",
    top: "-13%",
    width: 12,
    height: 9,
    radius: "50%",
    duration: "2.1s",
    delay: "0.45s",
    rotate: 560,
  },
  {
    left: "54%",
    top: "-7%",
    width: 8,
    height: 12,
    radius: "2px",
    duration: "2.4s",
    delay: "0.68s",
    rotate: 725,
  },
  {
    left: "58%",
    top: "-11%",
    width: 7,
    height: 7,
    radius: "50%",
    duration: "1.8s",
    delay: "0.1s",
    rotate: 410,
  },
  {
    left: "61%",
    top: "-9%",
    width: 10,
    height: 11,
    radius: "2px",
    duration: "2.2s",
    delay: "0.33s",
    rotate: 605,
  },
  {
    left: "65%",
    top: "-14%",
    width: 6,
    height: 9,
    radius: "50%",
    duration: "2s",
    delay: "0.52s",
    rotate: 530,
  },
  {
    left: "69%",
    top: "-8%",
    width: 9,
    height: 6,
    radius: "2px",
    duration: "1.7s",
    delay: "0.14s",
    rotate: 445,
  },
  {
    left: "73%",
    top: "-12%",
    width: 11,
    height: 10,
    radius: "50%",
    duration: "2.3s",
    delay: "0.4s",
    rotate: 650,
  },
  {
    left: "77%",
    top: "-7%",
    width: 5,
    height: 8,
    radius: "2px",
    duration: "1.9s",
    delay: "0.24s",
    rotate: 500,
  },
  {
    left: "81%",
    top: "-13%",
    width: 8,
    height: 12,
    radius: "50%",
    duration: "2.5s",
    delay: "0.58s",
    rotate: 710,
  },
  {
    left: "85%",
    top: "-9%",
    width: 10,
    height: 7,
    radius: "2px",
    duration: "1.8s",
    delay: "0.3s",
    rotate: 480,
  },
  {
    left: "89%",
    top: "-12%",
    width: 6,
    height: 10,
    radius: "50%",
    duration: "2.1s",
    delay: "0.49s",
    rotate: 575,
  },
  {
    left: "93%",
    top: "-8%",
    width: 9,
    height: 9,
    radius: "2px",
    duration: "2.4s",
    delay: "0.7s",
    rotate: 735,
  },
  {
    left: "97%",
    top: "-11%",
    width: 7,
    height: 8,
    radius: "50%",
    duration: "1.7s",
    delay: "0.2s",
    rotate: 455,
  },
  {
    left: "6%",
    top: "-15%",
    width: 11,
    height: 11,
    radius: "2px",
    duration: "2.3s",
    delay: "0.74s",
    rotate: 620,
  },
  {
    left: "14%",
    top: "-5%",
    width: 6,
    height: 7,
    radius: "50%",
    duration: "1.6s",
    delay: "0.05s",
    rotate: 400,
  },
  {
    left: "22%",
    top: "-10%",
    width: 8,
    height: 10,
    radius: "2px",
    duration: "2.1s",
    delay: "0.27s",
    rotate: 550,
  },
  {
    left: "29%",
    top: "-6%",
    width: 10,
    height: 8,
    radius: "50%",
    duration: "1.9s",
    delay: "0.36s",
    rotate: 465,
  },
  {
    left: "37%",
    top: "-15%",
    width: 7,
    height: 12,
    radius: "2px",
    duration: "2.5s",
    delay: "0.64s",
    rotate: 695,
  },
  {
    left: "45%",
    top: "-5%",
    width: 9,
    height: 7,
    radius: "50%",
    duration: "1.8s",
    delay: "0.16s",
    rotate: 435,
  },
  {
    left: "52%",
    top: "-14%",
    width: 5,
    height: 9,
    radius: "2px",
    duration: "2.2s",
    delay: "0.47s",
    rotate: 585,
  },
  {
    left: "60%",
    top: "-6%",
    width: 11,
    height: 10,
    radius: "50%",
    duration: "2s",
    delay: "0.29s",
    rotate: 515,
  },
  {
    left: "68%",
    top: "-15%",
    width: 6,
    height: 8,
    radius: "2px",
    duration: "1.7s",
    delay: "0.11s",
    rotate: 420,
  },
  {
    left: "75%",
    top: "-5%",
    width: 8,
    height: 11,
    radius: "50%",
    duration: "2.4s",
    delay: "0.54s",
    rotate: 665,
  },
  {
    left: "83%",
    top: "-14%",
    width: 10,
    height: 6,
    radius: "2px",
    duration: "1.9s",
    delay: "0.31s",
    rotate: 475,
  },
  {
    left: "91%",
    top: "-6%",
    width: 7,
    height: 9,
    radius: "50%",
    duration: "2.1s",
    delay: "0.43s",
    rotate: 545,
  },
  {
    left: "10%",
    top: "-16%",
    width: 9,
    height: 12,
    radius: "2px",
    duration: "2.5s",
    delay: "0.78s",
    rotate: 720,
  },
  {
    left: "57%",
    top: "-16%",
    width: 6,
    height: 7,
    radius: "50%",
    duration: "1.8s",
    delay: "0.21s",
    rotate: 450,
  },
  {
    left: "88%",
    top: "-16%",
    width: 11,
    height: 9,
    radius: "2px",
    duration: "2.3s",
    delay: "0.59s",
    rotate: 635,
  },
] as const;

export default function ClubGrid({
  clubs,
  highlightId,
  highlightRef,
  onDeleteClub,
}: Props) {
  const createdIds = new Set(getCreatedChapters().map((c) => c.id));
  if (clubs.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center">
        <p className="font-bold text-primary-700">
          No clubs match your filters
        </p>
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
          <div
            key={ch.id}
            ref={isHighlighted ? highlightRef : undefined}
            className="relative"
          >
            {isHighlighted && (
              <>
                {highlightParticles.map((particle, i) => (
                  <div
                    key={i}
                    className="absolute pointer-events-none z-20"
                    style={
                      {
                        left: particle.left,
                        top: particle.top,
                        width: `${particle.width}px`,
                        height: `${particle.height}px`,
                        background:
                          highlightParticleColors[
                            i % highlightParticleColors.length
                          ],
                        borderRadius: particle.radius,
                        animation: `confetti-burst ${particle.duration} ease-out ${particle.delay} forwards`,
                        transform: `rotate(${particle.rotate - 360}deg)`,
                        "--confetti-end-rotate": `${particle.rotate}deg`,
                        opacity: 0,
                      } as CSSProperties
                    }
                  />
                ))}
                <style>{`
                  @keyframes confetti-burst {
                    0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
                    100% { opacity: 0; transform: translateY(120px) rotate(var(--confetti-end-rotate)) scale(0.3); }
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
                  {ch.membershipStatus === "Open Enrollment"
                    ? "Join Now"
                    : "Apply First"}
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
                  <MapPin size={12} />{" "}
                  {formatChapterLocation(ch.meetingLocation)}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">
                  {ch.membershipStatus === "Open Enrollment"
                    ? "Engage now"
                    : "Engage by applying"}
                </span>
                <span className="font-semibold text-primary-600">
                  View details &amp; join
                </span>
              </div>
            </Link>
            {createdIds.has(ch.id) && onDeleteClub && (
              <button
                onClick={() => {
                  if (confirm(`Delete "${ch.name}" from the directory?`))
                    onDeleteClub(ch.id);
                }}
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
