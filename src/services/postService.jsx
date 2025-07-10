import axiosInstance from "../utils/axiosInstance";

export const fetchAdminPosts = async () => {
  const response = await axiosInstance.get("/admin/posts/list");
  return response.data;
};

export const addAdminPost = async (formData) => {
  const response = await axiosInstance.post("/admin/posts/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editAdminPost = async (id, formData) => {
  const response = await axiosInstance.put(
    `/admin/posts/edit/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteAdminPost = async (id) => {
  const response = await axiosInstance.delete(`/admin/posts/delete/${id}`);
  return response.data;
};

export const getAdminPostById = async (id) => {
  const response = await axiosInstance.get(`/admin/posts/${id}`);
  return response.data;
};

export const fetchPublicPosts = async () => {
  const response = await axiosInstance.get("/posts/list");
  return response.data;
};

export const getPublicPostById = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
};

export const getRelatedPosts = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}/related`);
  return response.data;
};
