import HeroSection from "@/components/HeroSection";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <HeroSection
        title="Privacy Policy"
        description="How ClubConnect collects, uses, and protects student and community data."
        align="left"
        shellClassName="max-w-4xl"
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
  );
}
