import axiosInstance from '../utils/axiosInstance';

// Fetch user's wishlist
export const fetchUserWishlist = async () => {
  try {
    const response = await axiosInstance.get('/user/wishList');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await axiosInstance.post('/user/wishList/add', { productId });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error.message || 'Có lỗi xảy ra khi thêm vào danh sách yêu thích';
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (wishlistId) => {
  try {
    const response = await axiosInstance.delete(`/user/wishList?wishlistId=${wishlistId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 