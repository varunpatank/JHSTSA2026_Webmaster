"use client";

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
import {
  formatChapterLocation,
  getLocationScopeKey,
  getLocationScopeLabel,
} from "@/lib/location";

type DirectoryLeafletMapProps = {
  chapters: Chapter[];
  activeScope: string;
  onSelectScope: (scope: string) => void;
};

type ClubMarker = {
  chapter: Chapter;
  scopeKey: string;
  scopeLabel: string;
  coordinates: [number, number];
};

type BuildingGroup = {
  id: string;
  label: string;
  center: [number, number];
  clubs: ClubMarker[];
};

const campusCenter: [number, number] = [47.67695, -122.12078];

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
  activeScope,
  onSelectScope,
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
    zoom: 17.9,
    bearing: -18,
    pitch: 58,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const markers = useMemo<ClubMarker[]>(() => {
    return chapters.map((chapter) => {
      const scopeKey = getLocationScopeKey(chapter.meetingLocation);
      const scopeLabel = getLocationScopeLabel(chapter.meetingLocation);
      const coordinates: [number, number] = [
        chapter.meetingLocation.lat,
        chapter.meetingLocation.lng,
      ];
      return {
        chapter,
        scopeKey,
        scopeLabel,
        coordinates,
      };
    });
  }, [chapters]);

  const groupedBuildings = useMemo<BuildingGroup[]>(() => {
    const byBuilding = new globalThis.Map<string, BuildingGroup>();

    for (const marker of markers) {
      const existing = byBuilding.get(marker.scopeKey);
      if (!existing) {
        byBuilding.set(marker.scopeKey, {
          id: marker.scopeKey,
          label: marker.scopeLabel,
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

      byBuilding.set(marker.scopeKey, {
        id: marker.scopeKey,
        label: marker.scopeLabel,
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

  const allowExpandedDots = isThreeD && viewState.zoom >= 18.5;

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

  const containerRef = useRef<HTMLDivElement | null>(null);

  const flyTo = (lat: number, lng: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], duration: 600 });
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    if (!hasLoaded) return;
    applyViewMode(isThreeD);
  }, [isThreeD, hasLoaded]);

  return (
    <div
      ref={containerRef}
      className="border border-neutral-300 bg-white relative overflow-hidden"
    >
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
        cooperativeGestures
        minZoom={-1}
        maxZoom={20}
        style={{ height: 600, width: "100%" }}
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
              const isActive = clubMarker.scopeKey === activeScope;
              return (
                <Marker
                  key={`${clubMarker.chapter.id}-dot`}
                  latitude={explodedPosition[0]}
                  longitude={explodedPosition[1]}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectScope(isActive ? "Any" : clubMarker.scopeKey);
                      setPopupChapterId(clubMarker.chapter.id);
                      flyTo(explodedPosition[0], explodedPosition[1]);
                    }}
                    className={`h-4 w-4 border-2 border-white shadow-lg ${isActive ? "bg-secondary-500" : "bg-primary-500"}`}
                    aria-label={`${clubMarker.chapter.name} in ${buildingGroup.label}`}
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
                    flyTo(buildingGroup.center[0], buildingGroup.center[1]);
                    if (allowExpandedDots) {
                      setExpandedBuildingId((current) =>
                        current === buildingGroup.id ? null : buildingGroup.id,
                      );
                    }
                  }}
                  className="min-w-8 h-8 px-2 border-2 border-white shadow-lg text-[11px] font-bold text-white bg-primary-700"
                  aria-label={`${buildingGroup.clubs.length} clubs in ${buildingGroup.label}`}
                >
                  {buildingGroup.clubs.length}
                </button>
              </Marker>
            );
          }

          const [singleClub] = buildingGroup.clubs;
          const isActive = singleClub.scopeKey === activeScope;
          return (
            <Marker
              key={singleClub.chapter.id}
              latitude={singleClub.coordinates[0]}
              longitude={singleClub.coordinates[1]}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectScope(isActive ? "Any" : singleClub.scopeKey);
                  setPopupChapterId(singleClub.chapter.id);
                  flyTo(singleClub.coordinates[0], singleClub.coordinates[1]);
                }}
                className={`min-w-8 h-8 px-1 border-2 border-white shadow-lg text-[10px] font-bold text-white ${isActive ? "bg-secondary-500" : "bg-primary-500"}`}
                aria-label={`Filter by ${singleClub.scopeLabel}`}
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
                {activeBuilding.label}
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
                      onSelectScope(clubMarker.scopeKey);
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
      <div className="absolute top-3 right-14 z-10">
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
    </div>
  );
}
