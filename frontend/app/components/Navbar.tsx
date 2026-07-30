"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/70 bg-white/85 backdrop-blur-xl dark:border-amber-400/30 dark:bg-[#24170b]/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full px-2 py-2 font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50/80 hover:shadow-sm dark:text-amber-50 dark:hover:bg-amber-500/10"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-lime-500 text-white shadow-[0_12px_30px_-12px_rgba(249,115,22,0.7)]">
            VA
          </span>
          <span className="text-lg tracking-tight"> Hi, I&apos;m Lexie, your medical virtual assistant</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-2 text-sm font-medium text-slate-600 dark:text-amber-100/90 lg:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 transition-all duration-200 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-100 via-orange-50 to-lime-100 text-slate-900 shadow-[0_12px_30px_-14px_rgba(245,158,11,0.35)] ring-1 ring-amber-200/70 dark:from-amber-500/20 dark:via-amber-500/15 dark:to-lime-500/20 dark:text-amber-50 dark:ring-amber-400/30"
                      : "hover:bg-white/80 hover:text-slate-900 hover:shadow-sm hover:ring-1 hover:ring-amber-200/60 dark:hover:bg-amber-500/10 dark:hover:text-amber-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}