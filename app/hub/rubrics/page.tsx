"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, ChevronDown, Download, FileText, Search, Star, Trophy } from "lucide-react";
import { supabase, rubricProgressApi } from "@/lib/api";

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

interface RubricItem {
  id: string; event: string; category: string; description: string;
  criteria: { name: string; maxPoints: number; description: string }[];
  totalPoints: number; level: string;
}

const RUBRICS: RubricItem[] = [
  {
    id: "r1", event: "Webmaster", category: "Technology", level: "Middle & High School",
    description: "Design and develop a website for a given theme using HTML, CSS, and JavaScript. Judged on content, design, and functionality.",
    criteria: [
      { name: "Content & Theme Relevance", maxPoints: 30, description: "Accuracy, depth, and relevance of content to the annual theme" },
      { name: "Design & Visual Appeal", maxPoints: 25, description: "Layout, color scheme, typography, and overall visual consistency" },
      { name: "Navigation & Functionality", maxPoints: 20, description: "Ease of navigation, working links, responsive design, and interactive features" },
      { name: "Technical Quality", maxPoints: 15, description: "Clean code, accessibility compliance, performance, and cross-browser compatibility" },
      { name: "Documentation", maxPoints: 10, description: "Plan of work, copyright compliance, and source citations" },
    ],
    totalPoints: 100,
  },
  {
    id: "r2", event: "Coding", category: "Technology", level: "High School",
    description: "Demonstrate programming skills by solving algorithmic challenges within a time limit.",
    criteria: [
      { name: "Correctness", maxPoints: 40, description: "Programs produce correct output for all test cases" },
      { name: "Efficiency", maxPoints: 25, description: "Optimal time and space complexity of solutions" },
      { name: "Code Quality", maxPoints: 20, description: "Readable, well-structured, and properly commented code" },
      { name: "Edge Cases", maxPoints: 15, description: "Handling of boundary conditions and unusual inputs" },
    ],
    totalPoints: 100,
  },
  {
    id: "r3", event: "Video Game Design", category: "Technology", level: "Middle & High School",
    description: "Design and develop an original video game that incorporates the annual TSA theme.",
    criteria: [
      { name: "Gameplay & Mechanics", maxPoints: 30, description: "Fun factor, game balance, controls, and player engagement" },
      { name: "Theme Integration", maxPoints: 20, description: "How well the annual theme is woven into gameplay and narrative" },
      { name: "Visual & Audio Design", maxPoints: 20, description: "Graphics quality, animation, sound effects, and music" },
      { name: "Technical Execution", maxPoints: 15, description: "Performance, bug-free experience, and platform compatibility" },
      { name: "Documentation & Presentation", maxPoints: 15, description: "Design document, plan of work, and interview performance" },
    ],
    totalPoints: 100,
  },
  {
    id: "r4", event: "Forensic Science", category: "STEM", level: "High School",
    description: "Apply forensic science techniques to analyze evidence and solve a simulated crime scenario.",
    criteria: [
      { name: "Evidence Analysis", maxPoints: 35, description: "Accuracy and thoroughness of forensic analysis techniques" },
      { name: "Scientific Method", maxPoints: 25, description: "Proper application of scientific procedures and controls" },
      { name: "Conclusion & Reasoning", maxPoints: 25, description: "Logical deduction and evidence-based conclusions" },
      { name: "Presentation", maxPoints: 15, description: "Clarity and professionalism of the final report" },
    ],
    totalPoints: 100,
  },
  {
    id: "r5", event: "Architectural Design", category: "Engineering", level: "Middle & High School",
    description: "Create architectural drawings and a scale model based on the annual design challenge.",
    criteria: [
      { name: "Design Creativity", maxPoints: 25, description: "Originality, innovation, and aesthetic appeal of the design" },
      { name: "Technical Accuracy", maxPoints: 25, description: "Correct scale, dimensioning, and structural feasibility" },
      { name: "Model Construction", maxPoints: 25, description: "Craftsmanship, material use, and model accuracy" },
      { name: "Documentation", maxPoints: 15, description: "Floor plans, elevations, and written narrative" },
      { name: "Interview", maxPoints: 10, description: "Ability to explain design decisions and answer judge questions" },
    ],
    totalPoints: 100,
  },
  {
    id: "r6", event: "Prepared Presentation", category: "Leadership", level: "High School",
    description: "Deliver a researched presentation on a TSA-selected topic related to technology and society.",
    criteria: [
      { name: "Content & Research", maxPoints: 30, description: "Depth of research, accuracy, and relevance to the topic" },
      { name: "Organization", maxPoints: 20, description: "Clear introduction, body, and conclusion with logical flow" },
      { name: "Delivery", maxPoints: 25, description: "Eye contact, vocal variety, gestures, and confidence" },
      { name: "Visual Aids", maxPoints: 15, description: "Quality and effectiveness of supporting materials" },
      { name: "Q&A Response", maxPoints: 10, description: "Ability to answer judge questions thoughtfully" },
    ],
    totalPoints: 100,
  },
  {
    id: "r7", event: "Children's Stories", category: "Communication", level: "Middle School",
    description: "Write and illustrate an original children's story that incorporates the annual theme.",
    criteria: [
      { name: "Story Content", maxPoints: 30, description: "Creativity, age-appropriateness, and theme integration" },
      { name: "Illustrations", maxPoints: 25, description: "Quality, consistency, and story support of artwork" },
      { name: "Writing Quality", maxPoints: 20, description: "Grammar, vocabulary, and narrative structure" },
      { name: "Book Construction", maxPoints: 15, description: "Physical quality, binding, and overall presentation" },
      { name: "Interview", maxPoints: 10, description: "Explanation of creative process and design choices" },
    ],
    totalPoints: 100,
  },
  {
    id: "r8", event: "Biotechnology Design", category: "STEM", level: "High School",
    description: "Research and present a biotechnology solution to a real-world problem.",
    criteria: [
      { name: "Problem Identification", maxPoints: 20, description: "Clear definition of the problem and its significance" },
      { name: "Solution Design", maxPoints: 30, description: "Innovation, feasibility, and scientific basis of the solution" },
      { name: "Research Quality", maxPoints: 20, description: "Depth and breadth of background research with proper citations" },
      { name: "Presentation", maxPoints: 20, description: "Poster quality, verbal delivery, and visual aids" },
      { name: "Q&A", maxPoints: 10, description: "Knowledge demonstrated during judge questioning" },
    ],
    totalPoints: 100,
  },
];

