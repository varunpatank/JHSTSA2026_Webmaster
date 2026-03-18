'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { chapters } from '@/lib/data';

const budgetAllocations = [
  { chapter: 'Model United Nations', allocated: 3500, spent: 2100, remaining: 1400 },
  { chapter: 'Robotics Team', allocated: 8000, spent: 5500, remaining: 2500 },
  { chapter: 'Drama Club', allocated: 4500, spent: 3200, remaining: 1300 },
  { chapter: 'Community Service Club', allocated: 1500, spent: 800, remaining: 700 },
  { chapter: 'Debate Team', allocated: 2500, spent: 1900, remaining: 600 },
  { chapter: 'Environmental Club', allocated: 1200, spent: 650, remaining: 550 },
];

const purchaseRequests = [
  { id: 1, chapter: 'Robotics Team', item: 'Motor Controllers (x5)', amount: 450, status: 'Pending', date: '2026-01-10' },
  { id: 2, chapter: 'Drama Club', item: 'Costume Materials', amount: 320, status: 'Approved', date: '2026-01-08' },
  { id: 3, chapter: 'Model UN', item: 'Conference Registration', amount: 800, status: 'Pending', date: '2026-01-05' },
];

const grants = [
  { 
    id: 1, 
    title: 'Innovation Grant', 
    amount: '$2,500', 
    deadline: '2026-02-15',
    description: 'For chapters developing new technology or innovative programs.',
    eligibility: 'STEM and Academic chapters'
  },
  { 
    id: 2, 
    title: 'Community Impact Award', 
    amount: '$1,500', 
    deadline: '2026-03-01',
    description: 'For chapters with outstanding community service projects.',
    eligibility: 'Service and Cultural chapters'
  },
  { 
    id: 3, 
    title: 'Arts Enrichment Fund', 
    amount: '$2,000', 
    deadline: '2026-02-28',
    description: 'Support for arts programs, productions, and equipment.',
    eligibility: 'Arts and Media chapters'
  },
];

