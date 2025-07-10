import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../../services/bannerService";

export const getBanners = createAsyncThunk(
  "banner/getBanners",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBanners();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBanner = createAsyncThunk(
  "banner/createBanner",
  async (formData, { rejectWithValue }) => {
    try {
      return await addBanner(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editBanner = createAsyncThunk(
  "banner/editBanner",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("title", payload.title);
      form.append("position", payload.position);
      form.append("status", payload.status ? "true" : "false");
      if (payload.image) {
        form.append("image", payload.image);
      }
      form.append("startAt", new Date(payload.timeStart).toISOString());
      form.append("endAt", new Date(payload.timeEnd).toISOString());
      return await updateBanner(id, form);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeBanner = createAsyncThunk(
  "banner/removeBanner",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBanner(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(editBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(
          (banner) => banner.id === action.payload.id
        );
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(editBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(removeBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(
          (banner) => banner.id !== action.payload
        );
      })
      .addCase(removeBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
