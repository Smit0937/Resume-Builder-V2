import axios from "axios";

// Use relative paths /api for all requests
// On localhost, this goes to the local backend (http://localhost:5000/api)
// On Vercel, this is rewritten by vercel.json to Railway backend
export const API_URL = "/api";

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