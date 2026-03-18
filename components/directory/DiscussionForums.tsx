"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, ThumbsUp } from "lucide-react";

const SEED_THREADS = [
  {
    id: 1,
    title: "Tips for TSA State Competition?",
    author: "Maria G.",
    club: "TSA",
    replies: 23,
    time: "2 hrs ago",
    hot: true,
  },
  {
    id: 2,
    title: "Best fundraising ideas for spring",
    author: "James L.",
    club: "FBLA",
    replies: 18,
    time: "5 hrs ago",
    hot: true,
  },
  {
    id: 3,
    title: "Balancing club leadership with academics",
    author: "Sophie K.",
    club: "NHS",
    replies: 31,
    time: "1 day ago",
    hot: false,
  },
  {
    id: 4,
    title: "Robotics competition strategies",
    author: "Alex J.",
    club: "Robotics",
    replies: 15,
    time: "1 day ago",
    hot: false,
  },
  {
    id: 5,
    title: "How to get more members in a new club?",
    author: "Priya K.",
    club: "Environmental",
    replies: 9,
    time: "2 days ago",
    hot: false,
  },
];

export default function DiscussionForums() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="border-b border-neutral-200 px-5 py-3 flex items-center justify-between">
        <h2 className="text-lg font-heading font-bold text-primary-700 flex items-center gap-2">
          <MessageSquare size={18} className="text-secondary-500" />
          Community Discussions
        </h2>
        <Link
          href="/hub/discussions"
          className="text-sm font-semibold text-primary-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-neutral-100">
        {SEED_THREADS.map((t) => (
          <Link
            key={t.id}
            href="/hub/discussions"
            className="flex items-center gap-3 px-5 py-3 hover:bg-primary-50/40 transition-colors"
          >
            <div className="bg-neutral-100 border border-neutral-200 px-2.5 py-1.5 text-center shrink-0 min-w-[48px] rounded-lg">
              <span className="text-sm font-bold text-primary-700">
                {t.replies}
              </span>
              <span className="block text-[8px] text-neutral-400 uppercase">
                replies
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                {t.hot && (
                  <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                    HOT
                  </span>
                )}
                <span className="text-[10px] font-semibold bg-primary-50 text-primary-600 px-1.5 py-0.5 border border-primary-200 rounded-full">
                  {t.club}
                </span>
              </div>
              <h4 className="font-semibold text-primary-800 text-sm truncate">
                {t.title}
              </h4>
              <p className="text-[10px] text-neutral-400">
                {t.author} · {t.time}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
