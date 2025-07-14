import axiosInstance from "../utils/axiosInstance";

export const fetchProvinces = async () => {
  try {
    const res = await axiosInstance.get("/user/provinces");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchDistricts = async (provinceId) => {
  try {
    const res = await axiosInstance.get("/user/districts", {
      params: { province_id: provinceId },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchWards = async (districtId) => {
  try {
    const res = await axiosInstance.get("/user/wards", {
      params: { district_id: districtId },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addAddress = async (addressData) => {
  try {
    const res = await axiosInstance.post("/user/address/add", addressData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const res = await axiosInstance.delete("/user/address/delete", {
      data: addressId,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const res = await axiosInstance.patch("/user/address/update", addressData, {
      params: { addressId: addressId },
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchAllAddresses = async () => {
  try {
    const res = await axiosInstance.get("/user/address/All");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
