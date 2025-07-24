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
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (cart?.items) {
      const quantities = {};
      cart.items.forEach((item) => {
        quantities[item.cartItemId] = item.quantity;
      });
      if (selectedItems.length === 0) {
        setSelectedItems(cart.items.map((item) => item.cartItemId));
      }
      setLocalQuantities(quantities);
    }
  }, [cart]);

  const handleQuantityChange = async (cartItemId, delta) => {
    if (!selectedItems.includes(cartItemId)) return;

    const currentQty = localQuantities[cartItemId] || 0;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      await dispatch(removeItemFromCart(cartItemId));
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
    } else {
      await dispatch(updateCartItemQuantity({ cartItemId, quantity: newQty }));
      setLocalQuantities((prev) => ({
        ...prev,
        [cartItemId]: newQty,
      }));
    }
    await dispatch(getCart());
  };

  const handleRemoveItem = async (cartItemId) => {
    await dispatch(removeItemFromCart(cartItemId));
    setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));

    await dispatch(getCart());
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart?.items?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map((item) => item.cartItemId));
    }
  };

  const subtotal =
    cart?.items?.reduce((sum, item) => {
      if (selectedItems.includes(item.cartItemId)) {
        return sum + (item.totalPrice || 0);// * (item.quantity || 0);
      }
      return sum;
    }, 0) || 0;

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handleProceedToCheckout = () => {
    const selectedCartItems = cart.items.filter((item) =>
      selectedItems.includes(item.cartItemId)
    );
    navigate("/checkout", { state: { selectedCartItems } });
  };

  const placeholderImage = "/placeholder.png";

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
          <div className="grid grid-cols-6 gap-8 px-8 py-6 items-center">
            <div className="font-medium flex items-center">
              <input
                type="checkbox"
                checked={
                  cart?.items?.length > 0 &&
                  selectedItems.length === cart.items.length
                }
                onChange={handleSelectAll}
                className="h-5 w-5 text-red-500 mr-2"
              />
              Select All
            </div>
            <div className="font-medium">Product</div>
            <div className="font-medium">Price</div>
            <div className="font-medium">Quantity</div>
            <div className="font-medium">Subtotal</div>
            <div className="font-medium">Action</div>
          </div>
        </div>

        {/* Product Rows */}
        {cart?.items?.length > 0 ? (
          cart.items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white shadow-sm border border-gray-200 mb-4"
            >
              <div className="grid grid-cols-6 gap-8 px-8 py-8 items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.cartItemId)}
                    onChange={() => handleSelectItem(item.cartItemId)}
                    className="h-5 w-5 text-red-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.image && item.image.trim()
                        ? item.image
                        : placeholderImage
                    }
                    alt={item.productName || "Product Image"}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="text-black">
                    {item.productName || "Unknown Product"}
                  </span>
                </div>
                <div className="text-black">
                  {(item.originalPrice || 0).toLocaleString("vi-VN")} ₫
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, -1)}
                    className="px-2 py-1 border border-gray-300 rounded"
                    disabled={!selectedItems.includes(item.cartItemId)}
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity || 0}</span>
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, 1)}
                    className="px-2 py-1 border border-gray-300 rounded"
                    disabled={!selectedItems.includes(item.cartItemId)}
                  >
                    +
                  </button>
                </div>
                <div className="text-black">
                  {(
                    (item.originalPrice || 0) * (item.quantity || 0)
                  ).toLocaleString("vi-VN")}{" "}
                  ₫
                </div>
                <div>
                  <button
                    onClick={() => handleRemoveItem(item.cartItemId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
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
              className="w-full mt-8 px-6 py-3 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300"
              onClick={handleProceedToCheckout}
              disabled={selectedItems.length === 0}
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
