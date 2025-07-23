import axiosInstance from "../utils/axiosInstance";

/**
 * Create a COD payment for an order
 * @param {number|string} orderId
 * @returns {Promise<any>}
 */
export const createCodPayment = async (orderId) => {
  try {
    const response = await axiosInstance.post(
      `/payment/cod-payment/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error(`createCodPayment error (OrderID: ${orderId}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Create a VNPAY payment for an order
 * @param {number|string} orderId
 * @returns {Promise<any>}
 */
export const createVnpayPayment = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/payment/vnpay-payment/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`createVnpayPayment error (OrderID: ${orderId}):`, error);
    throw extractApiError(error);
  }
};


/**
 * Get payment info (used for VNPAY callback)
 * @param {Object} params
 * @returns {Promise<any>}
 */
export const getPaymentInfo = async (params) => {
  try {
    const response = await axiosInstance.get("/payment/payment-info", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("getPaymentInfo error:", error);
    throw extractApiError(error);
  }
};

/**
 * Extract and format API error
 * @param {any} error
 * @returns {Error}
 */
const extractApiError = (error) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Unknown error";
  return new Error(message);
};
