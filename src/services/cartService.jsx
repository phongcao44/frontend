import axiosInstance from "../utils/axiosInstance";

// export const fetchCart = async () => {
//   const res = await axiosInstance.get("/user/carts");
//   return res.data;
// };

export const fetchCart = async () => {
  const res = await axiosInstance.get("/user/carts");
  const data = res.data;

  const itemsWithImage = data.items.map((item) => ({
    ...item,
    image: `https://picsum.photos/seed/${item.cartItemId}/200/200`,
  }));

  const result = {
    cartId: data.cartId,
    items: itemsWithImage,
  };

  return result;
};

export const addToCart = async (payload) => {
  const res = await axiosInstance.post("/user/carts/add", payload);
  return res.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const res = await axiosInstance.put(
    `/user/carts/update/${cartItemId}`,
    null,
    {
      params: { quantity },
    }
  );
  return res.data;
};

export const removeCartItem = async (cartItemId) => {
  const res = await axiosInstance.delete(`/user/carts/remove/${cartItemId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await axiosInstance.delete("/user/carts/clear");
  return res.data;
};

export const checkoutCart = async (orderPayload) => {
  const res = await axiosInstance.post("/user/carts/checkout", orderPayload);
  return res.data;
};

export const checkoutByCartItem = async (cartItemId, orderPayload) => {
  const res = await axiosInstance.post(
    `/user/carts/checkout/${cartItemId}`,
    orderPayload
  );
  return res.data;
};
