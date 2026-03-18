'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { chapters, events } from '@/lib/data';

const myChapter = chapters[0];
const memberRoster = [
  { id: 1, name: 'James Chen', role: 'President', grade: 12, attendance: 95, duesPaid: true },
  { id: 2, name: 'Maria Santos', role: 'Vice President', grade: 11, attendance: 92, duesPaid: true },
  { id: 3, name: 'David Kim', role: 'Secretary', grade: 11, attendance: 88, duesPaid: true },
  { id: 4, name: 'Emma Wilson', role: 'Treasurer', grade: 10, attendance: 90, duesPaid: true },
  { id: 5, name: 'Alex Thompson', role: 'Member', grade: 10, attendance: 78, duesPaid: false },
  { id: 6, name: 'Sophie Brown', role: 'Member', grade: 9, attendance: 85, duesPaid: true },
  { id: 7, name: 'Michael Lee', role: 'Member', grade: 11, attendance: 82, duesPaid: false },
  { id: 8, name: 'Olivia Davis', role: 'Member', grade: 10, attendance: 91, duesPaid: true },
];

const pendingJoinRequests = [
  { id: 1, name: 'Ryan Foster', grade: 10, date: '2026-01-10', message: 'I have always been interested in international relations.' },
  { id: 2, name: 'Lisa Wang', grade: 9, date: '2026-01-08', message: 'I want to improve my public speaking skills.' },
];

