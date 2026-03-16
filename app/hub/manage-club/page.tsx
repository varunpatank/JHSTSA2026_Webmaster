'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ClubDraft {
  id: string;
  name: string;
  category: string;
  description: string;
  mission: string;
  meetingSchedule: string;
  meetingLocation: string;
  advisorName: string;
  advisorEmail: string;
  officers: Officer[];
  socialLinks: SocialLink[];
  requirements: string[];
  benefits: string[];
  coverImage: string;
  logo: string;
  color: string;
  status: 'draft' | 'submitted' | 'approved' | 'active';
  createdAt: string;
  lastUpdated: string;
}

interface Officer {
  id: string;
  name: string;
  role: string;
  email: string;
  bio: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'meeting' | 'event' | 'competition' | 'social';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
}

const demoClub: ClubDraft = {
  id: '1',
  name: 'Technology Student Association',
  category: 'STEM',
  description: 'A national organization dedicated to preparing students for careers in technology, innovation, design, and engineering.',
  mission: 'To empower students through STEM competitions, leadership opportunities, and community service.',
  meetingSchedule: 'Every Tuesday, 3:30 PM - 4:30 PM',
  meetingLocation: 'Room 204, Technology Wing',
  advisorName: 'Ms. Sarah Johnson',
  advisorEmail: 's.johnson@school.edu',
  officers: [
    { id: '1', name: 'Alex Martinez', role: 'President', email: 'alex.m@school.edu', bio: 'Junior passionate about robotics and web development' },
    { id: '2', name: 'Jordan Lee', role: 'Vice President', email: 'jordan.l@school.edu', bio: 'Senior focusing on cybersecurity and networking' },
  ],
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/schooltsa' },
    { platform: 'Discord', url: 'https://discord.gg/schooltsa' },
  ],
  requirements: ['Maintain good academic standing', 'Pay annual dues ($15)', 'Attend at least 2 meetings per month'],
  benefits: ['Compete at regional/state/national level', 'Develop technical skills', 'Network with industry professionals', 'Earn service hours'],
  coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
  logo: '🔧',
  color: 'bg-blue-600',
  status: 'active',
  createdAt: '2025-08-15',
  lastUpdated: '2026-02-08'
};

const demoEvents: Event[] = [
  { id: '1', title: 'Weekly Chapter Meeting', date: '2026-02-11', time: '3:30 PM', location: 'Room 204', description: 'Regular meeting to discuss upcoming competitions', type: 'meeting' },
  { id: '2', title: 'Regional Conference', date: '2026-02-25', time: '8:00 AM', location: 'Convention Center', description: 'TSA Regional Competition', type: 'competition' },
];

const demoAnnouncements: Announcement[] = [
  { id: '1', title: 'Webmaster Project Deadline', content: 'All Webmaster teams must submit their projects by February 20th.', date: '2026-02-07', pinned: true },
  { id: '2', title: 'Competition Registration Open', content: 'Sign up for individual events for regionals!', date: '2026-02-05', pinned: false },
];

const categoryOptions = ['STEM', 'Arts', 'Academic', 'Service', 'Cultural', 'Sports', 'Social', 'Business', 'Environmental', 'Other'];
const colorOptions = [
  { value: 'bg-blue-600', label: 'Blue' },
  { value: 'bg-green-600', label: 'Green' },
  { value: 'bg-purple-600', label: 'Purple' },
  { value: 'bg-red-600', label: 'Red' },
  { value: 'bg-amber-600', label: 'Amber' },
  { value: 'bg-pink-600', label: 'Pink' },
  { value: 'bg-teal-600', label: 'Teal' },
  { value: 'bg-indigo-600', label: 'Indigo' },
];
const logoOptions = ['🔧', '🎨', '📚', '🎭', '🌍', '💻', '🎵', '⚽', '🔬', '📷', '✍️', '🤝', '🌱', '💼', '🎯'];
const socialPlatforms = ['Instagram', 'Twitter', 'Discord', 'Facebook', 'YouTube', 'TikTok', 'Website', 'Email'];

