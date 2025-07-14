import axiosInstance from "../utils/axiosInstance";

// Fetch ALL product images
export const fetchAllProductImages = async () => {
  const response = await axiosInstance.get("/product-image/list");
  return response.data;
};

// Fetch images by ProductID
export const fetchProductImagesByProduct = async (productId) => {
  const response = await axiosInstance.get(`/product/${productId}`);
  return response.data;
};

// Fetch images by VariantID
export const fetchProductImagesByVariant = async (variantId) => {
  const response = await axiosInstance.get(`/variant/${variantId}`);
  return response.data;
};

// Add new image (MULTIPART)
export const addProductImage = async (formData) => {
  const response = await axiosInstance.post(
    "/admin/product-image/add",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// Update image (MULTIPART)
export const updateProductImage = async (id, formData) => {
  const response = await axiosInstance.put(
    `/admin/product-image/update/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// Delete image
export const deleteProductImage = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/product-image/delete${id}`
  );
  return response.data;
};
