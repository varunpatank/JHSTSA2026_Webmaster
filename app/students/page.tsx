"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  chapters, events, studentStories, announcements,
  schoolWideStats, weeklyOpportunities, featuredAlumni, guidesData,
} from "@/lib/data";
import {
  ArrowRight, Award, BarChart3, BookOpen, Bot, Calendar, ChevronRight,
  Clock, FileText, GraduationCap, Heart, HelpCircle,
  Lightbulb, MapPin, MessageCircle, MessageSquare, Paperclip, Plus,
  Search, Send, Shield, Sparkles, Star, Target, ThumbsUp,
  TrendingUp, Trophy, Upload, Users, X, Zap,
} from "lucide-react";


const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
interface ChatMsg { role: "user" | "assistant"; text: string; file?: { name: string; size: string } }
const SYS = `You are the ClubConnect Student AI — a friendly peer assistant. Help students with: finding/joining clubs, starting clubs, events, fundraising, leadership, competitions (TSA, DECA, etc.), mentors. Keep answers concise (2-4 sentences). Reference ClubConnect features when relevant.`;


const SEED_UPLOADS = [
  { id: "u1", title: "TSA Competition Prep Guide", author: "Maria G.", date: "2 hrs ago", type: "PDF", likes: 34, desc: "Complete walkthrough for state TSA competition events." },
  { id: "u2", title: "Club Budget Spreadsheet", author: "Marcus J.", date: "1 day ago", type: "XLSX", likes: 67, desc: "Automated budget tracker with income and expense categories." },
  { id: "u3", title: "Meeting Icebreaker Ideas", author: "Priya K.", date: "3 days ago", type: "PDF", likes: 89, desc: "50+ icebreaker activities sorted by group size." },
  { id: "u4", title: "Social Media Templates Pack", author: "Ella W.", date: "1 week ago", type: "ZIP", likes: 73, desc: "Canva templates for club Instagram posts and flyers." },
  { id: "u5", title: "Model UN Position Paper Template", author: "Sarah M.", date: "1 week ago", type: "DOCX", likes: 45, desc: "Professional position paper template with MLA formatting." },
  { id: "u6", title: "Debate Prep Flashcards", author: "David L.", date: "2 weeks ago", type: "PDF", likes: 24, desc: "200+ flashcards covering common debate topics." },
  { id: "u7", title: "Fundraiser Planning Checklist", author: "James L.", date: "2 weeks ago", type: "PDF", likes: 56, desc: "Complete checklist for organizing bake sales and car washes." },
  { id: "u8", title: "Club Constitution Template", author: "Alex J.", date: "3 weeks ago", type: "DOCX", likes: 91, desc: "Fill-in-the-blanks constitution that passes school approval." },
];


const THREADS = [
  { id: 1, title: "Tips for TSA State Competition?", author: "Maria G.", club: "TSA", replies: 23, time: "2 hrs ago", hot: true },
  { id: 2, title: "Best fundraising ideas for spring", author: "James L.", club: "FBLA", replies: 18, time: "5 hrs ago", hot: true },
  { id: 3, title: "Balancing club leadership with academics", author: "Sophie K.", club: "NHS", replies: 31, time: "1 day ago", hot: false },
  { id: 4, title: "Robotics competition strategies", author: "Alex J.", club: "Robotics", replies: 15, time: "1 day ago", hot: false },
  { id: 5, title: "How to get more members in a new club?", author: "Priya K.", club: "Environmental", replies: 9, time: "2 days ago", hot: false },
];


const SEED_MESSAGES = [
  { id: 1, user: "Maria G.", text: "Has anyone tried the new TSA practice tests? They're really helpful!", time: "10:42 AM", likes: 5, file: null },
  { id: 2, user: "James L.", text: "Check out this fundraiser spreadsheet I made for FBLA 👆", time: "10:38 AM", likes: 3, file: { name: "FBLA_Fundraiser.xlsx", size: "42 KB" } },
  { id: 3, user: "Sophie K.", text: "NHS meeting moved to Room 204 today!", time: "10:15 AM", likes: 8, file: null },
  { id: 4, user: "Alex J.", text: "Robotics build session photos from yesterday", time: "9:50 AM", likes: 12, file: { name: "robotics_photos.zip", size: "8.2 MB" } },
  { id: 5, user: "Priya K.", text: "Just uploaded my meeting icebreaker guide to community resources 🎉", time: "9:30 AM", likes: 6, file: null },
];

