import axios from "axios";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export function getApiErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK" || !err.response) {
      return "We couldn't reach our services right now. Please try again in a moment.";
    }
    return err.response?.data?.message ?? err.message;
  }
  return "Something went wrong.";
}

// Google Apps Script Fallback for Contact Form
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyt0cI0IsBsLvtOh8Rq7Gb_MAGn5_mAlljvNCFOUoCKzghq7M89QBzgY8vsenhHp-KE/exec";

export const sendToGoogleScript = async (data: any) => {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Failed to send message");
  }

  return result;
};

export const api = {
  // Existing functions
  getInquiries: async () => {
    const response = await axios.get(getApiUrl("/api/Inquiries"));
    return response.data;
  },

  createInquiry: async (data: any) => {
    const response = await axios.post(getApiUrl("/api/Inquiries"), data);
    return response.data;
  },

  getServices: async () => {
    const response = await axios.get(getApiUrl("/api/Services"));
    return response.data;
  },

  sendToLangflow: async (data: any) => {
    const response = await axios.post(getApiUrl("/api/Langflow"), data);
    return response.data;
  },

  // Google Script Contact Form (used by ContactForm.tsx)
  sendContactForm: async (data: any) => {
    return await sendToGoogleScript(data);
  },
};

export default api;