import axiosInstance from "../utils/axiosInstance";

/**
 * Add a new user (Admin)
 * @param {Object} userData
 * @returns {Promise<any>}
 */
export const addUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/admin/users/add", userData);
    return response.data;
  } catch (error) {
    console.error("addUser error:", error);
    throw extractApiError(error);
  }
};

/**
 * Call API get all users with pagination & filter
 * @param {Object} params - { page, size, sortBy, orderBy, keyword, status }
 * @returns {Promise<any>}
 */
export const getAllUsersPaginateAndFilter = async (params) => {
  try {
    const response = await axiosInstance.get("/admin/users/paginate", {
      params, // Tự động map query params
    });
    return response.data;
  } catch (error) {
    console.error("getAllUsersPaginateAndFilter error:", error);
    throw extractApiError(error);
  }
};

/**
 * Fetch all users (Admin)
 * @returns {Promise<any>}
 */
export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("fetchUsers error:", error);
    throw extractApiError(error);
  }
};

/**
 * Change a user's role by user ID and role ID (Admin)
 * @param {number|string} userId
 * @param {number|string} roleId
 * @returns {Promise<any>}
 */
export const changeUserRole = async (userId, roleId) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/users/${userId}/changeRole/${roleId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `changeUserRole error (UserID: ${userId}, RoleID: ${roleId}):`,
      error
    );
    throw extractApiError(error);
  }
};

/**
 * Delete a user's role by user ID and role ID (Admin)
 * @param {number|string} userId
 * @param {number|string} roleId
 * @returns {Promise<any>}
 */
export const deleteUserRole = async (userId, roleId) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/users/${userId}/deleteRole/${roleId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `deleteUserRole error (UserID: ${userId}, RoleID: ${roleId}):`,
      error
    );
    throw extractApiError(error);
  }
};

/**
 * Change a user's status (active, inactive, etc.)
 * @param {number|string} userId
 * @param {string} status
 * @returns {Promise<any>}
 */
export const changeUserStatus = async (userId, status) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/users/${userId}/status`,
      {
        status,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`changeUserStatus error (UserID: ${userId}):`, error);
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
