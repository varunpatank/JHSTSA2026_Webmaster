'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'leadership' | 'academic' | 'service' | 'personal' | 'competition';
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  createdAt: string;
  reflection?: string;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'challenging' | 'difficult';
  tags: string[];
  relatedGoal?: string;
}

const demoGoals: Goal[] = [
  {
    id: '1',
    title: 'Become TSA Chapter President',
    description: 'Run for and win the TSA chapter president election for the 2026-2027 school year',
    category: 'leadership',
    targetDate: '2026-05-15',
    progress: 40,
    status: 'in-progress',
    createdAt: '2026-01-10',
    milestones: [
      { id: '1a', title: 'Attend all chapter meetings this semester', completed: true, completedAt: '2026-02-01' },
      { id: '1b', title: 'Lead a committee or project', completed: true, completedAt: '2026-02-05' },
      { id: '1c', title: 'Create campaign platform', completed: false },
      { id: '1d', title: 'Get endorsements from officers', completed: false },
      { id: '1e', title: 'Win election', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Complete 50 Service Hours',
    description: 'Volunteer in the community to fulfill NHS requirements and give back',
    category: 'service',
    targetDate: '2026-06-01',
    progress: 64,
    status: 'in-progress',
    createdAt: '2026-01-15',
    milestones: [
      { id: '2a', title: 'Food bank volunteer (10 hours)', completed: true, completedAt: '2026-01-20' },
      { id: '2b', title: 'Tutoring program (15 hours)', completed: true, completedAt: '2026-02-01' },
      { id: '2c', title: 'Environmental cleanup (7 hours)', completed: true, completedAt: '2026-02-08' },
      { id: '2d', title: 'Community event volunteer (18 hours)', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Place at State TSA Competition',
    description: 'Win a top 3 placement in Webmaster or another TSA event at state',
    category: 'competition',
    targetDate: '2026-04-20',
    progress: 25,
    status: 'in-progress',
    createdAt: '2026-02-01',
    milestones: [
      { id: '3a', title: 'Form competition team', completed: true, completedAt: '2026-02-03' },
      { id: '3b', title: 'Complete project by deadline', completed: false },
      { id: '3c', title: 'Qualify at regionals', completed: false },
      { id: '3d', title: 'Place top 3 at state', completed: false },
    ]
  }
];

const demoJournal: JournalEntry[] = [
  {
    id: '1',
    date: '2026-02-09',
    title: 'Productive club meeting today!',
    content: 'Led the discussion on our Webmaster project theme. Everyone loved my ideas for the Community Resource Hub concept. Feeling really confident about our chances at regionals.',
    mood: 'great',
    tags: ['tsa', 'leadership', 'webmaster'],
    relatedGoal: '3'
  },
  {
    id: '2',
    date: '2026-02-07',
    title: 'Finished my tutoring hours',
    content: 'Completed my 15 hours of tutoring for the semester. The kids really improved their math scores and it felt rewarding to help them succeed.',
    mood: 'good',
    tags: ['service', 'tutoring', 'accomplishment'],
    relatedGoal: '2'
  },
  {
    id: '3',
    date: '2026-02-05',
    title: 'Stressed about upcoming deadlines',
    content: 'Feeling overwhelmed with competition prep and schoolwork. Need to better manage my time. Made a new schedule to help.',
    mood: 'challenging',
    tags: ['stress', 'time-management'],
  }
];

const categoryColors: Record<string, string> = {
  'leadership': 'bg-purple-500',
  'academic': 'bg-blue-500',
  'service': 'bg-green-500',
  'personal': 'bg-pink-500',
  'competition': 'bg-amber-500'
};

const categoryIcons: Record<string, string> = {
  'leadership': '👑',
  'academic': '📚',
  'service': '🤝',
  'personal': '🌟',
  'competition': '🏆'
};

const moodEmojis: Record<string, string> = {
  'great': '😄',
  'good': '🙂',
  'okay': '😐',
  'challenging': '😓',
  'difficult': '😔'
};

export default function GoalsTrackerPage() {
  const [goals, setGoals] = useState<Goal[]>(demoGoals);
  const [journal, setJournal] = useState<JournalEntry[]>(demoJournal);
  const [activeTab, setActiveTab] = useState<'goals' | 'journal' | 'insights'>('goals');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    targetDate: '',
    milestones: ['', '', '']
  });

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'good' as JournalEntry['mood'],
    tags: '',
    relatedGoal: ''
  });

  const createGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetDate: newGoal.targetDate,
      progress: 0,
      status: 'not-started',
      createdAt: new Date().toISOString().split('T')[0],
      milestones: newGoal.milestones
        .filter(m => m.trim())
        .map((m, i) => ({ id: `m${Date.now()}${i}`, title: m, completed: false }))
    };
    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', category: 'personal', targetDate: '', milestones: ['', '', ''] });
    setIsCreatingGoal(false);
    setSelectedGoal(goal);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id !== goalId) return goal;
      const updatedMilestones = goal.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return { 
          ...m, 
          completed: !m.completed, 
          completedAt: !m.completed ? new Date().toISOString().split('T')[0] : undefined 
        };
      });
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = Math.round((completedCount / updatedMilestones.length) * 100);
      const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
      return { ...goal, milestones: updatedMilestones, progress, status };
    }));
    
    // Update selected goal if viewing it
    if (selectedGoal?.id === goalId) {
      const updated = goals.find(g => g.id === goalId);
      if (updated) {
        const updatedMilestones = updated.milestones.map(m => 
          m.id === milestoneId 
            ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString().split('T')[0] : undefined }
            : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        setSelectedGoal({ ...updated, milestones: updatedMilestones, progress });
      }
    }
  };

  const addJournalEntry = () => {
    if (!newEntry.title || !newEntry.content) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(t => t),
      relatedGoal: newEntry.relatedGoal || undefined
    };
    setJournal([entry, ...journal]);
    setNewEntry({ title: '', content: '', mood: 'good', tags: '', relatedGoal: '' });
    setIsAddingEntry(false);
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    if (selectedGoal?.id === goalId) setSelectedGoal(null);
  };

  const getStatusBadge = (status: Goal['status']) => {
    const styles: Record<string, string> = {
      'not-started': 'bg-neutral-100 text-neutral-600',
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'on-hold': 'bg-yellow-100 text-yellow-700'
    };
    const labels: Record<string, string> = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'on-hold': 'On Hold'
    };
    return <span className={`px-2 py-1 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
  };

  // Calculate insights
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0);
  const completedMilestones = goals.reduce((sum, g) => sum + g.milestones.filter(m => m.completed).length, 0);
  const avgProgress = goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;
  const moodCounts = journal.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1920&q=80"
            alt="Goals"
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
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
            🎯 Goal Tracker & Journal
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Set meaningful goals, track your progress with milestones, and reflect on your journey 
            with a personal journal. Your growth story, all in one place.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-neutral-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-500">{goals.length}</div>
              <div className="text-xs text-neutral-500">Active Goals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
              <div className="text-xs text-neutral-500">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-500">{completedMilestones}/{totalMilestones}</div>
              <div className="text-xs text-neutral-500">Milestones Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{avgProgress}%</div>
              <div className="text-xs text-neutral-500">Avg. Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">{journal.length}</div>
              <div className="text-xs text-neutral-500">Journal Entries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'goals', label: '🎯 Goals', icon: '🎯' },
              { id: 'journal', label: '📔 Journal', icon: '📔' },
              { id: 'insights', label: '📊 Insights', icon: '📊' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Goals List */}
              <div className="lg:col-span-1">
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-primary-500">My Goals</h2>
                    <button
                      onClick={() => setIsCreatingGoal(true)}
                      className="text-sm bg-primary-500 text-white px-3 py-1 font-semibold hover:bg-primary-600 transition-colors"
                    >
                      + New
                    </button>
                  </div>

                  <div className="space-y-3">
                    {goals.map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal)}
                        className={`w-full text-left p-3 border transition-all ${
                          selectedGoal?.id === goal.id
                            ? 'border-primary-400 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-8 h-8 ${categoryColors[goal.category]} text-white flex items-center justify-center text-sm`}>
                            {categoryIcons[goal.category]}
                          </span>
                          <span className="font-semibold text-neutral-700 flex-grow truncate">{goal.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-grow bg-neutral-200 h-2">
                            <div 
                              className={`h-2 ${goal.progress === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-neutral-500">{goal.progress}%</span>
                        </div>
                      </button>
                    ))}

                    {goals.length === 0 && (
                      <div className="text-center py-8 text-neutral-500">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="text-sm">No goals yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Goal Detail / Create Form */}
              <div className="lg:col-span-2">
                {isCreatingGoal ? (
                  <div className="card p-6">
                    <h3 className="text-xl font-bold text-primary-500 mb-4">Create New Goal</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Goal Title *</label>
                        <input
                          type="text"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                          placeholder="e.g., Win state competition"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Description</label>
                        <textarea
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                          placeholder="Why is this goal important to you?"
                          className="input-field"
                          rows={2}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-1">Category</label>
                          <select
                            value={newGoal.category}
                            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                            className="select-field"
                          >
                            <option value="leadership">👑 Leadership</option>
                            <option value="academic">📚 Academic</option>
                            <option value="service">🤝 Service</option>
                            <option value="personal">🌟 Personal</option>
                            <option value="competition">🏆 Competition</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-1">Target Date *</label>
                          <input
                            type="date"
                            value={newGoal.targetDate}
                            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Milestones (optional)</label>
                        <p className="text-xs text-neutral-500 mb-2">Break down your goal into smaller steps</p>
                        {newGoal.milestones.map((milestone, index) => (
                          <input
                            key={index}
                            type="text"
                            value={milestone}
                            onChange={(e) => {
                              const updated = [...newGoal.milestones];
                              updated[index] = e.target.value;
                              if (index === newGoal.milestones.length - 1 && e.target.value) {
                                updated.push('');
                              }
                              setNewGoal({ ...newGoal, milestones: updated });
                            }}
                            placeholder={`Milestone ${index + 1}`}
                            className="input-field mb-2"
                          />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button onClick={createGoal} className="btn-primary">Create Goal</button>
                        <button onClick={() => setIsCreatingGoal(false)} className="btn-outline">Cancel</button>
                      </div>
                    </div>
                  </div>
                ) : selectedGoal ? (
                  <div className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-12 h-12 ${categoryColors[selectedGoal.category]} text-white flex items-center justify-center text-2xl`}>
                          {categoryIcons[selectedGoal.category]}
                        </span>
                        <div>
                          <h2 className="text-2xl font-bold text-primary-500">{selectedGoal.title}</h2>
                          <p className="text-sm text-neutral-500">Target: {new Date(selectedGoal.targetDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedGoal.status)}
                        <button
                          onClick={() => deleteGoal(selectedGoal.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Delete goal"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {selectedGoal.description && (
                      <p className="text-neutral-600 mb-6">{selectedGoal.description}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-neutral-700">Overall Progress</span>
                        <span className="text-2xl font-bold text-primary-500">{selectedGoal.progress}%</span>
                      </div>
                      <div className="bg-neutral-200 h-4">
                        <div 
                          className={`h-4 transition-all ${selectedGoal.progress === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                          style={{ width: `${selectedGoal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="mb-6">
                      <h3 className="font-bold text-neutral-700 mb-3">Milestones</h3>
                      <div className="space-y-2">
                        {selectedGoal.milestones.map(milestone => (
                          <button
                            key={milestone.id}
                            onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                            className={`w-full text-left p-3 border transition-all flex items-center gap-3 ${
                              milestone.completed
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-neutral-200 hover:border-primary-300'
                            }`}
                          >
                            <span className={`w-6 h-6 border-2 flex items-center justify-center ${
                              milestone.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-neutral-300'
                            }`}>
                              {milestone.completed && '✓'}
                            </span>
                            <span className={`flex-grow ${milestone.completed ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                              {milestone.title}
                            </span>
                            {milestone.completedAt && (
                              <span className="text-xs text-green-600">
                                ✓ {new Date(milestone.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add Reflection */}
                    <div className="p-4 bg-neutral-50 border border-neutral-200">
                      <h4 className="font-semibold text-neutral-700 mb-2">Reflection Notes</h4>
                      <textarea
                        placeholder="What have you learned so far? Any challenges or insights?"
                        className="input-field"
                        rows={3}
                        defaultValue={selectedGoal.reflection}
                      />
                      <button className="btn-outline text-sm mt-2">Save Reflection</button>
                    </div>
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-neutral-700 mb-2">Select or Create a Goal</h3>
                    <p className="text-neutral-600 mb-6">Choose a goal to view details or create a new one</p>
                    <button onClick={() => setIsCreatingGoal(true)} className="btn-primary">
                      + Create New Goal
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Journal Tab */}
          {activeTab === 'journal' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-500">My Journal</h2>
                <button
                  onClick={() => setIsAddingEntry(true)}
                  className="btn-primary"
                >
                  + New Entry
                </button>
              </div>

              {/* New Entry Form */}
              {isAddingEntry && (
                <div className="card p-6 mb-6 border-2 border-primary-300">
                  <h3 className="text-lg font-bold text-primary-500 mb-4">New Journal Entry</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        placeholder="Give this entry a title..."
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">How are you feeling?</label>
                      <div className="flex gap-2">
                        {Object.entries(moodEmojis).map(([mood, emoji]) => (
                          <button
                            key={mood}
                            onClick={() => setNewEntry({ ...newEntry, mood: mood as JournalEntry['mood'] })}
                            className={`text-2xl p-2 border transition-all ${
                              newEntry.mood === mood 
                                ? 'border-primary-500 bg-primary-50 scale-110' 
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                            title={mood}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Content *</label>
                      <textarea
                        value={newEntry.content}
                        onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                        placeholder="What's on your mind? What happened today?"
                        className="input-field"
                        rows={5}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Tags</label>
                        <input
                          type="text"
                          value={newEntry.tags}
                          onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                          placeholder="comma, separated, tags"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Related Goal</label>
                        <select
                          value={newEntry.relatedGoal}
                          onChange={(e) => setNewEntry({ ...newEntry, relatedGoal: e.target.value })}
                          className="select-field"
                        >
                          <option value="">None</option>
                          {goals.map(goal => (
                            <option key={goal.id} value={goal.id}>{goal.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={addJournalEntry} className="btn-primary">Save Entry</button>
                      <button onClick={() => setIsAddingEntry(false)} className="btn-outline">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Journal Entries */}
              <div className="space-y-4">
                {journal.map(entry => (
                  <div key={entry.id} className="card p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                          <h3 className="text-lg font-bold text-neutral-700">{entry.title}</h3>
                        </div>
                        <p className="text-sm text-neutral-400">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      {entry.relatedGoal && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1">
                          🎯 {goals.find(g => g.id === entry.relatedGoal)?.title}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 mb-3">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {journal.length === 0 && (
                  <div className="text-center py-16 card">
                    <div className="text-5xl mb-4">📔</div>
                    <h3 className="text-xl font-bold text-neutral-700 mb-2">Your journal is empty</h3>
                    <p className="text-neutral-600 mb-4">Start documenting your journey!</p>
                    <button onClick={() => setIsAddingEntry(true)} className="btn-primary">
                      Write First Entry
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-primary-500">Your Progress Insights</h2>

              {/* Goal Progress */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-700 mb-4">Goal Progress by Category</h3>
                <div className="grid md:grid-cols-5 gap-4">
                  {Object.entries(categoryColors).map(([category, color]) => {
                    const categoryGoals = goals.filter(g => g.category === category);
                    const avgProgress = categoryGoals.length > 0 
                      ? Math.round(categoryGoals.reduce((sum, g) => sum + g.progress, 0) / categoryGoals.length)
                      : 0;
                    return (
                      <div key={category} className="text-center p-4 bg-neutral-50">
                        <span className={`inline-block w-12 h-12 ${color} text-white text-2xl flex items-center justify-center mb-2`}>
                          {categoryIcons[category]}
                        </span>
                        <div className="text-2xl font-bold text-neutral-700">{avgProgress}%</div>
                        <div className="text-xs text-neutral-500 capitalize">{category}</div>
                        <div className="text-xs text-neutral-400">{categoryGoals.length} goals</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mood Tracker */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-700 mb-4">Mood Distribution</h3>
                <div className="flex gap-4 justify-center">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => {
                    const count = moodCounts[mood] || 0;
                    const percentage = journal.length > 0 ? Math.round((count / journal.length) * 100) : 0;
                    return (
                      <div key={mood} className="text-center">
                        <div className="text-4xl mb-2">{emoji}</div>
                        <div className="text-xl font-bold text-neutral-700">{count}</div>
                        <div className="text-xs text-neutral-500 capitalize">{mood}</div>
                        <div className="text-xs text-neutral-400">{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones Timeline */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-700 mb-4">Recent Milestones</h3>
                <div className="space-y-3">
                  {goals
                    .flatMap(g => g.milestones.filter(m => m.completed && m.completedAt).map(m => ({ ...m, goalTitle: g.title })))
                    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                    .slice(0, 5)
                    .map(milestone => (
                      <div key={milestone.id} className="flex items-center gap-4 p-3 bg-green-50 border border-green-200">
                        <span className="text-green-500 text-2xl">✓</span>
                        <div className="flex-grow">
                          <div className="font-semibold text-neutral-700">{milestone.title}</div>
                          <div className="text-xs text-neutral-500">{milestone.goalTitle}</div>
                        </div>
                        <div className="text-sm text-green-600">{new Date(milestone.completedAt!).toLocaleDateString()}</div>
                      </div>
                    ))}
                  {goals.flatMap(g => g.milestones).filter(m => m.completed).length === 0 && (
                    <p className="text-neutral-500 text-center py-4">No milestones completed yet</p>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                <h3 className="text-lg font-bold text-primary-700 mb-3">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li>• Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound</li>
                  <li>• Break big goals into smaller milestones for easier tracking</li>
                  <li>• Journal regularly to track your mood and progress</li>
                  <li>• Celebrate small wins along the way!</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
