"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import {
  CheckCircle,
  ChevronDown,
  FileText,
  Globe,
  ImageIcon,
  Layers,
  Library,
  Scale,
  Server,
  Shield,
  Wrench,
} from "lucide-react";

function Accordion({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-primary-50/50 transition-colors text-left"
      >
        <span className="text-primary-600">{icon}</span>
        <span className="flex-1 text-sm font-bold text-primary-800">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-neutral-100">{children}</div>
      )}
    </div>
  );
}

const imageLinks = [
  {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
    description: "Conference event hero image",
    page: "Events",
  },
  {
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80",
    description: "Students celebration hero image",
    page: "Home, Alumni",
  },
  {
    url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1920&q=80",
    description: "Group of students image",
    page: "Home, Directory",
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    description: "Student with laptop image",
    page: "Home",
  },
  {
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80",
    description: "Team working together image",
    page: "Home",
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    description: "Portrait headshot image",
    page: "Home",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    description: "Students collaborating image",
    page: "Home, Officer",
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80",
    description: "Student discussion group image",
    page: "Home, Student",
  },
  {
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80",
    description: "Students in classroom image",
    page: "Directory Detail, Spotlight",
  },
  {
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80",
    description: "Library books hero image",
    page: "Resources",
  },
  {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
    description: "Team meeting hero image",
    page: "Propose",
  },
  {
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80",
    description: "Campus building hero image",
    page: "Login",
  },
  {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    description: "Office workspace hero image",
    page: "Admin",
  },
  {
    url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80",
    description: "Financial documents hero image",
    page: "Funding",
  },
  {
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80",
    description: "Business meeting hero image",
    page: "Announcements",
  },
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <HeroSection>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary-500/20 px-3 py-1 text-xs font-semibold text-secondary-300">
          <FileText size={12} /> Documentation &amp; Citations
        </div>
        <h1 className="hero-title">
          <span>References</span>
        </h1>
        <p className="hero-description max-w-2xl text-sm">
          Complete documentation for ClubConnect &mdash; framework details, tech
          stack, work log, copyright checklist, libraries, image attributions,
          and a full feature walkthrough for judges.
        </p>
      </HeroSection>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {/* Work Log & Copyright */}
        <div className="w-full">
          <Accordion icon={<FileText size={16} />} title="Work Log">
            <p className="text-xs text-neutral-500 mt-3 mb-2">
              Webmaster Work Log.pdf
            </p>
            <div className="border border-neutral-300 bg-neutral-50 w-full h-screen overflow-hidden">
              <iframe
                src="/Webmaster%20Work%20Log.pdf"
                className="w-full h-full"
                title="Webmaster Work Log PDF"
              />
            </div>
          </Accordion>

          <Accordion icon={<Scale size={16} />} title="Copyright Checklist">
            <p className="text-xs text-neutral-500 mt-3 mb-2">copyright</p>
            <div className="border border-neutral-300 bg-neutral-50 overflow-auto">
              <img
                src="/copyright.png"
                alt="Copyright Checklist"
                className="w-full h-auto"
              />
            </div>
          </Accordion>
        </div>

        {/* Framework & Code Stack */}
        <Accordion icon={<Layers size={16} />} title="Framework & Code Stack">
          <div className="mt-3 space-y-4">
            <p className="text-sm text-neutral-700 leading-relaxed">
              ClubConnect is built on{" "}
              <span className="font-semibold text-primary-600">Next.js 16</span>{" "}
              (App Router) with Turbopack for lightning-fast development builds
              and 56+ routes.{" "}
              <span className="font-semibold text-primary-600">Supabase</span>{" "}
              powers the full backend — authentication (email/password login
              &amp; signup), a PostgreSQL database with Row-Level Security for
              organizations, memberships, events, profiles, and community
              content, plus file storage for avatars and uploads.{" "}
              <span className="font-semibold text-primary-600">Stripe</span>{" "}
              handles secure donation checkout sessions for club fundraising.
              Styling uses{" "}
              <span className="font-semibold text-primary-600">
                Tailwind CSS
              </span>{" "}
              with a custom school-themed design system. The site follows WCAG
              accessibility guidelines for color contrast, with small text at a
              AAA contrast ratio rating and large text with at least a AA
              contrast ratio rating.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  icon: (
                    <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-[9px] font-bold">
                      N
                    </span>
                  ),
                  name: "Next.js 16 + TypeScript",
                  desc: "App Router with server & client components, Turbopack for fast dev builds, 56+ routes across the application",
                },
                {
                  icon: (
                    <span className="w-6 h-6 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                      S
                    </span>
                  ),
                  name: "Supabase (Backend)",
                  desc: "Full auth (login/signup/sessions), PostgreSQL database with RLS, organizations, memberships, events, profiles, file storage for avatars & uploads",
                },
                {
                  icon: (
                    <span className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">
                      $
                    </span>
                  ),
                  name: "Stripe Payments",
                  desc: "Secure checkout sessions for club donations and fundraising, with progress tracking and test mode integration",
                },
                {
                  icon: (
                    <span className="w-6 h-6 bg-cyan-600 text-white flex items-center justify-center text-[9px] font-bold">
                      T
                    </span>
                  ),
                  name: "Tailwind CSS",
                  desc: "Custom school-themed design system with primary (navy), secondary (gold), and accent (maroon) palette",
                },
                {
                  icon: (
                    <span className="w-6 h-6 bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">
                      L
                    </span>
                  ),
                  name: "MapLibre GL + Leaflet",
                  desc: "Interactive 3D map integration in the Club Directory for multi-school location-based discovery",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex items-start gap-2.5 p-3 bg-neutral-50 border border-neutral-200"
                >
                  {t.icon}
                  <div>
                    <p className="text-xs font-semibold text-primary-700">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Additional Libraries */}
        <Accordion
          icon={<Library size={16} />}
          title="Additional Libraries Utilized"
        >
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              {[
                {
                  lib: "next/image",
                  desc: "Optimized image component for Next.js applications.",
                },
                {
                  lib: "next/link",
                  desc: "Client-side navigation component for Next.js.",
                },
                {
                  lib: "react",
                  desc: "A library for building user interfaces.",
                },
                {
                  lib: "react-map-gl/maplibre",
                  desc: "React bindings for MapLibre GL map rendering.",
                },
                {
                  lib: "maplibre-gl",
                  desc: "Open-source map rendering engine for vector tiles.",
                },
              ].map((l) => (
                <li key={l.lib} className="flex items-start gap-2">
                  <span className="text-secondary-500 mt-1">•</span>
                  <span className="text-sm">
                    <code className="bg-neutral-100 px-2 py-0.5 text-xs">
                      {l.lib}
                    </code>{" "}
                    : {l.desc}
                  </span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {[
                {
                  lib: "typescript",
                  desc: "Typed superset of JavaScript for better developer experience.",
                },
                {
                  lib: "tailwindcss",
                  desc: "Utility-first CSS framework for rapid UI development.",
                },
                {
                  lib: "postcss",
                  desc: "Tool for transforming CSS with JavaScript plugins.",
                },
                {
                  lib: "lucide-react",
                  desc: "Beautiful & consistent icon library (ISC License).",
                },
                {
                  lib: "@supabase/supabase-js",
                  desc: "JavaScript client for Supabase authentication & database.",
                },
              ].map((l) => (
                <li key={l.lib} className="flex items-start gap-2">
                  <span className="text-secondary-500 mt-1">•</span>
                  <span className="text-sm">
                    <code className="bg-neutral-100 px-2 py-0.5 text-xs">
                      {l.lib}
                    </code>{" "}
                    : {l.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Accordion>

        {/* Data Architecture & Backend vs UI */}
        <Accordion
          icon={<Server size={16} />}
          title="Data Architecture — Supabase, Stripe & Hard-Coded UI"
        >
          <div className="mt-3 space-y-4">
            <p className="text-sm text-neutral-700 leading-relaxed">
              ClubConnect connects to a live{" "}
              <span className="font-semibold text-emerald-700">Supabase</span>{" "}
              backend for core functionality and{" "}
              <span className="font-semibold text-indigo-700">Stripe</span> for
              payments, while other pages use hard-coded data to showcase the
              breadth of the resource hub theme.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-3 border-2 border-emerald-300 bg-emerald-50/60">
                <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Server size={12} className="text-emerald-600" />
                  Supabase-Connected (Live)
                </h4>
                <ul className="space-y-1 text-[11px] text-neutral-700">
                  <li>• Auth — login, signup, sessions via Supabase Auth</li>
                  <li>
                    • User profiles — avatar upload to Supabase Storage, bio,
                    grade
                  </li>
                  <li>
                    • Club creation & editing — saved to organizations table
                  </li>
                  <li>• Club events — persisted to events table</li>
                  <li>• Memberships — join records linking profiles to orgs</li>
                  <li>• Community uploads, discussions, ideas</li>
                </ul>
              </div>
              <div className="p-3 border-2 border-indigo-300 bg-indigo-50/60">
                <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe size={12} className="text-indigo-600" />
                  Stripe Payments
                </h4>
                <ul className="space-y-1 text-[11px] text-neutral-700">
                  <li>
                    • Donations create a Stripe Checkout Session via{" "}
                    <code className="bg-indigo-100 px-1 text-[10px]">
                      /api/checkout
                    </code>
                  </li>
                  <li>
                    • User is redirected to Stripe&apos;s secure payment page
                  </li>
                  <li>• Success/cancel handling with redirect back to site</li>
                  <li>• Test mode — full flow, no real charges</li>
                  <li>• Per-club fundraising progress bars</li>
                </ul>
              </div>
              <div className="p-3 border-2 border-purple-300 bg-purple-50/60">
                <h4 className="text-[10px] font-bold text-purple-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={12} className="text-purple-600" />
                  Hard-Coded UI (Theme Demo)
                </h4>
                <ul className="space-y-1 text-[11px] text-neutral-700">
                  <li>• Preset 25+ club directory with officers & schedules</li>
                  <li>• Homepage stats, featured clubs carousel</li>
                  <li>• Events calendar, resource library, guides</li>
                  <li>• Mentorship profiles, alumni, competitions</li>
                  <li>• Analytics dashboards & demographic charts</li>
                  <li>• Some profile sections (badges, activity feed)</li>
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500">
              Core workflows (auth, data, payments) use real integrations.
              Broader resource hub pages use hard-coded data so judges can
              experience a richly populated site without creating content.
            </p>
          </div>
        </Accordion>

        {/* Feature Walkthrough */}
        <Accordion icon={<Wrench size={16} />} title="Feature Walkthrough">
          <div className="mt-3 space-y-3">
            {[
              {
                title: "Homepage & Directory",
                items: [
                  "Hero with live counters, featured clubs carousel, quick-access grid, announcements",
                  "25+ club directory with search, filters (day/time/category/size), and 3D MapLibre map",
                  "Individual club pages with Overview, Statistics, Events, Projects, History, and Notes tabs",
                  "Club Finder Quiz and user-created clubs appearing in the live directory",
                ],
              },
              {
                title: "Resources, Events & Calendar",
                items: [
                  "20+ downloadable resources in a 5-stage system with PDF preview and filtering",
                  "Monthly events calendar with RSVP, detail pages, comments, and inline event creation (Supabase)",
                  "Guides index with categorized how-to articles",
                ],
              },
              {
                title: "Club Creation, Community & Social",
                items: [
                  "5-step Club Creation Wizard — new clubs appear instantly in the directory (saved to Supabase)",
                  "Founders can inline-edit club info, add events, and delete clubs",
                  "Community feed with threaded replies, collaboration platform, and community hub",
                ],
              },
              {
                title: "Auth, Profiles & Donations",
                items: [
                  "Supabase-powered login/signup with profiles (avatar, bio, grade), personal dashboard",
                  "Stripe donation checkout with per-club fundraising progress bars",
                  "Mentorship profiles, alumni network, video calls with whiteboard, notification center",
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="border border-neutral-100 p-3"
              >
                <p className="text-xs font-bold text-primary-700 mb-1.5">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-neutral-700"
                    >
                      <CheckCircle
                        size={11}
                        className="text-green-600 mt-0.5 shrink-0"
                      />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Accordion>

        {/* Accessibility, Safety & Legal */}
        <Accordion
          icon={<Shield size={16} />}
          title="Accessibility, Safety & Legal"
        >
          <ul className="mt-3 space-y-1.5">
            {[
              "WCAG 2.1 AA/AAA compliant contrast ratios throughout the design",
              "Keyboard navigation support and alt text on all images",
              "Safety Guidelines with emergency contacts, anti-bullying policy, and crisis resources",
              "Privacy Policy with COPPA/FERPA compliance, Terms of Use, and data handling info",
              "FAQ page with searchable, categorized questions and expandable answers",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs text-neutral-700"
              >
                <CheckCircle
                  size={11}
                  className="text-green-600 mt-0.5 shrink-0"
                />{" "}
                {item}
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Image Links */}
        <Accordion
          icon={<ImageIcon size={16} />}
          title="Image Sources & Attributions"
        >
          <div className="mt-3">
            <p className="text-xs text-neutral-600 mb-3">
              All images rely on the{" "}
              <a
                href="https://unsplash.com/license"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline font-semibold"
              >
                Unsplash License
              </a>
              , which allows free use for commercial and non-commercial
              purposes.
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {imageLinks.map((image, index) => (
                <div
                  key={index}
                  className="border border-neutral-200 p-2.5 bg-neutral-50"
                >
                  <a
                    href={image.url.split("?")[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-xs break-all"
                  >
                    {image.url.split("?")[0]}
                  </a>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    {image.description} — Used on: {image.page}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Student Work Declaration */}
        <div className="p-4 bg-primary-50 border border-primary-200">
          <p className="text-xs text-primary-700">
            <strong>Student Work Declaration:</strong> All code, design, and
            content was created by the JHSTSA Webmaster team. No copyrighted
            material was used without proper licensing.
          </p>
        </div>

        <div className="text-center py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
