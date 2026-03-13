import axios from "axios";

// For production deployment on Vercel, use the Railway backend URL
// For local development, use localhost
const RAILWAY_API_URL = "https://resume-builder-v2-production-7b7d.up.railway.app/api";
const LOCAL_API_URL = "http://localhost:5000";

export const API_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? RAILWAY_API_URL : LOCAL_API_URL);

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