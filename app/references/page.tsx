'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from "@/components/HeroSection";
import {
  BookOpen, CheckCircle, ChevronDown, Code2, FileText, Globe, ImageIcon,
  Layers, Library, Scale, Server, Shield, Wrench,
} from 'lucide-react';

function Accordion({ icon, title, children, defaultOpen = false }: { icon: React.ReactNode; title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 bg-white">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-primary-50/50 transition-colors text-left">
        <span className="text-primary-600">{icon}</span>
        <span className="flex-1 text-sm font-bold text-primary-800">{title}</span>
        <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 border-t border-neutral-100">{children}</div>}
    </div>
  );
}

const imageLinks = [
  { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80', description: 'Conference event hero image', page: 'Events' },
  { url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80', description: 'Students celebration hero image', page: 'Home, Alumni' },
  { url: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1920&q=80', description: 'Group of students image', page: 'Home, Directory' },
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80', description: 'Student with laptop image', page: 'Home' },
  { url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80', description: 'Team working together image', page: 'Home' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', description: 'Portrait headshot image', page: 'Home' },
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', description: 'Students collaborating image', page: 'Home, Officer' },
  { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80', description: 'Student discussion group image', page: 'Home, Student' },
  { url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80', description: 'Students in classroom image', page: 'Directory Detail, Spotlight' },
  { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80', description: 'Library books hero image', page: 'Resources' },
  { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80', description: 'Team meeting hero image', page: 'Propose' },
  { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80', description: 'Campus building hero image', page: 'Login' },
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80', description: 'Office workspace hero image', page: 'Admin' },
  { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80', description: 'Financial documents hero image', page: 'Funding' },
  { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80', description: 'Business meeting hero image', page: 'Announcements' },
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <HeroSection>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary-500/20 px-3 py-1 text-xs font-semibold text-secondary-300">
          <FileText size={12} /> Documentation &amp; Citations
        </div>
        <h1 className="hero-title"><span>References</span></h1>
        <p className="hero-description max-w-2xl text-sm">
          Complete documentation for ClubConnect &mdash; framework details, tech stack, work log, copyright checklist, libraries, image attributions, and a full feature walkthrough for judges.
        </p>
        <div className="hero-stats max-w-xl">
          {[
            { label: 'Pages', value: '56+' },
            { label: 'Clubs', value: '25+' },
            { label: 'Resources', value: '20+' },
            { label: 'APIs', value: '5' },
          ].map(s => (
            <div key={s.label} className="hero-stat p-2">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] text-neutral-300">{s.label}</p>
            </div>
          ))}
        </div>
      </HeroSection>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* Work Log & Copyright */}
        <div className="grid md:grid-cols-2 gap-4">
          <Accordion icon={<FileText size={16} />} title="Work Log" defaultOpen>
            <p className="text-xs text-neutral-500 mt-3 mb-2">Webmaster Work Log.pdf</p>
            <div className="border border-neutral-300 bg-neutral-50 h-96 overflow-hidden">
              <iframe
                src="/Webmaster%20Work%20Log.pdf"
                className="w-full h-full"
                title="Webmaster Work Log PDF"
              />
            </div>
          </Accordion>

          <Accordion icon={<Scale size={16} />} title="Copyright Checklist" defaultOpen>
            <p className="text-xs text-neutral-500 mt-3 mb-2">copyright.pdf</p>
            <div className="border border-neutral-300 bg-neutral-50 h-96 overflow-hidden">
              <iframe
                src="/WhatsApp%20Image%202026-01-21%20at%202.41.55%20PM.pdf"
                className="w-full h-full"
                title="Copyright Checklist PDF"
              />
            </div>
          </Accordion>
        </div>

        {/* Framework & Code Stack */}
        <Accordion icon={<Layers size={16} />} title="Framework & Code Stack" defaultOpen>
          <div className="mt-3 space-y-4">
            <p className="text-sm text-neutral-700 leading-relaxed">
              This website utilizes <span className="font-semibold text-primary-600">Next.js 16</span> (App Router), a modern React-based framework optimized for efficiency and fast render times with Turbopack. Styling is handled by <span className="font-semibold text-primary-600">Tailwind CSS</span>, a utility-first CSS framework allowing rapid, maintainable UI development. All non-standard components and theming are custom work by our team. The site follows WCAG accessibility guidelines for color contrast, with small text at a AAA contrast ratio rating and large text with at least a AA contrast ratio rating.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-[9px] font-bold">N</span>, name: 'Next.js 16 + TypeScript', desc: 'App Router with server & client components, Turbopack for fast dev builds, 56+ routes across the application' },
                { icon: <span className="w-6 h-6 bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">S</span>, name: 'Supabase', desc: 'Full auth system (login, signup, sessions), PostgreSQL database, row-level security, real-time subscriptions, file storage for avatars & uploads' },
                { icon: <span className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">$</span>, name: 'Stripe Payments', desc: 'Secure checkout sessions for club donations and fundraising, with progress tracking and test mode' },
                { icon: <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">G</span>, name: 'Gemini 2.0 Flash (AI)', desc: 'Embedded AI chat agents on multiple pages for resource discovery, Q&A, and navigational help' },
                { icon: <span className="w-6 h-6 bg-cyan-600 text-white flex items-center justify-center text-[9px] font-bold">T</span>, name: 'Tailwind CSS', desc: 'Custom school-themed design system with primary (navy), secondary (gold), and accent (maroon) palette' },
                { icon: <span className="w-6 h-6 bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">L</span>, name: 'MapLibre GL + Leaflet', desc: 'Interactive 3D map integration in the Club Directory for multi-school location-based discovery' },
              ].map(t => (
                <div key={t.name} className="flex items-start gap-2.5 p-3 bg-neutral-50 border border-neutral-200">
                  {t.icon}
                  <div>
                    <p className="text-xs font-semibold text-primary-700">{t.name}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Additional Libraries */}
        <Accordion icon={<Library size={16} />} title="Additional Libraries Utilized">
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              {[
                { lib: 'next/image', desc: 'Optimized image component for Next.js applications.' },
                { lib: 'next/link', desc: 'Client-side navigation component for Next.js.' },
                { lib: 'react', desc: 'A library for building user interfaces.' },
                { lib: 'react-map-gl/maplibre', desc: 'React bindings for MapLibre GL map rendering.' },
                { lib: 'maplibre-gl', desc: 'Open-source map rendering engine for vector tiles.' },
              ].map(l => (
                <li key={l.lib} className="flex items-start gap-2">
                  <span className="text-secondary-500 mt-1">•</span>
                  <span className="text-sm"><code className="bg-neutral-100 px-2 py-0.5 text-xs">{l.lib}</code> : {l.desc}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {[
                { lib: 'typescript', desc: 'Typed superset of JavaScript for better developer experience.' },
                { lib: 'tailwindcss', desc: 'Utility-first CSS framework for rapid UI development.' },
                { lib: 'postcss', desc: 'Tool for transforming CSS with JavaScript plugins.' },
                { lib: 'lucide-react', desc: 'Beautiful & consistent icon library (ISC License).' },
                { lib: '@supabase/supabase-js', desc: 'JavaScript client for Supabase authentication & database.' },
              ].map(l => (
                <li key={l.lib} className="flex items-start gap-2">
                  <span className="text-secondary-500 mt-1">•</span>
                  <span className="text-sm"><code className="bg-neutral-100 px-2 py-0.5 text-xs">{l.lib}</code> : {l.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </Accordion>

        {/* Data Architecture */}
        <Accordion icon={<Server size={16} />} title="Data Architecture & Persistence">
          <div className="mt-3 space-y-3">
            <p className="text-xs text-neutral-600 leading-relaxed">ClubConnect uses a <strong>three-tier data strategy</strong> to balance functionality with demonstration.</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-3 border border-emerald-200 bg-emerald-50/50">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">🟢 Database (Supabase PostgreSQL)</p>
                <ul className="space-y-1 text-[11px] text-neutral-700">
                  <li>• Authentication & user sessions</li>
                  <li>• User profiles (avatar, bio, grade)</li>
                  <li>• Community uploads & likes</li>
                  <li>• Hub Discussions, Ideas, Mentors, Stories</li>
                  <li>• Stripe donation checkout sessions</li>
                </ul>
              </div>
              <div className="p-3 border border-blue-200 bg-blue-50/50">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2">🔵 Local Storage (Browser)</p>
                <ul className="space-y-1 text-[11px] text-neutral-700">
                  <li>• Goal Tracker, Club Management</li>
                  <li>• Club Finder Quiz results</li>
                  <li>• Student Lounge chat</li>
                </ul>
              </div>
              <div className="p-3 border border-purple-200 bg-purple-50/50">
                <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-2">🟣 UI-Only (Functional Display)</p>
                <ul className="space-y-1 text-[11px] text-neutral-700">
                  <li>• Competitions, Achievements, Rubrics</li>
                  <li>• Homepage, Directory, Calendar</li>
                  <li>• Resource downloads, AI chat agents</li>
                </ul>
              </div>
            </div>
          </div>
        </Accordion>

        {/* Feature Walkthrough (from Judge's Guide) */}
        <Accordion icon={<Wrench size={16} />} title="Feature Walkthrough">
          <div className="mt-3 space-y-3">
            {[
              { title: 'Homepage & Landing', items: ['Hero banner with stats grid and CTA buttons', 'Live counters for Active Clubs, Students Served, Upcoming Events, Service Hours', 'Featured Clubs Carousel with ratings and member counts', 'Quick Access grid linking to Directory, Resources, Start a Club, Mentors, Events', 'Announcements feed and upcoming events'] },
              { title: 'Club Discovery & Directory', items: ['Searchable directory of 25+ clubs with real-time filtering', 'Filter by day, time, category, grade level, meeting schedule', 'Interactive 3D MapLibre map with multi-school markers and fly-to', 'Individual club profile pages with Overview, Statistics, Events, Projects, History, Notes, Discussion tabs', 'Club Finder Quiz for personalized recommendations'] },
              { title: 'Resource Library & Guides', items: ['20+ downloadable resources organized in a 5-stage rocket launch system', 'PDF preview with embedded viewer before download', 'Search and filter by type, format, and stage', 'Guides index with categorized how-to articles'] },
              { title: 'Events & Calendar', items: ['Full events calendar with monthly view and type filtering', 'Event detail pages with comments, resources, and sharing', 'RSVP system with attendee tracking', 'Event creation form for club officers'] },
              { title: 'Student Community & Social', items: ['LinkedIn-inspired 3-column community feed with threaded replies', 'File uploads for sharing guides, templates, and resources', 'Real-time chat and discussion threads', 'Collaboration platform for clubs to find project partners'] },
              { title: 'Club Creation & Management', items: ['5-step Club Creation Wizard with guided form and constitution editor', 'Logo uploader, poster designer, and advisor requirement info', 'Club Management Dashboard for editing drafts and configuring social links', 'Club Health Dashboard with membership trends and recommendations'] },
              { title: 'Mentorship & Alumni', items: ['Mentor profiles with expertise, availability, ratings', '1-on-1 mentoring, resume review, mock interviews, career guidance', 'Alumni network with career paths, testimonials, and messaging'] },
              { title: 'Funding & Donations', items: ['Stripe-powered donation system with secure checkout', 'Club-specific fundraising pages with progress bars', 'School-wide analytics dashboard with animated counters'] },
              { title: 'Communication & Video Calls', items: ['Video conference rooms with mic/camera controls', 'Built-in whiteboard for collaborative drawing', 'Notification center with event, mention, and achievement alerts'] },
              { title: 'Authentication & Profiles', items: ['Supabase-powered login/signup with email/password', 'User profiles with avatar upload, bio, grade, and school info', 'Personal dashboard with joined clubs, activity feed, and notifications'] },
            ].map(section => (
              <div key={section.title} className="border border-neutral-100 p-3">
                <p className="text-xs font-bold text-primary-700 mb-1.5">{section.title}</p>
                <ul className="space-y-1">
                  {section.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-neutral-700">
                      <CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Accordion>

        {/* Accessibility, Safety & Legal */}
        <Accordion icon={<Shield size={16} />} title="Accessibility, Safety & Legal">
          <ul className="mt-3 space-y-1.5">
            {[
              'WCAG 2.1 AA/AAA compliant contrast ratios throughout the design',
              'Keyboard navigation support and alt text on all images',
              'Safety Guidelines with emergency contacts, anti-bullying policy, and crisis resources',
              'Privacy Policy with COPPA/FERPA compliance, Terms of Use, and data handling info',
              'FAQ page with searchable, categorized questions and expandable answers',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs text-neutral-700">
                <CheckCircle size={11} className="text-green-600 mt-0.5 shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Webmaster Rubric */}
        <Accordion icon={<Code2 size={16} />} title="TSA Webmaster Rubric — Exemplary Scoring">
          <div className="mt-3 space-y-3">
            <p className="text-xs text-neutral-600">This shows the maximum (exemplary) score for each rubric category so teams can aim for the highest possible rating.</p>
            <div className="space-y-2">
              {[
                { name: 'Theme (X2)', max: 10 },
                { name: 'Challenge (X3)', max: 10 },
                { name: 'Content (X2)', max: 10 },
                { name: 'Layout & Navigation (X2)', max: 10 },
                { name: 'Graphics & Color Scheme (X2)', max: 10 },
                { name: 'Function & Compatibility (X1)', max: 10 },
                { name: 'Spelling & Grammar (X1)', max: 10 },
              ].map(c => (
                <div key={c.name} className="flex justify-between items-center p-2 bg-neutral-50 border border-neutral-100">
                  <div>
                    <p className="text-xs font-semibold text-primary-700">{c.name}</p>
                    <p className="text-[10px] text-neutral-500">Exemplary performance — aim for clear, polished, and complete work.</p>
                  </div>
                  <p className="text-sm font-bold text-green-700 shrink-0">{c.max} / 10</p>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 pt-2 text-xs text-neutral-600">
              <strong>Preliminary Website (subtotal):</strong> 70 / 70 (130 weighted)
            </div>
          </div>
        </Accordion>

        {/* Image Links */}
        <Accordion icon={<ImageIcon size={16} />} title="Image Sources & Attributions">
          <div className="mt-3">
            <p className="text-xs text-neutral-600 mb-3">
              All images rely on the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-semibold">Unsplash License</a>, which allows free use for commercial and non-commercial purposes.
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {imageLinks.map((image, index) => (
                <div key={index} className="border border-neutral-200 p-2.5 bg-neutral-50">
                  <a href={image.url.split('?')[0]} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-xs break-all">
                    {image.url.split('?')[0]}
                  </a>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{image.description} — Used on: {image.page}</p>
                </div>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Student Work Declaration */}
        <div className="p-4 bg-primary-50 border border-primary-200">
          <p className="text-xs text-primary-700"><strong>Student Work Declaration:</strong> All code, design, and content was created by the JHSTSA Webmaster team. No copyrighted material was used without proper licensing.</p>
        </div>

        <div className="text-center py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
