import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserWishlist, addToWishlist, removeFromWishlist } from '../../services/wishlistService';

// Fetch user's wishlist
export const getUserWishlist = createAsyncThunk(
  'wishlist/getUserWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserWishlist();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add product to wishlist
export const addProductToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      await addToWishlist(productId);
      // Refresh wishlist after adding
      const response = await fetchUserWishlist();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi thêm vào danh sách yêu thích');
    }
  }
);

// Remove product from wishlist
export const removeProductFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistId, { rejectWithValue, dispatch }) => {
    try {
      console.log(wishlistId);
      await removeFromWishlist(wishlistId);
      // Refresh wishlist after removing
      const response = await fetchUserWishlist();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi xóa khỏi danh sách yêu thích');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get wishlist
      .addCase(getUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addProductToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeProductFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear wishlist on logout
      .addCase('auth/logout/fulfilled', (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      })
      .addCase('auth/logout/rejected', (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;