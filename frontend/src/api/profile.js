import axiosClient from "./axiosClient";

export const getProfile = () => axiosClient.get("/profile/");

export const updateProfile = (data) => axiosClient.patch("/profile/", data);

export const addSkill = (data) => axiosClient.post("/profile/skills/", data);