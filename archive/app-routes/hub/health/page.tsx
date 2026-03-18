'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { clubHealthMetrics } from '@/lib/hubData';

// Benchmark values for each metric
const benchmarkValues: Record<string, number> = {
  memberRetention: 75,
  eventAttendance: 70,
  memberSatisfaction: 7.5,
  leadershipDevelopment: 60,
  communityImpact: 100,
  financialHealth: 80,
  growthRate: 10,
  engagementScore: 75
};

const metricInfo = {
  memberRetention: { label: 'Member Retention', icon: '👥', unit: '%', description: 'Percentage of members who continue year-over-year' },
  eventAttendance: { label: 'Event Attendance', icon: '📅', unit: '%', description: 'Average attendance rate at events' },
  memberSatisfaction: { label: 'Member Satisfaction', icon: '😊', unit: '/10', description: 'Average satisfaction score from surveys' },
  leadershipDevelopment: { label: 'Leadership Dev', icon: '🌟', unit: '%', description: 'Members taking on leadership roles' },
  communityImpact: { label: 'Community Impact', icon: '❤️', unit: 'hrs', description: 'Volunteer hours contributed' },
  financialHealth: { label: 'Financial Health', icon: '💰', unit: '%', description: 'Budget utilization and reserves' },
  growthRate: { label: 'Growth Rate', icon: '📈', unit: '%', description: 'Year-over-year membership growth' },
  engagementScore: { label: 'Engagement', icon: '🔥', unit: '/100', description: 'Overall engagement composite score' }
};

type MetricKey = keyof typeof metricInfo;

