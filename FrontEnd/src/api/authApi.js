import axiosInstance from "./axiosInstance";

export const loginUser = (data) => axiosInstance.post("/auth/login", data);

export const registerUser = (data) => axiosInstance.post("/auth/register", data);

export const verifyOtp = (data) => axiosInstance.post("/auth/verify-otp", data);

export const resendOtp = (data) => axiosInstance.post("/auth/resend-otp", data);

export const logoutUser = () => axiosInstance.post("/auth/logout");

export const getCurrentUser = () => axiosInstance.get("/auth/profile");
