export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">About Medical VA</h1>
        <p className="mt-4 text-slate-600">
          We provide HIPAA-trained virtual assistants who support healthcare practices with
          administrative tasks so providers can focus on patient care. Our team is trained
          on confidential data handling, secure communication, and compliant documentation
          practices.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Why HIPAA matters</h2>
            <p className="mt-3 text-slate-600">
              Protected health information (PHI) must be handled with care. Our assistants work
              within secure systems and are trained to follow privacy rules so your patients are protected.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">How we work</h2>
            <p className="mt-3 text-slate-600">
              We integrate with your existing practice management tools, coordinate scheduling,
              manage patient outreach, and support billing workflows — all while ensuring a
              compliant, professional experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
