"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  GraduationCap,
  HelpCircle,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { chapters, events, quizQuestions, featuredAlumni, careerPanels } from "@/lib/data";
import { formatChapterLocation, getPrimaryLocation } from "@/lib/location";
import { clubProposalsApi, myClubsApi } from "@/lib/api";
import { Rocket } from "lucide-react";
import HeroSection from "@/components/HeroSection";

const interestToCategory: Record<string, string> = {
  "Academic competitions": "Academic",
  "Creative arts": "Arts",
  "Community service": "Service",
  "Technology & Engineering": "STEM",
  "Sports & Recreation": "Sports",
};
type TabKey = "chatbot" | "alumni" | "discussions" | "resources" | "proposals";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "proposals", label: "New Clubs", icon: Rocket },
  { key: "chatbot", label: "AI Assistant", icon: Bot },
  { key: "alumni", label: "Alumni Network", icon: GraduationCap },
  { key: "discussions", label: "Discussions", icon: MessageSquare },
  { key: "resources", label: "Resources", icon: BookOpen },
];

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("proposals");
  const [search, setSearch] = useState("");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi! I'm the ClubConnect AI assistant. Ask me anything about clubs, events, resources, or how to get involved!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [discussionInput, setDiscussionInput] = useState("");
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [publishedClubs, setPublishedClubs] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState([
    { id: 1, author: "James C.", title: "Best way to recruit freshmen?", replies: 3, time: "2 hours ago" },
    { id: 2, author: "Maria S.", title: "Spring fundraiser ideas needed", replies: 7, time: "5 hours ago" },
    { id: 3, author: "Alex J.", title: "How to handle officer transitions", replies: 5, time: "1 day ago" },
    { id: 4, author: "Sierra W.", title: "Community service hour tracking tips", replies: 2, time: "2 days ago" },
  ]);
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabKey;
    if (tabs.some((t) => t.key === hash)) setActiveTab(hash);
  }, []);
  useEffect(() => {
    if (activeTab === "proposals" && proposals.length === 0 && !proposalsLoading) {
      setProposalsLoading(true);
      Promise.all([
        clubProposalsApi.getAll(),
        myClubsApi.getDirectory(),
      ]).then(([propRes, clubRes]) => {
        if (propRes.data) setProposals(propRes.data as any[]);
        if (clubRes.data) setPublishedClubs(clubRes.data as any[]);
      }).finally(() => setProposalsLoading(false));
    }
  }, [activeTab]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
  const filteredChapters = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return chapters.slice(0, 8);
    return chapters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [search]);
  const quizRecommendations = useMemo(() => {
    if (!quizDone || quizAnswers.length === 0) return [];
    const preferredCategory = interestToCategory[quizAnswers[0]] || "";
    const preferredFrequency = quizAnswers[1] || "";
    const preferredTime = quizAnswers[2] || "";

    return chapters
      .map((c) => {
        let score = 0;
        if (c.category === preferredCategory) score += 3;
        if (c.meetingFrequency === preferredFrequency) score += 2;
        if (c.meetingTime.toLowerCase() === preferredTime.toLowerCase()) score += 1;
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [quizDone, quizAnswers]);

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (quizStep + 1 >= quizQuestions.length) {
      setQuizDone(true);
    } else {
      setQuizStep(quizStep + 1);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizDone(false);
  };
  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setChatLoading(true);

    try {
      const clubSummary = chapters
        .map((c) => `${c.name} (${c.category}) - ${c.meetingSchedule}, ${getPrimaryLocation(c.meetingLocation)}`)
        .join("\n");

      const systemPrompt = `You are a helpful assistant for ClubConnect, a school community hub for Juanita High School. You help students find clubs, learn about events, and get involved. Here are the available clubs:\n${clubSummary}\n\nBe concise, friendly, and always encourage students to explore. If they ask about something you don't know, guide them to the relevant page on ClubConnect.`;

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

      const conversationHistory: { role: string; parts: { text: string }[] }[] = [];
      conversationHistory.push({ role: "user", parts: [{ text: systemPrompt }] });
      conversationHistory.push({ role: "model", parts: [{ text: "I understand! I'm the ClubConnect AI assistant for Juanita High School. How can I help you today?" }] });
      for (const msg of chatMessages) {
        if (msg.role === "user") {
          conversationHistory.push({ role: "user", parts: [{ text: msg.text }] });
        } else {
          conversationHistory.push({ role: "model", parts: [{ text: msg.text }] });
        }
      }
      conversationHistory.push({ role: "user", parts: [{ text }] });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: conversationHistory }),
        }
      );
      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that. Try asking something else!";
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Oops, something went wrong. Please try again!" },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <HeroSection
        eyebrow="Guidance"
        title="Guidance & Support"
        description="Get AI-powered club recommendations, connect with alumni mentors, access career panels, and join community discussions."
      >
        <div className="mt-6 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search clubs, events, or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-transparent bg-white py-3 pl-10 pr-4 text-neutral-800 placeholder:text-neutral-400 focus:border-secondary-500 focus:outline-none"
          />
        </div>
      </HeroSection>

      {}
      {search.trim() && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-primary-700">
              Search Results ({filteredChapters.length})
            </h2>
            <button onClick={() => setSearch("")} className="text-sm text-neutral-500 hover:text-primary-600 flex items-center gap-1">
              <X size={14} /> Clear
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChapters.map((chapter) => (
              <Link key={chapter.id} href={`/directory/${chapter.id}`} className="card-hover p-5 bg-white ux-hover-lift-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge badge-primary text-xs">{chapter.category}</span>
                  <span className="text-xs text-neutral-500">{chapter.memberCount} members</span>
                </div>
                <h3 className="font-bold text-primary-700">{chapter.name}</h3>
                <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{chapter.description}</p>
              </Link>
            ))}
            {filteredChapters.length === 0 && (
              <p className="text-neutral-500 col-span-full">No clubs match your search. Try a different term or <Link href="/start-a-club" className="text-primary-600 underline">start your own</Link>.</p>
            )}
          </div>
        </section>
      )}

      {/* ═══ Inline Club Finder Quiz ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white border border-neutral-200 overflow-hidden">
          <div className="bg-primary-600 text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} />
              <h2 className="font-bold text-sm font-heading">Club Finder Quiz</h2>
            </div>
            {quizDone && (
              <button onClick={resetQuiz} className="text-[11px] bg-white/20 hover:bg-white/30 px-2.5 py-1 font-semibold transition-colors">Retake</button>
            )}
          </div>
          <div className="p-5">
            {!quizDone ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-neutral-500">Question {quizStep + 1} of {quizQuestions.length}</p>
                  <div className="flex gap-1">
                    {quizQuestions.map((_, i) => (
                      <div key={i} className={`h-1.5 w-8 ${i <= quizStep ? "bg-primary-500" : "bg-neutral-200"}`} />
                    ))}
                  </div>
                </div>
                <h3 className="text-base font-bold text-primary-800 mb-4">{quizQuestions[quizStep].question}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {quizQuestions[quizStep].options.map((option) => (
                    <button key={option} onClick={() => handleQuizAnswer(option)}
                      className="text-left p-3 border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-sm font-medium">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-secondary-500" size={20} />
                  <h3 className="font-bold text-primary-800">Your Recommended Clubs</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                  {quizRecommendations.map((club, i) => (
                    <Link key={club.id} href={`/directory/${club.id}`}
                      className="flex items-center gap-3 p-3 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/40 transition-all">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">{i + 1}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-primary-700 truncate">{club.name}</p>
                        <p className="text-[10px] text-neutral-500">{club.category} · {club.memberCount} members</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {}
      <div className="sticky top-[57px] z-30 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex overflow-x-auto gap-1 py-2" aria-label="Explore tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    window.history.replaceState(null, "", `#${tab.key}`);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium  whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary-500 text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        {activeTab === "chatbot" && (
          <div className="animate-fade-up max-w-2xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-primary-700 mb-2 text-center">
              AI Assistant
            </h2>
            <p className="text-neutral-600 text-center mb-6">
              Powered by Gemini. Ask about clubs, events, how to get involved, or anything else.
            </p>
            <div className="card bg-white overflow-hidden">
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3  text-sm ${
                        msg.role === "user"
                          ? "bg-primary-500 text-white rounded-br-none"
                          : "bg-neutral-100 text-neutral-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 text-neutral-500 px-4 py-3  rounded-bl-none text-sm flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-neutral-200 p-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything about ClubConnect..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                  className="flex-1 px-4 py-2.5  border border-neutral-200 focus:border-primary-500 focus:outline-none text-sm"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="btn-primary px-4 py-2.5 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === "alumni" && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-heading font-bold text-primary-700 mb-2">
              Alumni Network
            </h2>
            <p className="text-neutral-600 mb-6">
              Connect with graduates who were once in your shoes. Explore career paths and opportunities.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {featuredAlumni.map((alum) => (
                <div key={alum.id} className="card p-6 bg-white ux-hover-lift-sm">
                  <div className="w-14 h-14  bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-bold mb-4">
                    {alum.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="font-bold text-primary-800">{alum.name}</h3>
                  <p className="text-sm text-neutral-600">Class of {alum.gradYear}</p>
                  <p className="text-sm text-neutral-500 mt-1">{alum.chapter}</p>
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-400">Now at</p>
                    <p className="text-sm font-semibold text-primary-700">{alum.career}</p>
                    <p className="text-xs text-neutral-500">{alum.college} · {alum.major}</p>
                  </div>
                  {alum.available && (
                    <span className="mt-3 inline-block badge bg-green-100 text-green-700 text-xs">Available for mentoring</span>
                  )}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-heading font-bold text-primary-700 mb-4">
              Upcoming Career Panels
            </h3>
            <div className="space-y-3">
              {careerPanels.map((panel) => (
                <div key={panel.id} className="card-hover p-5 bg-white flex items-center justify-between ux-hover-lift-sm">
                  <div>
                    <h4 className="font-semibold text-primary-700">{panel.title}</h4>
                    <p className="text-sm text-neutral-500">{panel.date} · {panel.time}</p>
                    <p className="text-xs text-neutral-400">{panel.panelists} panelists · {panel.registrations} registered</p>
                  </div>
                  <button className="btn-outline text-sm">Register</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {activeTab === "discussions" && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-heading font-bold text-primary-700 mb-2">
              Community Discussions
            </h2>
            <p className="text-neutral-600 mb-6">
              Share ideas, ask questions, and connect with fellow student leaders.
            </p>

            {}
            <div className="card p-5 bg-white mb-6">
              <h3 className="font-semibold text-primary-700 mb-3">Start a Discussion</h3>
              <input
                type="text"
                placeholder="What's on your mind?"
                value={discussionInput}
                onChange={(e) => setDiscussionInput(e.target.value)}
                className="input-field mb-3"
              />
              <button
                onClick={() => {
                  if (discussionInput.trim()) {
                    setDiscussions((prev) => [
                      {
                        id: Date.now(),
                        author: "You",
                        title: discussionInput.trim(),
                        replies: 0,
                        time: "Just now",
                      },
                      ...prev,
                    ]);
                    setDiscussionInput("");
                  }
                }}
                className="btn-primary text-sm"
              >
                Post Discussion
              </button>
            </div>

            <div className="space-y-3">
              {discussions.map((disc) => (
                <div key={disc.id} className="card-hover p-5 bg-white ux-hover-lift-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-primary-700">{disc.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        Posted by {disc.author} · {disc.time}
                      </p>
                    </div>
                    <span className="badge badge-outline text-xs shrink-0">
                      {disc.replies} replies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ New Clubs / Proposals Tab ═══ */}
        {activeTab === "proposals" && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-heading font-bold text-primary-700">Discover Clubs</h2>
              <Link href="/start-a-club" className="btn-primary text-sm flex items-center gap-1.5">
                <Rocket size={14} /> Start a Club
              </Link>
            </div>
            <p className="text-neutral-600 mb-6">Published student-created clubs and pending proposals from the community.</p>

            {proposalsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-primary-500" size={28} />
              </div>
            ) : (
              <>
                {publishedClubs.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Published Clubs</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {publishedClubs.map((club: any) => (
                        <div key={club.id} className="card p-5 bg-white ux-hover-lift-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-bold shrink-0">
                              {(club.name || '?')[0]}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-primary-700 truncate">{club.name}</h4>
                              {club.category && <span className="badge badge-primary text-[10px]">{club.category}</span>}
                            </div>
                          </div>
                          {club.description && <p className="text-sm text-neutral-600 line-clamp-2 mb-2">{club.description}</p>}
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                            {club.creator_name && <span>by {club.creator_name}</span>}
                            {club.member_count > 0 && <span><Users size={11} className="inline -mt-0.5" /> {club.member_count}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {proposals.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Pending Proposals</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {proposals.map((p: any) => (
                        <div key={p.id} className="card p-5 bg-white border-l-4 border-l-amber-400">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold shrink-0">
                              {(p.club_name || '?')[0]}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-primary-700 truncate">{p.club_name}</h4>
                              <span className="text-[10px] text-amber-600 font-semibold">⏳ {p.status || 'Pending'}</span>
                            </div>
                          </div>
                          {p.mission_statement && <p className="text-sm text-neutral-500 line-clamp-2">{p.mission_statement}</p>}
                          {p.category && <span className="badge badge-outline text-[10px] mt-2">{p.category}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {publishedClubs.length === 0 && proposals.length === 0 && (
                  <div className="text-center py-16">
                    <Compass size={36} className="mx-auto text-neutral-300 mb-3" />
                    <p className="text-neutral-500">No student-created clubs yet. Be the first!</p>
                    <Link href="/start-a-club" className="btn-primary mt-4 inline-flex items-center gap-1.5">
                      <Rocket size={14} /> Start a Club
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {}
        {activeTab === "resources" && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-heading font-bold text-primary-700 mb-2">
              Resources & Guides
            </h2>
            <p className="text-neutral-600 mb-6">
              Browse and share helpful resources for running successful clubs.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "How to Start a Club", desc: "Complete step-by-step guide to founding a new student organization.", href: "/resources", icon: "🚀" },
                { title: "Event Planning Toolkit", desc: "Templates and checklists for hosting successful club events.", href: "/events", icon: "📋" },
                { title: "Fundraising Playbook", desc: "Proven strategies for club fundraising and budget management.", href: "/donate", icon: "💰" },
                { title: "Leadership Development", desc: "Workshops and exercises for building strong officer teams.", href: "/resources", icon: "⭐" },
              ].map((resource) => (
                <Link key={resource.title} href={resource.href} className="card-hover p-5 bg-white group ux-hover-lift-sm">
                  <span className="text-2xl">{resource.icon}</span>
                  <h3 className="mt-3 font-bold text-primary-700 group-hover:text-primary-600">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">{resource.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
