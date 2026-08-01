"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BackButton } from "../components/BackButton";
import { Reveal } from "../components/Reveal";
import { ServiceCard } from "../components/ServiceCard";
import { getApiErrorMessage, getApiUrl } from "../lib/api";

type Service = {
  name: string;
  description: string;
};

const scheduleSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const billingMethods = [
  { value: "debit-credit", label: "Debit / Credit Card" },
  { value: "gcash", label: "GCash" },
  { value: "maya", label: "Maya" },
  { value: "digital-bank", label: "Digital Bank Transfer" },
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "paypal", label: "PayPal" },
  { value: "payoneer", label: "Payoneer" },
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const selectedValue = new Date(`${selectedDate}T${selectedTime}:00`);
    const now = new Date();

    if (selectedValue <= now) {
      setConfirmation("Please choose a future time for your session.");
      return;
    }

    setConfirmation(`Scheduled for ${selectedDate} at ${selectedTime} for a ${selectedType}. ${notes ? `Notes: ${notes}` : ""}`.trim());
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
  const [amount, setAmount] = useState("150");
  const [method, setMethod] = useState(billingMethods[0].value);
  const [payerName, setPayerName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    if (!payerName.trim() || !email.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setConfirmation("Please complete your name, email, and amount before submitting.");
      return;
    }

    if (!reference.trim()) {
      setConfirmation("Please add a payment reference or card/e-wallet identifier.");
      return;
    }

    const methodLabel = billingMethods.find((item) => item.value === method)?.label ?? method;
    setConfirmation(`Billing request prepared for ${parsedAmount.toFixed(2)} using ${methodLabel}. We’ll review it and confirm the secure payment flow shortly.`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-[1.25rem] border border-amber-200/70 bg-amber-50/70 p-4 shadow-sm dark:border-amber-400/20 dark:bg-[#2b1f0d]/70">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
          <span className="mb-2 block">Amount</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-amber-100/90">
          <span className="mb-2 block">Payment method</span>
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
          >
            {billingMethods.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
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
        <span className="mb-2 block">Payment reference</span>
        <input
          type="text"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="Card last 4 digits, wallet ID, or billing note"
          className="w-full rounded-2xl border border-amber-200/70 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-amber-400/20 dark:bg-[#26190c]/80 dark:text-amber-50"
        />
      </label>

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02]"
      >
        Submit billing request
      </button>

      {confirmation ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {confirmation}
        </p>
      ) : null}
    </form>
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
          Our HIPAA-trained virtual assistants are ready to support your workflow with practical scheduling and billing tools.
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
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-amber-100/85">{service.description}</p>
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
