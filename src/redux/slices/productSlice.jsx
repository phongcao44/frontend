import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMergedProducts,
  fetchProductDetailById,
} from "../../services/productServices";

export const loadMergedProducts = createAsyncThunk(
  "products/loadMerged",
  async ({ page = 0, limit = 10 }) => {
    const data = await fetchMergedProducts(page, limit);
    return data;
  }
);

export const loadProductDetail = createAsyncThunk(
  "products/loadDetail",
  async (productId) => {
    const data = await fetchProductDetailById(productId);
    return data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    mergedProducts: [],
    productDetail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductDetail(state) {
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load danh sách sản phẩm
      .addCase(loadMergedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMergedProducts.fulfilled, (state, action) => {
        state.mergedProducts = action.payload;
        state.loading = false;
      })
      .addCase(loadMergedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Load chi tiết sản phẩm
      .addCase(loadProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductDetail.fulfilled, (state, action) => {
        state.productDetail = action.payload;
        state.loading = false;
      })
      .addCase(loadProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProductDetail } = productSlice.actions;
export default productSlice.reducer;
