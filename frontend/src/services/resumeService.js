import axios from "axios";

const API_BASE = "/api/resume";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const resumeService = {
  getAll: async () => {
    const res = await axios.get(`${API_BASE}/`, getHeaders());
    return res.data;
  },
  getById: async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`, getHeaders());
    return res.data;
  },
  create: async (data) => {
    const res = await axios.post(`${API_BASE}/`, data, getHeaders());
    return res.data;
  },
  update: async (id, data) => {
    const res = await axios.put(`${API_BASE}/${id}`, data, getHeaders());
    return res.data;
  },
  delete: async (id) => {
    const res = await axios.delete(`${API_BASE}/${id}`, getHeaders());
    return res.data;
  },
};