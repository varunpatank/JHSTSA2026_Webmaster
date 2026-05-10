import HeroSection from "@/components/HeroSection";

export default function PrivacyPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 min-h-screen bg-neutral-100">
      <HeroSection
        title="Privacy Policy"
        description={<>How ClubConnect <strong className="text-secondary-700 font-bold">collects, stores, and protects</strong> student and community data. We follow strict privacy-first principles — your information is <strong className="text-primary-700 font-semibold">never sold or shared</strong> without your explicit consent.</>}
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
        <p className="text-neutral-600 mb-4">ClubConnect respects your privacy. This placeholder page describes how data is collected and used. For production, replace with your organization's full privacy policy.</p>
        <ul className="list-disc pl-6 text-neutral-600">
          <li>We do not share personal data without consent.</li>
          <li>Cookies are used for session and preferences.</li>
          <li>Contact activities@school.edu for data requests.</li>
        </ul>
      </div>
      </div>
    </div>
  );
}

