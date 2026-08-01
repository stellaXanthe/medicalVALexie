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
          Our HIPAA-trained virtual assistants are ready to support your workflow in these areas.
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
              <ServiceCard name={service.name} description={service.description} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
