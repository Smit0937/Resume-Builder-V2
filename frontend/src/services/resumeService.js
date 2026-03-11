import api from "./api";

export const resumeService = {
  getAll: async () => {
    const res = await api.get("/resume/");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/resume/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/resume/", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/resume/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/resume/${id}`);
    return res.data;
  },
};