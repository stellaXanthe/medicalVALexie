"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ServiceCard } from "../components/ServiceCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5235";

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
        const response = await axios.get<Service[]>(`${API_BASE}/api/services`);
        setServices(response.data);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Services</h1>
        <p className="mt-4 text-slate-600">
          Our HIPAA-trained virtual assistants are ready to support your workflow in these areas.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">Loading services…</p>
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
