import PropTypes from "prop-types";
import { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Eye, Star, Trash2, X } from "lucide-react";
import { addItemToCart, getCart } from "../../../redux/slices/cartSlice";
import { loadVariantsByProduct } from "../../../redux/slices/productVariantSlice";
import {
  addProductToWishlist,
  removeProductFromWishlist,
} from "../../../redux/slices/wishlistSlice";

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

const VariantModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const cart = useSelector((state) => state.cart.cart); // Get cart state
  const cartLoading = useSelector((state) => state.cart.loading); // Get cart loading state

  if (!isOpen || !product) return null;

  // Lấy danh sách màu sắc và kích thước unique
  const colors = [
    ...new Set(product.variants?.map((v) => v.colorName).filter(Boolean)),
  ];
  const sizes = [
    ...new Set(product.variants?.map((v) => v.sizeName).filter(Boolean)),
  ];

  // Tìm biến thể dựa trên màu và size đã chọn
  const findVariant = (color, size) => {
    return product.variants?.find(
      (v) => v.colorName === color && v.sizeName === size
    );
  };

  // Handle khi chọn màu
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (selectedSize) {
      const variant = findVariant(color, selectedSize);
      setSelectedVariant(variant);
    } else {
      setSelectedVariant(null);
    }
  };

  // Handle khi chọn size
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (selectedColor) {
      const variant = findVariant(selectedColor, size);
      setSelectedVariant(variant);
    } else {
      setSelectedVariant(null);
    }
  };

  // Handle thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (selectedVariant) {
      onAddToCart(selectedVariant.id, quantity);
      onClose();
    }
  };

  // Kiểm tra xem có thể thêm vào giỏ hàng không
  const canAddToCart =
    selectedColor &&
    selectedSize &&
    selectedVariant &&
    selectedVariant.stockQuantity > 0;

  // Check if adding quantity exceeds stock
  const existingCartItem = cart?.items?.find(
    (item) => item.variantId === selectedVariant?.id
  );
  const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;
  const totalQuantity = existingQuantity + quantity;
  const isStockExceeded =
    selectedVariant && totalQuantity > selectedVariant.stockQuantity;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chọn biến thể</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <h4 className="font-medium text-gray-800">{product.name}</h4>
        </div>

        {/* Chọn màu sắc */}
        {colors.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu sắc:
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                    selectedColor === color
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chọn kích thước */}
        {sizes.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kích thước:
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                    selectedSize === size
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hiển thị thông tin biến thể đã chọn */}
        {selectedVariant && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">
                Giá:{" "}
                {selectedVariant.finalPriceAfterDiscount?.toLocaleString(
                  "vi-VN"
                )}{" "}
                VNĐ
              </span>
              <span className="text-sm text-gray-600">
                Còn lại: {selectedVariant.stockQuantity}
              </span>
            </div>
            {selectedVariant.discountType &&
              selectedVariant.discountOverrideByFlashSale && (
                <span className="text-sm text-red-600">
                  {selectedVariant.discountType === "PERCENTAGE"
                    ? `Giảm ${selectedVariant.discountOverrideByFlashSale}%`
                    : `Giảm ${(
                        selectedVariant.priceOverride -
                        selectedVariant.finalPriceAfterDiscount
                      ).toLocaleString("vi-VN")}đ`}
                </span>
              )}
          </div>
        )}

        {/* Chọn số lượng */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng:
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="text-lg font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
              disabled={
                selectedVariant &&
                totalQuantity >= selectedVariant.stockQuantity
              }
            >
              +
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || isStockExceeded || cartLoading}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              canAddToCart && !isStockExceeded && !cartLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {cartLoading ? "Đang tải..." : "Thêm vào giỏ hàng"}
          </button>
        </div>

        {/* Thông báo lỗi */}
        {(!canAddToCart || isStockExceeded) && selectedColor && selectedSize && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {!selectedVariant
              ? "Biến thể này không có sẵn"
              : selectedVariant.stockQuantity === 0
              ? "Sản phẩm đã hết hàng"
              : isStockExceeded
              ? `Số lượng vượt quá tồn kho (còn ${selectedVariant.stockQuantity - existingQuantity} sản phẩm)`
              : "Vui lòng chọn đầy đủ thông tin"}
          </p>
        )}
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return ReactDOM.createPortal(modalContent, document.body);
  }

  return modalContent;
};

VariantModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onAddToCart: PropTypes.func.isRequired,
};

