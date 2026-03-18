"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
import { DIRECTORY_MAP_CONFIG } from "@/lib/directoryConstants";

type DirectoryLeafletMapProps = {
  chapters: Chapter[];
  activeRoom: string;
  onSelectRoom: (room: string) => void;
};

type LatLng = {
  lat: number;
  lng: number;
};

type ClubMarker = {
  chapter: Chapter;
  room: string;
  building: string;
  coordinates: LatLng;
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
  center: LatLng;
  clubs: ClubMarker[];
};

type SchoolGroup = {
  name: string;
  center: LatLng;
  clubs: Chapter[];
  categories: string[];
};

const districtCenter: LatLng = { lat: 47.705, lng: -122.14 };
const BUILDING_FOOTPRINT_LAYER_ID = "clubconnect-building-footprints";
const BUILDING_EXTRUSION_LAYER_ID = "clubconnect-3d-buildings";
const BUILDING_SOURCE_LAYER_CANDIDATES = ["building", "buildings", "building:part"];

function toLngLat(coordinates: LatLng): [number, number] {
  return [coordinates.lng, coordinates.lat];
}

function getClubMarkerLabel(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function spreadCoordinates(
  center: LatLng,
  index: number,
  total: number,
  radius: number,
): LatLng {
  const angle = (2 * Math.PI * index) / Math.max(total, 1);
  return {
    lat: center.lat + Math.cos(angle) * radius,
    lng: center.lng + Math.sin(angle) * radius,
  };
}

function getSchoolAbbrev(name: string) {
  return name
    .replace(/ High School| School/gi, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
}

function pointInRing(point: [number, number], ring: [number, number][]) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }

  return inside;
}

function pointInPolygon(
  point: [number, number],
  polygon: [number, number][][],
) {
  const [outer, ...holes] = polygon;
  if (!outer || !pointInRing(point, outer)) return false;
  return holes.every((hole) => !pointInRing(point, hole));
}

function areaCentroid(ring: [number, number][]) {
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  const signedArea = area / 2;
  if (Math.abs(signedArea) < Number.EPSILON) return null;
  return [cx / (6 * signedArea), cy / (6 * signedArea)] as [number, number];
}

function distanceSq(a: [number, number], b: [number, number]) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function getInteriorPointForPolygon(
  polygon: [number, number][][],
  target: [number, number],
) {
  const outer = polygon[0];
  if (!outer?.length) return null;

  let minX = outer[0][0];
  let minY = outer[0][1];
  let maxX = outer[0][0];
  let maxY = outer[0][1];
  let avgX = 0;
  let avgY = 0;

  for (const [x, y] of outer) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    avgX += x;
    avgY += y;
  }

  const n = outer.length;
  const candidates: [number, number][] = [
    [avgX / n, avgY / n],
    [(minX + maxX) / 2, (minY + maxY) / 2],
    target,
  ];

  const centroid = areaCentroid(outer);
  if (centroid) candidates.push(centroid);

  const insideCandidates = candidates.filter((candidate) =>
    pointInPolygon(candidate, polygon),
  );
  if (insideCandidates.length > 0) {
    return insideCandidates.sort(
      (a, b) => distanceSq(a, target) - distanceSq(b, target),
    )[0];
  }

  const steps = 6;
  const gridCandidates: [number, number][] = [];
  for (let ix = 1; ix < steps; ix += 1) {
    for (let iy = 1; iy < steps; iy += 1) {
      const x = minX + ((maxX - minX) * ix) / steps;
      const y = minY + ((maxY - minY) * iy) / steps;
      if (pointInPolygon([x, y], polygon)) {
        gridCandidates.push([x, y]);
      }
    }
  }

  if (gridCandidates.length > 0) {
    return gridCandidates.sort(
      (a, b) => distanceSq(a, target) - distanceSq(b, target),
    )[0];
  }

  return null;
}

