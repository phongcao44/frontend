import PropTypes from "prop-types";
import { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Heart, Eye, Star, Trash2, X } from "lucide-react";
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

// Modal Component để chọn biến thể
const VariantModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  // Lấy danh sách màu sắc và kích thước unique
  const colors = [...new Set(product.variants?.map(v => v.colorName).filter(Boolean))];
  const sizes = [...new Set(product.variants?.map(v => v.sizeName).filter(Boolean))];

  // Tìm biến thể dựa trên màu và size đã chọn
  const findVariant = (color, size) => {
    return product.variants?.find(v => v.colorName === color && v.sizeName === size);
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
  const canAddToCart = selectedColor && selectedSize && selectedVariant && selectedVariant.stockQuantity > 0;

  // Sử dụng portal để render modal outside của component tree
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" 
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chọn biến thể</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                Giá: {selectedVariant.priceOverride?.toLocaleString("vi-VN")} VNĐ
              </span>
              <span className="text-sm text-gray-600">
                Còn lại: {selectedVariant.stockQuantity}
              </span>
            </div>
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
              disabled={selectedVariant && quantity >= selectedVariant.stockQuantity}
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
            disabled={!canAddToCart}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              canAddToCart
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Thêm vào giỏ hàng
          </button>
        </div>

        {/* Thông báo lỗi */}
        {!canAddToCart && selectedColor && selectedSize && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {!selectedVariant 
              ? "Biến thể này không có sẵn" 
              : selectedVariant.stockQuantity === 0 
              ? "Sản phẩm đã hết hàng" 
              : "Vui lòng chọn đầy đủ thông tin"}
          </p>
        )}
      </div>
    </div>
  );

  // Render modal vào document.body để tránh bị giới hạn bởi parent containers
  if (typeof document !== 'undefined') {
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

    // Kiểm tra xem sản phẩm có nhiều biến thể không
    if (variants && variants.length > 1) {
      // Nếu có nhiều biến thể, hiển thị modal
      setShowVariantModal(true);
      return;
    }

    // Nếu chỉ có 1 biến thể hoặc không có biến thể, thêm trực tiếp vào giỏ hàng
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

  // Handle thêm vào giỏ hàng từ modal
  const handleAddToCartFromModal = async (variantId, quantity) => {
    try {
      await dispatch(addItemToCart({ variantId, quantity })).unwrap();
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
            className={`absolute top-0 left-0 right-0 mx-2 mt-2 p-2 rounded-md text-white text-center text-sm font-medium z-50
              ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}
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
        colorName: PropTypes.string,
        sizeName: PropTypes.string,
        stockQuantity: PropTypes.number,
      })
    ),
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
    flashSale: PropTypes.bool,
  }).isRequired,
  onRemove: PropTypes.func,
};

export default ProductCard;