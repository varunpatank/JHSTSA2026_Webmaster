/** Infer meeting day from a schedule string like "Every Tuesday". */
export function inferDay(schedule: string): string {
  return (
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].find((d) =>
      schedule.includes(d),
    ) ?? "Varies"
  );
}

/** Check whether a member count matches a size bucket. */
export function matchesSize(memberCount: number, size: string): boolean {
  switch (size) {
    case "Small":
      return memberCount <= 15;
    case "Medium":
      return memberCount > 15 && memberCount <= 40;
    case "Large":
      return memberCount > 40;
    default:
      return true; // "Any"
  }
}

/** Tunable map behavior for the directory MapLibre view. */
export const DIRECTORY_MAP_CONFIG = {
  zoom: {
    districtDefault: 11.5,
    schoolMarkersMax: 14,
    clubSplit: 16.5,
    clubExplodedDots: 18.25,
    focusSchool: 16.8,
    focusCluster: 17.2,
    focusClub: 17.8,
  },
  spread: {
    compactRadius: 0.000085,
    expandedRadius: 0.00014,
  },
  animation: {
    focusDurationMs: 900,
    districtDurationMs: 850,
  },
} as const;