export default function FundingPage() {
  const [activeTab, setActiveTab] = useState<'budgets' | 'requests' | 'grants' | 'fundraising'>('budgets');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const totalAllocated = budgetAllocations.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgetAllocations.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80"
            alt="Financial planning"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/85"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="page-title text-white">Funding & Budget Center</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Manage chapter budgets, submit purchase requests, and explore funding opportunities.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card border-l-4 border-l-primary-500">
            <div className="stat-number text-2xl">${totalAllocated.toLocaleString()}</div>
            <div className="stat-label">Total Allocated</div>
          </div>
          <div className="stat-card border-l-4 border-l-secondary-500">
            <div className="stat-number text-2xl">${totalSpent.toLocaleString()}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-card border-l-4 border-l-green-500">
            <div className="stat-number text-2xl">${totalRemaining.toLocaleString()}</div>
            <div className="stat-label">Remaining</div>
          </div>
          <div className="stat-card border-l-4 border-l-yellow-500">
            <div className="stat-number text-2xl">{purchaseRequests.filter(r => r.status === 'Pending').length}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
        </div>

        <div className="card mb-8">
          <div className="flex flex-wrap border-b border-neutral-200">
            {[
              { key: 'budgets', label: 'Budget Allocations' },
              { key: 'requests', label: 'Purchase Requests' },
              { key: 'grants', label: 'Grant Opportunities' },
              { key: 'fundraising', label: 'Fundraising Tracker' },
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

        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary-500 font-heading">Chapter Budget Allocations</h2>
                <span className="text-sm text-neutral-500">Academic Year 2025-2026</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Chapter</th>
                    <th className="table-header">Allocated</th>
                    <th className="table-header">Spent</th>
                    <th className="table-header">Remaining</th>
                    <th className="table-header">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetAllocations.map((budget) => {
                    const usage = Math.round((budget.spent / budget.allocated) * 100);
                    return (
                      <tr key={budget.chapter} className="table-row-hover">
                        <td className="table-cell font-medium">{budget.chapter}</td>
                        <td className="table-cell">${budget.allocated.toLocaleString()}</td>
                        <td className="table-cell">${budget.spent.toLocaleString()}</td>
                        <td className="table-cell text-green-600 font-medium">${budget.remaining.toLocaleString()}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex-grow bg-neutral-200 h-2 w-24">
                              <div 
                                className={`h-full ${usage > 80 ? 'bg-red-500' : usage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${usage}%` }}
                              />
                            </div>
                            <span className="text-sm">{usage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary-500 font-heading">Purchase Requests</h2>
              <button onClick={() => setShowRequestForm(true)} className="btn-primary">
                + New Request
              </button>
            </div>

            {showRequestForm && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-primary-500 mb-4 font-heading">Submit Purchase Request</h3>
                <form className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Chapter *</label>
                    <select className="select-field">
                      <option value="">Select chapter</option>
                      {chapters.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Amount ($) *</label>
                    <input type="number" className="input-field" placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Item Description *</label>
                    <input type="text" className="input-field" placeholder="What are you purchasing?" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Justification *</label>
                    <textarea className="input-field" rows={3} placeholder="Why is this purchase necessary?" />
                  </div>
                  <div className="md:col-span-2 flex gap-4">
                    <button type="submit" className="btn-primary">Submit Request</button>
                    <button type="button" onClick={() => setShowRequestForm(false)} className="btn-outline">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Chapter</th>
                    <th className="table-header">Item</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseRequests.map((request) => (
                    <tr key={request.id} className="table-row-hover">
                      <td className="table-cell font-medium">{request.chapter}</td>
                      <td className="table-cell">{request.item}</td>
                      <td className="table-cell">${request.amount}</td>
                      <td className="table-cell">{new Date(request.date).toLocaleDateString()}</td>
                      <td className="table-cell">
                        <span className={`badge ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{request.status}</span>
                      </td>
                      <td className="table-cell">
                        <button className="text-primary-500 hover:underline text-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'grants' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-primary-500 font-heading">Available Grants</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {grants.map((grant) => (
                <div key={grant.id} className="card overflow-hidden">
                  <div className="bg-secondary-500 p-4 text-white">
                    <h3 className="text-lg font-bold font-heading">{grant.title}</h3>
                    <p className="text-2xl font-bold mt-2">{grant.amount}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-neutral-600 mb-4">{grant.description}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Deadline</span>
                        <span className="font-medium">{new Date(grant.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Eligibility</span>
                        <span className="font-medium">{grant.eligibility}</span>
                      </div>
                    </div>
                    <button className="btn-primary w-full">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-6 mt-8">
              <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Community Partnership Opportunities</h2>
              <p className="text-neutral-600 mb-4">
                Connect with local businesses and organizations for sponsorships and collaborative funding.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-neutral-200">
                  <h4 className="font-semibold text-neutral-800">Local Business Sponsorships</h4>
                  <p className="text-sm text-neutral-500 mt-1">Partner with local businesses for event and equipment sponsorships.</p>
                </div>
                <div className="p-4 border border-neutral-200">
                  <h4 className="font-semibold text-neutral-800">Corporate Matching</h4>
                  <p className="text-sm text-neutral-500 mt-1">Many companies match employee donations to school organizations.</p>
                </div>
                <div className="p-4 border border-neutral-200">
                  <h4 className="font-semibold text-neutral-800">Community Foundations</h4>
                  <p className="text-sm text-neutral-500 mt-1">Apply for grants from local community foundations and trusts.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fundraising' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Active Fundraisers</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Robotics Team - Robot Parts Fund', goal: 3000, raised: 1850, daysLeft: 15 },
                    { name: 'Drama Club - Spring Musical', goal: 2000, raised: 1200, daysLeft: 30 },
                    { name: 'Model UN - Conference Travel', goal: 5000, raised: 3200, daysLeft: 21 },
                  ].map((fund, idx) => (
                    <div key={idx} className="p-4 border border-neutral-200">
                      <h4 className="font-semibold text-neutral-800">{fund.name}</h4>
                      <div className="flex justify-between text-sm mt-2 mb-1">
                        <span className="text-neutral-600">${fund.raised.toLocaleString()} of ${fund.goal.toLocaleString()}</span>
                        <span className="text-secondary-500 font-medium">{fund.daysLeft} days left</span>
                      </div>
                      <div className="bg-neutral-200 h-2">
                        <div 
                          className="bg-secondary-500 h-full" 
                          style={{ width: `${(fund.raised / fund.goal) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold text-primary-500 font-heading mb-4">Start a Fundraiser</h2>
                <p className="text-neutral-600 mb-4">
                  Launch a crowdfunding campaign for your chapter&apos;s projects and activities.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Campaign Title</label>
                    <input type="text" className="input-field" placeholder="e.g., Spring Conference Fund" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Goal Amount ($)</label>
                    <input type="number" className="input-field" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Description</label>
                    <textarea className="input-field" rows={3} placeholder="Describe what you're raising funds for..." />
                  </div>
                  <button type="submit" className="btn-primary w-full">Create Fundraiser</button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-neutral-200">
                <h2 className="text-lg font-bold text-primary-500 font-heading">Fundraising History</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Campaign</th>
                    <th className="table-header">Chapter</th>
                    <th className="table-header">Goal</th>
                    <th className="table-header">Raised</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { campaign: 'Fall Competition Fund', chapter: 'Robotics Team', goal: 2500, raised: 2750, status: 'Completed' },
                    { campaign: 'Winter Musical Costumes', chapter: 'Drama Club', goal: 1500, raised: 1500, status: 'Completed' },
                    { campaign: 'National Qualifiers Travel', chapter: 'Debate Team', goal: 4000, raised: 3800, status: 'Completed' },
                  ].map((item, idx) => (
                    <tr key={idx} className="table-row-hover">
                      <td className="table-cell font-medium">{item.campaign}</td>
                      <td className="table-cell">{item.chapter}</td>
                      <td className="table-cell">${item.goal.toLocaleString()}</td>
                      <td className="table-cell text-green-600">${item.raised.toLocaleString()}</td>
                      <td className="table-cell">
                        <span className="badge bg-green-100 text-green-700">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
