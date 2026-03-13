import axios from "axios";

const PROD_API_URL = "https://resume-builder-v2-production-7b7d.up.railway.app/api";
const rawEnvApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const envIsRelative = rawEnvApiUrl.startsWith("/");

// In production, force an absolute backend URL if env uses a relative path.
// This avoids hard-to-debug 404s when host rewrites are misconfigured.
const resolvedApiUrl = rawEnvApiUrl
  ? (import.meta.env.PROD && envIsRelative ? PROD_API_URL : rawEnvApiUrl)
  : (import.meta.env.PROD ? PROD_API_URL : "/api");

export const API_URL = resolvedApiUrl.replace(/\/+$/, "");

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;