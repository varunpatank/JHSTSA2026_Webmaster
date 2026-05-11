"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AuthRequiredNotice from "@/components/AuthRequiredNotice";
import HeroSection from "@/components/HeroSection";
import { useAuthGate } from "@/lib/useAuthGate";
import {
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Info,
  MessageCircle,
  Settings,
  Star,
  Trash2,
  Users,
  Zap,
} from "lucide-react";

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </div>
  );
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "event"
    | "announcement"
    | "mention"
    | "achievement"
    | "reminder"
    | "system";
  date: string;
  read: boolean;
  club?: string;
  actionUrl?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Meeting Tomorrow",
    message:
      "Robotics Club weekly build session starts at 3:30 PM in Room 204. Don't forget to bring your laptop!",
    type: "reminder",
    date: "2026-03-04T14:00:00",
    read: false,
    club: "Robotics Club",
    actionUrl: "/events",
    actionLabel: "View Meeting",
  },
  {
    id: "n2",
    title: "New Achievement Unlocked!",
    message:
      "Congratulations! You earned the 'Collaborator' badge for participating in a cross-club project.",
    type: "achievement",
    date: "2026-03-04T10:30:00",
    read: false,
    actionUrl: "/hub/achievements",
    actionLabel: "View Badge",
  },
  {
    id: "n3",
    title: "TSA State Conference Registration",
    message:
      "Registration deadline for the Washington State TSA Conference is March 20. Sign up now to secure your spot!",
    type: "announcement",
    date: "2026-03-03T09:00:00",
    read: false,
    club: "TSA Chapter",
    actionUrl: "/hub/competitions",
    actionLabel: "Register",
  },
  {
    id: "n4",
    title: "You were mentioned in a discussion",
    message:
      "Sarah K. mentioned you in 'Best practices for running a successful fundraiser?' — 'I agree with @you, the bake sale format works best...'",
    type: "mention",
    date: "2026-03-03T16:45:00",
    read: true,
    actionUrl: "/hub/discussions",
    actionLabel: "View Discussion",
  },
  {
    id: "n5",
    title: "Community Service Day This Saturday",
    message:
      "Beach cleanup at Juanita Beach Park, 9:00 AM - 12:00 PM. 15 volunteers still needed!",
    type: "event",
    date: "2026-03-02T12:00:00",
    read: true,
    club: "Environmental Club",
    actionUrl: "/events",
    actionLabel: "RSVP",
  },
  {
    id: "n6",
    title: "Club Budget Updated",
    message:
      "Your club's budget allocation has been updated. New total: $3,000. Check the funding page for details.",
    type: "system",
    date: "2026-03-01T11:00:00",
    read: true,
    club: "CS Club",
    actionUrl: "/funding",
    actionLabel: "View Budget",
  },
  {
    id: "n7",
    title: "New Event: Spring Showcase",
    message:
      "Art Club is hosting a Spring Showcase on April 15. Submissions open now — share your best work!",
    type: "event",
    date: "2026-02-28T15:00:00",
    read: true,
    club: "Art Club",
    actionUrl: "/events",
    actionLabel: "Learn More",
  },
  {
    id: "n8",
    title: "Goal Milestone Reached!",
    message:
      "Your club reached 73% of the 'Recruit 15 new members' goal. Keep it up!",
    type: "achievement",
    date: "2026-02-27T08:00:00",
    read: true,
    actionUrl: "/hub/goals",
    actionLabel: "Track Progress",
  },
  {
    id: "n9",
    title: "System Maintenance Complete",
    message:
      "ClubConnect has been updated with new features including the Hub, Achievement Badges, and Discussion Forums.",
    type: "system",
    date: "2026-02-25T07:00:00",
    read: true,
  },
  {
    id: "n10",
    title: "Mentor Session Reminder",
    message:
      "Your mentorship session with Dr. Sarah Chen is confirmed for next Tuesday at 4:00 PM.",
    type: "reminder",
    date: "2026-02-24T10:00:00",
    read: true,
    actionUrl: "/hub/mentors",
    actionLabel: "View Details",
  },
];

const TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  event: { icon: <Calendar size={16} />, color: "bg-blue-100 text-blue-600" },
  announcement: {
    icon: <Zap size={16} />,
    color: "bg-yellow-100 text-yellow-600",
  },
  mention: {
    icon: <MessageCircle size={16} />,
    color: "bg-purple-100 text-purple-600",
  },
  achievement: {
    icon: <Star size={16} />,
    color: "bg-amber-100 text-amber-600",
  },
  reminder: { icon: <Clock size={16} />, color: "bg-green-100 text-green-600" },
  system: {
    icon: <Info size={16} />,
    color: "bg-neutral-100 text-neutral-500",
  },
};

export default function NotificationsPage() {
  const { ready, loggedIn } = useAuthGate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [typeFilter, setTypeFilter] = useState("All");
  const [mountedNow, setMountedNow] = useState<number | null>(null);

  useEffect(() => {
    setMountedNow(Date.now());
  }, []);

  const types = [
    "All",
    "event",
    "announcement",
    "mention",
    "achievement",
    "reminder",
    "system",
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = notifications.filter(
    (n) => typeFilter === "All" || n.type === typeFilter,
  );

  function timeAgo(dateStr: string) {
    if (mountedNow === null) return "Recently";

    const diff = mountedNow - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-500">Loading notifications...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <AuthRequiredNotice
        message="Your notifications are available after login."
        redirectTo="/notifications"
      />
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-neutral-100 min-h-screen">
      <HeroSection
        title="Notifications"
        icon={<Bell size={36} />}
        description={<>Never miss a beat — get <strong className="text-secondary-700 font-bold">real-time updates</strong> on club announcements, event reminders, new member approvals, achievement posts, and messages from your <strong className="text-primary-700 font-semibold">club officers and advisors.</strong></>}
      >
        {unreadCount > 0 && (
          <p className="mt-4 inline-block bg-white/10 px-4 py-2 text-sm">
            You have <strong>{unreadCount}</strong> unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>
        )}
      </HeroSection>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="card p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="select-field text-sm w-auto capitalize"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "All"
                  ? "All Types"
                  : t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm text-primary-600 hover:underline flex items-center gap-1"
              >
                <CheckCircle size={14} /> Mark All Read
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((notif) => {
            const typeInfo = TYPE_ICONS[notif.type];
            return (
              <Reveal key={notif.id}>
                <div
                  className={`card p-4 flex gap-3 transition-all ${!notif.read ? "border-l-4 border-primary-500 bg-primary-50/20" : ""}`}
                >
                  <div
                    className={`w-9 h-9  flex items-center justify-center shrink-0 ${typeInfo.color}`}
                  >
                    {typeInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`text-sm ${!notif.read ? "font-bold text-primary-800" : "font-semibold text-neutral-700"}`}
                        >
                          {notif.title}
                        </h3>
                        {notif.club && (
                          <span className="text-xs text-neutral-400">
                            {notif.club}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-neutral-400">
                          {timeAgo(notif.date)}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                      {notif.message}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      {notif.actionUrl && notif.actionLabel && (
                        <Link
                          href={notif.actionUrl}
                          className="text-xs text-primary-600 font-semibold hover:underline"
                        >
                          {notif.actionLabel}
                        </Link>
                      )}
                      {!notif.read && (
                        <button
                          onClick={() => markRead(notif.id)}
                          className="text-xs text-neutral-400 hover:text-neutral-600"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-0.5"
                      >
                        <Trash2 size={10} /> Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <Bell size={40} className="mx-auto text-neutral-300" />
            <p className="mt-3 text-neutral-500">No notifications to show.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

