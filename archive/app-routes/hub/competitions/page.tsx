'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { competitions } from '@/lib/hubData';
import { ChapterCategory } from '@/types';

const categories: ChapterCategory[] = ['Academic', 'Arts', 'Service', 'Cultural', 'STEM', 'Sports', 'Leadership', 'Media', 'Other'];

const difficultyColors = {
  'Beginner-Friendly': 'bg-green-100 text-green-700 border-green-300',
  'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Advanced': 'bg-orange-100 text-orange-700 border-orange-300',
  'Elite': 'bg-red-100 text-red-700 border-red-300'
};

export default function CompetitionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedLocationType, setSelectedLocationType] = useState<string>('');
  const [expandedComp, setExpandedComp] = useState<string | null>(null);
  const [trackedComps, setTrackedComps] = useState<string[]>([]);

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          comp.name.toLowerCase().includes(query) ||
          comp.organization.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedCategory && comp.category !== selectedCategory) return false;
      if (selectedDifficulty && comp.difficulty !== selectedDifficulty) return false;
      if (selectedLocationType && comp.locationType !== selectedLocationType) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedLocationType]);

  const featuredCompetitions = competitions.filter(c => c.isFeatured);
  const upcomingDeadlines = competitions
    .filter(c => new Date(c.registrationDeadline) > new Date())
    .sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime())
    .slice(0, 5);

  const toggleTrack = (compId: string) => {
    setTrackedComps(prev => 
      prev.includes(compId) 
        ? prev.filter(id => id !== compId)
        : [...prev, compId]
    );
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=80"
            alt="Competition success"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/95 to-amber-500/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            🏆 Competition Hub
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Discover competitions across every interest, track your preparation, and learn from past winners. 
            Your next trophy starts here!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#competitions" className="btn-secondary">
              Browse Competitions
            </Link>
            {trackedComps.length > 0 && (
              <div className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 rounded-lg">
                📋 Tracking {trackedComps.length} competition{trackedComps.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Deadlines Alert */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-white font-bold whitespace-nowrap">⏰ Upcoming Deadlines:</span>
            {upcomingDeadlines.map((comp) => (
              <Link
                key={comp.id}
                href={`#${comp.id}`}
                className="bg-white/20 text-white px-3 py-1 text-sm whitespace-nowrap hover:bg-white/30 transition-colors"
              >
                {comp.name.split(' ').slice(0, 2).join(' ')} - {new Date(comp.registrationDeadline).toLocaleDateString()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Competitions */}
      {featuredCompetitions.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="section-title mb-8">⭐ Featured Competitions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCompetitions.map((comp) => (
                <div key={comp.id} className="card-hover overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                    <span className="text-3xl mb-3 block">🏆</span>
                    <h3 className="font-bold text-xl font-heading mb-2">{comp.name}</h3>
                    <p className="text-white/80 text-sm">{comp.organization}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{comp.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-semibold border ${difficultyColors[comp.difficulty]}`}>
                        {comp.difficulty}
                      </span>
                      <span className="text-xs text-neutral-500">{comp.competitionDates}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section id="competitions" className="py-8 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search competitions..."
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
              <option value="Beginner-Friendly">Beginner-Friendly</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Elite">Elite</option>
            </select>
            <select
              value={selectedLocationType}
              onChange={(e) => setSelectedLocationType(e.target.value)}
              className="select-field"
            >
              <option value="">All Formats</option>
              <option value="In-Person">In-Person</option>
              <option value="Virtual">Virtual</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </section>

      {/* Competitions List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-neutral-600 mb-6">{filteredCompetitions.length} competitions found</p>

          <div className="space-y-6">
            {filteredCompetitions.map((comp) => (
              <div 
                key={comp.id}
                id={comp.id}
                className={`card overflow-hidden ${trackedComps.includes(comp.id) ? 'ring-2 ring-secondary-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Main Info */}
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="badge bg-primary-100 text-primary-700">{comp.category}</span>
                        <span className={`px-2 py-1 text-xs font-semibold border ${difficultyColors[comp.difficulty]}`}>
                          {comp.difficulty}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold bg-neutral-100 text-neutral-600">
                          {comp.locationType}
                        </span>
                        {trackedComps.includes(comp.id) && (
                          <span className="px-2 py-1 text-xs font-semibold bg-secondary-100 text-secondary-700">
                            📋 Tracking
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-xl text-primary-500 font-heading mb-1">{comp.name}</h3>
                      <p className="text-secondary-600 text-sm mb-3">by {comp.organization}</p>
                      <p className="text-neutral-600 mb-4">{comp.description}</p>

                      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500 block">Registration Deadline</span>
                          <span className="font-semibold text-primary-500">
                            {new Date(comp.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Competition Dates</span>
                          <span className="font-semibold">{comp.competitionDates}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Location</span>
                          <span className="font-semibold">{comp.location}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Entry Fee</span>
                          <span className="font-semibold">{comp.entryFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[150px]">
                      <button
                        onClick={() => toggleTrack(comp.id)}
                        className={`flex-1 lg:w-full py-2 px-4 font-semibold transition-all text-center
                          ${trackedComps.includes(comp.id)
                            ? 'bg-secondary-500 text-white'
                            : 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50'
                          }`}
                      >
                        {trackedComps.includes(comp.id) ? '✓ Tracking' : '+ Track'}
                      </button>
                      <a
                        href={comp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:w-full py-2 px-4 btn-outline text-center text-sm"
                      >
                        Visit Website ↗
                      </a>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedComp === comp.id && (
                    <div className="mt-6 pt-6 border-t border-neutral-200 grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-primary-500 mb-3">Eligibility Requirements</h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                          {comp.eligibility.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-neutral-400">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-primary-500 mb-3">Team Size</h4>
                        <p className="text-sm text-neutral-600">{comp.teamSize}</p>

                        <h4 className="font-semibold text-primary-500 mb-3 mt-4">Prizes</h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                          {comp.prizes.map((prize, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-secondary-500">🏅</span>
                              {prize}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {comp.preparationResources.length > 0 && (
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-primary-500 mb-3">Preparation Resources</h4>
                          <div className="flex flex-wrap gap-2">
                            {comp.preparationResources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                className="px-3 py-2 bg-neutral-100 hover:bg-primary-50 text-neutral-700 text-sm transition-colors flex items-center gap-2"
                              >
                                {resource.type === 'Video' && '🎬'}
                                {resource.type === 'Guide' && '📖'}
                                {resource.type === 'Practice' && '✍️'}
                                {resource.type === 'Template' && '📄'}
                                {resource.type === 'External' && '🔗'}
                                {resource.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {comp.schoolParticipationHistory.length > 0 && (
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-primary-500 mb-3">Our School&apos;s History</h4>
                          <div className="space-y-3">
                            {comp.schoolParticipationHistory.map((history, idx) => (
                              <div key={idx} className="bg-green-50 border border-green-200 p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-bold text-green-700">{history.year}</span>
                                  {history.placement && (
                                    <span className="badge bg-green-200 text-green-800">{history.placement}</span>
                                  )}
                                </div>
                                <p className="text-sm text-green-700">
                                  Participants: {history.participants.join(', ')}
                                </p>
                                {history.highlights && (
                                  <p className="text-sm text-green-600 mt-1 italic">{history.highlights}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
                  <button
                    onClick={() => setExpandedComp(expandedComp === comp.id ? null : comp.id)}
                    className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
                  >
                    {expandedComp === comp.id ? 'Show Less ↑' : 'Show Details ↓'}
                  </button>
                  <span className="text-xs text-neutral-500">
                    {comp.pastWinners && comp.pastWinners.length > 0 
                      ? `🏆 Past Winners: ${comp.pastWinners[0]}`
                      : ''
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredCompetitions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No competitions match your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedDifficulty(''); setSelectedLocationType(''); }}
                className="text-primary-500 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Competition Tracker CTA */}
      {trackedComps.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-xl font-heading">You&apos;re tracking {trackedComps.length} competition{trackedComps.length > 1 ? 's' : ''}!</h3>
                <p className="text-white/80">Sign up to receive deadline reminders and preparation tips.</p>
              </div>
              <div className="flex gap-4">
                <button className="bg-white text-secondary-600 px-6 py-2 font-semibold hover:bg-secondary-50 transition-colors">
                  Set Up Reminders
                </button>
                <Link 
                  href="/hub/calendar"
                  className="bg-white/20 backdrop-blur px-6 py-2 font-semibold border border-white/50 hover:bg-white/30 transition-colors"
                >
                  Add to Calendar
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tips Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">💡 Competition Success Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Start Early</h3>
              <p className="text-sm text-neutral-600">
                Begin preparation at least 3 months before the competition. Quality work takes time to develop and refine.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Study Past Winners</h3>
              <p className="text-sm text-neutral-600">
                Review winning entries from previous years to understand what judges look for and calibrate your work.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="font-bold text-lg text-primary-500 mb-2 font-heading">Find a Mentor</h3>
              <p className="text-sm text-neutral-600">
                Connect with alumni or experienced competitors who can provide guidance and feedback on your preparation.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/hub/guides/guide-10" className="btn-primary">
              Read Full Competition Guide →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
