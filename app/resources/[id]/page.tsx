"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { RESOURCES, TYPE_COLORS, STAGE_COLORS } from "@/lib/resourcesData";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, Download, FileText,
  Heart, MessageSquare, Send, Share2, Star, Tag, ThumbsUp, Users,
} from "lucide-react";

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button"
          onClick={() => onChange?.(i)}
          className={`transition-colors ${onChange ? "hover:scale-110" : "cursor-default"}`}>
          <Star size={16}
            className={i <= value
              ? "fill-amber-400 text-amber-400"
              : "fill-neutral-200 text-neutral-200"}
          />
        </button>
      ))}
      <span className="ml-1.5 text-sm font-medium text-neutral-500">{value.toFixed(1)}</span>
    </div>
  );
}

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const resource = RESOURCES.find(r => r.id === id);
  const [userRating, setUserRating] = useState(0);
  const [ratingDone, setRatingDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { name: "Alex P.", text: "This helped our club get approved in one shot. Highly recommend!", likes: 14, time: "2 days ago" },
    { name: "Jordan K.", text: "Super clear structure. Used it for our STEM club and it worked perfectly.", likes: 9, time: "5 days ago" },
  ]);
  const [commentSent, setCommentSent] = useState(false);

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-200 px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-heading font-bold text-primary-800 mb-2">Resource Not Found</h1>
          <Link href="/resources" className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-primary-600 hover:underline">
            <ArrowLeft size={13} /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const related = RESOURCES.filter(r => r.id !== id && (r.category === resource.category || r.type === resource.type)).slice(0, 3);
  const idx = RESOURCES.findIndex(r => r.id === id);
  const prev = idx > 0 ? RESOURCES[idx - 1] : null;
  const next = idx < RESOURCES.length - 1 ? RESOURCES[idx + 1] : null;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments(prev => [{ name: "You", text: comment.trim(), likes: 0, time: "just now" }, ...prev]);
    setComment("");
    setCommentSent(true);
  };

  const handleRating = (v: number) => {
    setUserRating(v);
    setRatingDone(true);
  };

  return (
    <div className="bg-cream-200 min-h-screen diagonal-texture-light">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-900" style={{ minHeight: "280px" }}>
        <div className="absolute inset-0">
          <Image src={resource.img} alt="" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/50" />
        </div>
        {/* texture */}
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.025) 18px, rgba(255,255,255,0.025) 19px)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20 md:pb-24">
          <Link href="/resources" className="inline-flex items-center gap-1 text-xs text-primary-300 hover:text-white mb-4 transition-colors">
            <ChevronLeft size={13} /> Back to Resources
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${TYPE_COLORS[resource.type]}`}>{resource.type}</span>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${STAGE_COLORS[resource.stage]}`}>{resource.stage}</span>
            <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-white/15 text-white">{resource.format}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">{resource.title}</h1>
          <p className="mt-2 text-primary-200 text-sm max-w-xl leading-relaxed">{resource.details}</p>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-white/70 text-xs">
            <span className="flex items-center gap-1"><Download size={12} className="text-secondary-400" /> {resource.downloads} downloads</span>
            <span className="flex items-center gap-1"><Heart size={12} className="text-secondary-400" /> {resource.saved + (saved ? 1 : 0)} saved</span>
          </div>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 42" preserveAspectRatio="none" className="block w-full h-7 md:h-9">
            <path d="M0,42 L0,20 C360,42 720,0 1080,20 C1260,30 1380,16 1440,20 L1440,42 Z" fill="#f5f0e8" />
          </svg>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">

          {/* ── MAIN (2/3) ── */}
          <div className="md:col-span-2 space-y-5">

            {/* Preview image */}
            <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden shadow-sm border border-cream-300">
              <Image src={resource.img} alt={resource.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                {resource.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full">
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
              <h2 className="font-heading font-bold text-primary-800 text-base mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-secondary-500" /> About this Resource
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">{resource.details}</p>
              <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                This {resource.type} is designed for clubs at the <span className="font-semibold text-primary-700">{resource.stage}</span> stage,
                falling under the <span className="font-semibold text-primary-700">{resource.category}</span> category.
                Available in {resource.format} format — ready to download and adapt for your club immediately.
              </p>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-primary-800 text-base">Community Rating</h2>
                <StarRating value={resource.rating} />
              </div>
              {ratingDone ? (
                <div className="flex items-center gap-2 py-3 px-4 bg-emerald-50 rounded-xl border border-emerald-200 text-sm text-emerald-700 font-medium">
                  <Check size={14} /> Thanks for rating! You gave this {userRating} star{userRating !== 1 ? "s" : ""}.
                </div>
              ) : (
                <div>
                  <p className="text-xs text-neutral-500 mb-3">Rate this resource:</p>
                  <StarRating value={userRating} onChange={handleRating} />
                </div>
              )}
            </div>

            {/* Feedback / Comments */}
            <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
              <h2 className="font-heading font-bold text-primary-800 text-base mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-secondary-500" /> Feedback
              </h2>
              <form onSubmit={handleComment} className="flex gap-3 mb-5">
                <input
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience with this resource..."
                  className="flex-1 border border-cream-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary-400/30"
                />
                <button type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold transition-colors shrink-0">
                  <Send size={12} /> Send
                </button>
              </form>
              {commentSent && (
                <div className="flex items-center gap-2 py-2 px-3 mb-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-700 font-medium">
                  <Check size={12} /> Comment posted!
                </div>
              )}
              <div className="space-y-3">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-cream-50 rounded-xl border border-cream-200">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-primary-800">{c.name}</p>
                        <p className="text-[10px] text-neutral-400">{c.time}</p>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{c.text}</p>
                      <button className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-neutral-400 hover:text-primary-600 transition-colors">
                        <ThumbsUp size={10} /> {c.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR (1/3) ── */}
          <aside className="space-y-5">
            {/* Download CTA */}
            <div className="bg-primary-900 rounded-2xl p-5 text-center">
              <FileText size={28} className="mx-auto text-secondary-400 mb-3" />
              <p className="font-heading font-bold text-white text-sm mb-1">{resource.title}</p>
              <p className="text-xs text-primary-300 mb-4">{resource.format} format</p>
              <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-bold transition-colors">
                <Download size={13} /> Download {resource.format}
              </button>
              <button onClick={() => setSaved(s => !s)}
                className={`mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full border text-xs font-bold transition-colors ${saved ? "border-red-400/40 text-red-300 hover:bg-red-500/10" : "border-white/20 text-white/80 hover:bg-white/10"}`}>
                <Heart size={12} className={saved ? "fill-red-400 text-red-400" : ""} />
                {saved ? "Saved" : "Save for later"}
              </button>
              <button className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2 rounded-full border border-white/15 text-white/60 text-xs hover:bg-white/5 transition-colors">
                <Share2 size={11} /> Share
              </button>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
              <h3 className="font-heading font-bold text-primary-800 text-sm mb-4">Details</h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Category", value: resource.category },
                  { label: "Type", value: resource.type },
                  { label: "Stage", value: resource.stage },
                  { label: "Format", value: resource.format },
                  { label: "Downloads", value: resource.downloads.toLocaleString() },
                  { label: "Rating", value: `${resource.rating} / 5` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">{label}</span>
                    <span className="font-bold text-primary-800 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
              <h3 className="font-heading font-bold text-primary-800 text-sm mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[10px] font-semibold rounded-full border border-primary-100">{tag}</span>
                ))}
              </div>
            </div>

            {/* Portal CTA */}
            <div className="bg-secondary-50 rounded-2xl border border-secondary-200 p-5">
              <p className="text-xs font-bold text-secondary-700 mb-2">Know a great resource?</p>
              <p className="text-xs text-secondary-700 leading-relaxed mb-3">Help other clubs by suggesting it through the Portal.</p>
              <Link href="/portal" className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-bold transition-colors">
                Suggest a Resource
              </Link>
            </div>
          </aside>
        </div>

        {/* ── RELATED ───────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary-400 mb-4">Related Resources</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/resources/${r.id}`}
                  className="bg-white rounded-2xl border border-cream-300 overflow-hidden hover:border-primary-300 hover:shadow-sm transition-all group">
                  <div className="relative aspect-[16/8] w-full overflow-hidden">
                    <Image src={r.img} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${TYPE_COLORS[r.type]}`}>{r.type}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-bold text-primary-800 text-sm leading-snug group-hover:text-primary-600 transition-colors">{r.title}</p>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{r.details}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-600 group-hover:gap-2 transition-all">
                      View <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── PREV / NEXT ────────────────────────────────────── */}
        <div className="border-t border-cream-400 pt-6 mt-8 flex items-center justify-between gap-4">
          {prev ? (
            <Link href={`/resources/${prev.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-cream-300 px-5 py-3 hover:border-primary-300 hover:shadow-sm transition-all group">
              <ChevronLeft size={18} className="text-primary-400 group-hover:text-primary-700 transition-colors" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Previous</p>
                <p className="text-sm font-bold text-primary-800 group-hover:text-primary-600 transition-colors">{prev.title}</p>
              </div>
            </Link>
          ) : <div />}
          <Link href="/resources" className="text-xs font-bold text-primary-500 hover:text-primary-700 transition-colors">All Resources</Link>
          {next ? (
            <Link href={`/resources/${next.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-cream-300 px-5 py-3 hover:border-primary-300 hover:shadow-sm transition-all group text-right">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Next</p>
                <p className="text-sm font-bold text-primary-800 group-hover:text-primary-600 transition-colors">{next.title}</p>
              </div>
              <ArrowRight size={18} className="text-primary-400 group-hover:text-primary-700 transition-colors" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
