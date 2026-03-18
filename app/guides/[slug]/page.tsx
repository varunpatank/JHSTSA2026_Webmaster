"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { guidesData } from "@/lib/data";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from "lucide-react";

export default function GuideDetailPage() {
  const params = useParams<{ slug: string }>();
  const guide = guidesData.find(g => g.slug === params.slug);

  if (!guide) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="card p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-heading font-bold text-primary-600">Guide Not Found</h1>
          <p className="text-neutral-600 mt-2">The requested guide could not be located.</p>
          <Link href="/guides" className="btn-primary inline-block mt-5">Back to Guides</Link>
        </div>
      </div>
    );
  }

  const guideIndex = guidesData.findIndex(g => g.slug === params.slug);
  const prevGuide = guideIndex > 0 ? guidesData[guideIndex - 1] : null;
  const nextGuide = guideIndex < guidesData.length - 1 ? guidesData[guideIndex + 1] : null;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-600 text-white border-b-4 border-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <Link href="/guides" className="text-sm text-primary-200 hover:underline inline-flex items-center gap-1"><ArrowLeft size={14} /> All Guides</Link>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white ml-3">{guide.category}</span>
          <h1 className="mt-4 text-3xl md:text-4xl font-heading font-bold">{guide.title}</h1>
          <p className="mt-3 text-primary-100 text-lg">{guide.description}</p>
          <p className="mt-3 text-xs text-primary-200">{guide.sections.length} sections · {guide.sections.length * 3} min read</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_240px] gap-8">
        <div className="space-y-8">
          {guide.sections.map((section, i) => (
            <div key={section.heading} id={`section-${i}`} className="card p-6 ux-hover-lift-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8  bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 text-sm font-bold">{i + 1}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-heading font-bold text-primary-700">{section.heading}</h2>
                  <p className="text-sm text-neutral-700 mt-2 leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              </div>
            </div>
          ))}

          {}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            {prevGuide ? (
              <Link href={`/guides/${prevGuide.slug}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1"><ArrowLeft size={14} /> {prevGuide.title}</Link>
            ) : <span />}
            {nextGuide ? (
              <Link href={`/guides/${nextGuide.slug}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1">{nextGuide.title} <ArrowRight size={14} /></Link>
            ) : <span />}
          </div>
        </div>

        {}
        <aside className="hidden lg:block">
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-primary-700 flex items-center gap-2 mb-3"><BookOpen size={16} /> Contents</h3>
            <nav className="space-y-1">
              {guide.sections.map((section, i) => (
                <a key={section.heading} href={`#section-${i}`} className="block text-sm text-neutral-600 hover:text-primary-600 py-1 pl-3 border-l-2 border-transparent hover:border-primary-400 transition-colors">
                  {i + 1}. {section.heading}
                </a>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Link href="/faq" className="text-sm text-primary-600 hover:underline">Have questions? Check FAQ →</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
