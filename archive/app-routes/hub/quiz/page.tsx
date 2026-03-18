'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { chapters } from '@/lib/data';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: { [key: string]: number };
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What gets you most excited about after-school activities?",
    options: [
      { text: "Building and creating things with my hands", scores: { STEM: 3, Arts: 1 } },
      { text: "Competing and winning against other teams", scores: { Academic: 2, STEM: 2 } },
      { text: "Helping others and making a difference", scores: { Service: 3, Cultural: 1 } },
      { text: "Expressing myself and performing", scores: { Arts: 3, Cultural: 1 } },
      { text: "Learning about different cultures and perspectives", scores: { Cultural: 3, Service: 1 } }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to work?",
    options: [
      { text: "In a small, focused team on technical projects", scores: { STEM: 3, Academic: 1 } },
      { text: "In a large group with lots of social interaction", scores: { Service: 2, Cultural: 2, Arts: 1 } },
      { text: "Independently with occasional collaboration", scores: { Academic: 3, Arts: 1 } },
      { text: "Leading others toward a common goal", scores: { Service: 2, Cultural: 1, Academic: 1 } }
    ]
  },
  {
    id: 3,
    question: "What skill do you most want to develop?",
    options: [
      { text: "Technical and problem-solving skills", scores: { STEM: 3, Academic: 2 } },
      { text: "Public speaking and debate", scores: { Academic: 3, Cultural: 1 } },
      { text: "Creativity and artistic expression", scores: { Arts: 3, Cultural: 1 } },
      { text: "Leadership and organization", scores: { Service: 2, Academic: 1, Cultural: 1 } },
      { text: "Cultural awareness and communication", scores: { Cultural: 3, Service: 1 } }
    ]
  },
  {
    id: 4,
    question: "What type of events interest you most?",
    options: [
      { text: "Hackathons and building competitions", scores: { STEM: 3 } },
      { text: "Academic competitions and tournaments", scores: { Academic: 3 } },
      { text: "Performances, shows, and exhibitions", scores: { Arts: 3 } },
      { text: "Community service projects and fundraisers", scores: { Service: 3 } },
      { text: "Cultural celebrations and awareness events", scores: { Cultural: 3 } }
    ]
  },
  {
    id: 5,
    question: "What career field interests you?",
    options: [
      { text: "Engineering, technology, or science", scores: { STEM: 3, Academic: 1 } },
      { text: "Law, business, or politics", scores: { Academic: 3, Cultural: 1 } },
      { text: "Arts, entertainment, or design", scores: { Arts: 3 } },
      { text: "Healthcare, education, or social work", scores: { Service: 3, Cultural: 1 } },
      { text: "International relations or languages", scores: { Cultural: 3, Academic: 1 } }
    ]
  },
  {
    id: 6,
    question: "How much time can you commit weekly?",
    options: [
      { text: "1-2 hours (light commitment)", scores: { Cultural: 1, Arts: 1, Service: 1 } },
      { text: "3-5 hours (moderate commitment)", scores: { Academic: 2, Service: 2, Arts: 2 } },
      { text: "6-10 hours (significant commitment)", scores: { STEM: 2, Academic: 2 } },
      { text: "10+ hours (intensive commitment)", scores: { STEM: 3, Academic: 3 } }
    ]
  },
  {
    id: 7,
    question: "What motivates you most?",
    options: [
      { text: "Solving complex problems and innovating", scores: { STEM: 3, Academic: 1 } },
      { text: "Recognition and achievement", scores: { Academic: 3, STEM: 1 } },
      { text: "Creative expression and self-discovery", scores: { Arts: 3, Cultural: 1 } },
      { text: "Making an impact on my community", scores: { Service: 3 } },
      { text: "Connecting with diverse people", scores: { Cultural: 3, Service: 1 } }
    ]
  }
];

