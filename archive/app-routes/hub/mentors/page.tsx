'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mentors } from '@/lib/hubData';

const expertiseAreas = [
  'Public speaking',
  'Entrepreneurship',
  'College applications',
  'Leadership development',
  'Programming',
  'Robotics',
  'Tech careers',
  'Community service',
  'Grant writing',
  'Fundraising',
  'Event planning'
];

const typeColors = {
  'Alumni': 'bg-purple-100 text-purple-700',
  'Current Officer': 'bg-blue-100 text-blue-700',
  'Advisor': 'bg-green-100 text-green-700',
  'Community Partner': 'bg-amber-100 text-amber-700'
};

const availabilityColors = {
  'Available': 'bg-green-500',
  'Limited': 'bg-yellow-500',
  'Full': 'bg-red-500'
};

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          mentor.name.toLowerCase().includes(query) ||
          mentor.bio.toLowerCase().includes(query) ||
          mentor.expertise.some(e => e.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      if (selectedType && mentor.type !== selectedType) return false;
      if (selectedExpertise && !mentor.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase()))) return false;
      if (availableOnly && mentor.availability === 'Full') return false;
      return true;
    });
  }, [searchQuery, selectedType, selectedExpertise, availableOnly]);

  const topMentors = mentors.sort((a, b) => b.sessionsCompleted - a.sessionsCompleted).slice(0, 3);

  const handleRequestMentor = (mentor: typeof mentors[0]) => {
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
            alt="Mentorship"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-blue-500/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            🤝 Mentor Network
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Connect with experienced alumni, advisors, and community leaders who want to help you succeed. 
            Get personalized guidance on leadership, competitions, college prep, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#mentors" className="btn-secondary">
              Find a Mentor
            </a>
            <Link href="/hub/mentors/become" className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-blue-600 transition-all rounded-lg">
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">{mentors.length}</div>
              <div className="text-sm text-neutral-600">Active Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">
                {mentors.reduce((sum, m) => sum + m.sessionsCompleted, 0)}
              </div>
              <div className="text-sm text-neutral-600">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">
                {(mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1)}
              </div>
              <div className="text-sm text-neutral-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">
                {mentors.filter(m => m.availability !== 'Full').length}
              </div>
              <div className="text-sm text-neutral-600">Currently Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Mentors */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">⭐ Top Mentors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {topMentors.map((mentor, index) => (
              <div key={mentor.id} className="card-hover overflow-hidden">
                <div className={`p-6 ${index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : index === 1 ? 'bg-gradient-to-r from-neutral-400 to-neutral-500' : 'bg-gradient-to-r from-amber-700 to-amber-800'} text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-heading">{mentor.name}</h3>
                      <p className="text-white/80 text-sm">{mentor.title}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="font-bold text-primary-500">{mentor.sessionsCompleted}</div>
                      <div className="text-xs text-neutral-500">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-secondary-500">{mentor.rating}/5</div>
                      <div className="text-xs text-neutral-500">Rating</div>
                    </div>
                    <div className={`ml-auto w-3 h-3 rounded-full ${availabilityColors[mentor.availability]}`} title={mentor.availability}></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.expertise.slice(0, 3).map((exp, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs">
                        {exp}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleRequestMentor(mentor)}
                    className="w-full btn-primary text-sm"
                  >
                    Request Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="mentors" className="py-8 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search mentors..."
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select-field"
            >
              <option value="">All Mentor Types</option>
              <option value="Alumni">Alumni</option>
              <option value="Current Officer">Current Officer</option>
              <option value="Advisor">Advisor</option>
              <option value="Community Partner">Community Partner</option>
            </select>
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="select-field"
            >
              <option value="">All Expertise Areas</option>
              {expertiseAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <label className="flex items-center gap-3 px-4 py-2 border-2 border-neutral-300 bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Available Only</span>
            </label>
          </div>
        </div>
      </section>

      {/* Mentor List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-neutral-600 mb-6">{filteredMentors.length} mentors found</p>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="card p-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-primary-500 font-heading">{mentor.name}</h3>
                        <p className="text-neutral-600 text-sm">{mentor.title}</p>
                        {mentor.organization && (
                          <p className="text-neutral-500 text-sm">{mentor.organization}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${availabilityColors[mentor.availability]}`}></div>
                        <span className="text-xs text-neutral-500">{mentor.availability}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold ${typeColors[mentor.type]}`}>
                        {mentor.type}
                      </span>
                      <span className="text-sm text-neutral-500">⭐ {mentor.rating}</span>
                      <span className="text-sm text-neutral-500">{mentor.sessionsCompleted} sessions</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 mt-4 line-clamp-2">{mentor.bio}</p>

                <div className="flex flex-wrap gap-1 mt-4">
                  {mentor.expertise.map((exp, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs">
                      {exp}
                    </span>
                  ))}
                </div>

                {mentor.chaptersAdvised.length > 0 && (
                  <div className="mt-4 text-xs text-neutral-500">
                    <span className="font-medium">Affiliated with:</span> {mentor.chaptersAdvised.join(', ')}
                  </div>
                )}

                {mentor.testimonials.length > 0 && (
                  <blockquote className="mt-4 pl-4 border-l-4 border-secondary-500 text-sm text-neutral-600 italic">
                    &ldquo;{mentor.testimonials[0].quote.slice(0, 100)}...&rdquo;
                    <footer className="text-xs text-neutral-500 mt-1 not-italic">
                      — {mentor.testimonials[0].author}, {mentor.testimonials[0].role}
                    </footer>
                  </blockquote>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleRequestMentor(mentor)}
                    className={`flex-1 py-2 font-semibold transition-all
                      ${mentor.availability === 'Full'
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : 'btn-primary'
                      }`}
                    disabled={mentor.availability === 'Full'}
                  >
                    {mentor.availability === 'Full' ? 'Not Available' : 'Request Session'}
                  </button>
                  <button className="btn-outline px-4">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No mentors match your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedType(''); setSelectedExpertise(''); setAvailableOnly(false); }}
                className="text-primary-500 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Become a Mentor CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Want to Give Back?</h2>
          <p className="text-lg text-white/90 mb-8">
            Share your experience and help the next generation of student leaders. 
            Whether you&apos;re an alum, current officer, or community member, your guidance matters.
          </p>
          <Link 
            href="/hub/mentors/become"
            className="btn-secondary"
          >
            Apply to Be a Mentor
          </Link>
        </div>
      </section>

      {/* Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-500 font-heading">Request Mentorship</h2>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-neutral-50">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedMentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-primary-500">{selectedMentor.name}</h3>
                <p className="text-sm text-neutral-600">{selectedMentor.title}</p>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Name *</label>
                <input type="text" className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Email *</label>
                <input type="email" className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Club/Role (Optional)</label>
                <input type="text" className="input-field" placeholder="e.g., Robotics Team President" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Topics You&apos;d Like to Discuss *</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMentor.expertise.map((exp, idx) => (
                    <label key={idx} className="flex items-center gap-2 p-2 border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Message to Mentor *</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  placeholder="Introduce yourself and explain what you're hoping to get out of this mentorship..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Schedule</label>
                <select className="select-field">
                  <option value="">Select a time preference...</option>
                  <option value="weekday-afternoon">Weekday Afternoons</option>
                  <option value="weekday-evening">Weekday Evenings</option>
                  <option value="weekend">Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Send Request
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowRequestModal(false)}
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
