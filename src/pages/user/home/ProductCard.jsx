import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Eye, Star, Trash2 } from "lucide-react";
import {
  addProductToWishlist,
  removeProductFromWishlist,
} from "../../../redux/slices/wishlistSlice";
import { updateProductFavoriteStatus } from "../../../redux/slices/productSlice";

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
  const [notification, setNotification] = useState(null);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Sync isFavorite state with product.isFavorite when it changes
  useEffect(() => {
    setIsFavorite(product.isFavorite || false);
  }, [product.isFavorite]);
  const { items: wishlistItems, loading: wishlistLoading } = useSelector(
    (state) => state.wishlist
  );

  if (!product) return null;

  const {
    id,
    slug,
    name = "Unnamed Product",
    imageUrl,
    price,
    lowestPrice,
    discountedPrice,
    originalPrice,
    discountOverrideByFlashSale,
    discountType,
    averageRating,
    totalReviews,
    flashSale,
    soldQuantity = 0,
  } = product || {};

  // Map fields
  const productId = id;
  const finalPrice = Math.max(
    1,
    flashSale
      ? discountOverrideByFlashSale || lowestPrice || price
      : lowestPrice || price
  );
  const displayOriginalPrice = originalPrice || price;
  const discountPercentage =
    flashSale && discountType === "PERCENTAGE" && discountedPrice
      ? discountedPrice
      : null;
  const discountAmount =
    flashSale && discountType === "AMOUNT" && discountOverrideByFlashSale
      ? displayOriginalPrice - discountOverrideByFlashSale
      : null;
  
  // Optimize image URL for Cloudinary
  const baseImageUrl = imageUrl || "/assets/images/error.jpg";
  const optimizedImageUrl = baseImageUrl.includes("cloudinary.com")
    ? `${baseImageUrl.replace(
        "/upload/",
        "/upload/w_400,h_400,c_fill,f_auto,q_auto/"
      )}`
    : baseImageUrl;
  const lqipImageUrl = baseImageUrl.includes("cloudinary.com")
    ? `${baseImageUrl.replace(
        "/upload/",
        "/upload/w_20,e_blur:2000,q_auto/"
      )}`
    : baseImageUrl;

  const showDiscountLabel = flashSale && (discountPercentage || discountAmount);
  const discountLabel = discountPercentage
    ? `-${discountPercentage}%`
    : discountAmount
    ? `- ${(discountAmount || 0).toLocaleString("vi-VN")}đ`
    : null;

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "/assets/images/error.jpg";
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    navigate(`/product/${slug}`);
  };

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (wishlistLoading) return;

    const optimisticIsFavorite = !isFavorite;
    setIsFavorite(optimisticIsFavorite);

    try {
      if (!isFavorite) {
        await dispatch(addProductToWishlist(productId)).unwrap();
        dispatch(updateProductFavoriteStatus({ productId, isFavorite: true }));
        setNotification({
          type: "success",
          message: "Đã thêm vào danh sách yêu thích!",
        });
      } else {
        const wishlistItem = wishlistItems.find(
          (item) => item.product?.id === productId
        );
        if (wishlistItem && wishlistItem.wishlistId) {
          await dispatch(
            removeProductFromWishlist(wishlistItem.wishlistId)
          ).unwrap();
          dispatch(updateProductFavoriteStatus({ productId, isFavorite: false }));
          setNotification({
            type: "success",
            message: "Đã xóa khỏi danh sách yêu thích!",
          });
        } else {
          throw new Error("Không tìm thấy sản phẩm trong danh sách yêu thích");
        }
      }
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setIsFavorite(!optimisticIsFavorite);
      setNotification({
        type: "error",
        message: error.message || "Thao tác thất bại!",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="p-2 relative">
      <div
        className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer transform hover:scale-105 duration-200"
        onClick={handleNavigate}
      >
        <div className="relative w-full pt-[100%]">
          <img
            src={lqipImageUrl}
            alt={name || "Product"}
            className="absolute top-0 left-0 w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
          <img
            src={optimizedImageUrl}
            alt={name || "Product"}
            className="absolute top-0 left-0 w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(productId);
                }}
              >
                <Trash2 className="w-4 h-4 text-gray-800" />
              </button>
            ) : (
              <>
                <button
                  className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-100"
                  onClick={handleHeartClick}
                  disabled={wishlistLoading}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite
                        ? "text-red-500 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                </button>
                <button
                  className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-100"
                  onClick={handleNavigate}
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="p-4 min-h-[120px]">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
            {name || "Unnamed Product"}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {showDiscountLabel && discountLabel ? (
              <>
                <span className="text-sm font-bold text-red-600">
                  {(finalPrice != null ? finalPrice : 0).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  VNĐ
                </span>
                {displayOriginalPrice != null && (
                  <span className="text-xs text-gray-500 line-through">
                    {displayOriginalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-bold text-gray-800">
                {(finalPrice != null ? finalPrice : 0).toLocaleString(
                  "vi-VN"
                )}{" "}
                VNĐ
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <StarRating value={averageRating || 0} className="text-xs" />
              <span className="text-xs text-gray-600">
                ({totalReviews || 0})
              </span>
            </div>
            {soldQuantity > 0 && (
              <span className="text-xs text-gray-500">
                Đã bán: {soldQuantity.toLocaleString("vi-VN")}
              </span>
            )}
          </div>
        </div>
      </div>
      {notification && (
        <div
          className={`absolute top-0 left-0 right-0 mx-2 mt-2 p-2 rounded-md text-white text-center text-sm font-medium z-50
            ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
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
    slug: PropTypes.string.isRequired,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number,
    lowestPrice: PropTypes.number,
    discountedPrice: PropTypes.number,
    originalPrice: PropTypes.number,
    discountOverrideByFlashSale: PropTypes.number,
    discountType: PropTypes.string,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
    flashSale: PropTypes.bool,
    isFavorite: PropTypes.bool,
    soldQuantity: PropTypes.number,
  }).isRequired,
  onRemove: PropTypes.func,
};

export default ProductCard;