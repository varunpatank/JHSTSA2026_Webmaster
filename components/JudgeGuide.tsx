"use client";

import { useEffect, useState } from "react";
import { BookMarked, Database, Layout, ArrowRight, X } from "lucide-react";
import Link from "next/link";

export default function JudgeGuide() {
 const [expanded, setExpanded] = useState(false);

 useEffect(() => {
  if (typeof window !== "undefined" && !sessionStorage.getItem("guide-seen")) {
   sessionStorage.setItem("guide-seen", "1");
   const t = setTimeout(() => setExpanded(true), 800);
   return () => clearTimeout(t);
  }
 }, []);

 return (
  <>
   {/* Floating side tab */}
   <button
    onClick={() => setExpanded(v => !v)}
    className="fixed top-1/4 right-0 z-50 bg-secondary-600 hover:bg-secondary-700 text-white shadow-lg flex flex-col items-center gap-0 text-xs font-bold transition-all hover:pr-1">
    <div className="px-2.5 py-3 flex items-center gap-2 border-b border-secondary-500/40" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
     <BookMarked size={15} className="rotate-90" />
     <span className="tracking-wide">REFERENCES</span>
    </div>
    <div className="px-2 py-2.5 flex flex-col items-center gap-1.5 text-[8px] leading-tight text-center text-white/90">
     <div className="flex items-center gap-0.5" title="Database-backed pages">
      <Database size={10} className="text-emerald-300" />
      <span className="text-emerald-200">DB</span>
     </div>
     <div className="w-3 border-t border-white/30" />
     <div className="flex items-center gap-0.5" title="UI-only hardcoded pages">
      <Layout size={10} className="text-blue-300" />
      <span className="text-blue-200">UI</span>
     </div>
     <p className="text-[7px] leading-[1.2] text-white/70 max-w-[3rem]">Some pages use DB, others hardcoded for UI</p>
    </div>
   </button>

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
           <p className="text-[11px] text-neutral-600 leading-relaxed">Auth &amp; profiles, community uploads &amp; likes, hub discussions, ideas, mentors, stories, collaboration posts, and Stripe donation sessions are stored in a real PostgreSQL database.</p>
          </div>
         </div>
         <div className="flex items-start gap-2.5">
          <Layout size={14} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
           <p className="text-xs font-semibold text-blue-700">Hardcoded for UI Demonstration</p>
           <p className="text-[11px] text-neutral-600 leading-relaxed">Club directory, resource library, events, homepage stats, achievements, competitions, calendar, and rubrics use hardcoded data to showcase full UI functionality.</p>
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