'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText, Heart, ImageIcon, MessageCircle, Paperclip, Send,
  Upload, X, Bookmark, Share2, TrendingUp, Users,
  Calendar, Phone, MoreHorizontal, ThumbsUp,
} from 'lucide-react';

const EmbeddedCall = dynamic(() => import('@/components/EmbeddedCall'), { ssr: false });

interface FeedReply {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

interface FeedPost {
  id: number;
  author: string;
  avatar: string;
  club: string;
  time: string;
  text: string;
  type: 'text' | 'resource' | 'image' | 'achievement' | 'discussion';
  fileName?: string;
  fileSize?: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  replies: FeedReply[];
}

const INITIAL_FEED: FeedPost[] = [
  {
    id: 1,
    author: 'Maria G.',
    avatar: 'MG',
    club: 'TSA',
    time: '2 hours ago',
    text: 'Just uploaded the full TSA presentation template pack our chapter used at States. Feel free to download and customize!',
    type: 'resource',
    fileName: 'TSA_Presentation_Templates.zip',
    fileSize: '4.2 MB',
    likes: 24,
    liked: false,
    saved: false,
    replies: [
      { id: 1, author: 'James L.', avatar: 'JL', text: 'This is incredible, thanks Maria! Using this for regionals.', time: '1h ago' },
      { id: 2, author: 'Sophie K.', avatar: 'SK', text: 'The slide layouts are clean. Great work!', time: '45m ago' },
    ],
  },
  {
    id: 2,
    author: 'Alex J.',
    avatar: 'AJ',
    club: 'Robotics',
    time: '5 hours ago',
    text: 'Does anyone have experience with PID tuning for FTC robots? We keep overshooting our target position.',
    type: 'discussion',
    likes: 8,
    liked: false,
    saved: false,
    replies: [
      { id: 1, author: 'Taylor M.', avatar: 'TM', text: 'Try reducing your P gain and adding a small D term. We had the same issue last season.', time: '4h ago' },
    ],
  },
  {
    id: 3,
    author: 'Sophie K.',
    avatar: 'SK',
    club: 'NHS',
    time: '1 day ago',
    text: 'Our chapter just hit 500 community service hours this semester! So proud of everyone who contributed.',
    type: 'achievement',
    likes: 42,
    liked: false,
    saved: false,
    replies: [],
  },
  {
    id: 4,
    author: 'James L.',
    avatar: 'JL',
    club: 'FBLA',
    time: '1 day ago',
    text: 'Here is the fundraiser tracking spreadsheet I made. It auto-calculates profit margins and has a dashboard.',
    type: 'resource',
    fileName: 'FBLA_Fundraiser_Tracker.xlsx',
    fileSize: '1.8 MB',
    likes: 31,
    liked: false,
    saved: false,
    replies: [
      { id: 1, author: 'Maria G.', avatar: 'MG', text: 'The formulas in this are next level. Sharing with our treasurer!', time: '22h ago' },
    ],
  },
  {
    id: 5,
    author: 'Taylor M.',
    avatar: 'TM',
    club: 'Drama',
    time: '2 days ago',
    text: 'Spring musical auditions are next week! Drop your monologue tips below.',
    type: 'text',
    likes: 15,
    liked: false,
    saved: false,
    replies: [],
  },
  {
    id: 6,
    author: 'Priya K.',
    avatar: 'PK',
    club: 'Debate',
    time: '3 days ago',
    text: 'Uploading my evidence files and case briefs from last tournament. Hope these help someone prepping for districts!',
    type: 'resource',
    fileName: 'Debate_Evidence_Briefs.pdf',
    fileSize: '2.5 MB',
    likes: 19,
    liked: false,
    saved: false,
    replies: [
      { id: 1, author: 'Alex J.', avatar: 'AJ', text: 'These sources are gold. Thank you!', time: '2d ago' },
    ],
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feed state
  const [feed, setFeed] = useState<FeedPost[]>(INITIAL_FEED);
  const [postText, setPostText] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'discussions' | 'resources' | 'achievements'>('all');

  // Replies
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { user: 'Sophie K.', text: 'TSA rubric breakdown is so helpful!', time: '1h' },
    { user: 'Taylor M.', text: 'Anyone have the meeting agenda template?', time: '3h' },
    { user: 'Maria G.', text: 'Check the fundraising playbook I posted!', time: '6h' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Call
  const [embeddedRoom, setEmbeddedRoom] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  }

  function submitPost() {
    if (!postText.trim() && !attachedFile) return;
    const newPost: FeedPost = {
      id: Date.now(),
      author: 'You',
      avatar: 'YO',
      club: 'General',
      time: 'Just now',
      text: postText.trim(),
      type: attachedFile ? 'resource' : 'text',
      fileName: attachedFile?.name,
      fileSize: attachedFile ? `${(attachedFile.size / 1024 / 1024).toFixed(1)} MB` : undefined,
      likes: 0,
      liked: false,
      saved: false,
      replies: [],
    };
    setFeed(prev => [newPost, ...prev]);
    setPostText('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function toggleLike(id: number) {
    setFeed(prev =>
      prev.map(p =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  }

  function toggleSave(id: number) {
    setFeed(prev => prev.map(p => (p.id === id ? { ...p, saved: !p.saved } : p)));
  }

  function toggleReplies(id: number) {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function submitReply(postId: number) {
    const text = replyInputs[postId]?.trim();
    if (!text) return;
    const reply: FeedReply = { id: Date.now(), author: 'You', avatar: 'YO', text, time: 'Just now' };
    setFeed(prev =>
      prev.map(p => (p.id === postId ? { ...p, replies: [reply, ...p.replies] } : p))
    );
    setReplyInputs(prev => ({ ...prev, [postId]: '' }));
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [{ user: 'You', text: chatInput.trim(), time: 'now' }, ...prev]);
    setChatInput('');
  }

  const filtered = feed.filter(p => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'discussions') return p.type === 'discussion' || p.type === 'text';
    if (activeFilter === 'resources') return p.type === 'resource' || p.type === 'image';
    if (activeFilter === 'achievements') return p.type === 'achievement';
    return true;
  });

  const typeColors: Record<string, string> = {
    resource: 'bg-primary-100 text-primary-700',
    discussion: 'bg-secondary-100 text-secondary-700',
    achievement: 'bg-accent-100 text-accent-700',
    image: 'bg-primary-50 text-primary-600',
    text: 'bg-neutral-100 text-neutral-600',
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.gif,.svg,.txt,.md,.csv"
        onChange={handleFileSelect}
      />

      {/* Slim Hero */}
      <div className="bg-primary-700 text-white py-5">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-heading">Community Feed</h1>
            <p className="text-xs text-neutral-300 mt-0.5">Share resources, start discussions, connect with clubs</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-300">
            <span className="bg-white/10 px-2 py-0.5 flex items-center gap-1"><TrendingUp size={12} /> {feed.length} Posts</span>
            <span className="bg-white/10 px-2 py-0.5 flex items-center gap-1"><Users size={12} /> 47 Online</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-4">

          {/*  Main Feed Column  */}
          <div className="flex-1 min-w-0 space-y-3">

            {/*  Post Composer  */}
            <div className="bg-white border border-neutral-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">YO</div>
                <div className="flex-1 min-w-0">
                  <textarea
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    placeholder="Share a resource, start a discussion, or post an update..."
                    rows={2}
                    className="w-full border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary-400 placeholder:text-neutral-400"
                  />
                  {/* Attached file preview */}
                  {attachedFile && (
                    <div className="mt-2 flex items-center gap-2 bg-primary-50 border border-primary-200 px-3 py-2">
                      <FileText size={16} className="text-primary-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary-700 truncate">{attachedFile.name}</p>
                        <p className="text-[10px] text-primary-500">{(attachedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => { setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-neutral-400 hover:text-neutral-600">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 transition-colors">
                        <Upload size={14} /> Upload File
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors">
                        <ImageIcon size={14} /> Image
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors">
                        <Paperclip size={14} /> Attach
                      </button>
                    </div>
                    <button
                      onClick={submitPost}
                      disabled={!postText.trim() && !attachedFile}
                      className="flex items-center gap-1 px-4 py-1.5 bg-secondary-500 text-white text-xs font-bold hover:bg-secondary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={14} /> Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/*  Feed Filters  */}
            <div className="flex gap-1 bg-white border border-neutral-200 p-1">
              {(['all', 'discussions', 'resources', 'achievements'] as const).map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    activeFilter === f ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:bg-neutral-50'
                  }`}>
                  {f === 'all' ? 'All Posts' : f}
                </button>
              ))}
            </div>

            {/*  Feed Posts  */}
            {filtered.map(post => (
              <div key={post.id} className="bg-white border border-neutral-200">
                {/* Post header */}
                <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                  <div className="w-9 h-9 bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">{post.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-700">{post.author}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 font-semibold ${typeColors[post.type]}`}>{post.club}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">{post.time}</p>
                  </div>
                  <button className="text-neutral-300 hover:text-neutral-500">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Post body */}
                <div className="px-4 pb-2">
                  <p className="text-sm text-neutral-700 leading-relaxed">{post.text}</p>
                  {post.type === 'achievement' && (
                    <div className="mt-2 bg-accent-50 border border-accent-200 px-3 py-2 flex items-center gap-2">
                      <TrendingUp size={16} className="text-accent-600" />
                      <span className="text-xs font-semibold text-accent-700">Achievement Unlocked</span>
                    </div>
                  )}
                  {post.fileName && (
                    <div className="mt-2 bg-primary-50 border border-primary-200 px-3 py-2 flex items-center gap-2">
                      <FileText size={18} className="text-primary-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary-700 truncate">{post.fileName}</p>
                        <p className="text-[10px] text-primary-500">{post.fileSize}</p>
                      </div>
                      <button className="px-2.5 py-1 bg-primary-600 text-white text-[10px] font-bold hover:bg-primary-700 transition-colors">
                        Download
                      </button>
                    </div>
                  )}
                </div>

                {/* Post actions */}
                <div className="flex items-center border-t border-neutral-100 px-4 py-1.5">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold transition-colors ${post.liked ? 'text-accent-600' : 'text-neutral-400 hover:text-accent-500'}`}>
                    {post.liked ? <Heart size={15} fill="currentColor" /> : <Heart size={15} />}
                    <span>{post.likes}</span>
                  </button>
                  <button onClick={() => toggleReplies(post.id)} className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-neutral-400 hover:text-primary-600 transition-colors">
                    <MessageCircle size={15} /> {post.replies.length}
                  </button>
                  <button onClick={() => toggleSave(post.id)} className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold transition-colors ${post.saved ? 'text-secondary-600' : 'text-neutral-400 hover:text-secondary-500'}`}>
                    {post.saved ? <Bookmark size={15} fill="currentColor" /> : <Bookmark size={15} />}
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-neutral-400 hover:text-primary-600 transition-colors ml-auto">
                    <Share2 size={15} />
                  </button>
                </div>

                {/* Replies thread */}
                {expandedReplies.has(post.id) && (
                  <div className="border-t border-neutral-100 bg-neutral-50">
                    {/* Reply input */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-100">
                      <div className="w-6 h-6 bg-primary-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">YO</div>
                      <input
                        value={replyInputs[post.id] || ''}
                        onChange={e => setReplyInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && submitReply(post.id)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-white border border-neutral-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary-400"
                      />
                      <button onClick={() => submitReply(post.id)} className="text-primary-600 hover:text-primary-700">
                        <Send size={14} />
                      </button>
                    </div>
                    {/* Existing replies */}
                    <div className="divide-y divide-neutral-100 max-h-[250px] overflow-y-auto">
                      {post.replies.map(r => (
                        <div key={r.id} className="flex items-start gap-2 px-4 py-2">
                          <div className="w-6 h-6 bg-primary-100 text-primary-700 flex items-center justify-center text-[9px] font-bold shrink-0">{r.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-primary-700">{r.author}</span>
                              <span className="text-[10px] text-neutral-400">{r.time}</span>
                            </div>
                            <p className="text-xs text-neutral-600 mt-0.5">{r.text}</p>
                          </div>
                        </div>
                      ))}
                      {post.replies.length === 0 && (
                        <p className="text-xs text-neutral-400 px-4 py-3 text-center">No replies yet. Be the first!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white border border-neutral-200 p-8 text-center">
                <p className="text-sm text-neutral-400">No posts match this filter.</p>
              </div>
            )}
          </div>

          {/*  Right Sidebar  */}
          <div className="hidden lg:block w-72 shrink-0 space-y-3">

            {/* Live Chat */}
            <div className="bg-white border border-neutral-200">
              <div className="px-3 py-2 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-xs font-bold text-primary-700 flex items-center gap-1.5"><MessageCircle size={13} /> Live Chat</h3>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="h-48 overflow-y-auto flex flex-col-reverse p-2 space-y-reverse space-y-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`text-[11px] px-2 py-1.5 ${msg.user === 'You' ? 'bg-primary-50 border-l-2 border-primary-400' : 'bg-neutral-50'}`}>
                    <span className="font-bold text-primary-700">{msg.user}</span>
                    <span className="text-neutral-300 mx-1"></span>
                    <span className="text-neutral-400 text-[9px]">{msg.time}</span>
                    <p className="text-neutral-600 mt-0.5">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex border-t border-neutral-200">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Message..."
                  className="flex-1 px-2.5 py-2 text-xs focus:outline-none"
                />
                <button onClick={sendChat} className="px-2.5 text-primary-600 hover:text-primary-700">
                  <Send size={13} />
                </button>
              </div>
            </div>

            {/* Online Members */}
            <div className="bg-white border border-neutral-200">
              <div className="px-3 py-2 border-b border-neutral-200">
                <h3 className="text-xs font-bold text-primary-700 flex items-center gap-1.5"><Users size={13} /> Online Now</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {[
                  { name: 'Maria G.', avatar: 'MG', role: 'TSA President' },
                  { name: 'Alex J.', avatar: 'AJ', role: 'Robotics Captain' },
                  { name: 'Sophie K.', avatar: 'SK', role: 'NHS Secretary' },
                  { name: 'James L.', avatar: 'JL', role: 'FBLA Treasurer' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2">
                    <div className="relative">
                      <div className="w-7 h-7 bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">{m.avatar}</div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-primary-700">{m.name}</p>
                      <p className="text-[9px] text-neutral-400">{m.role}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/call/${encodeURIComponent(`Community-${m.avatar}-${Date.now()}`)}`)}
                      className="p-1 text-neutral-300 hover:text-primary-600 transition-colors"
                    >
                      <Phone size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-neutral-200">
              <div className="px-3 py-2 border-b border-neutral-200">
                <h3 className="text-xs font-bold text-primary-700">Quick Links</h3>
              </div>
              <div className="p-2 space-y-0.5">
                {[
                  { label: 'Resource Library', href: '/resources', icon: <FileText size={13} /> },
                  { label: 'Discussion Forum', href: '/hub/discussions', icon: <MessageCircle size={13} /> },
                  { label: 'Club Guides', href: '/guides', icon: <Paperclip size={13} /> },
                  { label: 'Events Calendar', href: '/events', icon: <Calendar size={13} /> },
                  { label: 'Success Stories', href: '/hub/stories', icon: <TrendingUp size={13} /> },
                  { label: 'Alumni Network', href: '/alumni', icon: <Users size={13} /> },
                  { label: 'External Resources', href: '/hub/external', icon: <Share2 size={13} /> },
                  { label: 'Submit Content', href: '/hub/request', icon: <Upload size={13} /> },
                ].map((link, i) => (
                  <Link key={i} href={link.href} className="flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                    <span className="text-neutral-400">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Start a Call */}
            <button
              onClick={() => setEmbeddedRoom(`Community-Lobby-${Date.now()}`)}
              className="w-full bg-primary-600 text-white px-3 py-2.5 text-xs font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={14} /> Start a Community Call
            </button>

            {/* CTA */}
            <div className="bg-secondary-500 text-white p-3">
              <p className="text-xs font-bold">Share Your Story</p>
              <p className="text-[10px] text-white/70 mt-0.5">Spotlight, success story, or resource</p>
              <Link href="/hub/request" className="mt-2 block text-center px-3 py-1.5 bg-white/20 text-white text-[10px] font-bold hover:bg-white/30 transition-colors">
                Submit &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded call modal */}
      {embeddedRoom && (
        <EmbeddedCall
          room={embeddedRoom}
          displayName={typeof window !== 'undefined' ? (localStorage.getItem('cc_displayName') || 'Guest') : 'Guest'}
          onClose={() => setEmbeddedRoom(null)}
        />
      )}
    </div>
  );
}