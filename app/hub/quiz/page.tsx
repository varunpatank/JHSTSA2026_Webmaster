"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import {
  ArrowRight, CheckCircle, ChevronRight, Lightbulb, Star, Sparkles
} from "lucide-react";
import { supabase, clubFinderResultsApi } from "@/lib/api";

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

interface QuizQuestion {
  id: number; question: string; options: { text: string; categories: string[] }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "What excites you most about joining a club?", options: [
    { text: "Building and creating things with my hands", categories: ["STEM", "Arts"] },
    { text: "Competing and winning awards", categories: ["Academic", "STEM"] },
    { text: "Making a difference in my community", categories: ["Service", "Cultural"] },
    { text: "Meeting new people and having fun", categories: ["Social", "Cultural"] },
  ]},
  { id: 2, question: "How do you prefer to spend your free time?", options: [
    { text: "Coding, tinkering, or experimenting", categories: ["STEM"] },
    { text: "Drawing, writing, or performing", categories: ["Arts"] },
    { text: "Volunteering or helping others", categories: ["Service"] },
    { text: "Debating ideas or researching topics", categories: ["Academic"] },
  ]},
  { id: 3, question: "What kind of team role suits you best?", options: [
    { text: "The problem solver — I love finding solutions", categories: ["STEM", "Academic"] },
    { text: "The creative — I bring fresh ideas and designs", categories: ["Arts"] },
    { text: "The organizer — I keep everything on track", categories: ["Academic", "Service"] },
    { text: "The connector — I bring people together", categories: ["Social", "Cultural"] },
  ]},
  { id: 4, question: "What would you most like to develop?", options: [
    { text: "Technical skills (coding, engineering, science)", categories: ["STEM"] },
    { text: "Leadership and public speaking", categories: ["Academic", "Service"] },
    { text: "Creative expression and artistic skills", categories: ["Arts"] },
    { text: "Cultural awareness and global perspective", categories: ["Cultural", "Academic"] },
  ]},
  { id: 5, question: "What type of events interest you most?", options: [
    { text: "Hackathons, science fairs, or robotics competitions", categories: ["STEM"] },
    { text: "Art shows, performances, or film screenings", categories: ["Arts"] },
    { text: "Community service days and fundraisers", categories: ["Service"] },
    { text: "Conferences, debates, or cultural festivals", categories: ["Academic", "Cultural"] },
  ]},
];

