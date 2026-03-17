"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { safetyGuidelines } from "@/lib/data";
import { AlertTriangle, BookOpen, CheckCircle, Heart, Phone, Shield, Users } from "lucide-react";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
}

const EMERGENCY_CONTACTS = [
  { name: "School Main Office", phone: "(425) 936-1600", hours: "7:30 AM – 4:00 PM" },
  { name: "School Counseling", phone: "(425) 936-1610", hours: "7:30 AM – 3:30 PM" },
  { name: "Activities Office", phone: "(425) 936-1620", hours: "8:00 AM – 4:00 PM" },
  { name: "Crisis Text Line", phone: "Text HOME to 741741", hours: "24/7" },
  { name: "National Suicide Prevention Lifeline", phone: "988", hours: "24/7" },
];

const POLICIES = [
  { title: "Anti-Bullying Policy", desc: "All club activities must be free from bullying, harassment, and intimidation. Report incidents to your advisor or the Activities Office." },
  { title: "Inclusion & Non-Discrimination", desc: "Clubs must welcome all students regardless of race, gender, religion, sexual orientation, disability, or socioeconomic status." },
  { title: "Financial Transparency", desc: "All club funds must be processed through the school's accounting system. Regular financial reports are required." },
  { title: "Social Media Guidelines", desc: "Club social media accounts must be supervised by the faculty advisor. No posting of student photos without written consent." },
  { title: "Field Trip & Off-Campus Safety", desc: "All off-campus activities require signed permission forms, faculty supervision, and approval from administration." },
  { title: "Meeting Room Safety", desc: "A faculty advisor must be present at all meetings. Emergency exits must be identified. Maximum occupancy must be respected." },
];

export default function SafetyPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-700 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs sm:text-sm uppercase tracking-[0.12em] font-semibold text-red-200">Student Wellbeing</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><Shield size={40} /> Safety & Guidelines</h1>
          <p className="mt-3 max-w-2xl text-red-100 text-lg">Your safety is our top priority. Review safety guidelines, emergency contacts, and school policies for all club activities.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {}
          <div className="card p-6 border-2 border-red-200 bg-gradient-to-br from-red-50/60 to-white">
            <h2 className="text-xl font-heading font-bold text-red-700 flex items-center gap-2"><AlertTriangle size={20} /> Emergency Contacts</h2>
            <div className="mt-4 space-y-3">
              {EMERGENCY_CONTACTS.map(c => (
                <div key={c.name} className="flex items-center justify-between bg-white border border-red-100  p-4 ux-hover-lift-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  bg-red-50 text-red-600 flex items-center justify-center"><Phone size={16} /></div>
                    <div>
                      <p className="font-bold text-neutral-800 text-sm">{c.name}</p>
                      <p className="text-xs text-neutral-500">{c.hours}</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-700 text-sm">{c.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {}
          <Reveal>
            <div className="card p-6">
              <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2"><Shield size={18} /> Safety Guidelines</h2>
              <div className="mt-4 space-y-3">
                {safetyGuidelines.map((g, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-primary-50/30 border border-primary-100  ux-hover-lift-sm">
                    <div className="w-8 h-8  bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-sm font-bold">{i + 1}</div>
                    <div>
                      <h3 className="font-bold text-primary-800 text-sm">{g.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{g.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {}
          <Reveal>
            <div className="card p-6">
              <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2"><BookOpen size={18} /> Club Policies</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {POLICIES.map(p => (
                  <div key={p.title} className="border border-neutral-200  p-4 ux-hover-lift-sm">
                    <h3 className="font-bold text-primary-700 text-sm flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> {p.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {}
        <aside className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-red-50 to-white border-red-100">
            <h3 className="font-bold text-red-700 flex items-center gap-2"><AlertTriangle size={16} /> Report a Concern</h3>
            <p className="text-sm text-neutral-600 mt-2">If you witness or experience any safety issue, report it immediately.</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm"><span className="font-semibold">In person:</span> Activities Office, Room 108</p>
              <p className="text-sm"><span className="font-semibold">Email:</span> safety@jhstsa.edu</p>
              <p className="text-sm"><span className="font-semibold">Anonymous:</span> School reporting system</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-primary-700 flex items-center gap-2"><Heart size={16} /> Mental Health Resources</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p>School counselors are available during school hours for confidential support.</p>
              <p className="font-semibold text-primary-600">Crisis Text Line: Text HOME to 741741</p>
              <p className="font-semibold text-primary-600">988 Suicide & Crisis Lifeline: Call or text 988</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-primary-700 flex items-center gap-2"><Users size={16} /> Advisor Responsibilities</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> Present at all club meetings and events</li>
              <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> Approve all activities and spending</li>
              <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> Ensure compliance with school policies</li>
              <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> Report safety concerns to administration</li>
              <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> Maintain updated emergency contact info</li>
            </ul>
          </div>

          <div className="card p-5 bg-gradient-to-br from-primary-50 to-secondary-50">
            <h3 className="font-bold text-primary-700">Related Resources</h3>
            <div className="mt-3 space-y-2">
              <Link href="/faq" className="block text-sm text-primary-600 hover:underline">FAQ →</Link>
              <Link href="/guides/leadership" className="block text-sm text-primary-600 hover:underline">Leadership Guide →</Link>
              <Link href="/resources" className="block text-sm text-primary-600 hover:underline">Resources Library →</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
