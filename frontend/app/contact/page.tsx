import { ChatSimulator } from "../components/ChatSimulator";
import { ContactForm } from "../components/ContactForm";

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Contact Us</h1>
        <p className="mt-4 text-slate-600">
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
