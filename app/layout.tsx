import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import JudgeGuide from "@/components/JudgeGuide";
import AuthProviders from "@/components/AuthProviders";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClubConnect — Launch Club",
  description:
    "Discover clubs, request membership, start new clubs, and manage club events through a structured school community workflow.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${lora.variable} ${inter.variable}`}>
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
