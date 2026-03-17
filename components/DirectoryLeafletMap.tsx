"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import MapView, {
  Marker,
  type MapRef,
  NavigationControl,
  Popup,
  type ViewState,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type { Chapter } from "@/types";
import { formatChapterLocation, getPrimaryLocation } from "@/lib/location";

type DirectoryLeafletMapProps = {
  chapters: Chapter[];
  activeRoom: string;
  onSelectRoom: (room: string) => void;
};

type ClubMarker = {
  chapter: Chapter;
  room: string;
  building: string;
  coordinates: [number, number];
};

const categoryColors: Record<string, string> = {
  Academic: "bg-blue-500",
  STEM: "bg-emerald-500",
  Service: "bg-orange-500",
  Arts: "bg-pink-500",
  Cultural: "bg-purple-500",
  Media: "bg-cyan-500",
  Sports: "bg-red-500",
  Leadership: "bg-amber-500",
};

const categoryDotColors: Record<string, string> = {
  Academic: "#3b82f6",
  STEM: "#10b981",
  Service: "#f97316",
  Arts: "#ec4899",
  Cultural: "#a855f7",
  Media: "#06b6d4",
  Sports: "#ef4444",
  Leadership: "#f59e0b",
};

type BuildingGroup = {
  id: string;
  building: string;
  center: [number, number];
  clubs: ClubMarker[];
};

type SchoolGroup = {
  name: string;
  center: [number, number];
  clubs: Chapter[];
  categories: string[];
};

/* District-level center (shows all schools) */
const districtCenter: [number, number] = [47.7050, -122.1400];

function getClubMarkerLabel(name: string) {
  const parts = name.split(" ").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function spreadCoordinates(center: [number, number], index: number, total: number): [number, number] {
  const ringRadius = total > 5 ? 0.00014 : 0.00011;
  const angle = (2 * Math.PI * index) / Math.max(total, 1);
  return [center[0] + Math.sin(angle) * ringRadius, center[1] + Math.cos(angle) * ringRadius];
}

function getSchoolAbbrev(name: string) {
  return name.replace(/ High School| School/gi, "").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4);
}

