import HeroSection from "@/components/HeroSection";

export default function AccessibilityPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0 min-h-screen bg-neutral-100">
        <HeroSection
        title="Accessibility"
        description={<>ClubConnect is built for <strong className="text-secondary-700 font-bold">every student</strong> — including those using screen readers, keyboard navigation, or assistive devices. Here’s how we meet <strong className="text-primary-700 font-semibold">WCAG accessibility standards</strong> and where to report issues.</>}
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
        <p className="text-neutral-600 mb-4">ClubConnect follows WCAG guidelines for color contrast and semantic markup. This is a placeholder accessibility statement — update with your institution's accessibility contact and processes.</p>
        <ul className="list-disc pl-6 text-neutral-600">
          <li>Contrast checks for text and UI components</li>
          <li>Keyboard navigable menus and forms</li>
          <li>Alt text on images where applicable</li>
        </ul>
      </div>
      </div>
    </div>
  );
}

