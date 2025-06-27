import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllSizes,
  addSize,
  updateSize,
  deleteSize,
} from "../../services/sizeService";

export const loadSizes = createAsyncThunk("size/loadAll", async () => {
  const data = await fetchAllSizes();
  return data;
});

export const createSize = createAsyncThunk("size/add", async (sizeData) => {
  const data = await addSize(sizeData);
  return data;
});

export const editSize = createAsyncThunk(
  "size/update",
  async ({ id, updatedData }) => {
    const data = await updateSize(id, updatedData);
    return data;
  }
);

export const removeSize = createAsyncThunk("size/delete", async (id) => {
  await deleteSize(id);
  return id;
});

const sizeSlice = createSlice({
  name: "size",
  initialState: {
    sizes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load sizes
      .addCase(loadSizes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSizes.fulfilled, (state, action) => {
        state.sizes = action.payload;
        state.loading = false;
      })
      .addCase(loadSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add size
      .addCase(createSize.fulfilled, (state, action) => {
        state.sizes.push(action.payload);
      })

      // Update size
      .addCase(editSize.fulfilled, (state, action) => {
        const index = state.sizes.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.sizes[index] = action.payload;
        }
      })

      // Delete size
      .addCase(removeSize.fulfilled, (state, action) => {
        state.sizes = state.sizes.filter((s) => s.id !== action.payload);
      });
  },
});

export default sizeSlice.reducer;
