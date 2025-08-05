import axiosInstance from "../utils/axiosInstance";

/**
 * Create a new review
 * @param {Object} reviewData
 * @returns {Promise<any>}
 */
export const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post(`/`, reviewData);
    return response.data;
  } catch (error) {
    console.error("createReview error:", error);
    throw extractApiError(error);
  }
};

/**
 * Get average rating for a product
 * @param {number|string} productId
 * @returns {Promise<any>}
 */
export const getAverageRating = async (productId) => {
  try {
    const response = await axiosInstance.get(
      `/user/review/product/${productId}/average-rating`
    );
    return response.data;
  } catch (error) {
    console.error(`getAverageRating error (ProductID: ${productId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Get all reviews for a product
 * @param {number|string} productId
 * @returns {Promise<any>}
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await axiosInstance.get(
      `/user/review/product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(`getProductReviews error (ProductID: ${productId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Get rating summary for a product
 * @param {number|string} productId
 * @returns {Promise<any>}
 */
export const getRatingSummary = async (productId) => {
  try {
    const response = await axiosInstance.get(
      `/user/review/product/${productId}/rating-summary`
    );
    return response.data;
  } catch (error) {
    console.error(`getRatingSummary error (ProductID: ${productId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Get reviews for a product (Admin)
 * @param {number|string} productId
 * @returns {Promise<any>}
 */
export const getAdminReviews = async (productId) => {
  try {
    const response = await axiosInstance.get(`/admin/review/list/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`getAdminReviews error (ProductID: ${productId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete a review by ID (Admin)
 * @param {number|string} reviewId
 * @returns {Promise<any>}
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/delete_review/${reviewId}`
    );
    return response.data;
  } catch (error) {
    console.error(`deleteReview error (ReviewID: ${reviewId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Edit an existing review
 * @param {Object} reviewData
 * @returns {Promise<any>}
 */
export const editReview = async (reviewData) => {
  try {
    const response = await axiosInstance.patch(`/user/review/edit`, reviewData);
    return response.data;
  } catch (error) {
    console.error("editReview error:", error);
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

export const getRatingSummaryByProduct = async () => {
  const response = await axiosInstance.get(`/admin/review/list`);
  return response.data;
}

/**
 * Toggle review visibility (hide/show)
 * @param {number|string} reviewId
 * @param {boolean} isHidden
 * @returns {Promise<any>}
 */
export const toggleReviewVisibilityService = async (reviewId, isHidden) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/review/${reviewId}/visibility`,
      { isHidden }
    );
    return response.data;
  } catch (error) {
    console.error(`toggleReviewVisibility error (ReviewID: ${reviewId}):`, error);
    throw extractApiError(error);
  }
};
