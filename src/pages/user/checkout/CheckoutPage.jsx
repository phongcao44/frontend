/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddressSection from "./AddressSection";
import { calculateShippingFee } from "../../../services/shippingFeeService";
import { checkoutSelectedItemsThunk } from "../../../redux/slices/cartSlice";
import {
  createCodPayment,
  createVnpayPayment,
} from "../../../services/paymentService";
// Mock data cho voucher và điểm thưởng
const mockUserVouchers = [
  {
    id: 1,
    code: "WELCOME10",
    description: "Voucher chào mừng thành viên mới",
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscount: 50000,
    minOrderValue: 200000,
    expiryDate: "2025-12-31",
    isActive: true,
    isUsed: false
  },
  {
    id: 2,
    code: "FREESHIP",
    description: "Miễn phí vận chuyển cho đơn hàng từ 300k",
    discountType: "FIXED",
    discountValue: 30000,
    maxDiscount: null,
    minOrderValue: 300000,
    expiryDate: "2025-11-30",
    isActive: true,
    isUsed: false
  },
  {
    id: 3,
    code: "SUMMER20",
    description: "Ưu đãi mùa hè giảm 20%",
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscount: 100000,
    minOrderValue: 500000,
    expiryDate: "2025-09-30",
    isActive: true,
    isUsed: false
  },
  {
    id: 4,
    code: "FLASH50",
    description: "Flash sale giảm 50k",
    discountType: "FIXED",
    discountValue: 50000,
    maxDiscount: null,
    minOrderValue: 250000,
    expiryDate: "2025-08-15",
    isActive: true,
    isUsed: false
  },
  {
    id: 5,
    code: "VIP15",
    description: "Voucher VIP giảm 15%",
    discountType: "PERCENTAGE",
    discountValue: 15,
    maxDiscount: 200000,
    minOrderValue: 1000000,
    expiryDate: "2025-12-25",
    isActive: true,
    isUsed: false
  }
];

const mockUserPoints = 2500; // Mock 2500 điểm thưởng

// Mock functions
const getUserVouchers = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockUserVouchers;
};

