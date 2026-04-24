import axios from "axios";

const baseURL =
  typeof window === "undefined"
    ? `${process.env.API_BASE ?? "https://ecommerce.routemisr.com"}/api/v1`
    : "/api/v1";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.token = token;
  }
  return config;
});

export default api;
