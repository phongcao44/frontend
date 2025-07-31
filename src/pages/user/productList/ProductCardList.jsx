import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../../redux/slices/cartSlice";
import { loadVariantsByProduct } from "../../../redux/slices/productVariantSlice";

const ProductCardList = ({ product }) => {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) return null;

  const {
    id,
    name,
    imageUrl,
    price,
    lowestPrice,
    discountedPrice,
    discountOverrideByFlashSale,
    discountType,
    flashSale,
    averageRating,
    totalReviews,
  } = product;

  // Calculate discount label
  let discountLabel = null;
  let originalPrice = discountedPrice;

  if (flashSale && discountOverrideByFlashSale !== null) {
    if (discountType === "PERCENTAGE") {
      discountLabel = `-${discountOverrideByFlashSale}%`;
    } else if (discountType === "FIXED_AMOUNT") {
      discountLabel = `- ${discountOverrideByFlashSale.toLocaleString("vi-VN")}đ`;
    }
  } 

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

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer relative"
      onClick={handleNavigate}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl || "https://via.placeholder.com/300"}
          alt={name}
          className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer">
            <i className="far fa-heart text-gray-400 hover:text-red-500 text-sm"></i>
          </button>
        </div>
        {discountLabel && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {discountLabel}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const whole = Math.floor(averageRating || 0);
              const decimal = (averageRating || 0) - whole;

              if (i < whole) {
                return (
                  <i
                    key={i}
                    className="fas fa-star text-yellow-400 text-xs"
                  ></i>
                );
              } else if (i === whole) {
                if (decimal >= 0.75) {
                  return (
                    <i
                      key={i}
                      className="fas fa-star text-yellow-400 text-xs"
                    ></i>
                  );
                } else if (decimal >= 0.25) {
                  return (
                    <i
                      key={i}
                      className="fas fa-star-half-alt text-yellow-400 text-xs"
                    ></i>
                  );
                }
              }
              return (
                <i key={i} className="fas fa-star text-gray-200 text-xs"></i>
              );
            })}
          </div>
          <span className="text-xs text-gray-500">({averageRating || 0})</span>
          <span className="text-xs text-gray-400">• Đã bán {totalReviews || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {lowestPrice.toLocaleString("vi-VN")}đ
            </span>
            {(flashSale ? discountOverrideByFlashSale !== null : discountedPrice > lowestPrice) && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>
        </div>
        <button
          className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer whitespace-nowrap !rounded-button"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ
        </button>
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

ProductCardList.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    price: PropTypes.number.isRequired,
    discountedPrice: PropTypes.number,
    discountOverrideByFlashSale: PropTypes.number,
    discountType: PropTypes.oneOf(["PERCENTAGE", "FIXED_AMOUNT", null]),
    flashSale: PropTypes.bool,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
  }).isRequired,
};

export default ProductCardList;