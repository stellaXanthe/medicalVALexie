import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12">
      <div className="overflow-hidden rounded-[2rem] bg-white/85 p-10 shadow-[0_40px_120px_-60px_rgba(245,158,11,0.45)] ring-1 ring-amber-100/80 backdrop-blur-sm">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              HIPAA trained • compliant workflows
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              HIPAA-Trained Medical VAs — Save Time
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Focus on patient care while our virtual assistants handle scheduling, insurance
              coordination, and administrative follow-up—all with HIPAA compliance built in.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
              >
                Contact Us
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-amber-50"
              >
                View Services
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-lime-50 p-8 shadow-sm ring-1 ring-amber-100/70">
            <h2 className="text-xl font-semibold text-slate-900">How we help</h2>
            <ul className="mt-6 space-y-4 text-slate-600">
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
        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Get started quickly</h2>
          <p className="mt-4 text-slate-600">
            Our team integrates with your existing workflows and software. Reach out and we&apos;ll
            help you scope the right support plan for your practice.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">HIPAA compliance built in</h2>
          <p className="mt-4 text-slate-600">
            All data is handled securely using industry best practices. We train every assistant
            on HIPAA requirements and keep systems locked down.
          </p>
        </div>
      </div>
    </section>
  );
}
