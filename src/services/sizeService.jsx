import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch all sizes
 * @returns {Promise<any>}
 */
export const fetchAllSizes = async () => {
  try {
    const response = await axiosInstance.get("/list");
    return response.data;
  } catch (error) {
    console.error("fetchAllSizes error:", error);
    throw extractApiError(error);
  }
};

/**
 * Add a new size
 * @param {Object} sizeData
 * @returns {Promise<any>}
 */
export const addSize = async (sizeData) => {
  try {
    const response = await axiosInstance.post("/admin/size/add", sizeData);
    return response.data;
  } catch (error) {
    console.error("addSize error:", error);
    throw extractApiError(error);
  }
};

/**
 * Update an existing size by ID
 * @param {number|string} sizeId
 * @param {Object} updatedData
 * @returns {Promise<any>}
 */
export const updateSize = async (sizeId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/size/edit/${sizeId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(`updateSize error (ID: ${sizeId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete a size by ID
 * @param {number|string} sizeId
 * @returns {Promise<any>}
 */
export const deleteSize = async (sizeId) => {
  try {
    const response = await axiosInstance.delete(`/size/delete/${sizeId}`);
    return response.data;
  } catch (error) {
    console.error(`deleteSize error (ID: ${sizeId}):`, error);
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
