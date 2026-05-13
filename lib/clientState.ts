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
// Per-user keys (keyed by email to isolate data between accounts)
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

function getCurrentEmail(): string {
  if (!canUseStorage()) return "anon";
  return window.localStorage.getItem(USER_EMAIL_KEY) || "anon";
}

function joinedKey(email: string) { return `clubconnect_joined_clubs_${email}`; }
function createdKey(email: string) { return `clubconnect_created_chapters_${email}`; }
function eventsKey(email: string) { return `clubconnect_created_events_${email}`; }
function resourcesKey(email: string) { return `clubconnect_created_resources_${email}`; }

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
  return readArray<UserClubRecord>(joinedKey(getCurrentEmail()));
}

export function addJoinedClub(record: UserClubRecord) {
  const key = joinedKey(getCurrentEmail());
  const clubs = readArray<UserClubRecord>(key);
  if (clubs.some((club) => club.id === record.id)) return;
  writeArray(key, [record, ...clubs]);
}

export function removeJoinedClub(id: string) {
  const key = joinedKey(getCurrentEmail());
  writeArray(key, readArray<UserClubRecord>(key).filter(c => c.id !== id));
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

/* ── User-created chapters (per-user) ── */

export function getCreatedChapters(): import("@/types").Chapter[] {
  return readArray<import("@/types").Chapter>(createdKey(getCurrentEmail()));
}

export function addCreatedChapter(chapter: import("@/types").Chapter) {
  const key = createdKey(getCurrentEmail());
  const existing = readArray<import("@/types").Chapter>(key);
  if (existing.some(c => c.id === chapter.id)) return;
  writeArray(key, [chapter, ...existing]);
}

export function removeCreatedChapter(id: string) {
  const key = createdKey(getCurrentEmail());
  writeArray(key, readArray<import("@/types").Chapter>(key).filter(c => c.id !== id));
}

export function updateCreatedChapter(id: string, updates: Partial<import("@/types").Chapter>) {
  const key = createdKey(getCurrentEmail());
  const all = readArray<import("@/types").Chapter>(key);
  writeArray(key, all.map(c => c.id === id ? { ...c, ...updates } : c));
}

/* ── User-created events (per-user) ── */

export interface CreatedEvent {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl?: string;
  category: string;
  createdBy: string;
  createdAt: string;
}

export function getCreatedEvents(): CreatedEvent[] {
  return readArray<CreatedEvent>(eventsKey(getCurrentEmail()));
}

export function addCreatedEvent(event: CreatedEvent) {
  const key = eventsKey(getCurrentEmail());
  const existing = readArray<CreatedEvent>(key);
  writeArray(key, [event, ...existing]);
}

export function removeCreatedEvent(id: string) {
  const key = eventsKey(getCurrentEmail());
  writeArray(key, readArray<CreatedEvent>(key).filter(e => e.id !== id));
}

/* ── User-created resources (per-user) ── */

export interface CreatedResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  resourceUrl: string;
  imageUrl?: string;
  subject: string;
  createdBy: string;
  createdAt: string;
}

export function getCreatedResources(): CreatedResource[] {
  return readArray<CreatedResource>(resourcesKey(getCurrentEmail()));
}

export function addCreatedResource(resource: CreatedResource) {
  const key = resourcesKey(getCurrentEmail());
  const existing = readArray<CreatedResource>(key);
  writeArray(key, [resource, ...existing]);
}
