"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BackButton() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200/80 bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_25px_-12px_rgba(245,158,11,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-[0_14px_32px_-12px_rgba(245,158,11,0.45)] dark:border-amber-400/30 dark:bg-[#26190c] dark:text-amber-50"
    >
      <span aria-hidden="true">←</span>
      <span>Back Home</span>
    </Link>
  );
}