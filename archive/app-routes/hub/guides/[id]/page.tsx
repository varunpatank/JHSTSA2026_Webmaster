'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { starterGuides } from '@/lib/hubData';
import { useState } from 'react';

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-700 border-green-300',
  'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Advanced': 'bg-red-100 text-red-700 border-red-300'
};

export default function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const guide = starterGuides.find((g) => g.id === id);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showHelpful, setShowHelpful] = useState(false);

  if (!guide) {
    return (
      <div className="bg-neutral-100 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-primary-500 mb-4">Guide Not Found</h1>
          <p className="text-neutral-600 mb-6">The guide you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/hub" className="btn-primary">Back to Hub</Link>
        </div>
      </div>
    );
  }

  const relatedGuides = starterGuides.filter(g => guide.relatedGuides.includes(g.id));
  const progress = (completedSteps.length / guide.steps.length) * 100;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&q=80"
            alt="Learning resources"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/80"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge bg-white/20 text-white">{guide.category}</span>
            <span className={`px-3 py-1 text-sm font-semibold border ${difficultyColors[guide.difficulty]}`}>
              {guide.difficulty}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">{guide.title}</h1>
          <p className="text-lg text-white/90 mb-6">{guide.description}</p>
          <div className="flex flex-wrap gap-6 text-white/80 text-sm">
            <span>⏱️ {guide.estimatedTime}</span>
            <span>📖 {guide.steps.length} steps</span>
            <span>👁️ {guide.views.toLocaleString()} views</span>
            <span>👍 {guide.helpful} found this helpful</span>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white border-b border-neutral-200 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Your Progress</span>
            <span className="text-sm font-bold text-primary-500">{completedSteps.length} / {guide.steps.length} steps</span>
          </div>
          <div className="w-full bg-neutral-200 h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-secondary-500 to-secondary-400 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="lg:col-span-2 space-y-6">
            {guide.steps.map((step) => (
              <div 
                key={step.stepNumber}
                className={`card p-6 transition-all ${completedSteps.includes(step.stepNumber) ? 'bg-green-50 border-green-300' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-bold transition-all
                      ${completedSteps.includes(step.stepNumber) 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary-100 text-primary-500 hover:bg-primary-200'
                      }`}
                  >
                    {completedSteps.includes(step.stepNumber) ? '✓' : step.stepNumber}
                  </button>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-primary-500 mb-3 font-heading">{step.title}</h3>
                    <p className="text-neutral-700 leading-relaxed mb-4">{step.content}</p>
                    
                    {step.tips && step.tips.length > 0 && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <h4 className="font-semibold text-blue-700 mb-2">💡 Tips</h4>
                        <ul className="space-y-1">
                          {step.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                              <span className="text-blue-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.warnings && step.warnings.length > 0 && (
                      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                        <h4 className="font-semibold text-amber-700 mb-2">⚠️ Warning</h4>
                        <ul className="space-y-1">
                          {step.warnings.map((warning, idx) => (
                            <li key={idx} className="text-sm text-amber-800">{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.resources && step.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {step.resources.map((resource, idx) => (
                          <Link
                            key={idx}
                            href={resource.url}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm transition-colors"
                          >
                            📄 {resource.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Completion Message */}
            {completedSteps.length === guide.steps.length && (
              <div className="card p-8 bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold font-heading mb-2">Congratulations!</h3>
                <p className="text-white/90 mb-4">You&apos;ve completed this guide. You&apos;re ready to take action!</p>
                <Link href="/hub" className="inline-block bg-white text-green-600 px-6 py-2 font-semibold hover:bg-green-50 transition-colors">
                  Explore More Guides
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="card p-6">
              <h3 className="font-bold text-primary-500 mb-4 font-heading">Actions</h3>
              <div className="space-y-3">
                {guide.downloadUrl && (
                  <a href={guide.downloadUrl} className="block w-full btn-primary text-center">
                    📥 Download Template
                  </a>
                )}
                {guide.videoUrl && (
                  <a href={guide.videoUrl} target="_blank" rel="noopener noreferrer" className="block w-full btn-outline text-center">
                    🎬 Watch Video
                  </a>
                )}
                <button className="block w-full btn-outline text-center">
                  🔗 Share Guide
                </button>
              </div>
            </div>

            {/* Helpful */}
            <div className="card p-6">
              <h3 className="font-bold text-primary-500 mb-4 font-heading">Was this helpful?</h3>
              {!showHelpful ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowHelpful(true)}
                    className="flex-1 py-2 border-2 border-green-500 text-green-600 hover:bg-green-50 transition-colors font-semibold"
                  >
                    👍 Yes
                  </button>
                  <button 
                    onClick={() => setShowHelpful(true)}
                    className="flex-1 py-2 border-2 border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition-colors font-semibold"
                  >
                    👎 No
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 text-green-700 p-4 text-center">
                  <p className="font-semibold">Thanks for your feedback!</p>
                </div>
              )}
            </div>

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-primary-500 mb-4 font-heading">Related Guides</h3>
                <div className="space-y-3">
                  {relatedGuides.map((related) => (
                    <Link
                      key={related.id}
                      href={`/hub/guides/${related.id}`}
                      className="block p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <p className="font-semibold text-sm text-primary-500">{related.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">{related.difficulty} • {related.estimatedTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Need Help */}
            <div className="card p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
              <h3 className="font-bold text-secondary-700 mb-3 font-heading">Need More Help?</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Connect with a mentor who can guide you through this process.
              </p>
              <Link href="/hub/mentors" className="block w-full btn-secondary text-center text-sm">
                Find a Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