const RUBRICS_LS_KEY = "clubconnect_rubrics_progress";

interface RubricProgress {
  rubricId: string;
  selfScores: Record<string, number>;
  notes: string;
}

function loadProgress(): RubricProgress[] {
  try { const s = localStorage.getItem(RUBRICS_LS_KEY); if (s) return JSON.parse(s); } catch {}
  return [];
}

export default function RubricsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<RubricProgress[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (cancelled) return;
        if (user) {
          setUserId(user.id);
          const { data } = await rubricProgressApi.getByUser(user.id);
          if (!cancelled && data && data.length > 0) {
            setProgress(data.map((row: any) => ({
              rubricId: row.rubric_id,
              selfScores: (row.scores as Record<string, number>) ?? {},
              notes: row.notes ?? "",
            })));
            return;
          }
        }
      } catch {}
      if (!cancelled) setProgress(loadProgress());
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Persist to localStorage on progress change
  useEffect(() => { try { localStorage.setItem(RUBRICS_LS_KEY, JSON.stringify(progress)); } catch {} }, [progress]);

  const categories = ["All", ...Array.from(new Set(RUBRICS.map(r => r.category)))];

  const filtered = RUBRICS.filter(r => {
    if (catFilter !== "All" && r.category !== catFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.event.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    }
    return true;
  });

  function getProgress(rubricId: string): RubricProgress | undefined {
    return progress.find(p => p.rubricId === rubricId);
  }

  function updateSelfScore(rubricId: string, criteriaName: string, score: number) {
    let updatedScores: Record<string, number> = {};
    setProgress(prev => {
      const existing = prev.find(p => p.rubricId === rubricId);
      if (existing) {
        updatedScores = { ...existing.selfScores, [criteriaName]: score };
        return prev.map(p => p.rubricId === rubricId ? { ...p, selfScores: updatedScores } : p);
      }
      updatedScores = { [criteriaName]: score };
      return [...prev, { rubricId, selfScores: updatedScores, notes: "" }];
    });
    if (userId) {
      void (async () => { try { await rubricProgressApi.upsert({ user_id: userId, rubric_id: rubricId, scores: updatedScores }); } catch {} })();
    }
  }

  function updateNotes(rubricId: string, notes: string) {
    setProgress(prev => {
      const existing = prev.find(p => p.rubricId === rubricId);
      const scores = existing?.selfScores ?? {};
      if (userId) {
        void (async () => { try { await rubricProgressApi.upsert({ user_id: userId, rubric_id: rubricId, scores, notes }); } catch {} })();
      }
      if (existing) {
        return prev.map(p => p.rubricId === rubricId ? { ...p, notes } : p);
      }
      return [...prev, { rubricId, selfScores: {}, notes }];
    });
  }

  const totalTracked = progress.filter(p => Object.keys(p.selfScores).length > 0).length;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-900 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-blue-200 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-heading font-bold flex items-center gap-3"><Trophy size={36} /> TSA Rubrics & Scoring</h1>
          <p className="mt-3 max-w-2xl text-blue-100 text-lg">Study competition rubrics, track your self-assessment scores, and prepare to win.</p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
            <div className="bg-white/10 p-3 text-center"><p className="text-xl font-bold">{RUBRICS.length}</p><p className="text-xs text-blue-200">Events</p></div>
            <div className="bg-white/10 p-3 text-center"><p className="text-xl font-bold">{categories.length - 1}</p><p className="text-xs text-blue-200">Categories</p></div>
            <div className="bg-white/10 p-3 text-center"><p className="text-xl font-bold">{totalTracked}</p><p className="text-xs text-blue-200">Tracked</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="card p-4 mb-6 grid sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="select-field text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select>
        </div>

        <div className="space-y-4">
          {filtered.map(rubric => {
            const rp = getProgress(rubric.id);
            const selfTotal = rp ? Object.values(rp.selfScores).reduce((s, v) => s + v, 0) : 0;
            const isExpanded = expandedId === rubric.id;
            return (
              <Reveal key={rubric.id}>
                <div className="card overflow-hidden">
                  <button onClick={() => setExpandedId(isExpanded ? null : rubric.id)} className="w-full p-5 text-left hover:bg-primary-50/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">{rubric.category}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{rubric.level}</span>
                          {selfTotal > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">{selfTotal}/{rubric.totalPoints} self-scored</span>}
                        </div>
                        <h3 className="font-bold text-primary-800 text-lg">{rubric.event}</h3>
                        <p className="text-sm text-neutral-600 mt-1">{rubric.description}</p>
                      </div>
                      <ChevronDown size={18} className={`text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-neutral-100 p-5 bg-neutral-50/50">
                      <h4 className="font-bold text-primary-700 text-sm mb-3 flex items-center gap-2"><CheckCircle size={14} /> Scoring Criteria</h4>
                      <div className="space-y-3">
                        {rubric.criteria.map(c => {
                          const score = rp?.selfScores[c.name] ?? 0;
                          return (
                            <div key={c.name} className="bg-white p-3 border border-neutral-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm text-primary-800">{c.name}</span>
                                <span className="text-xs text-neutral-500">Max: {c.maxPoints} pts</span>
                              </div>
                              <p className="text-xs text-neutral-500 mb-2">{c.description}</p>
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-neutral-600">Self-score:</label>
                                <input
                                  type="number" min={0} max={c.maxPoints}
                                  value={score} onChange={e => updateSelfScore(rubric.id, c.name, Math.min(c.maxPoints, Math.max(0, Number(e.target.value) || 0)))}
                                  className="input-field w-20 text-sm text-center"
                                />
                                <span className="text-xs text-neutral-400">/ {c.maxPoints}</span>
                                <div className="flex-1 h-2 bg-neutral-200 rounded-full ml-2">
                                  <div className={`h-2 rounded-full ${score >= c.maxPoints * 0.8 ? "bg-green-500" : score >= c.maxPoints * 0.5 ? "bg-yellow-500" : "bg-red-400"}`} style={{ width: `${(score / c.maxPoints) * 100}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-primary-50 border border-primary-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-primary-700">Total Self-Score</span>
                          <span className={`text-lg font-bold ${selfTotal >= rubric.totalPoints * 0.8 ? "text-green-600" : selfTotal >= rubric.totalPoints * 0.5 ? "text-yellow-600" : "text-red-500"}`}>{selfTotal} / {rubric.totalPoints}</span>
                        </div>
                        <div className="h-3 bg-white rounded-full">
                          <div className={`h-3 rounded-full transition-all ${selfTotal >= rubric.totalPoints * 0.8 ? "bg-green-500" : selfTotal >= rubric.totalPoints * 0.5 ? "bg-yellow-500" : "bg-red-400"}`} style={{ width: `${(selfTotal / rubric.totalPoints) * 100}%` }} />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="text-xs font-semibold text-neutral-600 mb-1 block">Prep Notes</label>
                        <textarea
                          value={rp?.notes || ""}
                          onChange={e => updateNotes(rubric.id, e.target.value)}
                          placeholder="Add your preparation notes, areas to improve, practice plan..."
                          className="input-field text-sm w-full h-20 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center"><FileText size={40} className="mx-auto text-neutral-300" /><p className="mt-3 text-neutral-500">No rubrics match your search.</p></div>
        )}
      </div>
    </div>
  );
}
