'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { successStories } from '@/lib/hubData';

const categories = ['All', 'Growth', 'Competition', 'Community Impact', 'Innovation', 'Fundraising'];

export default function SuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [likedStories, setLikedStories] = useState<string[]>([]);

  const filteredStories = useMemo(() => {
    return successStories.filter((story) => {
      if (selectedCategory !== 'All' && story.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedCategory]);

  const featuredStory = successStories.find(s => s.featured);

  const handleLike = (id: string) => {
    if (likedStories.includes(id)) {
      setLikedStories(likedStories.filter(s => s !== id));
    } else {
      setLikedStories([...likedStories, id]);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1920&q=80"
            alt="Success"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/95 to-orange-500/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            🌟 Success Stories
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Real stories from real clubs. Get inspired by how student organizations overcame 
            challenges, achieved their goals, and made a lasting impact.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#stories" className="btn-secondary">
              Read Stories
            </a>
            <button 
              onClick={() => setShowSubmitModal(true)}
              className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-amber-600 transition-all rounded-lg"
            >
              Share Your Story
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">{successStories.length}</div>
              <div className="text-sm text-neutral-600">Success Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">
                {successStories.reduce((sum, s) => sum + s.likes, 0).toLocaleString()}
              </div>
              <div className="text-sm text-neutral-600">Total Likes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">45+</div>
              <div className="text-sm text-neutral-600">Clubs Featured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">
                {new Set(successStories.map(s => s.category)).size}
              </div>
              <div className="text-sm text-neutral-600">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredStory && (
        <section className="py-12 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white font-heading mb-8">⭐ Featured Story</h2>
            <div className="bg-white p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={featuredStory.images?.[0] || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80'}
                      alt={featuredStory.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 text-sm font-semibold">
                      {featuredStory.category}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500 mb-2">{featuredStory.chapterName || 'Student Organization'}</div>
                  <h3 className="text-2xl font-bold text-primary-500 font-heading mb-4">{featuredStory.title}</h3>
                  <p className="text-neutral-600 mb-6 leading-relaxed">{featuredStory.summary}</p>
                  
                  {featuredStory.impactMetrics && featuredStory.impactMetrics.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-neutral-700 mb-2">Key Impact</h4>
                      <ul className="space-y-1">
                        {featuredStory.impactMetrics.map((metric, idx) => (
                          <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                            <span className="text-green-500">✓</span> {metric.label}: {metric.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <blockquote className="border-l-4 border-secondary-500 pl-4 italic text-neutral-600 mb-6">
                    &ldquo;{featuredStory.fullStory.substring(0, 200)}...&rdquo;
                    <footer className="text-sm text-neutral-500 mt-2 not-italic">
                      — {featuredStory.authorName}, {featuredStory.authorRole}
                    </footer>
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(featuredStory.id)}
                      className={`flex items-center gap-2 px-4 py-2 border-2 transition-all
                        ${likedStories.includes(featuredStory.id) 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'border-neutral-200 text-neutral-600 hover:border-red-200'}`}
                    >
                      {likedStories.includes(featuredStory.id) ? '❤️' : '🤍'} 
                      {featuredStory.likes + (likedStories.includes(featuredStory.id) ? 1 : 0)}
                    </button>
                    <span className="text-sm text-neutral-500">{featuredStory.shares} shares</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section id="stories" className="py-8 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-semibold transition-all
                  ${selectedCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-neutral-600 mb-6">{filteredStories.length} stories found</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className="card overflow-hidden group">
                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={story.images?.[0] || '/placeholder-story.jpg'}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-0.5 text-xs font-semibold text-primary-600">
                    {story.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-xs text-neutral-500 mb-1">{story.chapterName || 'Student Organization'} • {new Date(story.datePublished).getFullYear()}</div>
                  <h3 className="font-bold text-lg text-primary-500 font-heading mb-2 group-hover:text-secondary-500 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-neutral-600 line-clamp-3 mb-4">{story.summary}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {story.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Expand/Collapse */}
                  <button
                    onClick={() => setExpandedId(expandedId === story.id ? null : story.id)}
                    className="text-primary-500 text-sm font-semibold hover:underline"
                  >
                    {expandedId === story.id ? 'Show Less ▲' : 'Read More ▼'}
                  </button>

                  {expandedId === story.id && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
                      <div>
                        <h4 className="font-semibold text-neutral-700 text-sm mb-2">Full Story</h4>
                        <p className="text-sm text-neutral-600">{story.fullStory}</p>
                      </div>

                      {story.impactMetrics && story.impactMetrics.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-neutral-700 text-sm mb-2">Impact Metrics</h4>
                          <ul className="space-y-1">
                            {story.impactMetrics.map((metric, idx) => (
                              <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                                <span className="text-green-500">✓</span> {metric.label}: {metric.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <blockquote className="border-l-4 border-secondary-500 pl-4 italic text-neutral-600 text-sm">
                        &ldquo;{story.fullStory.substring(0, 150)}...&rdquo;
                        <footer className="text-xs text-neutral-500 mt-1 not-italic">
                          — {story.authorName}, {story.authorRole}
                        </footer>
                      </blockquote>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                    <button 
                      onClick={() => handleLike(story.id)}
                      className={`flex items-center gap-1 text-sm transition-colors
                        ${likedStories.includes(story.id) ? 'text-red-500' : 'text-neutral-500 hover:text-red-500'}`}
                    >
                      {likedStories.includes(story.id) ? '❤️' : '🤍'} 
                      {story.likes + (likedStories.includes(story.id) ? 1 : 0)}
                    </button>
                    <span className="text-xs text-neutral-400">{story.shares} shares</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No stories found in this category.</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-primary-500 hover:underline mt-2"
              >
                View all stories
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Your Story Could Be Next</h2>
          <p className="text-lg text-white/90 mb-8">
            Has your club achieved something amazing? Overcome a major challenge? 
            Share your story to inspire others and get recognized!
          </p>
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="btn-secondary"
          >
            Submit Your Story
          </button>
        </div>
      </section>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-500 font-heading">Share Your Success Story</h2>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Your Name *</label>
                  <input type="text" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Your Role *</label>
                  <input type="text" className="input-field" placeholder="e.g., Club President" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Club Name *</label>
                  <input type="text" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Year *</label>
                  <select className="select-field" required>
                    <option value="">Select year...</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Story Title *</label>
                <input type="text" className="input-field" placeholder="Give your story a compelling title" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
                <select className="select-field" required>
                  <option value="">Select category...</option>
                  {categories.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Summary *</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="Brief summary of your story (2-3 sentences)"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">The Challenge *</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="What challenge did your club face?"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">The Solution *</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="How did your club overcome the challenge?"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Key Outcomes *</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="List 3-5 key outcomes or achievements (one per line)"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Lessons Learned</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  placeholder="What advice would you give to other clubs? (one per line)"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Quote/Testimonial *</label>
                <textarea 
                  className="input-field min-h-[60px]" 
                  placeholder="A memorable quote about your experience"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Tags (comma-separated)</label>
                <input type="text" className="input-field" placeholder="e.g., leadership, teamwork, innovation" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Photo/Image URL</label>
                <input type="url" className="input-field" placeholder="https://..." />
                <p className="text-xs text-neutral-500 mt-1">Link to an image representing your story</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Your Email *</label>
                <input type="email" className="input-field" required />
                <p className="text-xs text-neutral-500 mt-1">We&apos;ll contact you for approval before publishing</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit Story
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowSubmitModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
