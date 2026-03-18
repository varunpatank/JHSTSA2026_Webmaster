"use client";

import { useSearchParams } from 'next/navigation';
import FullScreenCall from '@/components/FullScreenCall';

export default function CallRoomPage({ params }: { params: { room: string } }) {
  const { room } = params;
  return (
    <div className="min-h-screen bg-black">
      <FullScreenCall room={decodeURIComponent(room)} displayName={undefined} />
    </div>
  );
}
