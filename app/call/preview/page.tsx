"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneCall,
  ArrowLeft,
  Users,
  Copy,
  Check,
} from "lucide-react";
import Whiteboard from "@/components/Whiteboard";

function CallPreviewInner() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");
  const room = roomParam || "ClubConnect-Meeting";

  const [displayName, setDisplayName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [joined, setJoined] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/call/${encodeURIComponent(room)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-fade-up">
          <Link
            href="/meetings"
            className="inline-flex items-center gap-1.5 text-primary-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Meetings
          </Link>

          <div className="bg-white  shadow-2xl overflow-hidden">
            <div className="bg-primary-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm  flex items-center justify-center">
                  <PhoneCall size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-heading">
                    Join Meeting
                  </h1>
                  <p className="text-sm text-primary-200">
                    ClubConnect Video Call
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900  aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 bg-primary-400 rounded-full blur-3xl" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-secondary-400 rounded-full blur-3xl" />
                </div>
                {camOn ? (
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <p className="text-white/70 text-sm mt-3">
                      {displayName || "Enter your name below"}
                    </p>
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
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name..."
                  className="input-field"
                />
              </div>

              <div className="bg-neutral-50  p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">Meeting Room</p>
                    <p className="text-sm font-mono font-semibold text-primary-700 truncate max-w-[250px]">
                      {room}
                    </p>
                  </div>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-100 text-primary-700  hover:bg-primary-200 transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setJoined(true)}
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

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white/95 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center  font-bold">
            CC
          </div>
          <div>
            <p className="font-semibold text-sm">ClubConnect Meeting</p>
            <p className="text-xs text-neutral-500 font-mono">{room}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="px-3 py-1.5 text-sm border border-neutral-200  hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Invite"}
          </button>
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-9 h-9  flex items-center justify-center transition-all ${micOn ? "bg-primary-500 text-white" : "bg-red-500 text-white"}`}
          >
            {micOn ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
          <button
            onClick={() => setCamOn(!camOn)}
            className={`w-9 h-9  flex items-center justify-center transition-all ${camOn ? "bg-primary-500 text-white" : "bg-red-500 text-white"}`}
          >
            {camOn ? <Video size={16} /> : <VideoOff size={16} />}
          </button>
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`px-3 py-1.5 text-sm  border transition-all flex items-center gap-1.5 ${showWhiteboard ? "bg-primary-500 text-white border-primary-500" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}
          >
            <Monitor size={14} /> Whiteboard
          </button>
          <Link
            href="/meetings"
            className="px-3 py-1.5 bg-red-500 text-white text-sm  hover:bg-red-600 transition-colors"
          >
            Leave
          </Link>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className={`flex-1 p-4 ${showWhiteboard ? "w-1/2" : "w-full"}`}>
          <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900  flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-48 h-48 bg-primary-400 rounded-full blur-3xl animate-drift-slower" />
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-400 rounded-full blur-3xl animate-drift-slow" />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl mx-auto">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-white text-xl font-bold mt-4">
                {displayName}
              </h2>
              <div className="flex items-center gap-3 justify-center mt-3">
                {!micOn && (
                  <span className="flex items-center gap-1 text-red-400 text-sm">
                    <MicOff size={14} /> Muted
                  </span>
                )}
                {!camOn && (
                  <span className="flex items-center gap-1 text-red-400 text-sm">
                    <VideoOff size={14} /> Camera Off
                  </span>
                )}
                {micOn && camOn && (
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <Users size={14} /> Connected
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm mt-6">
                Share the meeting link to invite others to this room
              </p>
            </div>
          </div>
        </div>

        {showWhiteboard && (
          <div className="w-1/2 p-4 pl-0">
            <div className="h-full bg-white  overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  Collaborative Whiteboard
                </h3>
                <button
                  onClick={() => setShowWhiteboard(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-700"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 p-3 overflow-auto">
                <Whiteboard width={600} height={500} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-900 flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <CallPreviewInner />
    </Suspense>
  );
}
