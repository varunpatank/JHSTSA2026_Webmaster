import Link from 'next/link';
import dynamic from 'next/dynamic';

const ClubBuilder = dynamic(() => import('@/components/ClubBuilder'), { ssr: false });

export default function CommunityHubPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Community Resource Hub</h1>
          <p className="text-lg text-primary-100 mb-8">A central place for school clubs to share, discover, and access resources, guides, and support.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8">
        <section>
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Resource Library</h2>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Club Officer Handbook</h3>
              <p className="text-neutral-600 mb-2">Complete guide for leading your club effectively.</p>
              <Link href="/hub/guides/guide-2" className="text-primary-600 font-medium">View Guide</Link>
            </li>
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Event Planning Templates</h3>
              <p className="text-neutral-600 mb-2">Ready-to-use templates for organizing events.</p>
              <Link href="/hub/guides/guide-5" className="text-primary-600 font-medium">View Templates</Link>
            </li>
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Fundraising Ideas</h3>
              <p className="text-neutral-600 mb-2">Creative ways to raise money for your club.</p>
              <Link href="/funding" className="text-primary-600 font-medium">Explore Ideas</Link>
            </li>
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Collaboration Board</h3>
              <p className="text-neutral-600 mb-2">Find opportunities to work with other clubs.</p>
              <Link href="/hub/collaborate" className="text-primary-600 font-medium">View Board</Link>
            </li>
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Mentor Directory</h3>
              <p className="text-neutral-600 mb-2">Connect with experienced members and advisors.</p>
              <Link href="/hub/mentors" className="text-primary-600 font-medium">Find Mentors</Link>
            </li>
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Spotlight & Stories</h3>
              <p className="text-neutral-600 mb-2">Read inspiring stories from club leaders and members.</p>
              <Link href="/hub/stories" className="text-primary-600 font-medium">Read Stories</Link>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Support & Guidance</h2>
          <ul className="grid md:grid-cols-2 gap-6">
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Club Health Check</h3>
              <p className="text-neutral-600 mb-2">Diagnose issues and get recommendations to improve your club.</p>
              <Link href="/hub/health" className="text-primary-600 font-medium">Run Check</Link>
            </li>
            <li className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Officer Guides</h3>
              <p className="text-neutral-600 mb-2">Comprehensive guides for club officers.</p>
              <Link href="/hub/guides/guide-2" className="text-primary-600 font-medium">View Guides</Link>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Community Mission</h2>
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <p className="text-neutral-800 text-lg mb-2 font-semibold">Our Mission</p>
            <p className="text-neutral-600 mb-4">To empower every student club and chapter to thrive by providing access to resources, mentorship, and a collaborative community. We believe in the power of student leadership and teamwork to create lasting impact in our schools and beyond.</p>
            <p className="text-neutral-600">Together, we build a stronger, more connected school community.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Club Builder — design your club</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <p className="text-neutral-600 mb-4">Create a new club with guided suggestions: name ideas, logo, mission statement, and a ready-to-send proposal message to an advisor.</p>
              <p className="text-sm text-neutral-500 mb-6">Use this tool to quickly prepare everything you need to propose and launch your chapter.</p>
              <div className="space-y-4">
                {/* Left column: quick tips */}
                <div className="bg-white border border-neutral-200 rounded-xl p-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Quick tips</h4>
                  <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                    <li>Pick a clear focus and activities for your first semester.</li>
                    <li>Keep meetings consistent (weekly or bi-weekly).</li>
                    <li>Identify a faculty advisor and at least two officers.</li>
                    <li>Use the proposal message to contact an advisor directly.</li>
                  </ul>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Starter resources</h4>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link href="/hub" className="text-primary-600">Officer Guides & Templates</Link>
                    <Link href="/hub/request" className="text-primary-600">Request Resources</Link>
                    <Link href="/propose" className="text-primary-600">Propose a Chapter (prefilled)</Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* ClubBuilder client component */}
              <div id="club-builder-root">
                <ClubBuilder />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
