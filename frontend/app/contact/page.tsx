import { BackButton } from "../components/BackButton";
import { ChatSimulator } from "../components/ChatSimulator";
import { ContactForm } from "../components/ContactForm";

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <BackButton />
      <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-10 shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-amber-50">Contact Us</h1>
        <p className="mt-4 text-slate-600 dark:text-amber-100/85">
          Have a question or want to explore a custom plan? Send us a message and we’ll respond soon.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ContactForm />
        <ChatSimulator />
      </div>
    </section>
  );
}
