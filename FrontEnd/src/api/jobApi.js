import axiosInstance from "./axiosInstance";

export const createJob = (jobData) => axiosInstance.post("/jobs", jobData);

export const getJobs = () => axiosInstance.get("/jobs");

export const getMyPostedJobs = () => axiosInstance.get("/jobs/my-jobs");

export const updateJob = (id, data) => axiosInstance.put(`/jobs/${id}`, data);

export const getJobById = (id) => axiosInstance.get(`/jobs/${id}`);

export const deleteJob = (id) => axiosInstance.delete(`/jobs/${id}`);
