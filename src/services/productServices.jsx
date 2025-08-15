import axiosInstance from "../utils/axiosInstance";

export const fetchAllProducts = async () => {
  const res = await axiosInstance.get("/");
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axiosInstance.get(`/${id}`);
  return res.data;
};

export const fetchProductBySlug = async (slug) => {
  const res = await axiosInstance.get(`/slug/${slug}`);
  return res.data;
};

export const fetchProductsPaginate = async ({
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  orderBy = "desc",
  keyword = "",
  categoryId = null,
  categorySlug = "",
  status = "",
  brandName = "",
  priceMin = null,
  priceMax = null,
  minRating = null,
}) => {
  try {
    const res = await axiosInstance.get("/paginate", {
      params: {
        page,
        limit,
        sortBy,
        orderBy,
        keyword,
        categoryId,
        categorySlug,
        status,
        brandName,
        priceMin,
        priceMax,
        minRating,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

export const fetchBrandsPaginate = async ({
  page = 0,
  limit = 10,
  sortBy = "brand",
  orderBy = "asc",
  categoryId = null,
  categorySlug = "",
}) => {
  try {
    const res = await axiosInstance.get("/brands/paginate", {
      params: {
        page,
        limit,
        sortBy,
        orderBy,
        categoryId,
        categorySlug,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching paginated brands:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch brands");
  }
};


export const fetchTopSellingProductsPaginate = async ({
  page = 0,
  limit = 10,
  sortBy = "soldQuantity",
  orderBy = "desc",
  keyword = "",
  categoryId = null,
  categorySlug = "",
  status = "",
  brandName = "",
  priceMin = null,
  priceMax = null,
  minRating = null,
}) => {
  try {
    const res = await axiosInstance.get("/products/top-selling/paginate", {
      params: {
        page,
        limit,
        sortBy,
        orderBy,
        keyword,
        categoryId,
        categorySlug,
        status,
        brandName,
        priceMin,
        priceMax,
        minRating,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching top selling paginated products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch top selling products");
  }
};

export const createProduct = async (productData) => {
  const res = await axiosInstance.post("/admin/product/add", productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await axiosInstance.put(
    `/admin/product/update/${id}`,
    productData
  );
  return res.data;
};

export const changeProductStatus = async (id) => {
  const res = await axiosInstance.put(`/admin/product/change-status/${id}`);
  return res.data;
};

export const searchProducts = async (keyword) => {
  const res = await axiosInstance.get("/product/search", {
    params: { keyword },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axiosInstance.delete(`/admin/product/delete/${id}`);
  return res.data;
};

export const fetchProductsByCategory = async (categoryId) => {
  const res = await axiosInstance.get(
    `/user/products/by-category/${categoryId}`
  );
  return res.data;
};

export const fetchTopLeastSellingProducts = async () => {
  const res = await axiosInstance.get("/admin/products/topLeastSell");
  return res.data;
};

export const trackProductView = async (id) => {
  const res = await axiosInstance.post(`/${id}/view`);
  return res.data;
};

export const fetchTopViewedProducts = async (limit = 10) => {
  const res = await axiosInstance.get("/top-viewed", {
    params: { limit },
  });
  return res.data;
};

export const fetchLeastViewedProducts = async (limit = 10) => {
  const res = await axiosInstance.get("/least-viewed", {
    params: { limit },
  });
  return res.data;
};

export const fetchTopBestSellingProducts = async () => {
  try {
    const res = await axiosInstance.get("/products/bestSell");
    return res.data;
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};

export const fetchRelatedProducts = async (id) => {
  const res = await axiosInstance.get(`/products/${id}/related`);
  return res.data;
};