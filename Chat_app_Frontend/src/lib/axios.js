import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE == "development" ? "http://localhost:3002/api/v0" : "/api/v0",
  withCredentials: true,
});