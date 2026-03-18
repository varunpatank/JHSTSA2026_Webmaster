'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'clubs' | 'events' | 'resources'>('clubs');

  const clubs = [
    { id: 'tsa', name: 'Technology Student Association', category: 'STEM', members: 45, description: 'Competitive technology and leadership organization' },
    { id: 'fbla', name: 'Future Business Leaders', category: 'Business', members: 38, description: 'Developing business skills and career readiness' },
    { id: 'nhs', name: 'National Honor Society', category: 'Academic', members: 52, description: 'Recognizing outstanding academic achievement' },
    { id: 'drama', name: 'Drama Club', category: 'Arts', members: 28, description: 'Theatre productions and performing arts' },
    { id: 'debate', name: 'Debate Team', category: 'Academic', members: 22, description: 'Competitive speech and debate' },
    { id: 'robotics', name: 'Robotics Club', category: 'STEM', members: 35, description: 'Building and programming robots for competition' },
    { id: 'art', name: 'Art Club', category: 'Arts', members: 30, description: 'Creative expression and art exhibitions' },
    { id: 'eco', name: 'Environmental Club', category: 'Service', members: 25, description: 'Promoting sustainability and eco-friendly initiatives' },
  ];

  const events = [
    { id: 1, title: 'TSA State Conference', date: 'Mar 15-17, 2025', type: 'Competition', club: 'TSA' },
    { id: 2, title: 'Spring Club Fair', date: 'Mar 20, 2025', type: 'Fair', club: 'All Clubs' },
    { id: 3, title: 'FBLA Regional Competition', date: 'Apr 5, 2025', type: 'Competition', club: 'FBLA' },
    { id: 4, title: 'Spring Musical', date: 'Apr 12-14, 2025', type: 'Performance', club: 'Drama' },
    { id: 5, title: 'Robotics Showcase', date: 'Apr 22, 2025', type: 'Showcase', club: 'Robotics' },
    { id: 6, title: 'Art Exhibition Opening', date: 'May 1, 2025', type: 'Exhibition', club: 'Art Club' },
  ];

  const resources = [
    { id: 1, title: 'Club Officer Handbook', category: 'Guides', icon: '📘', description: 'Complete guide for leading your club effectively' },
    { id: 2, title: 'Event Planning Templates', category: 'Templates', icon: '📋', description: 'Ready-to-use templates for organizing events' },
    { id: 3, title: 'Fundraising Ideas', category: 'Fundraising', icon: '💰', description: 'Creative ways to raise money for your club' },
    { id: 4, title: 'Meeting Agenda Templates', category: 'Templates', icon: '📝', description: 'Structure your meetings for maximum productivity' },
    { id: 5, title: 'Social Media Guide', category: 'Marketing', icon: '📱', description: 'Grow your club presence online' },
    { id: 6, title: 'Member Recruitment Tips', category: 'Guides', icon: '👥', description: 'Strategies to attract and retain members' },
  ];

  const categories = ['All', 'STEM', 'Business', 'Academic', 'Arts', 'Service'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredClubs = selectedCategory === 'All' 
    ? clubs 
    : clubs.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold font-heading mb-4">Explore</h1>
          <p className="text-xl text-neutral-200 max-w-2xl">
            Discover clubs, browse upcoming events, and access resources all in one place.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {[
              { key: 'clubs', label: 'Clubs & Chapters', icon: '🏫' },
              { key: 'events', label: 'Events & Calendar', icon: '📅' },
              { key: 'resources', label: 'Resources & Guides', icon: '📚' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'clubs' | 'events' | 'resources')}
                className={`px-6 py-4 font-medium border-b-3 transition-colors ${
                  activeTab === tab.key
                    ? 'border-secondary-500 text-primary-600 bg-neutral-50'
                    : 'border-transparent text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Clubs Tab */}
        {activeTab === 'clubs' && (
          <div>
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link 
                href="/hub/quiz"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
              >
                <span>🎯</span>
                Take the Club Finder Quiz
              </Link>
              <Link 
                href="/hub/compare"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <span>⚖️</span>
                Compare Clubs
              </Link>
              <Link 
                href="/propose"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                <span>✨</span>
                Propose New Club
              </Link>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Clubs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map(club => (
                <Link
                  key={club.id}
                  href={`/directory/${club.id}`}
                  className="bg-white border-2 border-neutral-200 p-6 hover:border-primary-400 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium">
                      {club.category}
                    </span>
                    <span className="text-neutral-500 text-sm">{club.members} members</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary-700 mb-2 group-hover:text-secondary-600">
                    {club.name}
                  </h3>
                  <p className="text-neutral-600 text-sm">{club.description}</p>
                  <div className="mt-4 text-secondary-600 font-medium text-sm group-hover:underline">
                    View Details →
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/directory"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                View Full Directory
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link 
                href="/hub/calendar"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
              >
                <span>📅</span>
                Full Calendar View
              </Link>
              <Link 
                href="/hub/competitions"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <span>🏆</span>
                Competitions
              </Link>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="bg-white border-2 border-neutral-200 p-6 hover:border-primary-400 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-medium">
                          {event.type}
                        </span>
                        <span className="text-neutral-500 text-sm">{event.club}</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary-700">{event.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">{event.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                View All Events
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link 
                href="/hub/external"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
              >
                <span>🔗</span>
                External Resources Library
              </Link>
              <Link 
                href="/hub"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <span>📖</span>
                All Guides
              </Link>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(resource => (
                <div key={resource.id} className="bg-white border-2 border-neutral-200 p-6 hover:border-primary-400 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">{resource.icon}</div>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm font-medium">
                    {resource.category}
                  </span>
                  <h3 className="text-lg font-bold text-primary-700 mt-3 mb-2">{resource.title}</h3>
                  <p className="text-neutral-600 text-sm">{resource.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                View All Resources
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary-50 border-2 border-primary-200 p-6">
            <h2 className="text-xl font-bold text-primary-700 mb-2">Not sure where to start?</h2>
            <p className="text-neutral-600 mb-4">Take our quick quiz to find clubs that match your interests and goals.</p>
            <Link 
              href="/hub/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-500 text-white font-medium hover:bg-secondary-600 transition-colors"
            >
              <span>🎯</span>
              Start Club Finder Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
