export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/90 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-600 sm:flex-row">
        <p>© {new Date().getFullYear()} Medical VA</p>
        <div className="flex items-center gap-2 rounded-md bg-emerald-600/10 px-3 py-1 text-emerald-800">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            ✓
          </span>
          <span>HIPAA Compliant</span>
        </div>
      </div>
    </footer>
  );
}
