import axios from "axios";

// For LOCALHOST: use http://localhost:5000/api
export const API_URL = "http://localhost:5000/api";

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

export default api;