export default function ClubFinderQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    STEM: 0,
    Academic: 0,
    Arts: 0,
    Service: 0,
    Cultural: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const question = quizQuestions[currentQuestion];
    const option = question.options[optionIndex];
    
    // Update scores
    const newScores = { ...scores };
    Object.entries(option.scores).forEach(([category, score]) => {
      newScores[category] = (newScores[category] || 0) + score;
    });
    setScores(newScores);
    
    // Track answer
    setAnswers([...answers, optionIndex]);
    
    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getTopCategories = () => {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const getRecommendedClubs = () => {
    const topCategories = getTopCategories().map(([cat]) => cat);
    return chapters
      .filter(club => topCategories.includes(club.category))
      .slice(0, 6);
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      STEM: '🔬',
      Academic: '📚',
      Arts: '🎨',
      Service: '❤️',
      Cultural: '🌍'
    };
    return emojis[category] || '⭐';
  };

  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      STEM: "You're a problem-solver who loves building, experimenting, and innovating. You thrive when tackling technical challenges.",
      Academic: "You have a competitive spirit and love intellectual challenges. Debate, competitions, and academic excellence motivate you.",
      Arts: "You're creative and expressive. Whether it's visual arts, music, theater, or writing, you love bringing ideas to life.",
      Service: "You're driven by making a difference. Helping others and contributing to your community gives you purpose.",
      Cultural: "You value diversity and connection. Learning about different cultures and bringing people together inspires you."
    };
    return descriptions[category] || '';
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScores({ STEM: 0, Academic: 0, Arts: 0, Service: 0, Cultural: 0 });
    setShowResults(false);
    setIsStarted(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero - Only show when not started */}
      {!isStarted && (
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1920&q=80"
              alt="Students"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 to-pink-600/80"></div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
              ← Back to Hub
            </Link>
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
              Club Finder Quiz
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Not sure which club is right for you? Take our quick personality quiz to discover 
              clubs that match your interests, goals, and available time.
            </p>
            <button
              onClick={() => setIsStarted(true)}
              className="btn-secondary text-lg px-8 py-3"
            >
              Start Quiz →
            </button>
            <p className="text-white/70 mt-4 text-sm">Takes about 2 minutes • 7 questions</p>
          </div>
        </section>
      )}

      {/* Quiz Section */}
      {isStarted && !showResults && (
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-neutral-600 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-3 bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-primary-500 font-heading mb-8 text-center">
                {quizQuestions[currentQuestion].question}
              </h2>

              <div className="space-y-4">
                {quizQuestions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full p-4 text-left border-2 border-neutral-200 hover:border-primary-400 hover:bg-primary-50 transition-all group"
                  >
                    <span className="font-medium text-neutral-700 group-hover:text-primary-600">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={resetQuiz}
                  className="text-neutral-500 hover:text-neutral-700 text-sm"
                >
                  Start Over
                </button>
                {currentQuestion > 0 && (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    ← Previous
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showResults && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Results Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-500 font-heading mb-4">
                Your Results Are In!
              </h1>
              <p className="text-neutral-600 text-lg">
                Based on your answers, here&apos;s your club personality profile
              </p>
            </div>

            {/* Top Category */}
            <div className="card p-8 mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="text-center">
                <div className="text-5xl mb-4">{getCategoryEmoji(getTopCategories()[0][0])}</div>
                <h2 className="text-2xl font-bold text-primary-500 font-heading mb-2">
                  Your Top Match: {getTopCategories()[0][0]} Clubs
                </h2>
                <p className="text-neutral-600 max-w-2xl mx-auto">
                  {getCategoryDescription(getTopCategories()[0][0])}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="card p-6 mb-8">
              <h3 className="font-bold text-neutral-700 font-heading mb-6">Your Interest Profile</h3>
              <div className="space-y-4">
                {getTopCategories().map(([category, score], idx) => {
                  const maxScore = Math.max(...Object.values(scores));
                  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-neutral-700">
                          {getCategoryEmoji(category)} {category}
                        </span>
                        <span className="text-neutral-500">{score} points</span>
                      </div>
                      <div className="h-4 bg-neutral-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            idx === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            idx === 1 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                            'bg-gradient-to-r from-neutral-400 to-neutral-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Clubs */}
            <div className="mb-8">
              <h3 className="section-title mb-6">Recommended Clubs For You</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getRecommendedClubs().map(club => (
                  <Link
                    key={club.id}
                    href={`/directory/${club.id}`}
                    className="card-hover p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 flex items-center justify-center text-xl flex-shrink-0">
                        {getCategoryEmoji(club.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-500 font-heading mb-1">{club.name}</h4>
                        <p className="text-xs text-neutral-500 mb-2">{club.category} • {club.memberCount} members</p>
                        <p className="text-sm text-neutral-600 line-clamp-2">{club.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/directory" className="btn-primary">
                Browse All Clubs
              </Link>
              <Link href="/hub/compare" className="btn-outline">
                Compare Clubs
              </Link>
              <button onClick={resetQuiz} className="btn-outline">
                Retake Quiz
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tips (show on start page) */}
      {!isStarted && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="section-title text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 flex items-center justify-center mx-auto mb-4 text-3xl">
                  1️⃣
                </div>
                <h3 className="font-bold text-neutral-700 mb-2 font-heading">Answer Questions</h3>
                <p className="text-sm text-neutral-600">
                  Tell us about your interests, goals, and how much time you can commit.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 flex items-center justify-center mx-auto mb-4 text-3xl">
                  2️⃣
                </div>
                <h3 className="font-bold text-neutral-700 mb-2 font-heading">Get Your Profile</h3>
                <p className="text-sm text-neutral-600">
                  Discover which club categories match your personality and preferences.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 flex items-center justify-center mx-auto mb-4 text-3xl">
                  3️⃣
                </div>
                <h3 className="font-bold text-neutral-700 mb-2 font-heading">Explore Matches</h3>
                <p className="text-sm text-neutral-600">
                  See personalized club recommendations and learn more about each one.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
