import { useEffect, useState } from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemToCart, getCart } from "../../../redux/slices/cartSlice";
import { addProductToWishlist, removeProductFromWishlist, getUserWishlist } from "../../../redux/slices/wishlistSlice";
import Swal from "sweetalert2";

const AddToCart = ({ productId, matchedVariant, maxQuantity = 10, selectedColorId, selectedSizeId }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Dynamic maxQuantity from matchedVariant or prop
  const effectiveMaxQuantity = matchedVariant?.stockQuantity ?? maxQuantity;

  // Kiểm tra trạng thái yêu thích dựa trên wishlistItems
  const isInWishlist = wishlistItems.some((item) => item.product?.id === productId);

  // Tìm wishlistId tương ứng với productId
  const wishlistItem = wishlistItems.find((item) => item.product?.id === productId);
  const wishlistId = wishlistItem?.wishlistId;

  useEffect(() => {
    if (productId) {
      dispatch(getCart());
      dispatch(getUserWishlist());
    }
  }, [dispatch, productId]);

  // Kiểm tra xem người dùng đã chọn biến thể chưa
  const hasColors = matchedVariant && (matchedVariant.colorId !== null && matchedVariant.colorId !== undefined);
  const hasSizes = matchedVariant && (matchedVariant.sizeId !== null && matchedVariant.sizeId !== undefined);

  // Kiểm tra xem người dùng đã chọn màu và kích thước chưa
  const isColorSelected = !hasColors || selectedColorId !== null;
  const isSizeSelected = !hasSizes || selectedSizeId !== null;

  const isVariantSelected = matchedVariant && effectiveMaxQuantity > 0 && isColorSelected && isSizeSelected;

  // Kiểm tra số lượng hiện có trong giỏ hàng cho biến thể
  const getCurrentCartQuantity = () => {
    if (!matchedVariant?.id || !cart?.items) return 0;
    const cartItem = cart.items.find(item => item.variantId === matchedVariant.id);
    return cartItem && cartItem.quantity !== undefined ? cartItem.quantity : 0;
  };

  // Kiểm tra xem sản phẩm (dù khác variant) đã có trong giỏ hàng chưa
  const hasSameProductInCart = () => {
    if (!cart?.items || !matchedVariant?.productName) return false;
    return cart.items.some(item => item.productName === matchedVariant.productName && item.variantId !== matchedVariant.id);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isVariantSelected) {
      let errorMessage = "Vui lòng chọn biến thể sản phẩm!";
      if (hasColors && !isColorSelected) {
        errorMessage = "Vui lòng chọn màu sắc!";
      } else if (hasSizes && !isSizeSelected) {
        errorMessage = "Vui lòng chọn kích thước!";
      }
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

    // Cảnh báo nếu sản phẩm đã có trong giỏ với variant khác
    if (hasSameProductInCart()) {
      message.info(`Sản phẩm "${matchedVariant.productName}" với biến thể khác đã có trong giỏ hàng.`);
    }

    setIsAdding(true);
    try {
      await dispatch(addItemToCart({ variantId: matchedVariant.id, quantity })).unwrap();
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
      if (hasColors && !isColorSelected) {
        errorMessage = "Vui lòng chọn màu sắc!";
      } else if (hasSizes && !isSizeSelected) {
        errorMessage = "Vui lòng chọn kích thước!";
      }
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

    setIsBuying(true);
    try {
      const result = await dispatch(addItemToCart({ 
        variantId: matchedVariant.id, 
        quantity 
      })).unwrap();

      const unitPrice = matchedVariant.finalPriceAfterDiscount || matchedVariant.priceOverride;
      const cartItem = {
        cartItemId: result.cartItemId,
        variantId: matchedVariant.id,
        productId: productId,
        productName: matchedVariant.productName || "Sản phẩm",
        quantity: quantity,
        originalPrice: unitPrice,
        totalPrice: unitPrice,
        discountedPrice: unitPrice,
        colorName: matchedVariant.colorName,
        sizeName: matchedVariant.sizeName,
        image: `https://picsum.photos/seed/${result.cartItemId}/200/200`
      };

      navigate("/checkout", { 
        state: { 
          selectedCartItems: [cartItem] 
        } 
      });
    } catch (error) {
      message.error(`Không thể thêm sản phẩm vào giỏ hàng: ${error.message || "Lỗi không xác định"}`);
    } finally {
      setIsBuying(false);
    }
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(effectiveMaxQuantity, Number(value) || 1));
    setQuantity(newValue);
  };

  const handleWishlistToggle = async () => {
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
        const currentWishlistItem = wishlistItems.find((item) => item.product?.id === productId);
        const currentWishlistId = currentWishlistItem?.wishlistId;

        if (!currentWishlistId) {
          await dispatch(getUserWishlist()).unwrap();
          Swal.fire({
            title: "Cảnh báo!",
            text: "Dữ liệu yêu thích không đồng bộ. Đã làm mới danh sách.",
            icon: "warning",
            timer: 1500,
          });
          return;
        }

        await dispatch(removeProductFromWishlist(currentWishlistId)).unwrap();
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
      <div className="flex items-center border border-gray-300 rounded">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className={`h-8 px-2 ${quantity <= 1 ? "bg-gray-200" : "bg-white"}`}
        >
          <MinusOutlined />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
          className="w-12 text-center outline-none h-8 border-none"
        />
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= effectiveMaxQuantity}
          className={`h-8 px-2 ${quantity >= effectiveMaxQuantity ? "bg-gray-200" : "bg-white"}`}
        >
          <PlusOutlined />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          isAdding ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
        }`}
      >
        Thêm vào giỏ hàng
      </button>

      <button
        onClick={handleBuyNow}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          isBuying ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
        }`}
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
        title={isInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
      </button>
    </div>
  );
};

AddToCart.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  matchedVariant: PropTypes.object,
  maxQuantity: PropTypes.number,
  selectedColorId: PropTypes.number,
  selectedSizeId: PropTypes.number,
};

export default AddToCart;