import HeroSection from "@/components/HeroSection";

export default function TermsPage() {
  return (
    <div className="relative">
      <div className="relative z-0 min-h-screen bg-neutral-100">
        <HeroSection
        title="Terms of Use"
        description={<>The <strong className="text-secondary-700 font-bold">rules and responsibilities</strong> for using ClubConnect. Short version: be respectful, represent your club honestly, and use this platform to <strong className="text-primary-700 font-semibold">build community</strong> — not tear it down.</>}
        align="left"
        shellClassName="max-w-4xl"
        images={[
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&w=1600&q=75",
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=75",
        ]}
        texture="diagonal"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-neutral-600 mb-4">These are the placeholder terms of use for ClubConnect. Replace with your institution's official terms before publishing.</p>
        <p className="text-neutral-600">By using this site you agree to follow school policies and community guidelines.</p>
      </div>
      </div>
    </div>
  );
}

