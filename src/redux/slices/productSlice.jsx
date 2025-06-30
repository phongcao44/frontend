import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMergedProducts,
  fetchProductDetailById,
} from "../../services/productServices";
import {
  fetchAllProducts,
  fetchProductsPaginate,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  changeProductStatus,
  searchProducts,
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

export const loadProducts = createAsyncThunk(
  "products/loadAll",
  fetchAllProducts
);

export const loadProductsPaginate = createAsyncThunk(
  "products/loadPaginate",
  async (params) => await fetchProductsPaginate(params)
);

export const loadProductById = createAsyncThunk(
  "products/loadById",
  async (id) => await fetchProductById(id)
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (productData) => await createProduct(productData)
);

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, productData }) => await updateProduct(id, productData)
);

export const removeProduct = createAsyncThunk("products/delete", async (id) => {
  await deleteProduct(id);
  return id;
});

export const toggleProductStatus = createAsyncThunk(
  "products/status",
  async (id) => await changeProductStatus(id)
);

export const searchProduct = createAsyncThunk(
  "products/search",
  async (keyword) => await searchProducts(keyword)
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    paginated: null,
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
      })

      // Load All
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Paginate
      .addCase(loadProductsPaginate.fulfilled, (state, action) => {
        state.paginated = action.payload;
      })

      // Detail
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.productDetail = action.payload;
      })

      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Edit
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // Delete
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      })

      // Toggle Status
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // Search
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export const { clearProductDetail } = productSlice.actions;
export default productSlice.reducer;
