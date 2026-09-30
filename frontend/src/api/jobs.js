import axiosClient from "./axiosClient";

export const getJobs = () => axiosClient.get("/jobs/");

export const getJobDetail = (id) => axiosClient.get(`/jobs/${id}/`);