import axios from "axios";
import { useAuthStore } from "@shared/utils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState() as any;
  if (accessToken) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token?: string) => void> = [];

function subscribeTokenRefresh(cb: (token?: string) => void) {
  pendingRequests.push(cb);
}

function onRefreshed(token?: string) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (token) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshResponse = await api.post("/api/v1/auth/refresh");
        const newToken = refreshResponse.data?.data?.accessToken;
        if (newToken) {
          useAuthStore.getState().setAccessToken(newToken);
          onRefreshed(newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        useAuthStore.getState().logout();
        onRefreshed();
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

