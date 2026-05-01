"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Calendar, Check, ChevronRight, Gavel,
  Plus, Users,
} from "lucide-react";
import { chapters } from "@/lib/data";

type Tab = "clubs" | "create" | "event" | "resource";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "clubs",    label: "My Clubs",      icon: Users    },
  { id: "create",   label: "Create a Club", icon: Plus     },
  { id: "event",    label: "Submit Event",  icon: Calendar },
  { id: "resource", label: "Add Resource",  icon: BookOpen },
];

// ── Simple form helpers ────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-neutral-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
const inputCls = "w-full border border-cream-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary-400/30 focus:border-secondary-400 bg-white";

// ── Tabs ──────────────────────────────────────────────────────
function MyClubs() {
  // Mock enrolled clubs using the first 3 chapters
  const enrolled = chapters.slice(0, 3);
  return (
    <div>
      <h2 className="font-heading font-bold text-primary-800 text-lg mb-1">Your Enrolled Clubs</h2>
      <p className="text-sm text-neutral-500 mb-6">Clubs you&apos;ve joined or are currently a member of.</p>
      {enrolled.length === 0 ? (
        <div className="text-center py-16 bg-cream-100 rounded-2xl border border-dashed border-cream-400">
          <p className="text-neutral-500 text-sm">You haven&apos;t joined any clubs yet.</p>
          <Link href="/directory" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-600 hover:underline">Browse Clubs <ArrowRight size={13} /></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {enrolled.map(club => (
            <Link key={club.id} href={`/directory/${club.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-cream-300 px-5 py-4 hover:border-primary-300 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 text-primary-700">
                <Users size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary-800 text-sm group-hover:text-primary-600 transition-colors truncate">{club.name}</p>
                <p className="text-xs text-neutral-500">{club.memberCount} members &middot; {club.category}</p>
              </div>
              <ChevronRight size={15} className="text-neutral-300 shrink-0" />
            </Link>
          ))}
          <Link href="/directory" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline">
            Browse all clubs <ArrowRight size={11} />
          </Link>
        </div>
      )}
    </div>
  );
}

function CreateClub() {
  const [name,     setName]     = useState("");
  const [category, setCategory] = useState("Academic");
  const [desc,     setDesc]     = useState("");
  const [meeting,  setMeeting]  = useState("");
  const [done,     setDone]     = useState(false);

  const submit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); };

  if (done) return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check size={24} className="text-emerald-600" /></div>
      <h3 className="font-heading font-bold text-primary-800 text-lg mb-1">Club Submitted!</h3>
      <p className="text-sm text-neutral-500 mb-6">Your proposal is under review. You&apos;ll hear back within a few days.</p>
      <button onClick={() => setDone(false)} className="text-sm font-bold text-primary-600 hover:underline">Submit another</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid lg:grid-cols-[2fr_1.2fr] gap-8 items-start">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <h2 className="font-heading font-bold text-primary-800 text-lg mb-1">Create a New Club</h2>
            <p className="text-sm text-neutral-500 mb-6">Fill out the basics to propose your student club. You'll go through a quick approval process.</p>
          </div>
          
          <Field label="Club Name">
            <input required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="e.g. Photography Club" />
          </Field>
          <Field label="Category">
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
              {["Academic","STEM","Service","Arts","Cultural","Sports","Leadership"].map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Description">
            <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={inputCls + " resize-none"} placeholder="What is this club about?" />
          </Field>
          <Field label="Proposed Meeting Time">
            <input value={meeting} onChange={e => setMeeting(e.target.value)} className={inputCls} placeholder="e.g. Tuesdays at 3:30 PM, Room 104" />
          </Field>
          <button type="submit" className="w-full py-3 rounded-2xl bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold transition-colors">
            Submit Proposal
          </button>
          <p className="text-center text-xs text-neutral-400 pt-2">Want a full creation wizard? <Link href="/start-a-club" className="font-bold text-primary-600 hover:underline">Use the Club Builder</Link></p>
        </form>

        <div className="space-y-4 lg:sticky lg:top-32">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <h4 className="font-bold text-primary-800 text-sm mb-3">Quick Example</h4>
            <p className="text-xs text-neutral-600 mb-3 font-semibold">Club Name:</p>
            <p className="text-[13px] text-neutral-700 mb-4 font-mono bg-white p-2 rounded border border-cream-300">Photography Club</p>
            
            <p className="text-xs text-neutral-600 mb-3 font-semibold">Description:</p>
            <p className="text-[13px] text-neutral-700 mb-4 font-mono bg-white p-2 rounded border border-cream-300 line-clamp-3">Learn photography, explore creative expression, and showcase your work at school events.</p>
            
            <p className="text-xs text-neutral-600 mb-3 font-semibold">Meeting Time:</p>
            <p className="text-[13px] text-neutral-700 font-mono bg-white p-2 rounded border border-cream-300">Thursdays 4:00 PM, Room 204</p>
          </div>

          <div className="bg-secondary-50 border border-secondary-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-secondary-700 mb-2">💡 Pro Tip</p>
            <p className="text-xs text-neutral-600 leading-relaxed">Be specific about your club's mission. Include concrete details about meeting times to show you're serious.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitEvent() {
  const [title,    setTitle]    = useState("");
  const [date,     setDate]     = useState("");
  const [time,     setTime]     = useState("");
  const [location, setLocation] = useState("");
  const [club,     setClub]     = useState("");
  const [done,     setDone]     = useState(false);

  const submit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); };

  if (done) return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check size={24} className="text-emerald-600" /></div>
      <h3 className="font-heading font-bold text-primary-800 text-lg mb-1">Event Submitted!</h3>
      <p className="text-sm text-neutral-500 mb-6">Your event will appear in the calendar once approved.</p>
      <button onClick={() => setDone(false)} className="text-sm font-bold text-primary-600 hover:underline">Submit another</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid lg:grid-cols-[2fr_1.2fr] gap-8 items-start">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <h2 className="font-heading font-bold text-primary-800 text-lg mb-1">Submit an Event</h2>
            <p className="text-sm text-neutral-500 mb-6">Add a club event or school-wide gathering to the calendar. Include all the details members need to know.</p>
          </div>
          
          <Field label="Event Title">
            <input required value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Annual Science Fair" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Time">
              <input required type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label="Location">
            <input required value={location} onChange={e => setLocation(e.target.value)} className={inputCls} placeholder="e.g. Main Gymnasium" />
          </Field>
          <Field label="Hosting Club (optional)">
            <input value={club} onChange={e => setClub(e.target.value)} className={inputCls} placeholder="e.g. STEM Club" />
          </Field>
          <button type="submit" className="w-full py-3 rounded-2xl bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold transition-colors">
            Submit Event
          </button>
        </form>

        <div className="space-y-4 lg:sticky lg:top-32">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <h4 className="font-bold text-primary-800 text-sm mb-3">Example Event</h4>
            <p className="text-xs text-neutral-600 mb-2 font-semibold">Title:</p>
            <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">Winter Science Expo 2026</p>
            
            <p className="text-xs text-neutral-600 mb-2 font-semibold">Date & Time:</p>
            <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">March 15, 2026 at 2:00 PM</p>
            
            <p className="text-xs text-neutral-600 mb-2 font-semibold">Location:</p>
            <p className="text-[13px] text-neutral-700 font-mono bg-white p-2 rounded border border-cream-300">Main Gymnasium & Science Wing</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-blue-700 mb-2">📅 Best Practices</p>
            <ul className="text-xs text-neutral-600 space-y-1.5">
              <li>• Include specific times & locations</li>
              <li>• Add 2-3 weeks of notice</li>
              <li>• Use clear, descriptive titles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddResource() {
  const [title, setTitle] = useState("");
  const [type,  setType]  = useState("guide");
  const [url,   setUrl]   = useState("");
  const [desc,  setDesc]  = useState("");
  const [done,  setDone]  = useState(false);

  const submit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); };

  if (done) return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check size={24} className="text-emerald-600" /></div>
      <h3 className="font-heading font-bold text-primary-800 text-lg mb-1">Resource Suggested!</h3>
      <p className="text-sm text-neutral-500 mb-6">Thank you — our team will review your suggestion soon.</p>
      <button onClick={() => setDone(false)} className="text-sm font-bold text-primary-600 hover:underline">Suggest another</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid lg:grid-cols-[2fr_1.2fr] gap-8 items-start">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <h2 className="font-heading font-bold text-primary-800 text-lg mb-1">Suggest a Resource</h2>
            <p className="text-sm text-neutral-500 mb-6">Share guides, templates, handbooks, or tools that will help other clubs succeed.</p>
          </div>
          
          <Field label="Resource Title">
            <input required value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Grant Writing for Student Clubs" />
          </Field>
          <Field label="Type">
            <select value={type} onChange={e => setType(e.target.value)} className={inputCls}>
              <option value="guide">Guide</option>
              <option value="template">Template</option>
              <option value="checklist">Checklist</option>
              <option value="handbook">Handbook</option>
            </select>
          </Field>
          <Field label="Link (optional)">
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
          <Field label="Why is this useful?">
            <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={3} className={inputCls + " resize-none"} placeholder="Briefly describe what this covers and who it helps." />
          </Field>
          <button type="submit" className="w-full py-3 rounded-2xl bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold transition-colors">
            Submit Suggestion
          </button>
        </form>

        <div className="space-y-4 lg:sticky lg:top-32">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <h4 className="font-bold text-primary-800 text-sm mb-3">Example Resource</h4>
            <p className="text-xs text-neutral-600 mb-2 font-semibold">Title:</p>
            <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">Club Officer Meeting Agenda Template</p>
            
            <p className="text-xs text-neutral-600 mb-2 font-semibold">Type:</p>
            <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">Template</p>
            
            <p className="text-xs text-neutral-600 mb-2 font-semibold">Why it's useful:</p>
            <p className="text-[13px] text-neutral-700 font-mono bg-white p-2 rounded border border-cream-300 text-xs">Helps presidents structure efficient meetings with clear agendas, action items, and follow-ups.</p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-green-700 mb-2">📚 Types of Resources</p>
            <ul className="text-xs text-neutral-600 space-y-1.5">
              <li><strong>Guide:</strong> How-to articles</li>
              <li><strong>Template:</strong> Reusable forms</li>
              <li><strong>Checklist:</strong> Planning tools</li>
              <li><strong>Handbook:</strong> Complete reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Portal ────────────────────────────────────────────────
export default function PortalPage() {
  const [tab, setTab] = useState<Tab>("clubs");

  // Read initial tab from URL query param (e.g. /portal?tab=create)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab") as Tab;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-cream-200 min-h-screen diagonal-texture-light">

        {/* Header */}
      <div className="bg-primary-900 px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400 mb-2">Student Portal</p>
            <h1 className="text-2xl font-heading font-bold text-white">Your ClubConnect Hub</h1>
            <p className="mt-1 text-primary-200 text-sm">Create clubs, submit events, and manage your memberships.</p>
          </div>
          <Link href="/login?role=judge"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-secondary-400/40 text-secondary-300 text-sm font-bold hover:bg-secondary-500/10 transition-colors">
            <Gavel size={13} /> Judge Sign In
          </Link>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-cream-300 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? "border-secondary-500 text-primary-800"
                    : "border-transparent text-neutral-500 hover:text-primary-700"
                }`}
              >
                <Icon size={16} className={active ? "text-secondary-500" : "text-neutral-400"} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {tab === "clubs"    && <MyClubs />}
        {tab === "create"   && <CreateClub />}
        {tab === "event"    && <SubmitEvent />}
        {tab === "resource" && <AddResource />}
      </div>
      </div>
    </div>
  );
}
