/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddressSection from "./AddressSection";
import { calculateShippingFee } from "../../../services/shippingFeeService";
import { checkoutSelectedItemsThunk } from "../../../redux/slices/cartSlice";
import {
  createCodPayment,
  createVnpayPayment,
} from "../../../services/paymentService";

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
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState(null);
  const [voucherId, setVoucherId] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const fetchShippingFee = async () => {
      if (selectedCartItems.length === 0 || !formData.addressId) {
        setShippingFee(0);
        return;
      }

      try {
        const fee = await calculateShippingFee(formData.addressId);
        setShippingFee(fee.total);
      } catch (err) {
        console.error("Tính phí ship thất bại", err);
        setShippingFee(0);
      }
    };

    fetchShippingFee();
  }, [selectedCartItems, formData.addressId]);

  // Tính tổng tiền dựa trên totalPrice hoặc discountedPrice
  const totalCartPrice = selectedCartItems.reduce((sum, item) => {
    const itemPrice =
      item.totalPrice > 0
        ? item.totalPrice
        : item.discountedPrice > 0
        ? item.discountedPrice
        : item.originalPrice;
    return sum + (itemPrice * item.quantity || 0);
  }, 0);

  const totalWithShipping = totalCartPrice + shippingFee;

  const paymentMethods = [
    { id: "COD", name: "Thanh toán khi nhận hàng" },
    { id: "BANK_TRANSFER", name: "Chuyển khoản ngân hàng" },
    { id: "PAYPAL", name: "PayPal" },
    { id: "CREDIT_CARD", name: "Thẻ tín dụng" },
  ];

  const handleVnpayPayment = async (orderId) => {
    try {
      const response = await createVnpayPayment(orderId);

      if (response.code === "00" && response.data) {
        // Chuyển hướng tới trang thanh toán VNPAY
        window.location.href = response.data;
      } else {
        throw new Error(response.message || "Tạo link thanh toán thất bại");
      }
    } catch (err) {
      console.error("VNPAY Payment error:", err);
      setError("Không thể tạo link thanh toán. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  const handleCodPayment = async (orderId) => {
    try {
      const response = await createCodPayment(orderId);

      if (response && response.id) {
        // window.location.href = `/payment-success?orderId=${orderId}`;
      } else {
        throw new Error("Tạo thanh toán COD thất bại");
      }
    } catch (err) {
      console.error("COD Payment error:", err);
      setError("Không thể tạo thanh toán COD. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.useSavedAddress || !formData.addressId) {
      setError("Vui lòng chọn hoặc lưu địa chỉ trước khi thanh toán.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Tạo payload theo format yêu cầu
      const payload = {
        addressId: formData.addressId,
        paymentMethod,
        cartItemIds: selectedCartItems.map((item) => item.cartItemId),
        voucherId,
        usedPoints,
      };

      console.log("Checkout payload:", payload);

      // Gọi API tạo đơn hàng
      const result = await dispatch(
        checkoutSelectedItemsThunk(payload)
      ).unwrap();

      console.log("Checkout result:", result);

      if (paymentMethod === "COD") {
        const orderId = result.orderId || result.id;
        if (orderId) {
          await handleCodPayment(orderId);
        } else {
          throw new Error("Không thể lấy mã đơn hàng");
        }
        Swal.fire({
          title: "Đặt hàng thành công!",
          text: "Đơn hàng của bạn đã được xác nhận. Bạn sẽ thanh toán khi nhận hàng.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/payment-success", {
            state: {
              orderId: result.orderId || result.id,
              paymentMethod: "COD",
            },
          });
        });
      } else {
        // Các phương thức khác: Chuyển hướng đến VNPAY
        const orderId = result.orderId || result.id;
        if (orderId) {
          await handleVnpayPayment(orderId);
        } else {
          throw new Error("Không thể lấy mã đơn hàng");
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto bg-white py-4">
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
                  selectedCartItems.map((item) => {
                    // Tính giá hiển thị cho từng item
                    const displayPrice =
                      item.totalPrice > 0
                        ? item.totalPrice
                        : item.discountedPrice > 0
                        ? item.discountedPrice
                        : item.originalPrice;

                    return (
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
                          <div className="flex-1">
                            <div className="text-gray-900 font-medium">
                              {item.productName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Màu: {item.color} | Size: {item.size}
                            </div>
                            <div className="text-sm text-gray-500">
                              Số lượng: {item.quantity}
                            </div>
                            {/* Hiển thị giá gốc và giá giảm nếu có */}
                            <div className="text-sm">
                              {item.discountedPrice > 0 &&
                              item.discountedPrice < item.originalPrice ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-500 line-through">
                                    {item.originalPrice.toLocaleString("vi-VN")}{" "}
                                    ₫
                                  </span>
                                  <span className="text-red-600 font-medium">
                                    {item.discountedPrice.toLocaleString(
                                      "vi-VN"
                                    )}{" "}
                                    ₫
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-700">
                                  {item.originalPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 font-medium">
                            {(displayPrice * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            ₫
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Giỏ hàng của bạn đang trống.</p>
                )}
              </div>

              {/* Voucher và điểm thưởng */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Mã giảm giá & Điểm thưởng
                </h3>
                <div className="space-y-4">
                  {/* Voucher */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã voucher
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã voucher"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (couponCode.trim()) {
                            setVoucherId(parseInt(couponCode) || 0);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>

                  {/* Điểm thưởng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sử dụng điểm thưởng
                    </label>
                    <input
                      type="number"
                      value={usedPoints}
                      onChange={(e) =>
                        setUsedPoints(parseInt(e.target.value) || 0)
                      }
                      placeholder="Nhập số điểm muốn sử dụng"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
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
                  !formData.addressId ||
                  isSubmitting
                }
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
