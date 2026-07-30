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
      className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur transition ${
        theme === "dark"
          ? "border-amber-300/70 bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 text-white shadow-[0_10px_30px_rgba(249,115,22,0.28)] hover:from-amber-400 hover:via-orange-400 hover:to-lime-400"
          : "border-amber-200 bg-gradient-to-r from-amber-100 via-yellow-50 to-lime-100 text-slate-900 hover:from-amber-200 hover:via-amber-100 hover:to-lime-200"
      }`}
    >
      {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
    </button>
  );
}
