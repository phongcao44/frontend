import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch parent categories with pagination and sorting
 * @param {number} page
 * @param {number} limit
 * @param {string} sortBy
 * @param {string} orderBy
 * @returns {Promise<any>}
 */
export const fetchParentCategories = async (
  page = 0,
  limit = 3,
  sortBy = "id",
  orderBy = "asc"
) => {
  try {
    const response = await axiosInstance.get("/categories/list/parent", {
      params: { page, limit, sortBy, orderBy },
    });
    return response.data;
  } catch (error) {
    console.error("fetchParentCategories error:", error);
    throw extractApiError(error);
  }
};

/**
 * Fetch subcategories by parent ID
 * @param {number|string} parentId
 * @returns {Promise<any>}
 */
export const fetchSubCategories = async (parentId) => {
  try {
    const response = await axiosInstance.get(`/categories/list/son/${parentId}`);
    return response.data;
  } catch (error) {
    console.error(`fetchSubCategories error (ParentID: ${parentId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Fetch parent line for a given subcategory ID
 * @param {number|string} sonId
 * @returns {Promise<any>}
 */
export const fetchParentLine = async (sonId) => {
  try {
    const response = await axiosInstance.get(`/list/son_of_parent/${sonId}`);
    return response.data;
  } catch (error) {
    console.error(`fetchParentLine error (SonID: ${sonId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Search categories by keyword
 * @param {string} keyword
 * @returns {Promise<any>}
 */
export const searchCategories = async (keyword) => {
  try {
    const response = await axiosInstance.get(`/categories/search`, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error(`searchCategories error (Keyword: ${keyword}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Add a new category (generic)
 * @param {Object} categoryData
 * @returns {Promise<any>}
 */
export const addCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(`/add`, categoryData);
    return response.data;
  } catch (error) {
    console.error("addCategory error:", error);
    throw extractApiError(error);
  }
};

/**
 * Add a new parent category
 * @param {Object} categoryData
 * @returns {Promise<any>}
 */
export const addParentCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(
      `/admin/categories/add/parent`,
      categoryData
    );
    return response.data;
  } catch (error) {
    console.error("addParentCategory error:", error);
    throw extractApiError(error);
  }
};

/**
 * Add a new subcategory under a parent
 * @param {number|string} parentId
 * @param {Object} categoryData
 * @returns {Promise<any>}
 */
export const addSubCategory = async (parentId, categoryData) => {
  try {
    const response = await axiosInstance.post(
      `/admin/categories/add/son/${parentId}`,
      categoryData
    );
    return response.data;
  } catch (error) {
    console.error(`addSubCategory error (ParentID: ${parentId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Update an existing parent category
 * @param {number|string} id
 * @param {Object} data
 * @returns {Promise<any>}
 */
export const updateParentCategory = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/admin/categories/edit/parent/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`updateParentCategory error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Update an existing subcategory
 * @param {number|string} id
 * @param {Object} data
 * @returns {Promise<any>}
 */
export const updateSubCategory = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/admin/categories/edit/son/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`updateSubCategory error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete a parent category by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteParentCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/categories/delete/parent/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`deleteParentCategory error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete a subcategory by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteSubCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/categories/delete/son/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`deleteSubCategory error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Fetch the full category tree
 * @returns {Promise<any>}
 */
export const fetchCategoryTree = async () => {
  try {
    const response = await axiosInstance.get(`/categories/tree`);
    return response.data;
  } catch (error) {
    console.error("fetchCategoryTree error:", error);
    throw extractApiError(error);
  }
};

/**
 * Fetch a flat category list
 * @returns {Promise<any>}
 */
export const fetchFlatCategoryList = async () => {
  try {
    const response = await axiosInstance.get(`/categories/flat`);
    return response.data;
  } catch (error) {
    console.error("fetchFlatCategoryList error:", error);
    throw extractApiError(error);
  }
};

/**
 * Standardize error output for all API calls
 * @param {any} error
 * @returns {Error}
 */
const extractApiError = (error) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Unknown error";
  return new Error(message);
};
