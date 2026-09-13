import axios from "axios";

const API_BASE_URL = "http://localhost:7000/api"; // matches backend .env PORT=7000

// Server root (no /api suffix) — used to build links to uploaded files,
// e.g. `${SERVER_BASE_URL}/uploads/resumes/xyz.pdf`
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Needed so the browser sends/receives the httpOnly refreshToken cookie.
  withCredentials: true,
});

// The access token lives in memory + localStorage (so a refresh doesn't log
// the user out); the refresh token itself is an httpOnly cookie the browser
// manages automatically and this code never touches directly.
let accessToken = localStorage.getItem("accessToken") || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
};

export const getAccessToken = () => accessToken;

axiosInstance.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Queue concurrent requests that 401 while a refresh is already in flight,
// so we only ever call /auth/refresh-token once at a time.
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

const hardLogout = () => {
  setAccessToken(null);
  localStorage.removeItem("user");
  window.location.href = "/login";
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config: originalRequest } = error;

    if (!response || response.status !== 401 || originalRequest._retry) {
      // Any other 401 (bad credentials, refresh call itself failing, etc.)
      if (response?.status === 401 && originalRequest?.url?.includes("/auth/refresh-token")) {
        hardLogout();
      }
      return Promise.reject(error);
    }

    // Don't try to "refresh" the login/register/verify-otp calls themselves.
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/verify-otp")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Wait for the in-flight refresh to finish, then retry with the new token.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      setAccessToken(data.accessToken);
      flushQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      hardLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
