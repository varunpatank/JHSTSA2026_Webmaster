import EventSubmissionForm from "@/components/EventSubmissionForm";

interface NewEventPageProps {
  searchParams: Promise<{ club?: string }>;
}

export default async function NewEventPage({
  searchParams,
}: NewEventPageProps) {
  const params = await searchParams;
  return <EventSubmissionForm initialClubId={params.club} />;
}
