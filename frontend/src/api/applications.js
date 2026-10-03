import axiosClient from "./axiosClient";

export const toggleSaveJob = (jobId) => axiosClient.post(`/applications/saved/${jobId}/toggle/`);

export const markApplied = (jobId) => axiosClient.post(`/applications/${jobId}/apply/`);

export const getSavedJobs = () => axiosClient.get("/applications/saved/");

export const getApplications = () => axiosClient.get("/applications/");