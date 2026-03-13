import axios from "axios";

// Determine the API URL based on environment
const isDevelopment = !import.meta.env.PROD;
const RAILWAY_URL = "https://resume-builder-v2-production-7b7d.up.railway.app";

export const API_URL = isDevelopment 
  ? "http://localhost:5000" 
  : `${RAILWAY_URL}/api`;

console.log("🔌 API_URL:", API_URL, "isDev:", isDevelopment);

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;