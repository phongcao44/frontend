import axiosInstance from "../utils/axiosInstance";

export const fetchCart = async () => {
  try {
    const res = await axiosInstance.get("/user/carts");
    return res.data;

  } catch (err) {
    console.error("Fetch Cart failed:", err);
    throw err;
  }
};

export const addToCart = async (payload) => {
  try {
    const res = await axiosInstance.post("/user/carts/add", payload);
    return res.data;
  } catch (err) {
    console.error("Add to Cart failed:", err);
    throw err;
  }
};

export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const res = await axiosInstance.put(
      `/user/carts/update/${cartItemId}`,
      null,
      {
        params: { quantity },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Update Cart Item failed:", err);
    throw err;
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    const res = await axiosInstance.delete(`/user/carts/remove/${cartItemId}`);
    return res.data;
  } catch (err) {
    console.error("Remove Cart Item failed:", err);
    throw err;
  }
};

export const clearCart = async () => {
  try {
    const res = await axiosInstance.delete("/user/carts/clear");
    return res.data;
  } catch (err) {
    console.error("Clear Cart failed:", err);
    throw err;
  }
};

export const checkoutCart = async (orderPayload) => {
  try {
    const res = await axiosInstance.post("/user/carts/checkout", orderPayload);
    return res.data;
  } catch (err) {
    console.error("Checkout Cart failed:", err);
    throw err;
  }
};

export const checkoutByCartItem = async (cartItemId, orderPayload) => {
  try {
    const res = await axiosInstance.post(
      `/user/carts/checkout/${cartItemId}`,
      orderPayload
    );
    return res.data;
  } catch (err) {
    console.error("Checkout By CartItem failed:", err);
    throw err;
  }
};

export const checkoutSelectedItems = async (orderPayload) => {
  try {
    const res = await axiosInstance.post(
      "/user/carts/checkout/selected",
      orderPayload
    );
    return res.data;
  } catch (err) {
    console.error("Checkout Selected Items failed:", err);
    throw err;
  }
};