export default function DirectoryLeafletMap({ chapters, activeRoom, onSelectRoom }: DirectoryLeafletMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [popupChapterId, setPopupChapterId] = useState<string | null>(null);
  const [popupBuildingId, setPopupBuildingId] = useState<string | null>(null);
  const [expandedBuildingId, setExpandedBuildingId] = useState<string | null>(null);
  const [isThreeD, setIsThreeD] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeSchool, setActiveSchool] = useState<string | null>(null);
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);

  const [viewState, setViewState] = useState<ViewState>({
    latitude: districtCenter[0],
    longitude: districtCenter[1],
    zoom: 11.5,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  /*  Group chapters by school  */
  const schools = useMemo<SchoolGroup[]>(() => {
    const bySchool = new Map<string, SchoolGroup>();
    for (const ch of chapters) {
      const schoolName = ch.meetingLocation.parentOrg || "Other";
      const existing = bySchool.get(schoolName);
      if (!existing) {
        bySchool.set(schoolName, {
          name: schoolName,
          center: [ch.meetingLocation.lat, ch.meetingLocation.lng],
          clubs: [ch],
          categories: [ch.category],
        });
      } else {
        existing.clubs.push(ch);
        if (!existing.categories.includes(ch.category)) existing.categories.push(ch.category);
        existing.center = [
          existing.clubs.reduce((s, c) => s + c.meetingLocation.lat, 0) / existing.clubs.length,
          existing.clubs.reduce((s, c) => s + c.meetingLocation.lng, 0) / existing.clubs.length,
        ];
      }
    }
    return Array.from(bySchool.values());
  }, [chapters]);

  /*  Individual club markers (used when zoomed into a school)  */
  const markers = useMemo<ClubMarker[]>(() => {
    return chapters.map((chapter) => {
      const room = getPrimaryLocation(chapter.meetingLocation);
      const building = chapter.meetingLocation.parentOrg || chapter.meetingLocation.internalLocation || "Campus";
      const coordinates: [number, number] = [chapter.meetingLocation.lat, chapter.meetingLocation.lng];
      return { chapter, room, building, coordinates };
    });
  }, [chapters]);

  const groupedBuildings = useMemo<BuildingGroup[]>(() => {
    const byBuilding = new Map<string, BuildingGroup>();
    for (const marker of markers) {
      const existing = byBuilding.get(marker.building);
      if (!existing) {
        byBuilding.set(marker.building, { id: marker.building, building: marker.building, center: marker.coordinates, clubs: [marker] });
        continue;
      }
      const clubs = [...existing.clubs, marker];
      const avgLat = clubs.reduce((s, i) => s + i.coordinates[0], 0) / clubs.length;
      const avgLng = clubs.reduce((s, i) => s + i.coordinates[1], 0) / clubs.length;
      byBuilding.set(marker.building, { id: marker.building, building: marker.building, center: [avgLat, avgLng], clubs });
    }
    return Array.from(byBuilding.values());
  }, [markers]);

  const activeMarker = markers.find((i) => i.chapter.id === popupChapterId);
  const activeBuilding = groupedBuildings.find((i) => i.id === popupBuildingId);
  const allowExpandedDots = viewState.zoom >= 18.5;
  const showSchoolMarkers = viewState.zoom < 14;
  const showClubMarkers = viewState.zoom >= 14;

  function flyToSchool(school: SchoolGroup) {
    setActiveSchool(school.name);
    mapRef.current?.flyTo({
      center: [school.center[1], school.center[0]],
      zoom: 16.8,
      pitch: isThreeD ? 58 : 0,
      bearing: isThreeD ? -18 : 0,
      duration: 1200,
      essential: true,
    });
  }

  function flyToDistrict() {
    setActiveSchool(null);
    mapRef.current?.flyTo({
      center: [districtCenter[1], districtCenter[0]],
      zoom: 11.5,
      pitch: 0,
      bearing: 0,
      duration: 1000,
      essential: true,
    });
  }

  const ensureThreeDimensionalLayer = () => {
    const map = mapRef.current?.getMap();
    if (!map || map.getLayer("clubconnect-3d-buildings")) return;
    const style = map.getStyle();
    const labelLayerId = style.layers?.find((l) => l.type === "symbol" && l.layout?.["text-field"])?.id;
    const vectorSourceIds = Object.entries(style.sources || {}).filter(([, s]) => (s as { type?: string }).type === "vector").map(([id]) => id);
    const sourceLayerCandidates = ["building", "buildings", "building:part"];
    for (const sourceId of vectorSourceIds) {
      for (const sourceLayer of sourceLayerCandidates) {
        try {
          map.addLayer({
            id: "clubconnect-3d-buildings", type: "fill-extrusion", source: sourceId, "source-layer": sourceLayer, minzoom: 14,
            paint: {
              "fill-extrusion-color": "#58687d", "fill-extrusion-opacity": 0.8,
              "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 14, 0, 16, ["coalesce", ["get", "height"], 16]],
              "fill-extrusion-base": ["coalesce", ["get", "min_height"], 0],
            },
          }, labelLayerId);
          return;
        } catch { continue; }
      }
    }
  };

  const applyViewMode = (enable3D: boolean) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (enable3D) {
      ensureThreeDimensionalLayer();
      map.easeTo({ pitch: 58, bearing: -18, duration: 450, essential: true });
      return;
    }
    if (map.getLayer("clubconnect-3d-buildings")) map.removeLayer("clubconnect-3d-buildings");
    map.easeTo({ pitch: 0, bearing: 0, duration: 450, essential: true });
  };

  useEffect(() => { if (hasLoaded) applyViewMode(isThreeD); }, [isThreeD, hasLoaded]);

  return (
    <div className="border border-neutral-300 bg-white relative overflow-hidden">

      {/*  School Selector Panel  */}
      <div className="absolute top-3 right-14 z-20 bg-neutral-900/90 border border-neutral-700/80 max-h-[480px] overflow-y-auto w-52">
        <div className="px-3 py-2 border-b border-neutral-700/60 flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-100 uppercase tracking-wider">Schools</span>
          {activeSchool && (
            <button type="button" onClick={flyToDistrict} className="text-[10px] text-secondary-400 hover:text-secondary-300 font-semibold">
              Show All
            </button>
          )}
        </div>
        {schools.map((school) => {
          const isActive = activeSchool === school.name;
          return (
            <button
              key={school.name}
              type="button"
              onClick={() => flyToSchool(school)}
              onMouseEnter={() => setHoveredSchool(school.name)}
              onMouseLeave={() => setHoveredSchool(null)}
              className={`w-full text-left px-3 py-2 border-b border-neutral-800/50 transition-colors ${isActive ? "bg-primary-600/40" : "hover:bg-neutral-800/60"}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 flex items-center justify-center text-[9px] font-bold shrink-0 ${isActive ? "bg-secondary-500 text-white" : "bg-primary-600 text-white"}`}>
                  {getSchoolAbbrev(school.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-semibold truncate ${isActive ? "text-secondary-300" : "text-neutral-200"}`}>{school.name}</p>
                  <p className="text-[9px] text-neutral-500">{school.clubs.length} club{school.clubs.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              {/* Club list on hover */}
              {hoveredSchool === school.name && (
                <div className="mt-1.5 pl-9 space-y-0.5">
                  {school.clubs.slice(0, 8).map((c) => (
                    <div key={c.id} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: categoryDotColors[c.category] || "#6b7280" }} />
                      <span className="text-[10px] text-neutral-400 truncate">{c.name}</span>
                    </div>
                  ))}
                  {school.clubs.length > 8 && (
                    <p className="text-[9px] text-neutral-500">+{school.clubs.length - 8} more</p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <MapView
        ref={mapRef}
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        mapLib={maplibregl}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        onLoad={() => { setHasLoaded(true); }}
        minZoom={10}
        maxZoom={20}
        style={{ height: 520, width: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/*  School Markers (zoomed out)  */}
        {showSchoolMarkers && schools.map((school) => (
          <Marker key={`school-${school.name}`} latitude={school.center[0]} longitude={school.center[1]}>
            <button
              type="button"
              onClick={() => flyToSchool(school)}
              onMouseEnter={() => setHoveredSchool(school.name)}
              onMouseLeave={() => setHoveredSchool(null)}
              className={`relative group flex flex-col items-center transition-transform hover:scale-110 ${activeSchool === school.name ? "scale-110" : ""}`}
              aria-label={`${school.name}  ${school.clubs.length} clubs`}
            >
              <div className={`min-w-10 h-10 px-2 border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${activeSchool === school.name ? "bg-secondary-500" : "bg-primary-600"}`}>
                {school.clubs.length}
              </div>
              <div className="mt-0.5 px-1.5 py-0.5 bg-neutral-900/90 border border-neutral-700/60 max-w-[130px]">
                <p className="text-[9px] font-semibold text-neutral-100 truncate text-center">{school.name.replace(" High School", " HS").replace(" School", "")}</p>
              </div>
            </button>
          </Marker>
        ))}

        {/* School hover popup (zoomed out) */}
        {showSchoolMarkers && hoveredSchool && (() => {
          const s = schools.find(sc => sc.name === hoveredSchool);
          if (!s) return null;
          return (
            <Popup latitude={s.center[0]} longitude={s.center[1]} anchor="left" closeButton={false} closeOnClick={false} offset={24}>
              <div className="min-w-[180px] pr-1">
                <p className="font-bold text-primary-700 text-sm">{s.name}</p>
                <p className="text-xs text-neutral-500 mb-1.5">{s.clubs.length} club{s.clubs.length !== 1 ? "s" : ""} &middot; Click to explore</p>
                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {s.clubs.map(c => (
                    <div key={c.id} className="flex items-center gap-2 py-0.5">
                      <span className="w-2 h-2 shrink-0" style={{ backgroundColor: categoryDotColors[c.category] || "#6b7280" }} />
                      <span className="text-xs text-neutral-700">{c.name}</span>
                      <span className="text-[9px] text-neutral-400 ml-auto">{c.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          );
        })()}

        {/*  Club Markers (zoomed in)  */}
        {showClubMarkers && groupedBuildings.map((buildingGroup) => {
          const isMultiClubBuilding = buildingGroup.clubs.length > 1;
          const isExpanded = allowExpandedDots && expandedBuildingId === buildingGroup.id;

          if (isMultiClubBuilding && isExpanded) {
            return buildingGroup.clubs.map((clubMarker, index) => {
              const explodedPosition = spreadCoordinates(buildingGroup.center, index, buildingGroup.clubs.length);
              const isActive = clubMarker.room === activeRoom;
              return (
                <Marker key={`${clubMarker.chapter.id}-dot`} latitude={explodedPosition[0]} longitude={explodedPosition[1]}>
                  <button type="button"
                    onClick={() => { onSelectRoom(isActive ? "Any" : clubMarker.room); setPopupChapterId(clubMarker.chapter.id); }}
                    className={`h-4 w-4 border-2 border-white shadow-lg ${isActive ? "bg-secondary-500" : "bg-primary-500"}`}
                    aria-label={`${clubMarker.chapter.name} in ${buildingGroup.building}`} />
                </Marker>
              );
            });
          }

          if (isMultiClubBuilding) {
            return (
              <Marker key={`${buildingGroup.id}-group`} latitude={buildingGroup.center[0]} longitude={buildingGroup.center[1]}>
                <button type="button"
                  onClick={() => { setPopupBuildingId(buildingGroup.id); if (allowExpandedDots) setExpandedBuildingId((c) => c === buildingGroup.id ? null : buildingGroup.id); }}
                  className="min-w-8 h-8 px-2 border-2 border-white shadow-lg text-[11px] font-bold text-white bg-primary-700"
                  aria-label={`${buildingGroup.clubs.length} clubs in ${buildingGroup.building}`}>
                  {buildingGroup.clubs.length}
                </button>
              </Marker>
            );
          }

          const [singleClub] = buildingGroup.clubs;
          const isActive = singleClub.room === activeRoom;
          const catColor = categoryColors[singleClub.chapter.category] || "bg-primary-500";
          return (
            <Marker key={singleClub.chapter.id} latitude={singleClub.coordinates[0]} longitude={singleClub.coordinates[1]}>
              <button type="button"
                onClick={() => { onSelectRoom(isActive ? "Any" : singleClub.room); setPopupChapterId(singleClub.chapter.id); }}
                className={`min-w-8 h-8 px-1 border-2 border-white shadow-lg text-[10px] font-bold text-white ${isActive ? "bg-secondary-500 ring-2 ring-secondary-300 ring-offset-1" : catColor} transition-all hover:scale-110`}
                aria-label={`Filter by ${singleClub.room}`}>
                {getClubMarkerLabel(singleClub.chapter.name)}
              </button>
            </Marker>
          );
        })}

        {/* Club popup */}
        {activeMarker && (
          <Popup latitude={activeMarker.coordinates[0]} longitude={activeMarker.coordinates[1]} anchor="top" closeButton closeOnClick={false} onClose={() => setPopupChapterId(null)} offset={12}>
            <div className="space-y-1 text-sm pr-2">
              <p className="font-semibold text-primary-700">{activeMarker.chapter.name}</p>
              <p className="text-neutral-700">{formatChapterLocation(activeMarker.chapter.meetingLocation)}</p>
              <p className="text-xs text-neutral-500">Marker click toggles room filter</p>
            </div>
          </Popup>
        )}

        {/* Building popup */}
        {activeBuilding && (
          <Popup latitude={activeBuilding.center[0]} longitude={activeBuilding.center[1]} anchor="top" closeButton closeOnClick={false} onClose={() => setPopupBuildingId(null)} offset={12}>
            <div className="space-y-2 text-sm pr-2 min-w-[210px]">
              <p className="font-semibold text-primary-700">{activeBuilding.building}</p>
              <p className="text-xs text-neutral-500">{activeBuilding.clubs.length} clubs in this building</p>
              {allowExpandedDots && (
                <button type="button"
                  onClick={() => setExpandedBuildingId((c) => c === activeBuilding.id ? null : activeBuilding.id)}
                  className="border border-neutral-300 px-2 py-1 text-xs font-semibold text-neutral-700">
                  {expandedBuildingId === activeBuilding.id ? "Collapse Dots" : "Expand Dots"}
                </button>
              )}
              <div className="max-h-36 overflow-auto space-y-1">
                {activeBuilding.clubs.map((clubMarker) => (
                  <button key={clubMarker.chapter.id} type="button"
                    onClick={() => { onSelectRoom(clubMarker.room); setPopupChapterId(clubMarker.chapter.id); setPopupBuildingId(null); }}
                    className="w-full text-left border border-neutral-200 px-2 py-1 text-xs text-neutral-700 hover:border-primary-300 hover:bg-primary-50">
                    {clubMarker.chapter.name}
                  </button>
                ))}
              </div>
            </div>
          </Popup>
        )}
      </MapView>

      {/*  Map Controls  */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        <button type="button" onClick={() => setIsThreeD((c) => !c)}
          className="border border-neutral-700/80 bg-neutral-900/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-neutral-100">
          {isThreeD ? "Flat" : "3D"}
        </button>
        {activeSchool && (
          <button type="button" onClick={flyToDistrict}
            className="border border-neutral-700/80 bg-neutral-900/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-secondary-300 hover:text-secondary-200">
            &larr; All Schools
          </button>
        )}
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 border border-neutral-700/80 bg-neutral-900/85 px-2 py-1 text-[11px] font-semibold tracking-wide text-neutral-100">
        {activeSchool ? activeSchool : "DISTRICT VIEW"} &middot; {isThreeD ? "3D" : "FLAT"}
      </div>

    </div>
  );
}