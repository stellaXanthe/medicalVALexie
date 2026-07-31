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

// Example API functions - Add your own here
export const api = {
  // Inquiries
  getInquiries: async () => {
    const response = await axios.get(getApiUrl("/api/Inquiries"));
    return response.data;
  },

  createInquiry: async (data: any) => {
    const response = await axios.post(getApiUrl("/api/Inquiries"), data);
    return response.data;
  },

  // Add more endpoints as needed
  getServices: async () => {
    const response = await axios.get(getApiUrl("/api/Services"));
    return response.data;
  },

  // Langflow
  sendToLangflow: async (data: any) => {
    const response = await axios.post(getApiUrl("/api/Langflow"), data);
    return response.data;
  },
};

export default api;