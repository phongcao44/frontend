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
  sortBy = "price",
  orderBy = "asc",
  keyword = "",
  status = "",
}) => {
  const res = await axiosInstance.get("/paginate", {
    params: { page, limit, sortBy, orderBy, keyword, status },
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

export const fetchMergedProducts = async (page = 0, limit = 10) => {
  try {
    const [productsRes, variantsRes, colorsRes, sizesRes] = await Promise.all([
      axiosInstance.get(
        `/paginate?page=${page}&limit=${limit}&sortBy=price&orderBy=asc`
      ),
      axiosInstance.get("/product-variants/list"),
      axiosInstance.get("/color/list"),
      axiosInstance.get("/list"),
    ]);

    const products = productsRes.data.content;
    const variants = variantsRes.data.data;
    const colors = colorsRes.data;
    const sizes = sizesRes.data;

    const colorMap = {};
    colors.forEach((c) => {
      colorMap[c.name.toLowerCase()] = {
        id: c.id,
        name: c.name,
        hex_code: c.hexCode,
      };
    });

    const sizeMap = {};
    sizes.forEach((s) => {
      sizeMap[s.sizeName.toUpperCase()] = {
        id: s.id,
        name: s.sizeName,
        description: s.description,
      };
    });

    const variantMap = {};
    for (let variant of variants) {
      const key = variant.productName;
      if (!variantMap[key]) variantMap[key] = [];

      const colorData = colorMap[variant.colorName.toLowerCase()] || {
        id: null,
        name: variant.colorName,
        hex_code: "#CCCCCC",
      };

      const sizeData = sizeMap[variant.sizeName.toUpperCase()] || {
        id: null,
        name: variant.sizeName,
        description: "",
      };

      variantMap[key].push({
        id: `var-${variant.id}`,
        color: colorData,
        size: sizeData,
        stock_quantity: variant.stockQuantity,
        price_override: variant.priceOverride,
      });
    }

    const mergedProducts = products.map((p) => {
      const productVariants = variantMap[p.name] || [];

      const minPrice =
        productVariants.length > 0
          ? Math.min(
              ...productVariants.map((v) =>
                v.price_override !== null ? v.price_override : p.price
              )
            )
          : p.price;

      const discount = p.price - minPrice;

      return {
        id: `${p.id}`,
        name: p.name,
        description: p.description,
        brand: p.brand,
        price: minPrice,
        originalPrice: p.price,
        discount: discount > 0 ? discount : 0,
        status: p.status,
        category_id: p.categoryName.toLowerCase().replace(/\s+/g, "-"),
        variants: productVariants,

        images: Array.from({ length: 5 }, (_, index) => ({
          id: `img-${p.id}-${index + 1}`,
          image_url: `https://picsum.photos/seed/${p.id}-${index + 1}/720/720`,
          is_main: index === 0,
          variant_id: null,
        })),

        reviews: [],
        averageRating: 4.5,
        totalReviews: 10,
      };
    });

    return mergedProducts;
  } catch (err) {
    console.error("Error fetching merged product data:", err);
    return [];
  }
};
export const fetchProductDetailById = async (productId) => {
  try {
    const [productRes, colorsRes, sizesRes] = await Promise.all([
      axiosInstance.get(`/${productId}`),
      axiosInstance.get("/color/list"),
      axiosInstance.get("/list"),
    ]);

    const product = productRes.data;
    let variantsRaw = [];
    try {
      const variantsRes = await axiosInstance.get(
        `/product-variants/${productId}`
      );
      variantsRaw = variantsRes.data?.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.warn(`Không tìm thấy biến thể cho productId ${productId}`);
        variantsRaw = [];
      } else {
        throw err; // lỗi khác vẫn quăng ra
      }
    }

    const variants = Array.isArray(variantsRaw) ? variantsRaw : [];

    const colors = Array.isArray(colorsRes.data) ? colorsRes.data : [];
    const sizes = Array.isArray(sizesRes.data) ? sizesRes.data : [];

    // Màu
    const colorMap = {};
    colors.forEach((c) => {
      colorMap[c.name.toLowerCase()] = {
        id: c.id,
        name: c.name,
        hex_code: c.hexCode || "#CCCCCC",
      };
    });

    // Size
    const sizeMap = {};
    sizes.forEach((s) => {
      sizeMap[s.sizeName.toUpperCase()] = {
        id: s.id,
        name: s.sizeName,
        description: s.description || "",
      };
    });

    const mappedVariants = variants.map((v) => ({
      id: `${v.id}`,
      color: colorMap[v.colorName?.toLowerCase()] || {
        id: null,
        name: v.colorName || "N/A",
        hex_code: "#CCCCCC",
      },
      size: sizeMap[v.sizeName?.toUpperCase()] || {
        id: null,
        name: v.sizeName || "N/A",
        description: "",
      },
      stock_quantity: v.stockQuantity ?? 0,
      price_override: v.priceOverride ?? null,
    }));

    const minPrice =
      mappedVariants.length > 0
        ? Math.min(
            ...mappedVariants.map((v) =>
              v.price_override !== null ? v.price_override : product.price
            )
          )
        : product.price;

    const discount = Math.max(product.price - minPrice, 0);

    return {
      id: `${product.id}`,
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: minPrice,
      originalPrice: product.price,
      discount,
      category_id: product.categoryName
        ? product.categoryName.toLowerCase().replace(/\s+/g, "-")
        : "uncategorized",
      status: product.status,
      variants: mappedVariants,
      images: Array.from({ length: 5 }, (_, index) => ({
        id: `img-${product.id}-${index + 1}`,
        image_url: `https://picsum.photos/seed/${product.id}-${
          index + 1
        }/720/720`,
        is_main: index === 0,
        variant_id: null,
      })),
      reviews: [],
      averageRating: 4.5,
      totalReviews: 0,
    };
  } catch (error) {
    console.error("❌ Error fetching product detail:", error);
    return null;
  }
};
