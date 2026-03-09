"use client";

import axios from "axios";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5235";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("pending");
    setError(null);

    try {
      await axios.post(`${API_BASE}/api/inquiries`, {
        name,
        email,
        message,
      });

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : "Something went wrong."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <button
        type="submit"
        disabled={status === "pending"}
        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {status === "pending" ? "Sending…" : "Send Message"}
      </button>

      {status === "success" && (
        <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
          Message sent! We’ll be in touch shortly.
        </p>
      )}

      {status === "error" && (
        <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          {error ?? "Something went wrong."}
        </p>
      )}

      <p className="text-xs text-slate-500">
        We never share your information. Messages are handled by our HIPAA-trained support team.
      </p>
    </form>
  );
}
