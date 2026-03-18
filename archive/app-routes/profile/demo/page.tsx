'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DemoProfile = {
  name: string;
  members: number;
  funds: number;
  events: number;
  reputation: number;
  savedAt?: string;
};

export default function DemoProfilePage() {
  const [profile, setProfile] = useState<DemoProfile | null>(null);

  useEffect(() => {
    const demoRaw = localStorage.getItem('demo-profile');
    const simRaw = localStorage.getItem('club-sim');
    if (demoRaw) {
      try { setProfile(JSON.parse(demoRaw)); return; } catch {}
    }
    if (simRaw) {
      try { const s = JSON.parse(simRaw); setProfile({ name: 'Demo Chapter', members: s.members, funds: s.funds, events: s.events, reputation: s.reputation }); return; } catch {}
    }
    setProfile({ name: 'Demo Chapter', members: 8, funds: 120, events: 0, reputation: 58 });
  }, []);

  function clearProfile() {
    localStorage.removeItem('demo-profile');
    alert('Demo profile cleared.');
    setProfile(null);
  }

  if (!profile) return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="page-title">Demo chapter profile</h1>
      <p className="text-neutral-500">No demo profile found — open the Club Simulator on the About page and save to demo profile.</p>
      <div className="mt-6">
        <Link href="/about#simulator" className="btn-primary">Open simulator</Link>
      </div>
    </main>
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="page-title">{profile.name}</h1>
      <div className="mt-6 grid md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="stat-number">{profile.members}</div>
          <div className="stat-label">Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${profile.funds}</div>
          <div className="stat-label">Funds</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{profile.events}</div>
          <div className="stat-label">Events hosted</div>
        </div>
        <div className="stat-card">
          <div className="text-3xl font-bold text-primary-500">{profile.reputation}%</div>
          <div className="stat-label">Reputation</div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/about#simulator" className="btn-outline">Edit in simulator</Link>
        <button onClick={clearProfile} className="px-4 py-2 border rounded text-sm text-rose-600">Clear demo profile</button>
      </div>
    </main>
  );
}
