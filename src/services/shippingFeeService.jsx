import axiosInstance from "../utils/axiosInstance";

export const calculateShippingFee = async (addressId) => {
  try {
    const response = await axiosInstance.get(
      `/shipping/calculate/${addressId}`
    );
    return response.data;
  } catch (err) {
    console.error("Calculate shipping fee failed:", err);
    throw err;
  }
};

export const editOrderStatusByShipper = async (id, status) => {
  try {
    const response = await axiosInstance.put(
      `/shipping/edit-by-shipper/${id}`,
      status
    );
    return response.data;
  } catch (err) {
    console.error("Edit order status failed:", err);
    throw err;
  }
};
