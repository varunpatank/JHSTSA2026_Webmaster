"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { events } from "@/lib/data";
import { getSubmittedEvents, SubmittedEvent } from "@/lib/clientState";
import {
  ArrowLeft, BarChart3, BookOpen, Calendar, Clock, Download,
  FileText, Heart, MapPin, MessageSquare, Send, Share2, ThumbsUp, Users,
} from "lucide-react";

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  likes: number;
}

const categoryResources: Record<string, { title: string; type: string; size: string }[]> = {
  Competition: [
    { title: "Competition Rules & Guidelines", type: "PDF", size: "1.2 MB" },
    { title: "Preparation Checklist", type: "PDF", size: "450 KB" },
    { title: "Past Competition Results", type: "XLSX", size: "320 KB" },
  ],
  Social: [
    { title: "Event Agenda & Itinerary", type: "PDF", size: "280 KB" },
    { title: "Icebreaker Activity Guide", type: "PDF", size: "150 KB" },
  ],
  Workshop: [
    { title: "Workshop Materials", type: "ZIP", size: "5.2 MB" },
    { title: "Pre-Workshop Reading", type: "PDF", size: "890 KB" },
    { title: "Practice Exercises", type: "PDF", size: "1.1 MB" },
  ],
  Meeting: [
    { title: "Meeting Agenda", type: "DOCX", size: "120 KB" },
    { title: "Previous Meeting Notes", type: "PDF", size: "340 KB" },
  ],
  Performance: [
    { title: "Performance Program", type: "PDF", size: "2.4 MB" },
    { title: "Rehearsal Schedule", type: "PDF", size: "180 KB" },
  ],
  Fundraiser: [
    { title: "Fundraiser Planning Guide", type: "PDF", size: "560 KB" },
    { title: "Donation Tracking Sheet", type: "XLSX", size: "95 KB" },
  ],
  Other: [
    { title: "Event Information Pack", type: "PDF", size: "400 KB" },
  ],
};

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [localEvent, setLocalEvent] = useState<SubmittedEvent | null>(null);
  const [rsvp, setRsvp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: "Sarah M.", text: "Can't wait for this event! Already preparing my materials.", time: "2 hours ago", likes: 5 },
    { id: 2, author: "James C.", text: "Is there parking available near the venue?", time: "4 hours ago", likes: 2 },
    { id: 3, author: "Alex T.", text: "This was amazing last year. Highly recommend attending!", time: "1 day ago", likes: 12 },
  ]);
  const [commentText, setCommentText] = useState("");
  const [commentLikes, setCommentLikes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const found = getSubmittedEvents().find((item) => item.id === params.id);
    if (found) setLocalEvent(found);
  }, [params.id]);

  const seeded = events.find((item) => item.id === params.id);

  useEffect(() => {
    if (seeded) setLikeCount(Math.floor(seeded.currentAttendees * 0.7));
  }, [seeded]);

  if (!seeded && !localEvent) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="card p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-heading font-bold text-primary-600">Event Not Found</h1>
          <p className="mt-2 text-neutral-600">This event may have been removed or the link is incorrect.</p>
          <Link href="/events" className="btn-primary inline-block mt-5">Back to Events</Link>
        </div>
      </div>
    );
  }

  const event = seeded
    ? {
        title: seeded.title, chapterName: seeded.chapterName, chapterId: seeded.chapterId,
        location: seeded.location, date: seeded.date, startTime: seeded.startTime,
        endTime: seeded.endTime, description: seeded.description, isPublic: seeded.isPublic,
        category: seeded.category, currentAttendees: seeded.currentAttendees,
      }
    : {
        title: localEvent!.title, chapterName: localEvent!.clubName, chapterId: localEvent!.clubId,
        location: localEvent!.location, date: localEvent!.date, startTime: localEvent!.startTime,
        endTime: localEvent!.endTime, description: localEvent!.description, isPublic: true,
        category: "Other", currentAttendees: 0,
      };

  const relatedEvents = events
    .filter((e) => e.id !== params.id && (e.chapterId === event.chapterId || e.category === event.category))
    .slice(0, 3);

  const resources = categoryResources[event.category] || categoryResources.Other;
  const totalAttendees = event.currentAttendees + (rsvp ? 1 : 0);
  const rsvpGoing = Math.floor(totalAttendees * 0.65);
  const rsvpMaybe = Math.floor(totalAttendees * 0.25);
  const rsvpDeclined = totalAttendees - rsvpGoing - rsvpMaybe;
  const rsvpMax = seeded?.maxAttendees || Math.floor(totalAttendees * 1.4);
  const fillPct = Math.min(100, Math.round((totalAttendees / rsvpMax) * 100));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { id: Date.now(), author: "You", text: commentText.trim(), time: "Just now", likes: 0 }]);
    setCommentText("");
  };

  const toggleCommentLike = (id: number) => {
    setCommentLikes(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setComments(cs => cs.map(c => c.id === id ? { ...c, likes: c.likes - 1 } : c)); }
      else { next.add(id); setComments(cs => cs.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c)); }
      return next;
    });
  };

  const eventImages: Record<string, string> = {
    Competition: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    Social: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    Workshop: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80",
    Meeting: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    Performance: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1400&q=80",
    Fundraiser: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80",
    Other: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80",
  };
  const bannerImg = eventImages[event.category] || eventImages.Other;

  return (
    <div className="min-h-screen bg-neutral-100">
      <section className="relative text-white border-b-4 border-secondary-500 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bannerImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 to-primary-700/70" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          <Link href="/events" className="text-sm font-semibold text-primary-100 hover:text-white flex items-center gap-1 mb-4">
            <ArrowLeft size={14} /> Back to Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">{event.title}</h1>
          <p className="mt-2 text-primary-100">
            Hosted by{" "}
            <Link href={`/directory/${event.chapterId}`} className="underline hover:text-white">{event.chapterName}</Link>
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handleLike} className={`flex items-center gap-1.5 px-4 py-2  font-semibold text-sm transition-all ${liked ? "bg-red-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}>
              <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likeCount}
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-4 py-2  bg-white/15 text-white hover:bg-white/25 text-sm font-semibold">
              <Share2 size={16} /> {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`badge ${event.isPublic ? "badge-primary" : "badge-outline"}`}>{event.isPublic ? "Open Event" : "Members Only"}</span>
              <span className="badge badge-outline">{event.category}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-neutral-700">
              <div className="flex items-center gap-3 p-3  bg-neutral-50">
                <Calendar size={18} className="text-primary-600 shrink-0" />
                <div><p className="font-semibold">Date</p><p>{event.date}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3  bg-neutral-50">
                <Clock size={18} className="text-primary-600 shrink-0" />
                <div><p className="font-semibold">Time</p><p>{event.startTime} - {event.endTime}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3  bg-neutral-50">
                <MapPin size={18} className="text-primary-600 shrink-0" />
                <div><p className="font-semibold">Location</p><p>{event.location}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3  bg-neutral-50">
                <Users size={18} className="text-primary-600 shrink-0" />
                <div><p className="font-semibold">Attendees</p><p>{totalAttendees} attending</p></div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600">About This Event</h2>
            <p className="mt-3 text-neutral-700 leading-relaxed">{event.description}</p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><BarChart3 size={20} /> RSVP Statistics</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-green-50 border border-green-100 ">
                <p className="text-2xl font-bold text-green-700">{rsvpGoing}</p>
                <p className="text-xs text-green-600">Going</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 border border-yellow-100 ">
                <p className="text-2xl font-bold text-yellow-700">{rsvpMaybe}</p>
                <p className="text-xs text-yellow-600">Maybe</p>
              </div>
              <div className="text-center p-3 bg-red-50 border border-red-100 ">
                <p className="text-2xl font-bold text-red-700">{rsvpDeclined}</p>
                <p className="text-xs text-red-600">Declined</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-600">Capacity</span>
                <span className="font-bold text-primary-700">{fillPct}% filled</span>
              </div>
              <div className="h-4 bg-neutral-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${(rsvpGoing / rsvpMax) * 100}%` }} />
                <div className="h-full bg-yellow-400 transition-all" style={{ width: `${(rsvpMaybe / rsvpMax) * 100}%` }} />
                <div className="h-full bg-red-400 transition-all" style={{ width: `${(rsvpDeclined / rsvpMax) * 100}%` }} />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">{totalAttendees} of {rsvpMax} spots filled</p>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-neutral-500 mb-2">RSVP TREND (LAST 7 DAYS)</p>
              <div className="flex items-end gap-1 h-16">
                {[3, 5, 8, 12, 10, 15, totalAttendees].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <span className="text-[8px] font-bold text-primary-600">{v}</span>
                    <div className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t" style={{ height: `${(v / Math.max(totalAttendees, 1)) * 100}%`, minHeight: "4px" }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-neutral-400 mt-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><FileText size={20} /> Event Resources</h2>
            <div className="space-y-2">
              {resources.map(res => (
                <div key={res.title} className="flex items-center gap-3 p-3 border border-neutral-200  hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                  <div className="w-10 h-10  bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><BookOpen size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 truncate">{res.title}</p>
                    <p className="text-xs text-neutral-500">{res.type} · {res.size}</p>
                  </div>
                  <button className="btn-outline text-xs flex items-center gap-1 shrink-0"><Download size={12} /> Download</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><MessageSquare size={20} /> Comments ({comments.length})</h2>
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="border border-neutral-200  p-4 hover:bg-primary-50/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">{c.author[0]}</div>
                    <span className="text-sm font-semibold text-primary-700">{c.author}</span>
                    <span className="text-xs text-neutral-400 ml-auto">{c.time}</span>
                  </div>
                  <p className="text-sm text-neutral-700 ml-10">{c.text}</p>
                  <div className="ml-10 mt-2">
                    <button onClick={() => toggleCommentLike(c.id)} className={`flex items-center gap-1 text-xs transition-colors ${commentLikes.has(c.id) ? "text-primary-600 font-semibold" : "text-neutral-400 hover:text-primary-500"}`}>
                      <ThumbsUp size={12} fill={commentLikes.has(c.id) ? "currentColor" : "none"} /> {c.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" placeholder="Add a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addComment(); }} className="flex-1 input-field text-sm" />
              <button onClick={addComment} className="btn-primary px-4"><Send size={14} /></button>
            </div>
          </div>

          {relatedEvents.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-heading font-bold text-primary-600 mb-4">Related Events</h2>
              <div className="space-y-3">
                {relatedEvents.map((re) => (
                  <Link key={re.id} href={`/events/${re.id}`} className="block p-4  border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/40 ux-hover-lift-sm">
                    <p className="font-semibold text-primary-700">{re.title}</p>
                    <p className="text-sm text-neutral-500">{re.chapterName} · {re.date} · {re.location}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card p-6">
            <button onClick={() => setRsvp(!rsvp)} className={`w-full py-3  font-semibold text-center transition-all ${rsvp ? "bg-green-100 text-green-700 border-2 border-green-300" : "btn-primary"}`}>
              {rsvp ? "✓ You're Going!" : "RSVP to This Event"}
            </button>
            <button onClick={handleShare} className="btn-outline w-full mt-3 flex items-center justify-center gap-2"><Share2 size={14} /> {copied ? "Link Copied!" : "Share Event"}</button>
            <button onClick={handleLike} className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5  font-semibold text-sm transition-all ${liked ? "bg-red-50 text-red-600 border-2 border-red-200" : "btn-outline"}`}>
              <Heart size={14} fill={liked ? "currentColor" : "none"} /> {liked ? "Loved!" : "Love This Event"} ({likeCount})
            </button>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-primary-600">Hosting Club</h3>
            <Link href={`/directory/${event.chapterId}`} className="mt-3 block p-3  border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/40 ux-hover-lift-sm">
              <p className="font-semibold text-primary-700">{event.chapterName}</p>
              <p className="text-xs text-neutral-500 mt-1">View club details →</p>
            </Link>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-primary-600">Quick Links</h3>
            <div className="mt-3 space-y-2">
              <Link href="/events" className="block text-sm text-primary-600 hover:underline">← All Events</Link>
              <Link href="/events/new" className="block text-sm text-primary-600 hover:underline">Submit an Event</Link>
              <Link href="/directory" className="block text-sm text-primary-600 hover:underline">Club Directory</Link>
              <Link href="/resources" className="block text-sm text-primary-600 hover:underline">Resources</Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-primary-600">Attendee Breakdown</h3>
            <div className="mt-3 space-y-2">
              {[
                { label: "Students", pct: 72, color: "bg-primary-500" },
                { label: "Officers", pct: 18, color: "bg-secondary-500" },
                { label: "Advisors", pct: 6, color: "bg-green-500" },
                { label: "Guests", pct: 4, color: "bg-purple-500" },
              ].map(g => (
                <div key={g.label}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-neutral-600">{g.label}</span>
                    <span className="font-bold text-primary-700">{g.pct}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full ${g.color} rounded-full`} style={{ width: `${g.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
