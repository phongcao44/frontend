import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllVouchers,
  applyVoucher,
  collectVoucher,
  getCollectibleVouchers,
  getUserVouchers,
} from "../../services/voucherService";


export const fetchAllVouchers = createAsyncThunk(
  "voucher/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllVouchers();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNewVoucher = createAsyncThunk(
  "voucher/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createVoucher(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateExistingVoucher = createAsyncThunk(
  "voucher/update",
  async ({ voucherId, data }, { rejectWithValue }) => {
    try {
      return await updateVoucher(voucherId, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeVoucher = createAsyncThunk(
  "voucher/delete",
  async (data, { rejectWithValue }) => {
    try {
      return await deleteVoucher(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



export const fetchCollectibleVouchers = createAsyncThunk(
  "voucher/fetchCollectible",
  async (_, { rejectWithValue }) => {
    try {
      return await getCollectibleVouchers();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserVouchers = createAsyncThunk(
  "voucher/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserVouchers();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userApplyVoucher = createAsyncThunk(
  "voucher/apply",
  async (code, { rejectWithValue }) => {
    try {
      return await applyVoucher(code);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userCollectVoucher = createAsyncThunk(
  "voucher/collect",
  async (data, { rejectWithValue }) => {
    try {
      return await collectVoucher(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ================================
// Slice
// ================================

const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    allVouchers: [],
    collectibleVouchers: [],
    userVouchers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch all vouchers
      .addCase(fetchAllVouchers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.allVouchers = action.payload;
      })
      .addCase(fetchAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create voucher
      .addCase(createNewVoucher.fulfilled, (state, action) => {
        state.allVouchers.push(action.payload);
      })

      // Update voucher
      .addCase(updateExistingVoucher.fulfilled, (state, action) => {
        const index = state.allVouchers.findIndex(
          (v) => v.id === action.payload.id
        );
        if (index !== -1) {
          state.allVouchers[index] = action.payload;
        }
      })

      // Delete voucher
      .addCase(removeVoucher.fulfilled, (state, action) => {
        state.allVouchers = state.allVouchers.filter(
          (v) => v.id !== action.meta.arg.voucherId
        );
      })

      .addCase(fetchCollectibleVouchers.fulfilled, (state, action) => {
        state.collectibleVouchers = action.payload;
      })

      .addCase(fetchUserVouchers.fulfilled, (state, action) => {
        state.userVouchers = action.payload;
      })

      .addCase(userApplyVoucher.fulfilled, (state, action) => {
      })

      .addCase(userCollectVoucher.fulfilled, (state, action) => {
      });
  },
});

export default voucherSlice.reducer;
