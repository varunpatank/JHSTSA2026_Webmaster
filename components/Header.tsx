"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookMarked, BookOpen, Compass, Gavel, Menu, Plus, X } from "lucide-react";
import { supabase, profilesApi, storageApi, authApi } from "../lib/api";
import { loginUser, isLoggedIn as isLocalLoggedIn } from "@/lib/clientState";

function ClubConnectLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mortarboard flat board (diamond) */}
      <polygon points="20,7 35,15 20,23 5,15" fill="#174070" />
      {/* Cap body visible below board */}
      <path d="M12 16 L12 24 Q20 30 28 24 L28 16" fill="#174070" fillOpacity="0.55" />
      {/* Tassel cord from right vertex */}
      <line x1="35" y1="15" x2="35" y2="27" stroke="#D6A21E" strokeWidth="1.7" strokeLinecap="round" />
      {/* Tassel ball */}
      <circle cx="35" cy="29" r="2.2" fill="#D6A21E" />
    </svg>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/directory", label: "Clubs", icon: Compass },
    { href: "/community", label: "Community", icon: null },
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
          if (isLocalLoggedIn()) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
          setAvatarUrl(null);
          return;
        }

        setIsLoggedIn(true);

        const profileRes: any = await profilesApi.getById(effectiveUserId);
        if (!mounted) return;

        if (
          !profileRes.error &&
          profileRes.data &&
          profileRes.data.avatar_url
        ) {
          const avatarValue: string = profileRes.data.avatar_url;
          const publicUrl = avatarValue.startsWith("http")
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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user && status !== "authenticated" && !isLocalLoggedIn()) {
          setIsLoggedIn(false);
          setAvatarUrl(null);
          return;
        }

        loadUser();
      },
    );

    return () => {
      mounted = false;
      if (
        authListener &&
        (authListener as any).subscription &&
        typeof (authListener as any).subscription.unsubscribe === "function"
      ) {
        (authListener as any).subscription.unsubscribe();
      }
    };
  }, [session?.user?.id, status]);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#fffdf8] via-[#f7f1e8] to-[#fffdf8] border-b border-[#e5d5bc] shadow-[0_3px_14px_rgba(23,54,93,0.09)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex min-h-[60px] items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="ClubConnect home"
          >
            <ClubConnectLogo className="w-8 h-8 shrink-0 group-hover:opacity-85 transition-opacity" />
            <div>
              <span className="text-[14px] font-bold text-primary-900 tracking-wide leading-none block font-heading">
                ClubConnect
              </span>
              <span className="text-[9px] text-amber-700/70 uppercase tracking-[0.15em] leading-none font-semibold">
                School Chapter Hub
              </span>
            </div>
          </Link>

          {/* Center nav */}
          <nav
            className="hidden md:flex items-center gap-0"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex h-[60px] items-center gap-1.5 px-3 text-[12.5px] font-medium text-primary-800 hover:text-primary-900 transition-colors relative after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2px] after:bg-secondary-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                >
                  {Icon && <Icon size={14} />}
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/references"
              className="inline-flex h-[60px] items-center px-3 text-[12.5px] font-medium text-primary-800 hover:text-primary-900 transition-colors relative after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2px] after:bg-secondary-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              References
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-200 text-primary-600 hover:bg-cream-200"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>

            {/* Portal action buttons - desktop only */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/portal?tab=resource"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border border-cream-400 text-primary-600 hover:bg-cream-100 transition-colors"
              >
                <Plus size={11} /> Add Resource
              </Link>
              <Link
                href="/portal?tab=create"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border border-cream-400 text-primary-600 hover:bg-cream-100 transition-colors"
              >
                <Plus size={11} /> New Club
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full bg-primary-700 text-white hover:bg-primary-800 transition-colors"
              >
                <BookMarked size={11} /> Portal
              </Link>
            </div>

            {!isLoggedIn && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await authApi.signInWithEmail("Judge@TSA.org", "Judge@123");
                    loginUser("Judge", "Judge@TSA.org");
                    setIsLoggedIn(true);
                    setAvatarUrl(null);
                    window.location.reload();
                  } catch {
                    loginUser("Judge", "Judge@TSA.org");
                    setIsLoggedIn(true);
                    setAvatarUrl(null);
                  }
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border border-secondary-400 text-secondary-700 hover:bg-secondary-50 transition-colors"
                aria-label="Quick judge login"
              >
                <Gavel size={12} />
                Judge
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-cream-300 md:hidden">
            <nav
              id="mobile-nav"
              className="pb-4 pt-2 space-y-0.5"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-cream-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/references"
                className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-cream-200 transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookMarked size={14} />
                References
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