export default function ClubManagerPage() {
  const [club, setClub] = useState<ClubDraft>(demoClub);
  const [events, setEvents] = useState<Event[]>(demoEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(demoAnnouncements);
  const [activeTab, setActiveTab] = useState<'profile' | 'officers' | 'events' | 'announcements' | 'settings' | 'preview'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...club });
  
  // New item states
  const [showOfficerForm, setShowOfficerForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [newOfficer, setNewOfficer] = useState({ name: '', role: '', email: '', bio: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', description: '', type: 'meeting' as Event['type'] });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', pinned: false });

  const saveProfile = () => {
    setClub({ ...editForm, lastUpdated: new Date().toISOString().split('T')[0] });
    setIsEditing(false);
  };

  const addOfficer = () => {
    if (!newOfficer.name || !newOfficer.role) return;
    const officer: Officer = { id: Date.now().toString(), ...newOfficer };
    setClub({ ...club, officers: [...club.officers, officer] });
    setNewOfficer({ name: '', role: '', email: '', bio: '' });
    setShowOfficerForm(false);
  };

  const removeOfficer = (id: string) => {
    setClub({ ...club, officers: club.officers.filter(o => o.id !== id) });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const event: Event = { id: Date.now().toString(), ...newEvent };
    setEvents([...events, event]);
    setNewEvent({ title: '', date: '', time: '', location: '', description: '', type: 'meeting' });
    setShowEventForm(false);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    const announcement: Announcement = { 
      id: Date.now().toString(), 
      ...newAnnouncement, 
      date: new Date().toISOString().split('T')[0] 
    };
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', pinned: false });
    setShowAnnouncementForm(false);
  };

  const togglePinned = (id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const eventTypeColors: Record<string, string> = {
    'meeting': 'bg-blue-100 text-blue-700',
    'event': 'bg-green-100 text-green-700',
    'competition': 'bg-amber-100 text-amber-700',
    'social': 'bg-pink-100 text-pink-700'
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={club.coverImage}
            alt={club.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 to-neutral-800/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <div className="flex items-center gap-6">
            <span className={`w-20 h-20 ${club.color} text-white text-4xl flex items-center justify-center shadow-lg`}>
              {club.logo}
            </span>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">
                  {club.name}
                </h1>
                <span className={`px-3 py-1 text-sm font-semibold ${
                  club.status === 'active' ? 'bg-green-500 text-white' :
                  club.status === 'approved' ? 'bg-blue-500 text-white' :
                  club.status === 'submitted' ? 'bg-yellow-500 text-neutral-900' :
                  'bg-neutral-500 text-white'
                }`}>
                  {club.status.toUpperCase()}
                </span>
              </div>
              <p className="text-white/80">Club Manager Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'profile', label: '📋 Profile' },
              { id: 'officers', label: '👥 Officers' },
              { id: 'events', label: '📅 Events' },
              { id: 'announcements', label: '📢 Announcements' },
              { id: 'settings', label: '⚙️ Settings' },
              { id: 'preview', label: '👁️ Preview' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary-500">Club Profile</h2>
                  <button 
                    onClick={() => { setIsEditing(!isEditing); setEditForm({ ...club }); }}
                    className="text-primary-500 hover:underline"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Club Name *</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Category</label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="select-field"
                        >
                          {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Logo</label>
                        <div className="flex flex-wrap gap-1">
                          {logoOptions.map(logo => (
                            <button
                              key={logo}
                              onClick={() => setEditForm({ ...editForm, logo })}
                              className={`w-8 h-8 text-lg border transition-all ${
                                editForm.logo === logo ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                              }`}
                            >
                              {logo}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Mission Statement</label>
                      <textarea
                        value={editForm.mission}
                        onChange={(e) => setEditForm({ ...editForm, mission: e.target.value })}
                        className="input-field"
                        rows={2}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Meeting Schedule</label>
                        <input
                          type="text"
                          value={editForm.meetingSchedule}
                          onChange={(e) => setEditForm({ ...editForm, meetingSchedule: e.target.value })}
                          className="input-field"
                          placeholder="e.g., Every Tuesday, 3:30 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Meeting Location</label>
                        <input
                          type="text"
                          value={editForm.meetingLocation}
                          onChange={(e) => setEditForm({ ...editForm, meetingLocation: e.target.value })}
                          className="input-field"
                          placeholder="e.g., Room 204"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Advisor Name</label>
                        <input
                          type="text"
                          value={editForm.advisorName}
                          onChange={(e) => setEditForm({ ...editForm, advisorName: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Advisor Email</label>
                        <input
                          type="email"
                          value={editForm.advisorEmail}
                          onChange={(e) => setEditForm({ ...editForm, advisorEmail: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Theme Color</label>
                      <div className="flex gap-2">
                        {colorOptions.map(color => (
                          <button
                            key={color.value}
                            onClick={() => setEditForm({ ...editForm, color: color.value })}
                            className={`w-10 h-10 ${color.value} border-2 transition-all ${
                              editForm.color === color.value ? 'border-neutral-800 scale-110' : 'border-transparent'
                            }`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={editForm.coverImage}
                        onChange={(e) => setEditForm({ ...editForm, coverImage: e.target.value })}
                        className="input-field"
                        placeholder="https://..."
                      />
                    </div>
                    <button onClick={saveProfile} className="btn-primary">Save Changes</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-neutral-500 mb-1">Category</div>
                      <div className="font-semibold">{club.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500 mb-1">Description</div>
                      <div className="text-neutral-700">{club.description}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500 mb-1">Mission Statement</div>
                      <div className="text-neutral-700 italic">{club.mission}</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-neutral-500 mb-1">Meeting Schedule</div>
                        <div className="font-semibold">{club.meetingSchedule}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500 mb-1">Location</div>
                        <div className="font-semibold">{club.meetingLocation}</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-neutral-500 mb-1">Advisor</div>
                        <div className="font-semibold">{club.advisorName}</div>
                        <div className="text-sm text-primary-500">{club.advisorEmail}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500 mb-1">Last Updated</div>
                        <div className="font-semibold">{new Date(club.lastUpdated).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements & Benefits */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-primary-500 mb-4">Membership Requirements</h3>
                  <ul className="space-y-2">
                    {club.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-primary-500 mb-4">Member Benefits</h3>
                  <ul className="space-y-2">
                    {club.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-neutral-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Officers Tab */}
          {activeTab === 'officers' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-500">Club Officers</h2>
                <button onClick={() => setShowOfficerForm(true)} className="btn-primary">
                  + Add Officer
                </button>
              </div>

              {showOfficerForm && (
                <div className="card p-6 mb-6 border-2 border-primary-300">
                  <h3 className="font-bold text-neutral-700 mb-4">Add New Officer</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={newOfficer.name}
                        onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Role/Position *</label>
                      <input
                        type="text"
                        value={newOfficer.role}
                        onChange={(e) => setNewOfficer({ ...newOfficer, role: e.target.value })}
                        className="input-field"
                        placeholder="e.g., President, Secretary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newOfficer.email}
                        onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Bio</label>
                      <input
                        type="text"
                        value={newOfficer.bio}
                        onChange={(e) => setNewOfficer({ ...newOfficer, bio: e.target.value })}
                        className="input-field"
                        placeholder="Short description"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={addOfficer} className="btn-primary">Add Officer</button>
                    <button onClick={() => setShowOfficerForm(false)} className="btn-outline">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {club.officers.map(officer => (
                  <div key={officer.id} className="card p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-neutral-800">{officer.name}</h4>
                        <p className="text-primary-500 font-semibold">{officer.role}</p>
                        {officer.email && <p className="text-sm text-neutral-500">{officer.email}</p>}
                        {officer.bio && <p className="text-sm text-neutral-600 mt-2">{officer.bio}</p>}
                      </div>
                      <button
                        onClick={() => removeOfficer(officer.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {club.officers.length === 0 && (
                <div className="card p-12 text-center">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-lg font-bold text-neutral-700 mb-2">No officers added yet</h3>
                  <p className="text-neutral-600 mb-4">Add your club&apos;s leadership team</p>
                  <button onClick={() => setShowOfficerForm(true)} className="btn-primary">
                    + Add First Officer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-500">Club Events</h2>
                <button onClick={() => setShowEventForm(true)} className="btn-primary">
                  + Add Event
                </button>
              </div>

              {showEventForm && (
                <div className="card p-6 mb-6 border-2 border-primary-300">
                  <h3 className="font-bold text-neutral-700 mb-4">Add New Event</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Event Title *</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Type</label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                        className="select-field"
                      >
                        <option value="meeting">Meeting</option>
                        <option value="event">Event</option>
                        <option value="competition">Competition</option>
                        <option value="social">Social</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Date *</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Time</label>
                      <input
                        type="text"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 3:30 PM"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="input-field"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={addEvent} className="btn-primary">Add Event</button>
                    <button onClick={() => setShowEventForm(false)} className="btn-outline">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                  <div key={event.id} className="card p-5">
                    <div className="flex items-start gap-4">
                      <div className="text-center bg-primary-50 p-3 min-w-[80px]">
                        <div className="text-xs text-primary-500">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div className="text-2xl font-bold text-primary-600">{new Date(event.date).getDate()}</div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-neutral-800">{event.title}</h4>
                          <span className={`px-2 py-0.5 text-xs font-semibold ${eventTypeColors[event.type]}`}>
                            {event.type}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {event.time && `🕐 ${event.time}`} {event.location && `• 📍 ${event.location}`}
                        </p>
                        {event.description && <p className="text-sm text-neutral-600 mt-1">{event.description}</p>}
                      </div>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {events.length === 0 && (
                <div className="card p-12 text-center">
                  <div className="text-5xl mb-4">📅</div>
                  <h3 className="text-lg font-bold text-neutral-700 mb-2">No events scheduled</h3>
                  <p className="text-neutral-600 mb-4">Add your club&apos;s upcoming events</p>
                  <button onClick={() => setShowEventForm(true)} className="btn-primary">
                    + Add First Event
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-500">Announcements</h2>
                <button onClick={() => setShowAnnouncementForm(true)} className="btn-primary">
                  + New Announcement
                </button>
              </div>

              {showAnnouncementForm && (
                <div className="card p-6 mb-6 border-2 border-primary-300">
                  <h3 className="font-bold text-neutral-700 mb-4">New Announcement</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Content *</label>
                      <textarea
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAnnouncement.pinned}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, pinned: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-neutral-700">📌 Pin this announcement</span>
                    </label>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={addAnnouncement} className="btn-primary">Post Announcement</button>
                    <button onClick={() => setShowAnnouncementForm(false)} className="btn-outline">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {announcements.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(announcement => (
                  <div key={announcement.id} className={`card p-5 ${announcement.pinned ? 'border-2 border-secondary-300 bg-secondary-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {announcement.pinned && <span className="text-secondary-500">📌</span>}
                          <h4 className="font-bold text-neutral-800">{announcement.title}</h4>
                        </div>
                        <p className="text-neutral-600">{announcement.content}</p>
                        <p className="text-xs text-neutral-400 mt-2">{new Date(announcement.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => togglePinned(announcement.id)}
                          className={`p-1 ${announcement.pinned ? 'text-secondary-500' : 'text-neutral-400 hover:text-secondary-500'}`}
                          title={announcement.pinned ? 'Unpin' : 'Pin'}
                        >
                          📌
                        </button>
                        <button
                          onClick={() => removeAnnouncement(announcement.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {announcements.length === 0 && (
                <div className="card p-12 text-center">
                  <div className="text-5xl mb-4">📢</div>
                  <h3 className="text-lg font-bold text-neutral-700 mb-2">No announcements</h3>
                  <p className="text-neutral-600 mb-4">Share news and updates with your members</p>
                  <button onClick={() => setShowAnnouncementForm(true)} className="btn-primary">
                    + Post First Announcement
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-primary-500">Club Settings</h2>

              {/* Social Links */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-700 mb-4">Social Links</h3>
                <div className="space-y-3">
                  {club.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-semibold text-neutral-600">{link.platform}</span>
                      <span className="text-primary-500 flex-grow">{link.url}</span>
                      <button className="text-red-400 hover:text-red-600">✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn-outline text-sm mt-4">+ Add Social Link</button>
              </div>

              {/* Club Status */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-700 mb-4">Club Status</h3>
                <div className="flex items-center justify-between p-4 bg-neutral-50">
                  <div>
                    <div className="font-semibold">Current Status</div>
                    <div className={`text-sm ${
                      club.status === 'active' ? 'text-green-600' : 'text-neutral-500'
                    }`}>
                      {club.status === 'active' ? '✓ Active and visible in directory' : 'Not yet active'}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold ${
                    club.status === 'active' ? 'bg-green-500 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {club.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card p-6 border-red-200">
                <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200">
                    <div>
                      <div className="font-semibold text-neutral-700">Archive Club</div>
                      <div className="text-sm text-neutral-500">Hide from directory but keep data</div>
                    </div>
                    <button className="px-4 py-2 border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold">
                      Archive
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-red-200">
                    <div>
                      <div className="font-semibold text-neutral-700">Delete Club</div>
                      <div className="text-sm text-neutral-500">Permanently remove all data</div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 font-semibold">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-neutral-200 shadow-lg">
                {/* Preview Header */}
                <div className="relative h-48">
                  <Image
                    src={club.coverImage}
                    alt={club.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-4">
                    <span className={`w-16 h-16 ${club.color} text-white text-3xl flex items-center justify-center shadow-lg`}>
                      {club.logo}
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{club.name}</h2>
                      <p className="text-white/80">{club.category}</p>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  <p className="text-neutral-700 mb-6">{club.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-neutral-50">
                      <h4 className="font-bold text-primary-500 mb-2">📅 Meeting Info</h4>
                      <p className="text-neutral-700">{club.meetingSchedule}</p>
                      <p className="text-neutral-500 text-sm">{club.meetingLocation}</p>
                    </div>
                    <div className="p-4 bg-neutral-50">
                      <h4 className="font-bold text-primary-500 mb-2">👤 Advisor</h4>
                      <p className="text-neutral-700">{club.advisorName}</p>
                      <p className="text-primary-500 text-sm">{club.advisorEmail}</p>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <h4 className="font-bold text-primary-500 mb-3">Leadership Team</h4>
                    <div className="flex flex-wrap gap-4">
                      {club.officers.map(officer => (
                        <div key={officer.id} className="flex items-center gap-2 bg-neutral-100 px-3 py-2">
                          <div className="w-8 h-8 bg-primary-500 text-white flex items-center justify-center font-bold text-sm">
                            {officer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{officer.name}</div>
                            <div className="text-xs text-neutral-500">{officer.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 p-4 bg-primary-50 border border-primary-200">
                <p className="text-primary-700">
                  This is how your club page will appear to visitors. 
                  <button onClick={() => setActiveTab('profile')} className="text-primary-500 underline ml-1">
                    Edit Profile
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
