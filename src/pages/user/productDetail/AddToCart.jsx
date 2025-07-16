import { useEffect, useState } from "react";
import { message } from "antd";
import PropTypes from "prop-types";
import { HeartOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, getCart } from "../../../redux/slices/cartSlice";

const AddToCart = ({ productId, matchedVariant, maxQuantity = 10 }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.products.wishlist) || {};

  useEffect(() => {
    if (productId) {
      dispatch(getCart());
    }
  }, [dispatch, productId]);

  const isVariantSelected = matchedVariant && maxQuantity > 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isVariantSelected) {
      message.warning("Vui lòng chọn biến thể sản phẩm!");
      return;
    }

    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 500);

    const variantId = matchedVariant?.id;
    // const cartQuantity =
    //   cart.items?.find((item) => item.variantId === variantId)?.quantity || 0;
    const totalQuantity = quantity;
    //
    // if (totalQuantity > maxQuantity) {
    //   message.warning(
    //     `Bạn đã thêm ${cartQuantity} sản phẩm, chỉ có thể thêm tối đa ${
    //       maxQuantity - cartQuantity
    //     } sản phẩm nữa.`
    //   );
    //   return;
    // }

    try {
      await dispatch(addItemToCart({ variantId, quantity })).unwrap();
      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      message.error("Thêm giỏ hàng thất bại!");
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();

    if (!isVariantSelected) {
      message.warning("Vui lòng chọn biến thể sản phẩm!");
      return;
    }

    setIsBuying(true);
    setTimeout(() => setIsBuying(false), 500);

    console.log(
      `Buy now: ${quantity} of product ${productId}, variant ${matchedVariant?.id}`
    );
  };

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(maxQuantity, Number(value) || 1));
    setQuantity(newValue);
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
        disabled={!isVariantSelected}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          !isVariantSelected
            ? "bg-gray-400 cursor-not-allowed"
            : isAdding
            ? "bg-gray-500"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        Thêm vào giỏ hàng
      </button>

      <button
        onClick={handleBuyNow}
        disabled={!isVariantSelected}
        className={`flex-1 h-10 rounded text-white font-semibold transition-colors duration-200 ${
          !isVariantSelected
            ? "bg-gray-400 cursor-not-allowed"
            : isBuying
            ? "bg-gray-500"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        Mua ngay
      </button>

      <button
        className={`h-10 w-10 flex items-center justify-center border border-gray-300 rounded ${
          wishlist[productId] ? "text-red-500" : "text-gray-700"
        }`}
      >
        <HeartOutlined />
      </button>
    </div>
  );
};

AddToCart.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  matchedVariant: PropTypes.object,
  maxQuantity: PropTypes.number,
};

export default AddToCart;
