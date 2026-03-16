"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight, Award, BookOpen, Bot, Brain, Calendar, ChevronDown,
  Compass, GraduationCap, HelpCircle, Lightbulb, MessageCircle,
  Rocket, Search, Send, Shield, Sparkles, Star, Target, Trophy,
  Users, X, Zap,
} from "lucide-react";

/* ---- Gemini AI Chat ---- */
const GEMINI_KEY = "AIzaSyA7_t94hTmqEa1anx_AkID9ChvrBM16SW8";

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

const SYSTEM_PROMPT = `You are the ClubConnect Guidance AI — a friendly, knowledgeable assistant embedded in a school community resource hub. You help students with:
- Finding and joining clubs/organizations
- Starting new clubs (constitution, advisor, approval process)
- Event planning and fundraising
- Leadership skills and officer roles
- Competition preparation (TSA, DECA, Science Olympiad, etc.)
- College applications related to extracurriculars
- Connecting with mentors and community resources
Keep answers concise (2-4 sentences) and encouraging. Reference ClubConnect features when relevant (directory, resources, mentors, events).`;

const SUGGESTED_QUESTIONS = [
  "How do I start a new club at my school?",
  "What competitions can I participate in?",
  "How do I find a mentor for my career interests?",
  "What leadership skills should I develop?",
  "How do I write a club constitution?",
  "What fundraising ideas work for school clubs?",
];

const FAQ_ITEMS = [
  { q: "How do I join a club?", a: "Browse the Club Directory to find organizations that interest you. Each club page has a 'Join' button and contact info for the club officers. You can also take our Club Finder Quiz to get personalized recommendations!" },
  { q: "What do I need to start a club?", a: "You need: (1) A club idea and mission, (2) A faculty advisor, (3) At least 5 interested members, (4) A written constitution, and (5) School approval. Our Start a Club wizard walks you through every step." },
  { q: "How does the mentor program work?", a: "Our Mentor Network connects students with experienced professionals and alumni. Browse mentors by field, request a session, and meet regularly for guidance on academics, careers, and projects." },
  { q: "Where do I find resources and templates?", a: "The Resource Library has guides, templates, and tools organized by your club's growth stage — from Ignition (getting started) to Expansion (events & competitions)." },
  { q: "How do I organize a club event?", a: "Use our Events page to create and publish events. The Event Planning Toolkit in Resources has checklists, and your club dashboard has tools for RSVPs, reminders, and more." },
  { q: "What competitions are available?", a: "Check the Competitions Hub for TSA, DECA, Science Olympiad, FBLA, debate tournaments, and more. Each listing has deadlines, requirements, and prep resources." },
];

const PATHWAYS = [
  { title: "Find a Club", desc: "Browse the directory with AI-powered recommendations", href: "/directory", icon: Compass, color: "bg-blue-100 text-blue-700" },
  { title: "Start a Club", desc: "Step-by-step wizard with templates and tools", href: "/start-a-club", icon: Rocket, color: "bg-orange-100 text-orange-700" },
  { title: "Resource Library", desc: "Guides, templates, and handbooks by stage", href: "/resources", icon: BookOpen, color: "bg-purple-100 text-purple-700" },
  { title: "Mentor Network", desc: "Connect with professionals and alumni", href: "/hub/mentors", icon: GraduationCap, color: "bg-teal-100 text-teal-700" },
  { title: "Events & Programs", desc: "Upcoming events, RSVP, and calendar", href: "/events", icon: Calendar, color: "bg-green-100 text-green-700" },
  { title: "Competitions Hub", desc: "TSA, DECA, Science Olympiad & more", href: "/hub/competitions", icon: Trophy, color: "bg-red-100 text-red-700" },
  { title: "Club Finder Quiz", desc: "Personalized club recommendations", href: "/hub/quiz", icon: Target, color: "bg-amber-100 text-amber-700" },
  { title: "Discussion Forum", desc: "Connect and collaborate with peers", href: "/hub/discussions", icon: MessageCircle, color: "bg-pink-100 text-pink-700" },
];

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

