import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12">
      <div className="overflow-hidden rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-white/90 via-amber-50/80 to-lime-50/70 p-10 shadow-[0_40px_120px_-60px_rgba(245,158,11,0.45)] backdrop-blur-sm dark:border-amber-400/30 dark:from-[#34240d]/90 dark:via-[#24170b]/90 dark:to-[#1d1408]/90">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-100">
              HIPAA trained • compliant workflows
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-amber-50 sm:text-5xl">
              HIPAA-Trained Medical VA — Save Time
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-amber-100/85">
              Focus on patient care while I handle scheduling, insurance
              coordination, and administrative follow-up—all with HIPAA compliance built in.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-20px_rgba(249,115,22,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_24px_50px_-18px_rgba(249,115,22,0.8)]"
              >
                Contact Us
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-amber-200/80 bg-white/90 px-8 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_25px_-14px_rgba(245,158,11,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-[0_14px_32px_-14px_rgba(245,158,11,0.45)] dark:border-amber-400/30 dark:bg-[#26190c] dark:text-amber-50"
              >
                View Services
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-lime-50 via-amber-50/80 to-white p-8 shadow-sm dark:border-amber-400/30 dark:from-[#2f220f] dark:via-[#24170b] dark:to-[#1d1408]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">How we help</h2>
            <ul className="mt-6 space-y-4 text-slate-600 dark:text-amber-100/85">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                  ✓
                </span>
                <span>
                  Manage patient scheduling and follow-ups with secure, HIPAA-ready processes.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                  ✓
                </span>
                <span>Help reduce no-shows by coordinating appointment reminders and requests.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                  ✓
                </span>
                <span>
                  Provide secure intake support and routing for billing, referrals, and follow-up.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-10 shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-amber-50">Get started quickly</h2>
          <p className="mt-4 text-slate-600 dark:text-amber-100/85">
            I integrates with your existing workflows and software. Reach out and I&apos;ll
            help you scope the right support plan for your practice.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-10 shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-amber-50">HIPAA compliance built in</h2>
          <p className="mt-4 text-slate-600 dark:text-amber-100/85">
            All data is handled securely using industry best practices. I am trained to ensure all assistants
            are compliant with HIPAA requirements and that systems remain secure.
          </p>
        </div>
      </div>
    </section>
  );
}
