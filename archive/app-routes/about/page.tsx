"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import Head from 'next/head';

const PARTNERS = [
  { id: 'state-tsa', name: 'State TSA', src: '/partners/state-tsa.svg' },
  { id: 'local-library', name: 'Local Library', src: '/partners/local-library.svg' },
  { id: 'city-bank', name: 'City Bank', src: '/partners/city-bank.svg' },
  { id: 'techco', name: 'TechCo', src: '/partners/techco.svg' },
  { id: 'arts-guild', name: 'Arts Guild', src: '/partners/arts-guild.svg' },
  { id: 'university', name: 'University Partner', src: '/partners/university-partner.svg' },
];

export default function AboutPage() {
  useEffect(() => {
    // Lightweight scroll animator (replaces AOS)
    const animClass = (name: string) => {
      switch (name) {
        case 'slide-left':
          return 'animate-slide-in-left';
        case 'slide-right':
          return 'animate-slide-in-right';
        case 'zoom-in':
          return 'animate-zoom-in';
        case 'flip-left':
          return 'animate-flip-left';
        default:
          return 'animate-fade-up';
      }
    };

    const els = Array.from(document.querySelectorAll('[data-animate]')) as Element[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const name = entry.target.getAttribute('data-animate') || 'fade-up';
          entry.target.classList.add(animClass(name));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>About — ClubConnect</title>
      </Head>
      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="grid lg:grid-cols-2 gap-10 items-center mb-12" data-animate="fade-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">About ClubConnect</h1>
            <p className="mt-4 text-lg text-neutral-700 max-w-prose">ClubConnect is a modern hub designed to help student chapters organize, collaborate, and shine. We combine simple tools for meetings, events, and resources with privacy-first defaults and partner integrations that amplify student leadership.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/propose" className="btn-primary" data-animate="slide-right">Propose a chapter</Link>
              <Link href="/directory" className="btn-outline" data-animate="slide-right" data-delay="150">Browse directory</Link>
              <Link href="/meetings" className="btn-outline" data-animate="slide-right" data-delay="300">Manage meetings</Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 rounded-lg text-center card-hover" data-animate="zoom-in">
                <div className="text-2xl font-semibold">72</div>
                <div className="text-xs text-neutral-500">Active chapters</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg text-center card-hover" data-animate="zoom-in">
                <div className="text-2xl font-semibold">18</div>
                <div className="text-xs text-neutral-500">Partners</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg text-center card-hover" data-animate="zoom-in">
                <div className="text-2xl font-semibold">1.2k</div>
                <div className="text-xs text-neutral-500">Active members</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg" data-aos="fade-left">
            <div className="relative w-full h-72 md:h-80">
              <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80" alt="students collaborating" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2" data-animate="fade-up">
            <h2 className="text-2xl font-semibold mb-4">Mission & Values</h2>
            <p className="text-neutral-600 mb-4">We empower student leaders with practical tools — scheduling, shared resources, and simple collaboration — so chapters can focus on impact. ClubConnect is built for reliability, clarity, and inclusivity.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg card-hover" data-animate="flip-left">
                <h3 className="font-semibold">Accessible tools</h3>
                <p className="text-sm text-neutral-500">Fast, mobile-friendly experiences for officers and members.</p>
              </div>

              <div className="p-4 border rounded-lg card-hover" data-animate="flip-left">
                <h3 className="font-semibold">Partner network</h3>
                <p className="text-sm text-neutral-500">Local and institutional partners support programming and funding.</p>
              </div>

              <div className="p-4 border rounded-lg card-hover" data-animate="flip-left">
                <h3 className="font-semibold">Privacy-first</h3>
                <p className="text-sm text-neutral-500">Student data stays within the chapter unless explicitly shared.</p>
              </div>

              <div className="p-4 border rounded-lg card-hover" data-animate="flip-left">
                <h3 className="font-semibold">No database required</h3>
                <p className="text-sm text-neutral-500">Demo flows and local saves work offline using browser storage.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-4" data-animate="fade-up">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h4 className="font-semibold">Key Features</h4>
              <ul className="mt-2 text-sm text-neutral-600 space-y-2">
                <li>Chapter directory & officer contacts</li>
                <li>Events, RSVP, and calendar sync</li>
                <li>Meetings with full-screen branded calls</li>
                <li>Resources library & templates</li>
              </ul>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg text-center">
              <div className="text-sm text-neutral-600">Want a quick demo?</div>
              <Link href="/profile/demo" className="mt-3 inline-block btn-outline">Open demo profile</Link>
            </div>
          </aside>
        </section>

        <section id="partners" className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">Partners</h2>
          <p className="text-neutral-600 mb-4">We work with schools, libraries, and local organizations to expand opportunities for student chapters.</p>

          <div className="overflow-hidden">
            <div className="marquee bg-neutral-50 p-4 rounded-lg" data-aos="fade-left">
              <div className="marquee-track">
                {PARTNERS.concat(PARTNERS).map((p, i) => (
                  <div key={`${p.id}-${i}`} className="marquee-item" role="img" aria-label={p.name}>
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Image src={p.src} alt={p.name} width={48} height={48} />
                    </div>
                    <div className="ml-2 text-sm text-neutral-700">{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {PARTNERS.map((p) => (
              <div key={p.id} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Image src={p.src} alt={p.name} width={64} height={64} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-neutral-500">Supporting student leadership, events, and mentorship.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
