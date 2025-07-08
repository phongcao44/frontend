import axiosInstance from "../utils/axiosInstance";

export const fetchAllProductVariants = async () => {
  const res = await axiosInstance.get("/product-variants/list");
  return res.data.data;
};

export const fetchProductVariantsByProductId = async (productId) => {
  const res = await axiosInstance.get(`/product-variants/${productId}`);
  return res.data.data;
};

export const createProductVariant = async (variantData) => {
  const res = await axiosInstance.post("/admin/add", variantData);
  return res.data.data;
};

export const updateProductVariant = async (id, variantData) => {
  const res = await axiosInstance.put(`/admin/update/${id}`, variantData);
  return res.data.data;
};

export const deleteProductVariant = async (id) => {
  const res = await axiosInstance.delete(`/admin/delete/${id}`);
  return res.data.data;
};

export const fetchProductVariantDetail = async (id) => {
  const res = await axiosInstance.get(`/product-variants/detail/${id}`);
  return res.data;
};
