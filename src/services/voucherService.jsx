import axiosInstance from "../utils/axiosInstance";

// Admin - create voucher
export const createVoucher = async (data) => {
  try {
    const res = await axiosInstance.post("/admin/vouchers", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin - update voucher
export const updateVoucher = async (voucherId, data) => {
  try {
    const res = await axiosInstance.put(
      `/admin/voucher/update/${voucherId}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Admin - delete voucher
export const deleteVoucher = async (data) => {
  try {
    const res = await axiosInstance.delete("/admin/voucher/delete", {
      data, 
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin - get all vouchers
export const getAllVouchers = async () => {
  try {
    const res = await axiosInstance.get("/admin/voucher/all");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User - apply voucher
export const applyVoucher = async (code) => {
  try {
    const res = await axiosInstance.post("/user/voucher/apply", null, {
      params: { code },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User - collect voucher
export const collectVoucher = async (data) => {
  try {
    const res = await axiosInstance.post("/user/voucher/collect", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User - get collectible vouchers
export const getCollectibleVouchers = async () => {
  try {
    const res = await axiosInstance.get("/user/voucher/available");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User - get user's vouchers
export const getUserVouchers = async () => {
  try {
    const res = await axiosInstance.get("/user/voucher/viewVoucher");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User - get unused vouchers
export const getUnusedVouchers = async () => {
  try {
    const res = await axiosInstance.get("/user/voucher/viewVoucherFalse");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User - get used vouchers
export const getUsedVouchers = async () => {
  try {
    const res = await axiosInstance.get("/user/voucher/viewVoucherTrue");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
