"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, eventsApi, organizationsApi, storageApi } from "@/lib/api";
import { chapters } from "@/lib/data";
import { addCreatedEvent } from "@/lib/clientState";
import { ImagePlus, FileUp, X, Calendar, MapPin, Clock, Upload, Loader2 } from "lucide-react";

interface EventSubmissionFormProps {
  initialClubId?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export default function EventSubmissionForm({
  initialClubId,
  isModal,
  onClose,
}: EventSubmissionFormProps) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [clubId, setClubId] = useState(initialClubId || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Other");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDragOver, setImageDragOver] = useState(false);
  const [resourceFiles, setResourceFiles] = useState<{ name: string; size: string; file: File }[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [maxAttendees, setMaxAttendees] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);

  const [availableClubs, setAvailableClubs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await organizationsApi.getAll();
      if (!cancelled) {
        const clubs = data && data.length > 0
          ? data.map((o: any) => ({ id: o.id, name: o.name }))
          : chapters.slice(0, 6).map((c) => ({ id: c.id, name: c.name }));
        setAvailableClubs(clubs);
        if (!initialClubId && clubs[0]) setClubId(clubs[0].id);
        setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [initialClubId]);

  if (!loaded) {
    if (isModal) return null;
    return <div className="min-h-screen bg-neutral-100" />;
  }

  const handleImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleResourceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((f) => ({
        name: f.name,
        size: f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        file: f,
      }));
      setResourceFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to create an event.");
        setSubmitting(false);
        return;
      }

      let image_url: string | undefined;
      if (imageFile) {
        const uploadRes = await storageApi.uploadFile(user.id, imageFile, 'uploads');
        if (uploadRes.data) image_url = uploadRes.data.publicUrl;
      }

      const eventData: Record<string, any> = {
        name: title,
        description,
        time: date ? new Date(`${date}T${startTime || '00:00'}`).toISOString() : undefined,
        start_time: startTime,
        end_time: endTime,
        location_text: location,
        category,
        is_public: isPublic,
        max_attendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
        image_url,
        created_by: user.id,
        org_id: clubId || undefined,
      };

      const { data: newEvent, error: dbErr } = await eventsApi.create(eventData);
      if (dbErr) {
        setError(dbErr.message || "Failed to create event.");
        setSubmitting(false);
        return;
      }

      // Persist to clientState so the events list can display it immediately
      // and the detail page can fall back to it if RLS blocks the DB read
      if (newEvent) {
        const club = availableClubs.find(c => c.id === clubId);
        addCreatedEvent({
          id: newEvent.id,
          clubId: clubId || "",
          clubName: club?.name || "",
          title,
          description,
          date,
          startTime,
          endTime,
          location,
          imageUrl: image_url,
          category,
          createdBy: user.id,
          createdAt: new Date().toISOString(),
        });
      }

      if (isModal && onClose) {
        onClose();
      } else {
        router.push(newEvent?.id ? `/events/${newEvent.id}` : "/events");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["Competition", "Social", "Workshop", "Meeting", "Performance", "Fundraiser", "Other"];

  const formContent = (
    <form className={isModal ? "space-y-3" : "card p-6 space-y-4"} onSubmit={onSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1">Hosting club</label>
          <select className="select-field" value={clubId} onChange={(e) => setClubId(e.target.value)} required>
            {availableClubs.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1">Category</label>
          <select className="select-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1">Event title</label>
        <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Spring Robotics Showcase" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1">Description</label>
        <textarea className={`input-field ${isModal ? "min-h-16" : "min-h-24"}`} value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="What is this event about?" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1">Event Image</label>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        {imagePreview ? (
          <div className="relative  overflow-hidden border border-neutral-200">
            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
            <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); if (imageInputRef.current) imageInputRef.current.value = ""; }}
              className="absolute top-2 right-2 p-1  bg-black/50 text-white hover:bg-black/70">
              <X size={16} />
            </button>
          </div>
        ) : (
            <div
            onDragOver={(e) => { e.preventDefault(); setImageDragOver(true); }}
            onDragLeave={() => setImageDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setImageDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleImageFile(f); }}
            onClick={() => imageInputRef.current?.click()}
            className={`w-full border-2 border-dashed p-6 text-center cursor-pointer transition-all group ${
              imageDragOver ? "border-primary-500 bg-primary-50/50" : "border-neutral-300 hover:border-primary-400 hover:bg-primary-50/30"
            }`}
          >
            <ImagePlus size={28} className="mx-auto text-neutral-400 group-hover:text-primary-500 mb-2" />
            <p className="text-sm font-medium text-neutral-600">Drag &amp; drop or click to upload</p>
            <p className="text-xs text-neutral-400 mt-1">PNG, JPG, or WebP up to 5MB</p>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-neutral-700 mb-1 flex items-center gap-1"><Calendar size={14} /> Date</label>
          <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-700 mb-1 flex items-center gap-1"><MapPin size={14} /> Location</label>
          <input className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Room 204, Gym, etc." />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-neutral-700 mb-1 flex items-center gap-1"><Clock size={14} /> Start time</label>
          <input type="time" className="input-field" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-700 mb-1 flex items-center gap-1"><Clock size={14} /> End time</label>
          <input type="time" className="input-field" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1">Max attendees</label>
          <input type="number" className="input-field" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} placeholder="Leave blank for unlimited" min="1" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="w-4 h-4 accent-primary-500" />
            <span className="text-sm font-medium text-neutral-700">Open to all students</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1">Attach Resources</label>
        <input ref={resourceInputRef} type="file" multiple className="hidden" onChange={handleResourceSelect} />
        <button type="button" onClick={() => resourceInputRef.current?.click()}
          className="w-full border border-neutral-200  p-3 text-center hover:border-primary-300 hover:bg-primary-50/30 transition-all flex items-center justify-center gap-2 text-sm text-neutral-600">
          <FileUp size={16} /> Add PDFs, documents, or other resources
        </button>
        {resourceFiles.length > 0 && (
          <div className="mt-2 space-y-1">
            {resourceFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-neutral-50  text-sm">
                <Upload size={12} className="text-primary-500" />
                <span className="flex-1 truncate text-neutral-700">{f.name}</span>
                <span className="text-xs text-neutral-400">{f.size}</span>
                <button type="button" onClick={() => setResourceFiles((prev) => prev.filter((_, j) => j !== i))} className="text-neutral-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
        {submitting ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : <><Upload size={16} /> Publish Event</>}
      </button>
      {error && <p className="text-sm text-red-600 font-medium mt-2">{error}</p>}

      {!isModal && (
        <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap gap-3 text-sm">
          <a href="/events" className="text-primary-600 hover:underline">← All Events</a>
          <a href="/directory" className="text-primary-600 hover:underline">Club Directory</a>
          <a href="/guidance" className="text-primary-600 hover:underline">Guidance</a>
          <a href="/resources" className="text-primary-600 hover:underline">Resources</a>
        </div>
      )}
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
        <div className="bg-white  shadow-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-5 pb-3 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-primary-700">Create New Event</h2>
            <button onClick={onClose} className="p-1.5  hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"><X size={20} /></button>
          </div>
          <div className="p-5">{formContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-500 text-white border-b-4 border-secondary-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-4xl font-heading font-bold">Event Submission</h1>
          <p className="mt-2 text-neutral-100">
            Create a club event to publish it on the club page, homepage events
            section, and events listing.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {formContent}
      </section>
    </div>
  );
}
