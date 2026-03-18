"use client";

import dynamic from "next/dynamic";

const AIChatWidget = dynamic(() => import("@/components/AIChatWidget"), { ssr: false });

export default function ClientChatWrapper() {
  return <AIChatWidget />;
}
