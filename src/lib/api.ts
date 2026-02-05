import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("token");
    if (token) {
      const cleanToken = token.trim().replace(/^"|"$/g, "");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
  }
  return config;
});
