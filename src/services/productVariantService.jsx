import axiosInstance from "../utils/axiosInstance";

export const fetchAllProductVariants = async () => {
  const res = await axiosInstance.get("/product-variants");
  return res.data.data;
};

export const fetchProductVariantsByProductId = async (productId) => {
  const res = await axiosInstance.get(`/product-variants/${productId}`);
  return res.data.data;
};

export const createProductVariant = async (variantData) => {
  const res = await axiosInstance.post("/product-variants/add", variantData);
  return res.data.data;
};

export const updateProductVariant = async (id, variantData) => {
  const res = await axiosInstance.put(
    `/product-variants/update/${id}`,
    variantData
  );
  return res.data.data;
};

export const deleteProductVariant = async (id) => {
  const res = await axiosInstance.delete(`/product-variants/delete/${id}`);
  return res.data.data;
};
