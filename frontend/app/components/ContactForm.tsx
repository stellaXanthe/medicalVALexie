"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import api from "@/lib/api";   // ← Updated import

const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type InquiryForm = z.infer<typeof inquirySchema>;

export function ContactForm() {
  const [formValues, setFormValues] = useState<InquiryForm>({
    name: "",
    email: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof InquiryForm, string>>>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Automatically clear toast after a few seconds
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("pending");
    setToast(null);

    const result = inquirySchema.safeParse(formValues);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof InquiryForm, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          const key = issue.path[0] as keyof InquiryForm;
          fieldErrors[key] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      setStatus("error");
      return;
    }

    setFormErrors({});

    try {
      await api.createInquiry(result.data);   // ← Updated to use api service

      setStatus("success");
      setFormValues({ name: "", email: "", message: "" });
      setToast({ type: "success", message: "Message sent! We'll be in touch shortly." });
    } catch (err) {
      setStatus("error");
      const message = api.getApiErrorMessage(err);
      console.error(err);
      setToast({ type: "error", message });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-white via-amber-50/70 to-lime-50/70 p-6 shadow-sm dark:border-amber-400/30 dark:from-[#34240d] dark:via-[#24170b] dark:to-[#1d1408]">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-amber-100/90">Name</label>
          <input
            value={formValues.name}
            onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
          />
          {formErrors.name && <p className="mt-1 text-xs text-rose-600">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-amber-100/90">Email</label>
          <input
            value={formValues.email}
            onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
          />
          {formErrors.email && <p className="mt-1 text-xs text-rose-600">{formErrors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-amber-100/90">Message</label>
          <textarea
            value={formValues.message}
            onChange={(e) => setFormValues((prev) => ({ ...prev, message: e.target.value }))}
            required
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
          />
          {formErrors.message && <p className="mt-1 text-xs text-rose-600">{formErrors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={status === "pending"}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-lime-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_-18px_rgba(249,115,22,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:translate-y-0 disabled:brightness-100 disabled:bg-slate-300"
        >
          {status === "pending" ? "Sending…" : "Send Message"}
        </button>

        <p className="text-xs text-slate-500 dark:text-amber-100/70">
          We never share your information. Messages are handled by our HIPAA-trained support team.
        </p>
      </form>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-xl px-5 py-4 shadow-lg transition ${
            toast.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <p className="text-sm font-medium">{toast.type === "success" ? "Success" : "Error"}</p>
          <p className="mt-1 text-sm">{toast.message}</p>
        </div>
      )}
    </>
  );
}