import axiosClient from "./axiosClient";

export const getProfile = () => axiosClient.get("/profile/");

export const updateProfile = (data) => axiosClient.patch("/profile/", data);

export const addSkill = (data) => axiosClient.post("/profile/skills/", data);

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return axiosClient.post("/profile/resume/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getSkills = () => axiosClient.get("/profile/skills/");

export const deleteSkill = (skillId) =>
  axiosClient.delete(`/profile/skills/${skillId}/`);
