import axios from "axios";

const PROD_API_URL = "https://resume-builder-v2-production-7b7d.up.railway.app/api";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PROD_API_URL : "/api");

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;