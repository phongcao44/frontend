import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLeastViewedProducts,
  fetchProductBySlug,
  fetchProductsByCategory,
  fetchTopBestSellingProducts,
  fetchTopLeastSellingProducts,
  fetchTopViewedProducts,
  trackProductView,
  fetchRelatedProducts, // Added new import
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

// Existing thunks remain unchanged
export const loadProducts = createAsyncThunk(
  "products/loadAll",
  fetchAllProducts
);

export const loadProductsPaginate = createAsyncThunk(
  "products/loadPaginate",
  async (params) => await fetchProductsPaginate(params)
);

export const loadProductBySlug = createAsyncThunk(
  "products/loadBySlug",
  async (slug) => await fetchProductBySlug(slug)
);

export const loadNewArrivals = createAsyncThunk(
  "products/loadNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsPaginate({
        page: 0,
        limit: 4,
        sortBy: "createdAt",
        orderBy: "desc",
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
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

export const loadProductsByCategory = createAsyncThunk(
  "products/loadByCategory",
  async (categoryId) => await fetchProductsByCategory(categoryId)
);

export const loadTopBestSellingProducts = createAsyncThunk(
  "products/loadTopBestSelling",
  fetchTopBestSellingProducts
);

export const loadTopLeastSellingProducts = createAsyncThunk(
  "products/loadTopLeastSelling",
  fetchTopLeastSellingProducts
);

export const loadTopViewedProducts = createAsyncThunk(
  "products/loadTopViewed",
  async (limit) => await fetchTopViewedProducts(limit)
);

export const loadLeastViewedProducts = createAsyncThunk(
  "products/loadLeastViewed",
  async (limit) => await fetchLeastViewedProducts(limit)
);

export const trackView = createAsyncThunk(
  "products/trackView",
  async (id) => await trackProductView(id)
);

// New thunk for related products
export const loadRelatedProducts = createAsyncThunk(
  "products/loadRelated",
  async (id) => await fetchRelatedProducts(id)
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    paginated: null,
    newArrivals: [],
    productDetail: null,
    topBestSelling: [],
    topLeastSelling: [],
    topViewed: [],
    leastViewed: [],
    productsByCategory: [],
    relatedProducts: [], // Added new state property
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

      .addCase(loadNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(loadNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductBySlug.fulfilled, (state, action) => {
        state.productDetail = action.payload;
        state.loading = false;
      })
      .addCase(loadProductBySlug.rejected, (state, action) => {
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
      })

      // Products By Category
      .addCase(loadProductsByCategory.fulfilled, (state, action) => {
        state.productsByCategory = action.payload;
      })

      // Top Best Selling
      .addCase(loadTopBestSellingProducts.fulfilled, (state, action) => {
        state.topBestSelling = action.payload;
      })

      // Top Least Selling
      .addCase(loadTopLeastSellingProducts.fulfilled, (state, action) => {
        state.topLeastSelling = action.payload;
      })

      // Top Viewed
      .addCase(loadTopViewedProducts.fulfilled, (state, action) => {
        state.topViewed = action.payload;
      })

      // Least Viewed
      .addCase(loadLeastViewedProducts.fulfilled, (state, action) => {
        state.leastViewed = action.payload;
      })

      // Track View
      // eslint-disable-next-line no-unused-vars
      .addCase(trackView.fulfilled, (state) => {})

      // Related Products
      .addCase(loadRelatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
        state.loading = false;
      })
      .addCase(loadRelatedProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { clearProductDetail } = productSlice.actions;
export default productSlice.reducer;