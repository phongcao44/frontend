/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkoutCart,
  checkoutByCartItem,
  checkoutSelectedItems,
} from "../../services/cartService";
import axios from "axios";
import Cookies from "js-cookie";


export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    return await fetchCart();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (payload, thunkAPI) => {
    try {
      const response = await addToCart(payload);
      return { cartItem: response, payload }; // Trả về cả cartItem và payload gốc
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      return await updateCartItem(cartItemId, quantity);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (cartItemId, thunkAPI) => {
    try {
      return await removeCartItem(cartItemId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (_, thunkAPI) => {
    try {
      return await clearCart();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const checkoutUserCart = createAsyncThunk(
  "cart/checkoutUserCart",
  async (payload, thunkAPI) => {
    try {
      return await checkoutCart(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const checkoutSingleCartItem = createAsyncThunk(
  "cart/checkoutSingleCartItem",
  async ({ cartItemId, payload }, thunkAPI) => {
    try {
      return await checkoutByCartItem(cartItemId, payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const checkoutSelectedItemsThunk = createAsyncThunk(
  "cart/checkoutSelectedItems",
  async (payload, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");  // Lấy token từ cookie

      const res = await axios.post(
        "http://localhost:8080/api/v1/user/carts/checkout/selected",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Gán token vào header
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("🔥 Checkout API error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Lỗi không xác định";

      return rejectWithValue({ message });
    }
  }
);



const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: { items: [] }, // Khởi tạo cart với mảng items
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === getCart ===
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        // Đảm bảo cart luôn có mảng items
        const payloadCart = action.payload || {};
        state.cart = {
          ...payloadCart,
          items: Array.isArray(payloadCart?.items) ? payloadCart.items : [],
        };
        state.loading = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === addItemToCart ===
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const { cartItem } = action.payload || {};
        // Đảm bảo state.cart tồn tại và có mảng items
        if (!state.cart || typeof state.cart !== "object") {
          state.cart = { items: [] };
        }
        if (!Array.isArray(state.cart.items)) {
          state.cart.items = [];
        }
        // Chỉ push khi cartItem hợp lệ để tránh lỗi
        if (cartItem) {
          state.cart.items.push(cartItem);
        }
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === updateCartItemQuantity ===
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const payloadCart = action.payload || {};
        state.cart = {
          ...payloadCart,
          items: Array.isArray(payloadCart?.items) ? payloadCart.items : [],
        };
        state.loading = false;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === removeItemFromCart ===
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const payloadCart = action.payload || {};
        state.cart = {
          ...payloadCart,
          items: Array.isArray(payloadCart?.items) ? payloadCart.items : [],
        };
        state.loading = false;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === clearUserCart ===
      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.cart = { items: [] };
        state.loading = false;
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === checkoutUserCart ===
      .addCase(checkoutUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutUserCart.fulfilled, (state) => {
        state.cart = { items: [] };
        state.loading = false;
      })
      .addCase(checkoutUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === checkoutSingleCartItem ===
      .addCase(checkoutSingleCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutSingleCartItem.fulfilled, (state) => {
        state.cart = { items: [] };
        state.loading = false;
      })
      .addCase(checkoutSingleCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === checkoutSelectedItems ===
      .addCase(checkoutSelectedItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutSelectedItemsThunk.fulfilled, (state) => {
        state.cart = { items: [] };
        state.loading = false;
      })
      .addCase(checkoutSelectedItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer; 