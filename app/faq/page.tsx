"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { faqData, guidesData } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import { BookOpen, ChevronDown, HelpCircle, Search } from "lucide-react";

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

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const categories = ["All", ...Array.from(new Set(faqData.map(f => f.category)))];

  const filtered = faqData.filter(f => {
    if (activeCategory !== "All" && f.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="relative">
      <div className="relative z-0 bg-neutral-100 min-h-screen">
        <HeroSection
          eyebrow="Help Center"
          title="Frequently Asked Questions"
          description={<>Get fast answers to the <strong className="text-secondary-700 font-bold">most common questions</strong> about joining clubs, submitting events, managing your membership, and using platform features. Still stuck? <strong className="text-primary-700 font-semibold">Ask us directly</strong> from the search box below.</>}
          texture="diagonal"
      >
        <div className="mt-6 relative max-w-xl">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-0 bg-white py-3 pl-10 pr-4 text-neutral-800 placeholder-neutral-400 focus:ring-2 focus:ring-secondary-400"
          />
        </div>
      </HeroSection>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[260px_1fr] gap-6">
        {}
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2"><HelpCircle size={18} /> Categories</h2>
            <div className="mt-3 space-y-1">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2  text-sm font-medium transition-colors ${activeCategory === cat ? "bg-primary-500 text-white" : "text-neutral-700 hover:bg-primary-50"}`}>
                  {cat}
                  <span className="float-right text-xs opacity-60">
                    {cat === "All" ? faqData.length : faqData.filter(f => f.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2"><BookOpen size={18} /> Guides</h2>
            <div className="mt-3 space-y-2">
              {guidesData.map(g => (
                <Link key={g.id} href={`/guides/${g.slug}`} className="block text-sm text-primary-600 hover:underline p-2  hover:bg-primary-50 transition-colors">
                  {g.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-br from-primary-50 to-secondary-50">
            <h3 className="font-bold text-primary-700">Still have questions?</h3>
            <p className="text-sm text-neutral-600 mt-1">Contact the Activities Office for help.</p>
            <Link href="/faq" className="btn-primary text-sm mt-3 w-full text-center block">Browse FAQ</Link>
          </div>
        </aside>

        {}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600">{filtered.length} question{filtered.length !== 1 ? "s" : ""} found</p>
            <button onClick={() => setOpenIds(new Set(filtered.map(f => f.id)))} className="text-xs text-primary-600 hover:underline font-semibold">Expand All</button>
          </div>

          {filtered.length === 0 ? (
            <div className="card p-8 text-center">
              <HelpCircle size={40} className="mx-auto text-neutral-300" />
              <p className="mt-3 text-neutral-500">No questions match your search. Try different keywords.</p>
            </div>
          ) : (
            filtered.map(faq => (
              <Reveal key={faq.id}>
                <div className="card overflow-hidden">
                  <button onClick={() => toggle(faq.id)} className="w-full flex items-start justify-between p-5 text-left hover:bg-primary-50/30 transition-colors">
                    <div className="flex-1 pr-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">{faq.category}</span>
                      <h3 className="font-bold text-primary-800 mt-2">{faq.question}</h3>
                    </div>
                    <ChevronDown size={18} className={`text-neutral-400 shrink-0 mt-2 transition-transform ${openIds.has(faq.id) ? "rotate-180" : ""}`} />
                  </button>
                  {openIds.has(faq.id) && (
                    <div className="px-5 pb-5 border-t border-neutral-100">
                      <p className="text-sm text-neutral-700 leading-relaxed mt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

