import HeroSection from "@/components/HeroSection";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <HeroSection
        title="Accessibility"
        description="Accessibility commitments, support details, and inclusive design standards for ClubConnect."
        align="left"
        shellClassName="max-w-4xl"
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
  );
}
