import axios from "axios";

// const API = import.meta.env.VITE_API_URL;
const API = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/api";

export const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});
 