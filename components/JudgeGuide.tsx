"use client";

import { useEffect, useState } from "react";
import { BookMarked, ArrowRight, X } from "lucide-react";
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
        Welcome to <strong className="text-white">ClubConnect</strong> &mdash; a full-stack school club hub built with <strong className="text-white">Next.js 16</strong>, <strong className="text-white">Supabase</strong> (PostgreSQL + Auth), and <strong className="text-white">Stripe</strong> payments. See our References page for the complete documentation.
       </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
       {/* Data note */}
       <div className="border border-primary-200 bg-primary-50/60 p-4">
        <h4 className="font-bold text-sm text-primary-800 mb-2">Main Features</h4>
        <ul className="space-y-1.5 text-[11px] text-neutral-700 leading-relaxed">
         <li className="flex items-start gap-1.5"><span className="text-emerald-600 mt-0.5 shrink-0">&bull;</span><span><strong>Supabase Auth &amp; Database</strong> &mdash; Login/signup, user profiles, organizations, memberships, events, and community content stored in PostgreSQL with Row-Level Security</span></li>
         <li className="flex items-start gap-1.5"><span className="text-purple-600 mt-0.5 shrink-0">&bull;</span><span><strong>Stripe Payments</strong> &mdash; Secure donation checkout sessions for club fundraising with progress tracking</span></li>
         <li className="flex items-start gap-1.5"><span className="text-blue-600 mt-0.5 shrink-0">&bull;</span><span><strong>Club Creation &amp; Management</strong> &mdash; 5-step wizard, new clubs appear on the directory instantly, founders can inline-edit info and add events (saved to DB)</span></li>
         <li className="flex items-start gap-1.5"><span className="text-orange-600 mt-0.5 shrink-0">&bull;</span><span><strong>56+ Pages</strong> &mdash; Directory, Resources, Events Calendar, Community Hub, Mentors, Analytics, Start a Club, Video Calls, and more</span></li>
         <li className="flex items-start gap-1.5"><span className="text-cyan-600 mt-0.5 shrink-0">&bull;</span><span><strong>Interactive Maps</strong> &mdash; MapLibre GL 3D map with multi-school markers in the Club Directory</span></li>
         <li className="flex items-start gap-1.5"><span className="text-secondary-600 mt-0.5 shrink-0">&bull;</span><span><strong>AI Chat Agents</strong> &mdash; Gemini 2.0 Flash-powered assistants for resource discovery and navigation</span></li>
        </ul>
       </div>

       {/* What you'll find */}
       <div>
        <h4 className="font-bold text-sm text-primary-800 mb-2">Tech Stack</h4>
        <div className="grid grid-cols-2 gap-2">
         {[{ name: 'Next.js 16', color: 'bg-black' }, { name: 'Supabase', color: 'bg-emerald-600' }, { name: 'Stripe', color: 'bg-purple-600' }, { name: 'Tailwind CSS', color: 'bg-cyan-600' }, { name: 'TypeScript', color: 'bg-blue-600' }, { name: 'MapLibre GL', color: 'bg-orange-600' }].map(t => (
          <div key={t.name} className="flex items-center gap-2 text-[11px] text-neutral-700"><span className={`w-2 h-2 shrink-0 ${t.color}`} />{t.name}</div>
         ))}
        </div>
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
