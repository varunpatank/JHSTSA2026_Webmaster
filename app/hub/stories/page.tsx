"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award, BookOpen, ChevronDown, Heart, Loader2, Quote, Search, Star, Trophy, Users
} from "lucide-react";
import { supabase, successStoriesApi } from "@/lib/api";

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

interface SuccessStory {
  id: string; title: string; club: string; author: string; year: string;
  category: string; excerpt: string; fullStory: string;
  impact: { label: string; value: string }[];
  featured: boolean; image: string;
}

const SEED_STORIES: SuccessStory[] = [
  { id: "s1", title: "From Classroom to Capitol: Our Model UN Journey", club: "Model United Nations", author: "Sarah Kim, Class of 2025", year: "2024-2025", category: "Academic", excerpt: "How our Model UN delegation went from 5 members to winning Best Delegation at the Pacific Northwest Conference.", fullStory: "When I joined Model UN as a sophomore, we had just five members and no conference experience. Fast forward two years: we sent 15 delegates to three conferences, won Best Delegation at PACMUN, and two members received Outstanding Delegate awards at the national conference. The key was mentorship — upperclassmen teaching underclassmen research methods, public speaking, and diplomatic negotiation. We created a structured training program that new members could follow, and our weekly practice sessions became the highlight of everyone's week.", impact: [{ label: "Members Grown", value: "5 → 35" }, { label: "Conferences Attended", value: "3" }, { label: "Awards Won", value: "7" }], featured: true, image: "🏛️" },
  { id: "s2", title: "Building a Robot, Building a Community", club: "Robotics Club", author: "Marcus Chen, Class of 2025", year: "2024-2025", category: "STEM", excerpt: "Our robotics team qualified for state finals while running workshops for middle schoolers, proving STEM outreach and competition can coexist.", fullStory: "Our team faced a choice: focus solely on competition or invest time in community outreach. We chose both. Every Saturday morning, our members ran free robotics workshops for 6th-8th graders at the local library. The result was unexpected — teaching fundamentals to younger students actually strengthened our own understanding. When competition season came, we built our most innovative robot yet, qualified for state finals, and our workshop program grew to serve 40+ middle schoolers weekly. Three of our mentees have since joined the high school team.", impact: [{ label: "State Ranking", value: "Top 5" }, { label: "Students Mentored", value: "40+" }, { label: "Workshop Hours", value: "200+" }], featured: true, image: "🤖" },
  { id: "s3", title: "Painting a Brighter Future", club: "Art Club", author: "Emily Torres, Class of 2026", year: "2025-2026", category: "Arts", excerpt: "Our community mural project transformed a neglected underpass into a public art landmark, earning a city beautification award.", fullStory: "What started as a simple idea — 'let's paint something big' — became our most ambitious project ever. We partnered with the city parks department to transform a 120-foot concrete underpass near school into a community mural. Over 8 weekends, 25 students designed and painted scenes celebrating Kirkland's history and diversity. The project required fundraising ($2,000 for supplies), city permits, community input sessions, and a lot of paint-stained clothes. The finished mural was featured in the Kirkland Reporter and earned us the City Beautification Award.", impact: [{ label: "Mural Length", value: "120 ft" }, { label: "Students Involved", value: "25" }, { label: "Funds Raised", value: "$2,000" }], featured: false, image: "🎨" },
  { id: "s4", title: "Feeding the Community, One Meal at a Time", club: "Community Service Club", author: "Aiden Park, Class of 2025", year: "2024-2025", category: "Service", excerpt: "Our food drive and meal packaging program provided 5,000+ meals to families in need throughout the school year.", fullStory: "Food insecurity affects more families in our community than most people realize. Our Community Service Club partnered with the Kirkland Food Bank to run a year-long meal packaging and distribution program. We organized monthly food drives, hosted three large meal-packaging events (each producing 1,000+ meals), and set up a weekly fresh produce distribution at the school. The hardest part was logistics — coordinating volunteers, managing donations, and ensuring food safety. But seeing the impact on families made every challenge worthwhile. We're now expanding to partner with two more schools next year.", impact: [{ label: "Meals Provided", value: "5,000+" }, { label: "Volunteers", value: "80" }, { label: "Partner Schools", value: "3" }], featured: false, image: "🍱" },
  { id: "s5", title: "Coding for Change: Our App Won a Hackathon", club: "CS Club", author: "Dev Gupta, Class of 2026", year: "2025-2026", category: "STEM", excerpt: "We built an app connecting senior citizens with volunteer student tutors for technology help, winning first place at HackNW.", fullStory: "The idea came from a member whose grandmother struggled with her new smartphone. We built 'TechBridge' — a mobile app matching senior citizens with student volunteers for one-on-one technology tutoring sessions. After 48 hours of caffeine-fueled coding at HackNW, we won first place and a $2,000 prize. But the real win came after: we piloted TechBridge at the Kirkland Senior Center, helping 30+ seniors with everything from video calling to online grocery ordering. The app is now being adopted by two more senior centers in the Eastside.", impact: [{ label: "Hackathon Place", value: "1st" }, { label: "Seniors Helped", value: "30+" }, { label: "Centers Adopted", value: "3" }], featured: false, image: "💻" },
  { id: "s6", title: "Drama Club: Sold Out Three Nights Running", club: "Drama Club", author: "Lily Martinez, Class of 2025", year: "2024-2025", category: "Arts", excerpt: "Our spring musical sold out all three performances, raised $8,000 for the arts department, and launched two students into conservatory programs.", fullStory: "Putting on a full musical with a student-run production team seemed impossibly ambitious. But our drama club proved that students can produce professional-quality theater. We chose 'Into the Woods' — a technically demanding show requiring complex staging and live orchestra. Over four months, 60+ students (actors, crew, orchestra, marketing) worked together to create something magical. All three performances sold out (850 seats each). The revenue funded new lighting equipment and scholarships. Two seniors received acceptances to prestigious theater conservatories, crediting their roles in the show.", impact: [{ label: "Performances Sold Out", value: "3/3" }, { label: "Revenue Raised", value: "$8,000" }, { label: "Students Involved", value: "60+" }], featured: false, image: "🎭" },
];

