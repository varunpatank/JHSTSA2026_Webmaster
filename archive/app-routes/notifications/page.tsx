'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Notification {
  id: string;
  type: 'event' | 'announcement' | 'achievement' | 'reminder' | 'system' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  club?: string;
  priority: 'low' | 'normal' | 'high';
}

interface NotificationPreference {
  type: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'event',
    title: 'Event Reminder: TSA Chapter Meeting',
    message: 'Your meeting starts in 1 hour. Room 204, Technology Wing.',
    timestamp: '2026-02-10T14:30:00',
    read: false,
    link: '/events',
    club: 'Technology Student Association',
    priority: 'high'
  },
  {
    id: '2',
    type: 'announcement',
    title: 'New Announcement from Robotics Club',
    message: 'Competition registration deadline extended to February 20th!',
    timestamp: '2026-02-10T10:15:00',
    read: false,
    link: '/hub/announcements',
    club: 'Robotics Club',
    priority: 'normal'
  },
  {
    id: '3',
    type: 'achievement',
    title: '🏆 Achievement Unlocked!',
    message: 'You earned "Social Butterfly" for joining 3 clubs!',
    timestamp: '2026-02-09T16:00:00',
    read: false,
    link: '/hub/achievements',
    priority: 'normal'
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Goal Reminder',
    message: 'Your goal "Complete 50 Service Hours" is 64% complete. Keep going!',
    timestamp: '2026-02-09T09:00:00',
    read: true,
    link: '/hub/goals',
    priority: 'low'
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome to ClubConnect!',
    message: 'Complete your profile to get personalized club recommendations.',
    timestamp: '2026-02-08T12:00:00',
    read: true,
    link: '/dashboard',
    priority: 'normal'
  },
  {
    id: '6',
    type: 'mention',
    title: 'You were mentioned in a discussion',
    message: 'Alex Martinez mentioned you in "Webmaster Competition Planning"',
    timestamp: '2026-02-08T11:30:00',
    read: true,
    club: 'TSA',
    priority: 'normal'
  },
  {
    id: '7',
    type: 'event',
    title: 'RSVP Confirmation',
    message: 'You\'re confirmed for "Regional TSA Conference" on Feb 25th.',
    timestamp: '2026-02-07T14:00:00',
    read: true,
    link: '/events',
    club: 'TSA',
    priority: 'low'
  },
  {
    id: '8',
    type: 'announcement',
    title: 'New Resource Available',
    message: 'Check out the new "Leadership Development Guide" in the Resource Hub.',
    timestamp: '2026-02-06T09:30:00',
    read: true,
    link: '/hub',
    priority: 'low'
  },
];

