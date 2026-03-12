import ClubMatchQuiz from "@/components/directory/ClubMatchQuiz";

export const metadata = {
  title: "Club Match Quiz | ClubConnect",
  description: "Discover clubs that match your interests and goals",
};

export default function QuizPage() {
  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* ── Hero Header ── */}
      <section className="bg-primary-500 text-white border-b-4 border-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 animate-fade-up">
          <p className="text-xs sm:text-sm uppercase tracking-[0.12em] font-semibold text-primary-100">
            Find Your Fit
          </p>
          <h1 className="mt-2 text-2xl md:text-5xl font-heading font-bold">
            Club Match Quiz
          </h1>
          <p className="mt-2 text-primary-100 max-w-2xl">
            Discover clubs that align with your interests, goals, and schedule.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="animate-fade-up">
          <ClubMatchQuiz />
        </div>
      </div>
    </div>
  );
}
