import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFlashSales,
  getFlashSaleDetails,
  getActiveFlashSale, // Added import
  addFlashSale,
  editFlashSale,
  deleteFlashSale,
  getFlashSaleItems,
  getFlashSaleVariantDetails,
  addFlashSaleItem,
  editFlashSaleItem,
  deleteFlashSaleItem,
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
  async (flashSaleId, { rejectWithValue }) => { // Fixed: Accept flashSaleId
    try {
      const response = await getFlashSaleDetails(flashSaleId); // Fixed: Pass flashSaleId
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
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFlashSale(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create flash sale");
    }
  }
);

export const updateFlashSale = createAsyncThunk(
  "flashSale/updateFlashSale",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await editFlashSale(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update flash sale");
    }
  }
);

export const removeFlashSale = createAsyncThunk(
  "flashSale/removeFlashSale",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFlashSale(id);
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
  async (data, { rejectWithValue }) => {
    try {
      const response = await addFlashSaleItem(data);
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
  async (id, { rejectWithValue }) => {
    try {
      await deleteFlashSaleItem(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete flash sale item");
    }
  }
);

// SLICE
const flashSaleSlice = createSlice({
  name: "flashSale",
  initialState: {
    flashSales: [],
    flashSaleDetails: [], // Kept as array to preserve original logic
    flashSaleItems: [],
    flashSaleVariantDetails: [], // Kept as array to preserve original logic
    activeFlashSale: null, // Added for active flash sale
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
        state.flashSales.push(action.payload); // Preserved original push
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
          state.flashSales[idx] = action.payload; // Preserved original mutation
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
        state.error = action.payload;
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
        state.flashSaleItems.push(action.payload); // Preserved original push
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
          state.flashSaleItems[idx] = action.payload; // Preserved original mutation
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
      });
  },
});

export const { clearError } = flashSaleSlice.actions;
export default flashSaleSlice.reducer;