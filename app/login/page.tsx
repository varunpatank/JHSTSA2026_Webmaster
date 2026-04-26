import LoginFormClient from "@/components/LoginFormClient";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(30,58,95,0.08) 18px, rgba(30,58,95,0.08) 19px)"
        }} />
      <div className="relative z-0">
        <LoginFormClient redirect={params.redirect || "/dashboard"} />
      </div>
    </div>
  );
}