function getAnchorFromRenderedFootprints(
  map: maplibregl.Map,
  center: LatLng,
) {
  if (!map.getLayer(BUILDING_FOOTPRINT_LAYER_ID)) return null;

  const target: [number, number] = [center.lng, center.lat];
  const point = map.project(target);
  const queryRadiusPx = map.getZoom() < 14 ? 140 : 80;
  const features = map.queryRenderedFeatures(
    [
      [point.x - queryRadiusPx, point.y - queryRadiusPx],
      [point.x + queryRadiusPx, point.y + queryRadiusPx],
    ],
    { layers: [BUILDING_FOOTPRINT_LAYER_ID] },
  );

  let bestPoint: [number, number] | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const feature of features) {
    if (!feature.geometry) continue;
    const geometry = feature.geometry as {
      type: string;
      coordinates: unknown;
    };

    const polygons =
      geometry.type === "Polygon"
        ? [geometry.coordinates as [number, number][][]]
        : geometry.type === "MultiPolygon"
          ? (geometry.coordinates as [number, number][][][])
          : [];

    for (const polygon of polygons) {
      const interior = getInteriorPointForPolygon(polygon, target);
      if (!interior) continue;
      const dist = distanceSq(interior, target);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestPoint = interior;
      }
    }
  }

  if (!bestPoint) return null;
  return { lat: bestPoint[1], lng: bestPoint[0] } as LatLng;
}

