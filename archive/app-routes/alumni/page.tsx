'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const featuredAlumni = [
  {
    id: 1,
    name: 'Jessica Chen',
    gradYear: 2022,
    chapter: 'Model United Nations',
    college: 'Georgetown University',
    major: 'International Relations',
    career: 'Policy Analyst',
    photo: null,
    available: true,
  },
  {
    id: 2,
    name: 'Marcus Williams',
    gradYear: 2021,
    chapter: 'Robotics Team',
    college: 'MIT',
    major: 'Mechanical Engineering',
    career: 'Robotics Engineer at Boston Dynamics',
    photo: null,
    available: true,
  },
  {
    id: 3,
    name: 'Sarah Martinez',
    gradYear: 2020,
    chapter: 'Community Service Club',
    college: 'UC Berkeley',
    major: 'Social Work',
    career: 'Non-profit Director',
    photo: null,
    available: false,
  },
];

const careerPanels = [
  {
    id: 1,
    title: 'Careers in Technology',
    date: '2026-02-15',
    time: '4:00 PM - 5:30 PM',
    panelists: 4,
    registrations: 45,
  },
  {
    id: 2,
    title: 'Paths to Law School',
    date: '2026-02-22',
    time: '4:00 PM - 5:30 PM',
    panelists: 3,
    registrations: 32,
  },
  {
    id: 3,
    title: 'Creative Arts Careers',
    date: '2026-03-05',
    time: '4:00 PM - 5:30 PM',
    panelists: 5,
    registrations: 28,
  },
];

const internships = [
  {
    id: 1,
    title: 'Summer Research Internship',
    company: 'Tech Innovation Labs',
    location: 'Hybrid',
    type: 'Summer 2026',
    postedBy: 'Marcus Williams (Class of 2021)',
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'Creative Media Group',
    location: 'Remote',
    type: 'Part-time during school',
    postedBy: 'Emily Thompson (Class of 2023)',
  },
  {
    id: 3,
    title: 'Engineering Shadow Program',
    company: 'Aerospace Solutions Inc.',
    location: 'On-site',
    type: 'Spring Break 2026',
    postedBy: 'David Park (Class of 2019)',
  },
];

