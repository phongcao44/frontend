import axiosInstance from "../utils/axiosInstance";

// Lấy tất cả thông số sản phẩm
export const fetchProductSpecifications = async () => {
  try {
    const response = await axiosInstance.get("/admin/product-specifications/list");
    return response.data;
  } catch (error) {
    console.error("fetchProductSpecifications error:", error);
    throw error.response?.data || error.message;
  }
};

// Lấy thông số theo productId (cho admin)
export const fetchProductSpecificationById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/admin/product-specifications/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("fetchProductSpecificationById error:", error);
    throw error.response?.data || error.message;
  }
};

// Lấy thông số theo productId (cho user)
export const fetchProductSpecificationByIdForUser = async (productId) => {
  try {
    const response = await axiosInstance.get(`/product-specifications/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("fetchProductSpecificationByIdForUser error:", error);
    throw error.response?.data || error.message;
  }
};

// Tạo mới thông số sản phẩm
export const createProductSpecification = async (requestDTO) => {
  try {
    const response = await axiosInstance.post("/admin/product-specifications/add", requestDTO);
    return response.data;
  } catch (error) {
    console.error("createProductSpecification error:", error);
    throw error.response?.data || error.message;
  }
};

// Cập nhật thông số sản phẩm
export const updateProductSpecification = async (id, requestDTO) => {
  try {
    const response = await axiosInstance.put(`/admin/product-specifications/update/${id}`, requestDTO);
    return response.data;
  } catch (error) {
    console.error("updateProductSpecification error:", error);
    throw error.response?.data || error.message;
  }
};

// Xoá thông số sản phẩm
export const deleteProductSpecification = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/product-specifications/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteProductSpecification error:", error);
    throw error.response?.data || error.message;
  }
};