export default function ClubHealthPage() {
  const [selectedClub, setSelectedClub] = useState(clubHealthMetrics[0]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showBenchmarkComparison, setShowBenchmarkComparison] = useState(false);

  const getHealthColor = (value: number, benchmark: number) => {
    const ratio = value / benchmark;
    if (ratio >= 1) return 'bg-green-500';
    if (ratio >= 0.8) return 'bg-yellow-500';
    if (ratio >= 0.6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getHealthLabel = (value: number, benchmark: number) => {
    const ratio = value / benchmark;
    if (ratio >= 1) return { text: 'Excellent', color: 'text-green-600' };
    if (ratio >= 0.8) return { text: 'Good', color: 'text-yellow-600' };
    if (ratio >= 0.6) return { text: 'Needs Work', color: 'text-orange-600' };
    return { text: 'Critical', color: 'text-red-600' };
  };

  const calculateOverallHealth = () => {
    const metrics = ['memberRetention', 'eventAttendance', 'memberSatisfaction', 'leadershipDevelopment', 'financialHealth', 'growthRate'] as MetricKey[];
    let total = 0;
    metrics.forEach(metric => {
      const value = selectedClub[metric] as number;
      const benchmark = benchmarkValues[metric] || 75;
      total += Math.min((value / benchmark) * 100, 100);
    });
    return Math.round(total / metrics.length);
  };

  const overallHealth = calculateOverallHealth();

  const recommendations = [
    {
      metric: 'memberRetention',
      condition: selectedClub.memberRetention < benchmarkValues.memberRetention,
      priority: 'high',
      title: 'Improve Member Retention',
      tips: [
        'Conduct exit surveys to understand why members leave',
        'Create a mentorship program pairing new members with veterans',
        'Host exclusive member appreciation events',
        'Develop a clear path for member growth and involvement'
      ]
    },
    {
      metric: 'eventAttendance',
      condition: selectedClub.eventAttendance < benchmarkValues.eventAttendance,
      priority: 'medium',
      title: 'Boost Event Attendance',
      tips: [
        'Survey members on preferred event types and times',
        'Send multiple reminders through different channels',
        'Create FOMO with limited spots or exclusive experiences',
        'Post event recaps to show what attendees missed'
      ]
    },
    {
      metric: 'memberSatisfaction',
      condition: selectedClub.memberSatisfaction < benchmarkValues.memberSatisfaction,
      priority: 'high',
      title: 'Increase Member Satisfaction',
      tips: [
        'Regularly collect anonymous feedback',
        'Act on feedback and communicate changes',
        'Create more social bonding opportunities',
        'Ensure activities align with member interests'
      ]
    },
    {
      metric: 'leadershipDevelopment',
      condition: selectedClub.leadershipDevelopment < benchmarkValues.leadershipDevelopment,
      priority: 'medium',
      title: 'Develop Future Leaders',
      tips: [
        'Create committee chair positions',
        'Offer leadership training workshops',
        'Give members ownership of specific projects',
        'Start a junior officer program'
      ]
    },
    {
      metric: 'financialHealth',
      condition: selectedClub.financialHealth < benchmarkValues.financialHealth,
      priority: 'high',
      title: 'Strengthen Financial Position',
      tips: [
        'Diversify fundraising methods',
        'Apply for school and community grants',
        'Build a reserve fund (target: 20% of annual budget)',
        'Track expenses and create a budget forecast'
      ]
    },
    {
      metric: 'growthRate',
      condition: selectedClub.growthRate < benchmarkValues.growthRate,
      priority: 'low',
      title: 'Accelerate Membership Growth',
      tips: [
        'Create a referral program with incentives',
        'Present at freshmen orientation',
        'Partner with other clubs for joint recruitment',
        'Improve social media presence and engagement'
      ]
    }
  ];

  const activeRecommendations = recommendations.filter(r => r.condition);

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"
            alt="Analytics"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-purple-600/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            📊 Club Health Dashboard
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Track your club&apos;s vital signs, compare against benchmarks, and get 
            personalized recommendations to strengthen your organization.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#metrics" className="btn-secondary">
              View Metrics
            </a>
            <button 
              onClick={() => setShowRecommendations(true)}
              className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-indigo-600 transition-all rounded-lg"
            >
              Get Recommendations
            </button>
          </div>
        </div>
      </section>

      {/* Club Selector */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-neutral-700">Select Club:</span>
            <select
              value={selectedClub.clubId}
              onChange={(e) => {
                const club = clubHealthMetrics.find(c => c.clubId === e.target.value);
                if (club) setSelectedClub(club);
              }}
              className="select-field max-w-xs"
            >
              {clubHealthMetrics.map((club) => (
                <option key={club.clubId} value={club.clubId}>
                  {club.clubName}
                </option>
              ))}
            </select>
            <span className="text-sm text-neutral-500 ml-auto">
              Last updated: {new Date(selectedClub.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Overall Health Score */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Health Score */}
            <div className="card p-8 text-center">
              <h3 className="font-bold text-neutral-700 mb-4 font-heading">Overall Health Score</h3>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={overallHealth >= 80 ? '#22c55e' : overallHealth >= 60 ? '#eab308' : overallHealth >= 40 ? '#f97316' : '#ef4444'}
                    strokeWidth="10"
                    strokeDasharray={`${overallHealth * 2.83} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-500 font-heading">{overallHealth}</span>
                </div>
              </div>
              <div className={`font-semibold ${overallHealth >= 80 ? 'text-green-600' : overallHealth >= 60 ? 'text-yellow-600' : overallHealth >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
                {overallHealth >= 80 ? 'Excellent Health' : overallHealth >= 60 ? 'Good Health' : overallHealth >= 40 ? 'Needs Attention' : 'Critical'}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="font-bold text-neutral-700 mb-4 font-heading">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Total Members</span>
                  <span className="font-bold text-primary-500">{selectedClub.totalMembers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Active Members</span>
                  <span className="font-bold text-primary-500">{selectedClub.activeMembers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Events This Month</span>
                  <span className="font-bold text-secondary-500">{selectedClub.eventsThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">New Members (30d)</span>
                  <span className="font-bold text-green-600">+{selectedClub.newMembersLast30Days}</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="card p-6">
              <h3 className="font-bold text-neutral-700 mb-4 font-heading">🚨 Attention Needed</h3>
              {activeRecommendations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-green-600 font-semibold">All metrics look great!</p>
                  <p className="text-sm text-neutral-500">Keep up the excellent work.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeRecommendations.slice(0, 3).map((rec, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 border-l-4 ${
                        rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                        rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{rec.title}</div>
                      <div className="text-xs text-neutral-500">{rec.priority} priority</div>
                    </div>
                  ))}
                  {activeRecommendations.length > 3 && (
                    <button 
                      onClick={() => setShowRecommendations(true)}
                      className="text-primary-500 text-sm font-semibold hover:underline"
                    >
                      View all {activeRecommendations.length} recommendations →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Metrics */}
      <section id="metrics" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Detailed Metrics</h2>
            <button
              onClick={() => setShowBenchmarkComparison(!showBenchmarkComparison)}
              className={`text-sm font-semibold px-4 py-2 transition-all ${showBenchmarkComparison ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
            >
              {showBenchmarkComparison ? '✓ Showing Benchmarks' : 'Compare to Benchmarks'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(metricInfo) as MetricKey[]).map((key) => {
              const info = metricInfo[key];
              const value = selectedClub[key] as number;
              const benchmark = benchmarkValues[key] || 75;
              const health = getHealthLabel(value, benchmark);

              return (
                <div key={key} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h3 className="font-bold text-neutral-700 font-heading">{info.label}</h3>
                      <p className="text-xs text-neutral-500">{info.description}</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-2">
                    <div className="text-3xl font-bold text-primary-500 font-heading">
                      {value}{info.unit}
                    </div>
                    <span className={`text-sm font-semibold ${health.color}`}>
                      {health.text}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 bg-neutral-200 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getHealthColor(value, benchmark)}`}
                      style={{ width: `${Math.min((value / benchmark) * 100, 100)}%` }}
                    ></div>
                  </div>

                  {showBenchmarkComparison && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 text-sm">
                      <div className="flex justify-between text-neutral-500">
                        <span>Benchmark: {benchmark}{info.unit}</span>
                        <span className={value >= benchmark ? 'text-green-600' : 'text-red-600'}>
                          {value >= benchmark ? '+' : ''}{(value - benchmark).toFixed(1)}{info.unit}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trend Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">6-Month Trend</h2>
          <div className="card p-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-sm text-neutral-500 mb-2">Member Growth</div>
                <div className="text-2xl font-bold text-green-600 font-heading">+{selectedClub.growthRate}%</div>
                <div className="text-xs text-neutral-400">vs last semester</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-neutral-500 mb-2">Event Attendance</div>
                <div className="text-2xl font-bold text-primary-500 font-heading">{selectedClub.eventAttendance}%</div>
                <div className="text-xs text-neutral-400">avg per event</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-neutral-500 mb-2">Satisfaction Trend</div>
                <div className="text-2xl font-bold text-secondary-500 font-heading">↑ 0.5</div>
                <div className="text-xs text-neutral-400">points improvement</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-neutral-500 mb-2">Engagement</div>
                <div className="text-2xl font-bold text-purple-600 font-heading">{selectedClub.engagementScore}/100</div>
                <div className="text-xs text-neutral-400">composite score</div>
              </div>
            </div>

            {/* Simple Chart Visualization */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="h-40 flex items-end justify-between gap-4">
                {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => {
                  const height = 40 + Math.random() * 50;
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 transition-all hover:from-primary-600 hover:to-primary-500"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-neutral-500 mt-2">{month}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-sm text-neutral-500 mt-4">Engagement Score Over Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Improve?</h2>
          <p className="text-lg text-white/90 mb-8">
            Get personalized recommendations based on your club&apos;s metrics and see what 
            top-performing clubs are doing differently.
          </p>
          <button 
            onClick={() => setShowRecommendations(true)}
            className="btn-secondary"
          >
            View Recommendations
          </button>
        </div>
      </section>

      {/* Recommendations Modal */}
      {showRecommendations && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-500 font-heading">
                Recommendations for {selectedClub.clubName}
              </h2>
              <button 
                onClick={() => setShowRecommendations(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            {activeRecommendations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Congratulations!</h3>
                <p className="text-neutral-600">
                  Your club is meeting or exceeding all benchmarks. Keep up the amazing work!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeRecommendations.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 border-l-4 ${
                      rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                      rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{metricInfo[rec.metric as MetricKey].icon}</span>
                      <div>
                        <h3 className="font-bold text-lg font-heading">{rec.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 ${
                          rec.priority === 'high' ? 'bg-red-200 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-blue-200 text-blue-700'
                        }`}>
                          {rec.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-neutral-600 mb-1">
                        Current: <span className="font-semibold">{selectedClub[rec.metric as MetricKey]}</span>
                        {' '}| Benchmark: <span className="font-semibold">{benchmarkValues[rec.metric]}</span>
                      </div>
                    </div>

                    <h4 className="font-semibold text-neutral-700 mb-2">Actionable Tips:</h4>
                    <ul className="space-y-2">
                      {rec.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="text-sm text-neutral-600 flex items-start gap-2">
                          <span className="text-green-500">→</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <button 
                onClick={() => setShowRecommendations(false)}
                className="btn-primary w-full"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
