'use client';

import { useEffect, useRef, useState } from 'react';

declare global { interface Window { JitsiMeetExternalAPI: any } }

export default function FullScreenCall({ room, displayName }: { room: string; displayName?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

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
      });
      apiRef.current.addEventListener('audioMuteStatusChanged', (e: any) => setMuted(!!e.muted));
      apiRef.current.addEventListener('videoMuteStatusChanged', (e: any) => setVideoOff(!!e.muted));
    }
    init().catch((err) => console.error('Jitsi load failed', err));
    return () => { mounted = false; try { apiRef.current?.dispose(); } catch (e) {} };
  }, [room, displayName]);

  function toggleAudio() { apiRef.current?.executeCommand('toggleAudio'); }
  function toggleVideo() { apiRef.current?.executeCommand('toggleVideo'); }
  function hangup() { apiRef.current?.executeCommand('hangup'); window.location.href = '/meetings'; }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {}
      <div className="flex items-center justify-between px-6 py-3 bg-white/95 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-600 text-white flex items-center justify-center rounded">CC</div>
          <div>
            <div className="font-semibold">ClubConnect — Live Call</div>
            <div className="text-xs text-neutral-500">{room}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleAudio} className={`px-3 py-2 rounded ${muted ? 'bg-neutral-100' : 'bg-primary-600 text-white'}`}>{muted ? 'Unmute' : 'Mute'}</button>
          <button onClick={toggleVideo} className={`px-3 py-2 rounded ${videoOff ? 'bg-neutral-100' : 'bg-primary-600 text-white'}`}>{videoOff ? 'Start Video' : 'Stop Video'}</button>
          <button onClick={hangup} className="px-3 py-2 bg-rose-600 text-white rounded">End</button>
        </div>
      </div>

      {}
      <div className="flex-1 relative">
        <div ref={ref} className="absolute inset-0 bg-black" />
      </div>
    </div>
  );
}
