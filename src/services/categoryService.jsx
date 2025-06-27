import axiosInstance from "../utils/axiosInstance";

// Lấy danh sách danh mục cha (phân trang, sắp xếp)
export const fetchParentCategories = async (
  page = 0,
  limit = 100,
  sortBy = "id",
  orderBy = "asc"
) => {
  const response = await axiosInstance.get("/categories/list/parent", {
    params: { page, limit, sortBy, orderBy },
  });
  return response.data;
};

// Lấy danh sách danh mục con theo parentId
export const fetchSubCategories = async (parentId) => {
  const response = await axiosInstance.get(`/categories/list/son/${parentId}`);
  return response.data;
};

// Tìm kiếm danh mục theo keyword
export const searchCategories = async (keyword) => {
  const response = await axiosInstance.get(`/categories/search`, {
    params: { keyword },
  });
  return response.data;
};

// Thêm danh mục mới (dùng chung cho cả cha và con)
export const addCategory = async (categoryData) => {
  const response = await axiosInstance.post(`/categories/add`, categoryData);
  return response.data;
};

// Thêm danh mục cha
export const addParentCategory = async (categoryData) => {
  const response = await axiosInstance.post(
    `/categories/add/parent`,
    categoryData
  );
  return response.data;
};

// Thêm danh mục con theo parentId
export const addSubCategory = async (parentId, categoryData) => {
  const response = await axiosInstance.post(
    `/categories/add/son/${parentId}`,
    categoryData
  );
  return response.data;
};

// Sửa danh mục cha
export const updateParentCategory = async (id, data) => {
  const response = await axiosInstance.put(
    `/categories/edit/parent/${id}`,
    data
  );
  return response.data;
};

// Sửa danh mục con
export const updateSubCategory = async (id, data) => {
  const response = await axiosInstance.put(`/categories/edit/son/${id}`, data);
  return response.data;
};

// Xóa danh mục cha
export const deleteParentCategory = async (id) => {
  const response = await axiosInstance.delete(
    `/categories/delete/parent/${id}`
  );
  return response.data;
};

// Xóa danh mục con
export const deleteSubCategory = async (id) => {
  const response = await axiosInstance.delete(`/categories/delete/son/${id}`);
  return response.data;
};
