"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "theme";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initialTheme = readTheme();
    const root = document.documentElement;
    root.classList.toggle("dark", initialTheme === "dark");
    window.localStorage.setItem(THEME_KEY, initialTheme);

    const frame = window.requestAnimationFrame(() => {
      setTheme(initialTheme);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/80 bg-white/80 text-slate-800 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-amber-50 dark:border-amber-400/30 dark:bg-[#2d1f0d]/80 dark:text-amber-50"
    >
      <span className="relative inline-flex h-6 w-6 items-center justify-center">
        <span
          className={`absolute transition-all duration-300 ${theme === "dark" ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
          aria-hidden="true"
        >
          🌙
        </span>
        <span
          className={`absolute transition-all duration-300 ${theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
          aria-hidden="true"
        >
          ☀️
        </span>
      </span>
    </button>
  );
}
