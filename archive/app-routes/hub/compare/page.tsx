'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { chapters } from '@/lib/data';

export default function ClubComparePage() {
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const selectedClubData = chapters.filter(c => selectedClubs.includes(c.id));

  const handleAddClub = (clubId: string) => {
    if (selectedClubs.length < 4 && !selectedClubs.includes(clubId)) {
      setSelectedClubs([...selectedClubs, clubId]);
    }
    setShowSelector(false);
  };

  const handleRemoveClub = (clubId: string) => {
    setSelectedClubs(selectedClubs.filter(id => id !== clubId));
  };

  const comparisonCategories = [
    {
      name: 'Basic Info',
      metrics: [
        { key: 'category', label: 'Category' },
        { key: 'memberCount', label: 'Members' },
        { key: 'meetingSchedule', label: 'Meeting Schedule' }
      ]
    },
    {
      name: 'Commitment',
      metrics: [
        { key: 'timeCommitment', label: 'Time Commitment', compute: () => 'Moderate' },
        { key: 'duesRequired', label: 'Dues Required', compute: () => 'Varies' },
        { key: 'attendancePolicy', label: 'Attendance Policy', compute: () => 'Flexible' }
      ]
    },
    {
      name: 'Opportunities',
      metrics: [
        { key: 'competitions', label: 'Competitions', compute: (club: typeof chapters[0]) => club.category === 'STEM' || club.category === 'Academic' ? 'Yes' : 'Limited' },
        { key: 'leadership', label: 'Leadership Roles', compute: () => 'Available' },
        { key: 'communityService', label: 'Community Service', compute: (club: typeof chapters[0]) => club.category === 'Service' ? 'Primary Focus' : 'Occasional' }
      ]
    },
    {
      name: 'Culture & Experience',
      metrics: [
        { key: 'beginnerFriendly', label: 'Beginner Friendly', compute: () => 'Yes' },
        { key: 'socialEvents', label: 'Social Events', compute: () => 'Regular' },
        { key: 'mentorship', label: 'Mentorship Program', compute: () => 'Available' }
      ]
    }
  ];

  const getMetricValue = (club: typeof chapters[0], metric: { key: string; label: string; compute?: (club: typeof chapters[0]) => string }) => {
    if (metric.compute) {
      return metric.compute(club);
    }
    const value = club[metric.key as keyof typeof club];
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    return 'N/A';
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
            alt="Team comparison"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-violet-600/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            ⚖️ Club Comparison Tool
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Compare clubs side-by-side to find the perfect fit for your interests, schedule, and goals.
            Select up to 4 clubs to compare.
          </p>
        </div>
      </section>

      {/* Selected Clubs Bar */}
      <section className="bg-white py-6 border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-neutral-700">Comparing:</span>
            <div className="flex gap-3 flex-wrap">
              {selectedClubData.map(club => (
                <div key={club.id} className="flex items-center gap-2 bg-primary-100 px-3 py-1.5 border border-primary-200">
                  <span className="text-sm font-medium text-primary-700">{club.name}</span>
                  <button
                    onClick={() => handleRemoveClub(club.id)}
                    className="text-primary-500 hover:text-red-500 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
              {selectedClubs.length < 4 && (
                <button
                  onClick={() => setShowSelector(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-primary-300 hover:text-primary-500 transition-colors"
                >
                  + Add Club
                </button>
              )}
            </div>
            {selectedClubs.length > 0 && (
              <button
                onClick={() => setSelectedClubs([])}
                className="ml-auto text-sm text-neutral-500 hover:text-red-500"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {selectedClubs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">⚖️</div>
              <h2 className="text-2xl font-bold text-neutral-700 font-heading mb-4">Select Clubs to Compare</h2>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Choose up to 4 clubs to see a detailed side-by-side comparison of their features, 
                commitment levels, and opportunities.
              </p>
              <button
                onClick={() => setShowSelector(true)}
                className="btn-primary"
              >
                + Add Your First Club
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-neutral-200">
                {/* Club Headers */}
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="p-4 text-left bg-neutral-50 w-48"></th>
                    {selectedClubData.map(club => (
                      <th key={club.id} className="p-4 text-center min-w-[200px]">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-primary-100 flex items-center justify-center mb-3 text-2xl">
                            {club.category === 'STEM' ? '🔬' :
                             club.category === 'Academic' ? '📚' :
                             club.category === 'Arts' ? '🎨' :
                             club.category === 'Service' ? '❤️' :
                             club.category === 'Cultural' ? '🌍' : '⭐'}
                          </div>
                          <h3 className="font-bold text-primary-500 font-heading">{club.name}</h3>
                          <span className="text-xs text-neutral-500">{club.category}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonCategories.map((category, catIdx) => (
                    <>
                      <tr key={category.name} className="bg-neutral-50">
                        <td colSpan={selectedClubData.length + 1} className="px-4 py-3">
                          <h4 className="font-bold text-neutral-700">{category.name}</h4>
                        </td>
                      </tr>
                      {category.metrics.map((metric, metricIdx) => (
                        <tr key={metric.key} className={metricIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                          <td className="px-4 py-3 text-sm text-neutral-600 border-r border-neutral-100">
                            {metric.label}
                          </td>
                          {selectedClubData.map(club => (
                            <td key={club.id} className="px-4 py-3 text-center">
                              <span className="text-sm font-medium text-neutral-700">
                                {getMetricValue(club, metric)}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>

              {/* Quick Actions */}
              <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedClubData.map(club => (
                  <Link
                    key={club.id}
                    href={`/directory/${club.id}`}
                    className="card-hover p-4 text-center"
                  >
                    <h4 className="font-semibold text-primary-500 mb-1">{club.name}</h4>
                    <span className="text-sm text-neutral-600">View Full Profile →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Club Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-primary-500 font-heading">Select a Club</h2>
              <button
                onClick={() => setShowSelector(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-6">
              <div className="grid gap-3">
                {chapters
                  .filter(c => !selectedClubs.includes(c.id))
                  .map(club => (
                    <button
                      key={club.id}
                      onClick={() => handleAddClub(club.id)}
                      className="flex items-center gap-4 p-4 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-primary-100 flex items-center justify-center text-xl flex-shrink-0">
                        {club.category === 'STEM' ? '🔬' :
                         club.category === 'Academic' ? '📚' :
                         club.category === 'Arts' ? '🎨' :
                         club.category === 'Service' ? '❤️' :
                         club.category === 'Cultural' ? '🌍' : '⭐'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-700">{club.name}</h4>
                        <p className="text-sm text-neutral-500">{club.category} • {club.memberCount} members</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">💡 Tips for Choosing a Club</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-neutral-700 mb-2 font-heading">Match Your Interests</h3>
              <p className="text-sm text-neutral-600">
                Look for clubs that align with your passions and career goals. The best fit is one where 
                you&apos;re genuinely excited about the activities.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-4">⏰</div>
              <h3 className="font-bold text-neutral-700 mb-2 font-heading">Consider Time Commitment</h3>
              <p className="text-sm text-neutral-600">
                Be realistic about how much time you can dedicate. Some clubs require weekly meetings, 
                while others may have intensive competition seasons.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="font-bold text-neutral-700 mb-2 font-heading">Growth Opportunities</h3>
              <p className="text-sm text-neutral-600">
                Consider what skills you want to develop and what leadership positions might be 
                available as you grow within the organization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
