import axiosInstance from "../utils/axiosInstance";

export const createReview = async (reviewData) => {
  const response = await axiosInstance.post(`/`, reviewData);
  return response.data;
};

export const getAverageRating = async (productId) => {
  const response = await axiosInstance.get(
    `/user/review/product/${productId}/average-rating`
  );
  return response.data;
};

export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/user/review/product/${productId}`);
  return response.data;
};

export const getRatingSummary = async (productId) => {
  const response = await axiosInstance.get(
    `/user/review/product/${productId}/rating-summary`
  );
  return response.data;
};

export const getAdminReviews = async (productId) => {
  const response = await axiosInstance.get(`/admin/review/list/${productId}`);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(
    `/admin/delete_review/${reviewId}`
  );
  return response.data;
};

export const editReview = async (reviewData) => {
  const response = await axiosInstance.patch(`/user/review/edit`, reviewData);
  return response.data;
};

export const getRatingSummaryByProduct = async () => {
  const response = await axiosInstance.get(`/admin/review/list`);
  return response.data;
}
