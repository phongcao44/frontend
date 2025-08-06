/* eslint-disable react/prop-types */
import { Rate, Divider, Typography, Space, Button, Tag } from "antd";
import { useSelector } from "react-redux";

const { Title, Text, Paragraph } = Typography;

const VariantSelector = ({
  variantData,
  handleColorClick,
  handleSizeClick,
  colors,
  sizes,
  availableColors,
  availableSizes,
}) => {
  const product = useSelector((state) => state.products.productDetail);

  const { matchedVariant, selectedColorId, selectedSizeId } = variantData;

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
  const discountPercent = hasDiscount ? Math.round(((basePrice - finalPrice) / basePrice) * 100) : 0;

  return (
    <div className="p-4">
      <Title level={2} className="mb-4">{product.name}</Title>
      <div className="flex items-center mb-4">
        <Rate disabled value={product.averageRating} />
        <Text className="ml-2 text-gray-500">({product.totalReviews} Reviews)</Text>
        <Divider type="vertical" className="mx-2" />
        <Text className={product.status === "IN_STOCK" ? "text-green-500" : "text-red-500"}>
          {product.status === "IN_STOCK" ? "In Stock" : "Out of Stock"}
        </Text>
      </div>

      {/* Enhanced Price Display Section with Smooth Transitions */}
      <div className="mb-6">
        {isFlashSale && (
          <Tag color="red" className="mb-3 text-sm font-semibold animate-pulse">
            🔥 FLASH SALE: {matchedVariant.discountOverrideByFlashSale}% OFF
          </Tag>
        )}
        
        <div
          className={`relative rounded-xl p-6 transition-all duration-300 ease-in-out ${
            hasDiscount || isFlashSale
              ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
              : "bg-gray-50 border border-gray-200 shadow-sm text-gray-800"
          }`}
        >
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold transition-opacity duration-300">
              TIẾT KIỆM {discountPercent}%
            </div>
          )}

          {hasDiscount ? (
            <div className="space-y-1">
              <Text className="text-white/70 text-base line-through transition-opacity duration-300">
                {formatPrice(basePrice)}
              </Text>
              <Title level={2} className="!text-white !mb-1 !text-3xl font-bold transition-colors duration-300">
                {formatPrice(finalPrice)}
              </Title>
              <Text className="text-white/90 text-sm transition-opacity duration-300">
                Bạn tiết kiệm được {formatPrice(basePrice - finalPrice)}!
              </Text>
            </div>
          ) : (
            <Title level={2} className="!mb-0 !text-3xl font-bold transition-colors duration-300">
              {formatPrice(finalPrice)}
            </Title>
          )}
        </div>
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
                  } cursor-${disabled ? "not-allowed" : "pointer"} opacity-${disabled ? "50" : "100"} transition-all duration-200`}
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
                  } ${disabled ? "text-gray-500 opacity-50" : ""} transition-all duration-200`}
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