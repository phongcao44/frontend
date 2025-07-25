import axiosInstance from "../utils/axiosInstance";

export const fetchAllProducts = async () => {
  const res = await axiosInstance.get("/");
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axiosInstance.get(`/${id}`);
  return res.data;
};

export const fetchProductsPaginate = async ({
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  orderBy = "desc",
  keyword = "",
  categoryId = null,
  status = "",
  brandName = "",
  priceMin = null,
  priceMax = null,
  minRating = null,
}) => {
  const res = await axiosInstance.get("/paginate", {
    params: {
      page,
      limit,
      sortBy,
      orderBy,
      keyword,
      categoryId,
      status,
      brandName,
      priceMin,
      priceMax,
      minRating,
    },
  });
  return res.data;
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
    const items = res.data || [];

    const results = items.map((item) => {
      // Tự mock 2 ảnh giả
      const images = Array.from({ length: 2 }, (_, i) => ({
        id: `img-${item.id}-${i + 1}`,
        image_url: `https://picsum.photos/seed/${item.id}-${i + 1}/720/720`,
        is_main: i === 0,
      }));

      return {
        ...item,
        id: `${item.id}`,
        name: item.productName,
        images,
        averageRating: Math.floor(Math.random() * 2) + 3,
        totalReviews: Math.floor(Math.random() * 50) + 1,
      };
    });
    return results;
  } catch (err) {
    console.error("❌ Lỗi fetchTopBestSellingProducts:", err);
    return [];
  }
};
