import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "/api";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;