const FILE_ICONS: Record<string, string> = { PDF: "📄", DOCX: "📝", XLSX: "📊", ZIP: "📦", PNG: "🖼️", JPG: "🖼️" };

export default function StudentsPage() {

  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [msgInput, setMsgInput] = useState("");
  const [msgFile, setMsgFile] = useState<File | null>(null);
  const msgScrollRef = useRef<HTMLDivElement>(null);


  const [uploads, setUploads] = useState(SEED_UPLOADS);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [uploadSearch, setUploadSearch] = useState("");


  const [aiChat, setAiChat] = useState<ChatMsg[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const aiScrollRef = useRef<HTMLDivElement>(null);


  const [rightTab, setRightTab] = useState<"uploads" | "explore" | "events">("uploads");

  useEffect(() => { msgScrollRef.current && (msgScrollRef.current.scrollTop = msgScrollRef.current.scrollHeight); }, [messages]);
  useEffect(() => { aiScrollRef.current && (aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight); }, [aiChat, aiLoading]);


  const sendMsg = () => {
    if (!msgInput.trim() && !msgFile) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: "You",
      text: msgInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      likes: 0,
      file: msgFile ? { name: msgFile.name, size: `${(msgFile.size / 1024).toFixed(0)} KB` } : null,
    }]);
    setMsgInput("");
    setMsgFile(null);
  };


  const submitUpload = () => {
    if (!uploadTitle.trim() || !uploadFile) return;
    const ext = uploadFile.name.split(".").pop()?.toUpperCase() || "FILE";
    setUploads(prev => [{
      id: `u-${Date.now()}`,
      title: uploadTitle.trim(),
      author: "You",
      date: "Just now",
      type: ext,
      likes: 0,
      desc: uploadDesc.trim() || "No description provided.",
    }, ...prev]);
    setUploadTitle("");
    setUploadDesc("");
    setUploadFile(null);
    setShowUploadForm(false);
  };


  const toggleLike = (id: string) => {
    setLikedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setUploads(prev => prev.map(u => u.id === id ? { ...u, likes: likedIds.has(id) ? u.likes - 1 : u.likes + 1 } : u));
  };


  const sendAi = useCallback(async (text: string) => {
    if (!text.trim() || aiLoading) return;
    const userMsg: ChatMsg = { role: "user", text: text.trim() };
    setAiChat(p => [...p, userMsg]);
    setAiInput("");
    setAiLoading(true);
    try {
      const history = [...aiChat, userMsg].map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] }));
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_instruction: { parts: [{ text: SYS }] }, contents: history }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, try again!";
      setAiChat(p => [...p, { role: "assistant", text: reply }]);
    } catch { setAiChat(p => [...p, { role: "assistant", text: "Connection issue — please try again." }]); }
    finally { setAiLoading(false); }
  }, [aiChat, aiLoading]);


  const filteredUploads = useMemo(() => {
    if (!uploadSearch.trim()) return uploads;
    const q = uploadSearch.toLowerCase();
    return uploads.filter(u => u.title.toLowerCase().includes(q) || u.desc.toLowerCase().includes(q) || u.author.toLowerCase().includes(q));
  }, [uploads, uploadSearch]);

  const trendingClubs = useMemo(() => [...chapters].filter(c => c.isActive).sort((a, b) => b.memberCount - a.memberCount).slice(0, 5), []);
  const upcomingEvents = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4), []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {}
      <section className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-2">
              <Users size={24} /> Student Community Hub
            </h1>
            <p className="text-primary-200 text-sm mt-1">Chat, share resources, explore clubs &amp; compete — all in one place.</p>
          </div>
          <div className="flex gap-3">
            {[
              { v: schoolWideStats.totalClubs, l: "Clubs" },
              { v: schoolWideStats.totalMembers.toLocaleString(), l: "Students" },
              { v: uploads.length, l: "Resources" },
            ].map(s => (
              <div key={s.l} className="bg-white/10 border border-white/10 px-3 py-1.5 text-center">
                <p className="text-base font-bold leading-none">{s.v}</p>
                <p className="text-[9px] text-primary-300">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid lg:grid-cols-5 gap-5">

          {}
          <div className="lg:col-span-3 space-y-5">

            {}
            <div className="bg-white border-2 border-primary-200 overflow-hidden">
              <div className="bg-primary-50 border-b border-primary-200 px-4 py-2.5 flex items-center justify-between">
                <h2 className="font-bold text-primary-800 text-sm flex items-center gap-2"><MessageCircle size={16} className="text-primary-500" /> Student Lounge</h2>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {messages.length} messages today</span>
              </div>
              <div ref={msgScrollRef} className="h-[320px] overflow-y-auto p-3 space-y-2 bg-neutral-50/50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2.5 ${msg.user === "You" ? "flex-row-reverse" : ""}`}>
                    <div className="w-7 h-7 bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold shrink-0">{msg.user.charAt(0)}</div>
                    <div className={`max-w-[75%] ${msg.user === "You" ? "bg-primary-600 text-white" : "bg-white border border-neutral-200"} px-3 py-2`}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-semibold ${msg.user === "You" ? "text-primary-200" : "text-primary-600"}`}>{msg.user}</span>
                        <span className={`text-[9px] ${msg.user === "You" ? "text-primary-300" : "text-neutral-400"}`}>{msg.time}</span>
                      </div>
                      {msg.text && <p className="text-xs leading-relaxed">{msg.text}</p>}
                      {msg.file && (
                        <div className={`mt-1.5 flex items-center gap-2 px-2 py-1.5 text-xs ${msg.user === "You" ? "bg-primary-500/50" : "bg-neutral-50 border border-neutral-200"}`}>
                          <Paperclip size={12} /> <span className="font-medium">{msg.file.name}</span> <span className="text-[9px] opacity-70">{msg.file.size}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <button className={`text-[10px] flex items-center gap-0.5 ${msg.user === "You" ? "text-primary-200" : "text-neutral-400"} hover:text-primary-500`}><ThumbsUp size={10} /> {msg.likes}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2.5 border-t border-neutral-100 bg-white">
                <form onSubmit={e => { e.preventDefault(); sendMsg(); }} className="flex gap-2 items-center">
                  <label className="cursor-pointer p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-primary-500 transition-colors">
                    <Paperclip size={16} />
                    <input type="file" className="hidden" onChange={e => setMsgFile(e.target.files?.[0] || null)} />
                  </label>
                  {msgFile && <span className="text-[9px] bg-primary-100 text-primary-700 px-1.5 py-0.5 flex items-center gap-1">{msgFile.name} <button type="button" onClick={() => setMsgFile(null)}><X size={10} /></button></span>}
                  <input type="text" value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Type a message..." className="flex-1 text-xs py-2 px-3 border border-neutral-200 focus:outline-none focus:border-primary-400" />
                  <button type="submit" className="bg-primary-600 text-white px-3 py-2 text-xs font-semibold hover:bg-primary-700 transition-colors"><Send size={14} /></button>
                </form>
              </div>
            </div>

            {}
            <div className="bg-white border-2 border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between">
                <h2 className="font-bold text-primary-800 text-sm flex items-center gap-2"><MessageSquare size={16} className="text-secondary-500" /> Discussion Threads</h2>
                <Link href="/hub/discussions" className="text-[10px] text-primary-600 font-medium hover:underline flex items-center gap-0.5"><Plus size={10} /> New Thread</Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {THREADS.map(t => (
                  <Link key={t.id} href="/hub/discussions" className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/50 transition-colors">
                    <div className="bg-neutral-100 border border-neutral-200 px-2 py-1.5 text-center shrink-0 min-w-[44px]">
                      <span className="text-sm font-bold text-primary-700">{t.replies}</span>
                      <span className="block text-[8px] text-neutral-400 uppercase">replies</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        {t.hot && <span className="text-[8px] font-bold bg-red-100 text-red-700 px-1 py-0.5">🔥 HOT</span>}
                        <span className="text-[9px] font-semibold bg-primary-50 text-primary-600 px-1 py-0.5 border border-primary-200">{t.club}</span>
                      </div>
                      <h4 className="font-semibold text-primary-800 text-xs truncate">{t.title}</h4>
                      <p className="text-[10px] text-neutral-400">{t.author} · {t.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/hub/discussions" className="block text-center text-xs text-primary-600 font-medium py-2.5 border-t border-neutral-100 hover:bg-primary-50/50">View All Discussions →</Link>
            </div>

            {}
            <div>
              <h3 className="font-bold text-primary-800 text-sm mb-2 flex items-center gap-2"><Heart size={14} className="text-secondary-500" /> Student Voices</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {studentStories.slice(0, 3).map((story, i) => (
                  <div key={story.id} className="bg-white border-2 border-neutral-200 overflow-hidden">
                    <div className={`h-1 ${i === 0 ? "bg-primary-500" : i === 1 ? "bg-secondary-500" : "bg-emerald-500"}`} />
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600">{story.name.split(" ").map(n => n[0]).join("")}</div>
                        <div>
                          <p className="font-bold text-primary-800 text-[11px]">{story.name}</p>
                          <p className="text-[9px] text-neutral-400">Grade {story.grade} · {story.club}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-600 italic leading-relaxed">&ldquo;{story.quote.slice(0, 100)}…&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-2 space-y-5">

            {}
            <div className="flex border-2 border-neutral-200 bg-white">
              {[
                { key: "uploads" as const, label: "Community Resources", icon: Upload },
                { key: "explore" as const, label: "Mentoring", icon: GraduationCap },
                { key: "events" as const, label: "Events", icon: Calendar },
              ].map(tab => (
                <button key={tab.key} onClick={() => setRightTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${rightTab === tab.key ? "bg-primary-600 text-white" : "text-neutral-500 hover:bg-neutral-50"}`}>
                  <tab.icon size={13} /> {tab.label}
                </button>
              ))}
            </div>

            {}
            {rightTab === "uploads" && (
              <div className="space-y-3">
                {}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="text" value={uploadSearch} onChange={e => setUploadSearch(e.target.value)} placeholder="Search resources…" className="w-full text-xs py-2 pl-8 pr-3 border-2 border-neutral-200 focus:outline-none focus:border-primary-400" />
                  </div>
                  <button onClick={() => setShowUploadForm(v => !v)} className="bg-primary-600 text-white px-3 py-2 text-xs font-semibold hover:bg-primary-700 flex items-center gap-1 transition-colors shrink-0">
                    <Upload size={13} /> Upload
                  </button>
                </div>

                {}
                {showUploadForm && (
                  <div className="bg-primary-50 border-2 border-primary-200 p-3 space-y-2">
                    <h4 className="font-bold text-primary-800 text-xs flex items-center gap-1.5"><Upload size={13} /> Share a Resource</h4>
                    <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Resource title" className="w-full text-xs py-1.5 px-2.5 border border-primary-200 focus:outline-none focus:border-primary-400 bg-white" />
                    <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} placeholder="Brief description…" className="w-full text-xs py-1.5 px-2.5 border border-primary-200 focus:outline-none focus:border-primary-400 bg-white resize-none" rows={2} />
                    <label className="flex items-center gap-2 px-2.5 py-1.5 border border-dashed border-primary-300 bg-white cursor-pointer hover:bg-primary-50 transition-colors">
                      <Paperclip size={13} className="text-primary-500" />
                      <span className="text-xs text-neutral-500">{uploadFile ? uploadFile.name : "Choose file…"}</span>
                      <input type="file" className="hidden" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                    </label>
                    <div className="flex gap-2">
                      <button onClick={submitUpload} disabled={!uploadTitle.trim() || !uploadFile} className="bg-primary-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1"><Send size={11} /> Submit</button>
                      <button onClick={() => setShowUploadForm(false)} className="text-xs text-neutral-500 px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50">Cancel</button>
                    </div>
                  </div>
                )}

                {}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredUploads.map(u => (
                    <div key={u.id} className="bg-white border-2 border-neutral-200 p-3 hover:border-primary-200 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg">{FILE_ICONS[u.type] || "📄"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-primary-700 text-xs truncate">{u.title}</h4>
                            <span className="text-[8px] font-semibold bg-neutral-100 text-neutral-500 px-1 py-0.5 shrink-0">{u.type}</span>
                          </div>
                          <p className="text-[10px] text-neutral-500 line-clamp-1">{u.desc}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] text-neutral-400">{u.author} · {u.date}</span>
                            <button onClick={() => toggleLike(u.id)} className={`text-[10px] flex items-center gap-0.5 ${likedIds.has(u.id) ? "text-red-500" : "text-neutral-400 hover:text-red-500"}`}>
                              <Heart size={10} className={likedIds.has(u.id) ? "fill-current" : ""} /> {u.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {rightTab === "explore" && (
              <div className="space-y-3">
                {}
                <div className="bg-white border-2 border-neutral-200 p-3">
                  <h3 className="font-bold text-primary-700 text-xs mb-2 flex items-center gap-1.5"><GraduationCap size={13} className="text-secondary-500" /> Available Mentors</h3>
                  <div className="space-y-2">
                    {featuredAlumni.filter(a => a.available).slice(0, 5).map(alum => (
                      <div key={alum.id} className="flex items-center gap-2 p-2 hover:bg-primary-50/50 transition-colors">
                        <div className="w-8 h-8 bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600 shrink-0">{alum.name.split(" ").map(n => n[0]).join("")}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-primary-700">{alum.name}</p>
                          <p className="text-[9px] text-neutral-400">{alum.career} · Class of {alum.gradYear}</p>
                        </div>
                        <Link href="/alumni" className="text-[9px] text-primary-600 font-semibold hover:underline shrink-0">Connect</Link>
                      </div>
                    ))}
                  </div>
                  <Link href="/alumni" className="block text-center text-[10px] text-primary-600 font-medium mt-2 hover:underline">View All Mentors →</Link>
                </div>

                {}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: "/hub/mentors", label: "Mentor Network", icon: GraduationCap, color: "bg-teal-50 text-teal-600 border-teal-200" },
                    { href: "/hub/discussions", label: "Forums", icon: MessageSquare, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                    { href: "/hub/competitions", label: "Competitions", icon: Trophy, color: "bg-purple-50 text-purple-600 border-purple-200" },
                    { href: "/hub/quiz", label: "Club Finder Quiz", icon: HelpCircle, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
                    { href: "/hub/ideas", label: "Club Ideas", icon: Lightbulb, color: "bg-amber-50 text-amber-600 border-amber-200" },
                    { href: "/hub/collaborate", label: "Collaborate", icon: Users, color: "bg-pink-50 text-pink-600 border-pink-200" },
                    { href: "/hub/goals", label: "Goal Tracker", icon: Target, color: "bg-lime-50 text-lime-600 border-lime-200" },
                    { href: "/hub/achievements", label: "Badges", icon: Award, color: "bg-violet-50 text-violet-600 border-violet-200" },
                    { href: "/hub/health", label: "Club Health", icon: BarChart3, color: "bg-sky-50 text-sky-600 border-sky-200" },
                    { href: "/hub/stories", label: "Success Stories", icon: Heart, color: "bg-rose-50 text-rose-600 border-rose-200" },
                  ].map(item => (
                    <Link key={item.href} href={item.href} className={`flex items-center gap-2 p-2.5 border-2 ${item.color} hover:shadow-sm transition-all group`}>
                      <item.icon size={15} className="shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {}
                <div className="bg-white border-2 border-neutral-200 p-3">
                  <h3 className="font-bold text-primary-700 text-xs mb-2 flex items-center gap-1.5"><TrendingUp size={13} className="text-secondary-500" /> Trending Clubs</h3>
                  <div className="space-y-2">
                    {trendingClubs.map((club, i) => (
                      <Link key={club.id} href={`/directory/${club.id}`} className="flex items-center gap-2 group">
                        <span className="w-5 h-5 flex items-center justify-center bg-primary-100 text-primary-700 text-[10px] font-bold shrink-0">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-primary-700 group-hover:text-primary-500 truncate">{club.name}</p>
                          <p className="text-[9px] text-neutral-400">{club.memberCount} members</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {}
            {rightTab === "events" && (
              <div className="space-y-3">
                {}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Announcements</h3>
                  {announcements.slice(0, 3).map(a => (
                    <div key={a.id} className={`border-l-4 p-3 ${a.priority === "high" ? "border-l-red-500 bg-red-50" : a.priority === "medium" ? "border-l-secondary-500 bg-secondary-50" : "border-l-primary-400 bg-primary-50"}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[8px] font-bold uppercase px-1 py-0.5 ${a.priority === "high" ? "bg-red-200 text-red-800" : "bg-secondary-200 text-secondary-800"}`}>{a.priority === "high" ? "Urgent" : "Info"}</span>
                        <span className="text-[9px] text-neutral-400">{a.date}</span>
                      </div>
                      <h4 className="font-bold text-primary-800 text-xs">{a.title}</h4>
                      <p className="text-[10px] text-neutral-600 mt-0.5 line-clamp-2">{a.content}</p>
                    </div>
                  ))}
                </div>

                {}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Upcoming Events</h3>
                  {upcomingEvents.map(ev => (
                    <Link key={ev.id} href={`/events/${ev.id}`} className="flex items-start gap-2.5 p-2.5 bg-white border-2 border-neutral-200 hover:border-primary-300 transition-colors group">
                      <div className="bg-primary-50 border border-primary-200 px-2 py-1 text-center shrink-0">
                        <div className="text-[9px] text-primary-500 font-medium">{new Date(ev.date).toLocaleDateString("en-US", { month: "short" })}</div>
                        <div className="text-base font-bold text-primary-800 leading-none">{new Date(ev.date).getDate()}</div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-primary-800 text-xs group-hover:text-primary-600">{ev.title}</h4>
                        <p className="text-[9px] text-neutral-500">{ev.chapterName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-neutral-400">
                          <Clock size={9} /> {ev.startTime} <MapPin size={9} /> {ev.location.split(",")[0]}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link href="/events" className="block text-center text-xs text-primary-600 font-medium py-2 hover:underline">All Events →</Link>
                </div>

                {}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Opportunities</h3>
                  {weeklyOpportunities.slice(0, 3).map(opp => (
                    <div key={opp.id} className="flex items-center gap-2 p-2.5 bg-white border border-neutral-200">
                      <span className="text-sm">{opp.type === "competition" ? "🏆" : opp.type === "volunteer" ? "🤝" : "📅"}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-primary-800 text-[11px]">{opp.title}</h4>
                        <p className="text-[9px] text-neutral-500">{opp.club} · {opp.date}</p>
                      </div>
                      {opp.urgent && <span className="text-[8px] font-bold bg-red-100 text-red-700 px-1 py-0.5">Urgent</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            <div className="bg-white border-2 border-neutral-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-primary-700 text-xs flex items-center gap-1.5"><BookOpen size={13} className="text-secondary-500" /> Popular Guides</h3>
                <Link href="/guides" className="text-[10px] text-primary-600 font-medium hover:underline">All →</Link>
              </div>
              <div className="space-y-1.5">
                {guidesData.slice(0, 3).map(guide => (
                  <Link key={guide.id} href={`/guides/${guide.slug}`} className="flex items-center gap-2 p-2 hover:bg-primary-50/50 transition-colors group">
                    <FileText size={13} className="text-primary-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary-700 group-hover:text-primary-500 truncate">{guide.title}</p>
                      <p className="text-[9px] text-neutral-400">{guide.sections.length} sections</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {}
            <Link href="/resources" className="block bg-gradient-to-r from-primary-700 to-primary-800 text-white p-4 hover:from-primary-600 hover:to-primary-700 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">Need school-provided guides?</p>
                  <p className="text-[10px] text-primary-200">The Resource Center has templates &amp; toolkits</p>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {}
        <div className="mt-5 bg-gradient-to-r from-primary-700 to-primary-900 text-white p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Service Hours", value: schoolWideStats.totalServiceHours.toLocaleString(), icon: Heart },
              { label: "Events Hosted", value: schoolWideStats.totalEvents, icon: Calendar },
              { label: "Students", value: schoolWideStats.totalMembers.toLocaleString(), icon: Users },
              { label: "Participation", value: schoolWideStats.studentParticipationRate + "%", icon: TrendingUp },
            ].map(s => (
              <div key={s.label}>
                <s.icon size={18} className="mx-auto mb-1 text-secondary-400" />
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-[10px] text-neutral-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="fixed bottom-6 right-6 z-50">
        {showAi && (
          <div className="mb-3 w-80 sm:w-96 bg-white border-2 border-primary-200 shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-neutral-100 bg-primary-50/50 flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white"><Bot size={14} /></div>
              <div className="flex-1"><h2 className="font-bold text-primary-800 text-xs">AI Assistant</h2><p className="text-[9px] text-neutral-500">Clubs, events &amp; more</p></div>
              <button onClick={() => setShowAi(false)} className="p-1 hover:bg-neutral-100"><X size={14} className="text-neutral-400" /></button>
            </div>
            <div ref={aiScrollRef} className="h-[260px] overflow-y-auto p-3 space-y-2 bg-neutral-50/30">
              {aiChat.length === 0 && (
                <div className="text-center py-4">
                  <Sparkles size={20} className="mx-auto text-primary-300 mb-2" />
                  <p className="font-bold text-primary-700 text-xs">Ask me anything!</p>
                  <div className="mt-3 space-y-1.5">
                    {["How do I start a new club?", "What competitions can I join?", "How do I find a mentor?"].map(q => (
                      <button key={q} onClick={() => sendAi(q)} className="w-full text-[11px] px-3 py-1.5 border border-primary-200 text-primary-600 hover:bg-primary-50 text-left">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {aiChat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-primary-600 text-white" : "bg-white border border-neutral-200 text-neutral-700 shadow-sm"}`}>
                    {msg.role === "assistant" && <Bot size={10} className="inline mr-1 text-primary-400" />}{msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start"><div className="bg-white border border-neutral-200 px-3 py-2 shadow-sm"><div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }} /></div></div></div>
              )}
            </div>
            <div className="px-3 py-2 border-t border-neutral-100 bg-white">
              <form onSubmit={e => { e.preventDefault(); sendAi(aiInput); }} className="flex gap-2">
                <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask a question…" className="flex-1 text-xs py-1.5 px-3 border border-neutral-200 focus:outline-none focus:border-primary-400" disabled={aiLoading} />
                <button type="submit" disabled={aiLoading || !aiInput.trim()} className="bg-primary-600 text-white px-2.5 py-1.5 text-xs hover:bg-primary-700 disabled:opacity-50"><Send size={12} /></button>
              </form>
            </div>
          </div>
        )}
        <button onClick={() => setShowAi(v => !v)} className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${showAi ? "bg-neutral-600 text-white" : "bg-gradient-to-br from-primary-500 to-secondary-500 text-white"}`}>
          {showAi ? <X size={20} /> : <Bot size={20} />}
        </button>
      </div>
    </div>
  );
}
