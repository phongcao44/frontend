import axiosInstance from "../utils/axiosInstance";

export const fetchBanners = async () => {
  const response = await axiosInstance.get("/admin/banner");
  return response.data;
};

export const addBanner = async (formData) => {
  const response = await axiosInstance.post("/admin/banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBanner = async (id, formData) => {
  const response = await axiosInstance.put(`/admin/banner/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await axiosInstance.delete(`/admin/banner/${id}`);
  return response.data;
};
