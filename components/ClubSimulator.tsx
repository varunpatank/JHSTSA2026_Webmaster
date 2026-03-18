'use client';

import { useEffect, useState } from 'react';

type State = {
  members: number;
  funds: number;
  reputation: number;
  events: number;
};

const START: State = { members: 8, funds: 120, reputation: 58, events: 0 };

export default function ClubSimulator() {
  const [s, setS] = useState<State>(START);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('club-sim');
    if (raw) {
      try { setS(JSON.parse(raw)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('club-sim', JSON.stringify(s));
  }, [s]);

  function push(action: string) {
    setLog(l => [action, ...l].slice(0, 8));
  }

  function recruit() {
    setS(st => ({ ...st, members: st.members + Math.max(1, Math.round(Math.random() * 4)), reputation: Math.min(100, st.reputation + 2) }));
    push('Recruited new members — membership grew');
  }
  function fundraiser() {
    setS(st => ({ ...st, funds: st.funds + Math.round(50 + Math.random() * 200), reputation: Math.min(100, st.reputation + 1) }));
    push('Ran a fundraiser — funds increased');
  }
  function hostEvent() {
    setS(st => ({ ...st, events: st.events + 1, members: Math.max(1, st.members - 0) , reputation: Math.min(100, st.reputation + 3) }));
    push('Hosted event — reputation improved');
  }
  function outreach() {
    setS(st => ({ ...st, reputation: Math.min(100, st.reputation + 5), members: st.members + Math.round(Math.random() * 2) }));
    push('Community outreach — partners noticed your club');
  }
  function saveToDemoProfile() {
    const demo = { name: 'Demo Chapter', members: s.members, funds: s.funds, events: s.events, reputation: s.reputation, savedAt: new Date().toISOString() };
    try {
      localStorage.setItem('demo-profile', JSON.stringify(demo));
      alert('Demo profile saved — open /profile/demo to view.');
    } catch (err) {
      console.error(err);
      alert('Unable to save demo profile locally.');
    }
  }

  function reset() { setS(START); setLog([]); localStorage.removeItem('club-sim'); localStorage.removeItem('demo-profile'); }

  return (
    <div className="sim-card flex flex-col h-full">
      <div className="mb-4">
        <div className="text-sm text-neutral-500">Club simulator</div>
        <div className="text-2xl md:text-3xl font-semibold mb-1">Run a mock meeting and grow your chapter</div>
        <div className="text-xs text-neutral-400">Try different actions to see how stats evolve.</div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600">{s.members}</div>
            <div className="text-xs text-neutral-500">Members</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600">${s.funds}</div>
            <div className="text-xs text-neutral-500">Funds</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600">{s.events}</div>
            <div className="text-xs text-neutral-500">Events</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600">{s.reputation}%</div>
            <div className="text-xs text-neutral-500">Reputation</div>
          </div>
        </div>

        <div className="text-sm text-neutral-500 mb-2">Recent activity</div>
        <div className="bg-neutral-50 p-3 rounded h-40 overflow-auto text-sm mb-4">
          {log.length === 0 ? <div className="text-neutral-400">No actions yet — try Recruit or Host Event.</div> : (
            <ul className="space-y-2">
              {log.map((l, i) => <li key={i} className="text-neutral-700">{l}</li>)}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          <button onClick={recruit} className="px-4 py-2 border rounded bg-primary-50 text-primary-700">Recruit</button>
          <button onClick={fundraiser} className="px-4 py-2 border rounded bg-green-50 text-green-700">Fundraise</button>
          <button onClick={hostEvent} className="px-4 py-2 border rounded bg-secondary-50 text-secondary-700">Host Event</button>
          <button onClick={outreach} className="px-4 py-2 border rounded bg-indigo-50 text-indigo-700">Outreach</button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={reset} className="px-4 py-2 text-sm text-neutral-500">Reset</button>
          <button onClick={saveToDemoProfile} className="px-4 py-2 text-sm border rounded">Save to demo profile</button>
          <a href="/profile/demo" className="px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded">View demo profile</a>
        </div>
      </div>
    </div>
  );
}
