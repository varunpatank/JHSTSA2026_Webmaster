'use server';

import Link from 'next/link';

const stages = [
  {
    id: 'ideation',
    title: 'Ideation & Planning',
    description: 'Brainstorm club ideas and validate student interest.',
    tools: [
      { name: 'Club Ideas Board', href: '/hub/ideas' },
      { name: 'Club Finder Quiz', href: '/hub/quiz' },
      { name: 'External Resources Library', href: '/hub/external' },
    ],
  },
      {
        id: 'proposal',
        title: 'Proposal & Approval',
        description: 'Prepare and submit the official proposal to start a club.',
        tools: [
          { name: 'Propose New Club', href: '/propose' },
          { name: 'Officer Guides', href: '/hub/guides/guide-2' },
          { name: 'Request Resources', href: '/hub/request' },
        ],
      },
      {
        id: 'setup',
        title: 'Setup & Structure',
        description: 'Create constitution, officer roles, and meeting plans.',
        tools: [
          { name: 'Starter Guides', href: '/hub' },
          { name: 'Meeting Agenda Templates', href: '/hub/guides/guide-4' },
          { name: 'Club Health Check', href: '/hub/health' },
        ],
      },
  {
    id: 'recruitment',
    title: 'Recruitment & Launch',
    description: 'Run your first recruitment drives and launch events.',
    tools: [
      { name: 'Event Calendar', href: '/hub/calendar' },
      { name: 'Fundraising Ideas', href: '/funding' },
      { name: 'Social Media Guide', href: '/hub/external' },
    ],
  },
  {
    id: 'operations',
    title: 'Operations & Management',
    description: 'Manage members, announcements, and recurring activities.',
    tools: [
      { name: 'Club Manager', href: '/hub/manage-club' },
      { name: 'Member Collections', href: '/hub/my-collections' },
      { name: 'Mentors & Advisors', href: '/hub/mentors' },
    ],
  },
  {
    id: 'growth',
    title: 'Growth & Competitions',
    description: 'Scale membership, track competitions, and celebrate wins.',
    tools: [
      { name: 'Competitions', href: '/hub/competitions' },
      { name: 'Club Comparison', href: '/hub/compare' },
      { name: 'Spotlight & Stories', href: '/hub/stories' },
    ],
  },
];

export default async function StagePage({ params }: { params: { stage: string } }) {
  const stageId = params.stage;
  const idx = stages.findIndex((s) => s.id === stageId);
  const stage = stages[idx] || stages[0];
  const next = stages[idx + 1];

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{stage.title}</h1>
          <p className="text-neutral-200">{stage.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {stage.tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="bg-white border p-6 rounded-lg hover:shadow-md">
              <div className="font-medium text-primary-700">{tool.name}</div>
              <div className="text-xs text-neutral-500 mt-2">Open tool →</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <Link href="/initiation" className="px-4 py-2 bg-white border rounded-lg">
            Back to Initiation
          </Link>
          {next ? (
            <Link href={`/initiation/${next.id}`} className="px-4 py-2 bg-secondary-500 text-white rounded-lg">
              Next: {next.title} →
            </Link>
          ) : (
            <Link href="/propose" className="px-4 py-2 bg-secondary-500 text-white rounded-lg">
              Finish & Propose →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
