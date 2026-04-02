import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pulse_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const extractErrorMessage = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors[0].message;
  }

  if (error.request && !error.response) {
    return "Cannot reach the backend API. Check your deployed backend URL.";
  }

  return error.response?.data?.message || "Something went wrong. Please try again.";
};

export default api;
