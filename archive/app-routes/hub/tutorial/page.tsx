'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  content: string[];
  tips: string[];
  image: string;
  action?: { label: string; href: string };
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to ClubConnect!',
    description: 'Your complete guide to getting started with the Community Resource Hub',
    content: [
      'ClubConnect is your all-in-one platform for finding, joining, and managing school clubs and organizations.',
      'Whether you\'re looking to join your first club or you\'re an experienced officer, we have tools to help you succeed.',
      'This interactive tutorial will walk you through all the key features.'
    ],
    tips: [
      'You can skip ahead to any section using the progress bar above',
      'All features are available immediately — no account required to explore',
      'Bookmark pages you want to revisit later'
    ],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'
  },
  {
    id: 2,
    title: 'Finding the Right Club',
    description: 'Discover clubs that match your interests and goals',
    content: [
      'Use the Chapter Directory to browse all available clubs at your school.',
      'Each club has a detailed profile with meeting times, requirements, and officer information.',
      'Not sure which club is right for you? Try our Club Finder Quiz to get personalized recommendations!'
    ],
    tips: [
      'Filter clubs by category (STEM, Arts, Service, etc.)',
      'Save clubs to your favorites for easy access',
      'Compare up to 4 clubs side-by-side using the Compare tool'
    ],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    action: { label: 'Take the Quiz', href: '/hub/quiz' }
  },
  {
    id: 3,
    title: 'Joining a Club',
    description: 'How to become a member and get involved',
    content: [
      'Found a club you like? Visit their profile page and look for the "Join" or "Express Interest" button.',
      'Some clubs have open membership, while others may have requirements like tryouts or applications.',
      'Once you join, you\'ll get access to member-only resources, event RSVPs, and announcements.'
    ],
    tips: [
      'Attend a meeting before officially joining to get a feel for the club',
      'Talk to current members about their experience',
      'Check the club\'s social media for recent activities'
    ],
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80',
    action: { label: 'Browse Directory', href: '/directory' }
  },
  {
    id: 4,
    title: 'Your Personal Dashboard',
    description: 'Track your clubs, events, and achievements',
    content: [
      'Your Dashboard is your personal command center for all things ClubConnect.',
      'See your joined clubs, upcoming events, saved resources, and earned achievements at a glance.',
      'Customize your profile, set notification preferences, and track your involvement over time.'
    ],
    tips: [
      'Check your dashboard weekly to stay updated',
      'Use the saved items feature to build your resource library',
      'Update your interests to get better recommendations'
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    action: { label: 'View Dashboard', href: '/dashboard' }
  },
  {
    id: 5,
    title: 'Using the Resource Hub',
    description: 'Access guides, tools, and external resources',
    content: [
      'The Resource Hub contains everything you need to run a successful club.',
      'Browse starter guides for topics like recruiting, fundraising, and event planning.',
      'Access our curated External Resources library with 100+ links to useful tools and websites.'
    ],
    tips: [
      'Use the search feature to find specific topics',
      'Create Collections to organize resources by project or goal',
      'Request new resources if you can\'t find what you need'
    ],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    action: { label: 'Explore Resources', href: '/hub/external' }
  },
  {
    id: 6,
    title: 'Setting and Tracking Goals',
    description: 'Plan your leadership journey with goal tracking',
    content: [
      'Use the Goal Tracker to set meaningful objectives for your club involvement.',
      'Break down big goals into milestones and track your progress over time.',
      'Keep a journal to reflect on your experiences and growth.'
    ],
    tips: [
      'Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound',
      'Celebrate completing milestones — every step counts!',
      'Review and update your goals monthly'
    ],
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    action: { label: 'Start Goal Tracking', href: '/hub/goals' }
  },
  {
    id: 7,
    title: 'For Club Officers',
    description: 'Managing your club with powerful tools',
    content: [
      'As an officer, you have access to the Club Manager dashboard.',
      'Create and customize your club\'s profile page with branding, descriptions, and social links.',
      'Manage officers, schedule events, and post announcements to keep members informed.'
    ],
    tips: [
      'Keep your club profile updated regularly',
      'Use announcements for important updates',
      'Preview your public page before publishing changes'
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    action: { label: 'Open Club Manager', href: '/hub/manage-club' }
  },
  {
    id: 8,
    title: 'Starting a New Club',
    description: 'Turn your idea into reality',
    content: [
      'Have an idea for a new club? Use the Propose a Chapter feature to submit your proposal.',
      'Browse the Club Ideas page for inspiration and see what other students have suggested.',
      'Connect with mentors who can guide you through the process.'
    ],
    tips: [
      'Research if a similar club already exists',
      'Find a faculty advisor before submitting',
      'Recruit founding members to show interest'
    ],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    action: { label: 'Propose a Club', href: '/propose' }
  },
  {
    id: 9,
    title: 'You\'re All Set!',
    description: 'Start exploring and get involved',
    content: [
      'Congratulations! You now know how to use all the major features of ClubConnect.',
      'Remember, the best way to learn is by doing — so start exploring!',
      'If you have questions, check our FAQ or reach out through the Contact page.'
    ],
    tips: [
      'Start with one or two clubs that really interest you',
      'Attend events to meet other students',
      'Consider running for a leadership position'
    ],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80'
  }
];

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Header */}
      <section className="bg-primary-500 text-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/hub" className="text-white/80 hover:text-white text-sm flex items-center gap-2">
              ← Back to Hub
            </Link>
            <span className="text-sm">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white border-b border-neutral-200 py-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {tutorialSteps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goToStep(index)}
                className={`flex-1 h-2 transition-all ${
                  index === currentStep
                    ? 'bg-primary-500'
                    : completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
                title={s.title}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-500">
            <span>Start</span>
            <span>{Math.round(progress)}% Complete</span>
            <span>Finish</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card overflow-hidden">
            {/* Step Image */}
            <div className="relative h-64">
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-primary-500 text-white px-3 py-1 text-sm font-semibold">
                  Step {step.id}
                </span>
                <h1 className="text-3xl font-bold text-white font-heading mt-2">{step.title}</h1>
                <p className="text-white/80">{step.description}</p>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {step.content.map((paragraph, index) => (
                  <p key={index} className="text-neutral-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tips */}
              <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 mb-8">
                <h3 className="font-bold text-secondary-700 mb-2">💡 Pro Tips</h3>
                <ul className="space-y-1">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-neutral-700 flex items-start gap-2">
                      <span className="text-secondary-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {step.action && (
                <div className="bg-primary-50 p-4 mb-8 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-primary-700">Try it now!</h4>
                    <p className="text-sm text-primary-600">Put what you learned into practice</p>
                  </div>
                  <Link href={step.action.href} className="btn-primary">
                    {step.action.label} →
                  </Link>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-2 font-semibold border-2 transition-colors ${
                    currentStep === 0
                      ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                  }`}
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {tutorialSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`w-3 h-3 transition-all ${
                        index === currentStep
                          ? 'bg-primary-500 scale-125'
                          : completedSteps.includes(index)
                          ? 'bg-green-500'
                          : 'bg-neutral-300'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < tutorialSteps.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next →
                  </button>
                ) : (
                  <Link href="/hub" className="btn-secondary">
                    Get Started! 🚀
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mt-8 card p-6">
            <h3 className="font-bold text-neutral-700 mb-4">Jump to Section</h3>
            <div className="grid grid-cols-3 gap-2">
              {tutorialSteps.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => goToStep(index)}
                  className={`p-3 text-left text-sm border transition-all ${
                    index === currentStep
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : completedSteps.includes(index)
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {completedSteps.includes(index) && index !== currentStep && (
                      <span className="text-green-500">✓</span>
                    )}
                    <span className="font-semibold">Step {s.id}</span>
                  </div>
                  <div className="text-xs truncate mt-1">{s.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