const LS_QUIZ = "clubconnect_quiz_results";

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (cancelled) return;
        if (user) {
          setUserId(user.id);
          const { data } = await clubFinderResultsApi.getByUser(user.id);
          if (!cancelled && data && Array.isArray(data.answers) && data.answers.length === QUIZ_QUESTIONS.length) {
            setAnswers(data.answers as number[]);
            setShowResults(true);
            return;
          }
        }
      } catch {}
      // Fall back to localStorage
      if (!cancelled) {
        try {
          const saved = localStorage.getItem(LS_QUIZ);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length === QUIZ_QUESTIONS.length) {
              setAnswers(parsed); setShowResults(true);
            }
          }
        } catch {}
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleAnswer(optionIndex: number) {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
      // Calculate top categories for DB storage
      const scores: Record<string, number> = {};
      newAnswers.forEach((optIdx, qIdx) => {
        const selectedOption = QUIZ_QUESTIONS[qIdx]?.options[optIdx];
        if (selectedOption) {
          selectedOption.categories.forEach(cat => { scores[cat] = (scores[cat] || 0) + 1; });
        }
      });
      const topCategories = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([cat]) => cat);
      // Save to localStorage as fallback
      try { localStorage.setItem(LS_QUIZ, JSON.stringify(newAnswers)); } catch {}
      // Save to DB if logged in
      if (userId) {
        void (async () => { try { await clubFinderResultsApi.upsert({ user_id: userId, answers: newAnswers, top_categories: topCategories }); } catch {} })();
      }
    }
  }

  function reset() {
    setCurrent(0); setAnswers([]); setShowResults(false);
    try { localStorage.removeItem(LS_QUIZ); } catch {};
    if (userId) {
      // Clear DB record by upserting empty state (will be overwritten on next completion)
      void (async () => { try { await clubFinderResultsApi.upsert({ user_id: userId, answers: [], top_categories: [] }); } catch {} })();
    }
  }
  function getResults() {
    const scores: Record<string, number> = {};
    answers.forEach((optIdx, qIdx) => {
      const question = QUIZ_QUESTIONS[qIdx];
      const selectedOption = question.options[optIdx];
      if (selectedOption) {
        selectedOption.categories.forEach(cat => { scores[cat] = (scores[cat] || 0) + 1; });
      }
    });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topCategories = sorted.slice(0, 2).map(([cat]) => cat);
    const matchedClubs = chapters.filter(ch => topCategories.some(cat => ch.category?.toLowerCase().includes(cat.toLowerCase()))).slice(0, 4);
    return { topCategories, matchedClubs, scores: sorted };
  }

  const q = QUIZ_QUESTIONS[current];

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-900 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Link href="/hub" className="text-sm text-fuchsia-100 hover:underline mb-2 inline-block">← Back to Hub</Link>
          <h1 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-heading font-bold flex items-start gap-3"><Sparkles size={28} className="sm:w-9 sm:h-9 shrink-0" /> Club Finder Quiz</h1>
          <p className="mt-3 max-w-2xl text-fuchsia-50 text-lg">Answer 5 quick questions and we&rsquo;ll match you with the perfect clubs for your interests.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {!showResults ? (
          <Reveal key={current}>
            <div className="card p-8">
              {}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-neutral-400 mb-1"><span>Question {current + 1} of {QUIZ_QUESTIONS.length}</span><span>{Math.round(((current) / QUIZ_QUESTIONS.length) * 100)}%</span></div>
                <div className="h-2 bg-neutral-200 rounded-full"><div className="h-2 bg-fuchsia-500 rounded-full transition-all" style={{ width: `${(current / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
              </div>

              <h2 className="text-2xl font-heading font-bold text-primary-800 mb-6">{q.question}</h2>

              <div className="space-y-3">
                {q.options.map((option, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="w-full p-4 text-left  border-2 border-neutral-200 hover:border-fuchsia-300 hover:bg-fuchsia-50/30 transition-all text-neutral-700 hover:text-primary-800 font-medium">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-fuchsia-100 text-fuchsia-600 text-sm font-bold mr-3">{String.fromCharCode(65 + i)}</span>
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        ) : (
          (() => {
            const results = getResults();
            return (
              <Reveal>
                <div className="card p-8">
                  <div className="text-center mb-6">
                    <span className="text-5xl mb-3 block">🎯</span>
                    <h2 className="text-2xl font-heading font-bold text-primary-800">Your Results!</h2>
                    <p className="text-neutral-500 mt-1">Based on your answers, here are your top interests:</p>
                  </div>

                  {}
                  <div className="flex justify-center gap-3 mb-6">
                    {results.topCategories.map(cat => (
                      <span key={cat} className="text-sm px-4 py-2  bg-fuchsia-100 text-fuchsia-700 font-bold">{cat}</span>
                    ))}
                  </div>

                  {}
                  <div className="mb-6 space-y-2">
                    {results.scores.map(([cat, score]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-0.5"><span className="text-neutral-600">{cat}</span><span className="font-semibold text-primary-700">{score} pts</span></div>
                        <div className="h-2 bg-neutral-200 rounded-full"><div className="h-2 bg-fuchsia-500 rounded-full" style={{ width: `${(score / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>

                  {}
                  <h3 className="font-bold text-primary-700 text-lg mb-3">Recommended Clubs For You</h3>
                  {results.matchedClubs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {results.matchedClubs.map(club => (
                        <Link key={club.id} href={`/directory/${club.id}`} className="card p-4 hover:bg-primary-50/30 transition-colors border border-neutral-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10  bg-primary-100 flex items-center justify-center text-primary-600 text-lg">⭐</div>
                            <div>
                              <h4 className="font-bold text-primary-800 text-sm">{club.name}</h4>
                              <p className="text-xs text-neutral-500">{club.category} · {club.memberCount ?? "30+"} members</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500 mb-6">Check out the <Link href="/directory" className="text-primary-600 underline">full directory</Link> to explore all clubs!</p>
                  )}

                  <div className="flex justify-center gap-3">
                    <button onClick={reset} className="btn-secondary text-sm">Retake Quiz</button>
                    <Link href="/directory" className="btn-primary text-sm flex items-center gap-1">Browse All Clubs <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </Reveal>
            );
          })()
        )}
      </div>
    </div>
  );
}
