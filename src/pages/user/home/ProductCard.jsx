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
            i < Math.floor(value)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

const ProductCard = ({ product, showDiscountLabel = false, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) return null;

  const {
    id,
    name,
    images,
    imageUrl,
    price,
    originalPrice,
    discountPercentage,
    discountAmount,
    averageRating,
    totalReviews,
  } = product;

  const image =
    images?.find((img) => img.is_main)?.image_url ||
    images?.[0]?.image_url ||
    "/placeholder.png";

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      const res = await dispatch(loadVariantsByProduct(product.id)).unwrap();
      const variantId = res?.[0]?.id;

      if (!variantId) {
        setNotification({ type: 'error', message: 'Không tìm thấy variant!' });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      await dispatch(addItemToCart({ variantId, quantity: 1 })).unwrap();
      setNotification({ type: 'success', message: 'Đã thêm vào giỏ hàng!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Thêm giỏ hàng thất bại!' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(product.id);
    }
  };

  const discountLabel = discountPercentage
    ? `-${discountPercentage}%`
    : discountAmount
    ? `- ${discountAmount.toLocaleString()}đ`
    : null;

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
            src={imageUrl || image}
            alt={name}
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
                <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-100">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-100">
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
            {name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {discountLabel ? (
              <>
                <span className="text-sm font-bold text-red-600">
                  {price.toLocaleString("vi-VN")} VNĐ
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {originalPrice?.toLocaleString("vi-VN")} VNĐ
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-gray-800">
                {price.toLocaleString("vi-VN")} VNĐ
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
        <div className={`absolute top-0 left-0 right-0 mx-2 mt-2 p-2 rounded-md text-white text-center text-sm font-medium
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string.isRequired,
        is_main: PropTypes.bool,
      })
    ).isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    discountPercentage: PropTypes.number,
    discountAmount: PropTypes.number,
    discountType: PropTypes.string,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
  }),
  showDiscountLabel: PropTypes.bool,
  onRemove: PropTypes.func,
};

export default ProductCard;