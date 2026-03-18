export type MembershipState = "member" | "pending";

export interface UserClubRecord {
  id: string;
  name: string;
  status: MembershipState;
}

export interface AdminClubRecord {
  id: string;
  name: string;
  status: "Draft" | "Pending approval" | "Published";
}

const LOGGED_IN_KEY = "clubconnect_logged_in";
const USER_NAME_KEY = "clubconnect_user_name";
const USER_EMAIL_KEY = "clubconnect_user_email";
const JOINED_CLUBS_KEY = "clubconnect_joined_clubs";
const ADMIN_CLUBS_KEY = "clubconnect_admin_clubs";
const EVENTS_KEY = "clubconnect_submitted_events";

const canUseStorage = () => typeof window !== "undefined";

function readArray<T>(key: string): T[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function isLoggedIn() {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(LOGGED_IN_KEY) === "true";
}

export function setLoggedInState(loggedIn: boolean, identity?: { name?: string | null; email?: string | null }) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LOGGED_IN_KEY, loggedIn ? "true" : "false");

  if (!loggedIn) return;

  if (identity?.name) {
    window.localStorage.setItem(USER_NAME_KEY, identity.name);
  }

  if (identity?.email) {
    window.localStorage.setItem(USER_EMAIL_KEY, identity.email);
  }
}

export function loginUser(name: string, email: string) {
  setLoggedInState(true, { name, email });
}

export function logoutUser() {
  setLoggedInState(false);
}

export function getUserIdentity() {
  if (!canUseStorage()) {
    return { name: "Student User", email: "student@jhstsa.edu" };
  }

  return {
    name: window.localStorage.getItem(USER_NAME_KEY) || "Student User",
    email: window.localStorage.getItem(USER_EMAIL_KEY) || "student@jhstsa.edu",
  };
}

export function getJoinedClubs(): UserClubRecord[] {
  return readArray<UserClubRecord>(JOINED_CLUBS_KEY);
}

export function addJoinedClub(record: UserClubRecord) {
  const clubs = getJoinedClubs();
  if (clubs.some((club) => club.id === record.id)) return;
  writeArray(JOINED_CLUBS_KEY, [record, ...clubs]);
}

export function getAdminClubs(): AdminClubRecord[] {
  return readArray<AdminClubRecord>(ADMIN_CLUBS_KEY);
}

export function addAdminClub(record: AdminClubRecord) {
  const clubs = getAdminClubs();
  if (clubs.some((club) => club.id === record.id)) return;
  writeArray(ADMIN_CLUBS_KEY, [record, ...clubs]);
}

export interface SubmittedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  clubId: string;
  clubName: string;
  description: string;
  startTime: string;
  endTime: string;
}

export function getSubmittedEvents(): SubmittedEvent[] {
  return readArray<SubmittedEvent>(EVENTS_KEY);
}

export function addSubmittedEvent(event: SubmittedEvent) {
  const events = getSubmittedEvents();
  writeArray(EVENTS_KEY, [event, ...events]);
}

/* ── User-created chapters (for directory) ── */
const CREATED_CHAPTERS_KEY = "clubconnect_created_chapters";

export function getCreatedChapters(): import("@/types").Chapter[] {
  return readArray<import("@/types").Chapter>(CREATED_CHAPTERS_KEY);
}

export function addCreatedChapter(chapter: import("@/types").Chapter) {
  const existing = getCreatedChapters();
  if (existing.some(c => c.id === chapter.id)) return;
  writeArray(CREATED_CHAPTERS_KEY, [chapter, ...existing]);
}

export function removeCreatedChapter(id: string) {
  writeArray(CREATED_CHAPTERS_KEY, getCreatedChapters().filter(c => c.id !== id));
}

export function updateCreatedChapter(id: string, updates: Partial<import("@/types").Chapter>) {
  const all = getCreatedChapters();
  writeArray(CREATED_CHAPTERS_KEY, all.map(c => c.id === id ? { ...c, ...updates } : c));
}
