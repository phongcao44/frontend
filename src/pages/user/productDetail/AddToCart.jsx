import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemToCart, getCart, checkoutSelectedItemsPreviewThunk } from "../../../redux/slices/cartSlice";
import { addProductToWishlist, removeProductFromWishlist, getUserWishlist } from "../../../redux/slices/wishlistSlice";
import { getAddresses } from "../../../redux/slices/addressSlice";
import Swal from "sweetalert2";
import { shallowEqual } from "react-redux";

function AddToCart({ productId, matchedVariant, maxQuantity = 10, selectedColorId, selectedSizeId }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist, shallowEqual);
  const { cart, loading: cartLoading, itemLoading } = useSelector((state) => state.cart, shallowEqual);
  const { addresses, loading: addressLoading } = useSelector((state) => state.address, shallowEqual);
  const { user, isLoggedIn } = useSelector((state) => state.auth, shallowEqual);

  // Dynamic maxQuantity from matchedVariant or prop
  const effectiveMaxQuantity = matchedVariant?.stockQuantity ?? maxQuantity;

  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some((item) => item.product?.id === productId);
  const wishlistItem = wishlistItems.find((item) => item.product?.id === productId);
  const wishlistId = wishlistItem?.wishlistId;

  // Fetch cart, wishlist, and addresses on mount (like Cart)
  useEffect(() => {
    if (productId && isLoggedIn) {
      dispatch(getCart());
      dispatch(getUserWishlist());
      dispatch(getAddresses());
    }
  }, [dispatch, productId, isLoggedIn]);

  // Check if variant has colors or sizes
  const hasColors = matchedVariant && matchedVariant.colorId != null;
  const hasSizes = matchedVariant && matchedVariant.sizeId != null;
  const isColorSelected = !hasColors || selectedColorId != null;
  const isSizeSelected = !hasSizes || selectedSizeId != null;
  const isVariantSelected = matchedVariant && effectiveMaxQuantity > 0 && isColorSelected && isSizeSelected;

  // Get current quantity in cart for the variant
  const getCurrentCartQuantity = useCallback(() => {
    if (!matchedVariant?.id || !cart?.items) return 0;
    const cartItem = cart.items.find((item) => item.variantId === matchedVariant.id);
    return cartItem?.quantity ?? 0;
  }, [cart?.items, matchedVariant?.id]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isVariantSelected) {
      let errorMessage = "Vui lòng chọn biến thể sản phẩm!";
      if (hasColors && !isColorSelected) errorMessage = "Vui lòng chọn màu sắc!";
      else if (hasSizes && !isSizeSelected) errorMessage = "Vui lòng chọn kích thước!";
      message.warning(errorMessage);
      return;
    }

    if (!matchedVariant?.id) {
      message.error("Lỗi: Không tìm thấy biến thể sản phẩm!");
      return;
    }

    const currentQuantityInCart = getCurrentCartQuantity();
    const totalQuantity = currentQuantityInCart + quantity;

    if (totalQuantity > effectiveMaxQuantity) {
      message.error(`Số lượng vượt quá giới hạn (${effectiveMaxQuantity})! Hiện tại đã có ${currentQuantityInCart} sản phẩm trong giỏ hàng.`);
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ variantId: matchedVariant.id, quantity })).unwrap();
      await dispatch(getCart()).unwrap();
      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      message.error(`Thêm giỏ hàng thất bại: ${error.message || "Lỗi không xác định"}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();

    if (!isVariantSelected) {
      let errorMessage = "Vui lòng chọn biến thể sản phẩm!";
      if (hasColors && !isColorSelected) errorMessage = "Vui lòng chọn màu sắc!";
      else if (hasSizes && !isSizeSelected) errorMessage = "Vui lòng chọn kích thước!";
      message.warning(errorMessage);
      return;
    }

    if (!matchedVariant?.id) {
      message.error("Lỗi: Không tìm thấy biến thể sản phẩm!");
      return;
    }

    if (addressLoading) {
      message.warning("Vui lòng đợi trong khi đang tải địa chỉ...");
      return;
    }

    if (!addresses?.length) {
      Swal.fire(
        "Thông báo",
        "Vui lòng thêm địa chỉ trước khi thanh toán.",
        "warning"
      );
      navigate("/account/addresses");
      return;
    }

    const currentQuantityInCart = getCurrentCartQuantity();
    const totalQuantity = currentQuantityInCart + quantity;

    if (totalQuantity > effectiveMaxQuantity) {
      message.error(`Số lượng vượt quá giới hạn (${effectiveMaxQuantity})! Hiện tại đã có ${currentQuantityInCart} sản phẩm trong giỏ hàng.`);
      return;
    }

    setIsBuying(true);
    try {
      const payload = {
        addressId: addresses[0].addressId, // Default to first address, like Cart
        paymentMethod: "COD", // Default to COD, like Cart
        variantId: matchedVariant.id, // Use variantId directly
        quantity, // Use quantity directly
        usedPoints: 0,
        note: "",
      };
      const result = await dispatch(checkoutSelectedItemsPreviewThunk(payload)).unwrap();
      navigate("/checkout", { state: { preview: result } });
    } catch (error) {
      message.error(`Tạo xem trước thanh toán thất bại: ${error.message || "Lỗi không xác định"}`);
    } finally {
      setIsBuying(false);
    }
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(effectiveMaxQuantity, Number(value) || 1));
    setQuantity(newValue);
  };

  const handleWishlistToggle = async () => {
    if (wishlistLoading) return;

    try {
      if (!isInWishlist) {
        await dispatch(addProductToWishlist(productId)).unwrap();
        await dispatch(getUserWishlist()).unwrap();
        Swal.fire({
          title: "Thành công!",
          text: "Đã thêm sản phẩm vào danh sách yêu thích",
          icon: "success",
          timer: 1500,
        });
      } else {
        if (!wishlistId) {
          message.error("Dữ liệu yêu thích không đồng bộ. Vui lòng thử lại.");
          return;
        }
        await dispatch(removeProductFromWishlist(wishlistId)).unwrap();
        await dispatch(getUserWishlist()).unwrap();
        Swal.fire({
          title: "Thành công!",
          text: "Đã xóa sản phẩm khỏi danh sách yêu thích",
          icon: "success",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Lỗi!",
        text: error.message || "Không thể cập nhật danh sách yêu thích",
        icon: "error",
      });
    }
  };

  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex items-center border border-gray-300 rounded" role="group" aria-label="Bộ chọn số lượng">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className={`h-8 px-2 ${quantity <= 1 ? "bg-gray-200" : "bg-white"}`}
          aria-label="Giảm số lượng"
        >
          <MinusOutlined />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
          className="w-12 text-center outline-none h-8 border-none"
          aria-label="Số lượng"
          min="1"
          max={effectiveMaxQuantity}
        />
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= effectiveMaxQuantity}
          className={`h-8 px-2 ${quantity >= effectiveMaxQuantity ? "bg-gray-200" : "bg-white"}`}
          aria-label="Tăng số lượng"
        >
          <PlusOutlined />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          isAdding ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
        }`}
        disabled={isAdding}
        aria-label="Thêm vào giỏ hàng"
      >
        Thêm vào giỏ hàng
      </button>

      <button
        onClick={handleBuyNow}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          isBuying ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
        }`}
        disabled={isBuying || addressLoading}
        aria-label="Mua ngay"
      >
        Mua ngay
      </button>

      <button
        onClick={handleWishlistToggle}
        className={`p-2 rounded-full transition-all duration-200 ${
          isInWishlist
            ? "bg-red-50 text-red-500 hover:bg-red-100"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
        }`}
        aria-label={isInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        disabled={wishlistLoading}
      >
        <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}

AddToCart.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  matchedVariant: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productName: PropTypes.string,
    colorId: PropTypes.number,
    sizeId: PropTypes.number,
    colorName: PropTypes.string,
    sizeName: PropTypes.string,
    stockQuantity: PropTypes.number,
    finalPriceAfterDiscount: PropTypes.number,
    priceOverride: PropTypes.number,
  }).isRequired,
  maxQuantity: PropTypes.number,
  selectedColorId: PropTypes.number,
  selectedSizeId: PropTypes.number,
};

export default AddToCart;