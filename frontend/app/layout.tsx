import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medical VA - HIPAA-Trained Virtual Assistants",
  description: "HIPAA-trained medical virtual assistants to help with scheduling, billing, and patient communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col px-4 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
