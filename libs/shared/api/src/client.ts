import axios from "axios";
import { useAuthStore } from "@takathon/shared/utils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  // Send the httpOnly auth cookies on every request automatically
  withCredentials: true,
});

// No request interceptor needed — the browser attaches the accessToken cookie
// automatically thanks to withCredentials: true. Tokens are never stored in JS.

let isRefreshing = false;
let pendingRequests: Array<(ok: boolean) => void> = [];

function subscribeTokenRefresh(cb: (ok: boolean) => void) {
  pendingRequests.push(cb);
}

function onRefreshed(ok: boolean) {
  pendingRequests.forEach((cb) => cb(ok));
  pendingRequests = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Only attempt a refresh once per failed request, and never on the
    // refresh endpoint itself (avoid infinite loops).
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        // Queue the request until the in-flight refresh resolves
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((ok) => {
            if (ok) resolve(api(originalRequest));
            else reject(error);
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The refresh endpoint reads the refreshToken cookie and sets a new
        // accessToken cookie — no token values travel through JS at all.
        await api.post("/api/v1/auth/refresh");
        onRefreshed(true);
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        onRefreshed(false);
        // Redirect to landing page login after session expiry
        if (typeof window !== "undefined") {
          const landingUrl =
            process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";
          window.location.href = `${landingUrl}/login`;
        }
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

