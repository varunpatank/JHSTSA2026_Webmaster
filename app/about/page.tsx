"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { chapters, sponsorsData, schoolWideStats } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import {
  Award, BookOpen, Calendar, CheckCircle, Globe, Heart, MapPin,
  MessageSquare, Shield, Star, Target, TrendingUp, Users, Zap,
} from "lucide-react";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
}

const VALUES = [
  { icon: Shield, title: "Privacy-First", desc: "Student data stays within the chapter unless explicitly shared. We follow COPPA and FERPA guidelines." },
  { icon: Zap, title: "Fast & Accessible", desc: "Mobile-friendly, keyboard-navigable, WCAG 2.1 AA compliant. Works on any device, any connection." },
  { icon: Users, title: "Student-Led", desc: "Built by students, for students. Officers control their clubs, advisors supervise, and members participate." },
  { icon: Heart, title: "Inclusive by Design", desc: "Every student deserves a place. Our platform supports clubs of all sizes, interests, and backgrounds." },
  { icon: Target, title: "Impact-Focused", desc: "Track service hours, competition results, and community impact with built-in analytics." },
  { icon: Globe, title: "Community-Connected", desc: "Partner integrations with local organizations, libraries, universities, and businesses." },
];

const TIMELINE = [
  { year: "2023", title: "Idea Born", desc: "Students identified the need for a centralized club management platform." },
  { year: "2024", title: "Development Begins", desc: "A team of TSA members began building ClubConnect using modern web technologies." },
  { year: "2025", title: "Beta Launch", desc: "ClubConnect launched in beta with 12 clubs and 200 students at Juanita High School." },
  { year: "2026", title: "Full Release", desc: "Platform expanded to support 47+ clubs, 1,283+ members, events, analytics, and community resources." },
];

