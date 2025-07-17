import axiosInstance from "../utils/axiosInstance";

export const getDeliveredProducts = async () => {
  return axiosInstance.get("/user/orders/delivered");
};

export const submitReturnRequest = async (formData) => {
  return axiosInstance.post("/user/return-request/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getReturnRequestsByUser = async () => {
  const response = await axiosInstance.get("/user/my-requests/list");
  return response.data;
};
