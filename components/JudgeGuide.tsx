"use client";

import { useEffect, useState } from "react";
import { BookMarked, Database, Layout, ArrowRight, X } from "lucide-react";
import Link from "next/link";

export default function JudgeGuide() {
 const [expanded, setExpanded] = useState(false);

 useEffect(() => {
  if (typeof document === "undefined") return;

  const autoOpenCookie = document.cookie
   .split("; ")
   .find((row) => row.startsWith("judge-guide-opened="));

  if (!autoOpenCookie) {
   const t = setTimeout(() => setExpanded(true), 800);
   document.cookie = "judge-guide-opened=1; Max-Age=1800; Path=/; SameSite=Lax";
   return () => clearTimeout(t);
  }
 }, []);

 useEffect(() => {
  if (typeof window === "undefined") return;

  const handleOpenFromHeader = () => setExpanded(true);
  window.addEventListener("open-judge-guide", handleOpenFromHeader);

  return () => window.removeEventListener("open-judge-guide", handleOpenFromHeader);
 }, []);

 return (
  <>
   {/* Expanded panel */}
   {expanded && (
    <>
     <div className="fixed inset-0 z-[55] bg-black/20" onClick={() => setExpanded(false)} />
     <div className="fixed top-0 right-0 z-[60] h-full w-[22rem] max-w-[90vw] bg-white border-l-4 border-secondary-500 shadow-2xl flex flex-col animate-slide-in-right">
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-5 py-5 shrink-0">
       <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2"><BookMarked size={18} /> References</h3>
        <button onClick={() => setExpanded(false)} className="p-1.5 hover:bg-white/20 transition-colors"><X size={18} /></button>
       </div>
       <p className="text-[11px] text-primary-200 mt-1 leading-relaxed">
        Welcome to <strong className="text-white">ClubConnect</strong>! Our full references, citations, work log, and technical documentation are on the References page.
       </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
       {/* Data note */}
       <div className="border border-primary-200 bg-primary-50/60 p-4">
        <h4 className="font-bold text-sm text-primary-800 mb-2">How This App Works</h4>
        <div className="space-y-2.5">
         <div className="flex items-start gap-2.5">
          <Database size={14} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
           <p className="text-xs font-semibold text-emerald-700">Database-Backed (Supabase)</p>
           <p className="text-[11px] text-neutral-600 leading-relaxed">Login/signup, user profiles, club creation (appears on Discover), club management (edit/delete), chat messages, events, resource uploads, donations, discussions, proposals, notifications, and all community content are stored in a PostgreSQL database with Row-Level Security.</p>
          </div>
         </div>
         <div className="flex items-start gap-2.5">
          <Layout size={14} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
           <p className="text-xs font-semibold text-blue-700">localStorage Persistence</p>
           <p className="text-[11px] text-neutral-600 leading-relaxed">Community feed posts/likes, chat sidebar, dashboard saved items/events/notifications, quiz results, tutorial progress, collection management, resource request votes, goals, and club management drafts persist via localStorage across refreshes.</p>
          </div>
         </div>
         <div className="flex items-start gap-2.5">
          <Layout size={14} className="text-violet-600 mt-0.5 shrink-0" />
          <div>
           <p className="text-xs font-semibold text-violet-700">Hardcoded UI Demonstration</p>
           <p className="text-[11px] text-neutral-600 leading-relaxed">The preset club directory, homepage stats, calendar events, achievements list, competitions, rubrics, and guides use hardcoded data to showcase the full interface.</p>
          </div>
         </div>
        </div>
       </div>

       {/* What you'll find */}
       <div>
        <h4 className="font-bold text-sm text-primary-800 mb-2">On the References Page</h4>
        <ul className="space-y-1.5 text-xs text-neutral-700">
         {["Work Log (PDF)", "Copyright Checklist (PDF)", "Framework & Code Stack", "Data Architecture", "Feature Walkthrough", "TSA Webmaster Rubric", "Image Sources & Attributions", "Student Work Declaration"].map(item => (
          <li key={item} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary-500 shrink-0" />{item}</li>
         ))}
        </ul>
       </div>

       {/* CTA */}
       <Link href="/references" onClick={() => setExpanded(false)}
        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-sm transition-colors">
        Go to References <ArrowRight size={16} />
       </Link>
      </div>

      <div className="border-t border-neutral-200 px-5 py-3 shrink-0 bg-neutral-50">
       <p className="text-[10px] text-neutral-400 text-center">ClubConnect &mdash; JHSTSA Webmaster 2026</p>
      </div>
     </div>
    </>
   )}
  </>
 );
}
