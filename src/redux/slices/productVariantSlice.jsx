import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllProductVariants,
  fetchProductVariantsByProductId,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../../services/productVariantService";

export const loadAllVariants = createAsyncThunk(
  "productVariants/loadAll",
  fetchAllProductVariants
);

export const loadVariantsByProduct = createAsyncThunk(
  "productVariants/loadByProduct",
  async (productId) => await fetchProductVariantsByProductId(productId)
);

export const addProductVariant = createAsyncThunk(
  "productVariants/add",
  async (variantData) => await createProductVariant(variantData)
);

export const editProductVariant = createAsyncThunk(
  "productVariants/edit",
  async ({ id, variantData }) => await updateProductVariant(id, variantData)
);

export const removeProductVariant = createAsyncThunk(
  "productVariants/delete",
  async (id) => {
    await deleteProductVariant(id);
    return id;
  }
);

const productVariantSlice = createSlice({
  name: "productVariants",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load All
      .addCase(loadAllVariants.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAllVariants.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(loadAllVariants.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Load by productId
      .addCase(loadVariantsByProduct.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      // Add
      .addCase(addProductVariant.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Edit
      .addCase(editProductVariant.fulfilled, (state, action) => {
        const idx = state.list.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // Delete
      .addCase(removeProductVariant.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v.id !== action.payload);
      });
  },
});

export default productVariantSlice.reducer;
