import API from "./api";



export const registerUser = async (data) => {
  return await API.post("/auth/register", data);
};



export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

