"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { supabase } from "@/lib/api";
import { logoutUser, setLoggedInState, isLoggedIn } from "@/lib/clientState";

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
      const nextAuthAccessToken = nextAuthSession?.supabase?.accessToken;
      const nextAuthRefreshToken = nextAuthSession?.supabase?.refreshToken;

      if (!sessionUser && nextAuthAccessToken && nextAuthRefreshToken) {
        const restoreRes = await supabase.auth.setSession({
          access_token: nextAuthAccessToken,
          refresh_token: nextAuthRefreshToken,
        });

        if (restoreRes.error) {
          logoutUser();
          return;
        }
      }

      const { data: refreshed } = await supabase.auth.getSession();
      const restoredUser = refreshed.session?.user;

      if (nextAuthUser) {
        setLoggedInState(true, {
          name: nextAuthUser.name || nextAuthUser.email?.split("@")[0] || "Student User",
          email: nextAuthUser.email,
        });
        return;
      }

      if (!restoredUser) {
        if (!isLoggedIn()) logoutUser();
        return;
      }

      setLoggedInState(true, {
        name:
          restoredUser.user_metadata?.name ||
          restoredUser.user_metadata?.full_name ||
          restoredUser.email?.split("@")[0] ||
          "Student User",
        email: restoredUser.email,
      });
    };

    syncFromSession().catch(() => { /* supabase placeholder — AbortError expected in dev */ });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return; // syncFromSession already handles init
      const user = session?.user;
      if (!user) {
        if (event === "SIGNED_OUT") logoutUser();
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
