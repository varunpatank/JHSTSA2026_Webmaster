"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

export interface DirectoryFilterState {
  search: string;
  meetingDay: string;
  meetingTime: string;
  category: string;
  scopeFilter: string;
  size: string;
  status: string;
}

const DAYS = ["Any", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = ["Any", "Before School", "Lunch", "After School", "Weekends"];
const CATEGORIES = [
  "Any",
  "Academic",
  "Arts",
  "Service",
  "Cultural",
  "STEM",
  "Sports",
  "Leadership",
  "Media",
  "Other",
];
const SIZES = ["Any", "Small", "Medium", "Large"];
const FREQUENCIES = [
  "Any",
  "Weekly",
  "Bi-weekly",
  "Daily",
  "Monthly",
];

interface Props {
  filters: DirectoryFilterState;
  onFilterChange: (
    next:
      | DirectoryFilterState
      | ((prev: DirectoryFilterState) => DirectoryFilterState),
  ) => void;
  resultCount: number;
  totalCount: number;
}

export default function DirectoryFilters({
  filters,
  onFilterChange,
  resultCount,
  totalCount,
}: Props) {
  const hasFilters =
    filters.search.trim() !== "" ||
    filters.meetingDay !== "Any" ||
    filters.meetingTime !== "Any" ||
    filters.category !== "Any" ||
    filters.size !== "Any" ||
    filters.status !== "Any";

  const clearAll = () =>
    onFilterChange({
      search: "",
      meetingDay: "Any",
      meetingTime: "Any",
      category: "Any",
      scopeFilter: filters.scopeFilter,
      size: "Any",
      status: "Any",
    });

  return (
    <div className="mt-3 space-y-3">
      {/* Search + quick categories */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600"
          />
          <input
            value={filters.search}
            onChange={(e) =>
              onFilterChange((f) => ({ ...f, search: e.target.value }))
            }
            placeholder="Search clubs…"
            className="w-full text-sm py-2 pl-9 pr-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400"
          />
        </div>
        <div className="hidden md:flex gap-1.5 flex-wrap">
          {["Any", "STEM", "Arts", "Service", "Academic", "Sports"].map(
            (c) => (
              <button
                key={c}
                onClick={() =>
                  onFilterChange((f) => ({ ...f, category: c }))
                }
                className={`px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors ${
                  filters.category === c
                    ? "bg-primary-700 text-white border-primary-700"
                    : "bg-white text-primary-800 border-primary-200 hover:border-primary-500"
                }`}
              >
                {c === "Any" ? "All" : c}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Expanded filter selects */}
      <details className="group">
        <summary className="flex items-center gap-1.5 text-xs font-semibold text-primary-800 cursor-pointer select-none">
          <SlidersHorizontal size={13} /> More Filters
        </summary>
        <div className="grid sm:grid-cols-5 gap-3 pt-3 mt-2 border-t border-neutral-100">
          {[
            { label: "Day", key: "meetingDay" as const, options: DAYS },
            { label: "Time", key: "meetingTime" as const, options: TIMES },
            {
              label: "Category",
              key: "category" as const,
              options: CATEGORIES,
            },
            { label: "Size", key: "size" as const, options: SIZES },
            { label: "Frequency", key: "status" as const, options: FREQUENCIES },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-[10px] font-semibold text-primary-700 mb-1 uppercase tracking-wider">
                {f.label}
              </label>
              <select
                value={filters[f.key]}
                onChange={(e) =>
                  onFilterChange((prev) => ({
                    ...prev,
                    [f.key]: e.target.value,
                  }))
                }
                className="w-full text-sm py-1.5 px-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400"
              >
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </details>

      {/* Active filter info */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-primary-700">
            Showing {resultCount} of {totalCount}
          </span>
          <button
            onClick={clearAll}
            className="text-primary-600 font-semibold hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        </div>
      )}
    </div>
  );
}
