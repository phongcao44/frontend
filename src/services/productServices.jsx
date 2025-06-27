import axiosInstance from "../utils/axiosInstance";

export const fetchAllProducts = async () => {
  const res = await axiosInstance.get("/product");
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axiosInstance.get(`/product/${id}`);
  return res.data;
};

export const fetchProductsPaginate = async ({
  page = 0,
  limit = 10,
  sortBy = "price",
  orderBy = "asc",
}) => {
  const res = await axiosInstance.get("/product/paginate", {
    params: { page, limit, sortBy, orderBy },
  });
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await axiosInstance.post("/product/admin/add", productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await axiosInstance.put(
    `/product/admin/update/${id}`,
    productData
  );
  return res.data;
};

export const changeProductStatus = async (id) => {
  const res = await axiosInstance.put(`/product/admin/change-status/${id}`);
  return res.data;
};

export const searchProducts = async (keyword) => {
  const res = await axiosInstance.get("/product/search", {
    params: { keyword },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axiosInstance.delete(`/product/admin/delete/${id}`);
  return res.data;
};

export const fetchMergedProducts = async (page = 0, limit = 10) => {
  try {
    const [productsRes, variantsRes, colorsRes, sizesRes] = await Promise.all([
      axiosInstance.get(
        `/product/paginate?page=${page}&limit=${limit}&sortBy=price&orderBy=asc`
      ),
      axiosInstance.get("/product-variants"),
      axiosInstance.get("/color/list"),
      axiosInstance.get("/size/list"),
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
    const [
      productRes,
      variantsRes,
      colorsRes,
      sizesRes,
      // imageRes,
      // reviewRes
    ] = await Promise.all([
      axiosInstance.get(`/product/${productId}`),
      axiosInstance.get(`/product-variants/${productId}`),
      axiosInstance.get("/color/list"),
      axiosInstance.get("/size/list"),
    ]);

    const product = productRes.data;
    const variants = variantsRes.data.data || [];
    const colors = colorsRes.data;
    const sizes = sizesRes.data;
    // const images = []; // Tạm thời không có API
    // const reviews = []; // Tạm thời không có API

    // màu
    const colorMap = {};
    colors.forEach((c) => {
      colorMap[c.name.toLowerCase()] = {
        id: c.id,
        name: c.name,
        hex_code: c.hexCode,
      };
    });

    // size
    const sizeMap = {};
    sizes.forEach((s) => {
      sizeMap[s.sizeName.toUpperCase()] = {
        id: s.id,
        name: s.sizeName,
        description: s.description,
      };
    });

    const mappedVariants = variants.map((v) => ({
      id: `${v.id}`,
      color: colorMap[v.colorName.toLowerCase()] || {
        id: null,
        name: v.colorName,
        hex_code: "#CCCCCC",
      },
      size: sizeMap[v.sizeName.toUpperCase()] || {
        id: null,
        name: v.sizeName,
        description: "",
      },
      stock_quantity: v.stockQuantity,
      price_override: v.priceOverride,
    }));

    const minPrice =
      mappedVariants.length > 0
        ? Math.min(
            ...mappedVariants.map((v) =>
              v.price_override !== null ? v.price_override : product.price
            )
          )
        : product.price;

    const discount = product.price - minPrice;

    return {
      id: `${product.id}`,
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: minPrice,
      originalPrice: product.price,
      discount: discount > 0 ? discount : 0,
      category_id: product.categoryName.toLowerCase().replace(/\s+/g, "-"),
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
