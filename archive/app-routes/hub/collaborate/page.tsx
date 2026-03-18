'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collaborationOpportunities } from '@/lib/hubData';

const typeFilters = ['All', 'Joint Event', 'Fundraiser', 'Community Service', 'Competition Team', 'Workshop', 'Resource Sharing'];
const statusColors = {
  'Open': 'bg-green-500',
  'In Progress': 'bg-blue-500',
  'Completed': 'bg-neutral-500',
  'Cancelled': 'bg-red-500'
};

export default function CollaboratePage() {
  const [selectedType, setSelectedType] = useState('All');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [showInterestConfirm, setShowInterestConfirm] = useState<string | null>(null);

  const filteredOpportunities = useMemo(() => {
    return collaborationOpportunities.filter((opp) => {
      if (selectedType !== 'All' && opp.type !== selectedType) return false;
      return true;
    });
  }, [selectedType]);

  const featuredOpps = collaborationOpportunities.filter(o => o.status === 'Open').slice(0, 2);

  const handleExpressInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(i => i !== id));
    } else {
      setInterests([...interests, id]);
      setShowInterestConfirm(id);
      setTimeout(() => setShowInterestConfirm(null), 2000);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/95 to-teal-600/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            🤝 Collaboration Finder
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Discover opportunities to partner with other clubs, share resources, and create 
            amazing cross-chapter projects. Two clubs are better than one!
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#opportunities" className="btn-secondary">
              Browse Opportunities
            </a>
            <button 
              onClick={() => setShowProposalModal(true)}
              className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-green-600 transition-all rounded-lg"
            >
              Propose Collaboration
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">
                {collaborationOpportunities.length}
              </div>
              <div className="text-sm text-neutral-600">Active Opportunities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">24</div>
              <div className="text-sm text-neutral-600">Clubs Collaborating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">12</div>
              <div className="text-sm text-neutral-600">Completed Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">1.5K+</div>
              <div className="text-sm text-neutral-600">Students Involved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">Why Collaborate?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="font-bold text-primary-500 font-heading mb-2">Expand Your Network</h3>
              <p className="text-sm text-neutral-600">Connect with students from different clubs and build lasting relationships.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="font-bold text-primary-500 font-heading mb-2">Share Ideas</h3>
              <p className="text-sm text-neutral-600">Learn from different perspectives and bring fresh approaches to your club.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-bold text-primary-500 font-heading mb-2">Bigger Impact</h3>
              <p className="text-sm text-neutral-600">Pool resources to host larger events and reach more students.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-bold text-primary-500 font-heading mb-2">Build Your Resume</h3>
              <p className="text-sm text-neutral-600">Cross-functional leadership experience stands out on college applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      {featuredOpps.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-teal-600 to-green-600">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white font-heading mb-8">⭐ Featured Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredOpps.map((opp) => (
                <div key={opp.id} className="bg-white/95 backdrop-blur p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold mb-2 inline-block">
                        {opp.type}
                      </span>
                      <h3 className="font-bold text-xl text-primary-500 font-heading">{opp.title}</h3>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${statusColors[opp.status as keyof typeof statusColors]}`} title={opp.status}></div>
                  </div>
                  <p className="text-neutral-600 mb-4">{opp.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opp.requirements.slice(0, 3).map((req: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs">
                        {req}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-500">
                      <span className="font-medium">{opp.currentInterest}</span> clubs interested
                    </div>
                    <button 
                      onClick={() => handleExpressInterest(opp.id)}
                      className={`btn-primary text-sm ${interests.includes(opp.id) ? 'bg-green-600' : ''}`}
                    >
                      {interests.includes(opp.id) ? '✓ Interested' : 'Express Interest'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <section id="opportunities" className="py-8 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 font-semibold transition-all
                  ${selectedType === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-neutral-600 mb-6">{filteredOpportunities.length} opportunities found</p>

          <div className="space-y-4">
            {filteredOpportunities.map((opp) => (
              <div key={opp.id} className="card">
                {/* Header */}
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === opp.id ? null : opp.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{
                      opp.type === 'Joint Event' ? '🎉' :
                      opp.type === 'Fundraiser' ? '💰' :
                      opp.type === 'Community Service' ? '❤️' :
                      opp.type === 'Competition Team' ? '🏆' :
                      opp.type === 'Workshop' ? '📚' : '🤝'
                    }</div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs font-semibold">
                          {opp.type}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${statusColors[opp.status as keyof typeof statusColors]}`}></div>
                        <span className="text-xs text-neutral-500">{opp.status}</span>
                      </div>
                      <h3 className="font-bold text-lg text-primary-500 font-heading">{opp.title}</h3>
                      <p className="text-neutral-600 text-sm mt-1 line-clamp-2">{opp.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm text-neutral-500">
                        <span className="font-medium text-primary-500">{opp.currentInterest}</span> interested
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        Due: {new Date(opp.deadline).toLocaleDateString()}
                      </div>
                      <div className={`mt-2 transform transition-transform ${expandedId === opp.id ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === opp.id && (
                  <div className="px-6 pb-6 border-t border-neutral-200">
                    <div className="grid md:grid-cols-2 gap-6 pt-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-neutral-700 mb-2">Proposed Date</h4>
                          <p className="text-sm text-neutral-600">{opp.proposedDate ? new Date(opp.proposedDate).toLocaleDateString() : 'TBD'}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-neutral-700 mb-2">Requirements</h4>
                          <div className="flex flex-wrap gap-1">
                            {opp.requirements.map((req: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-neutral-700 mb-2">Target Chapters</h4>
                          <div className="flex flex-wrap gap-1">
                            {opp.targetChapters.map((target: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-green-50 text-green-600 text-xs">
                                {target}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-neutral-700 mb-2">Benefits</h4>
                          <ul className="space-y-1">
                            {opp.benefits.map((benefit: string, idx: number) => (
                              <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                                <span className="text-green-500">✓</span> {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-neutral-700 mb-2">Posted By</h4>
                          <p className="text-sm text-neutral-600">
                            {opp.hostChapterName} on {new Date(opp.datePosted).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-6 pt-4 border-t border-neutral-100">
                      <button 
                        onClick={() => handleExpressInterest(opp.id)}
                        className={`btn-primary flex items-center gap-2 ${interests.includes(opp.id) ? 'bg-green-600' : ''}`}
                      >
                        {interests.includes(opp.id) ? '✓ Interest Expressed' : '🙋 Express Interest'}
                      </button>
                      <button className="btn-outline">
                        💬 Message Poster
                      </button>
                      <button className="btn-outline">
                        📋 View Details
                      </button>
                    </div>

                    {showInterestConfirm === opp.id && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
                        ✓ Your interest has been recorded! The collaboration leader will be notified.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No opportunities match your filter.</p>
              <button
                onClick={() => setSelectedType('All')}
                className="text-primary-500 hover:underline mt-2"
              >
                View all opportunities
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Have an Idea for a Collaboration?</h2>
          <p className="text-lg text-white/90 mb-8">
            Post your own collaboration opportunity and find partner clubs to make it happen.
          </p>
          <button 
            onClick={() => setShowProposalModal(true)}
            className="btn-secondary"
          >
            Propose a Collaboration
          </button>
        </div>
      </section>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-500 font-heading">Propose a Collaboration</h2>
              <button 
                onClick={() => setShowProposalModal(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Collaboration Title *</label>
                <input type="text" className="input-field" placeholder="Give your collaboration a clear, descriptive title" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Type *</label>
                  <select className="select-field" required>
                    <option value="">Select type...</option>
                    <option value="Event Partnership">Event Partnership</option>
                    <option value="Joint Project">Joint Project</option>
                    <option value="Resource Sharing">Resource Sharing</option>
                    <option value="Skill Exchange">Skill Exchange</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Difficulty *</label>
                  <select className="select-field" required>
                    <option value="">Select difficulty...</option>
                    <option value="Easy">Easy - Minimal coordination</option>
                    <option value="Medium">Medium - Some planning required</option>
                    <option value="Hard">Hard - Significant commitment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description *</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  placeholder="Describe the collaboration, what you're hoping to achieve, and what you're looking for in a partner club..."
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Timeline</label>
                  <input type="text" className="input-field" placeholder="e.g., Fall 2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Time Commitment</label>
                  <input type="text" className="input-field" placeholder="e.g., 2-3 hours/week" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Skills Needed (comma-separated)</label>
                <input type="text" className="input-field" placeholder="e.g., Event planning, Social media, Budgeting" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Ideal Partner Club Types (comma-separated)</label>
                <input type="text" className="input-field" placeholder="e.g., Service clubs, STEM clubs" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Expected Outcomes</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="What will the collaboration achieve? List expected outcomes..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Information</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" className="input-field" placeholder="Your name" required />
                  <input type="text" className="input-field" placeholder="Your club" required />
                </div>
                <input type="email" className="input-field mt-2" placeholder="Your email" required />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit Proposal
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowProposalModal(false)}
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
