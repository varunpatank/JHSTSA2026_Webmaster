'use client';

import { useEffect, useRef, useState } from 'react';
import Whiteboard from './Whiteboard';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function EmbeddedCall({ room, displayName, onClose }: { room: string; displayName?: string; onClose?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [screenShared, setScreenShared] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadAndInit() {
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
        height: 480,
        parentNode: containerRef.current,
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: []
        },
        configOverwrite: { disableDeepLinking: true }
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      apiRef.current.addEventListener('videoConferenceJoined', () => {
        setConnected(true);
        setParticipants((p: number) => Math.max(p, 1));
        if (displayName) apiRef.current.executeCommand('displayName', displayName);
      });

      apiRef.current.addEventListener('participantJoined', () => setParticipants((p: number) => p + 1));
      apiRef.current.addEventListener('participantLeft', () => setParticipants((p: number) => Math.max(1, p - 1)));
      apiRef.current.addEventListener('audioMuteStatusChanged', (e: any) => setMuted(!!e.muted));
      apiRef.current.addEventListener('videoMuteStatusChanged', (e: any) => setVideoOff(!!e.muted));
      apiRef.current.addEventListener('screenSharingStatusChanged', (e: any) => setScreenShared(!!e.on));
    }

    loadAndInit().catch((err) => console.error('Jitsi load failed', err));
    return () => {
      mounted = false;
      try {
        apiRef.current?.dispose();
      } catch (e) {}
    };
  }, [room, displayName]);

  function toggleAudio() {
    apiRef.current?.executeCommand('toggleAudio');
  }
  function toggleVideo() {
    apiRef.current?.executeCommand('toggleVideo');
  }
  function toggleScreenShare() {
    apiRef.current?.executeCommand('toggleShareScreen');
  }
  function hangup() {
    apiRef.current?.executeCommand('hangup');
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={hangup} />
      <div className="relative bg-white  overflow-hidden w-full max-w-5xl shadow-2xl">
        <div className="flex items-center justify-between p-3 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl">📞</div>
            <div>
              <div className="font-semibold">In‑call — {room}</div>
              <div className="text-xs text-neutral-500">{participants} participant{participants>1? 's':''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { navigator.clipboard?.writeText(window.location.href + `?room=${encodeURIComponent(room)}`); }} className="text-sm px-3 py-1 border rounded">Invite</button>
            <button onClick={hangup} className="px-3 py-1 bg-red-600 text-white rounded">Leave</button>
          </div>
        </div>

        <div className="p-4">
          <div ref={containerRef} style={{ minHeight: 320 }} className="rounded bg-black/5 overflow-hidden" />

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-2 items-center">
              <button onClick={toggleAudio} className={`px-3 py-2 rounded ${muted ? 'bg-neutral-100' : 'bg-primary-600 text-white'}`}>{muted ? 'Unmute' : 'Mute'}</button>
              <button onClick={toggleVideo} className={`px-3 py-2 rounded ${videoOff ? 'bg-neutral-100' : 'bg-primary-600 text-white'}`}>{videoOff ? 'Start Video' : 'Stop Video'}</button>
              <button onClick={toggleScreenShare} className={`px-3 py-2 rounded ${screenShared ? 'bg-neutral-100' : 'border'}`}>Share Screen</button>
              <button onClick={() => setShowWhiteboard(s => !s)} className="px-3 py-2 rounded border">Whiteboard</button>
            </div>
            <div className="text-sm text-neutral-500">Tip: use the invite button to copy meeting link</div>
          </div>

          {showWhiteboard && (
            <div className="mt-4">
              <Whiteboard width={900} height={360} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
