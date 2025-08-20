import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFlashSales,
  getFlashSaleDetails,
  getActiveFlashSale,
  addFlashSale,
  editFlashSale,
  deleteFlashSale,
  getFlashSaleItems,
  getFlashSaleVariantDetails,
  addFlashSaleItem,
  editFlashSaleItem,
  deleteFlashSaleItem,
  getTop1FlashSale,
  getFlashSaleItemsPaginated, // Added import
} from "../../services/flashSaleService";

// FLASH SALE
export const fetchFlashSales = createAsyncThunk(
  "flashSale/fetchFlashSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFlashSales();
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch flash sales");
    }
  }
);

export const fetchFlashSaleDetails = createAsyncThunk(
  "flashSale/fetchFlashSaleDetails",
  async (flashSaleId, { rejectWithValue }) => {
    try {
      const response = await getFlashSaleDetails(flashSaleId);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch flash sale details");
    }
  }
);

export const fetchActiveFlashSale = createAsyncThunk(
  "flashSale/fetchActiveFlashSale",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getActiveFlashSale();
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch active flash sale");
    }
  }
);

export const createFlashSale = createAsyncThunk(
  "flashSale/createFlashSale",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await addFlashSale(data);
      // Refresh flash sales list after creating
      await dispatch(fetchFlashSales());
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create flash sale");
    }
  }
);

export const updateFlashSale = createAsyncThunk(
  "flashSale/updateFlashSale",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await editFlashSale(id, data);
      // Refresh flash sales list after updating
      await dispatch(fetchFlashSales());
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update flash sale");
    }
  }
);

export const removeFlashSale = createAsyncThunk(
  "flashSale/removeFlashSale",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteFlashSale(id);
      // Refresh flash sales list after deleting
      await dispatch(fetchFlashSales());
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete flash sale");
    }
  }
);

// FLASH SALE ITEMS
export const fetchFlashSaleItems = createAsyncThunk(
  "flashSale/fetchFlashSaleItems",
  async (flashSaleId, { rejectWithValue }) => {
    try {
      const response = await getFlashSaleItems(flashSaleId);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch flash sale items");
    }
  }
);

export const fetchFlashSaleItemsPaginated = createAsyncThunk(
  "flashSale/fetchFlashSaleItemsPaginated",
  async ({ flashSaleId, params }, { rejectWithValue }) => {
    try {
      const response = await getFlashSaleItemsPaginated(flashSaleId, params);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch paginated flash sale items");
    }
  }
);

export const fetchFlashSaleVariantDetails = createAsyncThunk(
  "flashSale/fetchFlashSaleVariantDetails",
  async (flashSaleId, { rejectWithValue }) => {
    try {
      const response = await getFlashSaleVariantDetails(flashSaleId);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch flash sale variant details");
    }
  }
);

export const createFlashSaleItem = createAsyncThunk(
  "flashSale/createFlashSaleItem",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await addFlashSaleItem(data);
      // Refresh flash sale variant details after creating item
      await dispatch(fetchFlashSaleVariantDetails(data.flashSaleId));
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to add flash sale item");
    }
  }
);

export const updateFlashSaleItem = createAsyncThunk(
  "flashSale/updateFlashSaleItem",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await editFlashSaleItem(id, payload);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update flash sale item");
    }
  }
);

export const removeFlashSaleItem = createAsyncThunk(
  "flashSale/removeFlashSaleItem",
  async (id, { rejectWithValue, getState }) => {
    try {
      await deleteFlashSaleItem(id);
      // Get flash sale ID from state to refresh details
      const state = getState();
      const flashSaleId = state.flashSale.flashSaleVariantDetails[0]?.flashSaleId;
      if (flashSaleId) {
        // Note: We can't dispatch here, so we'll handle refresh in the component
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete flash sale item");
    }
  }
);

export const fetchTop1FlashSale = createAsyncThunk(
  "flashSale/fetchTop1FlashSale",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTop1FlashSale();
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch top 1 flash sale");
    }
  }
);

// SLICE
const flashSaleSlice = createSlice({
  name: "flashSale",
  initialState: {
    flashSales: [],
    flashSaleDetails: [],
    flashSaleItems: [],
    flashSaleItemsPaginated: [], // Added for paginated items
    flashSaleVariantDetails: [],
    activeFlashSale: null,
    top1FlashSale: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Flash Sales
      .addCase(fetchFlashSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashSales.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSales = action.payload;
      })
      .addCase(fetchFlashSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Flash Sale Details
      .addCase(fetchFlashSaleDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashSaleDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSaleDetails = action.payload;
      })
      .addCase(fetchFlashSaleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Active Flash Sale
      .addCase(fetchActiveFlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveFlashSale.fulfilled, (state, action) => {
        state.loading = false;
        state.activeFlashSale = action.payload;
      })
      .addCase(fetchActiveFlashSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Flash Sale
      .addCase(createFlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlashSale.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSales.push(action.payload);
      })
      .addCase(createFlashSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Flash Sale
      .addCase(updateFlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlashSale.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.flashSales.findIndex(
          (fs) => fs.id === action.payload.id
        );
        if (idx !== -1) {
          state.flashSales[idx] = action.payload;
        }
      })
      .addCase(updateFlashSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Flash Sale
      .addCase(removeFlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFlashSale.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSales = state.flashSales.filter(
          (fs) => fs.id !== action.payload
        );
      })
      .addCase(removeFlashSale.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload;
      })

      // Fetch Flash Sale Items
      .addCase(fetchFlashSaleItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashSaleItems.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSaleItems = action.payload;
      })
      .addCase(fetchFlashSaleItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Flash Sale Items Paginated
      .addCase(fetchFlashSaleItemsPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashSaleItemsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSaleItemsPaginated = action.payload;
      })
      .addCase(fetchFlashSaleItemsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Flash Sale Variant Details
      .addCase(fetchFlashSaleVariantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashSaleVariantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSaleVariantDetails = action.payload;
      })
      .addCase(fetchFlashSaleVariantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Flash Sale Item
      .addCase(createFlashSaleItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlashSaleItem.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSaleItems.push(action.payload);
      })
      .addCase(createFlashSaleItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Flash Sale Item
      .addCase(updateFlashSaleItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlashSaleItem.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.flashSaleItems.findIndex(
          (item) => item.id === action.payload.id
        );
        if (idx !== -1) {
          state.flashSaleItems[idx] = action.payload;
        }
      })
      .addCase(updateFlashSaleItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Flash Sale Item
      .addCase(removeFlashSaleItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFlashSaleItem.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSaleItems = state.flashSaleItems.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(removeFlashSaleItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Top 1 Flash Sale
      .addCase(fetchTop1FlashSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTop1FlashSale.fulfilled, (state, action) => {
        state.loading = false;
        state.top1FlashSale = action.payload;
      })
      .addCase(fetchTop1FlashSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.top1FlashSale = null;
      });
  },
});

export const { clearError } = flashSaleSlice.actions;
export default flashSaleSlice.reducer;