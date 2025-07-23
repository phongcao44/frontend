import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch all product images
 * @returns {Promise<any>} Raw data from backend
 */
export const fetchAllProductImages = async () => {
  try {
    const response = await axiosInstance.get("/product-image/list");
    return response.data;
  } catch (error) {
    console.error("fetchAllProductImages error:", error);
    throw extractApiError(error);
  }
};

/**
 * Fetch images by product ID
 * @param {number|string} productId
 * @returns {Promise<any>}
 */
export const fetchProductImagesByProduct = async (productId) => {
  try {
    const response = await axiosInstance.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      `fetchProductImagesByProduct error (ProductID: ${productId}):`,
      error
    );
    throw extractApiError(error);
  }
};

/**
 * Fetch images by variant ID
 * @param {number|string} variantId
 * @returns {Promise<any>}
 */
export const fetchProductImagesByVariant = async (variantId) => {
  try {
    const response = await axiosInstance.get(`/variant/${variantId}`);
    return response.data;
  } catch (error) {
    console.error(
      `fetchProductImagesByVariant error (VariantID: ${variantId}):`,
      error
    );
    throw extractApiError(error);
  }
};

/**
 * Add new product image (multipart/form-data)
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export const addProductImage = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/admin/product-image/add",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("addProductImage error:", error);
    throw extractApiError(error);
  }
};

/**
 * Update product image by ID (multipart/form-data)
 * @param {number|string} id
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export const updateProductImage = async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/admin/product-image/update/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`updateProductImage error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete product image by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteProductImage = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/product-image/delete/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`deleteProductImage error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Extract meaningful error message
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
