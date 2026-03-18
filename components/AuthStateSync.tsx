"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { supabase } from "@/lib/api";
import { logoutUser, setLoggedInState } from "@/lib/clientState";

export default function AuthStateSync() {
  useEffect(() => {
    let mounted = true;

    const syncFromSession = async () => {
      const [{ data }, nextAuthSession] = await Promise.all([
        supabase.auth.getSession(),
        getSession(),
      ]);

      if (!mounted) return;

      const sessionUser = data.session?.user;
      const nextAuthUser = nextAuthSession?.user;

      if (nextAuthUser) {
        setLoggedInState(true, {
          name: nextAuthUser.name || nextAuthUser.email?.split("@")[0] || "Student User",
          email: nextAuthUser.email,
        });
        return;
      }

      if (!sessionUser) {
        logoutUser();
        return;
      }

      setLoggedInState(true, {
        name:
          sessionUser.user_metadata?.name ||
          sessionUser.user_metadata?.full_name ||
          sessionUser.email?.split("@")[0] ||
          "Student User",
        email: sessionUser.email,
      });
    };

    syncFromSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        logoutUser();
        return;
      }

      setLoggedInState(true, {
        name:
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Student User",
        email: user.email,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
