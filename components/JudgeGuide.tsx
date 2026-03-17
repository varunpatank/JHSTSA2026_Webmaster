"use client";

import { useEffect, useState } from "react";
import { BookMarked, CheckCircle, ChevronDown, X } from "lucide-react";

function GuideAccordion({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
 const [open, setOpen] = useState(false);
 return (
  <div className="border-b border-neutral-100">
   <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-2.5 px-5 py-3 hover:bg-primary-50/50 transition-colors text-left">
    <span className="text-base">{icon}</span>
    <span className="flex-1 text-xs font-bold text-primary-800">{title}</span>
    <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
   </button>
   {open && <div className="px-5 pb-4 animate-fade-up">{children}</div>}
  </div>
 );
}

const GUIDE_SECTIONS: { id: string; icon: string; title: string; content: React.ReactNode }[] = [
 { id: "tech", icon: "\u{1F6E0}\uFE0F", title: "Tech Stack & Architecture", content: (
  <div className="space-y-2.5">
   <div className="flex items-start gap-2.5">
    <span className="mt-0.5 w-6 h-6 bg-black text-white flex items-center justify-center text-[9px] font-bold shrink-0">N</span>
    <div><p className="text-xs font-semibold text-primary-700">Next.js 16 + TypeScript</p><p className="text-[10px] text-neutral-500">App Router with server &amp; client components, Turbopack for fast dev builds, 56 routes across the application</p></div>
   </div>
   <div className="flex items-start gap-2.5">
    <span className="mt-0.5 w-6 h-6 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">S</span>
    <div><p className="text-xs font-semibold text-primary-700">Supabase</p><p className="text-[10px] text-neutral-500">Full auth system (login, signup, sessions), PostgreSQL database, row-level security policies, real-time subscriptions, file storage for avatars &amp; community uploads</p></div>
   </div>
   <div className="flex items-start gap-2.5">
    <span className="mt-0.5 w-6 h-6 bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">$</span>
    <div><p className="text-xs font-semibold text-primary-700">Stripe Payments</p><p className="text-[10px] text-neutral-500">Secure checkout sessions for club donations and fundraising, with progress tracking and test mode</p></div>
   </div>
   <div className="flex items-start gap-2.5">
    <span className="mt-0.5 w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">G</span>
    <div><p className="text-xs font-semibold text-primary-700">Gemini 2.0 Flash (AI)</p><p className="text-[10px] text-neutral-500">Embedded AI chat agents on multiple pages for resource discovery, Q&amp;A, and navigational help</p></div>
   </div>
   <div className="flex items-start gap-2.5">
    <span className="mt-0.5 w-6 h-6 bg-cyan-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">T</span>
    <div><p className="text-xs font-semibold text-primary-700">Tailwind CSS</p><p className="text-[10px] text-neutral-500">Custom school-themed design system with primary (navy), secondary (gold), and accent (maroon) palette</p></div>
   </div>
   <div className="flex items-start gap-2.5">
    <span className="mt-0.5 w-6 h-6 bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">L</span>
    <div><p className="text-xs font-semibold text-primary-700">Leaflet Maps</p><p className="text-[10px] text-neutral-500">Interactive map integration in the Club Directory for location-based discovery</p></div>
   </div>
  </div>
 )},
 { id: "homepage", icon: "\u{1F3E0}", title: "Homepage & Landing", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Hero banner with stats grid and call-to-action buttons</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Live counters for Active Clubs, Students Served, Upcoming Events, Service Hours</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Featured Clubs Carousel with ratings and member counts</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Quick Access grid linking to major sections (Directory, Resources, Start a Club, Mentors, Events)</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Announcements feed, upcoming events, and call-to-action section</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>References &amp; Citations section inside this Judge&rsquo;s Guide panel</span></li>
  </ul>
 )},
 { id: "directory", icon: "\u{1F50D}", title: "Club Discovery & Directory", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Searchable directory of 30+ clubs with real-time filtering</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Filter by day, time, category, grade level, and meeting schedule</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Interactive Leaflet map showing club meeting locations</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Grid view with category badges and status indicators</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Individual club profile pages with Overview, Statistics, Events, Projects, History, Notes, and Discussion tabs</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Join Club button with auth check, Video Call / Meeting link, Donate button, Share link</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>AI-powered Club Finder chatbot and community discussion forums</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Explore page with AI-powered club recommendations and a quiz-based discovery tool</span></li>
  </ul>
 )},
 { id: "resources", icon: "\u{1F4DA}", title: "Resource Library & Guides", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>20+ downloadable resources organized in a 5-stage rocket launch system (Pre-Launch, Ignition, Liftoff, Orbit, Deep Space)</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>PDF preview with embedded viewer before download</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Search and filter resources by category or keyword</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Guides index page with categorized how-to articles, reading time, and section counts</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>External resources page linking to leadership courses (Harvard, Coursera), event planning tools, and design resources</span></li>
  </ul>
 )},
 { id: "events", icon: "\u{1F4C5}", title: "Events & Calendar", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Full events calendar with monthly view, filtering by type (meeting, competition, social, service, workshop, deadline)</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Individual event detail pages with comments, resource downloads, and sharing</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>RSVP system with attendee tracking</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Event creation form for club officers to submit new events</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Announcements board with priority levels (high, medium, low) and category filtering</span></li>
  </ul>
 )},
 { id: "social", icon: "\u{1F4AC}", title: "Student Community & Social", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Student Community hub with live social chat and discussion threads</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>File uploads for sharing TSA guides, budget spreadsheets, and templates</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Discussion forum with threading, upvoting, pinning, and solved-status tracking</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Collaboration platform for clubs to find partners for joint projects and events</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Ideas Generator where students submit and vote on new club concepts</span></li>
  </ul>
 )},
 { id: "create", icon: "\u{1F680}", title: "Club Creation & Management", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>5-step Club Creation Wizard with guided form, constitution template editor, and formatting tools</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Logo uploader, poster designer, and advisor requirement info</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Management Dashboard for editing drafts, managing officers, configuring social links</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Health Dashboard with membership trends, attendance tracking, and performance recommendations</span></li>
  </ul>
 )},
 { id: "mentors", icon: "\u{1F393}", title: "Mentorship & Alumni Network", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Mentor profiles with expertise areas, availability, ratings, and session counts</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Offering types: 1-on-1 mentoring, resume review, mock interviews, career guidance</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Alumni network page with career paths, testimonials, college info, and messaging</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Success stories featuring alumni and club achievements with impact metrics</span></li>
  </ul>
 )},
 { id: "funding", icon: "\u{1F4B0}", title: "Funding & Donations", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Stripe-powered donation system with secure checkout sessions</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club-specific fundraising pages with progress bars and goal tracking</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Judge test mode available (promo code &ldquo;test&rdquo; on donate page)</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>School-wide analytics dashboard with animated counters and performance metrics</span></li>
  </ul>
 )},
 { id: "comms", icon: "\u{1F4F9}", title: "Communication & Video Calls", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Video conference rooms with mic/camera controls and participant management</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Built-in whiteboard for collaborative drawing during calls</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Call preview/setup page with room generation and invite link sharing</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Notification center with event, announcement, mention, achievement, and system alerts</span></li>
  </ul>
 )},
 { id: "achieve", icon: "\u{1F3C6}", title: "Achievements & Gamification", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Achievement badge system with rarity levels: Common, Uncommon, Rare, Epic, Legendary</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Club Finder Quiz that matches students to clubs based on interests</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Goal tracking system with progress bars, milestones, and priority levels</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Bookmarks &amp; Collections to save resources, events, and clubs with public/private settings</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Competition tracker for TSA and club competitions with registration and deadlines</span></li>
  </ul>
 )},
 { id: "auth", icon: "\u{1F510}", title: "Authentication & Profiles", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Supabase-powered login and signup with email/password authentication</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>User profiles with avatar upload (stored in Supabase), bio, grade, and school info</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Personal dashboard showing joined clubs, submitted events, activity feed, and notifications</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Auth-gated actions: joining clubs redirects to login if not authenticated</span></li>
  </ul>
 )},
 { id: "data", icon: "\u{1F4BE}", title: "Data Architecture & Persistence", content: (
  <div className="space-y-3">
   <p className="text-[10px] text-neutral-600 leading-relaxed">ClubConnect uses a <strong>three-tier data strategy</strong> to balance functionality with demonstration.</p>
   <div>
    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">{"\u{1F7E2}"} Database (Supabase PostgreSQL)</p>
    <ul className="space-y-1 text-[11px] text-neutral-700">
     <li className="flex items-start gap-1.5"><span className="text-emerald-500 shrink-0">{"\u25CF"}</span> Authentication &amp; user sessions (login, signup, JWT tokens)</li>
     <li className="flex items-start gap-1.5"><span className="text-emerald-500 shrink-0">{"\u25CF"}</span> User profiles (avatar, bio, grade, school)</li>
     <li className="flex items-start gap-1.5"><span className="text-emerald-500 shrink-0">{"\u25CF"}</span> Community uploads &amp; likes (Supabase Storage)</li>
     <li className="flex items-start gap-1.5"><span className="text-emerald-500 shrink-0">{"\u25CF"}</span> Hub Discussions, Ideas, Mentors, Stories, Collaborate</li>
     <li className="flex items-start gap-1.5"><span className="text-emerald-500 shrink-0">{"\u25CF"}</span> Stripe donation checkout sessions</li>
    </ul>
   </div>
   <div>
    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">{"\u{1F535}"} Local Storage (Browser Persistence)</p>
    <ul className="space-y-1 text-[11px] text-neutral-700">
     <li className="flex items-start gap-1.5"><span className="text-blue-500 shrink-0">{"\u25CF"}</span> Goal Tracker, Club Management Dashboard</li>
     <li className="flex items-start gap-1.5"><span className="text-blue-500 shrink-0">{"\u25CF"}</span> Club Finder Quiz results, Student Lounge chat</li>
    </ul>
   </div>
   <div>
    <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">{"\u{1F7E3}"} UI-Only (Functional Display)</p>
    <ul className="space-y-1 text-[11px] text-neutral-700">
     <li className="flex items-start gap-1.5"><span className="text-purple-500 shrink-0">{"\u25CF"}</span> Competitions, Achievements, Rubrics, Calendar</li>
     <li className="flex items-start gap-1.5"><span className="text-purple-500 shrink-0">{"\u25CF"}</span> Homepage, Directory, Resource downloads, AI chat agents</li>
    </ul>
   </div>
  </div>
 )},
 { id: "access", icon: "\u267F", title: "Accessibility, Safety & Legal", content: (
  <ul className="space-y-1.5 text-xs text-neutral-700">
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>WCAG 2.1 AA/AAA compliant contrast ratios throughout the design</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Keyboard navigation support and alt text on all images</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Safety Guidelines with emergency contacts, anti-bullying policy, and crisis resources</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>Privacy Policy with COPPA/FERPA compliance, Terms of Use, and data handling info</span></li>
   <li className="flex items-start gap-2"><CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> <span>FAQ page with searchable, categorized questions and expandable answers</span></li>
  </ul>
 )},
 { id: "references", icon: "\u{1F4CB}", title: "References & Citations", content: (
  <div className="space-y-3">
   <p className="text-[11px] text-neutral-600">All images, icons, and third-party resources used in ClubConnect are properly attributed below. Full details are also available at <a href="/guides/references" className="text-primary-600 underline font-semibold">/guides/references</a>.</p>
   <div>
    <p className="text-[10px] font-bold text-primary-700 uppercase tracking-wider mb-1">{"\u{1F4F7}"} Images</p>
    <ul className="space-y-1 text-[11px] text-neutral-700">
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Hero &amp; club images &mdash; Unsplash (Free License)</li>
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Club directory photos &mdash; Unsplash (Free License)</li>
    </ul>
   </div>
   <div>
    <p className="text-[10px] font-bold text-primary-700 uppercase tracking-wider mb-1">{"\u{1F3A8}"} Icons &amp; UI</p>
    <ul className="space-y-1 text-[11px] text-neutral-700">
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Lucide React icon library &mdash; ISC License</li>
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Tailwind CSS &mdash; MIT License</li>
    </ul>
   </div>
   <div>
    <p className="text-[10px] font-bold text-primary-700 uppercase tracking-wider mb-1">{"\u2699\uFE0F"} Technology &amp; Services</p>
    <ul className="space-y-1 text-[11px] text-neutral-700">
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Next.js &mdash; MIT License</li>
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Supabase &mdash; Apache 2.0 License</li>
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Stripe Payments API &mdash; proprietary (test mode)</li>
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Google Gemini 2.0 Flash AI &mdash; Google AI Terms</li>
     <li className="flex items-start gap-1.5"><span className="text-primary-500 shrink-0">{"\u25CF"}</span> Leaflet Maps &mdash; BSD 2-Clause License</li>
    </ul>
   </div>
   <div className="mt-2 p-2 bg-primary-50 border border-primary-200">
    <p className="text-[10px] text-primary-700"><strong>Student Work Declaration:</strong> All code, design, and content was created by the JHSTSA Webmaster team. No copyrighted material was used without proper licensing.</p>
   </div>
  </div>
 )},
];

