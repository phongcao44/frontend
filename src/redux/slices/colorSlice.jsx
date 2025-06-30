import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchColors,
  addColor,
  autoAddColor,
  updateColor,
  deleteColor,
} from "../../services/colorService";

export const loadColors = createAsyncThunk("colors/load", fetchColors);
export const createColor = createAsyncThunk("colors/add", addColor);
export const autoCreateColor = createAsyncThunk("colors/autoadd", autoAddColor);
export const editColor = createAsyncThunk(
  "colors/edit",
  async ({ id, data }) => {
    return await updateColor(id, data);
  }
);
export const removeColor = createAsyncThunk("colors/delete", deleteColor);

const colorSlice = createSlice({
  name: "colors",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadColors.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadColors.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(loadColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(autoCreateColor.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(createColor.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editColor.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeColor.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.meta.arg);
      });
  },
});

export default colorSlice.reducer;