export default function OfficerPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'communication' | 'resources' | 'events'>('dashboard');
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  const paidCount = memberRoster.filter(m => m.duesPaid).length;
  const avgAttendance = Math.round(memberRoster.reduce((sum, m) => sum + m.attendance, 0) / memberRoster.length);

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
            alt="Team leadership"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/85"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white/70 mb-1">Chapter Leader Portal</p>
              <h1 className="page-title text-white mb-0">{myChapter.name}</h1>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAnnouncementForm(true)} className="btn-secondary">
                Post Announcement
              </button>
              <Link href={`/directory/${myChapter.id}`} className="bg-white text-primary-500 px-4 py-2 font-semibold border-2 border-white hover:bg-neutral-100 transition-colors rounded-lg">
                View Public Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <div className="flex flex-wrap border-b border-neutral-200">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'members', label: 'Member Management' },
              { key: 'communication', label: 'Communication' },
              { key: 'events', label: 'Events' },
              { key: 'resources', label: 'Resources' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5'
                    : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card">
                <div className="stat-number text-2xl">{memberRoster.length}</div>
                <div className="stat-label">Total Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-number text-2xl">{avgAttendance}%</div>
                <div className="stat-label">Avg Attendance</div>
              </div>
              <div className="stat-card">
                <div className="stat-number text-2xl">{paidCount}/{memberRoster.length}</div>
                <div className="stat-label">Dues Paid</div>
              </div>
              <div className="stat-card">
                <div className="stat-number text-2xl">{pendingJoinRequests.length}</div>
                <div className="stat-label">Pending Requests</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card">
                <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-primary-500 font-heading">Join Requests</h2>
                  <span className="badge badge-secondary">{pendingJoinRequests.length} pending</span>
                </div>
                <div className="divide-y divide-neutral-200">
                  {pendingJoinRequests.map((request) => (
                    <div key={request.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-neutral-800">{request.name}</h3>
                          <p className="text-sm text-neutral-500">Grade {request.grade} • {new Date(request.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3 italic">&quot;{request.message}&quot;</p>
                      <div className="flex gap-2">
                        <button className="btn-primary text-sm py-1">Approve</button>
                        <button className="btn-outline text-sm py-1">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-primary-500 font-heading">Upcoming Events</h2>
                  <button className="text-sm text-secondary-500 hover:underline">+ Create Event</button>
                </div>
                <div className="divide-y divide-neutral-200">
                  {events.filter(e => e.chapterId === myChapter.id).slice(0, 3).map((event) => (
                    <div key={event.id} className="p-4 flex items-start gap-4">
                      <div className="text-center flex-shrink-0 bg-primary-500 text-white p-2 w-14">
                        <div className="text-xs uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-xl font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-800">{event.title}</h3>
                        <p className="text-sm text-neutral-500">{event.startTime} • {event.location}</p>
                        <p className="text-sm text-neutral-600 mt-1">{event.currentAttendees} RSVPs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Members Needing Attention</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {memberRoster.filter(m => m.attendance < 85 || !m.duesPaid).map((member) => (
                  <div key={member.id} className="p-4 border border-neutral-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-neutral-800">{member.name}</h4>
                      <p className="text-sm text-neutral-500">Grade {member.grade} • {member.role}</p>
                    </div>
                    <div className="flex gap-2">
                      {member.attendance < 85 && (
                        <span className="badge bg-yellow-100 text-yellow-700 text-xs">{member.attendance}% attendance</span>
                      )}
                      {!member.duesPaid && (
                        <span className="badge bg-red-100 text-red-700 text-xs">Dues unpaid</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="card p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <input type="text" placeholder="Search members..." className="input-field w-64" />
                <select className="select-field w-40">
                  <option value="">All Roles</option>
                  <option value="officer">Officers</option>
                  <option value="member">Members</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="btn-outline">Export Roster</button>
                <button className="btn-primary">Take Attendance</button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">Grade</th>
                    <th className="table-header">Attendance</th>
                    <th className="table-header">Dues</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memberRoster.map((member) => (
                    <tr key={member.id} className="table-row-hover">
                      <td className="table-cell font-medium">{member.name}</td>
                      <td className="table-cell">
                        <span className={`badge ${member.role !== 'Member' ? 'badge-primary' : 'badge-outline'}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="table-cell">{member.grade}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-neutral-200 h-2">
                            <div 
                              className={`h-full ${member.attendance >= 85 ? 'bg-green-500' : 'bg-yellow-500'}`}
                              style={{ width: `${member.attendance}%` }}
                            />
                          </div>
                          <span className="text-sm">{member.attendance}%</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        {member.duesPaid ? (
                          <span className="badge bg-green-100 text-green-700">Paid</span>
                        ) : (
                          <span className="badge bg-red-100 text-red-700">Unpaid</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button className="text-primary-500 hover:underline text-sm">Edit</button>
                          <button className="text-neutral-500 hover:underline text-sm">Message</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="space-y-6">
            {showAnnouncementForm && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Post Announcement</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Title *</label>
                    <input type="text" className="input-field" placeholder="Announcement title" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Message *</label>
                    <textarea className="input-field" rows={4} placeholder="Write your announcement..." />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="btn-primary">Post to Chapter Page</button>
                    <button type="button" onClick={() => setShowAnnouncementForm(false)} className="btn-outline">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <div className="p-4 border-b border-neutral-200">
                  <h2 className="text-lg font-bold text-primary-500 font-heading">Send Message</h2>
                </div>
                <div className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Recipients</label>
                      <select className="select-field">
                        <option value="all">All Members</option>
                        <option value="officers">Officers Only</option>
                        <option value="unpaid">Members with Unpaid Dues</option>
                        <option value="lowattendance">Low Attendance Members</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Subject</label>
                      <input type="text" className="input-field" placeholder="Email subject" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Message</label>
                      <textarea className="input-field" rows={5} placeholder="Your message..." />
                    </div>
                    <button type="submit" className="btn-primary w-full">Send to {memberRoster.length} Members</button>
                  </form>
                </div>
              </div>

              <div className="card">
                <div className="p-4 border-b border-neutral-200">
                  <h2 className="text-lg font-bold text-primary-500 font-heading">Recent Communications</h2>
                </div>
                <div className="divide-y divide-neutral-200">
                  {[
                    { subject: 'Meeting reminder - Tuesday', date: '2026-01-10', recipients: 45 },
                    { subject: 'Conference registration deadline', date: '2026-01-05', recipients: 45 },
                    { subject: 'Welcome new members!', date: '2026-01-02', recipients: 38 },
                  ].map((msg, idx) => (
                    <div key={idx} className="p-4">
                      <h4 className="font-semibold text-neutral-800">{msg.subject}</h4>
                      <p className="text-sm text-neutral-500">
                        {new Date(msg.date).toLocaleDateString()} • Sent to {msg.recipients} members
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary-500 font-heading">Chapter Events</h2>
              <button className="btn-primary">+ Create Event</button>
            </div>

            <div className="card">
              <div className="p-4 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-800">Create New Event</h3>
              </div>
              <div className="p-6">
                <form className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Event Title *</label>
                    <input type="text" className="input-field" placeholder="e.g., Practice Session" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Date *</label>
                    <input type="date" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Location *</label>
                    <input type="text" className="input-field" placeholder="Room number or location" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Start Time *</label>
                    <input type="time" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">End Time *</label>
                    <input type="time" className="input-field" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Description</label>
                    <textarea className="input-field" rows={3} placeholder="Event details..." />
                  </div>
                  <div className="md:col-span-2 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-neutral-700">Require RSVP</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-neutral-700">Public event (visible to all students)</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="btn-primary">Create Event</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-primary-500 font-heading">Officer Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Budget Templates', desc: 'Track chapter expenses and plan budgets', icon: '📊' },
                { title: 'Fundraising Request Form', desc: 'Submit proposals for fundraising events', icon: '💰' },
                { title: 'Event Planning Checklist', desc: 'Comprehensive guide for planning events', icon: '📋' },
                { title: 'Meeting Minutes Template', desc: 'Record and distribute meeting notes', icon: '📝' },
                { title: 'Attendance Tracker', desc: 'Log member attendance at meetings', icon: '✅' },
                { title: 'Officer Transition Guide', desc: 'Prepare for leadership handoffs', icon: '🔄' },
              ].map((resource) => (
                <div key={resource.title} className="card p-6 hover:shadow-card-hover transition-shadow">
                  <div className="text-3xl mb-3">{resource.icon}</div>
                  <h3 className="font-semibold text-primary-500 mb-2">{resource.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{resource.desc}</p>
                  <button className="text-primary-500 hover:underline text-sm">Download →</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
