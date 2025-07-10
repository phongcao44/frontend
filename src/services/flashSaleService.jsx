import axiosInstance from "../utils/axiosInstance";
import { fetchProductVariantDetail } from "./productVariantService";

// ===============================
// Flash Sale
// ===============================

export const getFlashSales = () => {
  return axiosInstance.get("/flash_sale/list");
};

export const addFlashSale = (data) => {
  return axiosInstance.post("/flash_sale/add", data);
};

export const editFlashSale = (id, data) => {
  return axiosInstance.post(`/flash_sale/edit/${id}`, data);
};

export const deleteFlashSale = (id) => {
  return axiosInstance.delete(`/flash_sale/delete/${id}`);
};

// ===============================
// Flash Sale Items
// ===============================

export const addFlashSaleItem = (data) => {
  return axiosInstance.post("/flash_sale/flash_sale_items/add", data);
};

export const editFlashSaleItem = (id, data) => {
  return axiosInstance.post(`/flash_sale/flash_sale_items/edit/${id}`, data);
};

export const deleteFlashSaleItem = (id) => {
  return axiosInstance.delete(`/flash_sale/flash_sale_items/delete/${id}`);
};

// export const getFlashSaleItems = (flashSaleId) => {
//   return axiosInstance.get(`/flash_sale/flash_sale_items/${flashSaleId}`);
// };

export const getFlashSaleItems = async (flashSaleId) => {
  try {
    const res = await axiosInstance.get(
      `/flash_sale/flash_sale_items/${flashSaleId}`
    );
    const items = res.data || [];

    const grouped = {};

    for (const item of items) {
      const variantId = item.variantId;
      const variantDetail = await fetchProductVariantDetail(variantId);

      const productId = item.productId;
      const productName = variantDetail.productName || "N/A";

      const basePrice = variantDetail.priceOverride || variantDetail.price || 0;

      let finalPrice = 0;
      let discountAmount = 0;
      let discountPercentage = 0;

      if (item.discountType === "PERCENTAGE") {
        discountPercentage = item.discountedPrice;
        finalPrice = Math.round(basePrice * (1 - discountPercentage / 100));
        discountAmount = basePrice - finalPrice;
      } else if (item.discountType === "AMOUNT") {
        discountAmount = item.discountedPrice;
        finalPrice = Math.max(basePrice - discountAmount, 0);
        discountPercentage = null;
      } else {
        finalPrice = basePrice;
        discountAmount = 0;
        discountPercentage = 0;
      }

      const images = Array.from({ length: 3 }, (_, i) => ({
        id: `img-${variantId}-${i + 1}`,
        image_url: `https://picsum.photos/seed/${variantId}-${i + 1}/720/720`,
        is_main: i === 0,
      }));

      const variantData = {
        id: `${variantId}`,
        images,
        price: finalPrice,
        originalPrice: basePrice,
        discountAmount: discountAmount,
        discountPercentage: discountPercentage,
        discountType: item.discountType,
        averageRating: 4.5,
        totalReviews: 0,
      };

      if (!grouped[productId]) {
        grouped[productId] = {
          id: `${productId}`,
          name: productName,
          variants: [],
        };
      }

      grouped[productId].variants.push(variantData);
    }

    const result = Object.values(grouped).map((product) => {
      const minVariant = product.variants.reduce((prev, curr) =>
        curr.price < prev.price ? curr : prev
      );
      return {
        id: product.id,
        name: product.name,
        images: minVariant.images,
        price: minVariant.price,
        originalPrice: minVariant.originalPrice,
        discountAmount: minVariant.discountAmount,
        discountPercentage: minVariant.discountPercentage,
        discountType: minVariant.discountType,
        averageRating: minVariant.averageRating,
        totalReviews: minVariant.totalReviews,
      };
    });

    return result;
  } catch (err) {
    console.error("❌ Lỗi getFlashSaleItems:", err);
    return [];
  }
};
