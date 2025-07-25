// services/blogService.js
import axiosInstance from "../utils/axiosInstance";

// Lấy tất cả bài viết
export const getAllBlogs = async () => {
  try {
    const res = await axiosInstance.get("/posts/list");
    return res.data;
  } catch (err) {
    console.error("❌ Get All Blogs failed:", err);
    throw err;
  }
};

// Lấy chi tiết bài viết theo ID
export const getBlogById = async (id) => {
  try {
    const res = await axiosInstance.get(`/posts/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Get Blog By ID failed:", err);
    throw err;
  }
};
