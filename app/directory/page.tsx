"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { chapters, events } from "@/lib/data";
import { formatChapterLocation, getPrimaryLocation } from "@/lib/location";
import { getSubmittedEvents, SubmittedEvent } from "@/lib/clientState";
import {
  ArrowRight, Calendar, ChevronRight, Clock, Compass, Grid3X3, Heart,
  List, MapPin, MessageCircle, MessageSquare, Plus, Search, Send,
  Share2, SlidersHorizontal, Sparkles, Star, Target, Timer,
  TrendingUp, Users, X, Zap,
} from "lucide-react";
import EventSubmissionForm from "@/components/EventSubmissionForm";

const DirectoryLeafletMap = dynamic(() => import("@/components/DirectoryLeafletMap"), { ssr: false });


const DAYS = ["Any", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = ["Any", "Before School", "Lunch", "After School", "Weekends"];
const CATEGORIES = ["Any", "Academic", "Arts", "Service", "Cultural", "STEM", "Sports", "Leadership", "Media", "Other"];

const eventImages: Record<string, string> = {
  Competition: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  Social: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
  Workshop: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
  Meeting: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
  Performance: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
  Fundraiser: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
  Other: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
};
const categoryColors: Record<string, string> = {
  Competition: "bg-red-100 text-red-700 border-red-200",
  Social: "bg-purple-100 text-purple-700 border-purple-200",
  Workshop: "bg-blue-100 text-blue-700 border-blue-200",
  Meeting: "bg-green-100 text-green-700 border-green-200",
  Performance: "bg-pink-100 text-pink-700 border-pink-200",
  Fundraiser: "bg-amber-100 text-amber-700 border-amber-200",
  Other: "bg-neutral-100 text-neutral-700 border-neutral-200",
};

interface SocialState {
  likes: number;
  liked: boolean;
  comments: { id: number; user: string; text: string; time: string }[];
}

function inferDay(schedule: string) {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].find(d => schedule.includes(d)) || "Varies";
}


