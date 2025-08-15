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
  getVouchersByUserId,
  addVoucherToUser,
  removeVoucherFromUser,
} from "../../services/voucherService";

// Helper function for safe number parsing
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

// Helper function to normalize voucher data
const normalizeVoucherData = (voucher) => {
  if (!voucher) return null;
  
  const v = { ...voucher };
  const discountPercent = parseNumberSafe(v.discountPercent);
  let discountAmount = parseNumberSafe(v.discountAmount);
  const maxDiscount = parseNumberSafe(v.maxDiscount);
  const minOrderAmount = parseNumberSafe(v.minOrderAmount);
  const quantity = parseNumberSafe(v.quantity);
  const inferredType = v.discountType || (discountPercent > 0 ? "percent" : "amount");
  
  // Compatibility: some BE send fixed discount in maxDiscount when type is amount
  if ((v?.discountType === "amount" || inferredType === "amount") && 
      (!discountAmount || discountAmount <= 0) && maxDiscount > 0) {
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
    deleted: Boolean(v.deleted),
  };
};

// ================================
// Async Thunks
// ================================

// Admin thunks
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
      await deleteVoucher(voucherId);
      return voucherId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVouchersByUserId = createAsyncThunk(
  "voucher/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      return await getVouchersByUserId(userId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const adminAddVoucherToUser = createAsyncThunk(
  "voucher/adminAddToUser",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      return await addVoucherToUser(userId, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const adminRemoveVoucherFromUser = createAsyncThunk(
  "voucher/adminRemoveFromUser",
  async ({ userId, voucherId }, { rejectWithValue }) => {
    try {
      await removeVoucherFromUser(userId, voucherId);
      return { userId, voucherId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// User thunks
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
    // Data states
    allVouchers: [],
    collectibleVouchers: [],
    userVouchers: [],
    unusedVouchers: [],
    usedVouchers: [],
    userSpecificVouchers: [], // For admin viewing user's vouchers
    appliedVoucher: null,
    
    // Loading states
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    applyLoading: false,
    collectLoading: false,
    
    // Error states
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    applyError: null,
    collectError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.applyError = null;
      state.collectError = null;
    },
    clearAppliedVoucher: (state) => {
      state.appliedVoucher = null;
    },
    resetUserVouchers: (state) => {
      state.userVouchers = [];
      state.unusedVouchers = [];
      state.usedVouchers = [];
      state.collectibleVouchers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ================================
      // Fetch All Vouchers (Admin)
      // ================================
      .addCase(fetchAllVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allVouchers = (action.payload || []).map(normalizeVoucherData);
      })
      .addCase(fetchAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Create Voucher (Admin)
      // ================================
      .addCase(createNewVoucher.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createNewVoucher.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        const normalizedVoucher = normalizeVoucherData(action.payload);
        if (normalizedVoucher) {
          state.allVouchers.push(normalizedVoucher);
        }
      })
      .addCase(createNewVoucher.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || action.error.message;
      })

      // ================================
      // Update Voucher (Admin)
      // ================================
      .addCase(updateExistingVoucher.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateExistingVoucher.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        const normalizedPayload = normalizeVoucherData(action.payload);
        if (normalizedPayload) {
          const index = state.allVouchers.findIndex((v) => v.id === normalizedPayload.id);
          if (index !== -1) {
            state.allVouchers[index] = normalizedPayload;
          }
        }
      })
      .addCase(updateExistingVoucher.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || action.error.message;
      })

      // ================================
      // Delete Voucher (Admin)
      // ================================
      .addCase(removeVoucher.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(removeVoucher.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        const voucherId = action.payload;
        state.allVouchers = state.allVouchers.map((v) =>
          v.id === voucherId ? { ...v, deleted: true } : v
        );
      })
      .addCase(removeVoucher.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || action.error.message;
      })

      // ================================
      // Fetch Vouchers by User ID (Admin)
      // ================================
      .addCase(fetchVouchersByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchersByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userSpecificVouchers = action.payload || [];
      })
      .addCase(fetchVouchersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Admin Add Voucher to User
      // ================================
      .addCase(adminAddVoucherToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminAddVoucherToUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally update userSpecificVouchers if needed
      })
      .addCase(adminAddVoucherToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Admin Remove Voucher from User
      // ================================
      .addCase(adminRemoveVoucherFromUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRemoveVoucherFromUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { voucherId } = action.payload;
        state.userSpecificVouchers = state.userSpecificVouchers.filter(v => v.id !== voucherId);
      })
      .addCase(adminRemoveVoucherFromUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Fetch Collectible Vouchers (User)
      // ================================
      .addCase(fetchCollectibleVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectibleVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.collectibleVouchers = action.payload || [];
      })
      .addCase(fetchCollectibleVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Fetch User Vouchers
      // ================================
      .addCase(fetchUserVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userVouchers = action.payload || [];
      })
      .addCase(fetchUserVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Fetch Unused Vouchers (User)
      // ================================
      .addCase(fetchUnusedVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnusedVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.unusedVouchers = action.payload || [];
      })
      .addCase(fetchUnusedVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Fetch Used Vouchers (User)
      // ================================
      .addCase(fetchUsedVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsedVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.usedVouchers = action.payload || [];
      })
      .addCase(fetchUsedVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================================
      // Apply Voucher (User)
      // ================================
      .addCase(userApplyVoucher.pending, (state) => {
        state.applyLoading = true;
        state.applyError = null;
      })
      .addCase(userApplyVoucher.fulfilled, (state, action) => {
        state.applyLoading = false;
        state.applyError = null;
        state.appliedVoucher = action.payload;
      })
      .addCase(userApplyVoucher.rejected, (state, action) => {
        state.applyLoading = false;
        state.applyError = action.payload || action.error.message;
        state.appliedVoucher = null;
      })

      // ================================
      // Collect Voucher (User)
      // ================================
      .addCase(userCollectVoucher.pending, (state) => {
        state.collectLoading = true;
        state.collectError = null;
      })
      .addCase(userCollectVoucher.fulfilled, (state, action) => {
        state.collectLoading = false;
        state.collectError = null;
        // Optionally remove from collectible vouchers
        // state.collectibleVouchers = state.collectibleVouchers.filter(v => v.code !== action.meta.arg.voucherCode);
      })
      .addCase(userCollectVoucher.rejected, (state, action) => {
        state.collectLoading = false;
        state.collectError = action.payload || action.error.message;
      });
  },
});

export const { 
  clearErrors, 
  clearAppliedVoucher, 
  resetUserVouchers 
} = voucherSlice.actions;

export default voucherSlice.reducer;