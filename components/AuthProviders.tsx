"use client";

import { SessionProvider } from "next-auth/react";
import AuthStateSync from "@/components/AuthStateSync";

export default function AuthProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthStateSync />
      {children}
    </SessionProvider>
  );
}
