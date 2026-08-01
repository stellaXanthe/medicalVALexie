import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ScrollProgress } from "./components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medical VA - HIPAA-Trained Virtual Assistant",
  description: "HIPAA-trained medical virtual assistant to help with scheduling, billing, and patient communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden text-slate-900 antialiased`}
      >
        <ScrollProgress />
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
