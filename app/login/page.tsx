import LoginFormClient from "@/components/LoginFormClient";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string;}>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <LoginFormClient
      redirect={params.redirect || "/profile"}
    />
  );
}
