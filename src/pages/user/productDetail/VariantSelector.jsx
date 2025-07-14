/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Rate, Divider, Typography, Space, Button } from "antd";
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

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews(productId));
      dispatch(fetchAverageRating(productId));
      dispatch(fetchRatingSummary(productId));
      dispatch(loadVariantsByProduct(productId));
      dispatch(loadProductDetail(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    const matchedVariant = variants?.find(
      (v) => v.colorName === selectedColor && v.sizeName === selectedSize
    );
    const maxQuantity = matchedVariant?.stockQuantity ?? 10;
    onVariantChange({
      matchedVariant,
      maxQuantity,
      selectedColor,
      selectedSize,
    });
  }, [selectedColor, selectedSize, variants, onVariantChange]);

  if (reviewLoading || variantLoading)
    return <div>Loading product details...</div>;
  if (reviewError || variantError)
    return <div>Error: {reviewError || variantError}</div>;
  if (!product) return <div>Product not found</div>;

  const colors = Array.from(
    new Map(
      variants?.map((v) => [
        v.colorName,
        { id: v.colorName, name: v.colorName },
      ])
    ).values()
  ).filter((color) => color);
  const sizes = Array.from(
    new Map(
      variants?.map((v) => [v.sizeName, { id: v.sizeName, name: v.sizeName }])
    ).values()
  ).filter((size) => size);

  const availableSizes = sizes
    .filter((size) =>
      variants?.some(
        (v) =>
          v.sizeName === size.id &&
          (selectedColor ? v.colorName === selectedColor : true) &&
          v.stockQuantity > 0
      )
    )
    .map((s) => s.id);

  const availableColors = colors
    .filter((color) =>
      variants?.some(
        (v) =>
          v.colorName === color.id &&
          (selectedSize ? v.sizeName === selectedSize : true) &&
          v.stockQuantity > 0
      )
    )
    .map((c) => c.id);

  const matchedVariant = variants?.find(
    (v) => v.colorName === selectedColor && v.sizeName === selectedSize
  );

  const fallbackPrice = product.price ?? 0;
  const finalPrice =
    matchedVariant?.finalPriceAfterDiscount ??
    matchedVariant?.priceOverride ??
    fallbackPrice;

  const hasDiscount =
    matchedVariant &&
    matchedVariant.finalPriceAfterDiscount &&
    matchedVariant.finalPriceAfterDiscount < product.price;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleColorClick = (id) => {
    setSelectedColor((prev) => (prev === id ? null : id));
    setSelectedSize((prevSize) =>
      variants?.some(
        (v) =>
          v.colorName === id && v.sizeName === prevSize && v.stockQuantity > 0
      )
        ? prevSize
        : null
    );
  };

  const handleSizeClick = (id) => {
    setSelectedSize((prev) => (prev === id ? null : id));
    setSelectedColor((prevColor) =>
      variants?.some(
        (v) =>
          v.sizeName === id && v.colorName === prevColor && v.stockQuantity > 0
      )
        ? prevColor
        : null
    );
  };

  return (
    <div>
      <Title level={2} className="mb-4">
        {product.name}
      </Title>
      <div className="flex items-center mb-4">
        <Rate disabled defaultValue={averageRating} />
        <Text className="ml-2 text-gray-500">({reviews?.length} Reviews)</Text>
        <Divider type="vertical" className="mx-2" />
        <Text
          className={
            product.status === "IN_STOCK" ? "text-green-500" : "text-red-500"
          }
        >
          {product.status === "IN_STOCK" ? "In Stock" : "Out of Stock"}
        </Text>
      </div>

      {typeof finalPrice === "number" &&
        (hasDiscount ? (
          <div className="mb-6">
            <Text delete className="text-lg text-gray-500 mr-3">
              {formatPrice(product.price)}
            </Text>
            <Title level={3} className="text-red-500 inline-block">
              {formatPrice(finalPrice)}
            </Title>
          </div>
        ) : (
          <Title level={3} className="text-red-500 mb-6">
            {formatPrice(finalPrice)}
          </Title>
        ))}

      <Paragraph className="mb-6 text-gray-600 leading-relaxed">
        {product.description}
      </Paragraph>

      <Divider />

      {colors.length > 0 && (
        <div className="mb-6">
          <Text strong className="block mb-2">
            Màu sắc:
          </Text>
          <Space>
            {colors.map((color) => {
              const disabled = !availableColors.includes(color.id);
              return (
                <div
                  key={color.id}
                  onClick={() => !disabled && handleColorClick(color.id)}
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedColor === color.id
                      ? "border-red-500"
                      : "border-gray-300"
                  } cursor-${disabled ? "not-allowed" : "pointer"} opacity-${
                    disabled ? "40" : "100"
                  }`}
                  style={{
                    backgroundColor:
                      color.name === "Đen"
                        ? "#000000"
                        : color.name === "Trắng"
                        ? "#FFFFFF"
                        : "#000000",
                  }}
                />
              );
            })}
          </Space>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mb-6">
          <Text strong className="block mb-2">
            Kích thước:
          </Text>
          <Space>
            {sizes.map((size) => {
              const disabled = !availableSizes.includes(size.id);
              return (
                <Button
                  key={size.id}
                  size="small"
                  type={selectedSize === size.id ? "primary" : "default"}
                  onClick={() => !disabled && handleSizeClick(size.id)}
                  disabled={disabled}
                  className={`min-w-[32px] h-8 ${
                    selectedSize === size.id
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
    </div>
  );
};

export default VariantSelector;
