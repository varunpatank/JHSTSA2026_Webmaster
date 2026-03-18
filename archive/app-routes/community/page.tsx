'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const EmbeddedCall = dynamic(() => import('@/components/EmbeddedCall'), { ssr: false });

export default function CommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'discussions' | 'spotlight' | 'stories' | 'alumni' | 'connect'>('discussions');

  const discussions = [
    { id: 1, title: 'Tips for TSA State Competition?', author: 'Maria G.', club: 'TSA', replies: 23, lastActive: '2 hours ago', hot: true },
    { id: 2, title: 'Best fundraising ideas for spring', author: 'James L.', club: 'FBLA', replies: 18, lastActive: '5 hours ago', hot: true },
    { id: 3, title: 'How to balance club leadership with academics', author: 'Sophie K.', club: 'NHS', replies: 31, lastActive: '1 day ago', hot: false },
    { id: 4, title: 'Robotics competition strategies', author: 'Alex J.', club: 'Robotics', replies: 15, lastActive: '1 day ago', hot: false },
    { id: 5, title: 'New member recruitment ideas', author: 'Taylor M.', club: 'Drama', replies: 12, lastActive: '2 days ago', hot: false },
  ];

  const spotlights = [
    { id: 1, title: 'TSA Chapter Wins State Championship', club: 'TSA', date: 'Nov 2024', image: '🏆', featured: true },
    { id: 2, title: 'Drama Club Spring Musical Sells Out', club: 'Drama', date: 'Oct 2024', image: '🎭', featured: false },
    { id: 3, title: 'Robotics Team Qualifies for Nationals', club: 'Robotics', date: 'Oct 2024', image: '🤖', featured: false },
    { id: 4, title: 'NHS Community Service Milestone', club: 'NHS', date: 'Sep 2024', image: '🤝', featured: false },
  ];

  const successStories = [
    { id: 1, title: 'From Club Member to Tech Entrepreneur', author: 'Sarah Chen, Class of 2020', club: 'TSA', excerpt: 'How TSA skills helped me launch my startup...' },
    { id: 2, title: 'Leadership Lessons That Shaped My Career', author: 'Michael Brown, Class of 2018', club: 'FBLA', excerpt: 'The business skills I learned in FBLA...' },
    { id: 3, title: 'Finding My Voice Through Debate', author: 'Emily Rodriguez, Class of 2021', club: 'Debate', excerpt: 'Public speaking transformed my confidence...' },
  ];

  const alumni = [
    { id: 1, name: 'Dr. Jennifer Walsh', year: '2015', role: 'Software Engineer at Google', club: 'TSA' },
    { id: 2, name: 'Marcus Thompson', year: '2017', role: 'Investment Banker', club: 'FBLA' },
    { id: 3, name: 'Amanda Lee', year: '2019', role: 'Broadway Performer', club: 'Drama' },
  ];

  // --- Connect / Meetings (new) ---
  const members = [
    { id: 'm1', name: 'Greg Shelton', role: 'Advisor', club: 'Juanita HS Webmaster', email: 'gshelton@lwsd.org', bio: 'Advisor with 10+ years experience mentoring Webmaster teams.', availability: ['Mon 3:30pm','Wed 4:00pm'] },
    { id: 'm2', name: 'Alex Johnson', role: 'Team Captain', club: 'Robotics', email: 'a.johnson@student.edu', bio: 'Lead programmer and mentor for new members.', availability: ['Tue 5:00pm','Thu 3:30pm'] },
    { id: 'm3', name: 'Isabella Martinez', role: 'President', club: 'Community Service', email: 'i.martinez@student.edu', bio: 'Organizes large volunteer drives and outreach.', availability: ['Fri 12:00pm'] },
  ];

  const [meetings, setMeetings] = useState<any[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [form, setForm] = useState({ datetime: '', duration: 30, method: 'Video', message: '' });

  function openSchedule(member: any) {
    setSelectedMember(member);
    setShowScheduleModal(true);
  }

  function createMeeting() {
    if (!selectedMember || !form.datetime) return alert('Please choose date/time');
    const mt = {
      id: 'mt-' + Date.now(),
      member: selectedMember,
      datetime: form.datetime,
      duration: form.duration,
      method: form.method,
      message: form.message,
      room: `ClubConnect-${selectedMember.id}-${Date.now()}`,
    };
    setMeetings((m) => [mt, ...m]);
    setShowScheduleModal(false);
    setForm({ datetime: '', duration: 30, method: 'Video', message: '' });
  }

  function downloadICS(meeting: any) {
    const start = new Date(meeting.datetime);
    const end = new Date(start.getTime() + meeting.duration * 60000);
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${meeting.id}\nDTSTAMP:${start.toISOString().replace(/[-:]/g,'').split('.')[0]}Z\nDTSTART:${start.toISOString().replace(/[-:]/g,'').split('.')[0]}Z\nDTEND:${end.toISOString().replace(/[-:]/g,'').split('.')[0]}Z\nSUMMARY:Meeting with ${meeting.member.name}\nDESCRIPTION:${meeting.message}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.member.name.replace(/\s+/g,'_')}-meeting.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const [embeddedRoom, setEmbeddedRoom] = useState<string | null>(null);

  function startEmbeddedRoom(roomId: string) {
    setEmbeddedRoom(roomId);
  }

  function openLocalPreview() {
    // open simple local preview modal (handled below)
    setShowPreview(true);
  }

  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function start() {
      if (!showPreview) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('getUserMedia failed', err);
        alert('Unable to access camera/microphone for preview.');
        setShowPreview(false);
      }
    }
    start();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [showPreview]);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold font-heading mb-4">Community</h1>
          <p className="text-xl text-neutral-200 max-w-2xl">
            Connect with fellow students, celebrate achievements, and learn from alumni success stories.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {[
              { key: 'discussions', label: 'Discussions', icon: '💬' },
              { key: 'spotlight', label: 'Club Spotlight', icon: '⭐' },
              { key: 'stories', label: 'Success Stories', icon: '🌟' },
              { key: 'alumni', label: 'Alumni Network', icon: '🎓' },
              { key: 'connect', label: 'Connect & Meetings', icon: '📞' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'discussions' | 'spotlight' | 'stories' | 'alumni' | 'connect')}
                className={`px-6 py-4 font-medium border-b-3 transition-colors ${
                  activeTab === tab.key
                    ? 'border-secondary-500 text-primary-600 bg-neutral-50'
                    : 'border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-primary-700">Forum Discussions</h2>
              <Link 
                href="/hub/discussions"
                className="px-4 py-2 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
              >
                ➕ Start New Discussion
              </Link>
            </div>

            <div className="space-y-4">
              {discussions.map(discussion => (
                <Link
                  key={discussion.id}
                  href="/hub/discussions"
                  className="block bg-white border-2 border-neutral-200 p-6 hover:border-primary-400 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {discussion.hot && (
                          <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-bold">🔥 HOT</span>
                        )}
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium">{discussion.club}</span>
                      </div>
                      <h3 className="text-lg font-bold text-primary-700">{discussion.title}</h3>
                      <p className="text-neutral-500 text-sm mt-1">Started by {discussion.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">{discussion.replies}</div>
                      <div className="text-neutral-400 text-sm">replies</div>
                      <div className="text-neutral-500 text-xs mt-2">Active {discussion.lastActive}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 p-6 bg-primary-50 border-2 border-primary-200">
              <h3 className="font-bold text-primary-700 mb-2">Join the Conversation!</h3>
              <p className="text-neutral-600 mb-4">Share tips, ask questions, and connect with fellow club members across your school.</p>
              <Link 
                href="/hub/discussions"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Browse All Discussions →
              </Link>
            </div>
          </div>
        )}

        {/* Spotlight Tab */}
        {activeTab === 'spotlight' && (
          <div>
            <h2 className="text-2xl font-bold text-primary-700 mb-6">Club Spotlight</h2>

            {/* Featured Spotlight */}
            {spotlights.filter(s => s.featured).map(spotlight => (
              <div key={spotlight.id} className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-8 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 text-sm font-bold">⭐ FEATURED</span>
                  <span className="text-sm">{spotlight.date}</span>
                </div>
                <div className="text-6xl mb-4">{spotlight.image}</div>
                <h3 className="text-2xl font-bold mb-2">{spotlight.title}</h3>
                <p className="text-white/80">{spotlight.club}</p>
              </div>
            ))}

            {/* Other Spotlights */}
            <div className="grid md:grid-cols-3 gap-6">
              {spotlights.filter(s => !s.featured).map(spotlight => (
                <div key={spotlight.id} className="bg-white border-2 border-neutral-200 p-6 hover:border-primary-400 transition-colors">
                  <div className="text-4xl mb-4">{spotlight.image}</div>
                  <span className="text-sm text-neutral-500">{spotlight.date}</span>
                  <h3 className="text-lg font-bold text-primary-700 mt-2">{spotlight.title}</h3>
                  <p className="text-secondary-600 mt-1">{spotlight.club}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/spotlight"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                View All Spotlights →
              </Link>
            </div>
          </div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'stories' && (
          <div>
            <h2 className="text-2xl font-bold text-primary-700 mb-6">Success Stories</h2>

            <div className="space-y-6">
              {successStories.map(story => (
                <div key={story.id} className="bg-white border-2 border-neutral-200 p-8 hover:border-primary-400 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium">{story.club}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700 mb-2">{story.title}</h3>
                  <p className="text-secondary-600 font-medium mb-3">{story.author}</p>
                  <p className="text-neutral-600">{story.excerpt}</p>
                  <button className="mt-4 text-primary-600 font-medium hover:text-primary-700">
                    Read Full Story →
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/hub/stories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                View All Stories →
              </Link>
            </div>
          </div>
        )}

        {/* Alumni Tab */}
        {activeTab === 'alumni' && (
          <div>
            <h2 className="text-2xl font-bold text-primary-700 mb-6">Alumni Network</h2>

            <div className="bg-primary-50 border-2 border-primary-200 p-6 mb-8">
              <h3 className="font-bold text-primary-700 mb-2">Connect with Alumni</h3>
              <p className="text-neutral-600">Our alumni network helps current students learn from graduates who've gone on to successful careers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {alumni.map(person => (
                <div key={person.id} className="bg-white border-2 border-neutral-200 p-6 text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <h3 className="text-lg font-bold text-primary-700">{person.name}</h3>
                  <p className="text-secondary-600 font-medium">Class of {person.year}</p>
                  <p className="text-neutral-500 text-sm mt-2">{person.role}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-primary-100 text-primary-700 text-sm">
                    {person.club}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/alumni"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                View Full Alumni Directory →
              </Link>
            </div>
          </div>
        )}

        {/* Connect & Meetings Tab (new) */}
        {activeTab === 'connect' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-700">Connect with Founders & Members</h2>
              <div className="flex gap-3">
                <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded">Local Call Preview</button>
                <button onClick={() => { setSelectedMember(null); setShowScheduleModal(true); }} className="px-4 py-2 bg-secondary-500 text-white rounded">Schedule Meeting</button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {members.map((member, idx) => (
                <div key={member.id} className="bg-white border-2 border-neutral-200 p-6 hover:shadow-lg transition-shadow animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-2xl">{member.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-primary-700">{member.name}</h3>
                          <div className="text-xs text-neutral-500">{member.role} • {member.club}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-neutral-400">Availability</div>
                          <div className="text-sm text-neutral-600">{member.availability.join(', ')}</div>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mt-3">{member.bio}</p>

                      <div className="mt-4 flex gap-2">
                        <button onClick={() => openSchedule(member)} className="px-3 py-2 bg-primary-600 text-white rounded">Book</button>
                        <button onClick={() => router.push(`/call/${encodeURIComponent(`Community-${member.id}-${Date.now()}`)}`)} className="px-3 py-2 border rounded">Start Call (full‑screen)</button>
                        <button onClick={() => { setSelectedMember(member); setShowScheduleModal(true); }} className="px-3 py-2 border rounded">Message / Propose</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8 bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
                <div className="text-sm text-neutral-500">Manage on the Meetings page</div>
              </div>
              <p className="text-neutral-500 mb-4">Meetings are now managed on a dedicated page for better clarity and controls.</p>
              <div className="flex gap-3">
                <a href="/meetings" className="px-4 py-2 bg-primary-600 text-white rounded">Open Meetings →</a>
                <button onClick={() => setShowScheduleModal(true)} className="px-4 py-2 border rounded">Quick schedule</button>
              </div>
            </div>

            {/* Schedule modal */}
            {showScheduleModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl w-full max-w-2xl p-6">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <h4 className="text-lg font-bold truncate max-w-[72%]">Schedule Meeting {selectedMember ? `with ${selectedMember.name}` : ''}</h4>
                    <button onClick={() => setShowScheduleModal(false)} className="text-neutral-400 ml-auto">✕</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-neutral-600">Date & time</label>
                      <input type="datetime-local" value={form.datetime} onChange={e=>setForm(f=>({...f, datetime: e.target.value}))} className="input-field mt-1 w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600">Duration (minutes)</label>
                      <input type="number" value={form.duration} onChange={e=>setForm(f=>({...f, duration: Number(e.target.value)}))} className="input-field mt-1 w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600">Method</label>
                      <select value={form.method} onChange={e=>setForm(f=>({...f, method: e.target.value}))} className="select-field mt-1 w-full">
                        <option>Video</option>
                        <option>Audio</option>
                        <option>In-person</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600">Message</label>
                      <input value={form.message} onChange={e=>setForm(f=>({...f, message: e.target.value}))} className="input-field mt-1 w-full" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                    <button onClick={createMeeting} className="px-4 py-2 bg-secondary-500 text-white rounded">Schedule</button>
                  </div>
                </div>
              </div>
            )}

            {/* Local preview call modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl w-full max-w-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Call preview (local only)</h4>
                    <button onClick={() => setShowPreview(false)} className="text-neutral-400">✕</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-neutral-100 p-4 rounded">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-56 bg-black/10 rounded" />
                    </div>
                    <div>
                      <h5 className="font-semibold">Start in‑platform call</h5>
                      <p className="text-sm text-neutral-600 mb-3">Open an embedded in‑app meeting with full controls (mute, camera, screen, whiteboard).</p>
                      <div className="flex gap-2">
                        <button onClick={() => startEmbeddedRoom(`Community-Preview-${Date.now()}`)} className="px-4 py-2 bg-primary-600 text-white rounded">Open Embedded Call</button>
                        <button onClick={() => navigator.clipboard?.writeText(`https://meet.jit.si/Community-${Date.now()}`)} className="px-4 py-2 border rounded">Copy Jitsi link</button>
                      </div>
                      <div className="mt-6">
                        <h6 className="font-semibold">Notes</h6>
                        <ul className="list-disc pl-5 text-sm text-neutral-600 mt-2">
                          <li>Preview shows your local camera/microphone only (no remote participants).</li>
                          <li>Embedded call uses Jitsi Meet iframe API so participants can join inside ClubConnect.</li>
                          <li>Whiteboard is included in the embedded call (local-only for now).</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Have a story to share?</h2>
                <p className="text-white/80">Your club achievements deserve recognition. Submit your spotlight or success story.</p>
              </div>
              <Link 
                href="/hub/request"
                className="px-6 py-3 bg-secondary-500 text-white font-medium hover:bg-secondary-600 transition-colors"
              >
                Submit Your Story
              </Link>
            </div>
          </div>
        </div>

        {/* Embedded call modal */}
        {embeddedRoom && (
          <EmbeddedCall
            room={embeddedRoom}
            displayName={typeof window !== 'undefined' ? (localStorage.getItem('cc_displayName') || 'Guest') : 'Guest'}
            onClose={() => setEmbeddedRoom(null)}
          />
        )}
      </div>
    </div>
  );
}