const getUserPoints = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUserPoints;
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCartItems = [] } = location.state || {};

  // Lấy thông tin user từ Redux store
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    addressId: "",
    recipientName: "",
    phone: "",
    fullAddress: "",
    provinceName: "",
    districtName: "",
    wardName: "",
    useSavedAddress: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [error, setError] = useState(null);
  const [voucherId, setVoucherId] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  
  // State mới cho voucher và điểm thưởng
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  // Calculate total cart price using item.totalPrice directly
  const totalCartPrice = selectedCartItems.reduce((sum, item) => {
    const itemPrice =
      item.totalPrice && item.totalPrice > 0
        ? item.totalPrice
        : (item.discountedPrice && item.discountedPrice > 0
            ? item.discountedPrice
            : item.originalPrice || 0) * (item.quantity || 1);
    return sum + itemPrice;
  }, 0);

  // Fetch vouchers của user
  useEffect(() => {
    const fetchUserVouchers = async () => {
      setIsLoadingVouchers(true);
      try {
        const vouchers = await getUserVouchers();
        // Lọc voucher còn hiệu lực, chưa sử dụng và phù hợp với đơn hàng
        const validVouchers = vouchers.filter(voucher => 
          voucher.isActive && 
          !voucher.isUsed && 
          new Date(voucher.expiryDate) > new Date() &&
          totalCartPrice >= (voucher.minOrderValue || 0)
        );
        setAvailableVouchers(validVouchers);
      } catch (err) {
        console.error("Lỗi khi lấy voucher:", err);
      } finally {
        setIsLoadingVouchers(false);
      }
    };

    fetchUserVouchers();
  }, [totalCartPrice]);

  // Fetch điểm thưởng của user
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const points = await getUserPoints();
        setUserPoints(points || 0);
      } catch (err) {
        console.error("Lỗi khi lấy điểm thưởng:", err);
        setUserPoints(0);
      }
    };

    fetchUserPoints();
  }, []);

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
        setError("Không thể tính phí vận chuyển. Vui lòng kiểm tra địa chỉ.");
      }
    };

    fetchShippingFee();
  }, [selectedCartItems, formData.addressId]);

  // Tính giảm giá từ voucher với validation
  const voucherDiscount = selectedVoucher && totalCartPrice >= (selectedVoucher.minOrderValue || 0) ? 
    (selectedVoucher.discountType === 'PERCENTAGE' 
      ? Math.min(totalCartPrice * (selectedVoucher.discountValue / 100), selectedVoucher.maxDiscount || totalCartPrice)
      : Math.min(selectedVoucher.discountValue, totalCartPrice)
    ) : 0;

  // Tính giảm giá từ điểm thưởng (ví dụ: 1 điểm = 1000 VND)
  const pointsDiscount = usedPoints * 1000;

  const totalAfterDiscounts = Math.max(0, totalCartPrice - voucherDiscount - pointsDiscount);
  const totalWithShipping = totalAfterDiscounts + shippingFee;

  const paymentMethods = [
    { id: "COD", name: "Thanh toán khi nhận hàng" },
    { id: "BANK_TRANSFER", name: "Chuyển khoản ngân hàng" },
    { id: "PAYPAL", name: "PayPal" },
    { id: "CREDIT_CARD", name: "Thẻ tín dụng" },
  ];

  // Handle chọn voucher
  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setVoucherId(voucher.id);
    setShowVoucherModal(false);
  };

  // Handle bỏ chọn voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setVoucherId(0);
  };

  // Các giá trị điểm thưởng có thể chọn
  const getPointOptions = () => {
    const maxUsablePoints = Math.floor(totalCartPrice / 1000); // Tối đa có thể dùng
    const availablePoints = Math.min(userPoints, maxUsablePoints);
    
    const options = [];
    for (let i = 0; i <= availablePoints; i += 10) {
      if (i <= availablePoints) {
        options.push(i);
      }
    }
    if (availablePoints % 10 !== 0 && !options.includes(availablePoints)) {
      options.push(availablePoints);
    }
    return options.sort((a, b) => a - b);
  };

  const handleVnpayPayment = async (orderId) => {
    try {
      const response = await createVnpayPayment(orderId);
      if (response.code === "00" && response.data) {
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
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createCodPayment(orderId);

      if (!response || !response.id) {
        throw new Error("Invalid response from server");
      }

      Swal.fire({
        title: "Đặt hàng thành công!",
        text: "Đơn hàng đã được xác nhận. Thanh toán khi nhận hàng.",
        icon: "success",
        confirmButtonText: "Xem đơn hàng",
      }).then(() => {
        navigate(`/payment-success/${orderId}`, {
          state: { orderId, paymentMethod: "COD" },
        });
      });
    } catch (err) {
      console.error("COD Payment error:", err);
      setError("Không thể tạo thanh toán COD. Vui lòng thử lại.");
    } finally {
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
      const payload = {
        addressId: formData.addressId,
        paymentMethod,
        cartItemIds: selectedCartItems.map((item) => item.cartItemId),
        voucherId,
        usedPoints,
      };

      console.log("Checkout payload:", payload);

      const result = await dispatch(
        checkoutSelectedItemsThunk(payload)
      ).unwrap();
      console.log("Checkout result:", result);

      const orderId = result.orderId || result.id;
      if (!orderId) {
        throw new Error("Không thể lấy mã đơn hàng");
      }

      if (paymentMethod === "COD") {
        await handleCodPayment(orderId);
      } else {
        await handleVnpayPayment(orderId);
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

          <div className="p-8">
            <div className="space-y-6">
              <div className="space-y-4">
                {selectedCartItems.length > 0 ? (
                  selectedCartItems.map((item) => {
                    const displayPrice =
                      item.totalPrice && item.totalPrice > 0
                        ? item.totalPrice
                        : (item.discountedPrice && item.discountedPrice > 0
                            ? item.discountedPrice
                            : item.originalPrice || 0) * (item.quantity || 1);

                    return (
                      <div
                        key={item.cartItemId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
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
                              Màu: {item.color || "N/A"} | Size:{" "}
                              {item.size || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Số lượng: {item.quantity}
                            </div>
                            <div className="text-sm">
                              {item.discountedPrice &&
                              item.discountedPrice > 0 &&
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
                            {displayPrice.toLocaleString("vi-VN")} ₫
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Giỏ hàng của bạn đang trống.</p>
                )}
              </div>

              {/* Phần Voucher và Điểm thưởng đã cải tiến */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Mã giảm giá & Điểm thưởng
                </h3>
                <div className="space-y-4">
                  {/* Voucher Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voucher khả dụng ({availableVouchers.length})
                    </label>
                    {selectedVoucher ? (
                      <div className="p-3 border border-green-300 bg-green-50 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-green-800">
                              {selectedVoucher.code}
                            </div>
                            <div className="text-sm text-green-600">
                              {selectedVoucher.description}
                            </div>
                            <div className="text-sm text-green-600">
                              Giảm: {voucherDiscount.toLocaleString("vi-VN")} ₫
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveVoucher}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Bỏ chọn
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowVoucherModal(true)}
                        className="w-full p-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 flex justify-between items-center"
                        disabled={availableVouchers.length === 0}
                      >
                        <span className="text-gray-500">
                          {availableVouchers.length > 0 
                            ? "Chọn voucher" 
                            : "Không có voucher khả dụng"}
                        </span>
                        <span className="text-gray-400">›</span>
                      </button>
                    )}
                  </div>

                  {/* Points Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm thưởng (Có: {userPoints.toLocaleString("vi-VN")} điểm)
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={usedPoints}
                        onChange={(e) => setUsedPoints(parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value={0}>Không sử dụng điểm</option>
                        {getPointOptions().map(points => (
                          <option key={points} value={points}>
                            {points.toLocaleString("vi-VN")} điểm (-{(points * 1000).toLocaleString("vi-VN")} ₫)
                          </option>
                        ))}
                      </select>
                    </div>
                    {usedPoints > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        Tiết kiệm: {pointsDiscount.toLocaleString("vi-VN")} ₫
                      </div>
                    )}
                  </div>
                </div>
              </div>

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

              <div className="border-t pt-6">
                <div className="flex justify-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{totalCartPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Giảm voucher:</span>
                    <span>-{voucherDiscount.toLocaleString("vi-VN")} ₫</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Giảm điểm thưởng:</span>
                    <span>-{pointsDiscount.toLocaleString("vi-VN")} ₫</span>
                  </div>
                )}
                <div className="flex justify-between mb-4">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
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

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chọn voucher</h3>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {isLoadingVouchers ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : availableVouchers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Không có voucher khả dụng
              </div>
            ) : (
              <div className="space-y-3">
                {availableVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-red-300 hover:bg-red-50"
                    onClick={() => handleSelectVoucher(voucher)}
                  >
                    <div className="font-medium text-gray-900">
                      {voucher.code}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {voucher.description}
                    </div>
                    <div className="text-sm text-red-600">
                      {voucher.discountType === 'PERCENTAGE' 
                        ? `Giảm ${voucher.discountValue}%${voucher.maxDiscount ? ` (tối đa ${voucher.maxDiscount.toLocaleString("vi-VN")} ₫)` : ''}`
                        : `Giảm ${voucher.discountValue.toLocaleString("vi-VN")} ₫`
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      Đơn tối thiểu: {voucher.minOrderValue?.toLocaleString("vi-VN")} ₫
                    </div>
                    <div className="text-xs text-gray-500">
                      HSD: {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;