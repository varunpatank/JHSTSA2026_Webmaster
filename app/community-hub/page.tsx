"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import {
  chapters,
  events,
  spotlights,
  studentStories,
  announcements,
  schoolWideStats,
  weeklyOpportunities,
  featuredAlumni,
} from "@/lib/data";
import {
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  Megaphone,
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";


const categoryColors: Record<string, string> = {
  Academic: "bg-primary-100 text-primary-700 border-primary-200",
  STEM: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Service: "bg-amber-100 text-amber-700 border-amber-200",
  Arts: "bg-purple-100 text-purple-700 border-purple-200",
  Cultural: "bg-rose-100 text-rose-700 border-rose-200",
  Media: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Sports: "bg-orange-100 text-orange-700 border-orange-200",
  Leadership: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const urgencyIcons: Record<string, { icon: string; color: string }> = {
  event: { icon: "??", color: "bg-primary-50 border-primary-200" },
  deadline: { icon: "?", color: "bg-red-50 border-red-200" },
  volunteer: { icon: "??", color: "bg-amber-50 border-amber-200" },
  meeting: { icon: "??", color: "bg-emerald-50 border-emerald-200" },
  competition: { icon: "??", color: "bg-purple-50 border-purple-200" },
  social: { icon: "??", color: "bg-rose-50 border-rose-200" },
};


const discussionThreads = [
  { id: 1, title: "Tips for TSA State Competition?", author: "Maria G.", club: "TSA", avatar: "MG", replies: 23, views: 312, lastActive: "2 hours ago", hot: true, pinned: true },
  { id: 2, title: "Best fundraising ideas for spring semester", author: "James L.", club: "FBLA", avatar: "JL", replies: 18, views: 254, lastActive: "5 hours ago", hot: true, pinned: false },
  { id: 3, title: "How to balance club leadership with academics", author: "Sophie K.", club: "NHS", avatar: "SK", replies: 31, views: 487, lastActive: "1 day ago", hot: false, pinned: false },
  { id: 4, title: "Robotics competition strategies & tips", author: "Alex J.", club: "Robotics", avatar: "AJ", replies: 15, views: 198, lastActive: "1 day ago", hot: false, pinned: false },
  { id: 5, title: "New member recruitment � what works", author: "Taylor M.", club: "Drama", avatar: "TM", replies: 12, views: 143, lastActive: "2 days ago", hot: false, pinned: false },
  { id: 6, title: "Community service hour tracking best practices", author: "Priya R.", club: "CSC", avatar: "PR", replies: 9, views: 172, lastActive: "3 days ago", hot: false, pinned: false },
];


const collabBoards = [
  { id: 1, title: "Inter-Club Spring Festival", clubs: ["Drama", "Music", "Art"], members: 24, status: "Planning", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { id: 2, title: "STEM Fair 2026", clubs: ["Robotics", "Math", "Science"], members: 18, status: "Active", color: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  { id: 3, title: "Community Outreach Day", clubs: ["CSC", "NHS", "Key Club"], members: 32, status: "Recruiting", color: "bg-gradient-to-br from-amber-500 to-orange-500" },
  { id: 4, title: "School Spirit Week", clubs: ["Student Gov", "Cheer", "Band"], members: 15, status: "Ideation", color: "bg-gradient-to-br from-primary-500 to-indigo-500" },
];


const activePolls = [
  { id: 1, question: "What should we do for the spring social?", options: [{ label: "Movie night", votes: 42 }, { label: "Game tournament", votes: 38 }, { label: "Talent show", votes: 55 }, { label: "Picnic", votes: 27 }], totalVotes: 162, endsIn: "2 days" },
  { id: 2, question: "Best meeting time for cross-club planning?", options: [{ label: "Tues after school", votes: 34 }, { label: "Wed lunch", votes: 51 }, { label: "Thu after school", votes: 28 }, { label: "Fri after school", votes: 19 }], totalVotes: 132, endsIn: "5 days" },
];


export default function CommunityHubPage() {
  const [activeSection, setActiveSection] = useState<string>("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");


  const trendingClubs = useMemo(
    () =>
      [...chapters]
        .filter((c) => c.isActive)
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, 6),
    []
  );

  const filteredDiscussions = useMemo(() => {
    let list = discussionThreads;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q) ||
          d.club.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery]);

  const sections = [
    { key: "feed", label: "Activity Feed", icon: Zap },
    { key: "discussions", label: "Discussions", icon: MessageCircle },
    { key: "spotlight", label: "Spotlights", icon: Star },
    { key: "collaborate", label: "Collaborate", icon: Users },
    { key: "stories", label: "Student Voices", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {}
      <HeroSection align="left">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 bg-secondary-500/20 px-3 py-1 text-xs font-semibold text-secondary-300 border border-secondary-500/30">
              <Globe size={13} /> Student Community Hub
            </span>
            <h1 className="hero-title"><span>Community Hub</span></h1>
            <p className="hero-description max-w-xl text-sm leading-relaxed">
              The heartbeat of student life � connect with peers, join discussions, celebrate achievements, and collaborate across clubs.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Active Clubs", value: schoolWideStats.totalClubs, icon: Users },
              { label: "Students", value: schoolWideStats.totalMembers.toLocaleString(), icon: TrendingUp },
              { label: "Discussions", value: discussionThreads.length, icon: MessageCircle },
              { label: "This Week", value: weeklyOpportunities.length + " events", icon: Calendar },
            ].map((s) => (
              <div key={s.label} className="hero-stat min-w-[100px] px-4 py-3 text-center">
                <s.icon size={14} className="mx-auto mb-1 text-secondary-400" />
                <p className="text-lg font-bold leading-none">{s.value}</p>
                <p className="mt-1 text-[10px] text-neutral-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </HeroSection>

      {}
      <div className="bg-white border-b-2 border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-3 whitespace-nowrap transition-colors ${
                    activeSection === s.key
                      ? "border-secondary-500 text-primary-700 bg-primary-50/60"
                      : "border-transparent text-neutral-500 hover:text-primary-600 hover:bg-neutral-50"
                  }`}
                >
                  <Icon size={15} />
                  {s.label}
                </button>
              );
            })}

            {}
            <div className="hidden md:flex ml-auto items-center gap-2 py-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hub&#xFFFD;"
                  className="pl-9 pr-3 py-2 text-sm border border-neutral-200 bg-neutral-50 w-56 focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
          {}
          <div className="md:hidden border-t border-neutral-100 py-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hub&#xFFFD;"
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        {activeSection === "feed" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-2 space-y-8">
              {}
              {announcements.slice(0, 2).map((a) => (
                <div
                  key={a.id}
                  className={`border-l-4 p-5 ${
                    a.priority === "high"
                      ? "border-l-red-500 bg-red-50"
                      : a.priority === "medium"
                      ? "border-l-secondary-500 bg-secondary-50"
                      : "border-l-primary-400 bg-primary-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Megaphone size={18} className={a.priority === "high" ? "text-red-500 mt-0.5" : "text-secondary-600 mt-0.5"} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${a.priority === "high" ? "bg-red-200 text-red-800" : "bg-secondary-200 text-secondary-800"}`}>
                          {a.priority === "high" ? "Important" : "Announcement"}
                        </span>
                        <span className="text-xs text-neutral-500">{a.date}</span>
                      </div>
                      <h3 className="font-bold text-primary-800 text-sm">{a.title}</h3>
                      <p className="text-neutral-600 text-sm mt-1 line-clamp-2">{a.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-primary-800 flex items-center gap-2">
                    <Zap size={20} className="text-secondary-500" />
                    This Week&apos;s Activity
                  </h2>
                  <Link href="/events" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    All Events <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {weeklyOpportunities.map((opp) => {
                    const style = urgencyIcons[opp.type] || urgencyIcons.event;
                    return (
                      <div
                        key={opp.id}
                        className={`flex items-center gap-4 p-4 border ${style.color} hover:shadow-sm transition-shadow`}
                      >
                        <span className="text-xl">{style.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-primary-800 text-sm">{opp.title}</h4>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {opp.club} � {opp.date}
                          </p>
                        </div>
                        {opp.urgent && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 uppercase shrink-0">
                            Urgent
                          </span>
                        )}
                        <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 capitalize shrink-0">
                          {opp.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>


              {}
              <div>
                <h2 className="text-xl font-bold text-primary-800 flex items-center gap-2 mb-4">
                  <Target size={20} className="text-secondary-500" />
                  Active Polls
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {activePolls.map((poll) => {
                    const maxVotes = Math.max(...poll.options.map((o) => o.votes));
                    return (
                      <div key={poll.id} className="bg-white border-2 border-neutral-200 p-5">
                        <h4 className="font-bold text-primary-800 text-sm mb-3">{poll.question}</h4>
                        <div className="space-y-2">
                          {poll.options.map((opt) => {
                            const pct = Math.round((opt.votes / poll.totalVotes) * 100);
                            return (
                              <div key={opt.label} className="relative">
                                <div className="flex items-center justify-between text-xs mb-0.5">
                                  <span className="font-medium text-neutral-700">{opt.label}</span>
                                  <span className="text-neutral-500">{pct}%</span>
                                </div>
                                <div className="h-3 bg-neutral-100 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${opt.votes === maxVotes ? "bg-secondary-500" : "bg-primary-200"}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-neutral-400">
                          <span>{poll.totalVotes} votes</span>
                          <span>Ends in {poll.endsIn}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {}
            <aside className="space-y-6">
              {}
              <div className="bg-white border-2 border-neutral-200 p-5">
                <h3 className="font-bold text-primary-800 text-sm mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { href: "/hub/discussions", label: "New Post", icon: Plus, color: "bg-primary-900 text-white hover:bg-primary-900" },
                    { href: "/events/new", label: "Create Event", icon: Calendar, color: "bg-secondary-500 text-white hover:bg-secondary-600" },
                    { href: "/propose", label: "Start a Club", icon: Lightbulb, color: "bg-emerald-600 text-white hover:bg-emerald-700" },
                    { href: "/hub/collaborate", label: "Collaborate", icon: Users, color: "bg-purple-600 text-white hover:bg-purple-700" },
                  ].map((a) => (
                    <Link
                      key={a.label}
                      href={a.href}
                      className={`flex flex-col items-center gap-2.5 py-5 px-3 text-sm font-semibold text-center rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md ${a.color}`}
                    >
                      <a.icon size={24} />
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              {}
              <div className="bg-white border-2 border-neutral-200 p-5">
                <h3 className="font-bold text-primary-800 text-sm mb-3 flex items-center gap-2">
                  <Flame size={15} className="text-secondary-500" /> Trending Clubs
                </h3>
                <div className="space-y-3">
                  {trendingClubs.map((club, i) => (
                    <Link
                      key={club.id}
                      href={`/directory/${club.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-primary-100 text-primary-700 text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-primary-700 group-hover:text-primary-500 transition-colors truncate">
                          {club.name}
                        </p>
                        <p className="text-xs text-neutral-400">{club.memberCount} members</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 border ${categoryColors[club.category] || "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                        {club.category}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/directory" className="block text-center text-sm text-primary-600 font-medium mt-4 hover:text-primary-700">
                  View All Clubs ?
                </Link>
              </div>

              {}
              <div className="bg-white border-2 border-neutral-200 p-5">
                <h3 className="font-bold text-primary-800 text-sm mb-3 flex items-center gap-2">
                  <Trophy size={15} className="text-secondary-500" /> Top Clubs This Month
                </h3>
                <div className="space-y-3">
                  {schoolWideStats.topClubs.slice(0, 5).map((club, i) => (
                    <div key={club.name} className="flex items-center gap-3">
                      <span className={`w-7 h-7 flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-neutral-200 text-neutral-600" : i === 2 ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-500"}`}>
                        {i === 0 ? "??" : i === 1 ? "??" : i === 2 ? "??" : i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary-700 truncate">{club.name}</p>
                        <div className="flex gap-3 text-[10px] text-neutral-400">
                          <span>{club.members} members</span>
                          <span>{club.events} events</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary-600">{club.score}</span>
                        <p className="text-[10px] text-neutral-400">score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="bg-primary-900 text-white p-5">
                <Sparkles size={24} className="text-secondary-400 mb-2" />
                <h3 className="font-bold text-sm mb-1">Have Something to Share?</h3>
                <p className="text-xs text-neutral-300 mb-3">Submit spotlights, stories, or event proposals to the community.</p>
                <Link
                  href="/hub/request"
                  className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-semibold px-4 py-2 transition-colors"
                >
                  Submit Content <ArrowRight size={13} />
                </Link>
              </div>
            </aside>
          </div>
        )}

        {}
        {activeSection === "discussions" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
                <MessageCircle size={24} className="text-secondary-500" />
                Community Discussions
              </h2>
              <Link
                href="/hub/discussions"
                className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 transition-colors"
              >
                <Plus size={15} /> Start a Discussion
              </Link>
            </div>

            {}
            <div className="space-y-3">
              {filteredDiscussions.map((d) => (
                <Link
                  key={d.id}
                  href="/hub/discussions"
                  className="block bg-white border-2 border-neutral-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-stretch">
                    {}
                    <div className="bg-neutral-50 border-r border-neutral-200 px-4 py-4 flex flex-col items-center justify-center gap-1 min-w-[72px]">
                      <span className="text-lg font-bold text-primary-700">{d.replies}</span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">replies</span>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {d.pinned && (
                          <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 uppercase">?? Pinned</span>
                        )}
                        {d.hot && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 uppercase">?? Hot</span>
                        )}
                        <span className="text-[10px] font-semibold bg-primary-50 text-primary-600 px-2 py-0.5 border border-primary-200">
                          {d.club}
                        </span>
                      </div>
                      <h3 className="font-bold text-primary-800 text-sm hover:text-primary-600">{d.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <div className="w-5 h-5 bg-primary-100 text-primary-600 flex items-center justify-center text-[9px] font-bold">{d.avatar}</div>
                          {d.author}
                        </span>
                        <span>{d.views} views</span>
                        <span>Active {d.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {}
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <div className="bg-primary-50 border-2 border-primary-200 p-5 text-center">
                <MessageCircle size={28} className="text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary-700">108</p>
                <p className="text-xs text-neutral-500">Total Replies This Week</p>
              </div>
              <div className="bg-secondary-50 border-2 border-secondary-200 p-5 text-center">
                <Users size={28} className="text-secondary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-700">47</p>
                <p className="text-xs text-neutral-500">Active Contributors</p>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-200 p-5 text-center">
                <TrendingUp size={28} className="text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-700">+23%</p>
                <p className="text-xs text-neutral-500">Engagement Growth</p>
              </div>
            </div>
          </div>
        )}

        {}
        {activeSection === "spotlight" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
                <Star size={24} className="text-secondary-500" />
                Club Spotlights
              </h2>
              <Link
                href="/hub/request"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Nominate a Club <ChevronRight size={14} />
              </Link>
            </div>

            {}
            {spotlights.length > 0 && (
              <div className="bg-secondary-500 text-white p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 text-xs font-bold mb-4">
                    <Award size={13} /> Featured Spotlight
                  </span>
                  <h3 className="text-2xl font-bold mb-2">{spotlights[0].title}</h3>
                  <p className="text-white/80 text-sm max-w-2xl leading-relaxed mb-4">
                    {spotlights[0].content.slice(0, 200)}�
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {spotlights[0].highlights.slice(0, 3).map((h) => (
                      <span key={h} className="bg-white/15 text-xs px-3 py-1.5 font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {}
            <div className="grid md:grid-cols-2 gap-6">
              {spotlights.slice(1).map((s) => (
                <div
                  key={s.id}
                  className="bg-white border-2 border-neutral-200 hover:border-primary-300 transition-colors overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        Published {s.datePublished}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-primary-800 mb-2">{s.title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
                      {s.content.slice(0, 180)}�
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {s.highlights.slice(0, 2).map((h) => (
                        <span key={h} className="text-[10px] bg-primary-50 text-primary-600 px-2 py-1 border border-primary-200 font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                    {}
                    {s.testimonials[0] && (
                      <blockquote className="border-l-3 border-secondary-400 pl-3 text-xs text-neutral-500 italic">
                        &ldquo;{s.testimonials[0].quote.slice(0, 120)}�&rdquo;
                        <cite className="block mt-1 not-italic font-medium text-primary-600">
                          � {s.testimonials[0].author}, {s.testimonials[0].role}
                        </cite>
                      </blockquote>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {activeSection === "collaborate" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
                <Users size={24} className="text-secondary-500" />
                Collaboration Boards
              </h2>
              <Link
                href="/hub/collaborate"
                className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 transition-colors"
              >
                <Plus size={15} /> Start a Project
              </Link>
            </div>

            {}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {collabBoards.map((board) => (
                <Link
                  key={board.id}
                  href="/hub/collaborate"
                  className="group bg-white border-2 border-neutral-200 hover:border-primary-300 overflow-hidden transition-all hover:shadow-md"
                >
                  <div className={`h-2 ${board.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-bold text-primary-800 text-base group-hover:text-primary-600 transition-colors">
                        {board.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase shrink-0 ${
                          board.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : board.status === "Planning"
                            ? "bg-primary-100 text-primary-700"
                            : board.status === "Recruiting"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {board.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {board.clubs.map((c) => (
                        <span key={c} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 border border-neutral-200">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {board.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} /> Open to join
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {}
            <div className="bg-primary-50 border-2 border-primary-200 p-6">
              <h3 className="font-bold text-primary-800 mb-2 flex items-center gap-2">
                <Lightbulb size={18} className="text-secondary-500" />
                Cross-Club Idea Board
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Have an idea that spans multiple clubs? Pitch it here and find collaborators across the school.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                {[
                  { idea: "Joint charity gala � Drama + Music + Art", votes: 34 },
                  { idea: "School-wide hackathon � all STEM clubs", votes: 28 },
                  { idea: "Cultural food festival � all cultural clubs", votes: 41 },
                ].map((item) => (
                  <div key={item.idea} className="bg-white border border-primary-200 p-3">
                    <p className="text-xs text-primary-700 font-medium">{item.idea}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400">
                      <Heart size={11} /> {item.votes} votes
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/hub/ideas"
                className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-900 text-white text-xs font-semibold px-4 py-2 transition-colors"
              >
                Submit Your Idea <ArrowRight size={13} />
              </Link>
            </div>

            {}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
                <Award size={20} className="text-secondary-500" />
                Mentors & Alumni Network
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {featuredAlumni.slice(0, 3).map((alum) => (
                  <div key={alum.id} className="bg-white border-2 border-neutral-200 p-5 text-center">
                    <div className="w-14 h-14 bg-primary-100 mx-auto mb-3 flex items-center justify-center text-lg font-bold text-primary-600">
                      {alum.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <h4 className="font-bold text-primary-800 text-sm">{alum.name}</h4>
                    <p className="text-xs text-secondary-600 font-medium">Class of {alum.gradYear}</p>
                    <p className="text-xs text-neutral-500 mt-1">{alum.career}</p>
                    {alum.available && (
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Available
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link href="/hub/mentors" className="text-sm text-primary-600 font-medium hover:text-primary-700">
                  View Mentor Network ?
                </Link>
              </div>
            </div>
          </div>
        )}

        {}
        {activeSection === "stories" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
                <Heart size={24} className="text-secondary-500" />
                Student Voices
              </h2>
              <Link
                href="/hub/stories"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Share Your Story <ChevronRight size={14} />
              </Link>
            </div>

            {}
            <div className="flex flex-wrap gap-2 mb-6">
              {["All", ...Array.from(new Set(studentStories.map((s) => s.category)))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary-900 text-white border-primary-600"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {}
            <div className="grid md:grid-cols-2 gap-6">
              {studentStories
                .filter((s) => selectedCategory === "All" || s.category === selectedCategory)
                .map((story, i) => (
                  <div
                    key={story.id}
                    className="bg-white border-2 border-neutral-200 hover:border-primary-300 transition-colors overflow-hidden"
                  >
                    <div className="flex items-stretch">
                      <div className={`w-2 shrink-0 ${i % 3 === 0 ? "bg-primary-500" : i % 3 === 1 ? "bg-secondary-500" : "bg-emerald-500"}`} />
                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                            {story.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary-800 text-sm">{story.name}</h4>
                            <p className="text-[10px] text-neutral-400">
                              Grade {story.grade} � {story.club}
                            </p>
                          </div>
                          <span className="ml-auto text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 border border-primary-200 font-medium">
                            {story.category}
                          </span>
                        </div>
                        <blockquote className="text-sm text-neutral-600 leading-relaxed italic border-l-3 border-secondary-300 pl-3">
                          &ldquo;{story.quote}&rdquo;
                        </blockquote>
                        <div className="mt-3 flex items-center gap-2">
                          <Zap size={12} className="text-secondary-500" />
                          <span className="text-xs text-secondary-600 font-medium">{story.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {}
            <div className="mt-8 bg-primary-900 text-white p-8">
              <h3 className="text-xl font-bold mb-4 text-center">Community Impact at a Glance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Service Hours", value: schoolWideStats.totalServiceHours.toLocaleString(), icon: Heart },
                  { label: "Events Hosted", value: schoolWideStats.totalEvents, icon: Calendar },
                  { label: "Students Involved", value: schoolWideStats.totalMembers.toLocaleString(), icon: Users },
                  { label: "Participation Rate", value: schoolWideStats.studentParticipationRate + "%", icon: TrendingUp },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon size={22} className="mx-auto mb-2 text-secondary-400" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-neutral-300 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="bg-white border-t-2 border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-primary-900 text-white p-8 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Looking for downloadable guides and templates?</h2>
              <p className="text-neutral-300 text-sm">
                Visit the Resource Center for step-by-step toolkits, document templates, and AI-powered assistance.
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-6 py-3 transition-colors shrink-0"
            >
              <BookOpen size={16} /> Resource Center <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
