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
    throw error.response?.data || error.message;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await axiosInstance.delete('/user/wishList/remove', {
      data: { productId }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 