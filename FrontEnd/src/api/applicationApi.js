import axiosInstance from "./axiosInstance";

export const applyToJob = (jobId, data) =>
  axiosInstance.post(`/applications/${jobId}`, data);

export const getMyApplications = () =>
  axiosInstance.get("/applications/my-applications");

export const getApplicantsForJob = (jobId) =>
  axiosInstance.get(`/applications/job/${jobId}`);

export const updateApplicationStatus = (applicationId, status) =>
  axiosInstance.patch(`/applications/${applicationId}/status`, { status });
