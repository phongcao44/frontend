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
  checkoutSelectedItemsPreview,
} from "../../services/cartService";

// === Thunks ===
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    return await fetchCart();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data || { message: err.message }
    );
  }
});

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (payload, thunkAPI) => {
    try {
      const response = await addToCart(payload);
      return { cartItem: response, payload };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      const response = await updateCartItem(cartItemId, quantity);
      return { cartItemId, quantity, updatedItem: response };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (cartItemId, thunkAPI) => {
    try {
      await removeCartItem(cartItemId);
      return cartItemId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (_, thunkAPI) => {
    try {
      return await clearCart();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const checkoutUserCart = createAsyncThunk(
  "cart/checkoutUserCart",
  async (payload, thunkAPI) => {
    try {
      return await checkoutCart(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const checkoutSingleCartItem = createAsyncThunk(
  "cart/checkoutSingleCartItem",
  async ({ cartItemId, payload }, thunkAPI) => {
    try {
      return await checkoutByCartItem(cartItemId, payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const checkoutSelectedItemsThunk = createAsyncThunk(
  "cart/checkoutSelectedItems",
  async (payload, thunkAPI) => {
    try {
      return await checkoutSelectedItems(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const checkoutSelectedItemsPreviewThunk = createAsyncThunk(
  "cart/checkoutSelectedItemsPreview",
  async (payload, thunkAPI) => {
    try {
      return await checkoutSelectedItemsPreview(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

// === Slice ===
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: { items: [], subtotal: 0, discount: 0, grandTotal: 0 },
    preview: null,
    selectedItems: [],
    loading: false,
    itemLoading: {},
    error: null,
    optimisticUpdates: {},
  },
  reducers: {
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    clearPreview: (state) => {
      state.preview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === getCart ===
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        const payloadCart = action.payload || {};
        state.cart = {
          ...payloadCart,
          items: Array.isArray(payloadCart.items) ? payloadCart.items : [],
          subtotal: payloadCart.subtotal || 0,
          discount: payloadCart.discount || 0,
          grandTotal: payloadCart.grandTotal || 0,
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
        if (!state.cart || typeof state.cart !== "object") {
          state.cart = { items: [], subtotal: 0, discount: 0, grandTotal: 0 };
        }
        if (!Array.isArray(state.cart.items)) {
          state.cart.items = [];
        }
        if (cartItem) {
          state.cart.items.push(cartItem);
          state.cart.subtotal += cartItem.totalPrice || 0;
          state.cart.discount +=
            (cartItem.discountAmount || 0) * (cartItem.quantity || 1);
          state.cart.grandTotal = state.cart.subtotal - state.cart.discount;
        }
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === updateCartItemQuantity ===
      .addCase(updateCartItemQuantity.pending, (state, action) => {
        const { cartItemId, quantity } = action.meta.arg;
        state.itemLoading[cartItemId] = true;
        state.error = null;

        // Optimistic update: Update quantity and recalculate item totals
        const item = state.cart.items.find((i) => i.cartItemId === cartItemId);
        if (item) {
          // Store previous state for rollback
          state.optimisticUpdates[cartItemId] = { ...item };
          
          // Update quantity only; keep pricing until server responds to avoid incorrect math
          item.quantity = quantity;
        }
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { cartItemId, updatedItem } = action.payload;
        // Some backends return the full cart on update; others return the updated item
        const isFullCartResponse = updatedItem && Array.isArray(updatedItem.items);

        if (isFullCartResponse) {
          const payloadCart = updatedItem || {};
          state.cart = {
            ...payloadCart,
            items: Array.isArray(payloadCart.items) ? payloadCart.items : [],
            subtotal: payloadCart.subtotal || 0,
            discount: payloadCart.discount || 0,
            grandTotal: payloadCart.grandTotal || 0,
          };
        } else {
          const item = state.cart.items.find((i) => i.cartItemId === cartItemId);
          if (item && updatedItem) {
            // Update fields with API response, with fallbacks
            item.quantity = updatedItem.quantity ?? item.quantity;
            item.discountedPrice = updatedItem.discountedPrice ?? item.discountedPrice;
            item.originalPrice = updatedItem.originalPrice ?? item.originalPrice;
            item.totalPrice =
              updatedItem.totalPrice ?? (item.discountedPrice || item.originalPrice || 0) * (item.quantity || 0);
            // Keep discountAmount as per-unit if backend provides per-unit; otherwise accept backend value
            item.discountAmount =
              updatedItem.discountAmount ?? item.discountAmount;
            item.flags = updatedItem.flags ?? item.flags;
            item.discountType = updatedItem.discountType ?? item.discountType;
            item.discountOverrideByFlashSale =
              updatedItem.discountOverrideByFlashSale ?? item.discountOverrideByFlashSale;

            // Recalculate cart totals from items
            state.cart.subtotal = state.cart.items.reduce(
              (sum, i) => sum + (i.totalPrice || 0),
              0
            );
            state.cart.discount = state.cart.items.reduce(
              (sum, i) => sum + ((i.discountAmount || 0) * (i.quantity || 1)),
              0
            );
            state.cart.grandTotal = state.cart.subtotal - state.cart.discount;
          }
        }

        delete state.itemLoading[cartItemId];
        delete state.optimisticUpdates[cartItemId];
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        const { cartItemId } = action.meta.arg;
        const prevItem = state.optimisticUpdates[cartItemId];
        if (prevItem) {
          // Rollback to previous state
          const item = state.cart.items.find((i) => i.cartItemId === cartItemId);
          if (item) {
            Object.assign(item, prevItem);
          }
          // Recalculate cart totals
          state.cart.subtotal = state.cart.items.reduce(
            (sum, i) => sum + (i.totalPrice || 0),
            0
          );
          state.cart.discount = state.cart.items.reduce(
            (sum, i) => sum + (i.discountAmount || 0) * (i.quantity || 1),
            0
          );
          state.cart.grandTotal = state.cart.subtotal - state.cart.discount;
        }
        delete state.itemLoading[cartItemId];
        delete state.optimisticUpdates[cartItemId];
        state.error = action.payload;
      })

      // === removeItemFromCart ===
      .addCase(removeItemFromCart.pending, (state, action) => {
        const cartItemId = action.meta.arg;
        state.itemLoading[cartItemId] = true;
        const item = state.cart.items.find((i) => i.cartItemId === cartItemId);
        if (item) {
          state.optimisticUpdates[cartItemId] = { ...item };
          state.cart.subtotal -= item.totalPrice || 0;
          state.cart.discount -= (item.discountAmount || 0) * (item.quantity || 1);
          state.cart.grandTotal = state.cart.subtotal - state.cart.discount;
        }
        state.cart.items = state.cart.items.filter(
          (item) => item.cartItemId !== cartItemId
        );
        // Fix: remove from selectedItems by id instead of corrupting it with item objects
        state.selectedItems = state.selectedItems.filter((id) => id !== cartItemId);
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const cartItemId = action.payload;
        delete state.itemLoading[cartItemId];
        delete state.optimisticUpdates[cartItemId];
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        const cartItemId = action.meta.arg;
        const prevItem = state.optimisticUpdates[cartItemId];
        if (prevItem) {
          state.cart.items.push(prevItem);
          state.cart.subtotal += prevItem.totalPrice || 0;
          state.cart.discount +=
            (prevItem.discountAmount || 0) * (prevItem.quantity || 1);
          state.cart.grandTotal = state.cart.subtotal - state.cart.discount;
        }
        delete state.itemLoading[cartItemId];
        delete state.optimisticUpdates[cartItemId];
        state.error = action.payload;
      })

      // === clearUserCart ===
      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.cart = { items: [], subtotal: 0, discount: 0, grandTotal: 0 };
        state.selectedItems = [];
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
        state.cart = { items: [], subtotal: 0, discount: 0, grandTotal: 0 };
        state.selectedItems = [];
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
        state.cart = { items: [], subtotal: 0, discount: 0, grandTotal: 0 };
        state.selectedItems = [];
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
        state.cart = { items: [], subtotal: 0, discount: 0, grandTotal: 0 };
        state.selectedItems = [];
        state.loading = false;
      })
      .addCase(checkoutSelectedItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === checkoutSelectedItemsPreview ===
      .addCase(checkoutSelectedItemsPreviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutSelectedItemsPreviewThunk.fulfilled, (state, action) => {
        state.preview = action.payload || null;
        state.loading = false;
      })
      .addCase(checkoutSelectedItemsPreviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Clear cart on logout ===
      .addCase("auth/logout/fulfilled", (state) => {
        state.cart = { items: [], subtotal: 0, discount: 0, grandTotal: 0 };
        state.preview = null;
        state.selectedItems = [];
        state.loading = false;
        state.itemLoading = {};
        state.error = null;
      })
      .addCase("auth/logout/rejected", (state) => {
        state.cart = { items: [], subtotal: 0, discount: 0, grandTotal: 0 };
        state.preview = null;
        state.selectedItems = [];
        state.loading = false;
        state.itemLoading = {};
        state.error = null;
      });
  },
});

export const { setSelectedItems, clearPreview } = cartSlice.actions;
export default cartSlice.reducer;