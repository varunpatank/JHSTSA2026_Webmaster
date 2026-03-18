import Link from 'next/link';
import Image from 'next/image';
import { spotlights } from '@/lib/data';

export default function SpotlightPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80"
            alt="Students celebrating achievements"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="page-title text-white">Chapter Spotlights</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Featured chapters showcasing the best of what our school organizations have to offer.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {spotlights.map((spotlight, index) => (
            <article key={spotlight.id} className="card overflow-hidden">
              <div className={`p-8 ${index % 2 === 0 ? 'bg-primary-500' : 'bg-secondary-500'} text-white`}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-20 h-20 bg-white flex items-center justify-center flex-shrink-0">
                    <span className={`text-3xl font-bold ${index % 2 === 0 ? 'text-primary-500' : 'text-secondary-500'} font-heading`}>
                      {spotlight.chapter.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                    </span>
                  </div>
                  <div>
                    <span className="badge bg-white/20 text-white mb-2">{spotlight.chapter.category}</span>
                    <h2 className="text-2xl md:text-3xl font-bold font-heading">{spotlight.title}</h2>
                    <p className="text-neutral-200 mt-2">
                      {spotlight.chapter.memberCount} members • Founded {spotlight.chapter.foundedYear}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="section-title text-xl mb-4">About</h3>
                    <p className="text-neutral-700 leading-relaxed mb-8">{spotlight.content}</p>

                    <h3 className="section-title text-xl mb-4">Highlights</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {spotlight.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-neutral-50 border border-neutral-200">
                          <span className="w-8 h-8 bg-secondary-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="square" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-neutral-700">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="section-title text-xl mb-4">What Members Say</h3>
                    <div className="space-y-6">
                      {spotlight.testimonials.map((testimonial, idx) => (
                        <blockquote key={idx} className="border-l-4 border-secondary-500 pl-6 py-2">
                          <p className="text-neutral-700 italic mb-3">&ldquo;{testimonial.quote}&rdquo;</p>
                          <footer className="text-sm">
                            <span className="font-semibold text-primary-500">{testimonial.author}</span>
                            <span className="text-neutral-500"> — {testimonial.role}</span>
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-neutral-50 border border-neutral-200 p-6">
                      <h4 className="font-bold text-primary-500 mb-4 font-heading">Chapter Information</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Meeting Schedule</span>
                          <span className="font-medium text-neutral-800">{spotlight.chapter.meetingFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Meeting Time</span>
                          <span className="font-medium text-neutral-800">{spotlight.chapter.meetingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Membership</span>
                          <span className="font-medium text-neutral-800">{spotlight.chapter.membershipStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Dues</span>
                          <span className="font-medium text-neutral-800">{spotlight.chapter.dues}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 p-6">
                      <h4 className="font-bold text-primary-500 mb-4 font-heading">Faculty Advisor</h4>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary-500 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            {spotlight.chapter.advisor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-800">{spotlight.chapter.advisor.name}</p>
                          <p className="text-sm text-neutral-500">{spotlight.chapter.advisor.department}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-500 text-white p-6">
                      <h4 className="font-bold mb-2 font-heading">Interested in Joining?</h4>
                      <p className="text-neutral-200 text-sm mb-4">
                        Learn more about this chapter and how to become a member.
                      </p>
                      <Link 
                        href={`/directory/${spotlight.chapterId}`}
                        className="btn-secondary w-full text-center block"
                      >
                        View Chapter Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="card p-8">
            <h3 className="text-xl font-bold text-primary-500 mb-2 font-heading">More Spotlights Coming Soon</h3>
            <p className="text-neutral-600 mb-4">
              We regularly feature different chapters to highlight the diverse opportunities available at our school.
            </p>
            <Link href="/directory" className="btn-outline">
              Explore All Chapters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
