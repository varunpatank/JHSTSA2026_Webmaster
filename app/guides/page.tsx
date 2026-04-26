"use client";

import Link from "next/link";
import { guidesData } from "@/lib/data";
import { ArrowRight, BookOpen, Clock, FileText } from "lucide-react";
import HeroSection from "@/components/HeroSection";

export default function GuidesIndexPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 bg-neutral-100 min-h-screen">
        <HeroSection
        eyebrow="Resources"
        title="Guides & Handbooks"
        description="Step-by-step guides to help you navigate club life - from joining your first club to leading an organization."
        images={[
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=75",
        ]}
        texture="diagonal"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-2 gap-6">
          {guidesData.map(guide => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="card p-6 hover:border-primary-300 ux-hover-lift group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12  bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors"><BookOpen size={22} /></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">{guide.category}</span>
                  <h2 className="font-bold text-primary-800 mt-2 text-lg">{guide.title}</h2>
                  <p className="text-sm text-neutral-600 mt-1">{guide.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><FileText size={12} /> {guide.sections.length} sections</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {guide.sections.length * 3} min read</span>
                  </div>
                  <span className="mt-3 text-sm font-semibold text-primary-600 flex items-center gap-1 group-hover:underline">Read Guide <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 card p-6 bg-primary-600 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.15) 18px, rgba(255,255,255,0.15) 19px)" }} />
          <h2 className="text-xl font-heading font-bold relative z-10">Need Help?</h2>
          <p className="text-primary-100 mt-2 relative z-10">Check our FAQ or ask our AI assistant for personalised help.</p>
          <div className="mt-4 flex justify-center gap-3 relative z-10">
            <Link href="/faq" className="btn-secondary">View FAQ</Link>
            <Link href="/explore#chatbot" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500">AI Assistant</Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
