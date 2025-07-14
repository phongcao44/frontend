/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddressSection from "./AddressSection";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCartItems = [] } = location.state || {};

  const [formData, setFormData] = useState({
    addressId: "",
    recipientName: "",
    phone: "",
    fullAddress: "",
    provinceName: "",
    districtName: "",
    wardName: "",
    saveInfo: false,
    useSavedAddress: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState(null);

  const shippingFee = selectedCartItems.length > 0 ? 30000 : 0;
  const totalCartPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity || 0),
    0
  );
  const totalWithShipping = totalCartPrice + shippingFee;

  const paymentMethods = [
    { id: "COD", name: "Thanh toán khi nhận hàng" },
    { id: "BANK_TRANSFER", name: "Chuyển khoản ngân hàng" },
    { id: "PAYPAL", name: "PayPal" },
    { id: "CREDIT_CARD", name: "Thẻ tín dụng" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.useSavedAddress || !formData.addressId) {
      setError("Vui lòng chọn hoặc lưu địa chỉ trước khi thanh toán.");
      return;
    }
    try {
      const payload = {
        addressId: formData.addressId,
        recipientName: formData.recipientName,
        phone: formData.phone,
        fullAddress: formData.fullAddress,
        province: formData.provinceName,
        district: formData.districtName,
        ward: formData.wardName,
        paymentMethod,
        cartItems: selectedCartItems,
        totalAmount: totalWithShipping,
      };

      Swal.fire({
        title: "Đặt hàng thành công!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      // navigate("/");
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Đã xảy ra lỗi trong quá trình thanh toán.");
    }
  };

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto bg-white py-8">
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-4 text-red-600">{error}</div>
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <span>Tài khoản</span>
          <span className="mx-2">/</span>
          <span>Tài khoản của tôi</span>
          <span className="mx-2">/</span>
          <span>Sản phẩm</span>
          <span className="mx-2">/</span>
          <span>Giỏ hàng</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Thanh toán</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Billing */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">
              Thông tin thanh toán
            </h2>
            <div className="space-y-6">
              <AddressSection
                formData={formData}
                setFormData={setFormData}
                setError={setError}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-8">
            <div className="space-y-6">
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
                              Không có hình ảnh
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
                  <p>Giỏ hàng của bạn đang trống.</p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Phương thức thanh toán
                </h3>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center space-x-3 p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="text-gray-700">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-6">
                <div className="flex justify-between mb-4">
                  <span>Tạm tính:</span>
                  <span>{totalCartPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span>{totalWithShipping.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-300"
                disabled={
                  selectedCartItems.length === 0 ||
                  !formData.useSavedAddress ||
                  !formData.addressId
                }
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
