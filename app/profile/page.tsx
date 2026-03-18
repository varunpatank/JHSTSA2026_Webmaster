"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminClubs, getJoinedClubs } from "@/lib/clientState";
import { supabase, authApi, profilesApi, membershipsApi, myClubsApi } from "@/lib/api";
import AvatarUploader from "@/components/AvatarUploader";
import {
  Activity,
  Award,
  Bell,
  Bookmark,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Flame,
  Heart,
  LogOut,
  Save,
  Settings,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
function ProfileSkeleton() {
  return (
    <div className="bg-neutral-100 min-h-screen animate-pulse">
      <section className="bg-primary-500 border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-400" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-primary-400 rounded w-48" />
            <div className="h-4 bg-primary-400 rounded w-64" />
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="card p-6 space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-32" />
          <div className="h-10 bg-neutral-200 rounded" />
          <div className="h-10 bg-neutral-200 rounded" />
          <div className="h-10 bg-neutral-200 rounded" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div className="h-6 bg-neutral-200 rounded w-32" />
            <div className="h-16 bg-neutral-200 rounded" />
            <div className="h-16 bg-neutral-200 rounded" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("Student User");
  const [email, setEmail] = useState("student@jhstsa.edu");
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [joinedClubs, setJoinedClubs] = useState(getJoinedClubs());
  const [adminClubs, setAdminClubs] = useState(getAdminClubs());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const signedIn = await authApi.isLoggedIn();
        setLoggedIn(signedIn);
        if (signedIn) {
          const { data } = await supabase.auth.getUser();
          const user = data.user;
          if (user?.id) {
              setUserId(user.id);
            const profileRes = await profilesApi.getById(user.id);
            const profile = profileRes.data as any;
            if (profile) {
              setName(`${profile.name}` || "Student User");
              setEmail(profile.email ?? user.email ?? "student@jhstsa.edu");
              setAvatarUrl(profile.avatar_url ?? null);
              setPhone(profile.phone_number ?? "");
              setBio(profile.bio ?? "");
              setGrade(profile.grade ? String(profile.grade) : "");
              setSchool(profile.school ?? "");
            } else {
              setName(user.user_metadata?.full_name || "Student User");
              setEmail(user.email ?? "student@jhstsa.edu");
            }
          }

          setJoinedClubs(getJoinedClubs());
          setAdminClubs(getAdminClubs());

          // Also load clubs from Supabase memberships
          try {
            const membershipRes: any = await membershipsApi.getForCurrentUser();
            if (!membershipRes.error && membershipRes.data) {
              const dbClubs = (membershipRes.data as any[])
                .filter((m: any) => m.organizations)
                .map((m: any) => ({ id: m.organizations.id, name: m.organizations.name, status: 'member' as const }));
              if (dbClubs.length > 0) {
                setJoinedClubs(prev => {
                  const existing = new Set(prev.map((c: any) => c.id));
                  const merged = [...prev];
                  for (const c of dbClubs) {
                    if (!existing.has(c.id)) merged.push(c);
                  }
                  return merged;
                });
              }
            }
            const adminRes: any = await myClubsApi.getMyClubs();
            if (!adminRes.error && adminRes.data) {
              const dbAdmin = (adminRes.data as any[]).map((c: any) => ({
                id: c.id,
                name: c.name,
                status: (c.is_published ? 'Published' : 'Draft') as 'Draft' | 'Pending approval' | 'Published',
              }));
              if (dbAdmin.length > 0) setAdminClubs(dbAdmin);
            }
          } catch {}
        }
      } catch (e) {
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const notifications = useMemo(() => {
    const joinNotifications = joinedClubs.map((club) =>
      club.status === "pending"
        ? `${club.name}: join request is pending approval.`
        : `${club.name}: membership confirmed.`,
    );

    const adminNotifications = adminClubs.map(
      (club) => `${club.name}: status is ${club.status}.`,
    );

    return [...joinNotifications, ...adminNotifications].slice(0, 6);
  }, [joinedClubs, adminClubs]);

  if (!ready) {
    return <ProfileSkeleton />;
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="card p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-heading font-bold text-primary-600">
            Please Sign In
          </h1>
          <p className="mt-2 text-neutral-700">
            Your profile dashboard is available after login.
          </p>
          <Link
            href="/login?redirect=/profile"
            className="btn-primary inline-block mt-5"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const updates: Record<string, unknown> = {
        name,
        email,
        phone_number: phone || null,
        bio: bio || null,
        grade: grade ? parseInt(grade) : null,
        school: school || null,
      };
      const res = await profilesApi.update(userId, updates as any);
      if ((res as any).error) {
        setSaveMsg("Failed to save. Please try again.");
      } else {
        setSaveMsg("Profile saved successfully!");
        setEditing(false);
      }
    } catch {
      setSaveMsg("An error occurred while saving.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-500 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-400 overflow-hidden border-2 border-white flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold">{name}</h1>
              <p className="text-primary-100">{email}</p>
              {grade && <p className="text-primary-200 text-sm">Grade {grade} · {school || "Juanita HS"}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="btn-outline border-white text-white hover:bg-white hover:text-primary-500 flex items-center gap-2 text-sm"
            >
              {editing ? <Settings size={16} /> : <Edit3 size={16} />}
              {editing ? "Cancel" : "Edit Profile"}
            </button>
            <button
              className="btn-outline border-white text-white hover:bg-white hover:text-primary-500 flex items-center gap-2 text-sm"
              onClick={async () => {
                await authApi.signOut();
                router.push("/");
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      </section>

      {saveMsg && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 mt-4`}>
          <div className={`p-3  text-sm font-medium ${saveMsg.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {saveMsg}
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
            <User size={18} /> Account Details
          </h2>
          <div className="mt-4">
            {userId && (
              <AvatarUploader
                userId={userId}
                currentUrl={avatarUrl}
                onUpdate={(url) => setAvatarUrl(url)}
              />
            )}
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" disabled={!editing} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" disabled={!editing} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="Optional" disabled={!editing} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Grade</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="select-field" disabled={!editing}>
                <option value="">Not specified</option>
                <option value="9">9th</option>
                <option value="10">10th</option>
                <option value="11">11th</option>
                <option value="12">12th</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">School</label>
              <input value={school} onChange={(e) => setSchool(e.target.value)} className="input-field" placeholder="e.g. Juanita HS" disabled={!editing} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Tell us about yourself..." disabled={!editing} />
            </div>
            {editing && (
              <button onClick={handleSaveProfile} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <Clock size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-primary-600">
                Your Clubs
              </h2>
              <Link
                href="/directory"
                className="text-sm font-semibold text-primary-600 hover:underline"
              >
                Browse More Clubs
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {joinedClubs.length === 0 && (
                <p className="text-sm text-neutral-600">No clubs joined yet.</p>
              )}
              {joinedClubs.map((club) => (
                <div
                  key={club.id}
                  className="border border-neutral-200 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-primary-600">
                      {club.name}
                    </p>
                    <p className="text-xs text-neutral-600">
                      Membership status
                    </p>
                  </div>
                  <span
                    className={`badge ${club.status === "member" ? "badge-primary" : "badge-outline"}`}
                  >
                    {club.status === "member" ? "Member" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-primary-600">
                Admin Clubs
              </h2>
              <Link
                href="/start-a-club"
                className="text-sm font-semibold text-primary-600 hover:underline"
              >
                Start New Club
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {adminClubs.length === 0 && (
                <p className="text-sm text-neutral-600">No admin clubs yet.</p>
              )}
              {adminClubs.map((club) => (
                <div
                  key={club.id}
                  className="border border-neutral-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-primary-600">
                      {club.name}
                    </p>
                    <p className="text-xs text-neutral-600">
                      Status: {club.status}
                    </p>
                  </div>
                  <Link
                    href={`/events/new?club=${club.id}`}
                    className="btn-outline text-sm text-center"
                  >
                    Add Event
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
              <Bell size={18} /> Notifications
            </h2>
            <ul className="mt-4 space-y-2">
              {notifications.length === 0 && (
                <li className="text-sm text-neutral-600 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  All caught up! No new notifications.
                </li>
              )}
              {notifications.map((note) => (
                <li key={note} className="text-sm text-neutral-700 flex items-start gap-2 p-2  hover:bg-neutral-50">
                  <Bell size={14} className="text-primary-400 mt-0.5 shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
              <Award size={18} /> Achievements
            </h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Star, label: "First Steps", desc: "Created an account", color: "bg-yellow-100 text-yellow-700", earned: true },
                { icon: Zap, label: "Active Member", desc: "Joined a club", color: "bg-blue-100 text-blue-700", earned: joinedClubs.length > 0 },
                { icon: Target, label: "Leader", desc: "Became an officer", color: "bg-purple-100 text-purple-700", earned: adminClubs.length > 0 },
                { icon: Flame, label: "On Fire", desc: "3+ clubs joined", color: "bg-red-100 text-red-700", earned: joinedClubs.length >= 3 },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className={`p-3  text-center ${badge.earned ? badge.color : "bg-neutral-100 text-neutral-400"} transition-all ${badge.earned ? "ux-hover-lift-sm" : "opacity-60"}`}>
                    <Icon size={24} className="mx-auto" />
                    <p className="mt-1 text-xs font-bold">{badge.label}</p>
                    <p className="text-[10px] mt-0.5">{badge.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {}
          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
              <Activity size={18} /> Recent Activity
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { action: "Profile created", time: "Today", icon: User, color: "bg-blue-100 text-blue-600" },
                ...(joinedClubs.length > 0 ? [{ action: `Joined ${joinedClubs[0]?.name || "a club"}`, time: "Recently", icon: CheckCircle, color: "bg-green-100 text-green-600" }] : []),
                ...(adminClubs.length > 0 ? [{ action: `Managing ${adminClubs[0]?.name || "a club"}`, time: "Recently", icon: TrendingUp, color: "bg-purple-100 text-purple-600" }] : []),
                { action: "Welcome to ClubConnect!", time: "Start", icon: Star, color: "bg-yellow-100 text-yellow-600" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-2  hover:bg-neutral-50">
                    <div className={`w-8 h-8  ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-700">{item.action}</p>
                      <p className="text-xs text-neutral-400">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {}
          <div className="card p-6">
            <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
              <Bookmark size={18} /> Saved Resources &amp; AI Outputs
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { title: "Club Constitution Template", type: "Template", icon: "📄", saved: "2 days ago" },
                { title: "Fundraising Guide for New Clubs", type: "Guide", icon: "💰", saved: "1 week ago" },
                { title: "AI: Club name brainstorm results", type: "AI Output", icon: "🤖", saved: "3 days ago" },
                { title: "Event Planning Checklist", type: "Checklist", icon: "✅", saved: "5 days ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3  border border-neutral-100 hover:bg-primary-50/30 transition-colors group">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary-700 group-hover:text-primary-500">{item.title}</p>
                    <p className="text-xs text-neutral-500">{item.type} · Saved {item.saved}</p>
                  </div>
                  <button className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Remove</button>
                </div>
              ))}
              <Link href="/resources" className="text-sm text-primary-600 font-semibold hover:underline">Browse more resources →</Link>
            </div>
          </div>

          {}
          <div className="card p-6 bg-gradient-to-br from-purple-50 to-primary-50 border-purple-200">
            <h2 className="text-xl font-heading font-bold text-purple-700 flex items-center gap-2">
              <Sparkles size={18} /> Interests &amp; Preferences
            </h2>
            <p className="mt-1 text-sm text-neutral-600">Help our AI recommend better clubs and resources by choosing your interests:</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["STEM", "Arts", "Music", "Sports", "Coding", "Debate", "Service", "Leadership", "Writing", "Science", "Math", "Business", "Environment", "Culture", "Media", "Gaming"].map(tag => {
                const selected = selectedInterests.has(tag);
                return (
                  <button key={tag} onClick={() => setSelectedInterests(prev => { const next = new Set(prev); if (next.has(tag)) next.delete(tag); else next.add(tag); return next; })}
                    className={`px-3 py-1.5  text-xs font-semibold border transition-all ${selected ? "bg-purple-600 text-white border-purple-600" : "bg-white text-neutral-600 border-neutral-200 hover:border-purple-300"}`}>
                    {selected ? <span className="inline-flex items-center gap-1"><CheckCircle size={10} /> {tag}</span> : tag}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Tag size={14} className="text-purple-600" />
              <p className="text-xs text-purple-700">Your interests power AI recommendations across the platform — on the Discover page, in Resources, and in your Dashboard.</p>
            </div>
          </div>

          {}
        </div>
      </section>
    </div>
  );
}