export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<"clubs" | "events">("clubs");


  const [clubSearch, setClubSearch] = useState("");
  const [meetingDay, setMeetingDay] = useState("Any");
  const [meetingTime, setMeetingTime] = useState("Any");
  const [clubCategory, setClubCategory] = useState("Any");
  const [roomFilter, setRoomFilter] = useState("Any");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(true);


  const [evCategory, setEvCategory] = useState("Any");
  const [evMonth, setEvMonth] = useState("Any");
  const [evSearch, setEvSearch] = useState("");
  const [submitted, setSubmitted] = useState<SubmittedEvent[]>([]);
  const [evView, setEvView] = useState<"cards" | "feed" | "calendar">("cards");
  const [socialMap, setSocialMap] = useState<Record<string, SocialState>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => { setSubmitted(getSubmittedEvents()); }, []);


  const rooms = useMemo(() => {
    const s = new Set(chapters.map(ch => getPrimaryLocation(ch.meetingLocation)));
    return ["Any", ...Array.from(s)];
  }, []);

  const filteredClubs = useMemo(() => chapters.filter(ch => {
    if (clubSearch.trim()) {
      const q = clubSearch.toLowerCase();
      const f = [ch.name, ch.description, ch.category, ch.meetingLocation.parentOrg, ch.meetingLocation.room, ch.meetingLocation.internalLocation].join(" ").toLowerCase();
      if (!f.includes(q)) return false;
    }
    if (meetingDay !== "Any" && inferDay(ch.meetingSchedule) !== meetingDay) return false;
    if (meetingTime !== "Any" && ch.meetingTime !== meetingTime) return false;
    if (clubCategory !== "Any" && ch.category !== clubCategory) return false;
    if (roomFilter !== "Any" && getPrimaryLocation(ch.meetingLocation) !== roomFilter) return false;
    return true;
  }), [clubSearch, meetingDay, meetingTime, clubCategory, roomFilter]);

  const hasClubFilters = meetingDay !== "Any" || meetingTime !== "Any" || clubCategory !== "Any" || roomFilter !== "Any" || clubSearch.trim() !== "";
  const clearClubFilters = () => { setClubSearch(""); setMeetingDay("Any"); setMeetingTime("Any"); setClubCategory("Any"); setRoomFilter("Any"); };
  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]);
  };


  const mergedEvents = useMemo(() => {
    const norm = submitted.map(e => ({
      id: e.id, title: e.title, description: e.description, date: e.date,
      startTime: e.startTime, endTime: e.endTime, location: e.location,
      chapterId: e.clubId, chapterName: e.clubName,
      category: "Other" as const, isPublic: true, requiresRSVP: false, currentAttendees: 0,
    }));
    return [...norm, ...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [submitted]);

  const evCategories = useMemo(() => ["Any", ...Array.from(new Set(mergedEvents.map(e => e.category)))], [mergedEvents]);
  const evMonths = useMemo(() => {
    const labels = mergedEvents.map(e => new Date(e.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }));
    return ["Any", ...Array.from(new Set(labels))];
  }, [mergedEvents]);

  const filteredEvents = useMemo(() => mergedEvents.filter(e => {
    if (evCategory !== "Any" && e.category !== evCategory) return false;
    if (evMonth !== "Any") {
      const label = new Date(e.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (label !== evMonth) return false;
    }
    if (evSearch.trim()) {
      const q = evSearch.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.chapterName.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [evCategory, evMonth, evSearch, mergedEvents]);

  const getSocial = (id: string): SocialState =>
    socialMap[id] || { likes: Math.floor(Math.random() * 20) + 3, liked: false, comments: [] };
  const toggleLike = (id: string) => {
    const prev = getSocial(id);
    setSocialMap(m => ({ ...m, [id]: { ...prev, liked: !prev.liked, likes: prev.liked ? prev.likes - 1 : prev.likes + 1 } }));
  };
  const addComment = (id: string) => {
    const text = (commentInput[id] || "").trim();
    if (!text) return;
    const prev = getSocial(id);
    setSocialMap(m => ({ ...m, [id]: { ...prev, comments: [...prev.comments, { id: Date.now(), user: "You", text, time: "Just now" }] } }));
    setCommentInput(p => ({ ...p, [id]: "" }));
  };

  const nextEvent = filteredEvents.find(e => new Date(e.date) >= new Date());
  const countdown = nextEvent ? (() => {
    const diff = new Date(nextEvent.date).getTime() - Date.now();
    return { days: Math.max(0, Math.floor(diff / 86400000)), hours: Math.max(0, Math.floor((diff % 86400000) / 3600000)) };
  })() : null;

  const totalAttendees = mergedEvents.reduce((s, e) => s + e.currentAttendees, 0);
  const uniqueClubs = new Set(mergedEvents.map(e => e.chapterName)).size;

  return (
    <div className="bg-neutral-50">
      {}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-500 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-secondary-400 rounded-full blur-3xl animate-drift-slower" />
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-accent-400 rounded-full blur-3xl animate-drift-slow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-up">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-primary-200 font-semibold">Discover &amp; Explore</p>
              <h1 className="mt-1 text-3xl md:text-4xl font-heading font-bold">Clubs &amp; Events</h1>
              <p className="mt-2 text-primary-100 max-w-lg text-sm">
                Explore clubs with interactive filtering, map-based discovery, side-by-side comparison &mdash; and browse upcoming events all in one place.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: chapters.length, label: "Clubs" },
                { value: chapters.reduce((s, c) => s + c.memberCount, 0), label: "Members" },
                { value: mergedEvents.length, label: "Events" },
                { value: totalAttendees, label: "Attendees" },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20  p-3 text-center min-w-[72px]">
                  <p className="text-2xl md:text-3xl font-heading font-bold">{s.value}</p>
                  <p className="text-[10px] text-primary-200 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="bg-white border-b border-neutral-200 sticky top-[57px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1">
          {([["clubs", "Clubs", Users], ["events", "Events", Calendar]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative px-5 py-3 text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === id ? "text-primary-600" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <Icon size={15} /> {label}
              {activeTab === id && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full" />}
            </button>
          ))}
          {activeTab === "events" && (
            <button onClick={() => setShowCreateModal(true)} className="ml-auto btn-secondary text-xs inline-flex items-center gap-1.5 py-2">
              <Plus size={14} /> Create Event
            </button>
          )}
        </div>
      </section>

      {}
      {activeTab === "clubs" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {}
          <div className="card p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input value={clubSearch} onChange={e => setClubSearch(e.target.value)} placeholder="Search clubs by name, category, or room..."
                  className="input-field pl-9 text-sm py-2" />
              </div>
              <div className="hidden md:flex gap-1.5 flex-wrap">
                {["Any", "STEM", "Arts", "Service", "Academic", "Sports"].map(c => (
                  <button key={c} onClick={() => setClubCategory(c)}
                    className={`px-3 py-1.5 text-xs font-semibold  border transition-colors ${clubCategory === c ? "bg-primary-500 text-white border-primary-500" : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300"}`}>
                    {c === "Any" ? "All" : c}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowFilters(v => !v)} className="btn-outline text-xs gap-1 flex items-center"><SlidersHorizontal size={14} /> Filters</button>
              <div className="flex gap-1">
                <button onClick={() => setViewMode("grid")} className={`px-2.5 py-2  border ${viewMode === "grid" ? "bg-primary-500 text-white border-primary-500" : "bg-white text-neutral-600 border-neutral-200"}`}><Grid3X3 size={14} /></button>
                <button onClick={() => setViewMode("list")} className={`px-2.5 py-2  border ${viewMode === "list" ? "bg-primary-500 text-white border-primary-500" : "bg-white text-neutral-600 border-neutral-200"}`}><List size={14} /></button>
              </div>
            </div>

            {showFilters && (
              <div className="grid sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 animate-fade-up">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Meeting Day</label>
                  <select value={meetingDay} onChange={e => setMeetingDay(e.target.value)} className="select-field text-sm">{DAYS.map(o => <option key={o}>{o}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Time</label>
                  <select value={meetingTime} onChange={e => setMeetingTime(e.target.value)} className="select-field text-sm">{TIMES.map(o => <option key={o}>{o}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Category</label>
                  <select value={clubCategory} onChange={e => setClubCategory(e.target.value)} className="select-field text-sm">{CATEGORIES.map(o => <option key={o}>{o}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Room / Location</label>
                  <select value={roomFilter} onChange={e => setRoomFilter(e.target.value)} className="select-field text-sm">{rooms.map(o => <option key={o}>{o}</option>)}</select>
                </div>
              </div>
            )}

            {hasClubFilters && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500">Showing {filteredClubs.length} of {chapters.length}</span>
                <button onClick={clearClubFilters} className="text-primary-600 font-semibold hover:underline flex items-center gap-1"><X size={12} /> Clear all</button>
              </div>
            )}
          </div>

          {}
          <div className="card overflow-hidden">
            <button onClick={() => setShowMap(v => !v)} className="w-full flex items-center justify-between p-4 text-left hover:bg-primary-50/50 transition-colors">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-500" />
                <h2 className="font-heading font-bold text-primary-600">Interactive Club Map</h2>
                <span className="text-xs text-neutral-400">Click markers to filter</span>
              </div>
              <ChevronRight size={16} className={`text-neutral-400 transition-transform ${showMap ? "rotate-90" : ""}`} />
            </button>
            {showMap && (
              <div className="px-4 pb-4 animate-fade-up">
                <DirectoryLeafletMap chapters={filteredClubs} activeRoom={roomFilter} onSelectRoom={setRoomFilter} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {rooms.slice(1, 8).map(room => (
                    <button key={room} onClick={() => setRoomFilter(roomFilter === room ? "Any" : room)}
                      className={`px-3 py-1.5 text-xs font-semibold  border transition-colors ${roomFilter === room ? "bg-primary-500 text-white border-primary-500" : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-300"}`}>
                      {room}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {}
          {compareIds.length >= 2 && (
            <div className="card p-5 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-bold text-primary-700">Compare Clubs</h3>
                <button onClick={() => setCompareIds([])} className="text-sm text-neutral-500 hover:text-primary-600 flex items-center gap-1"><X size={14} /> Clear</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {compareIds.slice(0, 2).map(id => {
                  const c = chapters.find(ch => ch.id === id);
                  if (!c) return null;
                  return (
                    <div key={id} className="bg-white  p-4 border border-neutral-200">
                      <h4 className="font-bold text-primary-700">{c.name}</h4>
                      <div className="mt-2 space-y-1 text-sm text-neutral-600">
                        <p><span className="font-semibold">Members:</span> {c.memberCount}</p>
                        <p><span className="font-semibold">Category:</span> {c.category}</p>
                        <p><span className="font-semibold">Meeting:</span> {c.meetingSchedule}</p>
                        <p><span className="font-semibold">Time:</span> {c.meetingTime}</p>
                        <p><span className="font-semibold">Enrollment:</span> {c.membershipStatus}</p>
                        <p><span className="font-semibold">Location:</span> {formatChapterLocation(c.meetingLocation)}</p>
                      </div>
                      <Link href={`/directory/${c.id}`} className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:underline">Details &rarr;</Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {}
          {viewMode === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClubs.map(ch => (
                <div key={ch.id} className="card p-4 hover:border-primary-400 ux-hover-lift group relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-outline text-xs">{ch.category}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${ch.membershipStatus === "Open Enrollment" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{ch.membershipStatus === "Open Enrollment" ? "Open" : "Apply"}</span>
                    <button onClick={() => toggleCompare(ch.id)} title="Compare"
                      className={`ml-auto text-xs px-2 py-1  border ${compareIds.includes(ch.id) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-neutral-400 border-neutral-200 hover:border-primary-300"}`}>
                      &#9878;&#65039;
                    </button>
                  </div>
                  <Link href={`/directory/${ch.id}`}>
                    <h3 className="font-heading font-bold text-primary-600 group-hover:text-primary-500 transition-colors">{ch.name}</h3>
                  </Link>
                  <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{ch.description}</p>
                  <div className="mt-3 space-y-1 text-xs text-neutral-500">
                    <p className="flex items-center gap-1"><Users size={12} /> {ch.memberCount} members &middot; {ch.meetingFrequency}</p>
                    <p className="flex items-center gap-1"><MapPin size={12} /> {formatChapterLocation(ch.meetingLocation)}</p>
                    <p className="flex items-center gap-1"><Star size={12} /> {ch.meetingSchedule}, {ch.meetingTime}</p>
                  </div>
                  <Link href={`/directory/${ch.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline">
                    View Details <ChevronRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="card divide-y divide-neutral-100">
              {filteredClubs.map(ch => (
                <div key={ch.id} className="flex items-center gap-4 p-4 hover:bg-primary-50/30 transition-colors group">
                  <div className="w-10 h-10  bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {ch.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/directory/${ch.id}`} className="font-bold text-primary-600 hover:underline text-sm">{ch.name}</Link>
                      <span className="badge badge-outline text-[10px]">{ch.category}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{ch.meetingSchedule} &middot; {ch.meetingTime} &middot; {formatChapterLocation(ch.meetingLocation)}</p>
                  </div>
                  <span className="text-xs text-neutral-500 hidden sm:block">{ch.memberCount} members</span>
                  <button onClick={() => toggleCompare(ch.id)}
                    className={`text-xs px-2 py-1  border shrink-0 ${compareIds.includes(ch.id) ? "bg-primary-500 text-white border-primary-500" : "bg-white text-neutral-400 border-neutral-200 hover:border-primary-300"}`}>&#9878;&#65039;</button>
                </div>
              ))}
            </div>
          )}

          {filteredClubs.length === 0 && (
            <div className="card p-10 text-center">
              <Search size={32} className="mx-auto text-neutral-300 mb-3" />
              <h3 className="font-bold text-primary-700">No clubs match your filters</h3>
              <p className="text-sm text-neutral-500 mt-1">Try adjusting your search or filters.</p>
              <button onClick={clearClubFilters} className="btn-outline mt-4 text-sm">Clear All Filters</button>
            </div>
          )}

          {}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card p-5 bg-gradient-to-br from-purple-50 to-primary-50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="text-lg font-heading font-bold text-primary-700">AI-Powered Recommendations</h3>
              </div>
              <p className="text-sm text-neutral-600 mb-4">Based on your interests and activity, here are clubs you might enjoy:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {chapters.slice(0, 4).map((ch, i) => (
                  <Link key={ch.id} href={`/directory/${ch.id}`} className="bg-white p-3  border border-purple-100 hover:border-purple-300 transition-colors group flex items-start gap-3">
                    <div className="w-10 h-10  bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {ch.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-primary-700 group-hover:text-primary-500">{ch.name}</p>
                      <p className="text-xs text-neutral-500 line-clamp-1">{ch.description}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-purple-600">
                        <Target size={10} /> {[98, 94, 91, 87][i]}% match
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="card p-5 bg-gradient-to-br from-secondary-50 to-orange-50 border-secondary-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-secondary-600" />
                <h3 className="font-heading font-bold text-primary-700">Find Your Perfect Club</h3>
              </div>
              <p className="text-sm text-neutral-600 mb-4">Take our quick quiz to discover clubs that match your personality and interests.</p>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center space-y-3">
                  <div className="text-4xl">&#127919;</div>
                  <p className="text-sm text-neutral-600">Answer 5 quick questions and get personalized club matches!</p>
                  <Link href="/hub/quiz" className="btn-primary inline-flex items-center gap-2 text-sm"><Compass size={14} /> Take the Quiz</Link>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-600" />
                <h3 className="text-lg font-heading font-bold text-primary-700">Trending Clubs</h3>
              </div>
              <div className="space-y-3">
                {[...chapters].sort((a, b) => b.memberCount - a.memberCount).slice(0, 5).map((ch, i) => (
                  <Link key={ch.id} href={`/directory/${ch.id}`} className="flex items-center gap-3 group hover:bg-primary-50/50 p-2  transition-colors">
                    <span className={`w-7 h-7  flex items-center justify-center text-xs font-bold shrink-0 ${i < 3 ? "bg-yellow-100 text-yellow-700" : "bg-neutral-100 text-neutral-600"}`}>#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-primary-700 group-hover:text-primary-500">{ch.name}</p>
                      <p className="text-xs text-neutral-500">{ch.memberCount} members &bull; {ch.category}</p>
                    </div>
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5"><TrendingUp size={10} /> +{3 + (ch.name.length % 7)}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-blue-600" />
                <h3 className="text-lg font-heading font-bold text-primary-700">Recent Activity Feed</h3>
              </div>
              <div className="space-y-3">
                {events.slice(0, 3).map(ev => (
                  <Link key={ev.id} href={`/events/${ev.id}`} className="bg-blue-50/30 p-3  border border-blue-100 hover:border-blue-300 transition-colors block">
                    <p className="font-semibold text-sm text-primary-700">{ev.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">{ev.chapterName} &bull; {new Date(ev.date).toLocaleDateString()}</p>
                  </Link>
                ))}
                {chapters.slice(-2).map(ch => (
                  <div key={ch.id + "-new"} className="bg-green-50/30 p-3  border border-green-100">
                    <p className="text-xs text-green-600 font-semibold mb-1">&#128226; New club spotlight</p>
                    <p className="font-semibold text-sm text-primary-700">{ch.name}</p>
                    <p className="text-xs text-neutral-500 mt-1">{ch.description.slice(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-teal-600" />
                <h3 className="text-lg font-heading font-bold text-primary-700">Community Discussions</h3>
              </div>
              <Link href="/hub/discussions" className="text-sm font-semibold text-primary-600 hover:underline flex items-center gap-1">View all <ChevronRight size={14} /></Link>
            </div>
            <div className="space-y-2">
              {[
                { title: "Best clubs for college applications?", author: "Alex T.", replies: 14, cat: "General", time: "2h ago" },
                { title: "How to start a coding club - tips wanted", author: "Jordan K.", replies: 8, cat: "STEM", time: "5h ago" },
                { title: "Community service hour tracking methods", author: "Sam R.", replies: 22, cat: "Service", time: "1d ago" },
                { title: "Robotics competition prep - study group?", author: "Chris M.", replies: 6, cat: "STEM", time: "1d ago" },
              ].map((topic, i) => (
                <Link key={i} href="/hub/discussions" className="flex items-center gap-4 p-3  hover:bg-teal-50/50 transition-colors group border border-transparent hover:border-teal-100">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {topic.author.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary-700 group-hover:text-primary-500">{topic.title}</p>
                    <p className="text-xs text-neutral-500">{topic.author} &bull; {topic.time} &bull; <span className="text-teal-600">{topic.cat}</span></p>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center gap-1 shrink-0"><MessageSquare size={12} /> {topic.replies}</div>
                </Link>
              ))}
            </div>
          </div>

          {}
          <div className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary-50 to-secondary-50">
            <div>
              <h3 className="text-lg font-heading font-bold text-primary-700">Can&apos;t find your club?</h3>
              <p className="text-sm text-neutral-600">Start a new one or browse our resource library for guides.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/start-a-club" className="btn-primary text-center text-sm">Start a Club</Link>
              <Link href="/resources" className="btn-outline text-center text-sm">Browse Resources</Link>
            </div>
          </div>
        </div>
      )}

      {}
      {activeTab === "events" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {}
          {nextEvent && countdown && (
            <div className="card p-5 bg-white shadow-lg border-l-4 border-secondary-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
              <div className="flex items-center gap-4">
                <div className="text-center bg-gradient-to-b from-primary-500 to-primary-600 text-white px-3 py-2  min-w-[56px] shadow-sm">
                  <div className="text-[10px]">{new Date(nextEvent.date).toLocaleDateString("en-US", { month: "short" })}</div>
                  <div className="text-xl font-bold">{new Date(nextEvent.date).getDate()}</div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-secondary-600">Coming Up Next</p>
                  <Link href={`/events/${nextEvent.id}`} className="text-lg font-heading font-bold text-primary-700 hover:text-primary-500 transition-colors">{nextEvent.title}</Link>
                  <p className="text-sm text-neutral-500">{nextEvent.chapterName} &middot; {nextEvent.startTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-primary-50  border border-primary-100">
                  <p className="text-2xl font-bold text-primary-700">{countdown.days}</p>
                  <p className="text-[10px] text-neutral-500 uppercase">Days</p>
                </div>
                <div className="text-center px-4 py-2 bg-primary-50  border border-primary-100">
                  <p className="text-2xl font-bold text-primary-700">{countdown.hours}</p>
                  <p className="text-[10px] text-neutral-500 uppercase">Hours</p>
                </div>
                <Link href={`/events/${nextEvent.id}`} className="btn-primary text-sm hidden sm:inline-flex items-center gap-1">
                  Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {}
          <div className="card p-4 flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" value={evSearch} onChange={e => setEvSearch(e.target.value)} placeholder="Search events, clubs..." className="input-field pl-9 text-sm" />
              </div>
            </div>
            <div className="min-w-[160px]">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Category</label>
              <select value={evCategory} onChange={e => setEvCategory(e.target.value)} className="select-field text-sm">
                {evCategories.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Month</label>
              <select value={evMonth} onChange={e => setEvMonth(e.target.value)} className="select-field text-sm">
                {evMonths.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {([["cards", Grid3X3], ["feed", List], ["calendar", Calendar]] as const).map(([v, Icon]) => (
                  <button key={v} onClick={() => setEvView(v)} className={`px-3 py-2  border text-sm transition-all ${evView === v ? "bg-primary-500 text-white border-primary-500 shadow-sm" : "bg-white text-neutral-500 border-neutral-200 hover:border-primary-300"}`} aria-label={`${v} view`}>
                    <Icon size={16} />
                  </button>
                ))}
              </div>
              <span className="text-sm text-neutral-400 ml-2 whitespace-nowrap">{filteredEvents.length} results</span>
            </div>
          </div>

          {filteredEvents.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">&#128237;</div>
              <h3 className="text-xl font-bold text-neutral-700">No Events Found</h3>
              <p className="text-neutral-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {}
          {evView === "cards" && (
            <div className="space-y-5">
              {filteredEvents.map((event, i) => (
                <Link key={event.id} href={`/events/${event.id}`}
                  className="card flex flex-col md:flex-row overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all group animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${categoryColors[event.category] || categoryColors.Other}`}>{event.category}</span>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${event.isPublic ? "bg-green-100 text-green-700 border border-green-200" : "bg-neutral-100 text-neutral-600 border border-neutral-200"}`}>{event.isPublic ? "Open to All" : "Members Only"}</span>
                      {event.requiresRSVP && <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">RSVP Required</span>}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-primary-800 group-hover:text-primary-600 transition-colors">{event.title}</h3>
                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold shrink-0">{event.chapterName.charAt(0)}</span>
                      {event.chapterName}
                    </p>
                    <p className="text-sm text-neutral-600 mt-3 line-clamp-2 leading-relaxed">{event.description}</p>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500"><Calendar size={14} className="text-primary-400 shrink-0" />{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500"><Clock size={14} className="text-primary-400 shrink-0" />{event.startTime} &ndash; {event.endTime}</div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500"><MapPin size={14} className="text-primary-400 shrink-0" /><span className="truncate">{event.location}</span></div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500"><Users size={14} className="text-primary-400 shrink-0" />{event.currentAttendees} attending</div>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-semibold text-primary-500 group-hover:text-primary-600 transition-colors">
                      View Event Details <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="md:w-72 lg:w-80 h-48 md:h-auto shrink-0 relative overflow-hidden">
                    <img src={eventImages[event.category] || eventImages.Other} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm  px-3 py-1.5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-primary-600">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</div>
                      <div className="text-lg font-bold text-primary-800">{new Date(event.date).getDate()}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {}
          {evView === "feed" && (
            <div className="max-w-3xl mx-auto space-y-5">
              {filteredEvents.map(event => {
                const social = getSocial(event.id);
                const showComm = expandedComments[event.id];
                return (
                  <article key={event.id} className="card overflow-hidden animate-fade-up">
                    <div className="relative h-48 overflow-hidden">
                      <img src={eventImages[event.category] || eventImages.Other} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${categoryColors[event.category] || categoryColors.Other}`}>{event.category}</span>
                      </div>
                    </div>
                    <div className="px-5 py-3 flex items-center gap-3 border-b border-neutral-100">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                        {event.chapterName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/directory/${event.chapterId}`} className="font-semibold text-sm text-primary-700 hover:underline">{event.chapterName}</Link>
                        <p className="text-xs text-neutral-400">{new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <Link href={`/events/${event.id}`} className="text-xl font-heading font-bold text-primary-800 hover:text-primary-600 transition-colors">{event.title}</Link>
                      <p className="text-sm text-neutral-600 mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {event.startTime} &ndash; {event.endTime}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {event.currentAttendees} attending</span>
                      </div>
                    </div>
                    <div className="px-5 py-2.5 border-t border-neutral-100 flex items-center gap-5">
                      <button onClick={(e) => { e.preventDefault(); toggleLike(event.id); }} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${social.liked ? "text-red-500" : "text-neutral-500 hover:text-red-500"}`}>
                        <Heart size={16} className={social.liked ? "fill-current" : ""} /> {social.likes}
                      </button>
                      <button onClick={() => setExpandedComments(p => ({ ...p, [event.id]: !p[event.id] }))} className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors">
                        <MessageCircle size={16} /> {social.comments.length || "Comment"}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors ml-auto">
                        <Share2 size={16} /> Share
                      </button>
                    </div>
                    {showComm && (
                      <div className="px-5 pb-4 border-t border-neutral-50">
                        {social.comments.length > 0 && (
                          <div className="pt-3 space-y-2">
                            {social.comments.map(c => (
                              <div key={c.id} className="flex gap-2 text-sm">
                                <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px] font-bold shrink-0">{c.user[0]}</div>
                                <div><span className="font-semibold text-primary-700">{c.user}</span> <span className="text-neutral-600">{c.text}</span><p className="text-[10px] text-neutral-400 mt-0.5">{c.time}</p></div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <input type="text" placeholder="Add a comment..." value={commentInput[event.id] || ""}
                            onChange={e => setCommentInput(p => ({ ...p, [event.id]: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && addComment(event.id)}
                            className="flex-1 px-3 py-1.5 border border-neutral-200  text-sm focus:border-primary-400 focus:outline-none" />
                          <button onClick={() => addComment(event.id)} className="px-3 py-1.5 bg-primary-500 text-white  hover:bg-primary-600 transition-colors"><Send size={14} /></button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {}
          {evView === "calendar" && (() => {
            const grouped: Record<string, typeof filteredEvents> = {};
            filteredEvents.forEach(e => { const k = e.date; if (!grouped[k]) grouped[k] = []; grouped[k].push(e); });
            return (
              <div className="space-y-5">
                {Object.keys(grouped).sort().map(date => (
                  <div key={date} className="card overflow-hidden">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-transparent border-b border-neutral-100">
                      <div className="text-center bg-gradient-to-b from-primary-500 to-primary-600 text-white px-3 py-2  min-w-[56px] shadow-sm">
                        <div className="text-[10px]">{new Date(date).toLocaleDateString("en-US", { month: "short" })}</div>
                        <div className="text-xl font-bold">{new Date(date).getDate()}</div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-primary-700">{new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
                        <p className="text-xs text-neutral-500">{grouped[date].length} event{grouped[date].length > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="divide-y divide-neutral-100">
                      {grouped[date].map(event => (
                        <Link key={event.id} href={`/events/${event.id}`} className="flex items-center gap-4 p-4 hover:bg-primary-50/40 transition-all group">
                          <div className="w-16 h-16  overflow-hidden shrink-0 shadow-sm">
                            <img src={eventImages[event.category] || eventImages.Other} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${categoryColors[event.category] || categoryColors.Other}`}>{event.category}</span>
                            </div>
                            <p className="font-semibold text-primary-700 group-hover:text-primary-500 transition-colors">{event.title}</p>
                            <p className="text-xs text-neutral-500">{event.chapterName} &middot; {event.startTime}&ndash;{event.endTime} &middot; {event.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400">{event.currentAttendees} going</span>
                            <ChevronRight size={16} className="text-neutral-300 group-hover:text-primary-500 transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {showCreateModal && (
        <EventSubmissionForm isModal onClose={() => { setShowCreateModal(false); setSubmitted(getSubmittedEvents()); }} />
      )}
    </div>
  );
}
