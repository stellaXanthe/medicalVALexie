import { BackButton } from "../components/BackButton";

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <BackButton />
      <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-10 shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-amber-50">About Medical VA</h1>
        <p className="mt-4 text-slate-600 dark:text-amber-100/85">
          I am a HIPAA-trained virtual assistant who supports healthcare practices with
          administrative tasks so providers can focus on patient care. I am trained
          on confidential data handling, secure communication, and compliant documentation
          practices.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-6 dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">Why HIPAA matters</h2>
            <p className="mt-3 text-slate-600 dark:text-amber-100/85">
              Protected health information (PHI) must be handled with care. I work
              within secure systems and am trained to follow privacy rules so your patients are protected.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-6 dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">How we work</h2>
            <p className="mt-3 text-slate-600 dark:text-amber-100/85">
              I integrate with your existing practice management tools, coordinate scheduling,
              manage patient outreach, and support billing workflows — all while ensuring a
              compliant, professional experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
