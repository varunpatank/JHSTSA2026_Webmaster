import Link from "next/link";
import {
  CheckCircle,
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

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-primary-900">
      <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-lg font-bold text-primary-900">{title}</h2>
    </div>
  );
}

const IMAGE_CITATIONS: { url: string; description: string; pages: string }[] = [
  // Homepage
  { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac", description: "Students gathered outdoors — hero background", pages: "Homepage, Accessibility, Donate, Privacy, Community" },
  { url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b", description: "STEM lab / workshop — hero slide 1", pages: "Homepage" },
  { url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc", description: "Students presenting — hero slide 2", pages: "Homepage" },
  { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7", description: "Outdoor student group — hero slide 3", pages: "Homepage" },
  { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173", description: "Students studying at desk — Academic category", pages: "Homepage, Resources" },
  { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e", description: "Robotics / STEM lab — STEM category & spotlight", pages: "Homepage, Community" },
  { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433", description: "Community service / volunteering — Service category & spotlight", pages: "Homepage, Resources" },
  { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4", description: "Concert stage / performing arts — Arts category", pages: "Homepage, Resources" },
  { url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211", description: "Sports stadium event — Sports category", pages: "Homepage" },
  { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", description: "Team around laptop — Leadership category", pages: "Homepage, Resources" },
  { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644", description: "Student discussion group — General category", pages: "Homepage, Community, Resources" },
  { url: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2", description: "Globe / world map — retired (replaced)", pages: "—" },
  // Community page
  { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87", description: "Conference / club fair — Model UN card & community event", pages: "Homepage, Community, Resources" },
  { url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91", description: "Students collaborating — community story", pages: "Community" },
  { url: "https://images.unsplash.com/photo-1559223607-a43c990c692c", description: "Group project / teamwork — community story", pages: "Community" },
  // Page heroes
  { url: "https://images.unsplash.com/photo-1552664730-d307ca884978", description: "Team meeting / operations — page hero", pages: "Alumni, Accessibility, Privacy, Resources" },
  { url: "https://images.unsplash.com/photo-1517457373614-b7152f800529", description: "Office / professional meeting — page hero", pages: "Alumni, Donate, Accessibility" },
  { url: "https://images.unsplash.com/photo-1532622785990-1501ba06101d", description: "Charity / donation — donate page hero", pages: "Donate" },
  { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf", description: "Professional speaking / officer roles", pages: "Guides, Resources" },
  { url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f", description: "Open book / reading — guides hero", pages: "Guides" },
  // Resources library
  { url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85", description: "Document signing — constitution & charter", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655", description: "Whiteboard meeting — faculty advisor / first meeting", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66", description: "Approval / policy paperwork", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113", description: "Social media / phone — social media best practices", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb", description: "Flyer / graphic design — recruitment materials", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4", description: "Meeting minutes / notes — operations", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", description: "Mentorship / leadership transition", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f", description: "Budget / financial spreadsheet", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b", description: "Judging / evaluation rubric", pages: "Resources" },
  { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", description: "Student group working — recruiting / founding members", pages: "Resources" },
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-cream-200">

      {/* ── Navy Header ── */}
      <div className="bg-primary-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <FileText size={11} className="text-secondary-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Documentation &amp; Citations</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
            References &amp; <span className="text-secondary-400">Documentation</span>
          </h1>
          <p className="text-sm text-primary-200 max-w-2xl leading-relaxed">
            Complete documentation for ClubConnect — work log, copyright checklist, tech stack, libraries, data architecture, feature walkthrough, and all image attributions.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── 1. Documents ── */}
        <section>
          <SectionHeading icon={FileText} title="Project Documents" />
          <div className="grid md:grid-cols-2 gap-6">

            {/* Work Log PDF */}
            <div>
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText size={12} /> Webmaster Work Log
              </p>
              <div className="border-2 border-primary-200 bg-white overflow-hidden rounded-sm">
                <iframe
                  src="/references/Webmaster_Work_Log_Updated.pdf"
                  className="w-full"
                  style={{ height: "520px" }}
                  title="Webmaster Work Log PDF"
                />
              </div>
              <a
                href="/references/Webmaster_Work_Log_Updated.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-primary-600 hover:text-primary-800"
              >
                ↗ Open in new tab
              </a>
            </div>

            {/* Copyright Checklist */}
            <div>
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Scale size={12} /> Copyright Checklist
              </p>
              <div className="border-2 border-primary-200 bg-white overflow-hidden rounded-sm">
                <iframe
                  src="/references/National%20Webmaster%20Copyright.pdf"
                  className="w-full"
                  style={{ height: "520px" }}
                  title="National Webmaster Copyright PDF"
                />
              </div>
              <a
                href="/references/National%20Webmaster%20Copyright.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-primary-600 hover:text-primary-800"
              >
                ↗ Open in new tab
              </a>
            </div>
          </div>
        </section>

        {/* ── 2. Tech Stack ── */}
        <section>
          <SectionHeading icon={Layers} title="Framework &amp; Tech Stack" />
          <p className="text-sm text-neutral-700 leading-relaxed mb-5">
            ClubConnect is built on <strong className="text-primary-700">Next.js 16</strong> (App Router, Turbopack) with <strong className="text-primary-700">TypeScript</strong> and <strong className="text-primary-700">Tailwind CSS</strong>. <strong className="text-primary-700">Supabase</strong> handles authentication, PostgreSQL database (with Row-Level Security), and file storage. <strong className="text-primary-700">Stripe</strong> powers donation checkout. The design system follows WCAG AA/AAA contrast standards.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { letter: "N", bg: "bg-black",        name: "Next.js 16 + TypeScript", desc: "App Router, Turbopack dev builds, 56+ routes, server & client components" },
              { letter: "S", bg: "bg-emerald-600",  name: "Supabase (Backend)",      desc: "Auth (login/signup), PostgreSQL with RLS, organizations, memberships, events, profiles, avatar storage" },
              { letter: "$", bg: "bg-purple-600",   name: "Stripe Payments",         desc: "Checkout sessions for donations, per-club fundraising progress bars, test mode" },
              { letter: "T", bg: "bg-cyan-600",     name: "Tailwind CSS",            desc: "Custom navy/gold school palette, cream textures, sharp-edge institutional design system" },
              { letter: "M", bg: "bg-orange-600",   name: "MapLibre GL + Leaflet",   desc: "Interactive 3D club directory map for multi-school location discovery" },
              { letter: "A", bg: "bg-primary-700",  name: "NextAuth v4",             desc: "JWT session strategy, credentials provider, server-side auth for API routes" },
            ].map((t) => (
              <div key={t.name} className="flex items-start gap-3 p-4 bg-white border border-cream-300 shadow-sm">
                <span className={`w-7 h-7 ${t.bg} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>{t.letter}</span>
                <div>
                  <p className="text-xs font-bold text-primary-800">{t.name}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Libraries ── */}
        <section>
          <SectionHeading icon={Library} title="Libraries &amp; Dependencies" />
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-1.5">
            {[
              { lib: "next/image",              desc: "Optimized image component with lazy loading and CDN sizing" },
              { lib: "next/link",               desc: "Client-side navigation, prefetching between routes" },
              { lib: "react / react-dom 19",    desc: "UI library with concurrent rendering, hooks" },
              { lib: "react-map-gl/maplibre",   desc: "React bindings for MapLibre GL interactive maps" },
              { lib: "maplibre-gl",             desc: "Open-source vector tile map rendering engine" },
              { lib: "leaflet",                 desc: "Lightweight map library for the directory page" },
              { lib: "lucide-react",            desc: "Icon set used throughout (ISC License)" },
              { lib: "@supabase/supabase-js",   desc: "JS client for Supabase auth & database queries" },
              { lib: "next-auth 4",             desc: "Authentication session management" },
              { lib: "stripe",                  desc: "Node.js Stripe SDK for checkout session creation" },
              { lib: "typescript",              desc: "Typed superset of JavaScript; all source files in .tsx" },
              { lib: "tailwindcss 3",           desc: "Utility-first CSS framework with custom config" },
              { lib: "postcss",                 desc: "CSS transformation toolchain for Tailwind" },
            ].map((l) => (
              <div key={l.lib} className="flex items-start gap-2 py-1.5 border-b border-cream-300">
                <code className="bg-primary-50 border border-primary-100 text-primary-700 text-[10px] px-2 py-0.5 shrink-0 mt-0.5">{l.lib}</code>
                <p className="text-[12px] text-neutral-600">{l.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Data Architecture ── */}
        <section>
          <SectionHeading icon={Server} title="Data Architecture" />
          <p className="text-sm text-neutral-700 mb-5 leading-relaxed">
            ClubConnect connects to a live Supabase backend for core functionality and Stripe for payments. Other pages use hard-coded demo data to showcase the full resource hub without requiring content creation.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-emerald-300 bg-emerald-50">
              <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Server size={11} className="text-emerald-600" /> Supabase — Live
              </h4>
              <ul className="space-y-1.5 text-[11px] text-neutral-700">
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" /> Auth: login, signup, sessions</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" /> User profiles, avatar uploads</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" /> Club creation &amp; editing</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" /> Club events (persisted)</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" /> Memberships, join records</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" /> Community posts &amp; discussions</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-purple-300 bg-purple-50">
              <h4 className="text-[10px] font-bold text-purple-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Globe size={11} className="text-purple-600" /> Stripe — Live
              </h4>
              <ul className="space-y-1.5 text-[11px] text-neutral-700">
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-purple-500 shrink-0 mt-0.5" /> Checkout sessions via <code className="text-[10px] bg-purple-100 px-1">/api/checkout</code></li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-purple-500 shrink-0 mt-0.5" /> Redirects to Stripe secure page</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-purple-500 shrink-0 mt-0.5" /> Success/cancel redirect handling</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-purple-500 shrink-0 mt-0.5" /> Test mode — no real charges</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-purple-500 shrink-0 mt-0.5" /> Per-club fundraising progress</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-neutral-300 bg-neutral-50">
              <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers size={11} className="text-neutral-500" /> Hard-Coded Demo
              </h4>
              <ul className="space-y-1.5 text-[11px] text-neutral-700">
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-neutral-400 shrink-0 mt-0.5" /> 25+ club directory (lib/data.ts)</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-neutral-400 shrink-0 mt-0.5" /> Homepage stats &amp; featured clubs</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-neutral-400 shrink-0 mt-0.5" /> Resource library (lib/resourcesData.ts)</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-neutral-400 shrink-0 mt-0.5" /> Events calendar, guides</li>
                <li className="flex gap-1.5"><CheckCircle size={10} className="text-neutral-400 shrink-0 mt-0.5" /> Analytics &amp; demographic charts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 5. Feature Walkthrough ── */}
        <section>
          <SectionHeading icon={Wrench} title="Feature Walkthrough" />
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Homepage &amp; Club Directory",
                items: [
                  "Rotating hero with live stats (clubs, members, events)",
                  "25+ club directory — search, filters (day/time/category/size), 3D MapLibre map",
                  "Individual club pages with Overview, Statistics, Events, Projects, History, Notes tabs",
                  "Club Finder Quiz; user-created clubs appear live in the directory",
                  "Community spotlight section with featured resource cards",
                ],
              },
              {
                title: "Resources, Events &amp; Calendar",
                items: [
                  "30+ downloadable resources across 5 lifecycle stages with ratings, saves, PDF preview",
                  "Monthly events calendar with RSVP, detail pages, comments, inline creation (Supabase)",
                  "Guides index with categorized how-to articles and step-by-step content",
                ],
              },
              {
                title: "Club Creation &amp; Community",
                items: [
                  "5-step Club Creation Wizard — new clubs saved to Supabase, appear in directory instantly",
                  "Founders can inline-edit club info, add events, manage officers, delete clubs",
                  "Community feed with posts, replies, collaboration platform, social hub",
                  "Student stories, success posts, rotating testimonials",
                ],
              },
              {
                title: "Auth, Profiles &amp; Payments",
                items: [
                  "Supabase login/signup with email/password; JWT sessions via NextAuth",
                  "Profiles: avatar upload to Supabase Storage, bio, grade, activity feed",
                  "Stripe donation checkout with per-club fundraising progress bars (test mode)",
                  "Mentorship profiles, alumni network, notifications, portal dashboard",
                ],
              },
            ].map((sec) => (
              <div key={sec.title} className="bg-white border border-cream-300 p-5 shadow-sm">
                <p className="text-xs font-bold text-primary-800 mb-3" dangerouslySetInnerHTML={{ __html: sec.title }} />
                <ul className="space-y-1.5">
                  {sec.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[12px] text-neutral-600">
                      <CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Accessibility & Legal ── */}
        <section>
          <SectionHeading icon={Shield} title="Accessibility, Safety &amp; Legal" />
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "WCAG 2.1 AA/AAA compliant contrast ratios — small text AAA, large text AA minimum",
              "Keyboard navigation support across all interactive elements",
              "Alt text on every image throughout the application",
              "Safety Guidelines page with emergency contacts, anti-bullying policy, crisis resources",
              "Privacy Policy with COPPA/FERPA compliance notes and clear data handling info",
              "Terms of Use page with acceptable use policy",
              "Accessibility Statement page listing compliance measures",
              "FAQ page with searchable, categorized expandable answers",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-neutral-700 bg-white border border-cream-300 px-4 py-3 shadow-sm">
                <CheckCircle size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. Image Sources ── */}
        <section>
          <SectionHeading icon={ImageIcon} title="Image Sources &amp; Attributions" />
          <p className="text-sm text-neutral-600 mb-4">
            All images are from{" "}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline">Unsplash</a>{" "}
            under the{" "}
            <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline">Unsplash License</a>
            , which permits free use for commercial and non-commercial purposes with no attribution required.
          </p>
          <div className="bg-white border border-cream-300 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-primary-900 text-white">
                    <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-[9px]">#</th>
                    <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-[9px]">Description</th>
                    <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-[9px]">Used On</th>
                    <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-[9px]">Unsplash URL</th>
                  </tr>
                </thead>
                <tbody>
                  {IMAGE_CITATIONS.map((img, i) => (
                    <tr key={img.url} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                      <td className="px-4 py-2.5 text-neutral-400 font-mono">{i + 1}</td>
                      <td className="px-4 py-2.5 text-neutral-700">{img.description}</td>
                      <td className="px-4 py-2.5 text-neutral-500">{img.pages}</td>
                      <td className="px-4 py-2.5">
                        <a
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline break-all font-mono text-[10px]"
                        >
                          {img.url.replace("https://images.unsplash.com/", "…/")}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Student Work Declaration ── */}
        <div className="bg-primary-900 text-white px-6 py-5 rounded-sm">
          <p className="text-sm font-medium">
            <strong className="text-secondary-400">Student Work Declaration:</strong>{" "}
            All code, design, content, and documentation was created by the JHSTSA Webmaster team for the 2025–2026 school year. No copyrighted material was used without proper licensing. All Unsplash images are used under the Unsplash License.
          </p>
        </div>

        {/* ── Back link ── */}
        <div className="pb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}

