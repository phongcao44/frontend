/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import AddressSection from "./AddressSection";
import { calculateShippingFee } from "../../../services/shippingFeeService";
import { checkoutSelectedItemsThunk } from "../../../redux/slices/cartSlice";
import { createCodPayment, createVnpayPayment } from "../../../services/paymentService";
import api from "../../../services/api"; // Axios instance
import { setUser, fetchUserInfo } from "../../../redux/slices/authSlice";
import { fetchUserVouchers } from "../../../redux/slices/voucherSlice";



const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCartItems = [] } = location.state || {};

  const { user } = useSelector((state) => state.auth);
  const { userVouchers } = useSelector((state) => state.voucher);
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
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [error, setError] = useState(null);
  const [usedPoints, setUsedPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  useEffect(() => {
  const points = user?.address?.[0]?.user?.userPoint?.totalPoints || 0;
  setUserPoints(points);
}, [user]);

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  /** ------------------------
   *  Tổng tiền giỏ hàng
   ------------------------ */
  const totalCartPrice = selectedCartItems.reduce((sum, item) => {
    const itemPrice =
      item.totalPrice && item.totalPrice > 0
        ? item.totalPrice
        : (item.discountedPrice && item.discountedPrice > 0
          ? item.discountedPrice
          : item.originalPrice || 0) * (item.quantity || 1);

    return sum + itemPrice;
  }, 0);

  /** ------------------------
   *  Fetch Voucher & Điểm thưởng
   ------------------------ */
  //voucher chx dùng
  useEffect(() => {
    const fetchUnusedVouchers = async () => {
      setIsLoadingVouchers(true);
      try {
        const token = Cookies.get("access_token");
        const res = await api.get("user/voucher/viewVoucherFalse", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Giả sử res.data là mảng voucher chưa dùng
        // Gán vào userVouchers hoặc availableVouchers
        setAvailableVouchers(res.data || []);
      } catch (error) {
        console.error("Lấy voucher chưa dùng thất bại:", error);
        setAvailableVouchers([]);
      } finally {
        setIsLoadingVouchers(false);
      }
    };

    if (user) {
      fetchUnusedVouchers();
    }
  }, [user]);

  useEffect(() => {
    if (availableVouchers && availableVouchers.length > 0 && totalCartPrice > 0) {
      const validVouchers = availableVouchers.filter((voucher) =>
        voucher.active &&
        new Date(voucher.endDate) > new Date() &&
        totalCartPrice >= (voucher.minOrderAmount || 0)
      );

      const uniqueVouchers = validVouchers.filter(
        (v, i, self) => i === self.findIndex((x) => x.id === v.id)
      );

      setFilteredVouchers(uniqueVouchers);
    } else {
      setFilteredVouchers([]);
    }
  }, [availableVouchers, totalCartPrice]);



  /** ------------------------
   *  Fetch phí ship
   ------------------------ */
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

  /** ------------------------
   *  Xử lý chọn voucher & điểm
   ------------------------ */
  const pointsDiscount = usedPoints;
  const totalAfterDiscounts = Math.max(0, totalCartPrice - voucherDiscount - pointsDiscount);
  const totalWithShipping = totalAfterDiscounts + shippingFee;

  const getPointOptions = () => {
    const maxUsablePoints = Math.floor(totalCartPrice);
    const availablePoints = Math.min(userPoints, maxUsablePoints);

    const step = 1000; // Tăng theo bước 100 điểm
    const options = [];

    for (let i = 0; i <= availablePoints; i += step) {
      options.push(i);
    }

    // Đảm bảo thêm tùy chọn chính xác nếu chưa có
    if (!options.includes(availablePoints)) {
      options.push(availablePoints);
    }

    return options;
  };


  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);

    let discount = 0;

    if (voucher.discountPercent && voucher.discountPercent > 0) {
      const percent = parseFloat(voucher.discountPercent);
      const maxDiscount = parseFloat(voucher.maxDiscount || totalCartPrice);
      discount = Math.min((totalCartPrice * percent) / 100, maxDiscount);
    } else if (voucher.discountAmount && voucher.discountAmount > 0) {
      discount = Math.min(parseFloat(voucher.discountAmount), totalCartPrice);
    }

    setVoucherDiscount(discount);
    setShowVoucherModal(false);

    Swal.fire("Voucher đã chọn", "Sẽ áp dụng khi thanh toán", "info");
  };




  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setVoucherDiscount(0);
  };

  /** ------------------------
   *  Submit checkout
   ------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.useSavedAddress || !formData.addressId) {
      setError("Vui lòng chọn hoặc lưu địa chỉ trước khi thanh toán.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Áp dụng voucher nếu có
      if (selectedVoucher?.code) {
        await api.post(
          `/user/voucher/apply`,
          null,
          {
            params: { code: selectedVoucher.code },
          }
        );
        Swal.fire("Voucher đã áp dụng", "Voucher của bạn đã được áp dụng", "success");
      }

      // Đặt hàng
      const payload = {
        addressId: formData.addressId,
        paymentMethod,
        cartItemIds: selectedCartItems.map((item) => item.cartItemId),
        voucherId: selectedVoucher?.id || 0,
        usedPoints,
      };

      const result = await dispatch(checkoutSelectedItemsThunk(payload)).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Lấy thông tin user mới (bao gồm điểm hiện có mới)
      const userInfoAction = await dispatch(fetchUserInfo());
      console.log("User sau khi fetch lại:", userInfoAction.payload);
      if (fetchUserInfo.fulfilled.match(userInfoAction)) {
        const updatedUser = userInfoAction.payload;
        dispatch(setUser(updatedUser));
        Cookies.set("user", JSON.stringify(updatedUser), {
          sameSite: "Strict",
          secure: true,
          path: "/",
        }); // cập nhật cookie user nếu cần
        const totalPoints = updatedUser?.address?.[0]?.user?.userPoint?.totalPoints || 0;
        setUserPoints(totalPoints);

      }

      setIsSubmitting(false);

      const orderId = result.orderId || result.id;
      if (!orderId) throw new Error("Không thể lấy mã đơn hàng");

      if (paymentMethod === "COD") {
        await handleCodPayment(orderId);
      } else if (paymentMethod === "BANK_TRANSFER") {
        await handleVnpayPayment(orderId);
      } else {
        Swal.fire("Thông báo", "Phương thức thanh toán chưa hỗ trợ.", "info");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
      setIsSubmitting(false);
    }
  };



  const handleCodPayment = async (orderId) => {
    try {
      const response = await createCodPayment(orderId);
      console.log("createCodPayment response:", response);

      if (!response) {
        throw new Error("Invalid response from server");
      }

      Swal.fire({
        title: "Đặt hàng thành công!",
        text: typeof response === "string"
          ? response
          : "Đơn hàng đã được xác nhận. Thanh toán khi nhận hàng.",
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
    setError("Không thể tạo link thanh toán VNPAY. Vui lòng thử lại.");
    setIsSubmitting(false);
  }
};



  // Thêm mảng phương thức thanh toán
  const paymentMethods = [
    { id: "COD", name: "Thanh toán khi nhận hàng (COD)" },
    { id: "BANK_TRANSFER", name: "Thanh toán qua VNPAY" },
    { id: "MOMO", name: "Thanh toán qua Momo" },
  ];

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
                            {points.toLocaleString("vi-VN")} điểm (-{(points).toLocaleString("vi-VN")} ₫)
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
                    <div className="text-sm text-red-600">
                      {voucher.discountPercent && voucher.discountPercent > 0
                        ? `Giảm ${voucher.discountPercent}% ${voucher.maxDiscount
                          ? `(tối đa ${voucher.maxDiscount.toLocaleString("vi-VN")} ₫)`
                          : ""
                        }`
                        : `Giảm ${voucher.discountAmount?.toLocaleString("vi-VN")} ₫`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Đơn tối thiểu: {voucher.minOrderAmount?.toLocaleString("vi-VN")} ₫
                    </div>
                    <div className="text-xs text-gray-500">
                      HSD: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
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
