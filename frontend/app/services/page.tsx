"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BackButton } from "../components/BackButton";
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
      <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-10 shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-amber-50">Services</h1>
        <p className="mt-4 text-slate-600 dark:text-amber-100/85">
          Our HIPAA-trained virtual assistants are ready to support your workflow in these areas.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-10 text-center shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
          <p className="text-slate-600 dark:text-amber-100/85">Loading services…</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-50 p-10 text-center shadow-sm">
          <p className="text-rose-700">{error}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.name} name={service.name} description={service.description} />
          ))}
        </div>
      )}
    </section>
  );
}
