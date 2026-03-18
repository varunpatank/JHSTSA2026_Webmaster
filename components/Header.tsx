"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookMarked, Menu, X, User } from "lucide-react";
import { supabase, profilesApi, storageApi } from "../lib/api";

function ClubConnectLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {}
      <rect width="40" height="40" rx="8" fill="url(#logo-bg)" />
      <rect x="1" y="1" width="38" height="38" rx="7" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
      {}
      <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeOpacity="0.04" strokeWidth="0.5" />
      <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeOpacity="0.04" strokeWidth="0.5" />
      {}
      <path d="M20 5.5L17 18.5h6L20 5.5z" fill="white" />
      <path d="M20 5.5L18.5 18.5h-1.5L20 5.5z" fill="white" fillOpacity="0.7" />
      {}
      <ellipse cx="20" cy="7" rx="1.8" ry="2.2" fill="white" />
      <ellipse cx="19.5" cy="6.5" rx="0.8" ry="1.2" fill="white" fillOpacity="0.5" />
      {}
      <circle cx="20" cy="12" r="2.2" fill="#152d4a" stroke="white" strokeWidth="0.6" />
      <circle cx="20" cy="12" r="1.4" fill="#5b9bd5" />
      <ellipse cx="19.3" cy="11.3" rx="0.5" ry="0.6" fill="white" fillOpacity="0.5" />
      {}
      <rect x="17.2" y="15" width="5.6" height="0.8" rx="0.4" fill="#b8860b" fillOpacity="0.7" />
      {}
      <path d="M17 17l-4.5 7.5L17 22z" fill="white" fillOpacity="0.9" />
      <path d="M17 17l-3 5.5L17 20.5z" fill="white" fillOpacity="0.6" />
      {}
      <path d="M23 17l4.5 7.5L23 22z" fill="white" fillOpacity="0.9" />
      {}
      <rect x="17" y="18.5" width="6" height="3.5" rx="0.8" fill="white" fillOpacity="0.95" />
      <rect x="18" y="21.5" width="4" height="1.5" rx="0.5" fill="#d4d4d8" fillOpacity="0.6" />
      {}
      <path d="M18.2 23c-.8 3-1 5.5 1.8 8 2.8-2.5 2.6-5 1.8-8h-3.6z" fill="#FF6B35" fillOpacity="0.9" />
      {}
      <path d="M18.8 23c-.5 2.5-.5 4.5 1.2 6.5 1.7-2 1.7-4 1.2-6.5h-2.4z" fill="#FFD700" />
      {}
      <path d="M19.3 23c-.3 1.8-.2 3.5 0.7 5 0.9-1.5 1-3.2 0.7-5h-1.4z" fill="white" fillOpacity="0.8" />
      {}
      <circle cx="7" cy="9" r="1" fill="white" fillOpacity="0.7" />
      <circle cx="7" cy="9" r="0.4" fill="white" />
      <circle cx="34" cy="7" r="0.8" fill="white" fillOpacity="0.6" />
      <circle cx="34" cy="7" r="0.3" fill="white" />
      <circle cx="5" cy="30" r="0.6" fill="white" fillOpacity="0.4" />
      <circle cx="35" cy="25" r="0.7" fill="white" fillOpacity="0.5" />
      <circle cx="9" cy="20" r="0.4" fill="white" fillOpacity="0.3" />
      <circle cx="32" cy="15" r="0.5" fill="white" fillOpacity="0.35" />
      {}
      <text x="31" y="37" fill="white" fillOpacity="0.2" fontSize="5" fontWeight="bold" fontFamily="sans-serif">CC</text>
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" />
          <stop offset="0.4" stopColor="#264d78" />
          <stop offset="1" stopColor="#1a3050" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openReferencesPanel = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-judge-guide"));
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/directory", label: "Discover" },
    { href: "/start-a-club", label: "Create" },
    { href: "/resources", label: "Resources" },
    { href: "/community", label: "Social" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        const sessionUserId = session?.user?.id;
        const effectiveUserId = user?.id ?? sessionUserId;
        if (!mounted) return;

        if (!effectiveUserId) {
          setIsLoggedIn(false);
          setAvatarUrl(null);
          return;
        }

        setIsLoggedIn(true);

        const profileRes: any = await profilesApi.getById(effectiveUserId);
        if (!mounted) return;

        if (!profileRes.error && profileRes.data && profileRes.data.avatar_url) {
          const avatarValue: string = profileRes.data.avatar_url;
          const publicUrl = avatarValue.startsWith('http')
            ? avatarValue
            : storageApi.getAvatarPublicUrl(avatarValue);
          setAvatarUrl(publicUrl ?? null);
        } else {
          setAvatarUrl(null);
        }
      } catch {
        setIsLoggedIn(false);
        setAvatarUrl(null);
      }
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user && status !== "authenticated") {
        setIsLoggedIn(false);
        setAvatarUrl(null);
        return;
      }

      loadUser();
    });

    return () => {
      mounted = false;
      if (authListener && (authListener as any).subscription && typeof (authListener as any).subscription.unsubscribe === 'function') {
        ;(authListener as any).subscription.unsubscribe();
      }
    };
  }, [session?.user?.id, status]);

  return (
    <header className="sticky top-0 z-40 border-b border-primary-600 bg-primary-700 text-white">
      <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-4">
          <Link href="/" className="flex items-center gap-3 group" aria-label="ClubConnect home">
            <ClubConnectLogo className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform" />
            <div>
              <p className="text-base font-bold text-white leading-tight">ClubConnect</p>
              <p className="text-xs text-primary-200">Launch Club</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-primary-100  hover:text-white hover:bg-primary-600 transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={openReferencesPanel}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-secondary-300 border border-secondary-500/60 hover:bg-secondary-500/20 hover:text-secondary-200 transition-colors"
              aria-label="Open references panel"
            >
              <BookMarked size={12} />
              References
            </button>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center  border border-primary-500 p-2 text-white hover:bg-primary-600"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {isLoggedIn ? (
              <Link href="/profile" className="ml-2">
                <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center overflow-hidden border border-primary-500">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
              </Link>
            ) : (
              <Link href="/login" className="ml-2 px-4 py-1.5 text-sm font-bold text-secondary-300 border border-secondary-500/60 hover:bg-secondary-500/20 hover:text-secondary-200 transition-colors">
                Log in
              </Link>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-nav" className="md:hidden pb-4 pt-2 space-y-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block  border border-primary-600 px-3 py-2 text-sm font-medium text-primary-100 hover:bg-primary-600 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                openReferencesPanel();
                setMobileMenuOpen(false);
              }}
              className="w-full border border-primary-600 px-3 py-2 text-sm font-medium text-primary-100 hover:bg-primary-600 hover:text-white text-left inline-flex items-center gap-2"
              aria-label="Open references panel"
            >
              <BookMarked size={14} />
              References
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
