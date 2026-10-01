import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7090/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("Authorization header exists:", !!config.headers.Authorization);

  return config;
});

export default api;