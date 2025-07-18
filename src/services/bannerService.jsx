import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch all banners
 * @returns {Promise<any>} Raw data from backend
 */
export const fetchBanners = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("fetchBanners error:", error);
    throw extractApiError(error);
  }
};

/**
 * Add a new banner
 * @param {FormData} formData Banner data (multipart/form-data)
 * @returns {Promise<any>} Raw data from backend
 */
export const addBanner = async (formData) => {
  try {
    const response = await axiosInstance.post("/admin/banner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("addBanner error:", error);
    throw extractApiError(error);
  }
};

/**
 * Update an existing banner by ID
 * @param {number|string} id Banner ID
 * @param {FormData} formData Banner data (multipart/form-data)
 * @returns {Promise<any>} Raw data from backend
 */
export const updateBanner = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/admin/banner/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`updateBanner error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete a banner by ID
 * @param {number|string} id Banner ID
 * @returns {Promise<any>} Raw data from backend
 */
export const deleteBanner = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/banner/${id}`);
    return response.data;
  } catch (error) {
    console.error(`deleteBanner error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Extract meaningful error message for consistent error handling
 * @param {any} error Original Axios error
 * @returns {Error} Standardized Error object
 */
const extractApiError = (error) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Unknown error";
  return new Error(message);
};
