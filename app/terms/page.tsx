import HeroSection from "@/components/HeroSection";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <HeroSection
        title="Terms of Use"
        description="Guidelines and responsibilities for using ClubConnect and participating in the school community."
        align="left"
        shellClassName="max-w-4xl"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-neutral-600 mb-4">These are the placeholder terms of use for ClubConnect. Replace with your institution's official terms before publishing.</p>
        <p className="text-neutral-600">By using this site you agree to follow school policies and community guidelines.</p>
      </div>
    </div>
  );
}