export default function JudgeGuide() {
 const [guideOpen, setGuideOpen] = useState(false);

 useEffect(() => {
  if (typeof window !== "undefined" && !sessionStorage.getItem("guide-seen")) {
   const t = setTimeout(() => { setGuideOpen(true); sessionStorage.setItem("guide-seen", "1"); }, 800);
   return () => clearTimeout(t);
  }
 }, []);

 return (
  <>
   <button
    onClick={() => setGuideOpen(true)}
    className="fixed top-1/3 right-0 z-50 bg-secondary-600 hover:bg-secondary-700 text-white px-3 py-3 shadow-lg flex items-center gap-2 text-xs font-bold transition-all hover:pr-5 group animate-pulse"
    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
    <BookMarked size={16} className="rotate-90" /> <span>JUDGE GUIDE</span>
   </button>

   {guideOpen && (
    <>
     <div className="fixed inset-0 z-[55] bg-black/20 transition-opacity" onClick={() => setGuideOpen(false)} />
     <div className="fixed top-0 right-0 z-[60] h-full w-[28rem] max-w-[92vw] bg-white border-l-4 border-secondary-500 shadow-2xl flex flex-col animate-slide-in-right">
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-5 py-5 shrink-0">
       <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2"><BookMarked size={18} /> Judge&rsquo;s Guide</h3>
        <button onClick={() => setGuideOpen(false)} className="p-1.5 hover:bg-white/20 transition-colors"><X size={18} /></button>
       </div>
       <p className="text-[11px] text-primary-200 mt-1 leading-relaxed">
        Welcome! This is a <strong className="text-white">comprehensive overview</strong> of everything ClubConnect offers. Please take your time exploring &mdash; we truly appreciate you reviewing our work.
       </p>
      </div>

      <div className="flex-1 overflow-y-auto">
       <div className="px-5 py-4 border-b border-neutral-100 bg-gradient-to-b from-secondary-50/40 to-white">
        <p className="text-xs text-neutral-700 leading-relaxed">
         <strong className="text-primary-800">ClubConnect</strong> is a full-featured <strong>community resource hub</strong> for school clubs and student organizations. It connects students to 30+ active clubs, mentors, events, downloadable resources, and tools to create their own organizations.
        </p>
        <p className="text-xs text-neutral-600 leading-relaxed mt-2">
         The <strong>References &amp; Citations</strong> section is included in this guide (scroll down to the &ldquo;{"\u{1F4CB}"} References &amp; Citations&rdquo; accordion). It contains our full work log, copyright checklist, code stack, and image attributions.
        </p>
        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200">
         <span className="text-lg">{"\u{1F4CA}"}</span>
         <p className="text-[11px] text-primary-700 font-semibold">56 total pages &middot; 30+ clubs &middot; 20+ resources &middot; 5 API integrations</p>
        </div>
       </div>

       {GUIDE_SECTIONS.map(section => (
        <GuideAccordion key={section.id} icon={section.icon} title={section.title}>
         {section.content}
        </GuideAccordion>
       ))}

       <div className="px-5 py-4 bg-gradient-to-b from-secondary-50/40 to-primary-50/30">
        <p className="text-xs text-neutral-700 leading-relaxed">
         <strong className="text-primary-800">Thank you for taking the time to review ClubConnect.</strong> We put tremendous effort into making this a comprehensive, functional, and accessible platform. We hope you enjoy exploring every feature &mdash; from the interactive club directory and AI-powered agents, to the donation system and video conferencing. We sincerely appreciate your evaluation.
        </p>
        <p className="text-[10px] text-neutral-500 mt-2 italic">
         Tip: Use the navigation bar at the top to access any major section. Look for the floating chat widget on pages like Resources and Social. References &amp; Citations are in the guide above.
        </p>
       </div>
      </div>

      <div className="border-t border-neutral-200 px-5 py-3 flex items-center justify-between shrink-0 bg-neutral-50">
       <p className="text-[10px] text-neutral-400">ClubConnect &mdash; JHSTSA Webmaster 2026</p>
       <button onClick={() => setGuideOpen(false)} className="px-5 py-2 text-xs font-bold bg-secondary-600 text-white hover:bg-secondary-700">
        Got It &mdash; Thank You!
       </button>
      </div>
     </div>
    </>
   )}
  </>
 );
}
