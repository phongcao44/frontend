import axiosInstance from "../utils/axiosInstance";

export const createCodPayment = async (orderId) => {
  try {
    const res = await axiosInstance.post(`/payment/cod-payment/${orderId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Create COD Payment failed:", err);
    throw err;
  }
};

export const createVnpayPayment = async (orderId) => {
  try {
    // Gửi orderId theo cả PathVariable và QueryParam:
    const res = await axiosInstance.get(`/payment/vnpay-payment/${orderId}`, {
      params: { orderId: orderId },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Create VNPAY Payment failed:", err);
    throw err;
  }
};

/**
 * Gọi BE kiểm tra payment info (callback VNPAY)
 * @param {object} params
 * @returns {Promise}
 */
export const getPaymentInfo = async (params) => {
  try {
    const res = await axiosInstance.get("/payment/payment-info", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Get Payment Info failed:", err);
    throw err;
  }
};
