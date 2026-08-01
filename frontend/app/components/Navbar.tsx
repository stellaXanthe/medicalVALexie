"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/services", label: "Services", icon: "✦" },
  { href: "/about", label: "About", icon: "◌" },
  { href: "/contact", label: "Contact", icon: "✉" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyHidden = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable || focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previouslyHidden;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const currentLabel = links.find((link) => pathname === link.href)?.label ?? "Home";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-amber-200/70 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/70 dark:border-amber-400/20 dark:bg-[#24170b]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full px-2 py-2 text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50/70 hover:shadow-sm dark:text-amber-50 dark:hover:bg-amber-500/10"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-lime-500 text-base font-semibold text-white shadow-[0_15px_35px_-15px_rgba(249,115,22,0.7)]">
              L
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-700 dark:text-amber-200">LEXIE</p>
              <p className="text-[11px] text-slate-500 dark:text-amber-100/70">{currentLabel}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/80 bg-white/80 text-slate-800 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-amber-50 dark:border-amber-400/30 dark:bg-[#2d1f0d]/80 dark:text-amber-50"
            >
              <span className="flex flex-col items-center gap-1.5">
                <span
                  className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""}`}
                />
                <span className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <span
                  className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[45] bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        ref={drawerRef}
        className={`fixed left-0 top-0 z-[46] flex h-full w-[84vw] max-w-[320px] flex-col border-r border-amber-200/70 bg-white/95 shadow-[18px_0_70px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform duration-300 ease-out dark:border-amber-400/20 dark:bg-[#24170b]/95 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-amber-200/70 px-5 py-4 dark:border-amber-400/20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-200">Navigation</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-amber-50">Medical VA</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/80 bg-amber-50/70 text-slate-800 transition hover:scale-105 dark:border-amber-400/30 dark:bg-[#2d1f0d]/80 dark:text-amber-50"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4" aria-label="Primary">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname !== "/" && link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-lime-500/10 text-slate-900 shadow-sm ring-1 ring-amber-300/60 dark:text-amber-50 dark:ring-amber-400/30"
                    : "text-slate-700 hover:bg-amber-50/80 hover:text-slate-900 dark:text-amber-100/90 dark:hover:bg-amber-500/10 dark:hover:text-amber-50"
                }`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-base shadow-sm dark:bg-[#2d1f0d]/70">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-amber-200/70 px-5 py-4 text-sm text-slate-600 dark:border-amber-400/20 dark:text-amber-100/80">
          <p className="font-semibold">HIPAA-trained support, ready when you are.</p>
        </div>
      </aside>
    </>
  );
}