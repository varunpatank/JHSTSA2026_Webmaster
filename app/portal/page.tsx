"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ArrowRight, BookOpen, Calendar, Check, ChevronRight, Gavel,
  LogIn, LogOut, Loader2, Upload, Users, Lock, UserCircle, Trash2, AlertTriangle, X,
} from "lucide-react";
import { chapters } from "@/lib/data";
import { getJoinedClubs, logoutUser, addCreatedChapter, addJoinedClub, removeJoinedClub, addCreatedEvent, addCreatedResource } from "@/lib/clientState";
import { supabase, resourcesApi, storageApi } from "@/lib/api";

type Tab = "clubs" | "event" | "resource" | "profile";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "clubs",    label: "Club",          icon: Users      },
  { id: "event",    label: "Submit Event",  icon: Calendar   },
  { id: "resource", label: "Add Resource",  icon: BookOpen   },
  { id: "profile",  label: "My Profile",    icon: UserCircle },
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
const inputCls = "w-full border border-cream-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary-400/30 focus:border-secondary-400 bg-white";

// ── Profile + Delete Account ───────────────────────────────────
function ProfileSettings({ onSignOut }: { onSignOut: () => void }) {
  const { data: session } = useSession();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const name  = session?.user?.name  || "—";
  const email = session?.user?.email || "—";
  const initials = name === "—" ? "?" : name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await supabase.auth.signOut();
    } catch {}
    logoutUser();
    setDeleted(true);
    setTimeout(() => signOut({ callbackUrl: "/" }), 1500);
  }

  if (deleted) return (
    <div className="text-center py-20">
      <div className="w-14 h-14 bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
        <Check size={22} className="text-red-500" />
      </div>
      <p className="text-sm font-bold text-neutral-700">Account data cleared. Signing you out&hellip;</p>
    </div>
  );

  return (
    <div className="max-w-lg">
      <h2 className="font-heading font-bold text-primary-800 text-lg mb-1">My Profile</h2>
      <p className="text-sm text-neutral-500 mb-8">Manage your account details and settings.</p>

      {/* Info card */}
      <div className="flex items-center gap-4 bg-white border border-cream-300 px-6 py-5 mb-8">
        <div className="w-14 h-14 bg-primary-900 text-white flex items-center justify-center text-lg font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-bold text-primary-900">{name}</p>
          <p className="text-sm text-neutral-500">{email}</p>
          <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-emerald-100 text-emerald-700">Active</span>
        </div>
      </div>

      {/* Sign out */}
      <div className="mb-6">
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-50 transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Danger zone */}
      <div className="border border-red-200 bg-red-50 p-5">
        <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <AlertTriangle size={13} /> Danger Zone
        </p>
        {confirmDelete ? (
          <div className="space-y-3">
            <p className="text-sm text-red-700 font-semibold">Are you sure? This will clear your local session and sign you out. Contact a school administrator to fully remove your account from the database.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60">
                <Trash2 size={13} /> {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-600 text-sm font-semibold hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-neutral-600 mb-3">Deleting your account will clear your session and local data.</p>
            <button onClick={handleDelete}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
              <Trash2 size={13} /> Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────
function MyClubs({ justJoined }: { justJoined?: boolean }) {
  const [enrolled, setEnrolled] = useState<ReturnType<typeof getJoinedClubs>>([]);

  useEffect(() => {
    setEnrolled(getJoinedClubs());
  }, []);

  // Enrich with chapter metadata where available
  const enriched = enrolled.map(rec => {
    const chapter = chapters.find(c => c.id === rec.id);
    return { ...rec, category: chapter?.category ?? "", memberCount: chapter?.memberCount ?? 0 };
  });

  return (
    <div>
      {justJoined && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          <Check size={16} className="shrink-0" />
          You&apos;ve joined the club! It&apos;s now in your list below.
        </div>
      )}
      <h2 className="font-heading font-bold text-primary-800 text-lg mb-1">Your Enrolled Clubs</h2>
      <p className="text-sm text-neutral-500 mb-6">Clubs you&apos;ve joined or are currently a member of.</p>
      {enriched.length === 0 ? (
        <div className="text-center py-16 bg-cream-100 rounded-xl border border-dashed border-cream-400">
          <p className="text-neutral-500 text-sm">You haven&apos;t joined any clubs yet.</p>
          <Link href="/directory" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-600 hover:underline">Browse Clubs <ArrowRight size={13} /></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {enriched.map(club => (
            <Link key={club.id} href={`/directory/${club.id}`}
              className="flex items-center gap-4 bg-white border border-cream-300 px-5 py-4 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 bg-primary-100 flex items-center justify-center shrink-0 text-primary-700">
                <Users size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary-800 text-sm group-hover:text-primary-600 transition-colors truncate">{club.name}</p>
                <p className="text-xs text-neutral-500">
                  {club.memberCount > 0 ? `${club.memberCount} members · ` : ""}
                  {club.category || "Club"}
                  {club.status === "pending" && <span className="ml-2 text-amber-600 font-semibold">(Pending approval)</span>}
                </p>
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
  const router = useRouter();
  const [name,            setName]            = useState("");
  const [category,        setCategory]        = useState("Academic");
  const [desc,            setDesc]            = useState("");
  const [meetingSchedule, setMeetingSchedule] = useState("");
  const [meetingRoom,     setMeetingRoom]     = useState("");
  const [advisorName,     setAdvisorName]     = useState("");
  const [advisorEmail,    setAdvisorEmail]    = useState("");
  const [advisorDept,     setAdvisorDept]     = useState("");
  const [gradeLevel,      setGradeLevel]      = useState("All Grades");
  const [membership,      setMembership]      = useState("Open Enrollment");
  const [requirements,    setRequirements]    = useState("");
  const [dues,            setDues]            = useState("");
  const [bannerUrl,       setBannerUrl]       = useState("");
  const [done,            setDone]            = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `user-club-${Date.now()}`;
    const chapter: import("@/types").Chapter = {
      id,
      name,
      description: desc,
      category: category as import("@/types").ChapterCategory,
      meetingFrequency: "Weekly",
      membershipStatus: membership as import("@/types").MembershipStatus,
      gradeLevel: gradeLevel as import("@/types").GradeLevel,
      meetingTime: "After School",
      advisor: { name: advisorName, email: advisorEmail, department: advisorDept || "Staff" },
      officers: [],
      meetingSchedule,
      meetingLocation: { lat: 0, lng: 0, room: meetingRoom },
      membershipRequirements: requirements,
      dues,
      socialLinks: {},
      achievements: [],
      photoGallery: bannerUrl.startsWith("http") ? [bannerUrl] : [],
      memberCount: 0,
      foundedYear: new Date().getFullYear(),
      isActive: true,
    };
    addCreatedChapter(chapter);
    addJoinedClub({ id, name, status: "member" });
    setDone(true);
    setTimeout(() => router.push(`/directory/${id}`), 1500);
  };

  if (done) return (
    <div className="text-center py-10">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3"><Check size={20} className="text-emerald-600" /></div>
      <h3 className="font-heading font-bold text-primary-800 text-base mb-1">Request Sent!</h3>
      <p className="text-sm text-neutral-500 mb-1">Your club has been added. Taking you there now&hellip;</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <h2 className="font-heading font-bold text-primary-800 text-base mb-1">Create a Club</h2>
        <p className="text-sm text-neutral-500 mb-3">Submit a new club — it will appear in the directory immediately.</p>
      </div>
      <Field label="Club Name">
        <input required value={name} onChange={e => setName(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. Photography Club" />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Category">
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls + " rounded-xl"}>
            {["Academic","STEM","Service","Arts","Cultural","Sports","Leadership","Media"].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Grade Level">
          <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} className={inputCls + " rounded-xl"}>
            {["All Grades","9th Only","10th-12th"].map(g => <option key={g}>{g}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Description">
        <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={2} className={inputCls + " resize-none rounded-xl"} placeholder="What is this club about?" />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Meeting Schedule">
          <input value={meetingSchedule} onChange={e => setMeetingSchedule(e.target.value)} className={inputCls + " rounded-xl"} placeholder="Tuesdays 3:30 PM" />
        </Field>
        <Field label="Room / Location">
          <input value={meetingRoom} onChange={e => setMeetingRoom(e.target.value)} className={inputCls + " rounded-xl"} placeholder="Room 204" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Membership Type">
          <select value={membership} onChange={e => setMembership(e.target.value)} className={inputCls + " rounded-xl"}>
            {["Open Enrollment","Application Required","Tryout Required"].map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Dues (blank = none)">
          <input value={dues} onChange={e => setDues(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. $20/semester" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Advisor Name">
          <input value={advisorName} onChange={e => setAdvisorName(e.target.value)} className={inputCls + " rounded-xl"} placeholder="Ms. Johnson" />
        </Field>
        <Field label="Advisor Email">
          <input type="email" value={advisorEmail} onChange={e => setAdvisorEmail(e.target.value)} className={inputCls + " rounded-xl"} placeholder="advisor@school.edu" />
        </Field>
      </div>
      <Field label="Advisor Department">
        <input value={advisorDept} onChange={e => setAdvisorDept(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. Science Department" />
      </Field>
      <Field label="Membership Requirements">
        <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={2} className={inputCls + " resize-none rounded-xl"} placeholder="Any requirements to join..." />
      </Field>
      <Field label="Banner Image URL (optional)">
        <input value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} className={inputCls + " rounded-xl"} placeholder="https://images.unsplash.com/..." />
      </Field>
      <button type="submit" className="w-full py-2.5 rounded-xl bg-primary-900 text-white text-sm font-bold hover:bg-primary-800 transition-colors">
        Create Club
      </button>
    </form>
  );
}

function SubmitEvent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title,       setTitle]       = useState("");
  const [date,        setDate]        = useState("");
  const [startTime,   setStartTime]   = useState("");
  const [endTime,     setEndTime]     = useState("");
  const [location,    setLocation]    = useState("");
  const [description, setDescription] = useState("");
  const [category,    setCategory]    = useState("Academic");
  const [clubName,    setClubName]    = useState("");
  const [imageUrl,    setImageUrl]    = useState("");
  const [done,        setDone]        = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `user-event-${Date.now()}`;
    addCreatedEvent({
      id,
      clubId: "",
      clubName,
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      imageUrl: imageUrl.startsWith("http") ? imageUrl : undefined,
      category,
      createdBy: session?.user?.email || "anonymous",
      createdAt: new Date().toISOString(),
    });
    setDone(true);
    setTimeout(() => router.push(`/events`), 1500);
  };

  if (done) return (
    <div className="bg-white rounded-2xl border border-cream-300 p-8 max-w-lg mx-auto text-center">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3"><Check size={20} className="text-emerald-600" /></div>
      <h3 className="font-heading font-bold text-primary-800 text-base mb-1">Event Submitted!</h3>
      <p className="text-sm text-neutral-500">Taking you to the events page&hellip;</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white rounded-2xl border border-cream-300 p-6">
        <h2 className="font-heading font-bold text-primary-800 text-base mb-1">Submit an Event</h2>
        <p className="text-sm text-neutral-500 mb-4">Add a club event or school-wide gathering to the calendar.</p>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Event Title *">
            <input required value={title} onChange={e => setTitle(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. Annual Science Fair" />
          </Field>
          <Field label="Description *">
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputCls + " resize-none rounded-xl"} placeholder="What is this event about?" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Date *">
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls + " rounded-xl"} />
            </Field>
            <Field label="Category">
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls + " rounded-xl"}>
                {["Academic","STEM","Service","Arts","Cultural","Sports","Leadership","General"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start Time *">
              <input required type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputCls + " rounded-xl"} />
            </Field>
            <Field label="End Time *">
              <input required type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputCls + " rounded-xl"} />
            </Field>
          </div>
          <Field label="Location *">
            <input required value={location} onChange={e => setLocation(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. Main Gymnasium" />
          </Field>
          <Field label="Hosting Club (optional)">
            <input value={clubName} onChange={e => setClubName(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. STEM Club" />
          </Field>
          <Field label="Event Image URL (optional)">
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={inputCls + " rounded-xl"} placeholder="https://images.unsplash.com/..." />
          </Field>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-primary-900 text-white text-sm font-bold hover:bg-primary-800 transition-colors">
            Submit Event
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-4">
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
          <h4 className="font-bold text-primary-800 text-sm mb-3">Example Event</h4>
          <p className="text-xs text-neutral-600 mb-1 font-semibold">Title:</p>
          <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">Winter Science Expo 2026</p>
          <p className="text-xs text-neutral-600 mb-1 font-semibold">Date &amp; Time:</p>
          <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">March 15, 2026 · 2:00 PM – 5:00 PM</p>
          <p className="text-xs text-neutral-600 mb-1 font-semibold">Location:</p>
          <p className="text-[13px] text-neutral-700 font-mono bg-white p-2 rounded border border-cream-300">Main Gymnasium &amp; Science Wing</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-700 mb-2">Best Practices</p>
          <ul className="text-xs text-neutral-600 space-y-1.5">
            <li>• Include specific times &amp; locations</li>
            <li>• Give 2–3 weeks of notice</li>
            <li>• Use clear, descriptive titles</li>
            <li>• Add an image to make it stand out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AddResource() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [type,        setType]        = useState("guide");
  const [subject,     setSubject]     = useState("");
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [dragOver,    setDragOver]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState("");
  const [done,        setDone]        = useState(false);

  const TYPE_IMAGES: Record<string, string> = {
    guide:     "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    template:  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
    checklist: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    handbook:  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  };

  const handleDrop = (file: File) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF, JPG, PNG, or WebP files are allowed.");
      return;
    }
    setError("");
    setDroppedFile(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!droppedFile) { setError("Please attach a file."); return; }
    setSubmitting(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileSize = droppedFile.size < 1024 * 1024
        ? `${(droppedFile.size / 1024).toFixed(0)} KB`
        : `${(droppedFile.size / (1024 * 1024)).toFixed(1)} MB`;
      const format = droppedFile.name.split(".").pop()?.toUpperCase() || "FILE";

      let resourceLink = "";
      if (user) {
        const uploadRes = await storageApi.uploadFile(user.id, droppedFile, "uploads");
        if (uploadRes.data) resourceLink = uploadRes.data.publicUrl;
      }

      if (resourceLink && user) {
        await resourcesApi.create({
          name: title,
          description,
          category: "Community",
          type,
          resource_link: resourceLink,
          file_size: fileSize,
          format,
          created_by: user.id,
        } as any);
      }

      // Also store locally for immediate display
      addCreatedResource({
        id: `user-resource-${Date.now()}`,
        title,
        description,
        category: "Community",
        type,
        resourceUrl: resourceLink || "",
        imageUrl: TYPE_IMAGES[type] || TYPE_IMAGES.guide,
        subject,
        createdBy: session?.user?.email || "anonymous",
        createdAt: new Date().toISOString(),
      });

      setDone(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  if (done) return (
    <div className="bg-white rounded-2xl border border-cream-300 p-8 max-w-lg mx-auto text-center">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
        <Check size={20} className="text-emerald-600" />
      </div>
      <h3 className="font-heading font-bold text-primary-800 text-base mb-1">Resource Added!</h3>
      <p className="text-sm text-neutral-500 mb-4">Your resource is now available in the Community Resources section.</p>
      <Link href="/resources?cat=Community" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:underline">
        View Community Resources <ArrowRight size={13} />
      </Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white rounded-2xl border border-cream-300 p-6">
        <h2 className="font-heading font-bold text-primary-800 text-base mb-1">Add a Resource</h2>
        <p className="text-sm text-neutral-500 mb-4">Upload a PDF or image to share with other clubs. It will appear under Community Resources.</p>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Resource Title *">
            <input required value={title} onChange={e => setTitle(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. Grant Writing for Student Clubs" />
          </Field>
          <Field label="Description *">
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputCls + " resize-none rounded-xl"} placeholder="Briefly describe what this covers and who it helps." />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Type">
              <select value={type} onChange={e => setType(e.target.value)} className={inputCls + " rounded-xl"}>
                {["guide", "template", "checklist", "handbook"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <input value={subject} onChange={e => setSubject(e.target.value)} className={inputCls + " rounded-xl"} placeholder="e.g. Fundraising" />
            </Field>
          </div>

          {/* File drop zone */}
          <Field label="Attach File * (PDF or image)">
            <input ref={fileInputRef} type="file" accept=".pdf,image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleDrop(f); }} />
            {droppedFile ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50">
                <Upload size={16} className="text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-emerald-800 truncate">{droppedFile.name}</p>
                  <p className="text-xs text-emerald-600">
                    {droppedFile.size < 1024 * 1024
                      ? `${(droppedFile.size / 1024).toFixed(0)} KB`
                      : `${(droppedFile.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
                <button type="button" onClick={() => setDroppedFile(null)} className="text-emerald-500 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleDrop(f); }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed p-6 text-center cursor-pointer rounded-xl transition-all ${
                  dragOver ? "border-secondary-400 bg-secondary-50/20" : "border-cream-300 hover:border-primary-300 hover:bg-cream-100/50"
                }`}
              >
                <Upload size={24} className="mx-auto text-neutral-400 mb-2" />
                <p className="text-sm font-medium text-neutral-600">Drag &amp; drop or click to upload</p>
                <p className="text-xs text-neutral-400 mt-1">PDF, JPG, or PNG · up to 10 MB</p>
              </div>
            )}
          </Field>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-primary-900 text-white text-sm font-bold hover:bg-primary-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Uploading&hellip;</> : "Add Resource"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-4">
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
          <h4 className="font-bold text-primary-800 text-sm mb-3">Example Resource</h4>
          <p className="text-xs text-neutral-600 mb-1 font-semibold">Title:</p>
          <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">Club Officer Meeting Agenda Template</p>
          <p className="text-xs text-neutral-600 mb-1 font-semibold">Type:</p>
          <p className="text-[13px] text-neutral-700 mb-3 font-mono bg-white p-2 rounded border border-cream-300">Template</p>
          <p className="text-xs text-neutral-600 mb-1 font-semibold">Why it&apos;s useful:</p>
          <p className="text-[13px] text-neutral-700 font-mono bg-white p-2 rounded border border-cream-300 text-xs">Helps presidents structure efficient meetings with clear agendas.</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1.5"><BookOpen size={14} /> Accepted Formats</p>
          <ul className="text-xs text-neutral-600 space-y-1.5">
            <li>• <strong>PDF</strong> — documents, handbooks, guides</li>
            <li>• <strong>Image (JPG/PNG)</strong> — infographics, flyers, posters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main Portal ────────────────────────────────────────────────
export default function PortalPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("clubs");
  const [isWelcome, setIsWelcome] = useState(false);
  const [justJoined, setJustJoined] = useState(false);
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Student";

  // Read initial tab + welcome flag from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab") as Tab;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
    if (params.get("welcome") === "1") setIsWelcome(true);
    if (params.get("joined") === "true") { setJustJoined(true); setTab("clubs"); }
  }, []);

  // For unauthenticated users: gate tabs that require an account
  const gatedTabs: Tab[] = ["clubs", "event", "resource", "profile"];
  const isGated = !isAuthed && gatedTabs.includes(tab);

  async function handleSignOut() {
    try { await supabase.auth.signOut(); } catch {}
    logoutUser();
    signOut({ callbackUrl: "/" });
  }

  const [judgeLoading, setJudgeLoading] = useState(false);
  async function handleJudgeLogin() {
    setJudgeLoading(true);
    try {
      await supabase.auth.signInWithPassword({ email: "judge@jhstsa.edu", password: "Judge!1" });
      const res = await signIn("credentials", { email: "judge@jhstsa.edu", password: "Judge!1", redirect: false });
      if (res?.ok) router.refresh();
    } catch {}
    setJudgeLoading(false);
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-cream-200 min-h-screen">

        {/* Header — personalised when signed in */}
        <div className="bg-primary-900 px-4 sm:px-6 py-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400 mb-2">Student Portal</p>
              {isAuthed ? (
                <>
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">
                    {isWelcome ? `Welcome to ClubConnect, ${userName}!` : `Welcome back, ${userName}`}
                  </h1>
                  <p className="mt-1 text-primary-200 text-sm">
                    {isWelcome
                      ? "Your account is ready. Create clubs, submit events, and manage your memberships."
                      : "Create clubs, submit events, and manage your memberships."}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-white">Your ClubConnect Hub</h1>
                  <p className="mt-1 text-primary-200 text-sm">Sign in to create clubs, submit events, and manage memberships.</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/references"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-800 hover:bg-primary-700 text-white text-sm font-bold transition-colors border border-primary-600">
                <BookOpen size={13} /> References
              </Link>
              {isAuthed ? (
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors">
                  <LogOut size={13} /> Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={handleJudgeLogin}
                    disabled={judgeLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-secondary-400/40 text-secondary-300 text-sm font-bold hover:bg-secondary-500/10 transition-colors disabled:opacity-60">
                    <Gavel size={13} /> {judgeLoading ? "Signing in…" : "Judge Sign In"}
                  </button>
                  <Link href="/login"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors">
                    <LogIn size={13} /> Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border-b border-cream-300 sticky top-[60px] z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-3 py-4">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              const locked = !isAuthed && gatedTabs.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-[15px] font-semibold rounded-full transition-colors ${
                    active
                      ? "bg-primary-900 text-white"
                      : "bg-cream-100 text-neutral-600 hover:bg-cream-200 hover:text-primary-800"
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                  {locked && <Lock size={12} className="ml-0.5 opacity-40" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {isGated ? (
            <div className="text-center py-20 bg-white border border-cream-300 rounded-2xl">
              <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={22} className="text-primary-400" />
              </div>
              <h2 className="text-lg font-heading font-bold text-primary-900 mb-2">Account Required</h2>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto mb-6">
                {tab === "clubs" ? "Sign in to view your enrolled clubs and create new ones." : tab === "event" ? "You need a ClubConnect account to submit an event." : tab === "resource" ? "You need a ClubConnect account to add a resource." : "You need a ClubConnect account to view your profile."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white text-sm font-bold hover:brightness-110 transition-colors">
                  Create Account
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-50 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {tab === "clubs"    && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="bg-white rounded-2xl border border-cream-300 p-6">
                    <MyClubs justJoined={justJoined} />
                  </div>
                  <div className="bg-white rounded-2xl border border-cream-300 p-6">
                    <CreateClub />
                  </div>
                </div>
              )}
              {tab === "event"    && <SubmitEvent />}
              {tab === "resource" && <AddResource />}
              {tab === "profile"  && <ProfileSettings onSignOut={handleSignOut} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
