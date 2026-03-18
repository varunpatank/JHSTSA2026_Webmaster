import Link from 'next/link';
import Image from 'next/image';
import { announcements } from '@/lib/data';

export default function AnnouncementsPage() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80"
            alt="Announcements and news"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/85"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="page-title text-white">Announcements</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Stay informed with the latest news and updates from ClubConnect.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary-500 text-white font-medium">All</button>
            <button className="px-4 py-2 border border-neutral-300 hover:border-primary-500 transition-colors">High Priority</button>
            <button className="px-4 py-2 border border-neutral-300 hover:border-primary-500 transition-colors">This Week</button>
          </div>
          <div className="text-sm text-neutral-500">
            {announcements.length} announcements
          </div>
        </div>

        <div className="space-y-4">
          {announcements
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((announcement) => (
              <article 
                key={announcement.id} 
                className={`card border-l-4 ${getPriorityColor(announcement.priority)} p-6`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs ${getPriorityBadge(announcement.priority)}`}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                    </span>
                    <span className="text-sm text-neutral-500">
                      {new Date(announcement.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-primary-500 font-heading mb-2">
                  {announcement.title}
                </h2>
                <p className="text-neutral-700 mb-3">{announcement.content}</p>
                <p className="text-sm text-neutral-500">
                  Posted by: <span className="font-medium">{announcement.author}</span>
                </p>
              </article>
            ))}
        </div>

        <div className="card p-8 mt-8 bg-primary-500 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-heading mb-4">Stay Updated</h2>
            <p className="text-neutral-200 mb-6">
              Get announcements delivered directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your.email@school.edu"
                className="flex-grow px-4 py-2 text-neutral-800"
              />
              <button type="submit" className="btn-secondary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
