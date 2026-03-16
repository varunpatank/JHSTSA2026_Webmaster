import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-gradient-to-b from-white via-primary-50/20 to-secondary-50/20">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-10">
          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-secondary-700">ClubConnect</h3>
            <p className="text-neutral-600 text-sm">
              Launch Club &mdash; connecting students to clubs,
              events, guides, and everything they need to lead and thrive.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-secondary-700">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" className="text-neutral-600 hover:text-primary-700">Resources &amp; Support</Link></li>
              <li><Link href="/directory" className="text-neutral-600 hover:text-primary-700">Club Directory</Link></li>
              <li><Link href="/events" className="text-neutral-600 hover:text-primary-700">Events Calendar</Link></li>
              <li><Link href="/hub" className="text-neutral-600 hover:text-primary-700">Student Hub</Link></li>
              <li><Link href="/references" className="text-neutral-600 hover:text-primary-700">References</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-secondary-700">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/start-a-club" className="text-neutral-600 hover:text-primary-700">Start New Club</Link></li>
              <li><Link href="/events/new" className="text-neutral-600 hover:text-primary-700">Submit an Event</Link></li>
              <li><Link href="/donate" className="text-neutral-600 hover:text-primary-700">Donations</Link></li>
              <li><Link href="/resources" className="text-neutral-600 hover:text-primary-700">Resources &amp; Guides</Link></li>
              <li><Link href="/propose" className="text-neutral-600 hover:text-primary-700">Suggest a Resource</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-secondary-700">Hub &amp; Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hub" className="text-neutral-600 hover:text-primary-700">Student Hub</Link></li>
              <li><Link href="/hub/discussions" className="text-neutral-600 hover:text-primary-700">Discussions</Link></li>
              <li><Link href="/hub/competitions" className="text-neutral-600 hover:text-primary-700">Competitions</Link></li>
              <li><Link href="/hub/calendar" className="text-neutral-600 hover:text-primary-700">Hub Calendar</Link></li>
              <li><Link href="/hub/collaborate" className="text-neutral-600 hover:text-primary-700">Collaboration</Link></li>
              <li><Link href="/hub/mentors" className="text-neutral-600 hover:text-primary-700">Mentor Network</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4 text-secondary-700">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-neutral-600 hover:text-primary-700">Login</Link></li>
              <li><Link href="/signup" className="text-neutral-600 hover:text-primary-700">Sign Up</Link></li>
              <li><Link href="/profile" className="text-neutral-600 hover:text-primary-700">Profile</Link></li>
              <li><Link href="/dashboard" className="text-neutral-600 hover:text-primary-700">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p>&copy; {currentYear} ClubConnect &mdash; Launch Club. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-700">Terms of Use</Link>
            <Link href="/accessibility" className="hover:text-primary-700">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
