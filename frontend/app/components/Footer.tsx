export function Footer() {
  return (
    <footer className="border-t border-amber-200/70 bg-white/80 py-8 dark:border-amber-400/30 dark:bg-[#24170b]/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-600 dark:text-amber-100/90 sm:flex-row">
        <p>© {new Date().getFullYear()} Medical VA</p>
        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 via-yellow-50 to-lime-100 px-3 py-1 text-amber-800 shadow-sm dark:border-amber-400/40 dark:from-amber-500/20 dark:to-lime-500/20 dark:text-amber-50">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-lime-500 text-white">
            ✓
          </span>
          <span>HIPAA Compliant</span>
        </div>
      </div>
    </footer>
  );
}
