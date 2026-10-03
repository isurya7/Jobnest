import axiosClient from "./axiosClient";

export const getJobs = (params = {}) =>
  axiosClient.get("/jobs/", { params });

export const getJobDetail = (id) => axiosClient.get(`/jobs/${id}/`);