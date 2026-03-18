'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: { name: string; avatar: string; role: string };
  category: string;
  club?: string;
  createdAt: string;
  replies: Reply[];
  views: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
}

interface Reply {
  id: string;
  content: string;
  author: { name: string; avatar: string; role: string };
  createdAt: string;
  likes: number;
  isAnswer?: boolean;
}

const demoDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Tips for recruiting new members at the beginning of the year?',
    content: 'Our club lost a lot of seniors last year and we need to rebuild. What strategies have worked for you to attract new members during club fair and the first few weeks of school?',
    author: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', role: 'President' },
    category: 'Recruiting',
    createdAt: '2026-02-09T10:30:00',
    views: 234,
    likes: 18,
    isPinned: true,
    isLocked: false,
    tags: ['recruiting', 'membership', 'growth'],
    replies: [
      {
        id: '1a',
        content: 'We created an interactive demo at our club fair booth - it really helped draw people in! Also, having current members wear club shirts creates visibility.',
        author: { name: 'Marcus Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Vice President' },
        createdAt: '2026-02-09T11:45:00',
        likes: 12,
        isAnswer: true
      },
      {
        id: '1b',
        content: 'Social media presence before school starts helps a lot. We post teaser content on Instagram over the summer.',
        author: { name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', role: 'Member' },
        createdAt: '2026-02-09T14:20:00',
        likes: 8
      }
    ]
  },
  {
    id: '2',
    title: 'How to handle disagreements between officers?',
    content: 'Two of our officers have very different visions for the club direction and it\'s causing tension. Looking for advice on conflict resolution in leadership teams.',
    author: { name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', role: 'Advisor' },
    category: 'Leadership',
    createdAt: '2026-02-08T16:00:00',
    views: 156,
    likes: 24,
    isPinned: false,
    isLocked: false,
    tags: ['leadership', 'conflict', 'teamwork'],
    replies: [
      {
        id: '2a',
        content: 'Schedule a dedicated meeting to discuss the vision openly. Sometimes writing down everyone\'s ideas helps depersonalize the conflict.',
        author: { name: 'Dr. Patricia Williams', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80', role: 'Mentor' },
        createdAt: '2026-02-08T17:30:00',
        likes: 15,
        isAnswer: true
      }
    ]
  },
  {
    id: '3',
    title: 'Best fundraising ideas that actually work?',
    content: 'We need to raise $500 for our upcoming competition. What fundraisers have been most successful for your clubs? Looking for ideas beyond the usual bake sales.',
    author: { name: 'Alex Martinez', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', role: 'Treasurer' },
    category: 'Fundraising',
    club: 'Technology Student Association',
    createdAt: '2026-02-08T09:15:00',
    views: 312,
    likes: 31,
    isPinned: false,
    isLocked: false,
    tags: ['fundraising', 'money', 'competition'],
    replies: [
      {
        id: '3a',
        content: 'We did a car wash and made over $800 in one day! The key is picking a high-traffic location and promoting heavily.',
        author: { name: 'Chris Taylor', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80', role: 'President' },
        createdAt: '2026-02-08T10:00:00',
        likes: 9
      },
      {
        id: '3b',
        content: 'Spirit wear sales work great for us. We design custom club merchandise and sell it to members and their families.',
        author: { name: 'Maya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', role: 'Secretary' },
        createdAt: '2026-02-08T12:45:00',
        likes: 14,
        isAnswer: true
      }
    ]
  },
  {
    id: '4',
    title: 'Virtual club meetings - how do you keep them engaging?',
    content: 'We still have some hybrid members who attend virtually. What tools and techniques do you use to keep online participants engaged?',
    author: { name: 'Nina Okafor', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', role: 'Vice President' },
    category: 'Meetings',
    createdAt: '2026-02-07T14:30:00',
    views: 178,
    likes: 11,
    isPinned: false,
    isLocked: false,
    tags: ['virtual', 'meetings', 'hybrid', 'engagement'],
    replies: []
  },
  {
    id: '5',
    title: 'TSA Webmaster Competition - Theme Interpretation',
    content: 'How are other teams interpreting the "Community Resource Hub" theme? Looking to exchange ideas without giving away competitive secrets!',
    author: { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', role: 'Team Lead' },
    category: 'Competitions',
    club: 'Technology Student Association',
    createdAt: '2026-02-06T11:00:00',
    views: 445,
    likes: 52,
    isPinned: true,
    isLocked: false,
    tags: ['tsa', 'webmaster', 'competition', 'theme'],
    replies: [
      {
        id: '5a',
        content: 'We\'re focusing on making it actually useful for real students. The key is interactivity and user-created content.',
        author: { name: 'Sophie Zhang', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', role: 'Developer' },
        createdAt: '2026-02-06T13:15:00',
        likes: 21
      }
    ]
  }
];

const categories = ['All', 'Recruiting', 'Leadership', 'Fundraising', 'Meetings', 'Events', 'Competitions', 'General'];

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>(demoDiscussions);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: 'General', tags: '' });
  const [newReply, setNewReply] = useState('');

  const filteredDiscussions = discussions
    .filter(d => {
      if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return d.title.toLowerCase().includes(query) || 
               d.content.toLowerCase().includes(query) ||
               d.tags.some(t => t.toLowerCase().includes(query));
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'popular') return (b.likes + b.replies.length) - (a.likes + a.replies.length);
      if (sortBy === 'unanswered') return a.replies.length - b.replies.length;
      return 0;
    });

  const createDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;
    const discussion: Discussion = {
      id: Date.now().toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: { name: 'You', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Member' },
      category: newDiscussion.category,
      createdAt: new Date().toISOString(),
      replies: [],
      views: 0,
      likes: 0,
      isPinned: false,
      isLocked: false,
      tags: newDiscussion.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    setDiscussions([discussion, ...discussions]);
    setNewDiscussion({ title: '', content: '', category: 'General', tags: '' });
    setIsCreating(false);
    setSelectedDiscussion(discussion);
  };

  const addReply = () => {
    if (!newReply.trim() || !selectedDiscussion) return;
    const reply: Reply = {
      id: Date.now().toString(),
      content: newReply,
      author: { name: 'You', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', role: 'Member' },
      createdAt: new Date().toISOString(),
      likes: 0
    };
    const updated = discussions.map(d => 
      d.id === selectedDiscussion.id ? { ...d, replies: [...d.replies, reply] } : d
    );
    setDiscussions(updated);
    setSelectedDiscussion({ ...selectedDiscussion, replies: [...selectedDiscussion.replies, reply] });
    setNewReply('');
  };

  const likeDiscussion = (id: string) => {
    setDiscussions(discussions.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d));
    if (selectedDiscussion?.id === id) {
      setSelectedDiscussion({ ...selectedDiscussion, likes: selectedDiscussion.likes + 1 });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Discussions"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-violet-600/80"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">
                💬 Community Discussions
              </h1>
              <p className="text-white/80 mt-2">
                Ask questions, share experiences, and connect with other student leaders.
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-secondary"
            >
              + Start Discussion
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="card p-4 sticky top-4">
                <h3 className="font-bold text-neutral-700 mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => { setSelectedCategory(category); setSelectedDiscussion(null); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {category}
                      <span className="float-right text-neutral-400">
                        {category === 'All' 
                          ? discussions.length 
                          : discussions.filter(d => d.category === category).length}
                      </span>
                    </button>
                  ))}
                </div>

                <hr className="my-4" />

                <h3 className="font-bold text-neutral-700 mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {['leadership', 'recruiting', 'fundraising', 'tsa', 'competition'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
              {/* Create Discussion Form */}
              {isCreating && (
                <div className="card p-6 mb-6 border-2 border-primary-300">
                  <h3 className="text-lg font-bold text-primary-500 mb-4">Start a New Discussion</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                        placeholder="What's your question or topic?"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">Content *</label>
                      <textarea
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                        placeholder="Provide more details..."
                        className="input-field"
                        rows={4}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Category</label>
                        <select
                          value={newDiscussion.category}
                          onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                          className="select-field"
                        >
                          {categories.filter(c => c !== 'All').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Tags</label>
                        <input
                          type="text"
                          value={newDiscussion.tags}
                          onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: e.target.value })}
                          placeholder="comma, separated, tags"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={createDiscussion} className="btn-primary">Post Discussion</button>
                      <button onClick={() => setIsCreating(false)} className="btn-outline">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Discussion View */}
              {selectedDiscussion ? (
                <div>
                  <button
                    onClick={() => setSelectedDiscussion(null)}
                    className="text-primary-500 hover:text-primary-700 text-sm mb-4 flex items-center gap-1"
                  >
                    ← Back to discussions
                  </button>

                  <div className="card p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <Image
                        src={selectedDiscussion.author.avatar}
                        alt={selectedDiscussion.author.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover"
                      />
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold text-neutral-800 mb-2">{selectedDiscussion.title}</h2>
                        <p className="text-neutral-600 mb-4">{selectedDiscussion.content}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedDiscussion.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <span>{selectedDiscussion.author.name} • {selectedDiscussion.author.role}</span>
                          <span>{formatTime(selectedDiscussion.createdAt)}</span>
                          <span>👁 {selectedDiscussion.views}</span>
                          <button
                            onClick={() => likeDiscussion(selectedDiscussion.id)}
                            className="flex items-center gap-1 hover:text-red-500"
                          >
                            ❤️ {selectedDiscussion.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  <h3 className="font-bold text-neutral-700 mb-4">
                    {selectedDiscussion.replies.length} {selectedDiscussion.replies.length === 1 ? 'Reply' : 'Replies'}
                  </h3>
                  <div className="space-y-4 mb-6">
                    {selectedDiscussion.replies.map(reply => (
                      <div key={reply.id} className={`card p-4 ${reply.isAnswer ? 'border-l-4 border-l-green-500 bg-green-50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <Image
                            src={reply.author.avatar}
                            alt={reply.author.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover"
                          />
                          <div className="flex-grow">
                            {reply.isAnswer && (
                              <span className="text-green-600 text-xs font-semibold mb-1 block">✓ Best Answer</span>
                            )}
                            <p className="text-neutral-700">{reply.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                              <span>{reply.author.name} • {reply.author.role}</span>
                              <span>{formatTime(reply.createdAt)}</span>
                              <span>❤️ {reply.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  {!selectedDiscussion.isLocked && (
                    <div className="card p-4">
                      <h4 className="font-semibold text-neutral-700 mb-3">Add Your Reply</h4>
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Share your thoughts or advice..."
                        className="input-field mb-3"
                        rows={3}
                      />
                      <button onClick={addReply} className="btn-primary">
                        Post Reply
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Search and Sort */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field flex-grow"
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="select-field"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="unanswered">Unanswered</option>
                    </select>
                  </div>

                  {/* Discussions List */}
                  <div className="space-y-4">
                    {filteredDiscussions.map(discussion => (
                      <div
                        key={discussion.id}
                        className={`card p-5 cursor-pointer hover:shadow-md transition-shadow ${
                          discussion.isPinned ? 'border-l-4 border-l-secondary-500' : ''
                        }`}
                        onClick={() => setSelectedDiscussion(discussion)}
                      >
                        <div className="flex items-start gap-4">
                          <Image
                            src={discussion.author.avatar}
                            alt={discussion.author.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover"
                          />
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {discussion.isPinned && <span className="text-secondary-500 text-sm">📌</span>}
                              <h3 className="font-bold text-neutral-800 hover:text-primary-500 transition-colors">
                                {discussion.title}
                              </h3>
                            </div>
                            <p className="text-sm text-neutral-600 line-clamp-2 mb-2">{discussion.content}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                              <span>{discussion.author.name}</span>
                              <span className="bg-primary-100 text-primary-700 px-2 py-0.5">{discussion.category}</span>
                              <span>{formatTime(discussion.createdAt)}</span>
                              <span>💬 {discussion.replies.length}</span>
                              <span>👁 {discussion.views}</span>
                              <span>❤️ {discussion.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredDiscussions.length === 0 && (
                      <div className="text-center py-16 card">
                        <div className="text-5xl mb-4">💬</div>
                        <h3 className="text-xl font-bold text-neutral-700 mb-2">No discussions found</h3>
                        <p className="text-neutral-600 mb-4">Be the first to start a conversation!</p>
                        <button onClick={() => setIsCreating(true)} className="btn-primary">
                          Start Discussion
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
