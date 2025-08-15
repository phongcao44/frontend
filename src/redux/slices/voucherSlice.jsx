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
  getUnusedVouchers,
  getUsedVouchers,
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
  async (voucherId, { rejectWithValue }) => {
    try {
      return await deleteVoucher(voucherId);
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

export const fetchUnusedVouchers = createAsyncThunk(
  "voucher/fetchUnused",
  async (_, { rejectWithValue }) => {
    try {
      return await getUnusedVouchers();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUsedVouchers = createAsyncThunk(
  "voucher/fetchUsed",
  async (_, { rejectWithValue }) => {
    try {
      return await getUsedVouchers();
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
    unusedVouchers: [],
    usedVouchers: [],
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
        const parseNumberSafe = (val) => {
          if (val === null || val === undefined) return 0;
          if (typeof val === "number") return val;
          if (typeof val === "string") {
            const cleaned = val.replace(/[^0-9.-]/g, "");
            const num = Number(cleaned);
            return isFinite(num) ? num : 0;
          }
          const num = Number(val);
          return isFinite(num) ? num : 0;
        };

        state.allVouchers = (action.payload || []).map((v) => {
          const discountPercent = parseNumberSafe(v?.discountPercent);
          let discountAmount = parseNumberSafe(v?.discountAmount);
          const maxDiscount = parseNumberSafe(v?.maxDiscount);
          const minOrderAmount = parseNumberSafe(v?.minOrderAmount);
          const quantity = parseNumberSafe(v?.quantity);
          const inferredType = v?.discountType || (discountPercent > 0 ? "percent" : "amount");
          // Compat: some BE send fixed discount in maxDiscount when type is amount
          if ((v?.discountType === "amount" || inferredType === "amount") && (!discountAmount || discountAmount <= 0) && maxDiscount > 0) {
            discountAmount = maxDiscount;
          }
          return {
            ...v,
            discountPercent,
            discountAmount,
            maxDiscount,
            minOrderAmount,
            quantity,
            discountType: inferredType,
            deleted: Boolean(v?.deleted),
          };
        });
      })
      .addCase(fetchAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create voucher
      .addCase(createNewVoucher.fulfilled, (state, action) => {
        const parseNumberSafe = (val) => {
          if (val === null || val === undefined) return 0;
          if (typeof val === "number") return val;
          if (typeof val === "string") {
            const cleaned = val.replace(/[^0-9.-]/g, "");
            const num = Number(cleaned);
            return isFinite(num) ? num : 0;
          }
          const num = Number(val);
          return isFinite(num) ? num : 0;
        };
        const v = action.payload || {};
        const discountPercent = parseNumberSafe(v.discountPercent);
        let discountAmount = parseNumberSafe(v.discountAmount);
        const maxDiscount = parseNumberSafe(v.maxDiscount);
        const minOrderAmount = parseNumberSafe(v.minOrderAmount);
        const quantity = parseNumberSafe(v.quantity);
        const inferredType = v.discountType || (discountPercent > 0 ? "percent" : "amount");
        if ((v?.discountType === "amount" || inferredType === "amount") && (!discountAmount || discountAmount <= 0) && maxDiscount > 0) {
          discountAmount = maxDiscount;
        }
        state.allVouchers.push({
          ...v,
          discountPercent,
          discountAmount,
          maxDiscount,
          minOrderAmount,
          quantity,
          discountType: inferredType,
          deleted: Boolean(v.deleted),
        });
      })

      // Update voucher
      .addCase(updateExistingVoucher.fulfilled, (state, action) => {
        const parseNumberSafe = (val) => {
          if (val === null || val === undefined) return 0;
          if (typeof val === "number") return val;
          if (typeof val === "string") {
            const cleaned = val.replace(/[^0-9.-]/g, "");
            const num = Number(cleaned);
            return isFinite(num) ? num : 0;
          }
          const num = Number(val);
          return isFinite(num) ? num : 0;
        };
        const payload = action.payload || {};
        const discountPercent = parseNumberSafe(payload.discountPercent);
        let discountAmount = parseNumberSafe(payload.discountAmount);
        const maxDiscount = parseNumberSafe(payload.maxDiscount);
        const minOrderAmount = parseNumberSafe(payload.minOrderAmount);
        const quantity = parseNumberSafe(payload.quantity);
        const inferredType = payload.discountType || (discountPercent > 0 ? "percent" : "amount");
        if ((payload?.discountType === "amount" || inferredType === "amount") && (!discountAmount || discountAmount <= 0) && maxDiscount > 0) {
          discountAmount = maxDiscount;
        }

        const index = state.allVouchers.findIndex((v) => v.id === payload.id);
        if (index !== -1) {
          state.allVouchers[index] = {
            ...payload,
            discountPercent,
            discountAmount,
            maxDiscount,
            minOrderAmount,
            quantity,
            discountType: inferredType,
            deleted: Boolean(payload.deleted),
          };
        }
      })

      // Delete voucher
      .addCase(removeVoucher.fulfilled, (state, action) => {
        state.allVouchers = state.allVouchers.map((v) =>
          v.id === action.meta.arg ? { ...v, deleted: true } : v
        );
      })

      .addCase(fetchCollectibleVouchers.fulfilled, (state, action) => {
        state.collectibleVouchers = action.payload;
      })

      .addCase(fetchUserVouchers.fulfilled, (state, action) => {
        state.userVouchers = action.payload;
      })

      .addCase(fetchUnusedVouchers.fulfilled, (state, action) => {
        state.unusedVouchers = action.payload;
      })

      .addCase(fetchUsedVouchers.fulfilled, (state, action) => {
        state.usedVouchers = action.payload;
      })

      .addCase(userApplyVoucher.fulfilled, (state, action) => {
      })

      .addCase(userCollectVoucher.fulfilled, (state, action) => {
      });
  },
});

export default voucherSlice.reducer;
