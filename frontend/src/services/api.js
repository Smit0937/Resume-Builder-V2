import axios from "axios";

// Determine environment by checking hostname
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
const RAILWAY_URL = "https://resume-builder-v2-production-7b7d.up.railway.app";
const LOCAL_URL = "http://localhost:5000";

export const API_URL = isDevelopment ? LOCAL_URL : `${RAILWAY_URL}/api`;

console.log("🔌 Hostname:", hostname, "isDev:", isDevelopment);
console.log("🔌 API_URL:", API_URL);

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;