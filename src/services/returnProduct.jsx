import axiosInstance from "../utils/axiosInstance";

export const getDeliveredOrders = async () => {
  return axiosInstance.get("/user/orders/delivered");
};

export const submitReturnRequest = async ({ orderId, reason, media }) => {
  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("reason", reason);
  formData.append("media", media);

  return axiosInstance.post("/user/return-request/add", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

