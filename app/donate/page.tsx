import Link from "next/link";
import { chapters } from "@/lib/data";
import DonationForm from "@/components/DonationForm";

interface DonatePageProps {
  searchParams: Promise<{ club?: string; success?: string; canceled?: string }>;
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const { club, success, canceled } = await searchParams;
  const selectedClub = club
    ? chapters.find((item) => item.id === club)
    : undefined;
  const initialSuccess = success === "true";

  return (
    <div className="bg-neutral-100 min-h-screen">
      <section className="bg-primary-500 text-white border-b-4 border-secondary-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.12em] font-semibold text-primary-100">Support</p>
          <h1 className="mt-2 text-4xl font-heading font-bold">Donations &amp; Fundraising</h1>
          <p className="mt-2 text-neutral-100 max-w-2xl">
            Help fund student organizations, competitions, and community events. Payments processed securely via Stripe.
          </p>
          <p className="mt-3 text-sm bg-white/10 inline-block px-3 py-1 ">
            🧑‍⚖️ Judges: use promo code <strong>&quot;test&quot;</strong> to see the full payment flow at $0.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-3 gap-5">
        {}
        <div className="md:col-span-2">
          {canceled === "true" && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200  text-sm text-amber-800">
              Payment was canceled. You can try again below.
            </div>
          )}
          <DonationForm selectedClub={selectedClub ? { id: selectedClub.id, name: selectedClub.name } : undefined} initialSuccess={initialSuccess} />
        </div>

        {}
        <aside className="space-y-5">
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-white">
            <h3 className="text-lg font-heading font-bold text-primary-600">Transparency</h3>
            <p className="mt-2 text-sm text-neutral-700">
              All donations are tracked and reported. Club officers and advisors are accountable for fund usage.
            </p>
            <ul className="mt-3 text-sm text-neutral-600 space-y-1 list-disc list-inside">
              <li>Funds go directly to the club account</li>
              <li>Receipts provided for all donations</li>
              <li>Annual reports available on request</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-primary-600">How Funds Are Used</h3>
            <div className="mt-3 space-y-2">
              {[
                { icon: "🏆", label: "Competition registration & travel" },
                { icon: "📦", label: "Supplies & workshop materials" },
                { icon: "🎉", label: "Community events & outreach" },
                { icon: "💻", label: "Tech & equipment" },
                { icon: "📚", label: "Educational resources" },
                { icon: "🤝", label: "Inter-school collaborations" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-sm">
                  <span>{item.icon}</span>
                  <p className="text-neutral-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-primary-600">Other Ways to Help</h3>
            <div className="mt-3 space-y-2">
              <Link href="/start-a-club" className="block text-sm text-primary-600 hover:underline">Start a new club</Link>
              <Link href="/events" className="block text-sm text-primary-600 hover:underline">Volunteer at events</Link>
              <Link href="/resources" className="block text-sm text-primary-600 hover:underline">Share resources</Link>
              <Link href="/directory" className="block text-sm text-primary-600 hover:underline">← Club Directory</Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
