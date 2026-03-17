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
