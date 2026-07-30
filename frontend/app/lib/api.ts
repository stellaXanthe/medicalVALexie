import axios from "axios";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
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
