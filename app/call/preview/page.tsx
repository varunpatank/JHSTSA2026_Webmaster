"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Copy, Mic, MicOff, PhoneCall, Video, VideoOff } from "lucide-react";

function CallPreviewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");
  const room = (roomParam || "ClubConnect-Meeting").trim();
  const returnToParam = searchParams.get("returnTo") || "/";
  const returnTo = returnToParam.startsWith("/") ? returnToParam : "/";
  const backLabel = returnTo.startsWith("/directory/") ? "Back to Club" : "Back";

  const [displayName, setDisplayName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/call/${encodeURIComponent(room)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    if (!displayName.trim()) return;
    const q = new URLSearchParams();
    q.set("name", displayName.trim());
    q.set("mic", String(micOn));
    q.set("cam", String(camOn));
    q.set("returnTo", returnTo);
    router.push(`/call/${encodeURIComponent(room)}?${q.toString()}`);
  };

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl animate-fade-up">
        <Link href={returnTo} className="inline-flex items-center gap-1.5 text-primary-300 hover:text-white text-sm mb-5 transition-colors">
          <ArrowLeft size={16} /> {backLabel}
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-primary-100">
          <div className="bg-primary-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <PhoneCall size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading">Join Meeting</h1>
                <p className="text-sm text-primary-200">ClubConnect Video Call</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-slate-900 rounded-xl aspect-video flex flex-col items-center justify-center relative overflow-hidden border border-slate-700">
              {camOn ? (
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <p className="text-white/70 text-sm mt-3">{displayName || "Enter your name below"}</p>
                </div>
              ) : (
                <div className="relative z-10 text-center">
                  <VideoOff size={40} className="text-white/40 mx-auto" />
                  <p className="text-white/50 text-sm mt-2">Camera is off</p>
                </div>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${micOn ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-500 text-white"}`}
                >
                  {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                  onClick={() => setCamOn(!camOn)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${camOn ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-500 text-white"}`}
                >
                  {camOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Your Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name..."
                className="input-field"
              />
            </div>

            <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-neutral-500">Meeting Room</p>
                  <p className="text-sm font-mono font-semibold text-primary-700 truncate max-w-[250px]">{room}</p>
                </div>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            <button
              onClick={handleJoin}
              disabled={!displayName.trim()}
              className="w-full btn-primary text-center py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PhoneCall size={20} /> Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CallPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-900 flex items-center justify-center text-white">Loading...</div>}>
      <CallPreviewInner />
    </Suspense>
  );
}
