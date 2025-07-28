import axiosInstance from "../utils/axiosInstance";

// ===============================
// Flash Sale
// ===============================

export const getFlashSales = async () => {
  try {
    const response = await axiosInstance.get("/flash_sale/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching flash sales:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch flash sales");
  }
};

export const getFlashSaleDetails = async (flashSaleId) => {
  try {
    const response = await axiosInstance.get(`/flash_sale/detail/${flashSaleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flash sale details for ID ${flashSaleId}:`, error);
    throw new Error(error.response?.data?.message || "Failed to fetch flash sale details");
  }
};

export const getActiveFlashSale = async () => {
  try {
    const response = await axiosInstance.get("/flash_sale/active");
    return response.data;
  } catch (error) {
    console.error("Error fetching active flash sale:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch active flash sale");
  }
};

export const addFlashSale = async (data) => {
  try {
    const response = await axiosInstance.post("/flash_sale/add", data);
    return response.data;
  } catch (error) {
    console.error("Error adding flash sale:", error);
    throw new Error(error.response?.data?.message || "Failed to add flash sale");
  }
};

export const editFlashSale = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/flash_sale/edit/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error editing flash sale with ID ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to edit flash sale");
  }
};

export const deleteFlashSale = async (id) => {
  try {
    const response = await axiosInstance.delete(`/flash_sale/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting flash sale with ID ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to delete flash sale");
  }
};

// ===============================
// Flash Sale Items
// ===============================

export const getFlashSaleItems = async (flashSaleId) => {
  try {
    const response = await axiosInstance.get(`/flash_sale/detail/${flashSaleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flash sale items for flash sale ID ${flashSaleId}:`, error);
    throw new Error(error.response?.data?.message || "Failed to fetch flash sale items");
  }
};

export const getFlashSaleVariantDetails = async (flashSaleId) => {
  try {
    const response = await axiosInstance.get(`/flash_sale/flash_sale_items/detail/${flashSaleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flash sale variant details for flash sale ID ${flashSaleId}:`, error);
    throw new Error(error.response?.data?.message || "Failed to fetch flash sale variant details");
  }
};

export const addFlashSaleItem = async (data) => {
  try {
    const response = await axiosInstance.post("/flash_sale/flash_sale_items/add", data);
    return response.data;
  } catch (error) {
    console.error("Error adding flash sale item:", error);
    throw new Error(error.response?.data?.message || "Failed to add flash sale item");
  }
};

export const editFlashSaleItem = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/flash_sale/flash_sale_items/edit/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error editing flash sale item with ID ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to edit flash sale item");
  }
};

export const deleteFlashSaleItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/flash_sale/flash_sale_items/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting flash sale item with ID ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to delete flash sale item");
  }
};