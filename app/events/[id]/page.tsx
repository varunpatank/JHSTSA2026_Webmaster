"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { events } from "@/lib/data";
import { getCreatedEvents, removeCreatedEvent } from "@/lib/clientState";
import { supabase, eventsApi, eventRegistrationsApi } from "@/lib/api";
import { ArrowLeft, Calendar, Clock, MapPin, Trash2, Users, Share2, CheckCircle, Loader2 } from "lucide-react";


const GALLERY: Record<string, string[]> = {
  Competition: [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  ],
  Social: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  ],
  Workshop: [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
  ],
  Meeting: [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
  ],
  Performance: [
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
  ],
  Fundraiser: [
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  ],
  Other: [
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1429514513361-8a632ff5d610?auto=format&fit=crop&w=800&q=80",
  ],
};

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [dbEvent, setDbEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvp, setRsvp] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled && user) setCurrentUserId(user.id);

        // Try fetching from DB
        const { data: ev } = await eventsApi.getById(params.id);
        if (!cancelled && ev) {
          setDbEvent(ev);
        }

        // Fetch registrations count
        const { data: regs } = await eventRegistrationsApi.getByEvent(params.id);
        if (!cancelled && regs) {
          setRegistrationCount(regs.filter((r: any) => r.status === 'registered' || r.status === 'attended').length);
          if (user) {
            const userReg = regs.find((r: any) => r.user_id === user?.id && r.status !== 'cancelled');
            if (userReg) setRsvp(true);
          }
        }
      } catch {
        // DB unavailable — fall through to seeded data
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [params.id]);

  const seeded = events.find((item) => item.id === params.id);

  // Fallback: check user-created events in clientState
  const userCreated = !dbEvent && !seeded
    ? getCreatedEvents().find(e => e.id === params.id)
    : null;

  const handleRsvp = useCallback(async () => {
    if (!currentUserId || rsvpLoading) return;
    setRsvpLoading(true);
    if (rsvp) {
      await eventRegistrationsApi.cancel(params.id, currentUserId);
      setRsvp(false);
      setRegistrationCount(prev => Math.max(0, prev - 1));
    } else {
      await eventRegistrationsApi.register({ event_id: params.id, user_id: currentUserId });
      setRsvp(true);
      setRegistrationCount(prev => prev + 1);
    }
    setRsvpLoading(false);
  }, [currentUserId, rsvp, rsvpLoading, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  if (!seeded && !dbEvent && !userCreated) {
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

  const event = dbEvent
    ? {
        title: dbEvent.name, chapterName: dbEvent.organizations?.name || "Club", chapterId: dbEvent.org_id || "",
        location: dbEvent.location_text || "", date: dbEvent.time ? new Date(dbEvent.time).toLocaleDateString() : "",
        startTime: dbEvent.start_time || "", endTime: dbEvent.end_time || "",
        description: dbEvent.description || "", isPublic: dbEvent.is_public ?? true,
        category: dbEvent.category || "Other", currentAttendees: registrationCount,
        imageUrl: dbEvent.image_url,
      }
    : seeded ? {
        title: seeded.title, chapterName: seeded.chapterName, chapterId: seeded.chapterId,
        location: seeded.location, date: seeded.date, startTime: seeded.startTime,
        endTime: seeded.endTime, description: seeded.description, isPublic: seeded.isPublic,
        category: seeded.category, currentAttendees: seeded.currentAttendees,
        imageUrl: undefined as string | undefined,
      }
    : userCreated ? {
        title: userCreated.title, chapterName: userCreated.clubName || "Your Club", chapterId: userCreated.clubId || "",
        location: userCreated.location, date: userCreated.date, startTime: userCreated.startTime,
        endTime: userCreated.endTime, description: userCreated.description, isPublic: true,
        category: (userCreated.category || "General") as string, currentAttendees: 0,
        imageUrl: userCreated.imageUrl,
      }
    : null;

  if (!event) return null;

  const totalAttendees = event.currentAttendees;
  const rsvpMax = (dbEvent?.max_attendees) || (seeded?.maxAttendees) || Math.max(Math.floor(totalAttendees * 1.4), 20);
  const spotsLeft = Math.max(0, rsvpMax - totalAttendees);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await eventsApi.delete(params.id);
    } catch {}
    removeCreatedEvent(params.id);
    router.push("/events");
  };

  const bannerImgs: Record<string, string> = {
    Competition: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    Social:      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    Workshop:    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80",
    Meeting:     "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    Performance: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1400&q=80",
    Fundraiser:  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80",
    Other:       "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80",
  };
  const bannerImg = event.imageUrl || bannerImgs[event.category] || bannerImgs.Other;
  const gallery = GALLERY[event.category] || GALLERY.Other;

  const relatedEvents = events
    .filter((e) => e.id !== params.id && (e.chapterId === event.chapterId || e.category === event.category))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F1E8]">

      {/* ── BANNER ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0">
          <Image src={bannerImg} alt="" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/60 to-primary-900/30" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-200 hover:text-white mb-5 transition-colors">
            <ArrowLeft size={13} /> Back to Events
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-secondary-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {event.category}
            </span>
            {event.isPublic
              ? <span className="inline-block bg-white/15 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">Open Event</span>
              : <span className="inline-block bg-white/15 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">Members Only</span>
            }
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">{event.title}</h1>
          <p className="mt-1.5 text-primary-200 text-sm">
            Hosted by{" "}
            <Link href={`/directory/${event.chapterId}`} className="text-white font-semibold hover:underline">{event.chapterName}</Link>
          </p>
          {event.description && (
            <p className="mt-2 text-sm max-w-xl leading-relaxed inline-block cream-textured border border-cream-400 text-primary-900 px-3 py-2 rounded-lg font-medium">{event.description}</p>
          )}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold hover:bg-white/25 transition-colors border border-white/20">
              <Share2 size={12} /> {copied ? "Link copied!" : "Share event"}
            </button>
            {(currentUserId && dbEvent?.created_by === currentUserId) || userCreated ? (
              <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/80 text-white text-xs font-semibold hover:bg-red-600/90 transition-colors border border-red-400/40 disabled:opacity-60">
                {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Delete Event
              </button>
            ) : null}
          </div>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="block w-full h-6">
            <path d="M0,32 L0,16 C360,32 720,0 1080,16 C1260,24 1380,12 1440,16 L1440,32 Z" fill="#F7F1E8" />
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Quick info row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Calendar, label: "Date",     value: new Date(event.date + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            { icon: Clock,    label: "Time",     value: `${event.startTime} – ${event.endTime}` },
            { icon: MapPin,   label: "Location", value: event.location.split(",")[0] },
            { icon: Users,    label: "Attending",value: `${totalAttendees} signed up` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white border border-cream-300 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-primary-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
                <p className="text-xs font-semibold text-primary-800 leading-tight mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white border border-cream-300 rounded-2xl p-6">
          <h2 className="font-heading font-bold text-primary-800 text-lg mb-3">About This Event</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">{event.description}</p>
        </div>

        {/* Image gallery */}
        <div className="bg-white border border-cream-300 rounded-2xl p-6">
          <h2 className="font-heading font-bold text-primary-800 text-lg mb-4">Event Gallery</h2>
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-neutral-200">
                <Image src={src} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 33vw, 250px" />
              </div>
            ))}
          </div>
        </div>

        {/* Sign-up section */}
        <div className="bg-white border border-cream-300 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-primary-800 text-lg">Join This Event</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex -space-x-1.5">
                  {["bg-primary-400","bg-secondary-500","bg-accent-500","bg-emerald-500"].map((c,i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[9px] font-bold`}>{String.fromCharCode(65+i)}</div>
                  ))}
                </div>
                <p className="text-sm text-neutral-600">
                  <span className="font-bold text-primary-800">{totalAttendees}</span> people have signed up
                  {spotsLeft > 0 && <span className="text-neutral-400"> · <span className="text-primary-600 font-semibold">{spotsLeft} spots left</span></span>}
                </p>
              </div>
              {/* Capacity bar */}
              <div className="mt-3 w-64 max-w-full">
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-900 rounded-full transition-all" style={{ width: `${Math.min(100, (totalAttendees / rsvpMax) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">{totalAttendees} of {rsvpMax} spots filled</p>
              </div>
            </div>
            <button
              onClick={handleRsvp}
              disabled={!currentUserId || rsvpLoading}
              className={`shrink-0 flex items-center gap-2 px-7 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 ${
                rsvp
                  ? "bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-50"
                  : "bg-primary-800 text-white hover:bg-primary-800 shadow-[0_4px_14px_rgba(23,54,93,0.3)]"
              }`}
            >
              {rsvpLoading ? <Loader2 size={16} className="animate-spin" /> : rsvp ? <><CheckCircle size={16} /> Signed Up!</> : "Sign Up"}
            </button>
          </div>
          {!currentUserId && (
            <p className="mt-3 text-xs text-neutral-500">
              <Link href="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link> to sign up for this event.
            </p>
          )}
        </div>

        {/* Related events */}
        {relatedEvents.length > 0 && (
          <div className="bg-white border border-cream-300 rounded-2xl p-6">
            <h2 className="font-heading font-bold text-primary-800 text-lg mb-4">More Events You Might Like</h2>
            <div className="space-y-2">
              {relatedEvents.map(re => (
                <Link key={re.id} href={`/events/${re.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl border border-cream-200 hover:border-primary-200 hover:bg-cream-100 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary-800 truncate">{re.title}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{re.chapterName} · {re.date}</p>
                  </div>
                  <ArrowLeft size={13} className="rotate-180 text-neutral-400 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
