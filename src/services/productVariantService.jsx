import axiosInstance from "../utils/axiosInstance";

/**
 * Fetch all product variants
 * @returns {Promise<any>}
 */
export const fetchAllProductVariants = async () => {
  try {
    const response = await axiosInstance.get("/product-variants/list");
    return response.data.data;
  } catch (error) {
    console.error("fetchAllProductVariants error:", error);
    throw extractApiError(error);
  }
};

/**
 * Fetch product variants by product ID
 * @param {number|string} productId
 * @returns {Promise<any>}
 */
export const fetchProductVariantsByProductId = async (productId) => {
  try {
    const response = await axiosInstance.get(`/product-variants/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `fetchProductVariantsByProductId error (ProductID: ${productId}):`,
      error
    );
    throw extractApiError(error);
  }
};

/**
 * Create a new product variant
 * @param {Object} variantData
 * @returns {Promise<any>}
 */
export const createProductVariant = async (variantData) => {
  try {
    const response = await axiosInstance.post(
      "/admin/product-variants/add",
      variantData
    );
    return response.data.data;
  } catch (error) {
    console.error("createProductVariant error:", error);
    throw extractApiError(error);
  }
};

/**
 * Update a product variant by ID
 * @param {number|string} id
 * @param {Object} variantData
 * @returns {Promise<any>}
 */
export const updateProductVariant = async (id, variantData) => {
  try {
    const response = await axiosInstance.put(
      `/admin/product-variants/update/${id}`,
      variantData
    );
    return response.data.data;
  } catch (error) {
    console.error(`updateProductVariant error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Delete a product variant by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const deleteProductVariant = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/product-variants/delete/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`deleteProductVariant error (ID: ${id}):`, error);
    throw extractApiError(error);
  }
};

/**
 * Fetch detail of a product variant by ID
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const fetchProductVariantDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/product-variants/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error(`fetchProductVariantDetail error (ID: ${id}):`, error);
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
