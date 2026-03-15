import api from "./api";

export const registerUser = async (data) => {
  console.log('🔍 Registering user...');
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (credentials) => {
  console.log('🔍 Logging in:', credentials.email);
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const getCurrentUser = async () => {
  console.log('🔍 Getting current user...');
  const res = await api.get("/auth/me");
  console.log('✅ Current user data:', res.data);
  return res.data;
};

export const logoutUser = async () => {
  console.log('🔍 Logging out...');
  const res = await api.post("/auth/logout", {});
  return res.data;
};