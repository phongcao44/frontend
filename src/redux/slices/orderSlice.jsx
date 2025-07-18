import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchOrders,
  fetchOrderDetail,
  updateOrderStatus,
  deleteOrder,
  fetchPaginatedOrders,
} from "../../services/orderService";

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

export const loadPaginatedOrders = createAsyncThunk(
  "order/loadPaginatedOrders",
  async (
    {
      page = 0,
      limit = 10,
      sortBy = "createdAt",
      orderBy = "desc",
      status = "",
      keyword = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchPaginatedOrders({
        page,
        limit,
        sortBy,
        orderBy,
        status,
        keyword,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    list: {
      content: [],
      totalElements: 0,
      totalPages: 1,
    },
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
      .addCase(loadOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = {
          content: action.payload,
          totalElements: action.payload.length,
          totalPages: 1,
        };
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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

      .addCase(editOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.list.content = state.list.content.map((order) =>
          order.orderId === updated.id ? { ...order, ...updated } : order
        );
        if (state.currentOrder?.orderId === updated.id) {
          state.currentOrder = { ...state.currentOrder, ...updated };
        }
      })
      .addCase(editOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.list.content = state.list.content.filter((o) => o.orderId !== id);
        state.list.totalElements -= 1;
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadPaginatedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPaginatedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = {
          content: action.payload.content || [],
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 1,
        };
      })
      .addCase(loadPaginatedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
