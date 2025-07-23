/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { Rate, Divider, Typography, Space, Button, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadProductDetail } from "../../../redux/slices/productSlice";
import { loadVariantsByProduct } from "../../../redux/slices/productVariantSlice";
import {
  fetchAverageRating,
  fetchProductReviews,
  fetchRatingSummary,
} from "../../../redux/slices/reviewSlice";

const { Title, Text, Paragraph } = Typography;

const VariantSelector = ({ productId, onVariantChange }) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.productDetail);
  const {
    list: variants,
    loading: variantLoading,
    error: variantError,
  } = useSelector((state) => state.productVariants);
  const {
    reviews,
    averageRating,
    loading: reviewLoading,
    error: reviewError,
  } = useSelector((state) => state.review);

  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  // Reset selections when productId changes
  useEffect(() => {
    setSelectedColorId(null);
    setSelectedSizeId(null);
  }, [productId]);

  // Memoize valid variants
  const validVariants = useMemo(
    () => variants?.filter((v) => (v.colorId || v.sizeId) && v.stockQuantity > 0) || [],
    [variants]
  );

  // Memoize colors
  const colors = useMemo(
    () => [
      ...new Map(
        validVariants
          .filter((v) => v.colorId && v.colorName)
          .map((v) => [
            v.colorId,
            {
              id: v.colorId,
              name: v.colorName,
              hex_code: v.colorHex || "#000000",
            },
          ])
      ).values(),
    ],
    [validVariants]
  );

  // Memoize sizes
  const sizes = useMemo(
    () => [
      ...new Map(
        validVariants
          .filter((v) => v.sizeId && v.sizeName)
          .map((v) => [
            v.sizeId,
            {
              id: v.sizeId,
              name: v.sizeName,
            },
          ])
      ).values(),
    ],
    [validVariants]
  );

  // Memoize available options
  const getAvailableOptions = (type, selectedValue) => {
    if (type === "size") {
      return sizes.filter((size) =>
        validVariants.some(
          (v) =>
            v.sizeId === size.id &&
            (!selectedValue || v.colorId === selectedValue || !v.colorId) &&
            v.stockQuantity > 0
        )
      ).map((s) => s.id);
    } else {
      return colors.filter((color) =>
        validVariants.some(
          (v) =>
            v.colorId === color.id &&
            (!selectedValue || v.sizeId === selectedValue || !v.sizeId) &&
            v.stockQuantity > 0
        )
      ).map((c) => c.id);
    }
  };

  const availableSizes = useMemo(
    () => getAvailableOptions("size", selectedColorId),
    [sizes, selectedColorId, validVariants]
  );
  const availableColors = useMemo(
    () => getAvailableOptions("color", selectedSizeId),
    [colors, selectedSizeId, validVariants]
  );

  // Memoize matched variant
  const matchedVariant = useMemo(
    () =>
      validVariants.find(
        (v) =>
          (selectedColorId ? v.colorId === selectedColorId : !v.colorId || v.colorId === null) &&
          (selectedSizeId ? v.sizeId === selectedSizeId : !v.sizeId || v.sizeId === null)
      ) || validVariants[0], // Fallback to first valid variant
    [validVariants, selectedColorId, selectedSizeId]
  );

  // Call onVariantChange when selections or matchedVariant change
  useEffect(() => {
    onVariantChange({
      matchedVariant,
      maxQuantity: matchedVariant?.stockQuantity ?? 10,
      selectedColorId,
      selectedSizeId,
    });
  }, [selectedColorId, selectedSizeId, matchedVariant, onVariantChange]);

  // Load data
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews(productId));
      dispatch(fetchAverageRating(productId));
      dispatch(fetchRatingSummary(productId));
      dispatch(loadVariantsByProduct(productId));
      dispatch(loadProductDetail(productId));
    }
  }, [dispatch, productId]);

  if (reviewLoading || variantLoading) return <div>Loading product details...</div>;
  if (reviewError || variantError) return <div>Error: {reviewError || variantError}</div>;
  if (!product) return <div>Product not found</div>;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const basePrice = matchedVariant?.priceOverride ?? product.price ?? 0;
  const finalPrice = matchedVariant?.finalPriceAfterDiscount ?? basePrice;
  const isFlashSale = matchedVariant?.discountOverrideByFlashSale > 0;
  const hasDiscount = finalPrice < basePrice;

  const handleColorClick = (id) => {
    setSelectedColorId((prev) => (prev === id ? null : id));
    if (
      !validVariants.some(
        (v) =>
          v.colorId === id &&
          (selectedSizeId ? v.sizeId === selectedSizeId : !v.sizeId || v.sizeId === null) &&
          v.stockQuantity > 0
      )
    ) {
      setSelectedSizeId(null);
    }
  };

  const handleSizeClick = (id) => {
    setSelectedSizeId((prev) => (prev === id ? null : id));
    if (
      !validVariants.some(
        (v) =>
          v.sizeId === id &&
          (selectedColorId ? v.colorId === selectedColorId : !v.colorId || v.colorId === null) &&
          v.stockQuantity > 0
      )
    ) {
      setSelectedColorId(null);
    }
  };

  return (
    <div className="p-4">
      <Title level={2} className="mb-4">{product.name}</Title>
      <div className="flex items-center mb-4">
        <Rate disabled value={averageRating} />
        <Text className="ml-2 text-gray-500">({reviews?.length} Reviews)</Text>
        <Divider type="vertical" className="mx-2" />
        <Text className={product.status === "IN_STOCK" ? "text-green-500" : "text-red-500"}>
          {product.status === "IN_STOCK" ? "In Stock" : "Out of Stock"}
        </Text>
      </div>

      <div className="mb-6">
        {isFlashSale && (
          <Tag color="red" className="mb-2">
            Flash Sale: {matchedVariant.discountOverrideByFlashSale}% Off
          </Tag>
        )}
        {hasDiscount ? (
          <Space>
            <Text delete className="text-lg text-gray-500">{formatPrice(basePrice)}</Text>
            <Title level={3} className="text-red-500">{formatPrice(finalPrice)}</Title>
          </Space>
        ) : (
          <Title level={3} className="text-red-500">{formatPrice(finalPrice)}</Title>
        )}
      </div>

      <Paragraph className="mb-6 text-gray-600 leading-relaxed">
        {product.description}
      </Paragraph>

      <Divider />

      {colors.length > 0 && (
        <div className="mb-6">
          <Text strong className="block mb-2">Màu sắc:</Text>
          <Space>
            {colors.map((color) => {
              const disabled = !availableColors.includes(color.id);
              return (
                <div
                  key={color.id}
                  onClick={() => !disabled && handleColorClick(color.id)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColorId === color.id ? "border-red-500" : "border-gray-300"
                  } cursor-${disabled ? "not-allowed" : "pointer"} opacity-${disabled ? "50" : "100"}`}
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              );
            })}
          </Space>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mb-6">
          <Text strong className="block mb-2">Kích thước:</Text>
          <Space>
            {sizes.map((size) => {
              const disabled = !availableSizes.includes(size.id);
              return (
                <Button
                  key={size.id}
                  size="small"
                  type={selectedSizeId === size.id ? "primary" : "default"}
                  onClick={() => !disabled && handleSizeClick(size.id)}
                  disabled={disabled}
                  className={`min-w-[32px] h-8 ${
                    selectedSizeId === size.id
                      ? "bg-red-500 border-red-500"
                      : "bg-transparent border-gray-300"
                  } ${disabled ? "text-gray-500 opacity-50" : ""}`}
                >
                  {size.name}
                </Button>
              );
            })}
          </Space>
        </div>
      )}

      {colors.length === 0 && sizes.length === 0 && (
        <Text className="text-gray-500">No variant options available</Text>
      )}
    </div>
  );
};

export default VariantSelector;