const ProductCard = ({ product, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: wishlistItems, loading: wishlistLoading } = useSelector(
    (state) => state.wishlist
  );
  const cart = useSelector((state) => state.cart.cart);
  const cartLoading = useSelector((state) => state.cart.loading);

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
    variants,
    averageRating,
    totalReviews,
    flashSale,
    soldQuantity = 0,
  } = product || {};

  // Map fields
  const productId = id;
  const variantId = variants?.[0]?.id;
  const finalPrice = flashSale
    ? discountOverrideByFlashSale ||
      variants?.[0]?.finalPriceAfterDiscount ||
      price
    : lowestPrice || price;
  const displayOriginalPrice =
    originalPrice || variants?.[0]?.priceOverride || price;
  const discountPercentage =
    flashSale && discountType === "PERCENTAGE" && discountedPrice
      ? discountedPrice
      : null;
  const discountAmount =
    flashSale && discountType === "AMOUNT" && discountOverrideByFlashSale
      ? displayOriginalPrice - discountOverrideByFlashSale
      : null;
  const image =
    imageUrl ||
    "https://i.pinimg.com/736x/f0/b6/ce/f0b6ce5a334490ba1ec286bd8bc348e9.jpg";
  const showDiscountLabel = flashSale && (discountPercentage || discountAmount);

  const discountLabel = discountPercentage
    ? `-${discountPercentage}%`
    : discountAmount
    ? `- ${(discountAmount || 0).toLocaleString("vi-VN")}đ`
    : null;

  const handleNavigate = () => {
    navigate(`/product/${slug}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // Kiểm tra xem sản phẩm có nhiều biến thể không
    if (variants && variants.length > 1) {
      setShowVariantModal(true);
      return;
    }

    // Nếu chỉ có 1 biến thể hoặc không có biến thể, thêm trực tiếp vào giỏ hàng
    try {
      // Fetch latest cart data
      await dispatch(getCart()).unwrap();

      // Get variant details
      const res = await dispatch(loadVariantsByProduct(productId)).unwrap();
      const variant = res?.[0] || variants?.[0];
      const selectedVariantId = variant?.id || variantId;

      if (!selectedVariantId) {
        setNotification({ type: "error", message: "Không tìm thấy biến thể!" });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      // Check if variant is already in cart
      const existingCartItem = cart?.items?.find(
        (item) => item.variantId === selectedVariantId
      );
      const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;
      const quantityToAdd = 1; // Default quantity for single variant
      const totalQuantity = existingQuantity + quantityToAdd;

      // Check stock
      if (variant?.stockQuantity < totalQuantity) {
        setNotification({
          type: "error",
          message: `Số lượng vượt quá tồn kho (còn ${variant.stockQuantity - existingQuantity} sản phẩm)`,
        });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      // Add to cart
      await dispatch(
        addItemToCart({ variantId: selectedVariantId, quantity: quantityToAdd })
      ).unwrap();
      setNotification({ type: "success", message: "Đã thêm vào giỏ hàng!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Thêm giỏ hàng thất bại!",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Handle thêm vào giỏ hàng từ modal
  const handleAddToCartFromModal = async (variantId, quantity) => {
    try {
      // Fetch latest cart data
      await dispatch(getCart()).unwrap();

      // Find the variant details
      const selectedVariant = product.variants.find(
        (v) => v.id === variantId
      );

      // Check if variant is already in cart
      const existingCartItem = cart?.items?.find(
        (item) => item.variantId === variantId
      );
      const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;
      const totalQuantity = existingQuantity + quantity;

      // Check stock
      if (selectedVariant?.stockQuantity < totalQuantity) {
        setNotification({
          type: "error",
          message: `Số lượng vượt quá tồn kho (còn ${selectedVariant.stockQuantity - existingQuantity} sản phẩm)`,
        });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      // Add to cart
      await dispatch(addItemToCart({ variantId, quantity })).unwrap();
      setNotification({ type: "success", message: "Đã thêm vào giỏ hàng!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Thêm giỏ hàng thất bại!",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(productId);
    }
  };

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (wishlistLoading) return;

    const optimisticIsFavorite = !isFavorite;
    setIsFavorite(optimisticIsFavorite);

    try {
      if (!isFavorite) {
        await dispatch(addProductToWishlist(productId)).unwrap();
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

  const handleEyeClick = (e) => {
    e.stopPropagation();
    // Placeholder for quick view logic
  };

  return (
    <>
      <div
        className="p-2 transform hover:scale-105 transition-transform duration-200 relative"
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
                disabled={cartLoading}
              >
                {cartLoading ? "Đang tải..." : "Thêm vào giỏ hàng"}
              </button>
            )}
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

      {/* Modal chọn biến thể */}
      <VariantModal
        isOpen={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        product={product}
        onAddToCart={handleAddToCartFromModal}
      />
    </>
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
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        priceOverride: PropTypes.number,
        finalPriceAfterDiscount: PropTypes.number,
        colorName: PropTypes.string,
        sizeName: PropTypes.string,
        stockQuantity: PropTypes.number,
        discountOverrideByFlashSale: PropTypes.number,
        discountType: PropTypes.string,
      })
    ),
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
    flashSale: PropTypes.bool,
    isFavorite: PropTypes.bool,
    soldQuantity: PropTypes.number,
  }).isRequired,
  onRemove: PropTypes.func,
};

export default ProductCard;