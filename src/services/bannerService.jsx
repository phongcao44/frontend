import axiosInstance from "../utils/axiosInstance";

// Lấy tất cả banners
export const fetchBanners = async () => {
  const response = await axiosInstance.get("/admin/banner");
  return response.data;
};

// Thêm mới banner (FormData)
export const addBanner = async (formData) => {
  const response = await axiosInstance.post("/admin/banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật banner (FormData)
export const updateBanner = async (id, formData) => {
  const response = await axiosInstance.put(`/admin/banner/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


// Xóa banner
export const deleteBanner = async (id) => {
  const response = await axiosInstance.delete(`/admin/banner/${id}`);
  return response.data;
};