export default function AlumniPage() {
  const [activeTab, setActiveTab] = useState<'network' | 'mentorship' | 'careers' | 'donate'>('network');
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80"
            alt="Alumni gathering"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/85"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="page-title text-white">Alumni & Mentorship Network</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Connect with former chapter members for mentorship, career advice, and networking opportunities.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <div className="flex flex-wrap border-b border-neutral-200">
            {[
              { key: 'network', label: 'Alumni Network' },
              { key: 'mentorship', label: 'Mentorship' },
              { key: 'careers', label: 'Career Connection' },
              { key: 'donate', label: 'Support Chapters' },
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

        {!showRegistration && (
          <div className="card p-6 mb-8 bg-secondary-500 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading">Are you an alumnus/alumna?</h2>
                <p className="text-secondary-100">Register to connect with current students and give back to your chapter.</p>
              </div>
              <button 
                onClick={() => setShowRegistration(true)}
                className="bg-white text-secondary-500 px-6 py-2 font-semibold hover:bg-neutral-100 transition-colors"
              >
                Register as Alumni
              </button>
            </div>
          </div>
        )}

        {showRegistration && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold text-primary-500 font-heading mb-6">Alumni Registration</h2>
            <form className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name *</label>
                <input type="text" className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Graduation Year *</label>
                <select className="select-field">
                  <option value="">Select year</option>
                  {Array.from({ length: 20 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Chapter(s) *</label>
                <input type="text" className="input-field" placeholder="e.g., Model UN, Debate Team" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email *</label>
                <input type="email" className="input-field" placeholder="your.email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">College/University</label>
                <input type="text" className="input-field" placeholder="Current or attended" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Current Career/Industry</label>
                <input type="text" className="input-field" placeholder="Your current profession" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-neutral-700">I am interested in being a mentor to current students</span>
                </label>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="btn-primary">Submit Registration</button>
                <button type="button" onClick={() => setShowRegistration(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-8">
            <div className="card p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <input type="text" placeholder="Search alumni..." className="input-field" />
                <select className="select-field">
                  <option value="">All Chapters</option>
                  <option value="model-un">Model United Nations</option>
                  <option value="robotics">Robotics Team</option>
                  <option value="service">Community Service Club</option>
                </select>
                <select className="select-field">
                  <option value="">All Industries</option>
                  <option value="tech">Technology</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                </select>
                <select className="select-field">
                  <option value="">All Graduation Years</option>
                  {Array.from({ length: 10 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h2 className="section-title">Where Are They Now?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredAlumni.map((alum) => (
                  <div key={alum.id} className="card overflow-hidden">
                    <div className="bg-primary-500 p-6 text-white">
                      <div className="w-20 h-20 bg-white mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-500">
                          {alum.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-center font-heading">{alum.name}</h3>
                      <p className="text-center text-neutral-200">Class of {alum.gradYear}</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Chapter</span>
                          <span className="font-medium">{alum.chapter}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">College</span>
                          <span className="font-medium">{alum.college}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Major</span>
                          <span className="font-medium">{alum.major}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Career</span>
                          <span className="font-medium">{alum.career}</span>
                        </div>
                      </div>
                      {alum.available && (
                        <button className="btn-outline w-full mt-4 text-sm py-2">
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mentorship' && (
          <div className="space-y-8">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-bold text-primary-500 font-heading mb-4">Find a Mentor</h2>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Connect with alumni who have been in your shoes. Get guidance on college applications, 
                career paths, and making the most of your chapter experience.
              </p>
              <button className="btn-primary">Request a Mentor Match</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-bold text-primary-500 font-heading">For Current Students</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">College Application Advice</h4>
                    <p className="text-sm text-neutral-600">Get tips on essays, interviews, and showcasing your chapter involvement.</p>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">Career Exploration</h4>
                    <p className="text-sm text-neutral-600">Learn about different career paths from alumni in various industries.</p>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">Leadership Development</h4>
                    <p className="text-sm text-neutral-600">Develop leadership skills with guidance from experienced mentors.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-bold text-primary-500 font-heading">For Alumni</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">Become a Mentor</h4>
                    <p className="text-sm text-neutral-600">Give back by guiding the next generation of chapter leaders.</p>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">Host a Workshop</h4>
                    <p className="text-sm text-neutral-600">Share your expertise through virtual or in-person workshops.</p>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200">
                    <h4 className="font-semibold text-neutral-800 mb-2">Flexible Commitment</h4>
                    <p className="text-sm text-neutral-600">Choose your level of involvement - from occasional chats to ongoing mentorship.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="space-y-8">
            <div>
              <h2 className="section-title">Upcoming Virtual Career Panels</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {careerPanels.map((panel) => (
                  <div key={panel.id} className="card p-6">
                    <h3 className="text-lg font-bold text-primary-500 font-heading mb-2">{panel.title}</h3>
                    <p className="text-neutral-600 mb-4">
                      {new Date(panel.date).toLocaleDateString('en-US', { 
                        weekday: 'long', month: 'long', day: 'numeric' 
                      })}
                    </p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Time</span>
                        <span className="font-medium">{panel.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Panelists</span>
                        <span className="font-medium">{panel.panelists} alumni</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Registered</span>
                        <span className="font-medium">{panel.registrations} students</span>
                      </div>
                    </div>
                    <button className="btn-primary w-full">Register</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary-500 font-heading">Internship & Job Shadow Postings</h2>
                <span className="text-sm text-neutral-500">{internships.length} opportunities</span>
              </div>
              <div className="divide-y divide-neutral-200">
                {internships.map((job) => (
                  <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-neutral-800">{job.title}</h3>
                      <p className="text-neutral-600">{job.company}</p>
                      <div className="flex gap-4 mt-2 text-sm text-neutral-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                      <p className="text-sm text-secondary-500 mt-1">Posted by: {job.postedBy}</p>
                    </div>
                    <button className="btn-outline">Learn More</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donate' && (
          <div className="space-y-8">
            <div className="card p-8 text-center bg-secondary-500 text-white">
              <h2 className="text-2xl font-bold font-heading mb-4">Support Your Chapter</h2>
              <p className="text-secondary-100 mb-6 max-w-2xl mx-auto">
                Your donation helps current members attend conferences, purchase equipment, 
                and create amazing experiences just like you had.
              </p>
              <button className="bg-white text-secondary-500 px-8 py-3 font-bold hover:bg-neutral-100 transition-colors">
                Make a Donation
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { chapter: 'Model United Nations', goal: 5000, raised: 3250, donors: 28 },
                { chapter: 'Robotics Team', goal: 10000, raised: 7500, donors: 45 },
                { chapter: 'Drama Club', goal: 3000, raised: 1800, donors: 19 },
              ].map((fund) => (
                <div key={fund.chapter} className="card p-6">
                  <h3 className="font-bold text-primary-500 font-heading mb-4">{fund.chapter}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-600">${fund.raised.toLocaleString()} raised</span>
                      <span className="font-medium">{Math.round((fund.raised / fund.goal) * 100)}%</span>
                    </div>
                    <div className="bg-neutral-200 h-3">
                      <div 
                        className="bg-secondary-500 h-full" 
                        style={{ width: `${(fund.raised / fund.goal) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">Goal: ${fund.goal.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">{fund.donors} donors</p>
                  <button className="btn-outline w-full">Donate</button>
                </div>
              ))}
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-primary-500 font-heading mb-6">Your Impact</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-500">$45,000</div>
                  <div className="text-neutral-600">Raised This Year</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-500">156</div>
                  <div className="text-neutral-600">Alumni Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-500">23</div>
                  <div className="text-neutral-600">Chapters Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-500">450+</div>
                  <div className="text-neutral-600">Students Benefited</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
