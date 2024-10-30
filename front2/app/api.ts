import store from "@/store";
import { selectUser } from "@/store/authSlice";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

// Set up an interceptor on the `api` instance
api.interceptors.request.use(
  (config) => {
    // Access the current Redux state
    const state = store.getState();
    const auth = selectUser(state);

    // Attach token if it exists
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
