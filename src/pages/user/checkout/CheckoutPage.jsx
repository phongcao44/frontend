import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart, checkoutUserCart } from "../../../redux/slices/cartSlice";
import AddressSection from "./AddressSection";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCartItems = [] } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: "",
    streetAddress: "",
    apartment: "",
    townCity: "",
    phoneNumber: "",
    saveInfo: true,
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState(null);

  const shippingFee = selectedCartItems.length > 0 ? 30000 : 0;
  const totalCartPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity || 0),
    0
  );
  const totalWithShipping = totalCartPrice + shippingFee;

  useEffect(() => {
    dispatch(getCart()).catch((err) => {
      console.error("Failed to fetch cart:", err);
      setError("Unable to load cart data.");
    });
  }, [dispatch]);

  const handleAddressChange = (address) => {
    console.log("Địa chỉ GHN:", address);
    setFormData((prev) => ({
      ...prev,
      streetAddress: address.street || prev.streetAddress,
      townCity: address.city || prev.townCity,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      paymentMethod,
      couponCode,
      selectedCartItems,
    };

    dispatch(checkoutUserCart(payload))
      .unwrap()
      .then(() => {
        alert("Order placed successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Checkout failed:", err);
        setError("Checkout failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto bg-white py-8">
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-4 text-red-600">{error}</div>
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <span>Account</span>
          <span className="mx-2">/</span>
          <span>My Account</span>
          <span className="mx-2">/</span>
          <span>Product</span>
          <span className="mx-2">/</span>
          <span>View Cart</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">CheckOut</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Billing Details */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
            <div className="space-y-6">
              <AddressSection
                formData={formData}
                setFormData={setFormData}
                handleAddressChange={handleAddressChange}
                setError={setError}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Product Items */}
              <div className="space-y-4">
                {selectedCartItems.length > 0 ? (
                  selectedCartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              No Image
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-900">
                            {item.productName}
                          </span>
                          <span className="text-sm text-gray-500 font-normal">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-900 font-medium">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-900">
                    {totalCartPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="text-gray-900">
                    {shippingFee.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between items-center mb-6 text-lg font-semibold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    {totalWithShipping.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bank"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="bank" className="ml-3">
                    Bank
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="cash" className="ml-3">
                    Cash on delivery
                  </label>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  className="px-6 py-2 bg-red-600 text-white rounded-md"
                >
                  Apply Coupon
                </button>
              </div>

              {/* Place Order */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-red-600 text-white rounded-lg disabled:bg-gray-300"
                disabled={
                  selectedCartItems.length === 0 ||
                  !formData.firstName ||
                  !formData.streetAddress ||
                  !formData.townCity ||
                  !formData.phoneNumber
                }
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