const demoPreferences: NotificationPreference[] = [
  { type: 'events', label: 'Event Reminders', description: 'Upcoming events and meeting reminders', email: true, push: true, inApp: true },
  { type: 'announcements', label: 'Club Announcements', description: 'News and updates from your clubs', email: true, push: true, inApp: true },
  { type: 'achievements', label: 'Achievement Alerts', description: 'When you earn new badges or achievements', email: false, push: true, inApp: true },
  { type: 'goals', label: 'Goal Reminders', description: 'Progress updates and deadline reminders', email: false, push: true, inApp: true },
  { type: 'mentions', label: 'Mentions', description: 'When someone mentions you in discussions', email: true, push: true, inApp: true },
  { type: 'newsletter', label: 'Weekly Digest', description: 'Summary of activities and opportunities', email: true, push: false, inApp: false },
  { type: 'system', label: 'System Updates', description: 'Important platform announcements', email: true, push: false, inApp: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [preferences, setPreferences] = useState<NotificationPreference[]>(demoPreferences);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const typeIcons: Record<string, string> = {
    'event': '📅',
    'announcement': '📢',
    'achievement': '🏆',
    'reminder': '⏰',
    'system': '⚙️',
    'mention': '💬'
  };

  const typeColors: Record<string, string> = {
    'event': 'bg-blue-100 text-blue-700 border-blue-200',
    'announcement': 'bg-green-100 text-green-700 border-green-200',
    'achievement': 'bg-amber-100 text-amber-700 border-amber-200',
    'reminder': 'bg-purple-100 text-purple-700 border-purple-200',
    'system': 'bg-neutral-100 text-neutral-700 border-neutral-200',
    'mention': 'bg-pink-100 text-pink-700 border-pink-200'
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread' && n.read) return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const togglePreference = (type: string, channel: 'email' | 'push' | 'inApp') => {
    setPreferences(preferences.map(p => 
      p.type === type ? { ...p, [channel]: !p[channel] } : p
    ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1920&q=80"
            alt="Notifications"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-600/80"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <Link href="/dashboard" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">
                🔔 Notifications
              </h1>
              <p className="text-white/80 mt-2">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-sm font-semibold transition-colors"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'unread'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {activeTab !== 'settings' && (
            <>
              {/* Filter */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2 flex-wrap">
                  {['all', 'event', 'announcement', 'achievement', 'reminder', 'mention', 'system'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 text-sm font-semibold border transition-colors ${
                        filterType === type
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {type === 'all' ? 'All' : typeIcons[type]} {type !== 'all' && type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`card p-4 transition-all ${
                      !notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`w-10 h-10 flex items-center justify-center text-xl ${typeColors[notification.type]}`}>
                        {typeIcons[notification.type]}
                      </span>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className={`font-semibold ${!notification.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-neutral-600 mt-0.5">{notification.message}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                              <span>{formatTime(notification.timestamp)}</span>
                              {notification.club && <span>• {notification.club}</span>}
                              {notification.priority === 'high' && (
                                <span className="text-red-500 font-semibold">• High Priority</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {notification.link && (
                              <Link
                                href={notification.link}
                                className="text-primary-500 hover:text-primary-700 text-sm font-semibold"
                              >
                                View
                              </Link>
                            )}
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-neutral-400 hover:text-primary-500 p-1"
                                title="Mark as read"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-neutral-400 hover:text-red-500 p-1"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-16 card">
                    <div className="text-5xl mb-4">🔔</div>
                    <h3 className="text-xl font-bold text-neutral-700 mb-2">No notifications</h3>
                    <p className="text-neutral-600">
                      {activeTab === 'unread' ? 'You\'ve read all your notifications!' : 'You don\'t have any notifications yet.'}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary-500">Notification Preferences</h2>
              <p className="text-neutral-600">
                Choose how you want to receive notifications for different types of updates.
              </p>

              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-neutral-700">Notification Type</th>
                      <th className="text-center p-4 font-semibold text-neutral-700 w-24">📧 Email</th>
                      <th className="text-center p-4 font-semibold text-neutral-700 w-24">🔔 Push</th>
                      <th className="text-center p-4 font-semibold text-neutral-700 w-24">💻 In-App</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preferences.map((pref, index) => (
                      <tr key={pref.type} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                        <td className="p-4">
                          <div className="font-semibold text-neutral-700">{pref.label}</div>
                          <div className="text-sm text-neutral-500">{pref.description}</div>
                        </td>
                        <td className="text-center p-4">
                          <button
                            onClick={() => togglePreference(pref.type, 'email')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              pref.email ? 'bg-primary-500' : 'bg-neutral-300'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              pref.email ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </td>
                        <td className="text-center p-4">
                          <button
                            onClick={() => togglePreference(pref.type, 'push')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              pref.push ? 'bg-primary-500' : 'bg-neutral-300'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              pref.push ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </td>
                        <td className="text-center p-4">
                          <button
                            onClick={() => togglePreference(pref.type, 'inApp')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              pref.inApp ? 'bg-primary-500' : 'bg-neutral-300'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              pref.inApp ? 'right-1' : 'left-1'
                            }`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quiet Hours */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-700 mb-4">⏰ Quiet Hours</h3>
                <p className="text-neutral-600 mb-4">
                  Pause notifications during specific times. You&apos;ll still receive them when quiet hours end.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Start Time</label>
                    <input type="time" defaultValue="22:00" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">End Time</label>
                    <input type="time" defaultValue="07:00" className="input-field" />
                  </div>
                </div>
              </div>

              <button className="btn-primary">Save Preferences</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
