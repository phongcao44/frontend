import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Heart, Eye, Star, Trash2 } from "lucide-react";
import { addItemToCart } from "../../../redux/slices/cartSlice";
import { loadVariantsByProduct } from "../../../redux/slices/productVariantSlice";

const StarRating = ({ value, className }) => {
  return (
    <div className={`flex ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < Math.floor(value || 0)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  value: PropTypes.number,
  className: PropTypes.string,
};

const ProductCard = ({ product, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) return null;

  // Destructure and map fields from the product object
  const {
    id,
    name = "Unnamed Product",
    imageUrl,
    price,
    discountedPrice,
    discountOverrideByFlashSale,
    discountType,
    variants,
    averageRating,
    totalReviews,
    flashSale,
  } = product;

  // Map fields
  const productId = id;
  const variantId = variants?.[0]?.id;
  const finalPrice = discountedPrice || price;
  const originalPrice = variants?.[0]?.priceOverride || price;
  const discountPercentage = discountType === "PERCENTAGE" ? discountOverrideByFlashSale : null;
  const discountAmount = discountType === "AMOUNT" ? discountOverrideByFlashSale : null;
  const image = imageUrl || "/placeholder.png"; // Fallback image
  const showDiscountLabel = flashSale || false; // Use flashSale to determine discount label visibility

  const discountLabel = discountPercentage
    ? `-${discountPercentage}%`
    : discountAmount
    ? `- ${(discountAmount || 0).toLocaleString("vi-VN")}đ`
    : null;

  const handleNavigate = () => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      const res = await dispatch(loadVariantsByProduct(productId)).unwrap();
      const variantIdFromResponse = res?.[0]?.id || variantId;

      if (!variantIdFromResponse) {
        setNotification({ type: "error", message: "Không tìm thấy variant!" });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      await dispatch(addItemToCart({ variantId: variantIdFromResponse, quantity: 1 })).unwrap();
      setNotification({ type: "success", message: "Đã thêm vào giỏ hàng!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: "error", message: "Thêm giỏ hàng thất bại!" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(productId);
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    // Placeholder for your logic
  };

  const handleEyeClick = (e) => {
    e.stopPropagation();
    // Placeholder for your logic
  };

  return (
    <div
      className="p-2 transform hover:scale-105 transition-transform duration-200 z-10 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleNavigate}
      >
        <div className="relative w-full pt-[100%]">
          <img
            src={image}
            alt={name || "Product"}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {showDiscountLabel && discountLabel && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountLabel}
            </div>
          )}
          <div
            className="absolute top-2 right-2 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {onRemove ? (
              <button
                className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
                onClick={handleRemove}
              >
                <Trash2 className="w-4 h-4 text-gray-800" />
              </button>
            ) : (
              <>
                <button
                  className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-100"
                  onClick={handleHeartClick}
                >
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-100"
                  onClick={handleEyeClick}
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </>
            )}
          </div>
          {hovered && (
            <button
              className="absolute bottom-2 left-2 right-2 bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          )}
        </div>
        <div className="p-4 min-h-[120px]">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
            {name || "Unnamed Product"}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {discountLabel ? (
              <>
                <span className="text-sm font-bold text-red-600">
                  {(finalPrice != null ? finalPrice : 0).toLocaleString("vi-VN")} VNĐ
                </span>
                {originalPrice != null && (
                  <span className="text-xs text-gray-500 line-through">
                    {originalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-bold text-gray-800">
                {(finalPrice != null ? finalPrice : 0).toLocaleString("vi-VN")} VNĐ
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <StarRating value={averageRating || 0} className="text-xs" />
            <span className="text-xs text-gray-600">({totalReviews || 0})</span>
          </div>
        </div>
      </div>
      {notification && (
        <div
          className={`absolute top-0 left-0 right-0 mx-2 mt-2 p-2 rounded-md text-white text-center text-sm font-medium
            ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number,
    discountedPrice: PropTypes.number,
    discountOverrideByFlashSale: PropTypes.number,
    discountType: PropTypes.string,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        priceOverride: PropTypes.number,
        finalPriceAfterDiscount: PropTypes.number,
      })
    ),
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
    flashSale: PropTypes.bool,
  }).isRequired,
  onRemove: PropTypes.func,
};

export default ProductCard;