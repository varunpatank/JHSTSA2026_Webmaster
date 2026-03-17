import type { ChapterMeetingLocation } from "@/types";

export function getPrimaryLocation(location: ChapterMeetingLocation) {
  return location.room || location.internalLocation || "Campus";
}

/** Return a short scope key for filtering (room or parent org). */
export function getLocationScopeKey(location: ChapterMeetingLocation): string {
  return getPrimaryLocation(location);
}

export function formatChapterLocation(location: ChapterMeetingLocation) {
  const primary = getPrimaryLocation(location);
  const extras = [
    location.internalLocation && location.internalLocation !== primary
      ? location.internalLocation
      : undefined,
    location.parentOrg,
  ].filter(Boolean);

  return extras.length > 0 ? `${primary}, ${extras.join(", ")}` : primary;
}
