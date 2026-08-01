import { BackButton } from "../components/BackButton";
import { ChatSimulator } from "../components/ChatSimulator";
import { ContactForm } from "../components/ContactForm";
import { Reveal } from "../components/Reveal";

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <BackButton />
      <Reveal as="div" className="rounded-[1.75rem] border border-amber-200/70 bg-white/70 p-8 shadow-[0_24px_80px_-35px_rgba(245,158,11,0.35)] backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2d1f0d]/80 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-amber-50 sm:text-4xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-amber-100/85">
          Have a question or want to explore a custom plan? Send us a message and we’ll respond soon.
        </p>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal as="div" delay={80}><ContactForm /></Reveal>
        <Reveal as="div" delay={120}><ChatSimulator /></Reveal>
      </div>
    </section>
  );
}
