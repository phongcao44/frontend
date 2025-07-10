import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllReturnRequests,
  fetchReturnRequestById,
  updateReturnRequestStatus,
} from "../../services/returnRequestService";

// Thunk: Load all return requests
export const loadReturnRequests = createAsyncThunk(
  "returnRequest/loadAll",
  async () => {
    const data = await fetchAllReturnRequests();
    return data;
  }
);

// Thunk: Load return request detail
export const loadReturnRequestDetail = createAsyncThunk(
  "returnRequest/loadDetail",
  async (id) => {
    const data = await fetchReturnRequestById(id);
    return data;
  }
);

// Thunk: Update return request status
export const updateReturnStatus = createAsyncThunk(
  "returnRequest/updateStatus",
  async ({ id, status }) => {
    const data = await updateReturnRequestStatus(id, status);
    return data;
  }
);

const returnRequestSlice = createSlice({
  name: "returnRequest",
  initialState: {
    list: [],
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDetail: (state) => {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all
      .addCase(loadReturnRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadReturnRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadReturnRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Load detail
      .addCase(loadReturnRequestDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadReturnRequestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(loadReturnRequestDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update status
      .addCase(updateReturnStatus.fulfilled, (state, action) => {
        // Cập nhật trạng thái trong danh sách nếu đang có
        const updated = action.payload;
        const index = state.list.findIndex((r) => r.id === updated.id);
        if (index !== -1) {
          state.list[index] = updated;
        }
        // Nếu đang xem chi tiết thì cập nhật luôn
        if (state.detail?.id === updated.id) {
          state.detail = updated;
        }
      });
  },
});

export const { clearDetail } = returnRequestSlice.actions;
export default returnRequestSlice.reducer;
