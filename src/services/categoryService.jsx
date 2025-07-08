import axiosInstance from "../utils/axiosInstance";

export const fetchParentCategories = async (
  page = 0,
  limit = 3,
  sortBy = "id",
  orderBy = "asc"
) => {
  const response = await axiosInstance.get("/categories/list/parent", {
    params: { page, limit, sortBy, orderBy },
  });
  return response.data;
};

export const fetchSubCategories = async (parentId) => {
  const response = await axiosInstance.get(`/categories/list/son/${parentId}`);
  return response.data;
};

export const fetchParentLine = async (sonId) => {
  const response = await axiosInstance.get(`/list/son_of_parent/${sonId}`);
  return response.data;
};

export const searchCategories = async (keyword) => {
  const response = await axiosInstance.get(`/categories/search`, {
    params: { keyword },
  });
  return response.data;
};

export const addCategory = async (categoryData) => {
  const response = await axiosInstance.post(`/add`, categoryData);
  return response.data;
};

export const addParentCategory = async (categoryData) => {
  const response = await axiosInstance.post(
    `/admin/categories/add/parent`,
    categoryData
  );
  return response.data;
};

export const addSubCategory = async (parentId, categoryData) => {
  const response = await axiosInstance.post(
    `/admin/categories/add/son/${parentId}`,
    categoryData
  );
  return response.data;
};

export const updateParentCategory = async (id, data) => {
  const response = await axiosInstance.put(
    `/admin/categories/edit/parent/${id}`,
    data
  );
  return response.data;
};

export const updateSubCategory = async (id, data) => {
  const response = await axiosInstance.put(
    `/admin/categories/edit/son/${id}`,
    data
  );
  return response.data;
};

export const deleteParentCategory = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/categories/delete/parent/${id}`
  );
  return response.data;
};

export const deleteSubCategory = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/categories/delete/son/${id}`
  );
  return response.data;
};

export const fetchCategoryTree = async () => {
  const response = await axiosInstance.get(`/categories/tree`);
  return response.data;
};

export const fetchFlatCategoryList = async () => {
  const response = await axiosInstance.get(`/categories/flat`);
  return response.data;
};
