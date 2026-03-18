'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resourceRequests } from '@/lib/hubData';

const categories = [
  'Starter Guides',
  'Templates',
  'Training Materials',
  'Tools & Software',
  'Funding Resources',
  'Competition Prep',
  'Leadership Development',
  'Marketing & Outreach',
  'Other'
];

const priorityColors = {
  'Low': 'bg-blue-100 text-blue-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'High': 'bg-orange-100 text-orange-700',
  'Critical': 'bg-red-100 text-red-700'
};

const statusColors = {
  'Submitted': 'bg-neutral-100 text-neutral-600',
  'Under Review': 'bg-blue-100 text-blue-600',
  'In Progress': 'bg-purple-100 text-purple-600',
  'Completed': 'bg-green-100 text-green-600',
  'Declined': 'bg-red-100 text-red-600'
};

type PriorityKey = keyof typeof priorityColors;
type StatusKey = keyof typeof statusColors;

export default function ResourceRequestPage() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [votedRequests, setVotedRequests] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'votes' | 'date'>('votes');

  const handleVote = (id: string) => {
    if (votedRequests.includes(id)) {
      setVotedRequests(votedRequests.filter(v => v !== id));
    } else {
      setVotedRequests([...votedRequests, id]);
    }
  };

  const filteredRequests = resourceRequests
    .filter(req => filterStatus === 'all' || req.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'votes') {
        const aVotes = a.upvotes + (votedRequests.includes(a.id) ? 1 : 0);
        const bVotes = b.upvotes + (votedRequests.includes(b.id) ? 1 : 0);
        return bVotes - aVotes;
      }
      return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
    });

  const submittedCount = resourceRequests.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length;
  const inProgressCount = resourceRequests.filter(r => r.status === 'In Progress').length;
  const completedCount = resourceRequests.filter(r => r.status === 'Completed').length;

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=80"
            alt="Resources"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/95 to-pink-600/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            📝 Resource Requests
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Can&apos;t find what you need? Request new resources and vote on what the community 
            needs most. Help us build the ultimate club toolkit!
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowRequestForm(true)}
              className="btn-secondary"
            >
              Submit a Request
            </button>
            <a href="#requests" className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-rose-600 transition-all rounded-lg">
              View Requests
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">{resourceRequests.length}</div>
              <div className="text-sm text-neutral-600">Total Requests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-500 font-heading">{submittedCount}</div>
              <div className="text-sm text-neutral-600">Pending Review</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 font-heading">{inProgressCount}</div>
              <div className="text-sm text-neutral-600">In Progress</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 font-heading">{completedCount}</div>
              <div className="text-sm text-neutral-600">Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-bold text-neutral-700 mb-2">Submit</h3>
              <p className="text-sm text-neutral-600">Describe the resource you need and why it would help clubs.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-bold text-neutral-700 mb-2">Vote</h3>
              <p className="text-sm text-neutral-600">Community members upvote requests they want to see created.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-bold text-neutral-700 mb-2">Review</h3>
              <p className="text-sm text-neutral-600">Our team reviews top-voted requests and starts development.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-bold text-neutral-700 mb-2">Deliver</h3>
              <p className="text-sm text-neutral-600">Resources are added to the hub and requesters are notified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="requests" className="py-6 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 font-semibold transition-all
                  ${filterStatus === 'all' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                All
              </button>
              {Object.keys(statusColors).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 font-semibold transition-all
                    ${filterStatus === status ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'votes' | 'date')}
                className="select-field text-sm"
              >
                <option value="votes">Most Votes</option>
                <option value="date">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Requests List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-neutral-600 mb-6">{filteredRequests.length} requests</p>

          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const voteCount = request.upvotes + (votedRequests.includes(request.id) ? 1 : 0);
              const hasVoted = votedRequests.includes(request.id);

              return (
                <div key={request.id} className="card p-6">
                  <div className="flex gap-6">
                    {/* Vote Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleVote(request.id)}
                        className={`w-16 h-20 flex flex-col items-center justify-center border-2 transition-all
                          ${hasVoted 
                            ? 'bg-rose-50 border-rose-400 text-rose-600' 
                            : 'border-neutral-200 text-neutral-400 hover:border-rose-300 hover:text-rose-500'}`}
                      >
                        <span className="text-2xl">▲</span>
                        <span className="font-bold text-lg">{voteCount}</span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-semibold ${statusColors[request.status as StatusKey]}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold ${priorityColors[request.urgency as PriorityKey]}`}>
                          {request.urgency} Priority
                        </span>
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs">
                          {request.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-primary-500 font-heading mb-2">
                        {request.title}
                      </h3>
                      <p className="text-neutral-600 mb-4">{request.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                        <span>Requested by {request.requesterName}</span>
                        <span>•</span>
                        <span>{new Date(request.dateSubmitted).toLocaleDateString()}</span>
                      </div>

                      {request.adminNotes && (
                        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                          <div className="text-xs text-blue-600 font-semibold mb-1">Admin Notes</div>
                          <p className="text-sm text-blue-800">{request.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No requests match your filter.</p>
              <button
                onClick={() => setFilterStatus('all')}
                className="text-primary-500 hover:underline mt-2"
              >
                View all requests
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Have an Idea?</h2>
          <p className="text-lg text-white/90 mb-8">
            Don&apos;t see what you need? Submit a request and let the community vote on it. 
            The most wanted resources get created first!
          </p>
          <button 
            onClick={() => setShowRequestForm(true)}
            className="btn-secondary"
          >
            Submit a Request
          </button>
        </div>
      </section>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-500 font-heading">Submit Resource Request</h2>
              <button 
                onClick={() => setShowRequestForm(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Resource Title *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g., 'Club Meeting Agenda Template'" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
                <select className="select-field" required>
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description *</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  placeholder="Describe the resource you need in detail. What should it include? How would it help clubs?"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Why is this needed? *</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="Explain the problem this resource would solve. What challenges are clubs facing without it?"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(priorityColors).map((priority) => (
                    <label 
                      key={priority} 
                      className={`p-2 border-2 text-center cursor-pointer transition-all hover:border-primary-300 ${priorityColors[priority as PriorityKey]}`}
                    >
                      <input type="radio" name="priority" value={priority} className="sr-only" />
                      <span className="text-sm font-medium">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Similar Resources (Optional)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Link to similar resources you've seen elsewhere" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Your Name *</label>
                  <input type="text" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Your Email *</label>
                  <input type="email" className="input-field" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Club (Optional)</label>
                <input type="text" className="input-field" placeholder="e.g., Robotics Club" />
              </div>

              <div className="flex items-start gap-2 p-3 bg-neutral-50">
                <input type="checkbox" id="notify" className="w-5 h-5 mt-0.5" defaultChecked />
                <label htmlFor="notify" className="text-sm text-neutral-600">
                  Notify me when this request is reviewed or when the resource is published
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit Request
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowRequestForm(false)}
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
