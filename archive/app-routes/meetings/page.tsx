"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [form, setForm] = useState({ member: '', datetime: '', duration: 30, method: 'Video', message: '' });

  function createMeeting(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.member || !form.datetime) return alert('Please choose a contact and date/time');
    const mt = {
      id: 'mt-' + Date.now(),
      member: { name: form.member },
      datetime: form.datetime,
      duration: form.duration,
      method: form.method,
      message: form.message,
      room: `ClubConnect-${form.member.replace(/\s+/g,'')}-${Date.now()}`,
    };
    setMeetings((m) => [mt, ...m]);
    setForm({ member: '', datetime: '', duration: 30, method: 'Video', message: '' });
  }

  function cancelMeeting(id: string) {
    if (!confirm('Cancel this meeting?')) return;
    setMeetings((m) => m.filter(x => x.id !== id));
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-neutral-600">Schedule, manage, and join your ClubConnect meetings — full‑screen calls with ClubConnect branding.</p>
        </div>
        <div>
          <Link href="/call/preview" className="px-4 py-2 bg-primary-600 text-white rounded shadow-sm hover:bg-primary-700">Open full-screen call preview</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Upcoming meetings</h3>
              <div className="text-sm text-neutral-500">{meetings.length} scheduled</div>
            </div>

            {meetings.length === 0 ? (
              <div className="text-neutral-500">You have no meetings scheduled. Use the form to the right to create one.</div>
            ) : (
              <div className="space-y-3">
                {meetings.map((m) => (
                  <div key={m.id} className="p-4 border rounded-lg flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{m.member.name}</div>
                      <div className="text-sm text-neutral-500">{new Date(m.datetime).toLocaleString()} • {m.duration} min</div>
                      <div className="text-sm text-neutral-600 mt-2 break-words whitespace-normal">{m.message || <span className="text-neutral-400">No message</span>}</div>
                      <div className="text-xs text-neutral-400 mt-2 break-all">Room: <span className="font-mono">{m.room}</span></div>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-4">
                      <div className="flex gap-2">
                        <Link href={`/call/${encodeURIComponent(m.room)}`} className="px-3 py-1 bg-primary-600 text-white rounded text-sm">Join</Link>
                        <button onClick={() => { navigator.clipboard?.writeText(location.origin + '/call/' + encodeURIComponent(m.room)); alert('Link copied'); }} className="px-3 py-1 border rounded text-sm">Invite</button>
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <button onClick={() => cancelMeeting(m.id)} className="text-sm text-rose-600">Cancel</button>
                        <button onClick={() => { const blob = new Blob([JSON.stringify(m)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${m.id}.json`; a.click(); a.remove(); URL.revokeObjectURL(url); }} className="text-sm text-neutral-500">Export</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )} 
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Meeting history & notes</h3>
            <p className="text-sm text-neutral-500">(Placeholder) Meeting notes will appear here once you start using ClubConnect meetings with your chapter.</p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Schedule a meeting</h3>
            <form onSubmit={(e) => createMeeting(e)} className="space-y-3">
              <div>
                <label className="text-sm text-neutral-600">With</label>
                <input className="input-field mt-1 w-full" value={form.member} onChange={(e) => setForm(s => ({ ...s, member: e.target.value }))} placeholder="Member or Advisor name" required />
              </div>

              <div>
                <label className="text-sm text-neutral-600">Date & time</label>
                <input type="datetime-local" className="input-field mt-1 w-full" value={form.datetime} onChange={(e) => setForm(s => ({ ...s, datetime: e.target.value }))} required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-neutral-600">Duration (min)</label>
                  <input type="number" min={15} className="input-field mt-1 w-full" value={form.duration} onChange={(e) => setForm(s => ({ ...s, duration: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm text-neutral-600">Method</label>
                  <select className="input-field mt-1 w-full" value={form.method} onChange={(e) => setForm(s => ({ ...s, method: e.target.value }))}>
                    <option>Video</option>
                    <option>Phone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-600">Message (optional)</label>
                <textarea className="input-field mt-1 w-full" rows={3} value={form.message} onChange={(e) => setForm(s => ({ ...s, message: e.target.value }))} />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Schedule</button>
                <button type="button" onClick={() => { setForm({ member: '', datetime: '', duration: 30, method: 'Video', message: '' }); }} className="px-4 py-2 border rounded">Reset</button>
              </div>
            </form>
          </div>

          <div className="bg-neutral-50 p-4 rounded text-sm text-neutral-500">
            Tip: use the <strong>Join</strong> button to open the full‑screen ClubConnect call page for the meeting.
          </div>
        </aside>
      </div>
    </main>
  );
}
