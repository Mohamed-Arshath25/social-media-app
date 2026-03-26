import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api"
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
    return "Cannot reach the backend API. Make sure the backend is running on http://127.0.0.1:5000.";
  }

  return error.response?.data?.message || "Something went wrong. Please try again.";
};

export default api;
