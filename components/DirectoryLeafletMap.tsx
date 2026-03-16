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

type BuildingGroup = {
  id: string;
  building: string;
  center: [number, number];
  clubs: ClubMarker[];
};

const campusCenter: [number, number] = [47.67720, -122.12080];

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
  center: [number, number],
  index: number,
  total: number,
): [number, number] {
  const ringRadius = total > 5 ? 0.00014 : 0.00011;
  const angle = (2 * Math.PI * index) / Math.max(total, 1);
  const latitude = center[0] + Math.sin(angle) * ringRadius;
  const longitude = center[1] + Math.cos(angle) * ringRadius;
  return [latitude, longitude];
}

export default function DirectoryLeafletMap({
  chapters,
  activeRoom,
  onSelectRoom,
}: DirectoryLeafletMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [popupChapterId, setPopupChapterId] = useState<string | null>(null);
  const [popupBuildingId, setPopupBuildingId] = useState<string | null>(null);
  const [expandedBuildingId, setExpandedBuildingId] = useState<string | null>(
    null,
  );
  const [isThreeD, setIsThreeD] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [viewState, setViewState] = useState<ViewState>({
    latitude: campusCenter[0],
    longitude: campusCenter[1],
    zoom: 16.8,
    bearing: -18,
    pitch: 58,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const markers = useMemo<ClubMarker[]>(() => {
    return chapters.map((chapter) => {
      const room = getPrimaryLocation(chapter.meetingLocation);
      const building =
        chapter.meetingLocation.parentOrg ||
        chapter.meetingLocation.internalLocation ||
        "Campus";
      const coordinates: [number, number] = [
        chapter.meetingLocation.lat,
        chapter.meetingLocation.lng,
      ];
      return {
        chapter,
        room,
        building,
        coordinates,
      };
    });
  }, [chapters]);

  const groupedBuildings = useMemo<BuildingGroup[]>(() => {
    const byBuilding = new globalThis.Map<string, BuildingGroup>();

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
      const avgLatitude =
        clubs.reduce((sum, item) => sum + item.coordinates[0], 0) /
        clubs.length;
      const avgLongitude =
        clubs.reduce((sum, item) => sum + item.coordinates[1], 0) /
        clubs.length;

      byBuilding.set(marker.building, {
        id: marker.building,
        building: marker.building,
        center: [avgLatitude, avgLongitude],
        clubs,
      });
    }

    return Array.from(byBuilding.values());
  }, [markers]);

  const activeMarker = markers.find(
    (item) => item.chapter.id === popupChapterId,
  );

  const activeBuilding = groupedBuildings.find(
    (item) => item.id === popupBuildingId,
  );

  const allowExpandedDots = viewState.zoom >= 18.5;

  const ensureThreeDimensionalLayer = () => {
    const map = mapRef.current?.getMap();
    if (!map || map.getLayer("clubconnect-3d-buildings")) return;

    const style = map.getStyle();
    const labelLayerId = style.layers?.find(
      (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
    )?.id;

    const vectorSourceIds = Object.entries(style.sources || {})
      .filter(([, source]) => (source as { type?: string }).type === "vector")
      .map(([sourceId]) => sourceId);

    const sourceLayerCandidates = ["building", "buildings", "building:part"];

    for (const sourceId of vectorSourceIds) {
      for (const sourceLayer of sourceLayerCandidates) {
        try {
          map.addLayer(
            {
              id: "clubconnect-3d-buildings",
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

    if (map.getLayer("clubconnect-3d-buildings")) {
      map.removeLayer("clubconnect-3d-buildings");
    }
    map.easeTo({ pitch: 0, bearing: 0, duration: 450, essential: true });
  };

  useEffect(() => {
    if (!hasLoaded) return;
    applyViewMode(isThreeD);
  }, [isThreeD, hasLoaded]);

  return (
    <div className="border border-neutral-300 bg-white relative overflow-hidden">
      <MapView
        ref={mapRef}
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        mapLib={maplibregl}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        onLoad={() => {
          setHasLoaded(true);
          applyViewMode(isThreeD);
        }}
        minZoom={15}
        maxZoom={20}
        style={{ height: 520, width: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {groupedBuildings.map((buildingGroup) => {
          const isMultiClubBuilding = buildingGroup.clubs.length > 1;
          const isExpanded =
            allowExpandedDots && expandedBuildingId === buildingGroup.id;

          if (isMultiClubBuilding && isExpanded) {
            return buildingGroup.clubs.map((clubMarker, index) => {
              const explodedPosition = spreadCoordinates(
                buildingGroup.center,
                index,
                buildingGroup.clubs.length,
              );
              const isActive = clubMarker.room === activeRoom;
              return (
                <Marker
                  key={`${clubMarker.chapter.id}-dot`}
                  latitude={explodedPosition[0]}
                  longitude={explodedPosition[1]}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRoom(isActive ? "Any" : clubMarker.room);
                      setPopupChapterId(clubMarker.chapter.id);
                    }}
                    className={`h-4 w-4 border-2 border-white shadow-lg ${isActive ? "bg-secondary-500" : "bg-primary-500"}`}
                    aria-label={`${clubMarker.chapter.name} in ${buildingGroup.building}`}
                  />
                </Marker>
              );
            });
          }

          if (isMultiClubBuilding) {
            return (
              <Marker
                key={`${buildingGroup.id}-group`}
                latitude={buildingGroup.center[0]}
                longitude={buildingGroup.center[1]}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPopupBuildingId(buildingGroup.id);
                    if (allowExpandedDots) {
                      setExpandedBuildingId((current) =>
                        current === buildingGroup.id ? null : buildingGroup.id,
                      );
                    }
                  }}
                  className="min-w-8 h-8 px-2 border-2 border-white shadow-lg text-[11px] font-bold text-white bg-primary-700"
                  aria-label={`${buildingGroup.clubs.length} clubs in ${buildingGroup.building}`}
                >
                  {buildingGroup.clubs.length}
                </button>
              </Marker>
            );
          }

          const [singleClub] = buildingGroup.clubs;
          const isActive = singleClub.room === activeRoom;
          const catColor = categoryColors[singleClub.chapter.category] || "bg-primary-500";
          return (
            <Marker
              key={singleClub.chapter.id}
              latitude={singleClub.coordinates[0]}
              longitude={singleClub.coordinates[1]}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectRoom(isActive ? "Any" : singleClub.room);
                  setPopupChapterId(singleClub.chapter.id);
                }}
                className={`min-w-8 h-8 px-1 border-2 border-white shadow-lg text-[10px] font-bold text-white ${isActive ? "bg-secondary-500 ring-2 ring-secondary-300 ring-offset-1" : catColor} transition-all hover:scale-110`}
                aria-label={`Filter by ${singleClub.room}`}
              >
                {getClubMarkerLabel(singleClub.chapter.name)}
              </button>
            </Marker>
          );
        })}

        {activeMarker && (
          <Popup
            latitude={activeMarker.coordinates[0]}
            longitude={activeMarker.coordinates[1]}
            anchor="top"
            closeButton
            closeOnClick={false}
            onClose={() => setPopupChapterId(null)}
            offset={12}
          >
            <div className="space-y-1 text-sm pr-2">
              <p className="font-semibold text-primary-700">
                {activeMarker.chapter.name}
              </p>
              <p className="text-neutral-700">
                {formatChapterLocation(activeMarker.chapter.meetingLocation)}
              </p>
              <p className="text-xs text-neutral-500">
                Marker click toggles room filter
              </p>
            </div>
          </Popup>
        )}

        {activeBuilding && (
          <Popup
            latitude={activeBuilding.center[0]}
            longitude={activeBuilding.center[1]}
            anchor="top"
            closeButton
            closeOnClick={false}
            onClose={() => setPopupBuildingId(null)}
            offset={12}
          >
            <div className="space-y-2 text-sm pr-2 min-w-[210px]">
              <p className="font-semibold text-primary-700">
                {activeBuilding.building}
              </p>
              <p className="text-xs text-neutral-500">
                {activeBuilding.clubs.length} clubs in this building
              </p>
              {allowExpandedDots && (
                <button
                  type="button"
                  onClick={() =>
                    setExpandedBuildingId((current) =>
                      current === activeBuilding.id ? null : activeBuilding.id,
                    )
                  }
                  className="border border-neutral-300 px-2 py-1 text-xs font-semibold text-neutral-700"
                >
                  {expandedBuildingId === activeBuilding.id
                    ? "Collapse Dots"
                    : "Expand Dots"}
                </button>
              )}
              <div className="max-h-36 overflow-auto space-y-1">
                {activeBuilding.clubs.map((clubMarker) => (
                  <button
                    key={clubMarker.chapter.id}
                    type="button"
                    onClick={() => {
                      onSelectRoom(clubMarker.room);
                      setPopupChapterId(clubMarker.chapter.id);
                      setPopupBuildingId(null);
                    }}
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
      <div className="absolute top-3 left-3 z-10">
        <button
          type="button"
          onClick={() => setIsThreeD((current) => !current)}
          className="border border-neutral-700/80 bg-neutral-900/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-neutral-100"
        >
          {isThreeD ? "Switch to Flat" : "Switch to 3D"}
        </button>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 border border-neutral-700/80 bg-neutral-900/85 px-2 py-1 text-[11px] font-semibold tracking-wide text-neutral-100">
        {isThreeD ? "3D CAMPUS VIEW" : "FLAT CAMPUS VIEW"}
      </div>
      <div className="absolute bottom-3 right-3 z-10 bg-neutral-900/85 border border-neutral-700/80 px-3 py-2 text-[10px]">
        <p className="font-bold text-neutral-200 mb-1">LEGEND</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 ${color} inline-block`} />
              <span className="text-neutral-300">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
