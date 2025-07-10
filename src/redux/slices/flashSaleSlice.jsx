import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFlashSales,
  addFlashSale,
  editFlashSale,
  deleteFlashSale,
  getFlashSaleItems,
  addFlashSaleItem,
  editFlashSaleItem,
  deleteFlashSaleItem,
} from "../../services/flashSaleService";

// FLASH SALE
export const fetchFlashSales = createAsyncThunk(
  "flashSale/fetchFlashSales",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getFlashSales();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch Flash Sales");
    }
  }
);

export const createFlashSale = createAsyncThunk(
  "flashSale/createFlashSale",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addFlashSale(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create Flash Sale");
    }
  }
);

export const updateFlashSale = createAsyncThunk(
  "flashSale/updateFlashSale",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await editFlashSale(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update Flash Sale");
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
      return rejectWithValue(err.message || "Failed to delete Flash Sale");
    }
  }
);

// FLASH SALE ITEMS
export const fetchFlashSaleItems = createAsyncThunk(
  "flashSale/fetchFlashSaleItems",
  async (flashSaleId, { rejectWithValue }) => {
    try {
      const res = await getFlashSaleItems(flashSaleId);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch Flash Sale Items");
    }
  }
);

export const createFlashSaleItem = createAsyncThunk(
  "flashSale/createFlashSaleItem",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addFlashSaleItem(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to add Flash Sale Item");
    }
  }
);

export const updateFlashSaleItem = createAsyncThunk(
  "flashSale/updateFlashSaleItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await editFlashSaleItem(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update Flash Sale Item");
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
      return rejectWithValue(err.message || "Failed to delete Flash Sale Item");
    }
  }
);

// ===============================
// Slice
// ===============================

const flashSaleSlice = createSlice({
  name: "flashSale",
  initialState: {
    flashSales: [],
    flashSaleItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
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

      // Create Flash Sale
      .addCase(createFlashSale.fulfilled, (state, action) => {
        state.flashSales.push(action.payload);
      })

      // Update Flash Sale
      .addCase(updateFlashSale.fulfilled, (state, action) => {
        const idx = state.flashSales.findIndex(
          (fs) => fs.id === action.payload.id
        );
        if (idx !== -1) {
          state.flashSales[idx] = action.payload;
        }
      })

      // Remove Flash Sale
      .addCase(removeFlashSale.fulfilled, (state, action) => {
        state.flashSales = state.flashSales.filter(
          (fs) => fs.id !== action.payload
        );
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

      // Create Flash Sale Item
      .addCase(createFlashSaleItem.fulfilled, (state, action) => {
        state.flashSaleItems.push(action.payload);
      })

      // Update Flash Sale Item
      .addCase(updateFlashSaleItem.fulfilled, (state, action) => {
        const idx = state.flashSaleItems.findIndex(
          (item) => item.id === action.payload.id
        );
        if (idx !== -1) {
          state.flashSaleItems[idx] = action.payload;
        }
      })

      // Remove Flash Sale Item
      .addCase(removeFlashSaleItem.fulfilled, (state, action) => {
        state.flashSaleItems = state.flashSaleItems.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default flashSaleSlice.reducer;
