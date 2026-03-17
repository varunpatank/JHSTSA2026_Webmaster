"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { featuredAlumni, careerPanels } from "@/lib/data";
import {
  Award, BookOpen, Briefcase, Calendar, ChevronDown, GraduationCap,
  Heart, Mail, MapPin, MessageSquare, Search, Star, TrendingUp, Users,
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

export default function AlumniPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"network" | "mentorship" | "careers" | "support">("network");

  const filteredAlumni = featuredAlumni.filter(a => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.chapter.toLowerCase().includes(q) ||
      a.college.toLowerCase().includes(q) || a.career.toLowerCase().includes(q);
  });

  const tabs = [
    { key: "network", label: "Alumni Network", icon: Users },
    { key: "mentorship", label: "Mentorship", icon: Star },
    { key: "careers", label: "Career Connections", icon: Briefcase },
    { key: "support", label: "Support Chapters", icon: Heart },
  ] as const;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-600 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs sm:text-sm uppercase tracking-[0.12em] font-semibold text-primary-100">Community</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><GraduationCap size={40} /> Alumni Network</h1>
          <p className="mt-3 max-w-2xl text-primary-100 text-lg">Connect with graduates who paved the way. Mentorship, career advice, and ongoing support for current students.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Alumni Connected", value: "240+" },
              { label: "Mentorship Sessions", value: "85" },
              { label: "Career Panels", value: careerPanels.length },
              { label: "Chapters Supported", value: "15" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 p-5 text-center hover:bg-white/15 transition-colors">
                <p className="text-3xl md:text-4xl font-heading font-bold text-secondary-300">{s.value}</p>
                <p className="text-sm text-white/80 mt-1.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 mt-6 -mb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? "border-primary-500 text-primary-700 bg-primary-50/50" : "border-transparent text-neutral-500 hover:text-primary-600"}`}>
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "network" && (
          <>
            <div className="card p-4 mb-6">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" placeholder="Search alumni by name, college, club, or career..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlumni.map(alumni => (
                <Reveal key={alumni.id}>
                  <div className="card p-5 ux-hover-lift-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14  bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-bold shrink-0">
                        {alumni.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-primary-800 truncate">{alumni.name}</h3>
                        <p className="text-xs text-secondary-600 font-semibold">Class of {alumni.gradYear}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Award size={14} className="text-primary-400 shrink-0" />
                        <span>{alumni.chapter}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <GraduationCap size={14} className="text-primary-400 shrink-0" />
                        <span>{alumni.college} · {alumni.major}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Briefcase size={14} className="text-primary-400 shrink-0" />
                        <span>{alumni.career}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      {alumni.available ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">Available for Mentorship</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">Unavailable</span>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {activeTab === "mentorship" && (
          <div className="space-y-6">
            <Reveal>
              <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
                <h2 className="text-xl font-heading font-bold text-primary-600">How Mentorship Works</h2>
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  {[
                    { step: "1", title: "Browse Mentors", desc: "Find alumni with expertise in your interests or career goals." },
                    { step: "2", title: "Request Connection", desc: "Send a mentorship request with your goals and preferred schedule." },
                    { step: "3", title: "Meet & Grow", desc: "Have regular check-ins, get advice, and build your professional network." },
                  ].map(s => (
                    <div key={s.step} className="bg-white  p-4 border border-neutral-200 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto text-sm font-bold">{s.step}</div>
                      <h3 className="font-bold text-primary-700 mt-2">{s.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <h2 className="text-lg font-heading font-bold text-primary-600 mb-3">Available Mentors</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {featuredAlumni.filter(a => a.available).map(a => (
                  <div key={a.id} className="card p-5 ux-hover-lift-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12  bg-secondary-50 text-secondary-700 flex items-center justify-center font-bold shrink-0">{a.name.split(" ").map(n => n[0]).join("")}</div>
                      <div>
                        <h3 className="font-bold text-primary-800">{a.name}</h3>
                        <p className="text-xs text-neutral-500">{a.career}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {[a.major, a.chapter].map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">{tag}</span>
                      ))}
                    </div>
                    <button className="btn-outline text-sm w-full mt-4">Request Mentorship</button>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        {activeTab === "careers" && (
          <div className="space-y-6">
            <Reveal>
              <h2 className="text-lg font-heading font-bold text-primary-600 mb-3">Upcoming Career Panels</h2>
              <div className="space-y-3">
                {careerPanels.map(panel => (
                  <div key={panel.id} className="card p-5 ux-hover-lift-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="text-center bg-primary-500 text-white p-2 min-w-[48px]  shrink-0">
                          <div className="text-[10px]">{new Date(panel.date).toLocaleDateString("en-US", { month: "short" })}</div>
                          <div className="text-lg font-bold">{new Date(panel.date).getDate()}</div>
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-700">{panel.title}</h3>
                          <p className="text-sm text-neutral-600 mt-1">Panelists: {panel.panelists}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(panel.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {panel.time}</span>
                          </div>
                        </div>
                      </div>
                      <button className="btn-primary text-sm shrink-0">Register ({panel.registrations} registered)</button>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="card p-6">
                <h2 className="text-lg font-heading font-bold text-primary-600 mb-3">Career Fields Represented</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Engineering", "Business", "Healthcare", "Education", "Technology", "Arts & Media", "Public Service", "Science"].map(field => (
                    <div key={field} className="bg-primary-50 border border-primary-100  p-3 text-center text-sm font-semibold text-primary-700 ux-hover-lift-sm">{field}</div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6">
            <Reveal>
              <div className="card p-6 bg-gradient-to-r from-red-50/50 to-secondary-50/50">
                <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2"><Heart size={18} /> Support Current Chapters</h2>
                <p className="text-sm text-neutral-600 mt-2">Alumni can support current clubs through donations, guest speaking, mentorship, or sponsoring events.</p>
                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { title: "Donate", desc: "Fund supplies, trips, and competitions", link: "/donate" },
                    { title: "Guest Speak", desc: "Share your career journey with students", link: "/about" },
                    { title: "Mentor", desc: "Guide the next generation of leaders", link: "/alumni" },
                    { title: "Sponsor Events", desc: "Support fundraisers and activities", link: "/events" },
                  ].map(a => (
                    <Link key={a.title} href={a.link} className="bg-white  p-4 border border-neutral-200 hover:border-primary-300 ux-hover-lift-sm text-center">
                      <h3 className="font-bold text-primary-700">{a.title}</h3>
                      <p className="text-xs text-neutral-500 mt-1">{a.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="card p-6">
                <h2 className="text-lg font-heading font-bold text-primary-600 mb-3">Alumni Giving Impact</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total Donated", value: "$28,750", color: "bg-green-50 text-green-700 border-green-100" },
                    { label: "Scholarships Funded", value: "12", color: "bg-blue-50 text-blue-700 border-blue-100" },
                    { label: "Events Sponsored", value: "34", color: "bg-purple-50 text-purple-700 border-purple-100" },
                  ].map(s => (
                    <div key={s.label} className={`${s.color}  p-5 text-center border ux-hover-lift-sm`}>
                      <p className="text-3xl font-bold">{s.value}</p>
                      <p className="text-xs mt-1 opacity-70">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
