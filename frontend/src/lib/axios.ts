import axios from "axios";

// const API = import.meta.env.VITE_API_URL;
const API =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL
    : "/api";

export const api = axios.create({
  baseURL: API,
  withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor to handle FormData properly
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // For FormData, delete all Content-Type headers
    // to allow browser to set multipart/form-data with correct boundary
    delete config.headers["Content-Type"];

    if (config.headers.common) {
      delete config.headers.common["Content-Type"];
    }
  } else {
    // For non-FormData requests, explicitly set JSON
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});
