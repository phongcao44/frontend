import { useEffect, useState } from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import { HeartOutlined, HeartFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemToCart, getCart } from "../../../redux/slices/cartSlice";
import { addProductToWishlist, removeProductFromWishlist, getUserWishlist } from "../../../redux/slices/wishlistSlice";
import Swal from 'sweetalert2';

const AddToCart = ({ productId, matchedVariant, maxQuantity = 10, selectedColorId, selectedSizeId }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const isInWishlist = wishlistItems.some(
    item => {
      const itemProductId = item.productId || item.product?.id;
      return itemProductId == productId; 
    }
  );

  useEffect(() => {
    if (productId) {
      dispatch(getCart());
    }
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  // Kiểm tra xem người dùng đã chọn biến thể chưa
  const hasColors = matchedVariant && (matchedVariant.colorId !== null && matchedVariant.colorId !== undefined);
  const hasSizes = matchedVariant && (matchedVariant.sizeId !== null && matchedVariant.sizeId !== undefined);
  
  // Kiểm tra xem người dùng đã chọn màu và kích thước chưa
  const isColorSelected = !hasColors || selectedColorId !== null;
  const isSizeSelected = !hasSizes || selectedSizeId !== null;
  
  const isVariantSelected = matchedVariant && maxQuantity > 0 && isColorSelected && isSizeSelected;

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
      console.error("Error: matchedVariant.id is undefined or null", { matchedVariant });
      message.error("Lỗi: Không tìm thấy biến thể sản phẩm!");
      return;
    }

    setIsAdding(true);
    try {
      console.log("Adding to cart:", { variantId: matchedVariant.id, quantity });
      await dispatch(addItemToCart({ variantId: matchedVariant.id, quantity })).unwrap();
      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Add to cart failed:", error);
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
      console.error("Error: matchedVariant.id is undefined or null", { matchedVariant });
      message.error("Lỗi: Không tìm thấy biến thể sản phẩm!");
      return;
    }

    setIsBuying(true);
    try {
      console.log("Buying now:", { variantId: matchedVariant.id, quantity });
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
      console.error("Buy now failed:", error);
      message.error(`Không thể thêm sản phẩm vào giỏ hàng: ${error.message || "Lỗi không xác định"}`);
    } finally {
      setIsBuying(false);
    }
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(maxQuantity, Number(value) || 1));
    setQuantity(newValue);
  };

  const handleWishlistToggle = async () => {
    try {
      if (!isInWishlist) {
        await dispatch(addProductToWishlist(productId)).unwrap();
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã thêm sản phẩm vào danh sách yêu thích',
          icon: 'success',
          timer: 1500
        });
      } else {
        const wishlistItem = wishlistItems.find(item => {
          const itemProductId = item.productId || item.product?.id;
          return itemProductId == productId;
        });
        if (wishlistItem) {
          await Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
          }).then(async (result) => {
            if (result.isConfirmed) {
              await dispatch(removeProductFromWishlist(wishlistItem.wishListId)).unwrap();
              Swal.fire(
                'Đã xóa!',
                'Sản phẩm đã được xóa khỏi danh sách yêu thích.',
                'success'
              );
            }
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Lỗi!',
        text: error.message || 'Không thể thực hiện thao tác',
        icon: 'error'
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
          disabled={quantity >= maxQuantity}
          className={`h-8 px-2 ${
            quantity >= maxQuantity ? "bg-gray-200" : "bg-white"
          }`}
        >
          <PlusOutlined />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          isAdding
            ? "bg-gray-500"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        Thêm vào giỏ hàng
      </button>

      <button
        onClick={handleBuyNow}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          isBuying
            ? "bg-gray-500"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        Mua ngay
      </button>

      <button
        onClick={handleWishlistToggle}
        className={`h-10 w-10 flex items-center justify-center border border-gray-300 rounded transition-all duration-200 ${
          isInWishlist 
            ? "text-red-500 border-red-300 bg-red-50 hover:bg-red-100" 
            : "text-gray-700 hover:bg-gray-50"
        }`}
        title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        {isInWishlist ? <HeartFilled /> : <HeartOutlined />}
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