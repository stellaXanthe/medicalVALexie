import { BackButton } from "../components/BackButton";
import { Reveal } from "../components/Reveal";

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <BackButton />
      <Reveal as="div" className="rounded-[1.75rem] border border-amber-200/70 bg-white/70 p-8 shadow-[0_24px_80px_-35px_rgba(245,158,11,0.35)] backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2d1f0d]/80 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-amber-50 sm:text-4xl">About Medical VA</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-amber-100/85">
          I am a HIPAA-trained virtual assistant who supports healthcare practices with administrative tasks so providers can focus on patient care. I am trained on confidential data handling, secure communication, and compliant documentation practices.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Reveal as="div" delay={80} className="rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-6 shadow-sm dark:border-amber-400/20 dark:bg-[#2b1f0d]/70">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">Why HIPAA matters</h2>
            <p className="mt-3 text-base leading-8 text-slate-600 dark:text-amber-100/85">
              Protected health information (PHI) must be handled with care. I work within secure systems and am trained to follow privacy rules so your patients are protected.
            </p>
          </Reveal>

          <Reveal as="div" delay={120} className="rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-6 shadow-sm dark:border-amber-400/20 dark:bg-[#2b1f0d]/70">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">How we work</h2>
            <p className="mt-3 text-base leading-8 text-slate-600 dark:text-amber-100/85">
              I integrate with your existing practice management tools, coordinate scheduling, manage patient outreach, and support billing workflows — all while ensuring a compliant, professional experience.
            </p>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
