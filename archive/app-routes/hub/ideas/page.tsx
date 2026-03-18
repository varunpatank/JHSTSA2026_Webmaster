'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { clubIdeas } from '@/lib/hubData';
import { ChapterCategory } from '@/types';

const categories: ChapterCategory[] = ['Academic', 'Arts', 'Service', 'Cultural', 'STEM', 'Sports', 'Leadership', 'Media', 'Other'];

const interestColors = {
  'Low': 'bg-neutral-100 text-neutral-600',
  'Medium': 'bg-blue-100 text-blue-700',
  'High': 'bg-green-100 text-green-700',
  'Very High': 'bg-purple-100 text-purple-700'
};

const costColors = {
  'Free': 'text-green-600',
  'Low ($0-50)': 'text-blue-600',
  'Medium ($50-200)': 'text-yellow-600',
  'High ($200+)': 'text-red-600'
};

export default function ClubIdeasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCost, setSelectedCost] = useState<string>('');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'interest'>('votes');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  const filteredIdeas = useMemo(() => {
    let ideas = clubIdeas.filter((idea) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          idea.name.toLowerCase().includes(query) ||
          idea.description.toLowerCase().includes(query) ||
          idea.tagline.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedCategory && idea.category !== selectedCategory) return false;
      if (selectedCost && idea.startupCost !== selectedCost) return false;
      return true;
    });

    // Sort
    if (sortBy === 'votes') {
      ideas = ideas.sort((a, b) => b.votes - a.votes);
    } else if (sortBy === 'newest') {
      ideas = ideas.sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());
    } else if (sortBy === 'interest') {
      const interestOrder = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      ideas = ideas.sort((a, b) => interestOrder[b.estimatedInterest] - interestOrder[a.estimatedInterest]);
    }

    return ideas;
  }, [searchQuery, selectedCategory, selectedCost, sortBy]);

  const handleVote = (ideaId: string) => {
    if (votedIdeas.includes(ideaId)) {
      setVotedIdeas(prev => prev.filter(id => id !== ideaId));
    } else {
      setVotedIdeas(prev => [...prev, ideaId]);
    }
  };

  const topIdea = clubIdeas.sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1920&q=80"
            alt="Creative ideas"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 to-purple-500/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            💡 Club Ideas Generator
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Can&apos;t decide what club to start? Browse crowd-sourced ideas, vote for your favorites, 
            or submit your own brilliant concept. Let&apos;s build something amazing together!
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowSubmitModal(true)}
              className="btn-secondary"
            >
              Submit Your Idea
            </button>
            <Link href="/propose" className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-purple-600 transition-all rounded-lg">
              Start a Proposal
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Idea */}
      {topIdea && (
        <section className="bg-gradient-to-r from-amber-400 to-amber-500 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-4xl">🏆</span>
              <div className="text-center md:text-left">
                <span className="text-amber-800 text-sm font-semibold">MOST VOTED IDEA</span>
                <h3 className="text-xl font-bold text-white">{topIdea.name}</h3>
              </div>
              <div className="md:ml-auto flex items-center gap-4">
                <span className="text-white font-bold text-2xl">{topIdea.votes} votes</span>
                <Link 
                  href={`#${topIdea.id}`}
                  className="bg-white text-amber-600 px-4 py-2 font-semibold hover:bg-amber-50 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ideas..."
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
              value={selectedCost}
              onChange={(e) => setSelectedCost(e.target.value)}
              className="select-field"
            >
              <option value="">Any Startup Cost</option>
              <option value="Free">Free</option>
              <option value="Low ($0-50)">Low ($0-50)</option>
              <option value="Medium ($50-200)">Medium ($50-200)</option>
              <option value="High ($200+)">High ($200+)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'votes' | 'newest' | 'interest')}
              className="select-field"
            >
              <option value="votes">Most Voted</option>
              <option value="interest">Highest Interest</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </section>

      {/* Ideas Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-neutral-600 mb-6">{filteredIdeas.length} ideas found</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <div 
                key={idea.id}
                id={idea.id}
                className="card overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="badge bg-primary-100 text-primary-700">{idea.category}</span>
                    {idea.existsAtSchool && (
                      <span className="badge bg-neutral-100 text-neutral-500">Already Exists</span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-xl text-primary-500 mb-1 font-heading">{idea.name}</h3>
                  <p className="text-secondary-600 italic text-sm mb-3">&quot;{idea.tagline}&quot;</p>
                  <p className="text-neutral-600 text-sm mb-4">{idea.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold ${interestColors[idea.estimatedInterest]}`}>
                      📊 {idea.estimatedInterest} Interest
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold bg-neutral-100 ${costColors[idea.startupCost]}`}>
                      💰 {idea.startupCost}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold bg-neutral-100 text-neutral-600">
                      🎯 {idea.difficultyToStart}
                    </span>
                  </div>

                  {/* Expandable Content */}
                  {expandedIdea === idea.id && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-primary-500 mb-2">Target Audience</h4>
                        <div className="flex flex-wrap gap-1">
                          {idea.targetAudience.map((audience, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs">
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-primary-500 mb-2">Suggested Activities</h4>
                        <ul className="text-sm text-neutral-600 space-y-1">
                          {idea.suggestedActivities.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-secondary-500">•</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-primary-500 mb-2">Tips for Success</h4>
                        <ul className="text-sm text-neutral-600 space-y-1">
                          {idea.successTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {idea.potentialPartners.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-primary-500 mb-2">Potential Partners</h4>
                          <p className="text-sm text-neutral-600">{idea.potentialPartners.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                  <button
                    onClick={() => handleVote(idea.id)}
                    className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all
                      ${votedIdeas.includes(idea.id)
                        ? 'bg-secondary-500 text-white'
                        : 'bg-white border-2 border-neutral-300 text-neutral-700 hover:border-secondary-500 hover:text-secondary-500'
                      }`}
                  >
                    <span>👍</span>
                    <span>{idea.votes + (votedIdeas.includes(idea.id) ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)}
                    className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
                  >
                    {expandedIdea === idea.id ? 'Show Less ↑' : 'Show More ↓'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No ideas match your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedCost(''); }}
                className="text-primary-500 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Have a Brilliant Idea?</h2>
          <p className="text-lg text-white/90 mb-8">
            Share your club idea with the community. If it gets enough votes, it might inspire someone to make it reality!
          </p>
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="btn-secondary"
          >
            Submit Your Club Idea
          </button>
        </div>
      </section>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-500 font-heading">Submit a Club Idea</h2>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Club Name *</label>
                <input type="text" className="input-field" placeholder="e.g., Podcast Production Club" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Tagline *</label>
                <input type="text" className="input-field" placeholder="A catchy one-liner" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description *</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  placeholder="What would this club do? Who would it be for?"
                  required
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
                  <select className="select-field" required>
                    <option value="">Select...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Estimated Startup Cost</label>
                  <select className="select-field">
                    <option value="Free">Free</option>
                    <option value="Low ($0-50)">Low ($0-50)</option>
                    <option value="Medium ($50-200)">Medium ($50-200)</option>
                    <option value="High ($200+)">High ($200+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Suggested Activities</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="List some activities this club could do (one per line)"
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Your Name</label>
                  <input type="text" className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Your Email</label>
                  <input type="email" className="input-field" placeholder="Optional - for updates" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit Idea
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowSubmitModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
