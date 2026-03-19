"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authApi } from "@/lib/api";
import { isLoggedIn as isLocalLoggedIn } from "@/lib/clientState";

export function useAuthGate() {
  const { status } = useSession();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    let active = true;

    (async () => {
      try {
        const hasSupabaseSession = await authApi.isLoggedIn();
        if (active) {
          setLoggedIn(status === "authenticated" || hasSupabaseSession || isLocalLoggedIn());
        }
      } catch {
        if (active) {
          setLoggedIn(status === "authenticated" || isLocalLoggedIn());
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [status]);

  return { ready, loggedIn, status };
}
