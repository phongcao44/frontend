import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch all colors
 * @returns {Promise<any>}
 */
export const fetchColors = async () => {
  try {
    const response = await axiosInstance.get("/color/list");
    return response.data;
  } catch (error) {
    console.error("fetchColors error:", error);
    throw extractApiError(error);
  }
};

/**
 * Add a new color
 * @param {Object} colorData
 * @returns {Promise<any>}
 */
export const addColor = async (colorData) => {
  try {
    const response = await axiosInstance.post("/admin/color/add", colorData);
    return response.data;
  } catch (error) {
    console.error("addColor error:", error);
    throw extractApiError(error);
  }
};

/**
 * Auto add a color (uses 3rd party API)
 * @param {Object} colorData
 * @returns {Promise<any>}
 */
export const autoAddColor = async (colorData) => {
  try {
    const response = await axiosInstance.post("/color/autoadd", colorData);
    return response.data;
  } catch (error) {
    console.error("autoAddColor error:", error);
    throw extractApiError(error);
  }
};

/**
 * Update a color by ID
 * @param {number|string} id
 * @param {Object} colorData
 * @returns {Promise<any>}
 */
export const updateColor = async (id, colorData) => {
  try {
    const response = await axiosInstance.put(`/color/edit/${id}`, colorData);
    return response.data;
  } catch (error) {
    console.error(`updateColor error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete a color by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteColor = async (id) => {
  try {
    const response = await axiosInstance.delete(`/color/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`deleteColor error (ID: ${id}):`, error);
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