export default function DirectoryLeafletMap({
  chapters,
  activeRoom,
  onSelectRoom: _onSelectRoom,
}: DirectoryLeafletMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [popupChapterId, setPopupChapterId] = useState<string | null>(null);
  const [popupChapterPosition, setPopupChapterPosition] = useState<LatLng | null>(
    null,
  );
  const [popupBuildingId, setPopupBuildingId] = useState<string | null>(null);
  const [isThreeD, setIsThreeD] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeSchool, setActiveSchool] = useState<string | null>(null);
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);
  const [buildingAnchorMap, setBuildingAnchorMap] = useState<
    Record<string, LatLng>
  >({});

  const [viewState, setViewState] = useState<ViewState>({
    latitude: districtCenter.lat,
    longitude: districtCenter.lng,
    zoom: DIRECTORY_MAP_CONFIG.zoom.districtDefault,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  void _onSelectRoom;

  const schools = useMemo<SchoolGroup[]>(() => {
    const bySchool = new Map<string, SchoolGroup>();
    for (const chapter of chapters) {
      const schoolName = chapter.meetingLocation.parentOrg || "Other";
      const existing = bySchool.get(schoolName);
      if (!existing) {
        bySchool.set(schoolName, {
          name: schoolName,
          center: {
            lat: chapter.meetingLocation.lat,
            lng: chapter.meetingLocation.lng,
          },
          clubs: [chapter],
          categories: [chapter.category],
        });
        continue;
      }

      existing.clubs.push(chapter);
      if (!existing.categories.includes(chapter.category)) {
        existing.categories.push(chapter.category);
      }
      existing.center = {
        lat:
          existing.clubs.reduce((sum, c) => sum + c.meetingLocation.lat, 0) /
          existing.clubs.length,
        lng:
          existing.clubs.reduce((sum, c) => sum + c.meetingLocation.lng, 0) /
          existing.clubs.length,
      };
    }

    return Array.from(bySchool.values());
  }, [chapters]);

  const markers = useMemo<ClubMarker[]>(() => {
    return chapters.map((chapter) => {
      const room = getPrimaryLocation(chapter.meetingLocation);
      const building =
        chapter.meetingLocation.parentOrg ||
        chapter.meetingLocation.internalLocation ||
        "Campus";
      const coordinates: LatLng = {
        lat: chapter.meetingLocation.lat,
        lng: chapter.meetingLocation.lng,
      };
      return { chapter, room, building, coordinates };
    });
  }, [chapters]);

  const groupedBuildings = useMemo<BuildingGroup[]>(() => {
    const byBuilding = new Map<string, BuildingGroup>();

    for (const marker of markers) {
      const existing = byBuilding.get(marker.building);
      if (!existing) {
        byBuilding.set(marker.building, {
          id: marker.building,
          building: marker.building,
          center: marker.coordinates,
          clubs: [marker],
        });
        continue;
      }

      const clubs = [...existing.clubs, marker];
      const avgLat =
        clubs.reduce((sum, item) => sum + item.coordinates.lat, 0) / clubs.length;
      const avgLng =
        clubs.reduce((sum, item) => sum + item.coordinates.lng, 0) / clubs.length;

      byBuilding.set(marker.building, {
        id: marker.building,
        building: marker.building,
        center: { lat: avgLat, lng: avgLng },
        clubs,
      });
    }

    return Array.from(byBuilding.values());
  }, [markers]);

  const groupedBuildingsWithAnchors = useMemo<BuildingGroup[]>(() => {
    const map = mapRef.current?.getMap();
    return groupedBuildings.map((building) => ({
      ...building,
      center:
        buildingAnchorMap[building.id] ||
        (map && getAnchorFromRenderedFootprints(map, building.center)) ||
        building.center,
    }));
  }, [groupedBuildings, buildingAnchorMap, viewState.zoom, hasLoaded]);

  const activeMarker = markers.find((item) => item.chapter.id === popupChapterId);
  const activeBuilding = groupedBuildingsWithAnchors.find(
    (item) => item.id === popupBuildingId,
  );

  const showSchoolMarkers = viewState.zoom < DIRECTORY_MAP_CONFIG.zoom.schoolMarkersMax;
  const showClubMarkers = viewState.zoom >= DIRECTORY_MAP_CONFIG.zoom.schoolMarkersMax;
  const showSplitClubDots = viewState.zoom >= DIRECTORY_MAP_CONFIG.zoom.clubSplit;

  function flyToCoordinates(coordinates: LatLng, zoom: number, duration: number) {
    mapRef.current?.flyTo({
      center: toLngLat(coordinates),
      zoom,
      pitch: isThreeD ? 58 : 0,
      bearing: isThreeD ? -18 : 0,
      duration,
      essential: true,
    });
  }

  function focusSchool(school: SchoolGroup) {
    setActiveSchool(school.name);
    flyToCoordinates(
      school.center,
      DIRECTORY_MAP_CONFIG.zoom.focusSchool,
      DIRECTORY_MAP_CONFIG.animation.focusDurationMs,
    );
  }

  function focusDistrict() {
    setActiveSchool(null);
    setPopupBuildingId(null);
    mapRef.current?.flyTo({
      center: toLngLat(districtCenter),
      zoom: DIRECTORY_MAP_CONFIG.zoom.districtDefault,
      pitch: 0,
      bearing: 0,
      duration: DIRECTORY_MAP_CONFIG.animation.districtDurationMs,
      essential: true,
    });
  }

  function focusCluster(cluster: BuildingGroup) {
    setPopupBuildingId(cluster.id);
    setPopupChapterId(null);
    flyToCoordinates(
      cluster.center,
      Math.max(viewState.zoom, DIRECTORY_MAP_CONFIG.zoom.focusCluster),
      DIRECTORY_MAP_CONFIG.animation.focusDurationMs,
    );
  }

  function focusClub(
    clubMarker: ClubMarker,
    popupPosition: LatLng = clubMarker.coordinates,
  ) {
    setPopupChapterId(clubMarker.chapter.id);
    setPopupChapterPosition(popupPosition);
    setPopupBuildingId(null);
    flyToCoordinates(
      popupPosition,
      Math.max(viewState.zoom, DIRECTORY_MAP_CONFIG.zoom.focusClub),
      DIRECTORY_MAP_CONFIG.animation.focusDurationMs,
    );
  }

  const ensureThreeDimensionalLayer = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const style = map.getStyle();
    const labelLayerId = style.layers?.find(
      (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
    )?.id;
    const vectorSourceIds = Object.entries(style.sources || {})
      .filter(([, source]) => (source as { type?: string }).type === "vector")
      .map(([id]) => id);
    for (const sourceId of vectorSourceIds) {
      for (const sourceLayer of BUILDING_SOURCE_LAYER_CANDIDATES) {
        if (!map.getLayer(BUILDING_FOOTPRINT_LAYER_ID)) {
          try {
            map.addLayer(
              {
                id: BUILDING_FOOTPRINT_LAYER_ID,
                type: "fill",
                source: sourceId,
                "source-layer": sourceLayer,
                minzoom: 10,
                paint: {
                  "fill-color": "#000000",
                  "fill-opacity": 0,
                },
              },
              labelLayerId,
            );
          } catch {
            continue;
          }
        }

        if (map.getLayer(BUILDING_EXTRUSION_LAYER_ID)) return;

        try {
          map.addLayer(
            {
              id: BUILDING_EXTRUSION_LAYER_ID,
              type: "fill-extrusion",
              source: sourceId,
              "source-layer": sourceLayer,
              minzoom: 14,
              paint: {
                "fill-extrusion-color": "#58687d",
                "fill-extrusion-opacity": 0.8,
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  14,
                  0,
                  16,
                  ["coalesce", ["get", "height"], 16],
                ],
                "fill-extrusion-base": ["coalesce", ["get", "min_height"], 0],
              },
            },
            labelLayerId,
          );
          return;
        } catch {
          continue;
        }
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

    ensureThreeDimensionalLayer();
    if (map.getLayer(BUILDING_EXTRUSION_LAYER_ID)) {
      map.removeLayer(BUILDING_EXTRUSION_LAYER_ID);
    }
    map.easeTo({ pitch: 0, bearing: 0, duration: 450, essential: true });
  };

  useEffect(() => {
    if (hasLoaded) applyViewMode(isThreeD);
  }, [isThreeD, hasLoaded]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !hasLoaded) return;

    const updateAnchorsForMissing = () => {
      if (!map.getLayer(BUILDING_FOOTPRINT_LAYER_ID)) return;

      const nextAnchors: Record<string, LatLng> = {};
      let hasAnyUpdate = false;

      for (const group of groupedBuildings) {
        if (buildingAnchorMap[group.id]) continue;
        const resolved = getAnchorFromRenderedFootprints(map, group.center);
        if (resolved) {
          nextAnchors[group.id] = resolved;
          hasAnyUpdate = true;
        }
      }

      if (!hasAnyUpdate) return;
      setBuildingAnchorMap((current) => ({ ...current, ...nextAnchors }));
    };

    updateAnchorsForMissing();
    map.on("idle", updateAnchorsForMissing);
    return () => {
      map.off("idle", updateAnchorsForMissing);
    };
  }, [groupedBuildings, hasLoaded, buildingAnchorMap]);

  return (
    <div className="border border-neutral-300 bg-white relative overflow-hidden">
      <div className="absolute top-3 right-14 z-20 bg-neutral-900/90 border border-neutral-700/80 max-h-[480px] overflow-y-auto w-52">
        <div className="px-3 py-2 border-b border-neutral-700/60 flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-100 uppercase tracking-wider">
            Schools
          </span>
          {activeSchool && (
            <button
              type="button"
              onClick={focusDistrict}
              className="text-[10px] text-secondary-400 hover:text-secondary-300 font-semibold"
            >
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
              onClick={() => focusSchool(school)}
              onMouseEnter={() => setHoveredSchool(school.name)}
              onMouseLeave={() => setHoveredSchool(null)}
              className={`w-full text-left px-3 py-2 border-b border-neutral-800/50 transition-colors ${isActive ? "bg-primary-600/40" : "hover:bg-neutral-800/60"}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 flex items-center justify-center text-[9px] font-bold shrink-0 ${isActive ? "bg-secondary-500 text-white" : "bg-primary-600 text-white"}`}
                >
                  {getSchoolAbbrev(school.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[11px] font-semibold truncate ${isActive ? "text-secondary-300" : "text-neutral-200"}`}
                  >
                    {school.name}
                  </p>
                  <p className="text-[9px] text-neutral-500">
                    {school.clubs.length} club{school.clubs.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {hoveredSchool === school.name && (
                <div className="mt-1.5 pl-9 space-y-0.5">
                  {school.clubs.slice(0, 8).map((club) => (
                    <div key={club.id} className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 shrink-0"
                        style={{
                          backgroundColor: categoryDotColors[club.category] || "#6b7280",
                        }}
                      />
                      <span className="text-[10px] text-neutral-400 truncate">
                        {club.name}
                      </span>
                    </div>
                  ))}
                  {school.clubs.length > 8 && (
                    <p className="text-[9px] text-neutral-500">
                      +{school.clubs.length - 8} more
                    </p>
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
        onLoad={() => {
          setHasLoaded(true);
        }}
        minZoom={10}
        maxZoom={20}
        cooperativeGestures
        scrollZoom
        touchZoomRotate
        doubleClickZoom
        style={{ height: 520, width: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {showSchoolMarkers &&
          schools.map((school) => (
            <Marker
              key={`school-${school.name}`}
              latitude={school.center.lat}
              longitude={school.center.lng}
            >
              <button
                type="button"
                onClick={() => focusSchool(school)}
                onMouseEnter={() => setHoveredSchool(school.name)}
                onMouseLeave={() => setHoveredSchool(null)}
                className={`relative group flex flex-col items-center transition-transform hover:scale-110 ${activeSchool === school.name ? "scale-110" : ""}`}
                aria-label={`${school.name} ${school.clubs.length} clubs`}
              >
                <div
                  className={`min-w-10 h-10 px-2 border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${activeSchool === school.name ? "bg-secondary-500" : "bg-primary-600"}`}
                >
                  {school.clubs.length}
                </div>
                <div className="mt-0.5 px-1.5 py-0.5 bg-neutral-900/90 border border-neutral-700/60 max-w-[130px]">
                  <p className="text-[9px] font-semibold text-neutral-100 truncate text-center">
                    {school.name
                      .replace(" High School", " HS")
                      .replace(" School", "")}
                  </p>
                </div>
              </button>
            </Marker>
          ))}

        {showSchoolMarkers &&
          hoveredSchool &&
          (() => {
            const school = schools.find((item) => item.name === hoveredSchool);
            if (!school) return null;
            return (
              <Popup
                latitude={school.center.lat}
                longitude={school.center.lng}
                anchor="left"
                closeButton={false}
                closeOnClick={false}
                offset={24}
              >
                <div className="min-w-[180px] pr-1">
                  <p className="font-bold text-primary-700 text-sm">{school.name}</p>
                  <p className="text-xs text-neutral-500 mb-1.5">
                    {school.clubs.length} club{school.clubs.length !== 1 ? "s" : ""} &middot; Click to explore
                  </p>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {school.clubs.map((club) => (
                      <div key={club.id} className="flex items-center gap-2 py-0.5">
                        <span
                          className="w-2 h-2 shrink-0"
                          style={{
                            backgroundColor: categoryDotColors[club.category] || "#6b7280",
                          }}
                        />
                        <span className="text-xs text-neutral-700">{club.name}</span>
                        <span className="text-[9px] text-neutral-400 ml-auto">
                          {club.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            );
          })()}

        {showClubMarkers &&
          groupedBuildingsWithAnchors.map((buildingGroup) => {
            const isMultiClubBuilding = buildingGroup.clubs.length > 1;
            const spreadRadius = DIRECTORY_MAP_CONFIG.spread.compactRadius;

            if (isMultiClubBuilding && !showSplitClubDots) {
              return (
                <Marker
                  key={`${buildingGroup.id}-group`}
                  latitude={buildingGroup.center.lat}
                  longitude={buildingGroup.center.lng}
                >
                  <button
                    type="button"
                    onClick={() => focusCluster(buildingGroup)}
                    className="min-w-8 h-8 px-2 border-2 border-white shadow-lg text-[11px] font-bold text-white bg-primary-700"
                    aria-label={`${buildingGroup.clubs.length} clubs in ${buildingGroup.building}`}
                  >
                    {buildingGroup.clubs.length}
                  </button>
                </Marker>
              );
            }

            if (isMultiClubBuilding && showSplitClubDots) {
              return buildingGroup.clubs.map((clubMarker, index) => {
                const dotPosition = spreadCoordinates(
                  buildingGroup.center,
                  index,
                  buildingGroup.clubs.length,
                  spreadRadius,
                );
                const isActive = clubMarker.room === activeRoom;

                return (
                  <Marker
                    key={`${clubMarker.chapter.id}-dot`}
                    latitude={dotPosition.lat}
                    longitude={dotPosition.lng}
                  >
                    <button
                      type="button"
                      onClick={() => focusClub(clubMarker, dotPosition)}
                      className={`h-4 w-4 border-2 border-white shadow-lg ${isActive ? "bg-secondary-500" : "bg-primary-500"}`}
                      aria-label={`${clubMarker.chapter.name} in ${buildingGroup.building}`}
                    />
                  </Marker>
                );
              });
            }

            const [singleClub] = buildingGroup.clubs;
            const isActive = singleClub.room === activeRoom;
            const categoryColor =
              categoryColors[singleClub.chapter.category] || "bg-primary-500";

            return (
              <Marker
                key={singleClub.chapter.id}
                latitude={singleClub.coordinates.lat}
                longitude={singleClub.coordinates.lng}
              >
                <button
                  type="button"
                  onClick={() => focusClub(singleClub)}
                  className={`min-w-8 h-8 px-1 border-2 border-white shadow-lg text-[10px] font-bold text-white ${isActive ? "bg-secondary-500 ring-2 ring-secondary-300 ring-offset-1" : categoryColor} transition-all hover:scale-110`}
                  aria-label={`Center on ${singleClub.chapter.name}`}
                >
                  {getClubMarkerLabel(singleClub.chapter.name)}
                </button>
              </Marker>
            );
          })}

        {activeMarker && (
          <Popup
            latitude={(popupChapterPosition || activeMarker.coordinates).lat}
            longitude={(popupChapterPosition || activeMarker.coordinates).lng}
            anchor="top"
            closeButton
            closeOnClick={false}
            onClose={() => setPopupChapterId(null)}
            offset={12}
          >
            <div className="space-y-2 text-sm pr-2 min-w-[210px]">
              <div className="space-y-1">
                <p className="font-semibold text-primary-700">{activeMarker.chapter.name}</p>
                <p className="text-neutral-700">
                  {formatChapterLocation(activeMarker.chapter.meetingLocation)}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/directory/${activeMarker.chapter.id}`}
                  className="border border-primary-300 px-2 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-50"
                >
                  View Club Page
                </Link>
                <Link
                  href={`/directory/${activeMarker.chapter.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-neutral-300 px-2 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Open in New Tab
                </Link>
              </div>
            </div>
          </Popup>
        )}

        {activeBuilding && (
          <Popup
            latitude={activeBuilding.center.lat}
            longitude={activeBuilding.center.lng}
            anchor="top"
            closeButton
            closeOnClick={false}
            onClose={() => setPopupBuildingId(null)}
            offset={12}
          >
            <div className="space-y-2 text-sm pr-2 min-w-[210px]">
              <p className="font-semibold text-primary-700">{activeBuilding.building}</p>
              <p className="text-xs text-neutral-500">
                {activeBuilding.clubs.length} clubs in this building
              </p>
              {!showSplitClubDots && (
                <button
                  type="button"
                  onClick={() =>
                    flyToCoordinates(
                      activeBuilding.center,
                      DIRECTORY_MAP_CONFIG.zoom.clubSplit + 0.2,
                      DIRECTORY_MAP_CONFIG.animation.focusDurationMs,
                    )
                  }
                  className="border border-neutral-300 px-2 py-1 text-xs font-semibold text-neutral-700"
                >
                  Zoom to Individual Clubs
                </button>
              )}
              <div className="max-h-36 overflow-auto space-y-1">
                {activeBuilding.clubs.map((clubMarker) => (
                  <button
                    key={clubMarker.chapter.id}
                    type="button"
                    onClick={() => focusClub(clubMarker)}
                    className="w-full text-left border border-neutral-200 px-2 py-1 text-xs text-neutral-700 hover:border-primary-300 hover:bg-primary-50"
                  >
                    {clubMarker.chapter.name}
                  </button>
                ))}
              </div>
            </div>
          </Popup>
        )}
      </MapView>

      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        <button
          type="button"
          onClick={() => setIsThreeD((current) => !current)}
          className="border border-neutral-700/80 bg-neutral-900/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-neutral-100"
        >
          {isThreeD ? "Flat" : "3D"}
        </button>
        {activeSchool && (
          <button
            type="button"
            onClick={focusDistrict}
            className="border border-neutral-700/80 bg-neutral-900/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-secondary-300 hover:text-secondary-200"
          >
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
