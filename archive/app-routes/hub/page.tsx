'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { starterGuides, hubStats } from '@/lib/hubData';
import { StarterGuideCategory } from '@/types';

const categories: StarterGuideCategory[] = [
  'Getting Started',
  'Constitution & Bylaws',
  'Recruiting Members',
  'Running Meetings',
  'Event Planning',
  'Fundraising',
  'Marketing',
  'Leadership',
  'Advisor Relations',
  'Competitions'
];

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-700 border-green-300',
  'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Advanced': 'bg-red-100 text-red-700 border-red-300'
};

export default function HubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const filteredGuides = useMemo(() => {
    return starterGuides.filter((guide) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          guide.title.toLowerCase().includes(query) ||
          guide.description.toLowerCase().includes(query) ||
          guide.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedCategory && guide.category !== selectedCategory) return false;
      if (selectedDifficulty && guide.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const popularGuides = starterGuides.sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
            alt="Students collaborating"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 via-primary-500/85 to-primary-500/70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-secondary-500 text-white px-4 py-1 text-sm font-semibold mb-4">
              📚 Student Resource Hub
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
              Club Starter Toolkit
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Everything you need to start, grow, and lead a successful school club. From your first idea 
              to winning competitions — we&apos;ve got you covered with comprehensive guides, templates, and expert advice.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#guides" className="btn-secondary">
                Browse Guides
              </Link>
              <Link href="/hub/ideas" className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-primary-500 transition-all rounded-lg">
                Get Club Ideas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b border-neutral-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-primary-500 font-heading">{hubStats.totalGuides}</div>
              <div className="text-sm text-neutral-600">Guides</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-primary-500 font-heading">{hubStats.totalCompetitions}</div>
              <div className="text-sm text-neutral-600">Competitions</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-primary-500 font-heading">{hubStats.totalMentors}</div>
              <div className="text-sm text-neutral-600">Mentors</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-secondary-500 font-heading">{hubStats.resourcesDownloaded.toLocaleString()}</div>
              <div className="text-sm text-neutral-600">Downloads</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-secondary-500 font-heading">{hubStats.mentorshipSessionsCompleted}</div>
              <div className="text-sm text-neutral-600">Mentorship Sessions</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-secondary-500 font-heading">{hubStats.collaborationsFormed}</div>
              <div className="text-sm text-neutral-600">Collaborations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center mb-8">Explore the Hub</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/hub/ideas" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 text-2xl">
                💡
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Club Ideas Generator</h3>
              <p className="text-sm text-neutral-600">Browse unique club ideas or submit your own. Find inspiration for your next venture.</p>
            </Link>

            <Link href="/hub/competitions" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 text-2xl">
                🏆
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Competition Hub</h3>
              <p className="text-sm text-neutral-600">Discover competitions, track preparation, and learn from past winners.</p>
            </Link>

            <Link href="/hub/mentors" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 text-2xl">
                🤝
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Mentor Network</h3>
              <p className="text-sm text-neutral-600">Connect with alumni, advisors, and experts for guidance and support.</p>
            </Link>

            <Link href="/hub/collaborate" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 text-2xl">
                🔗
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Collaboration Finder</h3>
              <p className="text-sm text-neutral-600">Partner with other clubs for events, fundraisers, and joint initiatives.</p>
            </Link>

            <Link href="/hub/stories" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mb-4 text-2xl">
                ⭐
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Success Stories</h3>
              <p className="text-sm text-neutral-600">Learn from student leaders who transformed their clubs and communities.</p>
            </Link>

            <Link href="/hub/health" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 text-2xl">
                📊
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Club Health Dashboard</h3>
              <p className="text-sm text-neutral-600">Track your club&apos;s performance metrics and get actionable insights.</p>
            </Link>

            <Link href="/hub/compare" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 text-2xl">
                ⚖️
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Club Comparison Tool</h3>
              <p className="text-sm text-neutral-600">Compare clubs side-by-side to find the perfect fit for your interests.</p>
            </Link>

            <Link href="/hub/quiz" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 text-2xl">
                🎯
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Club Finder Quiz</h3>
              <p className="text-sm text-neutral-600">Take a personality quiz to discover clubs that match your interests.</p>
            </Link>

            <Link href="/hub/achievements" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 text-2xl">
                🎖️
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Achievements & Badges</h3>
              <p className="text-sm text-neutral-600">Track your club involvement and earn recognition for your contributions.</p>
            </Link>

            <Link href="/hub/calendar" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 text-2xl">
                📅
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Events Calendar</h3>
              <p className="text-sm text-neutral-600">View all club events, sync to your calendar, and never miss a meeting.</p>
            </Link>

            <Link href="/hub/request" className="card-hover p-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 text-2xl">
                📝
              </div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Request Resources</h3>
              <p className="text-sm text-neutral-600">Submit requests for new resources or suggest improvements to existing ones.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Personal Features Callout */}
      <section className="py-12 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-3">Looking for Personal Features?</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Visit the Student Hub for your personal dashboard, goal tracking, collections, and club management tools.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/student-hub" className="bg-white/10 backdrop-blur p-6 border border-white/20 hover:bg-white/20 transition-all group">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2">Student Hub</h3>
              <p className="text-sm text-white/80">Your personal hub with dashboard, goals, collections, and more.</p>
            </Link>

            <Link href="/hub/external" className="bg-white/10 backdrop-blur p-6 border border-white/20 hover:bg-white/20 transition-all group">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="font-bold text-lg mb-2">External Resources</h3>
              <p className="text-sm text-white/80">100+ curated links to tools, courses, and websites for club success.</p>
            </Link>

            <Link href="/student-hub/collections" className="bg-white/10 backdrop-blur p-6 border border-white/20 hover:bg-white/20 transition-all group">
              <div className="text-4xl mb-3">📂</div>
              <h3 className="font-bold text-lg mb-2">My Collections</h3>
              <p className="text-sm text-white/80">Organize your favorite resources into custom collections and share them.</p>
            </Link>

            <Link href="/student-hub/goals" className="bg-white/10 backdrop-blur p-6 border border-white/20 hover:bg-white/20 transition-all group">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg mb-2">Goal Tracker</h3>
              <p className="text-sm text-white/80">Set goals, track milestones, and journal your leadership journey.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* NEW: Club Management Section */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-sm font-semibold text-secondary-500 mb-2 block">FOR CLUB OFFICERS</span>
              <h2 className="text-3xl font-bold font-heading text-primary-500 mb-4">Manage Your Club</h2>
              <p className="text-neutral-600 mb-6">
                Create your club&apos;s profile page, manage officers, post announcements, schedule events, 
                and engage with your members — all from one powerful dashboard.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                  <span className="text-neutral-700">Custom club profile with branding</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                  <span className="text-neutral-700">Officer management system</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                  <span className="text-neutral-700">Event scheduling & announcements</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                  <span className="text-neutral-700">Live preview of public page</span>
                </li>
              </ul>
              <Link href="/student-hub/manage-club" className="btn-primary">
                Open Club Manager →
              </Link>
            </div>
            <div className="bg-white border border-neutral-200 shadow-xl p-6">
              <div className="bg-neutral-100 h-48 flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">🔧</div>
                  <div className="font-bold text-neutral-600">Club Manager Preview</div>
                </div>
              </div>
              <div className="flex gap-2">
                {['Profile', 'Officers', 'Events', 'Settings'].map(tab => (
                  <span key={tab} className="px-3 py-1 bg-neutral-100 text-neutral-500 text-sm">{tab}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Popular Guides */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title mb-0">🔥 Most Popular Guides</h2>
            <Link href="#guides" className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {popularGuides.map((guide, index) => (
              <Link key={guide.id} href={`/hub/guides/${guide.id}`} className="card-hover overflow-hidden group">
                <div className={`p-4 ${index === 0 ? 'bg-gradient-to-r from-primary-500 to-primary-600' : index === 1 ? 'bg-gradient-to-r from-secondary-500 to-secondary-600' : 'bg-gradient-to-r from-accent-500 to-accent-600'} text-white`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">#{index + 1}</span>
                    <span className="text-white/80 text-sm">{guide.views.toLocaleString()} views</span>
                  </div>
                  <h3 className="font-bold text-lg font-heading">{guide.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-neutral-600 mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-xs font-semibold border ${difficultyColors[guide.difficulty]}`}>
                      {guide.difficulty}
                    </span>
                    <span className="text-xs text-neutral-500">⏱️ {guide.estimatedTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Guides Section */}
      <section id="guides" className="py-12 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">All Guides & Resources</h2>
          
          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select-field"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="select-field"
              >
                <option value="">All Difficulty Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Guides Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Link key={guide.id} href={`/hub/guides/${guide.id}`} className="card-hover p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <span className="badge bg-primary-100 text-primary-700">{guide.category}</span>
                  <span className={`px-2 py-0.5 text-xs font-semibold border ${difficultyColors[guide.difficulty]}`}>
                    {guide.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading group-hover:text-secondary-500 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{guide.description}</p>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>⏱️ {guide.estimatedTime}</span>
                  <span>📖 {guide.steps.length} steps</span>
                  <span>👁️ {guide.views.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No guides found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedDifficulty(''); }}
                className="text-primary-500 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Request Resource CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Can&apos;t Find What You Need?</h2>
          <p className="text-lg text-white/90 mb-8">
            Request new resources, guides, or templates. We&apos;re constantly expanding based on student needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/hub/request" className="btn-secondary">
              Request a Resource
            </Link>
            <Link href="/hub/submit-idea" className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-primary-500 transition-all rounded-lg">
              Submit a Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Footer */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="font-bold text-lg text-primary-500 mb-6 font-heading">Quick Links by Topic</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); document.getElementById('guides')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 hover:text-primary-500 transition-colors border border-neutral-200 text-sm"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
