import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientChatWrapper from "@/components/ClientChatWrapper";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"], display: "swap" });

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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ScrollToTop />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ClientChatWrapper />
      </body>
    </html>
  );
}
