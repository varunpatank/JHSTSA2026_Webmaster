"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookMarked, BookOpen, Compass, Gavel, Menu, X, Calendar, Users } from "lucide-react";
import { supabase, profilesApi, storageApi, authApi } from "../lib/api";
import { loginUser, isLoggedIn as isLocalLoggedIn } from "@/lib/clientState";

function ClubConnectLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mortarboard flat top (diamond) */}
      <polygon points="22,5 40,13 22,21 4,13" fill="#111111" strokeLinejoin="round" />
      {/* Cap body */}
      <path d="M10 14.5 L10 26 Q22 35 34 26 L34 14.5" fill="#222222" />
      {/* Tassel cord */}
      <line x1="40" y1="13" x2="40" y2="23" stroke="#C8940A" strokeWidth="2" strokeLinecap="round" />
      {/* Tassel ball */}
      <circle cx="40" cy="26" r="3" fill="#C8940A" stroke="#A67C00" strokeWidth="0.8" />
    </svg>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/directory", label: "Clubs", icon: Compass },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/community", label: "Social Hub", icon: Users },
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
                For students, by students!
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
                  className="inline-flex h-[60px] items-center gap-1.5 px-3 text-[12.5px] font-medium text-primary-900 hover:text-secondary-600 transition-colors relative after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2px] after:bg-secondary-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                >
                  {Icon && <Icon size={14} />}
                  {link.label}
                </Link>
              );
            })}

          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-900 text-primary-900 hover:bg-cream-200"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>

            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-semibold rounded-full bg-primary-900 text-white hover:brightness-110 transition-colors"
              >
                <BookMarked size={11} /> Portal
              </Link>
              <Link
                href="/portal?tab=resource"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-semibold rounded-full bg-primary-900 text-white hover:brightness-110 transition-colors"
              >
                <BookOpen size={11} /> Suggest Resource
              </Link>
            </div>

            {/* Judge button removed per user request */}
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
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-900 hover:bg-cream-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
