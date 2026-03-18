'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MySpacePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'collections' | 'clubs'>('overview');

  // Mock user data
  const user = {
    name: 'Alex Johnson',
    grade: '11th Grade',
    clubs: ['TSA', 'Robotics Club', 'NHS'],
    role: 'TSA Chapter President',
    joinDate: 'August 2023',
  };

  const goals = [
    { id: 1, title: 'Win TSA State Competition', progress: 65, deadline: 'Mar 2025', status: 'in-progress' },
    { id: 2, title: 'Recruit 10 new members', progress: 80, deadline: 'Dec 2024', status: 'in-progress' },
    { id: 3, title: 'Complete leadership training', progress: 100, deadline: 'Nov 2024', status: 'completed' },
    { id: 4, title: 'Organize spring fundraiser', progress: 20, deadline: 'Apr 2025', status: 'in-progress' },
  ];

  const collections = [
    { id: 1, name: 'Competition Resources', items: 12, icon: '🏆' },
    { id: 2, name: 'Meeting Templates', items: 8, icon: '📋' },
    { id: 3, name: 'Fundraising Ideas', items: 15, icon: '💰' },
  ];

  const myClubs = [
    { id: 'tsa', name: 'Technology Student Association', role: 'President', status: 'Active' },
    { id: 'robotics', name: 'Robotics Club', role: 'Member', status: 'Active' },
    { id: 'nhs', name: 'National Honor Society', role: 'Member', status: 'Active' },
  ];

  const recentActivity = [
    { id: 1, action: 'Completed goal: Leadership training', time: '2 hours ago', icon: '✅' },
    { id: 2, action: 'Added resource to Competition collection', time: '1 day ago', icon: '📚' },
    { id: 3, action: 'Posted in TSA discussion forum', time: '2 days ago', icon: '💬' },
    { id: 4, action: 'Updated goal progress: State Competition', time: '3 days ago', icon: '📊' },
  ];

  const notifications = [
    { id: 1, message: 'TSA meeting tomorrow at 3pm', type: 'reminder', unread: true },
    { id: 2, message: 'New competition deadline announced', type: 'alert', unread: true },
    { id: 3, message: 'Your fundraiser proposal was approved', type: 'success', unread: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">{user.name}</h1>
              <p className="text-neutral-200">{user.role} • {user.grade}</p>
              <p className="text-neutral-300 text-sm mt-1">Member since {user.joinDate}</p>
            </div>
            <div className="ml-auto flex gap-3">
              <Link 
                href="/profile"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg"
              >
                Edit Profile
              </Link>
              <Link 
                href="/notifications"
                className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 transition-colors rounded-lg relative"
              >
                Notifications
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-600 text-xs flex items-center justify-center rounded-full">
                  {notifications.filter(n => n.unread).length}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'goals', label: 'My Goals', icon: '🎯' },
              { key: 'collections', label: 'My Collections', icon: '📁' },
              { key: 'clubs', label: 'My Clubs', icon: '🏫' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'goals' | 'collections' | 'clubs')}
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-neutral-200 p-5">
                  <div className="text-3xl font-bold text-primary-600">{myClubs.length}</div>
                  <div className="text-neutral-600">Active Clubs</div>
                </div>
                <div className="bg-white border-2 border-neutral-200 p-5">
                  <div className="text-3xl font-bold text-secondary-600">{goals.filter(g => g.status === 'completed').length}/{goals.length}</div>
                  <div className="text-neutral-600">Goals Completed</div>
                </div>
                <div className="bg-white border-2 border-neutral-200 p-5">
                  <div className="text-3xl font-bold text-accent-600">{collections.reduce((acc, c) => acc + c.items, 0)}</div>
                  <div className="text-neutral-600">Saved Resources</div>
                </div>
              </div>

              {/* Active Goals Preview */}
              <div className="bg-white border-2 border-neutral-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-primary-700">Active Goals</h2>
                  <button 
                    onClick={() => setActiveTab('goals')}
                    className="text-secondary-600 hover:text-secondary-700 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-4">
                  {goals.filter(g => g.status === 'in-progress').slice(0, 3).map(goal => (
                    <div key={goal.id} className="border border-neutral-200 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-primary-700">{goal.title}</h3>
                        <span className="text-sm text-neutral-500">{goal.deadline}</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2">
                        <div 
                          className="bg-secondary-500 h-2" 
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="text-right text-sm text-neutral-500 mt-1">{goal.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Clubs Preview */}
              <div className="bg-white border-2 border-neutral-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-primary-700">My Clubs</h2>
                  <button 
                    onClick={() => setActiveTab('clubs')}
                    className="text-secondary-600 hover:text-secondary-700 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {myClubs.map(club => (
                    <Link
                      key={club.id}
                      href={`/directory/${club.id}`}
                      className="flex items-center justify-between p-4 border border-neutral-200 hover:border-primary-400 hover:bg-neutral-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-primary-700">{club.name}</h3>
                        <span className="text-sm text-neutral-500">{club.role}</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium">
                        {club.status}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white border-2 border-neutral-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-primary-700">Notifications</h2>
                  <Link href="/notifications" className="text-secondary-600 hover:text-secondary-700 text-sm">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-3 border-l-4 ${
                        notif.unread ? 'bg-primary-50 border-primary-500' : 'bg-neutral-50 border-neutral-300'
                      }`}
                    >
                      <p className="text-sm text-neutral-700">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border-2 border-neutral-200 p-6">
                <h2 className="text-lg font-bold text-primary-700 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex gap-3 text-sm">
                      <span className="text-lg">{activity.icon}</span>
                      <div>
                        <p className="text-neutral-700">{activity.action}</p>
                        <p className="text-neutral-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-primary-50 border-2 border-primary-200 p-6">
                <h2 className="text-lg font-bold text-primary-700 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link 
                    href="/hub/goals" 
                    className="block w-full px-4 py-2 bg-primary-600 text-white text-center hover:bg-primary-700 transition-colors"
                  >
                    ➕ Add New Goal
                  </Link>
                  <Link 
                    href="/community" 
                    className="block w-full px-4 py-2 bg-secondary-500 text-white text-center hover:bg-secondary-600 transition-colors"
                  >
                    💬 Join Discussion
                  </Link>
                  <Link 
                    href="/hub/manage-club" 
                    className="block w-full px-4 py-2 bg-white border border-neutral-300 text-primary-700 text-center hover:bg-neutral-50 transition-colors"
                  >
                    ⚙️ Manage My Club
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-700">My Goals</h2>
              <Link 
                href="/hub/goals"
                className="px-4 py-2 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
              >
                ➕ Add New Goal
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {goals.map(goal => (
                <div key={goal.id} className="bg-white border-2 border-neutral-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-primary-700">{goal.title}</h3>
                    <span className={`px-3 py-1 text-sm font-medium ${
                      goal.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {goal.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-neutral-500 mb-4">Deadline: {goal.deadline}</p>
                  <div className="w-full bg-neutral-200 h-3">
                    <div 
                      className={`h-3 ${goal.status === 'completed' ? 'bg-green-500' : 'bg-secondary-500'}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-neutral-500 mt-2">{goal.progress}% complete</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-700">My Collections</h2>
              <Link 
                href="/hub/my-collections"
                className="px-4 py-2 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
              >
                ➕ Create Collection
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {collections.map(collection => (
                <Link
                  key={collection.id}
                  href="/hub/my-collections"
                  className="bg-white border-2 border-neutral-200 p-6 hover:border-primary-400 hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-4">{collection.icon}</div>
                  <h3 className="text-lg font-bold text-primary-700">{collection.name}</h3>
                  <p className="text-neutral-500">{collection.items} items saved</p>
                </Link>
              ))}
              <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 p-6 flex flex-col items-center justify-center text-neutral-400 hover:text-primary-600 hover:border-primary-400 transition-colors cursor-pointer">
                <span className="text-4xl mb-2">➕</span>
                <span>Create New Collection</span>
              </div>
            </div>
          </div>
        )}

        {/* Clubs Tab */}
        {activeTab === 'clubs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-700">My Clubs</h2>
              <Link 
                href="/explore"
                className="px-4 py-2 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
              >
                🔍 Discover More Clubs
              </Link>
            </div>
            <div className="space-y-4">
              {myClubs.map(club => (
                <div key={club.id} className="bg-white border-2 border-neutral-200 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary-700">{club.name}</h3>
                      <p className="text-neutral-500">Role: {club.role}</p>
                    </div>
                    <div className="flex gap-3">
                      <Link 
                        href={`/directory/${club.id}`}
                        className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                      >
                        View Club
                      </Link>
                      {club.role === 'President' && (
                        <Link 
                          href="/hub/manage-club"
                          className="px-4 py-2 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
                        >
                          Manage Club
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