const TEAM = [
  { name: "Alex Rivera", role: "Project Lead & Full-Stack Developer", grade: 12, contribution: "Architecture, database design, API development" },
  { name: "Priya Sharma", role: "UI/UX Designer & Frontend Developer", grade: 11, contribution: "Design system, responsive layouts, accessibility" },
  { name: "Jordan Chen", role: "Backend Developer & DevOps", grade: 12, contribution: "Supabase integration, authentication, deployment" },
  { name: "Maya Williams", role: "Content & Community Manager", grade: 10, contribution: "Documentation, user testing, community engagement" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f4f6fa] min-h-screen relative">
      {/* Diagonal texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0">
        <HeroSection
          eyebrow="Our Story"
          title="About ClubConnect"
          description="ClubConnect is a modern hub designed to help student chapters organize, collaborate, and shine. We combine tools for meetings, events, and resources with privacy-first defaults and partner integrations that amplify student leadership."
          images={[
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=75",
            "https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&w=1600&q=75",
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=75",
          ]}
          texture="diagonal"
          stats={[
            { label: "Active Clubs", value: schoolWideStats.totalClubs },
            { label: "Student Members", value: schoolWideStats.totalMembers.toLocaleString() },
            { label: "Events This Year", value: schoolWideStats.totalEvents },
            { label: "Service Hours", value: schoolWideStats.totalServiceHours.toLocaleString() },
          ]}
          actions={
            <>
              <Link href="/start-a-club" className="btn-secondary">Propose a Chapter</Link>
              <Link href="/directory" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500">Browse Directory</Link>
            </>
          }
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {}
        <Reveal>
          <div className="card p-8">
            <h2 className="text-2xl font-heading font-bold text-primary-600">Mission & Vision</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-6">
              <div className="bg-primary-50/50 border border-primary-100  p-6">
                <h3 className="font-bold text-primary-700 flex items-center gap-2"><Target size={18} /> Our Mission</h3>
                <p className="text-sm text-neutral-700 mt-2 leading-relaxed">To empower student leaders with practical, accessible tools — scheduling, shared resources, analytics, and collaboration features — so chapters can focus on impact, not administration.</p>
              </div>
              <div className="bg-secondary-50/50 border border-secondary-100  p-6">
                <h3 className="font-bold text-secondary-700 flex items-center gap-2"><Star size={18} /> Our Vision</h3>
                <p className="text-sm text-neutral-700 mt-2 leading-relaxed">A school where every student finds their community, every club operates efficiently, and every leader has the tools to create lasting positive change in their school and beyond.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {}
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUES.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-5 ux-hover-lift-sm">
                  <div className="w-10 h-10  bg-primary-50 text-primary-600 flex items-center justify-center"><Icon size={20} /></div>
                  <h3 className="font-bold text-primary-800 mt-3">{v.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {}
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-100" />
            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="relative pl-16">
                  <div className="absolute left-[11px] w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold z-10">{item.year}</div>
                  <div className="card p-5 ux-hover-lift-sm">
                    <h3 className="font-bold text-primary-700">{item.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {}
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">Platform Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, title: "Club Directory", desc: "Browse, search, and filter 47+ clubs with interactive map" },
              { icon: Calendar, title: "Events & Calendar", desc: "RSVP, calendar sync, and countdown timers for all events" },
              { icon: MessageSquare, title: "Discussions", desc: "Club forums, community discussions, and officer announcements" },
              { icon: TrendingUp, title: "Analytics", desc: "Track growth, engagement, service hours, and club health scores" },
              { icon: Award, title: "Achievements", desc: "Earn badges for participation, leadership, and community impact" },
              { icon: Users, title: "Mentorship", desc: "Connect with alumni, officers, and community mentors" },
              { icon: MapPin, title: "Meeting Rooms", desc: "Find meeting locations on campus with room-level precision" },
              { icon: CheckCircle, title: "Goal Tracking", desc: "Set personal and club goals with milestone tracking" },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-4 text-center ux-hover-lift-sm">
                  <div className="w-10 h-10  bg-primary-50 text-primary-600 flex items-center justify-center mx-auto"><Icon size={18} /></div>
                  <h3 className="font-bold text-primary-800 mt-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-neutral-600 mt-1">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {}
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">Development Team</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TEAM.map(m => (
              <div key={m.name} className="card p-5 ux-hover-lift-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12  bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">{m.name.split(" ").map(n => n[0]).join("")}</div>
                  <div>
                    <h3 className="font-bold text-primary-800">{m.name}</h3>
                    <p className="text-xs text-secondary-600 font-semibold">{m.role}</p>
                    <p className="text-xs text-neutral-500">Grade {m.grade}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-3">{m.contribution}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {}
        <Reveal>
          <div className="card p-6">
            <h2 className="text-2xl font-heading font-bold text-primary-600">Tech Stack</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Next.js", desc: "React framework" }, { name: "TypeScript", desc: "Type safety" },
                { name: "Tailwind CSS", desc: "Utility-first styling" }, { name: "Supabase", desc: "Auth & database" },
                { name: "Stripe", desc: "Payment processing" }, { name: "Leaflet", desc: "Interactive maps" },
                { name: "Leaflet", desc: "Interactive maps" }, { name: "Lucide", desc: "Icon library" },
              ].map(t => (
                <div key={t.name} className="bg-neutral-50 border border-neutral-200  p-3 text-center ux-hover-lift-sm">
                  <p className="font-bold text-sm text-primary-700">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {}
        <Reveal>
          <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">Partners & Sponsors</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sponsorsData.map(s => (
              <div key={s.id} className="card p-5 ux-hover-lift-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12  bg-secondary-50 text-secondary-700 flex items-center justify-center text-sm font-bold shrink-0">{s.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                  <div>
                    <h3 className="font-bold text-primary-800">{s.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.tier === "platinum" ? "bg-purple-100 text-purple-700" : s.tier === "gold" ? "bg-yellow-100 text-yellow-700" : s.tier === "silver" ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"}`}>{s.tier}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-2">{s.description}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {}
        <Reveal>
          <div className="card p-8 bg-primary-600 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.15) 18px, rgba(255,255,255,0.15) 19px)" }} />
            <h2 className="text-2xl font-heading font-bold relative z-10">Ready to Get Involved?</h2>
            <p className="mt-2 text-primary-100 max-w-lg mx-auto relative z-10">Whether you want to join a club, start one, or volunteer — ClubConnect has everything you need to make an impact.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 relative z-10">
              <Link href="/directory" className="btn-secondary">Browse Clubs</Link>
              <Link href="/start-a-club" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500">Start a Club</Link>
              <Link href="/events" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500">View Events</Link>
            </div>
          </div>
        </Reveal>
      </div>
      </div>
    </div>
  );
}
