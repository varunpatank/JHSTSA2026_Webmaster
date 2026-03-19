import Link from "next/link";
import Image from "next/image";
import {
 ArrowRight, BookOpen, Calendar, Compass, FileText, GraduationCap,
 MapPin, Rocket, Users,
} from "lucide-react";
import {
 announcements, events, stats, schoolWideStats, chapters,
} from "@/lib/data";


const CLUB_ICONS: Record<string, string> = {
 "Model United Nations": "\u{1F30D}",
 "Robotics Engineering Club": "\u{1F916}",
 "Community Service League": "\u2764\uFE0F",
 "Drama & Theatre Society": "\u{1F3AD}",
 "Debate Team": "\u{1F3A4}",
 "Cultural Heritage Club": "\u{1F30F}",
 "Environmental Action Group": "\u{1F33F}",
 "School Newspaper": "\u{1F4F0}",
};

function HomeAnnouncementStrip() {
  return (
    <div className="relative z-10 border-t border-primary-700/50 bg-primary-800/80 backdrop-blur-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="bg-secondary-500 text-white text-[10px] font-bold px-2.5 py-0.5 shrink-0 uppercase tracking-wider">
            New
          </span>
          <p className="text-sm font-medium truncate">Find your next club &middot; Browse events &middot; Connect with mentors</p>
        </div>
        <Link
          href="/directory"
          className="text-xs font-semibold text-secondary-300 hover:text-white whitespace-nowrap flex items-center gap-1"
        >
          Browse Clubs <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const upcomingEvents = events.slice(0, 4);
  const featuredClubs = chapters.slice(0, 6);

  return (
    <div className="bg-neutral-50">
      <section className="relative overflow-hidden border-b border-primary-700">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=80"
            alt="Students gathered at a school event"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-600/60 to-primary-800/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-5 md:pt-8 md:pb-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="inline-flex items-center bg-secondary-500 text-white text-sm font-semibold px-4 py-1.5">
                Your School Community Hub
              </span>
              <h1 className="mt-4 text-2xl md:text-5xl font-heading font-bold leading-[1.02] tracking-tight">
                <span className="animate-fade-up inline-block">Welcome to</span>
                <br />
                <span className="hero-title-reveal hero-title-glow inline-block">ClubConnect</span>
                <span className="block h-1 bg-secondary-400 mt-2 hero-line-expand" />
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/90 leading-relaxed">
                Your central hub for school clubs, chapters, and student
                organizations. Discover, connect, and thrive with peers who
                share your passions.
              </p>
              <div className="mt-6 flex flex-col gap-3 w-auto sm:flex-row">
                <Link
                  href="/start-a-club"
                  className="inline-flex items-center justify-center border border-white/80 hover:bg-white hover:text-primary-700 text-white px-6 py-2.5 font-semibold transition-colors"
                >
                  Start a New Club
                </Link>
                <Link
                  href="/directory"
                  className="inline-flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-600 border border-secondary-500 text-white px-6 py-2.5 font-semibold transition-colors animate-jump-right"
                >
                  Browse Clubs
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 ">
              <article className="border border-white/25 bg-white/15 backdrop-blur-sm p-5 text-center text-white hover:bg-white/25 transition-colors">
                <p className="text-5xl font-heading font-bold text-secondary-300">
                  {stats.activeChapters}
                </p>
                <p className="mt-1 text-lg text-white/90">Active Clubs</p>
              </article>
              <article className="border border-white/25 bg-white/15 backdrop-blur-sm p-5 text-center text-white hover:bg-white/25 transition-colors">
                <p className="text-5xl font-heading font-bold text-secondary-300">
                  {stats.totalMembers.toLocaleString()}
                </p>
                <p className="mt-1 text-lg text-white/90">Student Members</p>
              </article>
              <article className="border border-white/25 bg-white/15 backdrop-blur-sm p-5 text-center text-white hover:bg-white/25 transition-colors">
                <p className="text-5xl font-heading font-bold text-secondary-300">
                  {stats.upcomingEvents}
                </p>
                <p className="mt-1 text-lg text-white/90">Upcoming Events</p>
              </article>
              <article className="border border-white/25 bg-white/15 backdrop-blur-sm p-5 text-center text-white hover:bg-white/25 transition-colors">
                <p className="text-5xl font-heading font-bold text-secondary-300">
                  +{stats.newMembersThisMonth}
                </p>
                <p className="mt-1 text-lg text-white/90">New This Month</p>
              </article>
            </div>
          </div>
        </div>

        <HomeAnnouncementStrip />
      </section>

   <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
    {/* Announcements */}
    <section className="card p-5">
     <h3 className="text-base font-heading font-bold text-primary-700 mb-3">Announcements</h3>
     <div className="space-y-2.5">
      {announcements.slice(0, 3).map(ann => (
       <div key={ann.id} className="flex items-start gap-2.5 p-3 border border-neutral-100 hover:bg-primary-50/30 transition-colors">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ann.priority === "high" ? "bg-red-500" : "bg-yellow-500"}`} />
        <div>
         <p className="font-semibold text-sm text-primary-800">{ann.title}</p>
         <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{ann.content}</p>
        </div>
       </div>
      ))}
     </div>
    </section>

    {/* Featured Clubs */}
    <section>
     <div className="flex items-end justify-between mb-3">
      <div>
       <p className="eyebrow">Trending Now</p>
       <h2 className="mt-0.5 text-lg md:text-xl font-heading text-primary-800">Featured Clubs</h2>
      </div>
      <Link href="/directory" className="text-xs font-semibold text-primary-600 hover:underline inline-flex items-center gap-1">
       View all {chapters.length} clubs <ArrowRight size={12} />
      </Link>
     </div>
     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {featuredClubs.map(club => (
       <Link key={club.id} href={`/directory/${club.id}`} className="card p-4 hover:border-primary-400 ux-hover-lift group">
        <div className="flex items-center gap-2 mb-2">
         <span className="text-lg">{CLUB_ICONS[club.name] || "\u2B50"}</span>
         <span className="badge badge-outline text-xs">{club.category}</span>
         <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${club.membershipStatus === "Open Enrollment" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {club.membershipStatus === "Open Enrollment" ? "Open" : "Apply"}
         </span>
        </div>
        <h3 className="font-bold text-primary-800 text-sm group-hover:text-primary-600">{club.name}</h3>
        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{club.description}</p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
         <span className="flex items-center gap-1"><Users size={10} /> {club.memberCount} members</span>
         <span className="flex items-center gap-1"><MapPin size={10} /> {club.meetingLocation.room}</span>
        </div>
       </Link>
      ))}
     </div>
    </section>

    {/* Events + Quick Access */}
    <div className="grid lg:grid-cols-3 gap-5">
     <div className="lg:col-span-2">
      <div className="flex items-end justify-between mb-3">
       <h2 className="text-xl font-heading font-bold text-primary-700">Upcoming Events</h2>
       <Link href="/events" className="text-sm font-semibold text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
      </div>
      <div className="space-y-3">
       {upcomingEvents.map(event => (
        <Link href={`/events/${event.id}`} key={event.id} className="card p-4 flex items-center gap-4 ux-hover-lift-sm group">
         <div className="text-center bg-gradient-to-b from-primary-500 to-primary-600 text-white px-3 py-2 min-w-[52px] shadow-sm">
          <div className="text-[10px]">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</div>
          <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
         </div>
         <div className="flex-1 min-w-0">
          <p className="font-semibold text-primary-700 group-hover:text-primary-600">{event.title}</p>
          <p className="text-sm text-neutral-500">{event.chapterName} &middot; {event.startTime}&ndash;{event.endTime}</p>
         </div>
         <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-neutral-400 flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
         </div>
        </Link>
       ))}
      </div>
     </div>

     <div>
      <h2 className="text-xl font-heading font-bold text-primary-700 mb-3 text-center">Quick Access</h2>
      <div className="space-y-2">
       {[
        { href: "/directory", icon: Compass, title: "Browse Clubs", desc: "Interactive directory with map and filters" },
        { href: "/resources", icon: BookOpen, title: "Resource Library", desc: "Guides, templates, and handbooks" },
        { href: "/start-a-club", icon: Rocket, title: "Start a Club", desc: "Step-by-step creation wizard" },
        { href: "/hub/mentors", icon: GraduationCap, title: "Mentors", desc: "Connect with professionals and alumni" },
        { href: "/events", icon: Calendar, title: "Events", desc: "Community events and calendar" },
        { href: "/references", icon: FileText, title: "References", desc: "Documentation, citations, and judge's guide" },
       ].map(item => {
        const Icon = item.icon;
        return (
         <Link key={item.title} href={item.href} className="card p-3.5 flex items-center gap-3 hover:border-primary-300 transition-colors group">
          <div className="w-9 h-9 bg-primary-50 text-primary-600 flex items-center justify-center">
           <Icon size={16} />
          </div>
          <div className="flex-1 min-w-0">
           <p className="font-bold text-sm text-primary-700 group-hover:text-primary-600">{item.title}</p>
           <p className="text-xs text-neutral-500">{item.desc}</p>
          </div>
          <ArrowRight size={14} className="text-neutral-300 group-hover:text-primary-400" />
         </Link>
        );
       })}
      </div>
     </div>
    </div>

    {/* CTA */}
    <section className="border border-primary-200 bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 p-4 md:p-6 text-center text-white relative overflow-hidden">
     <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" alt="" fill className="object-cover opacity-10" loading="lazy" />
     <div className="relative">
      <h2 className="text-xl font-heading font-bold">Ready to get involved?</h2>
      <p className="mt-1 max-w-2xl mx-auto text-white/90 text-sm">Whether you&rsquo;re looking for a club, a mentor, resources, or a way to make an impact &mdash; it all starts here.</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
       <Link href="/directory" className="inline-flex items-center gap-2 px-5 py-2 bg-white text-primary-700 font-semibold text-sm hover:bg-neutral-100 btn-magnetic btn-ripple">
        Browse Directory <ArrowRight size={16} />
       </Link>
       <Link href="/students" className="inline-flex items-center gap-2 px-5 py-2 border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-primary-700 btn-magnetic">
        <Users size={16} /> Community
       </Link>
      </div>
     </div>
    </section>
   </div>

  </div>
 );
}
