import axiosInstance from "./axiosInstance";

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return axiosInstance.post("/users/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadIdentity = (aadharFile, panFile) => {
  const formData = new FormData();
  formData.append("aadhar", aadharFile);
  formData.append("pan", panFile);
  return axiosInstance.post("/users/upload-identity", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
