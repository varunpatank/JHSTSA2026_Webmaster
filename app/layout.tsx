import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import JudgeGuide from "@/components/JudgeGuide";
import AuthProviders from "@/components/AuthProviders";

export const metadata: Metadata = {
  title: "ClubConnect — Launch Club",
  description:
    "Discover clubs, request membership, start new clubs, and manage club events through a structured school community workflow.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning className="min-h-screen flex flex-col antialiased">
        <AuthProviders>
          <ScrollToTop />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <JudgeGuide />
        </AuthProviders>
      </body>
    </html>
  );
}
