'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';

declare global { interface Window { JitsiMeetExternalAPI: any } }

export default function FullScreenCall({ room, displayName, startMuted = false, startVideoOff = false, returnTo = "/" }: { room: string; displayName?: string; startMuted?: boolean; startVideoOff?: boolean; returnTo?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!window.JitsiMeetExternalAPI) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://meet.jit.si/external_api.js';
          s.async = true;
          s.onload = () => resolve();
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }

      if (!mounted) return;
      const domain = 'meet.jit.si';
      const options = {
        roomName: room,
        width: '100%',
        height: '100%',
        parentNode: ref.current,
        interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false, TOOLBAR_BUTTONS: [] },
        configOverwrite: { disableDeepLinking: true }
      };
      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
      apiRef.current.addEventListener('videoConferenceJoined', () => {
        setConnected(true);
        if (displayName) apiRef.current.executeCommand('displayName', displayName);
        if (startMuted) apiRef.current.executeCommand('toggleAudio');
        if (startVideoOff) apiRef.current.executeCommand('toggleVideo');
      });
      apiRef.current.addEventListener('audioMuteStatusChanged', (e: any) => setMuted(!!e.muted));
      apiRef.current.addEventListener('videoMuteStatusChanged', (e: any) => setVideoOff(!!e.muted));
    }
    init().catch((err) => console.error('Jitsi load failed', err));
    return () => { mounted = false; try { apiRef.current?.dispose(); } catch (e) {} };
  }, [room, displayName]);

  function toggleAudio() { apiRef.current?.executeCommand('toggleAudio'); }
  function toggleVideo() { apiRef.current?.executeCommand('toggleVideo'); }
  function hangup() {
    apiRef.current?.executeCommand('hangup');
    window.location.href = returnTo;
  }
  function copyInvite() {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 shadow-md border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-900 text-white flex items-center justify-center rounded-2xl font-bold">CC</div>
          <div>
            <div className="font-semibold">ClubConnect — Live Call</div>
            <div className="text-xs text-neutral-500">{room} {connected ? '• Connected' : '• Connecting...'}</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button onClick={copyInvite} className="px-3 py-2 rounded-2xl border border-neutral-300 hover:bg-neutral-50 text-sm inline-flex items-center gap-1.5">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Invite'}
          </button>
          <button
            onClick={toggleAudio}
            className={`px-3 py-2 rounded-2xl text-sm inline-flex items-center gap-1.5 ${muted ? 'bg-neutral-100 border border-neutral-300 text-neutral-700' : 'bg-primary-900 text-white'}`}
          >
            {muted ? <MicOff size={14} /> : <Mic size={14} />}
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <button
            onClick={toggleVideo}
            className={`px-3 py-2 rounded-2xl text-sm inline-flex items-center gap-1.5 ${videoOff ? 'bg-neutral-100 border border-neutral-300 text-neutral-700' : 'bg-primary-900 text-white'}`}
          >
            {videoOff ? <VideoOff size={14} /> : <Video size={14} />}
            {videoOff ? 'Start Video' : 'Stop Video'}
          </button>
          <button onClick={hangup} className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm inline-flex items-center gap-1.5 transition-colors">
            <PhoneOff size={14} /> Leave
          </button>
        </div>
      </div>

      {}
      <div className="flex-1 relative">
        <div ref={ref} className="absolute inset-0 bg-black" />
        <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/55 backdrop-blur-md rounded-2xl border border-white/15 px-3 py-2 flex items-center gap-2">
            <button
              onClick={copyInvite}
              className="w-10 h-10 rounded-xl bg-white/15 text-white inline-flex items-center justify-center"
              aria-label="Copy invite"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={toggleAudio}
              className={`w-10 h-10 rounded-xl inline-flex items-center justify-center ${muted ? 'bg-red-500 text-white' : 'bg-white/15 text-white'}`}
              aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {muted ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`w-10 h-10 rounded-xl inline-flex items-center justify-center ${videoOff ? 'bg-red-500 text-white' : 'bg-white/15 text-white'}`}
              aria-label={videoOff ? 'Start camera' : 'Stop camera'}
            >
              {videoOff ? <VideoOff size={16} /> : <Video size={16} />}
            </button>
            <button
              onClick={hangup}
              className="w-10 h-10 rounded-xl bg-rose-600 text-white inline-flex items-center justify-center"
              aria-label="Leave call"
            >
              <PhoneOff size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
