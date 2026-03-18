'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { chapters, events, stats } from '@/lib/data';

const pendingProposals = [
  { id: 'prop-1', name: 'Photography Club', submitter: 'Emily Chen', date: '2026-01-10', status: 'Under Review' },
  { id: 'prop-2', name: 'Chess Club', submitter: 'Marcus Johnson', date: '2026-01-08', status: 'Pending Advisor' },
  { id: 'prop-3', name: 'Entrepreneurship Society', submitter: 'Sarah Williams', date: '2026-01-05', status: 'Under Review' },
];

const recentActivity = [
  { action: 'New member joined Model UN', time: '2 hours ago', type: 'member' },
  { action: 'Robotics Team updated meeting schedule', time: '5 hours ago', type: 'update' },
  { action: 'Drama Club event approved', time: '1 day ago', type: 'event' },
  { action: 'New proposal submitted: Photography Club', time: '2 days ago', type: 'proposal' },
  { action: 'Community Service Club hours verified', time: '3 days ago', type: 'verification' },
];

const chapterHealth = [
  { name: 'Model UN', score: 95, status: 'Excellent', color: 'bg-green-500' },
  { name: 'Robotics Team', score: 92, status: 'Excellent', color: 'bg-green-500' },
  { name: 'Drama Club', score: 88, status: 'Good', color: 'bg-blue-500' },
  { name: 'Debate Team', score: 85, status: 'Good', color: 'bg-blue-500' },
  { name: 'Environmental Club', score: 72, status: 'Fair', color: 'bg-yellow-500' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'proposals' | 'users' | 'analytics' | 'policies'>('overview');

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Administration office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/85"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="page-title text-white mb-2">Administration Dashboard</h1>
              <p className="text-white/80">
                Manage chapters, users, and school-wide policies.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="btn-secondary">
                Generate Report
              </button>
              <button className="bg-white text-primary-500 px-4 py-2 font-semibold border-2 border-white hover:bg-neutral-100 transition-colors rounded-lg">
                Settings
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <div className="flex flex-wrap border-b border-neutral-200">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'chapters', label: 'Chapter Management' },
              { key: 'proposals', label: 'Proposals' },
              { key: 'users', label: 'User Management' },
              { key: 'analytics', label: 'Analytics' },
              { key: 'policies', label: 'Policies' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5'
                    : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card">
                <div className="stat-number">{stats.activeChapters}</div>
                <div className="stat-label">Active Chapters</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalMembers.toLocaleString()}</div>
                <div className="stat-label">Total Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{pendingProposals.length}</div>
                <div className="stat-label">Pending Proposals</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{events.length}</div>
                <div className="stat-label">Upcoming Events</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card">
                <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-primary-500 font-heading">Pending Proposals</h2>
                  <Link href="#" className="text-sm text-secondary-500 hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-neutral-200">
                  {pendingProposals.map((proposal) => (
                    <div key={proposal.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-800">{proposal.name}</h3>
                        <p className="text-sm text-neutral-500">
                          by {proposal.submitter} • {new Date(proposal.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="badge badge-outline text-xs">{proposal.status}</span>
                        <button className="text-primary-500 hover:text-primary-600">
                          Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="p-4 border-b border-neutral-200">
                  <h2 className="text-lg font-bold text-primary-500 font-heading">Recent Activity</h2>
                </div>
                <div className="divide-y divide-neutral-200">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="p-4 flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 flex-shrink-0 ${
                        activity.type === 'member' ? 'bg-green-500' :
                        activity.type === 'event' ? 'bg-blue-500' :
                        activity.type === 'proposal' ? 'bg-yellow-500' :
                        'bg-neutral-400'
                      }`} />
                      <div>
                        <p className="text-neutral-800">{activity.action}</p>
                        <p className="text-sm text-neutral-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary-500 font-heading">Chapter Health Metrics</h2>
                <Link href="#" className="text-sm text-secondary-500 hover:underline">Full Report</Link>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {chapterHealth.map((chapter) => (
                    <div key={chapter.name} className="flex items-center gap-4">
                      <div className="w-32 font-medium text-neutral-700">{chapter.name}</div>
                      <div className="flex-grow bg-neutral-200 h-4">
                        <div 
                          className={`h-full ${chapter.color}`} 
                          style={{ width: `${chapter.score}%` }}
                        />
                      </div>
                      <div className="w-16 text-right font-semibold">{chapter.score}%</div>
                      <div className={`w-20 text-sm font-medium ${
                        chapter.status === 'Excellent' ? 'text-green-600' :
                        chapter.status === 'Good' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>{chapter.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chapters' && (
          <div className="space-y-6">
            <div className="card p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Search chapters..." 
                  className="input-field w-64"
                />
                <select className="select-field w-40">
                  <option value="">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Arts">Arts</option>
                  <option value="STEM">STEM</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <button className="btn-primary">+ Add Chapter</button>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Chapter Name</th>
                    <th className="table-header">Category</th>
                    <th className="table-header">Members</th>
                    <th className="table-header">Advisor</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter) => (
                    <tr key={chapter.id} className="table-row-hover">
                      <td className="table-cell font-medium">{chapter.name}</td>
                      <td className="table-cell">
                        <span className="badge badge-outline">{chapter.category}</span>
                      </td>
                      <td className="table-cell">{chapter.memberCount}</td>
                      <td className="table-cell">{chapter.advisor.name}</td>
                      <td className="table-cell">
                        <span className="badge badge-primary">Active</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button className="text-primary-500 hover:underline text-sm">Edit</button>
                          <button className="text-neutral-500 hover:underline text-sm">View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="stat-card border-l-4 border-l-yellow-500">
                <div className="stat-number text-2xl">3</div>
                <div className="stat-label">Under Review</div>
              </div>
              <div className="stat-card border-l-4 border-l-green-500">
                <div className="stat-number text-2xl">12</div>
                <div className="stat-label">Approved This Year</div>
              </div>
              <div className="stat-card border-l-4 border-l-red-500">
                <div className="stat-number text-2xl">2</div>
                <div className="stat-label">Denied</div>
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-neutral-200">
                <h2 className="text-lg font-bold text-primary-500 font-heading">All Proposals</h2>
              </div>
              <div className="divide-y divide-neutral-200">
                {pendingProposals.map((proposal) => (
                  <div key={proposal.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800">{proposal.name}</h3>
                        <p className="text-neutral-600">Submitted by {proposal.submitter}</p>
                        <p className="text-sm text-neutral-500">
                          {new Date(proposal.date).toLocaleDateString('en-US', { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className="badge bg-yellow-100 text-yellow-700">{proposal.status}</span>
                        <button className="btn-primary text-sm py-1">Review</button>
                        <button className="btn-outline text-sm py-1">Approve</button>
                        <button className="text-red-500 hover:underline text-sm px-4 py-1">Deny</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="stat-card">
                <div className="stat-number text-2xl">1,283</div>
                <div className="stat-label">Total Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-number text-2xl">156</div>
                <div className="stat-label">Officers</div>
              </div>
              <div className="stat-card">
                <div className="stat-number text-2xl">47</div>
                <div className="stat-label">Advisors</div>
              </div>
              <div className="stat-card">
                <div className="stat-number text-2xl">8</div>
                <div className="stat-label">Admins</div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">User Management</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="#" className="p-4 border border-neutral-200 hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
                  <h3 className="font-semibold text-neutral-800 mb-2">Assign Advisor Permissions</h3>
                  <p className="text-sm text-neutral-600">Grant faculty members advisor access to chapters.</p>
                </Link>
                <Link href="#" className="p-4 border border-neutral-200 hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
                  <h3 className="font-semibold text-neutral-800 mb-2">Verify Student Enrollment</h3>
                  <p className="text-sm text-neutral-600">Confirm student enrollment status for eligibility.</p>
                </Link>
                <Link href="#" className="p-4 border border-neutral-200 hover:border-primary-500 hover:bg-primary-500/5 transition-colors">
                  <h3 className="font-semibold text-neutral-800 mb-2">Role-Based Access</h3>
                  <p className="text-sm text-neutral-600">Configure access levels for officers, members, and public.</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary-500 font-heading mb-6">Participation by Grade</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { grade: '9th', rate: 45, count: 245 },
                  { grade: '10th', rate: 62, count: 318 },
                  { grade: '11th', rate: 71, count: 386 },
                  { grade: '12th', rate: 68, count: 334 },
                ].map((g) => (
                  <div key={g.grade} className="text-center">
                    <div className="text-3xl font-bold text-primary-500">{g.rate}%</div>
                    <div className="text-neutral-600 font-medium">{g.grade} Grade</div>
                    <div className="text-sm text-neutral-500">{g.count} students</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Event Impact</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-neutral-50">
                    <span>Total Events This Year</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50">
                    <span>Average Attendance</span>
                    <span className="font-bold">34 students</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50">
                    <span>Community Events</span>
                    <span className="font-bold">23</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Budget Overview</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-neutral-50">
                    <span>Total Allocated</span>
                    <span className="font-bold">$45,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50">
                    <span>Total Spent</span>
                    <span className="font-bold">$28,750</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50">
                    <span>Remaining</span>
                    <span className="font-bold text-green-600">$16,250</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Policy Management</h2>
              <div className="space-y-4">
                {[
                  { name: 'Chapter Constitution Requirements', lastUpdated: '2025-08-15', acknowledged: 47 },
                  { name: 'Meeting Room Usage Policy', lastUpdated: '2025-09-01', acknowledged: 45 },
                  { name: 'Fundraising Guidelines', lastUpdated: '2025-08-20', acknowledged: 42 },
                  { name: 'Event Safety Procedures', lastUpdated: '2025-10-05', acknowledged: 47 },
                  { name: 'Off-Campus Activity Requirements', lastUpdated: '2025-07-30', acknowledged: 38 },
                ].map((policy) => (
                  <div key={policy.name} className="flex items-center justify-between p-4 border border-neutral-200">
                    <div>
                      <h3 className="font-semibold text-neutral-800">{policy.name}</h3>
                      <p className="text-sm text-neutral-500">
                        Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-neutral-600">
                        {policy.acknowledged}/47 chapters acknowledged
                      </span>
                      <button className="btn-outline text-sm py-1">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Training Management</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-200">
                  <h3 className="font-semibold text-neutral-800 mb-2">Mandatory Advisor Training</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-grow bg-neutral-200 h-2">
                      <div className="bg-green-500 h-full" style={{ width: '91%' }} />
                    </div>
                    <span className="text-sm font-medium">43/47</span>
                  </div>
                  <p className="text-sm text-neutral-500">4 advisors pending completion</p>
                </div>
                <div className="p-4 border border-neutral-200">
                  <h3 className="font-semibold text-neutral-800 mb-2">Officer Leadership Training</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-grow bg-neutral-200 h-2">
                      <div className="bg-blue-500 h-full" style={{ width: '78%' }} />
                    </div>
                    <span className="text-sm font-medium">122/156</span>
                  </div>
                  <p className="text-sm text-neutral-500">34 officers pending completion</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
