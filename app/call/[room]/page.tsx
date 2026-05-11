"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import FullScreenCall from "@/components/FullScreenCall";

export default function CallRoomPage({ params }: { params: Promise<{ room: string }> }) {
  const { room } = use(params);
  const decodedRoom = decodeURIComponent(room);
  const searchParams = useSearchParams();
  const displayName = searchParams.get("name")?.trim() || undefined;
  const startMuted = searchParams.get("mic") === "false";
  const startVideoOff = searchParams.get("cam") === "false";
  const returnToParam = searchParams.get("returnTo") || "/";
  const returnTo = returnToParam.startsWith("/") ? returnToParam : "/";

  return <FullScreenCall room={decodedRoom} displayName={displayName} startMuted={startMuted} startVideoOff={startVideoOff} returnTo={returnTo} />;
}
