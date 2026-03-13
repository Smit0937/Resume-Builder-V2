import axios from "axios";

// Simple and reliable: detect if we're on localhost
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
);

// Set API base URL
const API_BASE = isLocalhost 
  ? "http://localhost:5000/api"
  : "https://resume-builder-v2-production-7b7d.up.railway.app/api";

export const API_URL = API_BASE;

console.log("🚀 Running on:", window.location.hostname);
console.log("🔌 API Base URL:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,  // This is the key - baseURL ALREADY includes /api
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;