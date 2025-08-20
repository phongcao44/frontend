import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLeastViewedProducts,
  fetchProductBySlug,
  fetchProductsByCategory,
  fetchTopBestSellingProducts,
  fetchTopLeastSellingProducts,
  fetchTopViewedProducts,
  trackProductView,
  fetchRelatedProducts,
  fetchTopSellingProductsPaginate,
  fetchBrandsPaginate, // Added new brand import
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
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllProducts();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadProductsPaginate = createAsyncThunk(
  "products/loadPaginate",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchProductsPaginate(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadProductBySlug = createAsyncThunk(
  "products/loadBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      return await fetchProductBySlug(slug);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
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
  async (id, { rejectWithValue }) => {
    try {
      return await fetchProductById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (productData, { rejectWithValue }) => {
    try {
      return await createProduct(productData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      return await updateProduct(id, productData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/delete", 
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleProductStatus = createAsyncThunk(
  "products/status",
  async (id, { rejectWithValue }) => {
    try {
      return await changeProductStatus(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchProduct = createAsyncThunk(
  "products/search",
  async (keyword, { rejectWithValue }) => {
    try {
      return await searchProducts(keyword);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadProductsByCategory = createAsyncThunk(
  "products/loadByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      return await fetchProductsByCategory(categoryId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadTopBestSellingProducts = createAsyncThunk(
  "products/loadTopBestSelling",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTopBestSellingProducts();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadTopLeastSellingProducts = createAsyncThunk(
  "products/loadTopLeastSelling",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTopLeastSellingProducts();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadTopViewedProducts = createAsyncThunk(
  "products/loadTopViewed",
  async (limit, { rejectWithValue }) => {
    try {
      return await fetchTopViewedProducts(limit);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadLeastViewedProducts = createAsyncThunk(
  "products/loadLeastViewed",
  async (limit, { rejectWithValue }) => {
    try {
      return await fetchLeastViewedProducts(limit);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const trackView = createAsyncThunk(
  "products/trackView",
  async (id, { rejectWithValue }) => {
    try {
      return await trackProductView(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadRelatedProducts = createAsyncThunk(
  "products/loadRelated",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchRelatedProducts(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadTopSellingProductsPaginate = createAsyncThunk(
  "products/loadTopSellingPaginate",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchTopSellingProductsPaginate(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New brand thunk
export const loadBrandsPaginate = createAsyncThunk(
  "products/loadBrandsPaginate",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchBrandsPaginate(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
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
    relatedProducts: [],
    topSellingPaginated: null,
    brandsPaginated: null, // Added new state property for brands
    loading: false,
    error: null,
  },
  reducers: {
    clearProductDetail(state) {
      state.productDetail = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearBrandsPaginated(state) {
      state.brandsPaginated = null;
    },
    updateProductFavoriteStatus(state, action) {
      const { productId, isFavorite } = action.payload;
      
      // Update productDetail if it matches
      if (state.productDetail && state.productDetail.id === productId) {
        state.productDetail.isFavorite = isFavorite;
      }
      
      // Update products in various lists
      const updateProductInList = (list) => {
        if (Array.isArray(list)) {
          list.forEach(product => {
            if (product.id === productId) {
              product.isFavorite = isFavorite;
            }
          });
        }
      };
      
      // Update in different product lists
      updateProductInList(state.list);
      updateProductInList(state.newArrivals?.data?.content);
      updateProductInList(state.topBestSelling);
      updateProductInList(state.topLeastSelling);
      updateProductInList(state.topViewed);
      updateProductInList(state.leastViewed);
      updateProductInList(state.productsByCategory);
      updateProductInList(state.relatedProducts);
      updateProductInList(state.topSellingPaginated?.content);
      updateProductInList(state.brandsPaginated?.data?.content);
    },
  },
  extraReducers: (builder) => {
    builder
      // Load All Products
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load New Arrivals
      .addCase(loadNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
        state.error = null;
      })
      .addCase(loadNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Load Product By Slug
      .addCase(loadProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductBySlug.fulfilled, (state, action) => {
        state.productDetail = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadProductBySlug.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Products Paginate
      .addCase(loadProductsPaginate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductsPaginate.fulfilled, (state, action) => {
        state.paginated = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadProductsPaginate.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Product By ID
      .addCase(loadProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.productDetail = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Edit Product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Remove Product
      .addCase(removeProduct.pending, (state) => {
        // Do not toggle global loading to avoid hiding the list UI
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        const removedId = action.payload;
        // Update flat list if present
        state.list = state.list.filter((p) => p.id !== removedId);
        // Optimistically update paginated content if loaded
        if (state.paginated?.data?.content) {
          state.paginated.data.content = state.paginated.data.content.filter(
            (p) => p.id !== removedId
          );
          if (typeof state.paginated.data.totalElements === "number") {
            state.paginated.data.totalElements = Math.max(
              0,
              state.paginated.data.totalElements - 1
            );
          }
        }
        state.error = null;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Toggle Product Status
      .addCase(toggleProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Search Product
      .addCase(searchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Products By Category
      .addCase(loadProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProductsByCategory.fulfilled, (state, action) => {
        state.productsByCategory = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadProductsByCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Top Best Selling Products
      .addCase(loadTopBestSellingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTopBestSellingProducts.fulfilled, (state, action) => {
        state.topBestSelling = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadTopBestSellingProducts.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Top Least Selling Products
      .addCase(loadTopLeastSellingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTopLeastSellingProducts.fulfilled, (state, action) => {
        state.topLeastSelling = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadTopLeastSellingProducts.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Top Viewed Products
      .addCase(loadTopViewedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTopViewedProducts.fulfilled, (state, action) => {
        state.topViewed = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadTopViewedProducts.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Least Viewed Products
      .addCase(loadLeastViewedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLeastViewedProducts.fulfilled, (state, action) => {
        state.leastViewed = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadLeastViewedProducts.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Track View
      .addCase(trackView.pending, (state) => {
        state.error = null;
      })
      .addCase(trackView.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(trackView.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Load Related Products
      .addCase(loadRelatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadRelatedProducts.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Top Selling Products Paginated
      .addCase(loadTopSellingProductsPaginate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTopSellingProductsPaginate.fulfilled, (state, action) => {
        state.topSellingPaginated = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadTopSellingProductsPaginate.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })

      // Load Brands Paginated - NEW
      .addCase(loadBrandsPaginate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBrandsPaginate.fulfilled, (state, action) => {
        state.brandsPaginated = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadBrandsPaginate.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
  },
});

export const { clearProductDetail, clearError, clearBrandsPaginated, updateProductFavoriteStatus } = productSlice.actions;
export default productSlice.reducer;