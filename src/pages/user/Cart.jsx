import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateCartItemQuantity,
  removeItemFromCart,
} from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);

  const [localQuantities, setLocalQuantities] = useState({});

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (cart?.items) {
      const quantities = {};
      cart.items.forEach((item) => {
        quantities[item.cartItemId] = item.quantity;
      });
      setLocalQuantities(quantities);
    }
  }, [cart]);

  const handleQuantityChange = (cartItemId, delta) => {
    setLocalQuantities((prev) => {
      const newQty = (prev[cartItemId] || 0) + delta;
      return { ...prev, [cartItemId]: newQty > 0 ? newQty : 0 };
    });
  };

  const handleUpdateCart = async () => {
    const updates = Object.entries(localQuantities).map(([cartItemId, qty]) => {
      const id = Number(cartItemId);
      if (qty < 1) {
        return dispatch(removeItemFromCart(id));
      } else {
        return dispatch(
          updateCartItemQuantity({ cartItemId: id, quantity: qty })
        );
      }
    });

    await Promise.all(updates);
    dispatch(getCart());
  };

  const subtotal =
    cart?.items?.reduce((sum, item) => {
      const qty = localQuantities[item.cartItemId] || 0;
      return sum + item.price * qty;
    }, 0) || 0;

  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-12 text-sm text-gray-500">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-black">Cart</span>
        </nav>

        {/* Cart Header */}
        <div className="bg-white shadow-sm border border-gray-200 mb-4">
          <div className="grid grid-cols-4 gap-8 px-8 py-6">
            <div className="font-medium">Product</div>
            <div className="font-medium">Price</div>
            <div className="font-medium">Quantity</div>
            <div className="font-medium">Subtotal</div>
          </div>
        </div>

        {/* Product Rows */}
        {cart?.items?.length > 0 ? (
          cart.items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white shadow-sm border border-gray-200 mb-4"
            >
              <div className="grid grid-cols-4 gap-8 px-8 py-8 items-center">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="text-black">{item.productName}</span>
                </div>

                <div className="text-black">
                  {item.price.toLocaleString("vi-VN")} ₫
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, -1)}
                    className="px-2 py-1 border border-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="px-4">
                    {localQuantities[item.cartItemId]}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, 1)}
                    className="px-2 py-1 border border-gray-300 rounded"
                  >
                    +
                  </button>
                </div>

                <div className="text-black">
                  {(
                    item.price * (localQuantities[item.cartItemId] || 0)
                  ).toLocaleString("vi-VN")}{" "}
                  ₫
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between my-8">
          <button
            className="px-8 py-3 border border-gray-300 text-black bg-white hover:bg-gray-50"
            onClick={() => navigate("/home")}
          >
            Return To Shop
          </button>
          <button
            className="px-8 py-3 border border-gray-300 text-black bg-white hover:bg-gray-50"
            onClick={handleUpdateCart}
          >
            Update Cart
          </button>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          <div className="flex space-x-4 items-start">
            <input
              type="text"
              placeholder="Coupon Code"
              className="flex-1 px-4 py-3 border border-gray-300"
            />
            <button className="px-8 py-3 bg-red-500 text-white hover:bg-red-600">
              Apply Coupon
            </button>
          </div>

          <div
            className="bg-white border border-gray-300 p-8 ml-auto"
            style={{ width: "400px" }}
          >
            <h3 className="text-xl font-medium mb-6">Cart Total</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span>Subtotal:</span>
                <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span>Shipping:</span>
                <span>{shippingFee.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex justify-between py-3">
                <span>Total:</span>
                <span>{total.toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>

            <button
              className="w-full mt-8 px-6 py-3 bg-red-500 text-white hover:bg-red-600"
              onClick={() => navigate("/checkout")}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
