"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BackButton } from "../components/BackButton";
import { Reveal } from "../components/Reveal";
import { ServiceCard } from "../components/ServiceCard";
import { getApiErrorMessage, getApiUrl } from "../lib/api";

const submitWithFeedback = async (url: string, payload: Record<string, unknown>) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};

type Service = {
  name: string;
  description: string;
};

const scheduleSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const billingSupportTopics = [
  { value: "invoice", label: "Invoice help" },
  { value: "payment", label: "Payment help" },
  { value: "insurance", label: "Insurance help" },
];

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function SchedulingWidget() {
  const today = toInputDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(scheduleSlots[0]);
  const [selectedType, setSelectedType] = useState("support call");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const visibleSlots = (() => {
    if (selectedDate !== today) {
      return scheduleSlots;
    }

    const now = new Date();
    return scheduleSlots.filter((slot) => {
      const [hours, minutes] = slot.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      return slotTime > now;
    });
  })();

  useEffect(() => {
    if (!visibleSlots.includes(selectedTime)) {
      setSelectedTime(visibleSlots[0] ?? scheduleSlots[0]);
    }
  }, [selectedDate, selectedTime, visibleSlots]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const selectedValue = new Date(`${selectedDate}T${selectedTime}:00`);
    const now = new Date();

    if (selectedValue <= now) {
      setConfirmation("Please choose a future time for your session.");
      return;
    }

    if (!name.trim() || !email.trim()) {
      setConfirmation("Please share your name and email so we can confirm your scheduling request.");
      return;
    }

    try {
      const response = await submitWithFeedback(getApiUrl("/api/Inquiries/scheduling"), {
        name,
        email,
        message: notes || `Scheduling request for ${selectedType}`,
        startTime: `${selectedDate}T${selectedTime}:00`,
        calendarProvider: selectedType,
      });

      if (response || response.message) {
        setConfirmation(`Scheduled for ${selectedDate} at ${selectedTime} for a ${selectedType}. We have sent your confirmation to ${email}.`);
      } else {
        throw new Error(response.message || "We could not submit your scheduling request right now.");
      }
    } catch (err) {
      setConfirmation(err instanceof Error ? err.message : "We could not submit your scheduling request right now.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-[1.25rem] border border-amber-200/70 bg-amber-50/70 p-4 shadow-sm dark:border-amber-400/20 dark:bg-[#2b1f0d]/70">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
          <span className="mb-2 block">Select a date</span>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
          <span className="mb-2 block">Pick a time</span>
          <select
            value={selectedTime}
            onChange={(event) => setSelectedTime(event.target.value)}
            className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
          >
            {visibleSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
        <span className="mb-2 block">Support type</span>
        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
        >
          <option value="support call">Support call</option>
          <option value="workflow review">Workflow review</option>
          <option value="patient outreach setup">Patient outreach setup</option>
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
          <span className="mb-2 block">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
          <span className="mb-2 block">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
          />
        </label>
      </div>

      <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
        <span className="mb-2 block">Notes</span>
        <textarea
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Tell us which tasks you want to cover."
          className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
        />
      </label>

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02]"
      >
        Reserve session
      </button>

      {confirmation ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {confirmation}
        </p>
      ) : null}
    </form>
  );
}

function BillingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("invoice");
  const [amount, setAmount] = useState("");
  const [payerName, setPayerName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!payerName.trim() || !email.trim()) {
      setConfirmation("Please share your name and email so we can assist with your billing support needs.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitWithFeedback(getApiUrl("/api/Inquiries/billing"), {
        name: payerName,
        email,
        message: notes || `Billing support request for ${topic}`,
        accountRef: reference,
        amount,
        topic,
      });

      if (response || response.message) {
        setConfirmation("Thanks! Your billing support request has been received. We have sent a confirmation message to your email.");
      } else {
        throw new Error(response.message || "We could not submit your billing request right now.");
      }
    } catch (err) {
      setConfirmation(err instanceof Error ? err.message : "We could not submit your billing request right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5 rounded-[1.25rem] border border-amber-200/70 bg-amber-50/70 p-4 shadow-sm dark:border-amber-400/20 dark:bg-[#2b1f0d]/70">
      {!isOpen ? (
        <div className="space-y-3">
          <p className="text-sm leading-7 text-slate-600 dark:text-amber-100/85">
            Need help with an invoice, payment question, or insurance follow-up? Open the billing support assistant and we’ll guide the next step.
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02]"
          >
            Open billing support assistant
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {billingSupportTopics.map((item) => {
              const isActive = topic === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTopic(item.value)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-amber-500 bg-white text-amber-700 shadow-sm dark:bg-[#26190c] dark:text-amber-200"
                      : "border-amber-200/70 bg-white/70 text-slate-700 dark:border-amber-400/20 dark:bg-[#26190c]/70 dark:text-amber-100/90"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-slate-600 dark:text-amber-100/85">
            Choose the area you need help with and we’ll guide the next step.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
              <span className="mb-2 block">Estimated amount</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="150"
                className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
              />
            </label>

            <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
              <span className="mb-2 block">Invoice or reference</span>
              <input
                type="text"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="Invoice # or case note"
                className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
              <span className="mb-2 block">Your name</span>
              <input
                type="text"
                value={payerName}
                onChange={(event) => setPayerName(event.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
              />
            </label>

            <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
              <span className="mb-2 block">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
              />
            </label>
          </div>

          <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
            <span className="mb-2 block">What do you need help with?</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Share the invoice issue, payment concern, or insurance question you want help with."
              className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending…" : "Start billing support help"}
          </button>

          {confirmation ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              {confirmation}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get<Service[]>(getApiUrl("/api/services"));
        setServices(response.data);
      } catch (err) {
        console.error(err);
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <BackButton />
      <Reveal as="div" className="rounded-[1.75rem] border border-amber-200/70 bg-white/70 p-8 shadow-[0_24px_80px_-35px_rgba(245,158,11,0.35)] backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2d1f0d]/80 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-amber-50 sm:text-4xl">Services</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-amber-100/85">
          Our HIPAA-trained virtual assistants are ready to help with invoices, payments, and insurance follow-up so your team can stay focused on care.
        </p>
      </Reveal>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2b1f0d]/70"
            >
              <div className="h-4 w-28 animate-pulse rounded-full bg-amber-200/70 dark:bg-amber-500/20" />
              <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-amber-100/80 dark:bg-amber-500/10" />
              <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-amber-100/80 dark:bg-amber-500/10" />
              <div className="mt-2 h-3 w-3/4 animate-pulse rounded-full bg-amber-100/80 dark:bg-amber-500/10" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50/80 p-10 text-center shadow-sm">
          <p className="text-rose-700">{error}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.name} delay={index * 80}>
              {service.name === "Scheduling" ? (
                <div className="rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2b1f0d]/70">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">{service.name}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-amber-100/85">{service.description}</p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/15 to-lime-500/15 text-lg text-amber-700 dark:text-amber-200">
                      📅
                    </span>
                  </div>
                  <SchedulingWidget />
                </div>
              ) : service.name === "Billing Support" ? (
                <div className="rounded-[1.5rem] border border-amber-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-amber-400/20 dark:bg-[#2b1f0d]/70">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">{service.name}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-amber-100/85">
                        Get help with invoices, payments, and insurance questions without having to manage the workflow alone.
                      </p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/15 to-lime-500/15 text-lg text-amber-700 dark:text-amber-200">
                      💳
                    </span>
                  </div>
                  <BillingWidget />
                </div>
              ) : (
                <ServiceCard name={service.name} description={service.description} />
              )}
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