export default function GuidancePage() {
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMsg = { role: "user", text: text.trim() };
    setChat(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...chat, userMsg].map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: history,
          }),
        }
      );
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that. Please try again!";
      setChat(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setChat(prev => [...prev, { role: "assistant", text: "Connection issue — please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }, [chat, loading]);

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white border-b-4 border-secondary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-8">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14  bg-white/10 flex items-center justify-center"><Brain size={28} /></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold">Guidance Center</h1>
                <p className="text-primary-200 text-sm mt-1">AI-Powered Student Assistant &middot; Gemini 2.0 Flash</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-4 text-center">
              {[{ v: "24/7", l: "AI" }, { v: "6+", l: "Mentors" }, { v: "30+", l: "Resources" }, { v: "8", l: "Pathways" }].map(s => (
                <div key={s.l} className="bg-white/10  px-5 py-3">
                  <p className="text-lg font-bold leading-tight">{s.v}</p>
                  <p className="text-xs text-primary-200">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
        {/* Pathways Grid */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {PATHWAYS.map(p => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href} className="card p-4 text-center group hover:border-primary-300 transition-all">
                <div className={`w-12 h-12  mx-auto mb-2 flex items-center justify-center ${p.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs font-semibold text-primary-700 leading-tight">{p.title}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* AI Chat Panel */}
          <div className="lg:col-span-3">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100 bg-primary-50/50 flex items-center gap-3">
                <div className="w-12 h-12  bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white"><Bot size={22} /></div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-primary-800 text-base">ClubConnect AI Agent</h2>
                  <p className="text-xs text-neutral-500 truncate">Ask about clubs, events, mentors, competitions, resources</p>
                </div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" /><span className="text-xs text-green-600 font-medium">Online</span></div>
              </div>
              <div ref={scrollRef} className="h-[480px] overflow-y-auto p-5 space-y-3 bg-neutral-50/30">
                {chat.length === 0 && (
                  <div className="text-center py-10">
                    <Sparkles size={40} className="mx-auto text-primary-300 mb-3" />
                    <p className="font-bold text-primary-700 text-lg">Welcome! Ask me anything.</p>
                    <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">Clubs, events, mentors, competitions, leadership — I&rsquo;m here to help.</p>
                    <div className="mt-5 grid grid-cols-2 gap-2.5 max-w-lg mx-auto">
                      {SUGGESTED_QUESTIONS.slice(0, 4).map(q => (
                        <button key={q} onClick={() => sendMessage(q)}
                          className="text-sm px-4 py-3  border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors text-left leading-snug">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-3  text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-primary-600 text-white rounded-br-sm"
                      : "bg-white border border-neutral-200 text-neutral-700 rounded-bl-sm shadow-sm"
                    }`}>
                      {msg.role === "assistant" && <Bot size={14} className="inline mr-1.5 text-primary-400" />}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-neutral-200  rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-5 py-4 border-t border-neutral-100 bg-white">
                <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
                  <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Ask about clubs, events, mentors..."
                    className="input-field flex-1 text-sm py-3" disabled={loading} />
                  <button type="submit" disabled={loading || !input.trim()}
                    className="btn-primary px-5 py-3 flex items-center gap-2 text-sm disabled:opacity-50"><Send size={16} /> Send</button>
                </form>
                {chat.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.slice(chat.length % 3, chat.length % 3 + 3).map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="text-xs px-3 py-1.5 rounded border border-neutral-200 text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">{q}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar — FAQ + extras */}
          <div className="lg:col-span-2 space-y-5">
            {/* FAQ */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 bg-primary-50/50 border-b border-neutral-100">
                <h3 className="font-bold text-primary-800 text-base flex items-center gap-2"><HelpCircle size={18} className="text-secondary-500" /> FAQ</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {FAQ_ITEMS.map((faq, i) => (
                  <div key={i}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full px-5 py-3 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <span className="font-semibold text-primary-700 text-sm leading-snug pr-3">{faq.q}</span>
                      <ChevronDown size={16} className={`text-neutral-400 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-3 text-sm text-neutral-600 leading-relaxed animate-fade-up">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="card p-5">
              <h3 className="font-bold text-primary-800 text-base mb-3 flex items-center gap-2"><Shield size={16} className="text-primary-500" /> Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["Starting a club", "TSA prep", "Fundraising", "College apps", "Leadership", "Event planning", "Mentor sessions", "Constitution", "Elections", "Service hours"].map(tag => (
                  <button key={tag} onClick={() => sendMessage(`Tell me about ${tag.toLowerCase()}`)}
                    className="text-xs px-3 py-1.5  bg-primary-50 text-primary-600 border border-primary-100 hover:bg-primary-100 transition-colors">{tag}</button>
                ))}
              </div>
            </div>

            {/* Mentor CTA */}
            <div className="card p-5 bg-gradient-to-br from-secondary-50 to-primary-50/30 border-secondary-200">
              <h3 className="font-bold text-primary-800 text-base mb-2 flex items-center gap-2"><GraduationCap size={18} className="text-secondary-600" /> Need a Mentor?</h3>
              <p className="text-sm text-neutral-600 mb-3">Connect with professionals in STEM, arts, business &amp; more.</p>
              <Link href="/hub/mentors" className="btn-primary text-sm px-5 py-2.5 w-full flex items-center justify-center gap-2"><Award size={16} /> Browse Mentors</Link>
            </div>

            {/* More Resources */}
            <div className="card p-5">
              <h3 className="font-bold text-primary-800 text-base mb-3">More Resources</h3>
              <div className="space-y-3">
                {[
                  { href: "/resources", label: "Resource Library", icon: BookOpen },
                  { href: "/hub/discussions", label: "Discussion Forum", icon: MessageCircle },
                  { href: "/hub/quiz", label: "Club Finder Quiz", icon: Target },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline">
                    <l.icon size={16} /> {l.label} <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
