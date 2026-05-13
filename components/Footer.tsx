import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-gradient-to-b from-white via-primary-50/20 to-secondary-50/20">
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mt-10">
          {/* Brand */}
          <div>
            <h3 className="text-base font-bold font-heading mb-1 text-secondary-700">ClubConnect</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Connecting students to clubs, community resources, events, and programs — all in one place.
            </p>
          </div>

          {/* Community Resources */}
          <div>
            <h3 className="text-sm font-bold font-heading mb-3 text-neutral-700 uppercase tracking-wide">Community Hub</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/directory" className="text-neutral-500 hover:text-primary-700">Resource Directory</Link></li>
              <li><Link href="/#community-spotlight" className="text-neutral-500 hover:text-primary-700">Community Spotlight</Link></li>
              <li><Link href="/events" className="text-neutral-500 hover:text-primary-700">Events &amp; Programs</Link></li>
              <li><Link href="/community" className="text-neutral-500 hover:text-primary-700">Social Feed</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold font-heading mb-3 text-neutral-700 uppercase tracking-wide">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" className="text-neutral-500 hover:text-primary-700">Club Resources</Link></li>
              <li><Link href="/references" className="text-neutral-500 hover:text-primary-700">References</Link></li>
              <li><Link href="/start-a-club" className="text-neutral-500 hover:text-primary-700">Start a Club</Link></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h3 className="text-sm font-bold font-heading mb-3 text-neutral-700 uppercase tracking-wide">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-neutral-500 hover:text-primary-700">Login</Link></li>
              <li><Link href="/signup" className="text-neutral-500 hover:text-primary-700">Sign Up</Link></li>
              <li><Link href="/portal" className="text-neutral-500 hover:text-primary-700">Portal</Link></li>
              <li><Link href="/donate" className="text-neutral-500 hover:text-primary-700">Donate</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400 gap-3">
          <p>&copy; {currentYear} ClubConnect &mdash; Launch Club. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-primary-700">Privacy</Link>
            <Link href="/terms" className="hover:text-primary-700">Terms</Link>
            <Link href="/accessibility" className="hover:text-primary-700">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
