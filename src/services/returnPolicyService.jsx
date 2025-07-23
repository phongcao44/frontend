import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch all return policies
 * @returns {Promise<any>} Raw data from backend
 */
export const fetchReturnPolicies = async () => {
  try {
    const response = await axiosInstance.get("/return-policy/list");
    return response.data;
  } catch (error) {
    console.error("fetchReturnPolicies error:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Fetch return policy by ID
 * @param {number} id
 * @returns {Promise<any>}
 */
export const fetchReturnPolicyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/return-policy/${id}`);
    return response.data;
  } catch (error) {
    console.error("fetchReturnPolicyById error:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Create new return policy
 * @param {object} requestDTO
 * @returns {Promise<any>}
 */
export const createReturnPolicy = async (requestDTO) => {
  try {
    const response = await axiosInstance.post(
      "/admin/return-policy/add",
      requestDTO
    );
    return response.data;
  } catch (error) {
    console.error("createReturnPolicy error:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Update return policy
 * @param {number} id
 * @param {object} requestDTO
 * @returns {Promise<any>}
 */
export const updateReturnPolicy = async (id, requestDTO) => {
  try {
    const response = await axiosInstance.put(
      `/admin/return-policy/update/${id}`,
      requestDTO
    );
    return response.data;
  } catch (error) {
    console.error("updateReturnPolicy error:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Delete return policy
 * @param {number} id
 * @returns {Promise<any>}
 */
export const deleteReturnPolicy = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/return-policy/delete/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteReturnPolicy error:", error);
    throw error.response?.data || error.message;
  }
};
