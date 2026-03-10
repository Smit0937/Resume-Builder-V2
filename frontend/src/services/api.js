import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-resume-builder-bzgs.onrender.com/api",
  withCredentials: true,
});

export default api;