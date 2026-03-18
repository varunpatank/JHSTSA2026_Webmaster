"use client";

import FullScreenCall from '@/components/FullScreenCall';

export default function PreviewCallPage() {
  const room = `ClubConnect-preview-${Date.now()}`;
  return (
    <div className="min-h-screen bg-black">
      <FullScreenCall room={room} displayName={'Preview User'} />
    </div>
  );
}
