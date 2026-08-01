import Link from "next/link";
import { Reveal } from "./components/Reveal";

const checklist = [
  "Manage patient scheduling and follow-ups with secure, HIPAA-ready processes.",
  "Help reduce no-shows by coordinating appointment reminders and requests.",
  "Provide secure intake support and routing for billing, referrals, and follow-up.",
];

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
      <Reveal as="section" className="overflow-hidden rounded-[2rem] border border-amber-200/70 bg-white/70 p-6 shadow-[0_24px_80px_-35px_rgba(245,158,11,0.45)] backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2d1f0d]/80 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-100/90 via-orange-50 to-lime-100/80 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-800 shadow-sm dark:border-amber-400/30 dark:from-amber-500/20 dark:to-lime-500/20 dark:text-amber-100">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.8)]" />
              HIPAA trained • compliant workflows
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 dark:text-amber-50 sm:text-5xl lg:text-6xl">
              HIPAA-trained medical support that keeps your practice moving.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-amber-100/85">
              Focus on patient care while I handle scheduling, insurance coordination, and administrative follow-up—all with HIPAA compliance built in.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_-20px_rgba(249,115,22,0.75)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_24px_55px_-18px_rgba(249,115,22,0.8)]"
              >
                Contact Us
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-amber-200/80 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-amber-50 hover:shadow-[0_14px_32px_-14px_rgba(245,158,11,0.45)] dark:border-amber-400/30 dark:bg-[#26190c]/80 dark:text-amber-50"
              >
                View Services
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-amber-200/70 bg-gradient-to-br from-lime-50/90 via-amber-50/80 to-white/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-amber-400/30 dark:from-[#2f220f] dark:via-[#24170b] dark:to-[#1d1408] sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">How we help</h2>
              <span className="rounded-full border border-amber-200/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700 dark:border-amber-400/30 dark:bg-[#26190c]/80 dark:text-amber-100">
                Core support
              </span>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600 dark:text-amber-100/85">
              {checklist.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-transparent bg-white/60 p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200/70 hover:shadow-md dark:bg-[#2b1f0d]/70 dark:hover:border-amber-400/20" style={{ transitionDelay: `${index * 70}ms` }}>
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-lime-500 text-xs font-semibold text-white shadow-sm">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal as="article" delay={100} className="rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-8 shadow-[0_22px_70px_-35px_rgba(245,158,11,0.35)] backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2d1f0d]/80">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-amber-50">Get started quickly</h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-amber-100/85">
            I integrate with your existing workflows and software. Reach out and I&apos;ll help you scope the right support plan for your practice.
          </p>
        </Reveal>

        <Reveal as="article" delay={140} className="rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-8 shadow-[0_22px_70px_-35px_rgba(245,158,11,0.35)] backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2d1f0d]/80">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-amber-50">HIPAA compliance built in</h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-amber-100/85">
            All data is handled securely using industry best practices. I am trained to ensure all assistants are compliant with HIPAA requirements and that systems remain secure.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
