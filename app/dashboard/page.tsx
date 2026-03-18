'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import HeroSection from "@/components/HeroSection";
import {
  Bell, BookOpen, Calendar, ChevronRight, Clock, Edit3,
  Heart, LayoutDashboard, Lock, LogOut, PlusCircle,
  Rocket, Save, Search, Settings, Star, Target, Trophy, Users, Zap, X, Check
} from 'lucide-react';
import { chapters, events } from '@/lib/data';
import { supabase, profilesApi, myClubsApi, clubProposalsApi, organizationsApi, membershipsApi } from '@/lib/api';
import { getJoinedClubs } from '@/lib/clientState';

interface SavedItem {
  id: string;
  type: 'resource' | 'event' | 'club' | 'opportunity';
  title: string;
  savedAt: string;
  icon: string;
}
interface Activity {
  id: string;
  type: 'joined' | 'saved' | 'rsvp' | 'submitted' | 'completed';
  description: string;
  timestamp: string;
}
interface MyEvent {
  id: string;
  title: string;
  club: string;
  date: string;
  time: string;
  location: string;
  rsvpStatus: 'going' | 'maybe' | 'not-going';
}
interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  earnedDate?: string;
}
interface Notification {
  id: string;
  type: 'info' | 'event' | 'achievement' | 'club';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const demoSaved: SavedItem[] = [
  { id: '1', type: 'resource', title: 'TSA Competition Guide 2026', savedAt: '2026-02-08', icon: '📄' },
  { id: '2', type: 'event', title: 'Regional TSA Conference', savedAt: '2026-02-07', icon: '📅' },
  { id: '3', type: 'club', title: 'Environmental Club', savedAt: '2026-02-05', icon: '👥' },
  { id: '4', type: 'opportunity', title: 'Summer STEM Mentorship', savedAt: '2026-02-04', icon: '💼' },
];
const demoActivity: Activity[] = [
  { id: '1', type: 'rsvp', description: 'RSVPed to Regional TSA Conference', timestamp: '2026-02-09T14:30:00' },
  { id: '2', type: 'saved', description: 'Saved TSA Competition Guide', timestamp: '2026-02-08T10:15:00' },
  { id: '3', type: 'submitted', description: 'Submitted new club proposal', timestamp: '2026-02-07T16:45:00' },
  { id: '4', type: 'completed', description: 'Completed Club Finder Quiz', timestamp: '2026-02-06T09:00:00' },
  { id: '5', type: 'joined', description: 'Joined Math League', timestamp: '2026-02-05T11:30:00' },
];
const demoEvents: MyEvent[] = [
  { id: '1', title: 'TSA Chapter Meeting', club: 'TSA', date: '2026-02-12', time: '3:30 PM', location: 'Room 204', rsvpStatus: 'going' },
  { id: '2', title: 'Robotics Build Session', club: 'Robotics Club', date: '2026-02-14', time: '4:00 PM', location: 'Engineering Lab', rsvpStatus: 'going' },
  { id: '3', title: 'Math League Practice', club: 'Math League', date: '2026-02-15', time: '3:00 PM', location: 'Room 118', rsvpStatus: 'maybe' },
  { id: '4', title: 'Science Fair Prep', club: 'Science Club', date: '2026-02-18', time: '3:30 PM', location: 'Lab 301', rsvpStatus: 'not-going' },
];
const demoAchievements: Achievement[] = [
  { id: '1', name: 'First Steps', icon: 'steps', description: 'Joined your first club', rarity: 'Common' },
  { id: '2', name: 'Quiz Master', icon: 'target', description: 'Completed the Club Finder Quiz', rarity: 'Common' },
  { id: '3', name: 'Social Butterfly', icon: 'users', description: 'Joined 3+ clubs', rarity: 'Uncommon' },
  { id: '4', name: 'Resource Hunter', icon: 'book', description: 'Saved 5+ resources', rarity: 'Uncommon' },
  { id: '5', name: 'Event Champion', icon: 'trophy', description: 'Attended 10 events', rarity: 'Rare' },
  { id: '6', name: 'Leader', icon: 'star', description: 'Became a club officer', rarity: 'Epic' },
];
const demoNotifications: Notification[] = [
  { id: '1', type: 'event', title: 'Reminder', body: 'TSA Meeting tomorrow at 3:30 PM', time: '2h ago', read: false },
  { id: '2', type: 'achievement', title: 'New Badge!', body: 'You earned "Event Champion"', time: '5h ago', read: false },
  { id: '3', type: 'club', title: 'New Member', body: 'Sarah Kim joined Robotics Club', time: '1d ago', read: true },
];

const activityIcons: Record<string, React.ReactNode> = {
  joined: <Check size={14} className="text-primary-600" />,
  saved: <Heart size={14} className="text-accent-500" />,
  rsvp: <Calendar size={14} className="text-primary-500" />,
  submitted: <Rocket size={14} className="text-secondary-500" />,
  completed: <Trophy size={14} className="text-secondary-600" />,
};
const achievementIconMap: Record<string, React.ReactNode> = {
  steps: <Rocket size={14} />,
  target: <Target size={14} />,
  users: <Users size={14} />,
  book: <BookOpen size={14} />,
  trophy: <Trophy size={14} />,
  star: <Star size={14} />,
};
const rarityColors: Record<string, string> = {
  Common: 'bg-gray-50 text-gray-600 border-gray-200',
  Uncommon: 'bg-green-50 text-green-700 border-green-200',
  Rare: 'bg-blue-50 text-blue-700 border-blue-200',
  Epic: 'bg-purple-50 text-purple-700 border-purple-200',
  Legendary: 'bg-amber-50 text-amber-700 border-amber-200',
};

function DashboardContent() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('clubconnect_dashboard_saved');
      if (s) try { return JSON.parse(s); } catch {}
    }
    return demoSaved;
  });
  const [myEvents, setMyEvents] = useState<MyEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('clubconnect_dashboard_events');
      if (s) try { return JSON.parse(s); } catch {}
    }
    return demoEvents;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('clubconnect_dashboard_notifs');
      if (s) try { return JSON.parse(s); } catch {}
    }
    return demoNotifications;
  });
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'clubs' | 'events' | 'saved' | 'settings'>(() => {
    if (typeof window !== 'undefined') {
      const urlTab = new URLSearchParams(window.location.search).get('tab');
      if (urlTab === 'clubs' || urlTab === 'events' || urlTab === 'saved' || urlTab === 'settings') return urlTab;
    }
    return 'overview';
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [editForm, setEditForm] = useState({ name: '', email: '', grade: '' });
  const [adminClubs, setAdminClubs] = useState<{ id: string; name: string; status: 'Draft' | 'Pending approval' | 'Published' }[]>([]);
  const [editingClub, setEditingClub] = useState<string | null>(null);
  const [clubEditForm, setClubEditForm] = useState<Record<string, string>>({});
  const [joinedClubs, setJoinedClubs] = useState<{ id: string; name: string; slug?: string; category?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('clubconnect_achievements');
      if (s) try { return JSON.parse(s); } catch {}
    }
    return demoAchievements;
  });

  const interests = ['STEM', 'Leadership', 'Competition'];

  useEffect(() => {
    localStorage.setItem('clubconnect_dashboard_saved', JSON.stringify(savedItems));
  }, [savedItems]);
  useEffect(() => {
    localStorage.setItem('clubconnect_dashboard_events', JSON.stringify(myEvents));
  }, [myEvents]);
  useEffect(() => {
    localStorage.setItem('clubconnect_dashboard_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('clubconnect_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Confetti on join
  useEffect(() => {
    if (searchParams.get('joined') === 'true') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard?tab=clubs');
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (!mounted || !user) {
          setLoading(false);
          return;
        }


        const profileRes: any = await profilesApi.getById(user.id);
        if (!mounted) return;
        if (!profileRes.error && profileRes.data) {
          const p = profileRes.data;
          setUserName(p.name || user.email || '');
          setUserEmail(user.email || '');
          setAvatarUrl(p.avatar_url || null);
          setEditForm({ name: p.name || '', email: user.email || '', grade: p.grade || '' });
        } else {
          setUserName(user.email || '');
          setUserEmail(user.email || '');
        }


        const clubRes: any = await myClubsApi.getMyClubs();
        if (!mounted) return;
        if (!clubRes.error && clubRes.data) {
          const clubs = clubRes.data as any[];
          const admin = clubs.map((c: any) => ({
            id: c.id,
            name: c.name,
            status: (c.is_published ? 'Published' : 'Draft') as 'Draft' | 'Pending approval' | 'Published',
          }));
          if (mounted) {
            setAdminClubs(admin);
          }
        }

        // Fetch clubs user has joined via memberships + localStorage
        const membershipRes: any = await membershipsApi.getForCurrentUser();
        if (!mounted) return;
        const dbJoined: { id: string; name: string; slug?: string; category?: string }[] = [];
        if (!membershipRes.error && membershipRes.data) {
          const memberships = membershipRes.data as any[];
          memberships
            .filter((m: any) => m.organizations)
            .forEach((m: any) => dbJoined.push({ id: m.organizations.id, name: m.organizations.name, slug: m.organizations.slug, category: m.organizations.category }));
        }
        // Also pull from localStorage (always available immediately after join)
        const localClubs = getJoinedClubs();
        const localMapped = localClubs.map(lc => {
          const ch = chapters.find(c => c.id === lc.id);
          return { id: lc.id, name: lc.name, slug: lc.id, category: ch?.category };
        });
        // Merge: DB clubs take priority, add any localStorage-only clubs
        const dbIds = new Set(dbJoined.map(c => c.slug || c.id));
        const merged = [...dbJoined, ...localMapped.filter(lc => !dbIds.has(lc.id))];
        if (mounted) {
            setJoinedClubs(merged);
            // Unlock achievements based on joined clubs
            setAchievements(prev => {
              let updated = [...prev];
              if (merged.length >= 1) {
                updated = updated.map(a => a.id === '1' ? { ...a, earnedDate: a.earnedDate || new Date().toISOString().split('T')[0] } : a);
              }
              if (merged.length >= 3) {
                updated = updated.map(a => a.id === '3' ? { ...a, earnedDate: a.earnedDate || new Date().toISOString().split('T')[0] } : a);
              }
              return updated;
            });
        }

        // Fetch proposals submitted by this user
        const propRes: any = await clubProposalsApi.getByUser(user.id);
        if (!mounted) return;
        if (!propRes.error && propRes.data) {
          setProposals(propRes.data);
        }
      } catch {

      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadDashboard();
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const handleSave = () => { setIsEditing(false); };
  const removeSaved = (id: string) => setSavedItems(prev => prev.filter(i => i.id !== id));
  const updateRSVP = (id: string, status: MyEvent['rsvpStatus']) =>
    setMyEvents(prev => prev.map(e => e.id === id ? { ...e, rsvpStatus: status } : e));
  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleDeleteClub = async (clubId: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;
    await organizationsApi.delete(clubId);
    setAdminClubs(prev => prev.filter(c => c.id !== clubId));
    setJoinedClubs(prev => prev.filter(c => c.id !== clubId));
  };
  const handlePublishClub = async (clubId: string) => {
    await myClubsApi.publish(clubId);
    setAdminClubs(prev => prev.map(c => c.id === clubId ? { ...c, status: 'Published' } : c));
  };
  const handleSaveClubEdit = async (clubId: string) => {
    await organizationsApi.update(clubId, {
      name: clubEditForm.name || undefined,
      description: clubEditForm.purpose || undefined,
      category: clubEditForm.category || undefined,
      meeting_schedule: clubEditForm.schedule || undefined,
      meeting_location: clubEditForm.location || undefined,
      advisor_name: clubEditForm.advisor || undefined,
    });
    if (clubEditForm.name) {
      setAdminClubs(prev => prev.map(c => c.id === clubId ? { ...c, name: clubEditForm.name } : c));
    }
    setEditingClub(null);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'clubs' as const, label: 'My Clubs', icon: Users },
    { id: 'events' as const, label: 'Events', icon: Calendar },
    { id: 'saved' as const, label: 'Saved', icon: Heart },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-neutral-50">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                style={{
                  width: `${6 + Math.random() * 8}px`,
                  height: `${6 + Math.random() * 8}px`,
                  backgroundColor: ['#1e3a5f', '#b8860b', '#8b2252', '#2e8b57', '#4169e1', '#ff6347', '#ffd700', '#9370db'][i % 8],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
          <style jsx>{`
            @keyframes confetti-fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .animate-confetti {
              animation: confetti-fall linear forwards;
            }
          `}</style>
        </div>
      )}
      {}
      <HeroSection align="left" shellClassName="max-w-6xl">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={userName} width={56} height={56} className="w-14 h-14 object-cover border-2 border-white/30" />
          ) : (
            <div className="w-14 h-14 bg-white/20 border-2 border-white/30 flex items-center justify-center text-lg font-bold text-white">
              {userName ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="hero-title mt-0 text-xl md:text-3xl"><span>{userName}</span></h1>
              <span className="bg-secondary-500/90 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Officer</span>
            </div>
            <p className="hero-description mt-1 text-sm truncate">{userEmail}</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-center">
            {[
              { v: joinedClubs.length, l: 'Clubs' },
              { v: myEvents.filter(e => e.rsvpStatus === 'going').length, l: 'Events' },
              { v: achievements.filter(a => a.earnedDate).length, l: 'Badges' },
            ].map(s => (
              <div key={s.l}>
                <div className="text-lg font-bold">{s.v}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Link href="/resources" className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-medium transition-colors">
              <BookOpen size={14} /> Resources
            </Link>
            <button onClick={() => setActiveTab('settings')} className="bg-white/10 hover:bg-white/20 p-2 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </HeroSection>

      {}
      <section className="bg-white border-b border-neutral-200 sticky top-[57px] z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    activeTab === tab.id ? 'text-primary-600' : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {tab.id === 'saved' && savedItems.length > 0 && (
                    <span className="ml-0.5 w-4 h-4 rounded-full bg-accent-500 text-white text-[9px] flex items-center justify-center">{savedItems.length}</span>
                  )}
                  {activeTab === tab.id && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">

          {}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[
                  { href: '/directory', Icon: Search, label: 'Clubs' },
                  { href: '/events', Icon: Calendar, label: 'Events' },
                  { href: '/events/new', Icon: Zap, label: 'New Event' },
                  { href: '/start-a-club', Icon: Rocket, label: 'Start Club' },
                  { href: '/resources', Icon: BookOpen, label: 'Resources' },
                  { href: '/donate', Icon: Heart, label: 'Donate' },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="flex flex-col items-center gap-1 p-3 bg-white border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all text-center group">
                    <a.Icon size={20} className="text-primary-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-medium text-neutral-600">{a.label}</span>
                  </Link>
                ))}
              </div>

              {/* My Clubs (primary section) */}
              {joinedClubs.length > 0 && (
                <div className="bg-white border border-neutral-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                      <Users size={14} /> My Clubs
                    </h2>
                    <button onClick={() => setActiveTab('clubs')} className="text-[11px] text-primary-500 hover:underline">Manage →</button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {joinedClubs.map(club => (
                        <Link key={club.id} href={`/directory/${club.slug || club.id}`}
                          className="flex items-center gap-2.5 p-2.5 hover:bg-primary-50 transition-colors border border-neutral-100 group">
                          <div className="w-8 h-8 bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold group-hover:bg-primary-200 transition-colors">{club.name.charAt(0)}</div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-neutral-700 truncate block group-hover:text-primary-600 transition-colors">{club.name}</span>
                            {club.category && <span className="text-[10px] text-neutral-400">{club.category}</span>}
                          </div>
                          <ChevronRight size={12} className="ml-auto text-neutral-300 group-hover:text-primary-500 transition-colors" />
                        </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity + Upcoming row */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white border border-neutral-100 p-4">
                  <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5 mb-3">
                    <Zap size={14} className="text-secondary-500" /> Recent Activity
                  </h2>
                  <div className="space-y-1.5">
                    {[
                      ...joinedClubs.map((c, i) => ({
                        id: `join-${c.id}`,
                        type: 'joined' as const,
                        description: `Joined ${c.name}`,
                        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
                      })),
                      ...demoActivity,
                    ].slice(0, 5).map(a => (
                      <div key={a.id} className="flex items-start gap-2 p-2 hover:bg-neutral-50 transition-colors">
                        <span className="mt-0.5">{activityIcons[a.type]}</span>
                        <div className="min-w-0">
                          <p className="text-xs text-neutral-700 leading-snug">{a.description}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(a.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-neutral-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary-500" /> Upcoming
                    </h2>
                    <button onClick={() => setActiveTab('events')} className="text-[11px] text-primary-500 hover:underline">All →</button>
                  </div>
                  <div className="space-y-2">
                    {myEvents.filter(e => e.rsvpStatus !== 'not-going').slice(0, 3).map(ev => (
                      <div key={ev.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 transition-colors">
                        <div className="text-center bg-primary-500 text-white p-1.5 min-w-[44px]">
                          <div className="text-[9px] uppercase">{new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                          <div className="text-base font-bold leading-none">{new Date(ev.date).getDate()}</div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-neutral-800 truncate">{ev.title}</h4>
                          <p className="text-[10px] text-neutral-400">{ev.club} · {ev.time}</p>
                        </div>
                        <span className={`ml-auto shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          ev.rsvpStatus === 'going' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{ev.rsvpStatus === 'going' ? '✓' : '?'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white border border-neutral-100 p-4">
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5 mb-3">
                  <Bell size={14} /> Notifications
                  {unreadCount > 0 && <span className="px-1.5 py-0.5 bg-accent-500 text-white text-[9px] rounded-full font-bold">{unreadCount}</span>}
                </h2>
                <div className="space-y-1">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                        n.read ? 'opacity-50 hover:opacity-70' : 'bg-primary-50/50 hover:bg-primary-50'
                      }`}
                    >
                      <div className={`w-7 h-7 flex items-center justify-center text-xs ${
                        n.type === 'event' ? 'bg-blue-100 text-blue-500' :
                        n.type === 'achievement' ? 'bg-amber-100 text-amber-500' :
                        n.type === 'club' ? 'bg-green-100 text-green-500' :
                        'bg-neutral-100 text-neutral-500'
                      }`}>
                        {n.type === 'event' ? <Calendar size={13} /> :
                         n.type === 'achievement' ? <Trophy size={13} /> :
                         n.type === 'club' ? <Users size={13} /> :
                         <Bell size={13} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-700">{n.title}: <span className="font-normal text-neutral-500">{n.body}</span></p>
                      </div>
                      <span className="text-[10px] text-neutral-400 shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements (compact inline row) */}
              <div className="bg-white border border-neutral-100 p-4">
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5 mb-3">
                  <Trophy size={14} className="text-amber-500" /> Achievements
                </h2>
                <div className="flex flex-wrap gap-2">
                  {achievements.map(a => (
                    <div key={a.id} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border text-xs ${a.earnedDate ? rarityColors[a.rarity] : 'bg-neutral-50 border-neutral-200 text-neutral-400'}`} title={a.earnedDate ? `${a.description} — Earned ${a.earnedDate}` : `${a.description} — Not yet earned`}>
                      <span className={a.earnedDate ? '' : 'opacity-40'}>{achievementIconMap[a.icon] ?? <Star size={14} />}</span>
                      <span className="font-semibold">{a.name}</span>
                      {!a.earnedDate && <Lock size={10} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {}
          {activeTab === 'clubs' && (
            <div className="space-y-5 animate-fade-up">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-800">My Clubs</h2>
                <div className="flex gap-2">
                  <Link href="/start-a-club" className="text-xs bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-2  font-semibold flex items-center gap-1 transition-colors">
                    <Rocket size={13} /> Start Club
                  </Link>
                  <Link href="/directory" className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-3 py-2  font-semibold flex items-center gap-1 transition-colors">
                    <PlusCircle size={13} /> Join Club
                  </Link>
                </div>
              </div>

              {}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Joined</h3>
                {joinedClubs.length === 0 ? (
                  <div className="bg-white border border-neutral-100 p-8 text-center">
                    <Search size={28} className="mx-auto text-neutral-300 mb-2" />
                    <p className="text-sm text-neutral-500">You haven&apos;t joined any clubs yet.</p>
                    <Link href="/directory" className="inline-flex items-center gap-1 mt-3 text-xs text-primary-500 font-semibold hover:underline">
                      <PlusCircle size={12} /> Browse Clubs
                    </Link>
                  </div>
                ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {joinedClubs.map(club => (
                      <Link key={club.id} href={`/directory/${club.slug || club.id}`} className="block bg-white border border-neutral-100 p-4 hover:shadow-md hover:border-primary-200 transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-bold group-hover:bg-primary-200 transition-colors">{club.name.charAt(0)}</div>
                          <div>
                            <h4 className="text-sm font-bold text-neutral-800 group-hover:text-primary-600 transition-colors">{club.name}</h4>
                            <p className="text-[10px] text-neutral-400">Student Member</p>
                          </div>
                          <ChevronRight size={14} className="ml-auto text-neutral-300 group-hover:text-primary-500 transition-colors" />
                        </div>
                        {club.category && <span className="text-[10px] px-2 py-0.5 bg-primary-50 text-primary-600 font-medium">{club.category}</span>}
                      </Link>
                  ))}
                </div>
                )}
              </div>
              {adminClubs.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Created by You</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {adminClubs.map(club => (
                      <div key={club.id} className="bg-white  border-2 border-secondary-100 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10  bg-secondary-100 text-secondary-600 flex items-center justify-center text-lg font-bold">{club.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-neutral-800 truncate">{club.name}</h4>
                            <span className={`text-[10px] font-bold ${club.status === 'Published' ? 'text-green-600' : club.status === 'Pending approval' ? 'text-amber-600' : 'text-neutral-400'}`}>{club.status}</span>
                          </div>
                          <button
                            onClick={() => {
                              if (editingClub === club.id) { setEditingClub(null); }
                              else { setEditingClub(club.id); setClubEditForm({ name: club.name, purpose: '', category: '', schedule: '', location: '', advisor: '' }); }
                            }}
                            className="p-1.5  hover:bg-neutral-100 transition-colors"
                          >
                            <Edit3 size={14} className="text-neutral-400" />
                          </button>
                        </div>
                        {editingClub === club.id && (
                          <div className="space-y-2 pt-2 border-t border-neutral-100 animate-fade-up">
                            {[
                              { key: 'name', label: 'Club Name', ph: 'Club name' },
                              { key: 'purpose', label: 'Purpose', ph: 'Mission statement' },
                              { key: 'category', label: 'Category', ph: 'e.g., STEM, Arts' },
                              { key: 'schedule', label: 'Schedule', ph: 'e.g., Tuesdays 3:30 PM' },
                              { key: 'location', label: 'Location', ph: 'e.g., Room 204' },
                              { key: 'advisor', label: 'Advisor', ph: 'Faculty advisor name' },
                            ].map(f => (
                              <div key={f.key}>
                                <label className="text-[10px] font-semibold text-neutral-500 uppercase">{f.label}</label>
                                <input
                                  type="text"
                                  value={clubEditForm[f.key] || ''}
                                  onChange={e => setClubEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                  placeholder={f.ph}
                                  className="w-full text-xs bg-neutral-50  px-2.5 py-1.5 border border-neutral-200 focus:border-primary-300 focus:outline-none"
                                />
                              </div>
                            ))}
                            <div className="flex gap-2 pt-1">
                              <button onClick={() => handleSaveClubEdit(club.id)} className="flex-1 text-xs bg-primary-500 hover:bg-primary-600 text-white py-1.5  font-semibold flex items-center justify-center gap-1 transition-colors">
                                <Check size={12} /> Save
                              </button>
                              {club.status !== 'Published' && (
                                <button onClick={() => handlePublishClub(club.id)} className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 font-semibold transition-colors">
                                  Publish
                                </button>
                              )}
                              <button onClick={() => handleDeleteClub(club.id)} className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5">
                                Delete
                              </button>
                              <button onClick={() => setEditingClub(null)} className="text-xs text-neutral-400 hover:text-neutral-600 px-3 py-1.5 ">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Club Proposals */}
              {proposals.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Your Proposals</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {proposals.map((p: any) => (
                      <Link key={p.id} href={`/proposals/${p.id}`} className="bg-white border-2 border-primary-100 p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-bold">{(p.club_name || '?')[0]}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-neutral-800 truncate group-hover:text-primary-600 transition-colors">{p.club_name}</h4>
                            <span className={`text-[10px] font-bold ${p.status === 'approved' ? 'text-green-600' : p.status === 'rejected' ? 'text-red-500' : 'text-amber-600'}`}>
                              {p.status === 'pending' ? '⏳ Pending Review' : p.status === 'approved' ? '✅ Approved' : p.status === 'rejected' ? '❌ Rejected' : p.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-2">{p.mission_statement}</p>
                        {p.expected_members && <p className="text-[10px] text-neutral-400 mt-1">👥 {p.expected_members} expected members</p>}
                        <div className="text-[10px] text-primary-500 font-semibold mt-2">View Details →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {}
              <div className="bg-white  border border-neutral-100 p-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5 mb-3">
                  <Star size={14} className="text-secondary-500" /> Clubs You Might Like
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {[{ name: 'Science Olympiad', id: 'science-olympiad' }, { name: 'Debate Team', id: 'debate-team' }, { name: 'CS Club', id: 'cs-club' }].map(c => (
                    <Link key={c.id} href={`/directory/${c.id}`} className="p-3  border border-neutral-100 hover:border-primary-200 transition-all">
                      <h4 className="text-xs font-semibold text-neutral-700">{c.name}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Based on your interests</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {}
          {activeTab === 'events' && (
            <div className="space-y-5 animate-fade-up">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-800">My Events</h2>
                <Link href="/events" className="text-xs text-primary-500 font-semibold hover:underline">Browse All →</Link>
              </div>
              <div className="space-y-2">
                {myEvents.map(ev => (
                  <div key={ev.id} className="bg-white  border border-neutral-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="text-center bg-primary-500 text-white  p-2 min-w-[52px]">
                      <div className="text-[9px] uppercase">{new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                      <div className="text-lg font-bold leading-none">{new Date(ev.date).getDate()}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-neutral-800">{ev.title}</h4>
                      <p className="text-xs text-neutral-400">{ev.club} · {ev.time} · {ev.location}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {(['going', 'maybe', 'not-going'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => updateRSVP(ev.id, s)}
                          className={`px-2.5 py-1 text-[10px] font-bold  transition-all ${
                            ev.rsvpStatus === s
                              ? s === 'going' ? 'bg-green-500 text-white' : s === 'maybe' ? 'bg-yellow-500 text-white' : 'bg-red-400 text-white'
                              : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                          }`}
                        >
                          {s === 'going' ? '✓ Going' : s === 'maybe' ? '? Maybe' : '✕ Skip'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {activeTab === 'saved' && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="text-lg font-bold text-neutral-800">Saved Items</h2>
              {savedItems.length === 0 ? (
                <div className="bg-white  border border-neutral-100 p-10 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm text-neutral-500">No saved items yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {savedItems.map(item => (
                    <div key={item.id} className="bg-white  border border-neutral-100 p-4 flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-neutral-800 truncate">{item.title}</h4>
                        <p className="text-[10px] text-neutral-400 capitalize">{item.type} · {item.savedAt}</p>
                      </div>
                      <button onClick={() => removeSaved(item.id)} className="text-neutral-300 hover:text-red-400 transition-colors p-1"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-5 animate-fade-up">
              <div className="bg-white  border border-neutral-100 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2"><Settings size={18} /> Settings</h2>
                  <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-primary-500 hover:underline flex items-center gap-1">
                    {isEditing ? 'Cancel' : <><Edit3 size={12} /> Edit</>}
                  </button>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    {[
                      { label: 'Name', value: editForm.name, key: 'name' as const, type: 'text' },
                      { label: 'Email', value: editForm.email, key: 'email' as const, type: 'email' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">{f.label}</label>
                        <input type={f.type} value={f.value}
                          onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="w-full text-sm bg-neutral-50  px-3 py-2 border border-neutral-200 focus:border-primary-300 focus:outline-none" />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Grade</label>
                      <select value={editForm.grade} onChange={e => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                        className="w-full text-sm bg-neutral-50  px-3 py-2 border border-neutral-200 focus:border-primary-300 focus:outline-none">
                        {['Freshman (9th)', 'Sophomore (10th)', 'Junior (11th)', 'Senior (12th)'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={handleSave} className="w-full text-sm bg-primary-500 hover:bg-primary-600 text-white py-2  font-semibold flex items-center justify-center gap-1.5 transition-colors">
                      <Save size={14} /> Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: 'Name', value: userName },
                      { label: 'Email', value: userEmail },
                      { label: 'Grade', value: editForm.grade },
                    ].map(f => (
                      <div key={f.label} className="p-3 bg-neutral-50 ">
                        <div className="text-[10px] text-neutral-400 uppercase font-bold">{f.label}</div>
                        <div className="text-sm font-semibold text-neutral-700">{f.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white  border border-neutral-100 p-5">
                <h3 className="text-sm font-bold text-neutral-800 mb-3">Preferences</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Email notifications for events', checked: true },
                    { label: 'Show my profile to other members', checked: true },
                    { label: 'Dark mode (coming soon)', checked: false },
                  ].map(p => (
                    <label key={p.label} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked={p.checked} className="w-4 h-4 accent-primary-500 rounded" />
                      <span className="text-xs text-neutral-600">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="text-red-500 text-xs font-semibold hover:underline flex items-center gap-1">
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="min-h-screen bg-neutral-100 flex items-center justify-center"><p className="text-neutral-500">Loading dashboard...</p></div>}><DashboardContent /></Suspense>;
}
