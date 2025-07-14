import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createReview,
  getProductReviews,
  getAverageRating,
  getRatingSummary,
  getAdminReviews,
  deleteReview,
  editReview,
} from "../../services/reviewService";

// CREATE review
export const createReviewThunk = createAsyncThunk(
  "review/create",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await createReview(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET all reviews for product (user)
export const fetchProductReviews = createAsyncThunk(
  "review/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getProductReviews(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET average rating
export const fetchAverageRating = createAsyncThunk(
  "review/fetchAverageRating",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getAverageRating(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET rating summary
export const fetchRatingSummary = createAsyncThunk(
  "review/fetchRatingSummary",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getRatingSummary(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET reviews (admin)
export const fetchAdminReviews = createAsyncThunk(
  "review/fetchAdminReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getAdminReviews(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// DELETE review
export const deleteReviewThunk = createAsyncThunk(
  "review/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await deleteReview(reviewId);
      return { id: reviewId, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// EDIT review
export const editReviewThunk = createAsyncThunk(
  "review/editReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await editReview(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    averageRating: null,
    ratingSummary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createReviewThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAverageRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        state.loading = false;
        state.averageRating = action.payload;
      })
      .addCase(fetchAverageRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRatingSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRatingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.ratingSummary = action.payload;
      })
      .addCase(fetchRatingSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteReviewThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter((r) => r.id !== action.payload.id);
      })
      .addCase(deleteReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editReviewThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(editReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(editReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