const STORIES_LS_KEY = "clubconnect_stories";

function loadStories(): SuccessStory[] {
  if (typeof window === "undefined") return SEED_STORIES;
  try {
    const raw = localStorage.getItem(STORIES_LS_KEY);
    if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
  } catch {}
  return SEED_STORIES;
}

export default function StoriesPage() {
  const router = useRouter();
  const [stories, setStories] = useState<SuccessStory[]>(loadStories);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");

  useEffect(() => {
    localStorage.setItem(STORIES_LS_KEY, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled && user) setCurrentUserId(user.id);
      try {
        const { data } = await successStoriesApi.getAll();
        if (!cancelled && data && data.length > 0) {
          const dbStories: SuccessStory[] = data.map((d: any) => ({
            id: d.id, title: d.title || "Untitled",
            club: d.organizations?.name || "A Club",
            author: d.profiles?.name || "Anonymous",
            year: d.created_at?.split("-")[0] || "2026",
            category: "General", excerpt: (d.content || "").slice(0, 200),
            fullStory: d.content || "",
            impact: [], featured: d.is_featured || false,
            image: "📖",
          }));
          const existingIds = new Set(SEED_STORIES.map(s => s.id));
          const newFromDb = dbStories.filter(d => !existingIds.has(d.id));
          setStories(prev => {
            const localOnly = prev.filter(p => !SEED_STORIES.some(s => s.id === p.id) && !newFromDb.some(n => n.id === p.id));
            return [...newFromDb, ...localOnly, ...SEED_STORIES];
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleSubmitStory() {
    if (!currentUserId) { router.push("/portal"); return; }
    if (!storyTitle.trim() || !storyContent.trim() || submitting) return;
    setSubmitting(true);
    const newStory: SuccessStory = {
      id: `local-${Date.now()}`, title: storyTitle.trim(), club: "Your Club", author: "You",
      year: new Date().getFullYear().toString(), category: "General",
      excerpt: storyContent.trim().slice(0, 200), fullStory: storyContent.trim(),
      impact: [], featured: false, image: "📖",
    };
    try {
      if (currentUserId) {
        const { data } = await successStoriesApi.create({ author_id: currentUserId, title: storyTitle.trim(), content: storyContent.trim() });
        if (data) newStory.id = (data as any).id;
      }
    } catch (e) { console.error("DB save failed, keeping locally:", e); }
    setStories(prev => [newStory, ...prev]);
    setStoryTitle(""); setStoryContent(""); setShowSubmit(false);
    setSubmitting(false);
  }

  const categories = ["All", ...Array.from(new Set(stories.map(s => s.category)))];
  const featured = stories.filter(s => s.featured);

  const filtered = stories.filter(s => {
    if (category !== "All" && s.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.club.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-900 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-rose-100 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-heading font-bold flex items-start gap-3"><BookOpen size={28} className="sm:w-9 sm:h-9 shrink-0" /> Success Stories</h1>
          <p className="mt-3 max-w-2xl text-rose-50 text-lg">Inspiring stories from clubs that made an impact. Read how students turned ideas into action.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {}
        {featured.length > 0 && (
          <Reveal>
            <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2 mb-4"><Star size={18} /> Featured Stories</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {featured.map(story => (
                <div key={story.id} className="card p-6 border-2 border-secondary-200 bg-gradient-to-br from-secondary-50/30 to-white ux-hover-lift">
                  <span className="text-4xl">{story.image}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-700 font-bold ml-3">Featured</span>
                  <h3 className="font-bold text-primary-800 text-lg mt-3">{story.title}</h3>
                  <p className="text-xs text-neutral-500">{story.club} · {story.author}</p>
                  <p className="text-sm text-neutral-600 mt-2">{story.excerpt}</p>
                  <div className="mt-3 flex gap-3">
                    {story.impact.map(imp => (
                      <div key={imp.label} className="bg-primary-50 px-3 py-1.5  text-center">
                        <p className="font-bold text-primary-700 text-sm">{imp.value}</p>
                        <p className="text-[10px] text-primary-500">{imp.label}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setExpandedId(expandedId === story.id ? null : story.id)} className="text-primary-600 text-sm font-semibold mt-3 hover:underline">
                    {expandedId === story.id ? "Show Less" : "Read Full Story →"}
                  </button>
                  {expandedId === story.id && <p className="text-sm text-neutral-600 mt-3 leading-relaxed">{story.fullStory}</p>}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search stories..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="select-field text-sm w-auto">{categories.map(c => <option key={c}>{c}</option>)}</select>
        </div>

        {}
        <div className="space-y-4">
          {filtered.filter(s => !s.featured || expandedId === s.id).map(story => (
            <Reveal key={story.id}>
              <div className="card p-5 ux-hover-lift-sm">
                <div className="flex gap-4">
                  <span className="text-3xl shrink-0">{story.image}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{story.category}</span>
                      <span className="text-xs text-neutral-400">{story.year}</span>
                    </div>
                    <h3 className="font-bold text-primary-800 text-lg">{story.title}</h3>
                    <p className="text-xs text-neutral-500">{story.club} · {story.author}</p>
                    <p className="text-sm text-neutral-600 mt-2">{story.excerpt}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {story.impact.map(imp => (
                        <span key={imp.label} className="text-xs px-2 py-1  bg-rose-50 text-rose-700">{imp.label}: <strong>{imp.value}</strong></span>
                      ))}
                    </div>
                    <button onClick={() => setExpandedId(expandedId === story.id ? null : story.id)} className="text-primary-600 text-sm font-semibold mt-3 hover:underline flex items-center gap-1">
                      {expandedId === story.id ? "Show Less" : "Read Full Story"} <ChevronDown size={14} className={expandedId === story.id ? "rotate-180" : ""} />
                    </button>
                    {expandedId === story.id && <p className="text-sm text-neutral-600 mt-3 leading-relaxed bg-neutral-50 p-4 ">{story.fullStory}</p>}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-8 text-center"><BookOpen size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No stories match your search.</p></div>
        )}

        {}
        <Reveal>
          <div className="mt-8 card p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200">
            <h3 className="font-heading font-bold text-xl text-primary-700 text-center">Share Your Club&rsquo;s Story</h3>
            <p className="text-sm text-neutral-600 mt-1 text-center">Every club has a story worth telling. Submit yours and inspire the next generation.</p>
            {!showSubmit ? (
              <div className="text-center"><button onClick={() => setShowSubmit(true)} className="btn-primary mt-4">Submit Your Story</button></div>
            ) : (
              <div className="mt-4 space-y-3">
                <input type="text" placeholder="Story title..." value={storyTitle} onChange={e => setStoryTitle(e.target.value)} className="input-field" />
                <textarea placeholder="Write your success story..." value={storyContent} onChange={e => setStoryContent(e.target.value)} className="input-field h-32 resize-none" />
                <div className="flex gap-2">
                  <button onClick={handleSubmitStory} disabled={submitting || !storyTitle.trim() || !storyContent.trim()} className="btn-primary text-sm disabled:opacity-50 flex items-center gap-1">
                    {submitting ? <><Loader2 size={13} className="animate-spin" /> Submitting…</> : "Submit Story"}
                  </button>
                  <button onClick={() => setShowSubmit(false)} className="text-sm text-neutral-500 hover:text-neutral-700">Cancel</button>
                </div>
                {!currentUserId && <p className="text-xs text-red-500">Sign in to submit stories.</p>}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
