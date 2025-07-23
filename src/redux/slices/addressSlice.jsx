import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  fetchAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../services/addressService";

// GET PROVINCES
export const getProvinces = createAsyncThunk(
  "address/getProvinces",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProvinces();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET DISTRICTS
export const getDistricts = createAsyncThunk(
  "address/getDistricts",
  async (provinceId, { rejectWithValue }) => {
    try {
      return await fetchDistricts(provinceId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET WARDS
export const getWards = createAsyncThunk(
  "address/getWards",
  async (districtId, { rejectWithValue }) => {
    try {
      return await fetchWards(districtId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET ALL USER ADDRESSES
export const getAddresses = createAsyncThunk(
  "address/getAddresses",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllAddresses();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// CREATE
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (payload, { rejectWithValue }) => {
    try {
      return await addAddress(payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// UPDATE
export const editAddress = createAsyncThunk(
  "address/editAddress",
  async ({ id, payload }, { rejectWithValue }) => {
    console.log(payload);
    try {
      return await updateAddress(id, payload);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// DELETE
export const removeAddress = createAsyncThunk(
  "address/removeAddress",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddress(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    provinces: [],
    districts: [],
    wards: [],
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET PROVINCES
      .addCase(getProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(getProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET DISTRICTS
      .addCase(getDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(getDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET WARDS
      .addCase(getWards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload;
      })
      .addCase(getWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL ADDRESSES
      .addCase(getAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(editAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(
          (addr) => addr.id === action.payload.id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
