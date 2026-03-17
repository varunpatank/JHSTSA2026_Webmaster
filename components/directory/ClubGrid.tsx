"use client";

import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { Chapter } from "@/types";
import { formatChapterLocation } from "@/lib/location";

interface Props {
  clubs: Chapter[];
}

export default function ClubGrid({ clubs }: Props) {
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
      {clubs.map((ch) => (
        <Link
          key={ch.id}
          href={`/directory/${ch.id}`}
          className="bg-white border border-neutral-200 p-4 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
        >
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
      ))}
    </div>
  );
}
