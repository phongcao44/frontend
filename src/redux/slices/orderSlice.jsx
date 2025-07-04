import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchOrders,
  fetchOrderDetail,
  updateOrderStatus,
  deleteOrder,
} from "../../services/orderService";

// --- LOAD LIST ---
export const loadOrders = createAsyncThunk(
  "order/loadOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchOrders();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// --- LOAD DETAIL ---
export const loadOrderDetail = createAsyncThunk(
  "order/loadOrderDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchOrderDetail(id);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// --- EDIT STATUS ---
export const editOrderStatus = createAsyncThunk(
  "order/editOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await updateOrderStatus(id, status);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// --- REMOVE ORDER ---
export const removeOrder = createAsyncThunk(
  "order/removeOrder",
  async (id, { rejectWithValue }) => {
    try {
      await deleteOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    list: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOAD LIST
      .addCase(loadOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOAD DETAIL
      .addCase(loadOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(loadOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(loadOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EDIT STATUS
      .addCase(editOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        // Update trong list nếu có
        state.list = state.list.map((order) =>
          order.orderId === updated.id ? { ...order, ...updated } : order
        );

        // Update chi tiết nếu đang mở
        if (state.currentOrder?.orderId === updated.id) {
          state.currentOrder = { ...state.currentOrder, ...updated };
        }
      })
      .addCase(editOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE ORDER
      .addCase(removeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.list = state.list.filter((o) => o.orderId !== id);
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
