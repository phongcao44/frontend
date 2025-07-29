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

export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    return await fetchCart();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (payload, thunkAPI) => {
    try {
      return await addToCart(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      return await updateCartItem(cartItemId, quantity);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (cartItemId, thunkAPI) => {
    try {
      return await removeCartItem(cartItemId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (_, thunkAPI) => {
    try {
      return await clearCart();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const checkoutUserCart = createAsyncThunk(
  "cart/checkoutUserCart",
  async (payload, thunkAPI) => {
    try {
      return await checkoutCart(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const checkoutSingleCartItem = createAsyncThunk(
  "cart/checkoutSingleCartItem",
  async ({ cartItemId, payload }, thunkAPI) => {
    try {
      return await checkoutByCartItem(cartItemId, payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const checkoutSelectedItemsThunk = createAsyncThunk(
  "cart/checkoutSelectedItems",
  async (payload, thunkAPI) => {
    try {
      return await checkoutSelectedItems(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
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
        state.cart = action.payload;
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
     //   state.cart = action.payload;
        state.cart.push(action.payload);
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
        state.cart = action.payload;
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
        state.cart = action.payload;
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
      .addCase(clearUserCart.fulfilled, (state, action) => {
        state.cart = action.payload;
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
      .addCase(checkoutUserCart.fulfilled, (state, action) => {
        state.cart = null;
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
      .addCase(checkoutSingleCartItem.fulfilled, (state, action) => {
        state.cart = null;
        state.loading = false;
      })
      .addCase(checkoutSingleCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(checkoutSelectedItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutSelectedItemsThunk.fulfilled, (state, action) => {
        state.cart = null;
        state.loading = false;
      })
      .addCase(checkoutSelectedItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
