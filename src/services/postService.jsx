import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch all admin posts
 * @returns {Promise<any>}
 */
export const fetchAdminPosts = async () => {
  try {
    const response = await axiosInstance.get("/admin/posts/list");
    return response.data;
  } catch (error) {
    console.error("fetchAdminPosts error:", error);
    throw extractApiError(error);
  }
};

/**
 * Add a new admin post (multipart/form-data)
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export const addAdminPost = async (formData) => {
  try {
    const response = await axiosInstance.post("/admin/posts/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("addAdminPost error:", error);
    throw extractApiError(error);
  }
};

/**
 * Edit an existing admin post by ID (multipart/form-data)
 * @param {number|string} id
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export const editAdminPost = async (id, formData) => {
  try {
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
  } catch (error) {
    console.error(`editAdminPost error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete an admin post by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteAdminPost = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/posts/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`deleteAdminPost error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Get admin post details by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const getAdminPostById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`getAdminPostById error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Fetch all public posts
 * @returns {Promise<any>}
 */
export const fetchPublicPosts = async () => {
  try {
    const response = await axiosInstance.get("/posts/list");
    return response.data;
  } catch (error) {
    console.error("fetchPublicPosts error:", error);
    throw extractApiError(error);
  }
};

/**
 * Get public post details by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const getPublicPostById = async (id) => {
  try {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`getPublicPostById error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Get related posts for a given post ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const getRelatedPosts = async (id) => {
  try {
    const response = await axiosInstance.get(`/posts/${id}/related`);
    return response.data;
  } catch (error) {
    console.error(`getRelatedPosts error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Extract and format API error
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
