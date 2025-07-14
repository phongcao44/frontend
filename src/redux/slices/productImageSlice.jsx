import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllProductImages,
  fetchProductImagesByProduct,
  fetchProductImagesByVariant,
  addProductImage,
  updateProductImage,
  deleteProductImage,
} from "../../services/productImageService";

// Thunk: Lấy ALL
export const getAllProductImages = createAsyncThunk(
  "productImage/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllProductImages();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk: Lấy theo ProductID
export const getProductImagesByProduct = createAsyncThunk(
  "productImage/getByProduct",
  async (productId, { rejectWithValue }) => {
    try {
      return await fetchProductImagesByProduct(productId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk: Lấy theo VariantID
export const getProductImagesByVariant = createAsyncThunk(
  "productImage/getByVariant",
  async (variantId, { rejectWithValue }) => {
    try {
      return await fetchProductImagesByVariant(variantId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk: Thêm
export const createProductImage = createAsyncThunk(
  "productImage/create",
  async (formData, { rejectWithValue }) => {
    try {
      return await addProductImage(formData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk: Cập nhật
export const editProductImage = createAsyncThunk(
  "productImage/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateProductImage(id, formData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk: Xóa
export const removeProductImage = createAsyncThunk(
  "productImage/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteProductImage(id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const productImageSlice = createSlice({
  name: "productImage",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllProductImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductImages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllProductImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY PRODUCT
      .addCase(getProductImagesByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductImagesByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data; // Vì bạn gói ResponseWrapper -> data
      })
      .addCase(getProductImagesByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY VARIANT
      .addCase(getProductImagesByVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductImagesByVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data; // ResponseWrapper
      })
      .addCase(getProductImagesByVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(editProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProductImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (img) => img.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(editProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(removeProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((img) => img.id !== action.meta.arg);
      })
      .addCase(removeProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productImageSlice.reducer;
