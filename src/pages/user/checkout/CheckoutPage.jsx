/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import AddressSection from "./AddressSection";
import { getCart, checkoutSelectedItemsThunk, checkoutSelectedItemsPreviewThunk, setSelectedItems } from "../../../redux/slices/cartSlice";
import { createCodPayment, createVnpayPayment } from "../../../services/paymentService";
import api from "../../../services/api";
import { setUser, fetchUserInfo } from "../../../redux/slices/authSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const { userVouchers } = useSelector((state) => state.voucher);
  const { cart, preview, selectedItems, loading, error: cartError } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    addressId: user?.address?.[0]?.addressId || "",
    recipientName: "",
    phone: "",
    fullAddress: "",
    provinceName: "",
    districtName: "",
    wardName: "",
    useSavedAddress: !!user?.address?.[0],
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [error, setError] = useState(null);
  const [usedPoints, setUsedPoints] = useState(0);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  // Refs to prevent repeated preview dispatches / navigations
  const lastPreviewKeyRef = useRef("");
  const previewDebounceRef = useRef(null);
  const warnedNoSelectionRef = useRef(false);

  // Lấy preview từ navigation state nếu có
  const initialPreview = location.state?.preview;

  // Lấy thông tin người dùng và giỏ hàng khi mount
  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(getCart());
  }, [dispatch]);

  // Khôi phục selectedItems từ localStorage khi mount
  useEffect(() => {
    const savedSelectedItems = localStorage.getItem("selectedItems");
    if (savedSelectedItems) {
      const parsedItems = JSON.parse(savedSelectedItems);
      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        dispatch(setSelectedItems(parsedItems));
      }
    }
  }, [dispatch]);

  // Đồng bộ selectedItems với localStorage khi thay đổi
  useEffect(() => {
    if (selectedItems.length > 0) {
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    } else {
      localStorage.removeItem("selectedItems");
    }
  }, [selectedItems]);

  // Cập nhật formData khi user thay đổi
  useEffect(() => {
    const points = user?.address?.[0]?.user?.userPoint?.totalPoints || 0;
    setUserPoints(points);
    if (user?.address?.[0]?.addressId && !formData.addressId) {
      setFormData((prev) => ({
        ...prev,
        addressId: user.address[0].addressId,
        useSavedAddress: true,
      }));
    }
  }, [user, formData.addressId, setFormData]);

  // Tạo danh sách id item trong cart để làm dependency ổn định
  const cartItemIdsInCart = useMemo(
    () => (cart?.items?.map((i) => i.cartItemId) || []),
    [cart?.items]
  );

  // Gọi preview khi địa chỉ, voucher, điểm thưởng, ghi chú, phương thức thanh toán hoặc selectedItems thay đổi
  useEffect(() => {
    // Dọn dẹp debounce trước đó nếu dependencies đổi
    if (previewDebounceRef.current) {
      clearTimeout(previewDebounceRef.current);
      previewDebounceRef.current = null;
    }

    if (cartItemIdsInCart.length > 0 && formData.addressId && selectedItems.length > 0) {
      const validSelectedItems = selectedItems.filter((id) =>
        cartItemIdsInCart.includes(id)
      );

      if (validSelectedItems.length === 0) {
        setError("Không có sản phẩm hợp lệ để thanh toán.");
        if (!warnedNoSelectionRef.current) {
          warnedNoSelectionRef.current = true;
          navigate("/cart", { state: { error: "Vui lòng chọn sản phẩm để thanh toán." } });
        }
        return;
      }

      const sortedIds = [...validSelectedItems].sort((a, b) => a - b);
      const payload = {
        addressId: formData.addressId,
        paymentMethod,
        cartItemIds: sortedIds,
        voucherId: selectedVoucher?.id || 0,
        usedPoints: usedPoints || 0,
        note: note || "",
      };

      const previewKey = JSON.stringify(payload);
      if (previewKey === lastPreviewKeyRef.current) {
        return; // Không gọi lại nếu payload không đổi
      }

      // Debounce để tránh gọi API liên tục (đặc biệt khi đang gõ note)
      previewDebounceRef.current = setTimeout(() => {
        lastPreviewKeyRef.current = previewKey;
        dispatch(checkoutSelectedItemsPreviewThunk(payload));
      }, 300);
    } else if (cartItemIdsInCart.length > 0 && selectedItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      if (!warnedNoSelectionRef.current) {
        warnedNoSelectionRef.current = true;
        navigate("/cart", { state: { error: "Vui lòng chọn sản phẩm để thanh toán." } });
      }
    }

    return () => {
      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
        previewDebounceRef.current = null;
      }
    };
  }, [formData.addressId, selectedVoucher?.id, usedPoints, note, paymentMethod, selectedItems, cartItemIdsInCart, dispatch, navigate]);

  // Đặt preview ban đầu từ navigation state
  useEffect(() => {
    if (initialPreview && !preview) {
      dispatch({
        type: "cart/checkoutSelectedItemsPreview/fulfilled",
        payload: initialPreview,
      });
    }
  }, [initialPreview, preview, dispatch]);

  // Lấy danh sách voucher chưa sử dụng
  useEffect(() => {
    const fetchUnusedVouchers = async () => {
      setIsLoadingVouchers(true);
      try {
        const token = Cookies.get("access_token");
        const res = await api.get("user/voucher/viewVoucherFalse", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Lọc các voucher hợp lệ
  useEffect(() => {
    if (availableVouchers.length > 0 && preview?.subtotalBeforeDiscount > 0) {
      const validVouchers = availableVouchers.filter(
        (voucher) =>
          voucher.active &&
          new Date(voucher.endDate) > new Date() &&
          preview.subtotalBeforeDiscount >= (voucher.minOrderAmount || 0)
      );
      setFilteredVouchers(
        validVouchers.filter(
          (v, i, self) => i === self.findIndex((x) => x.id === v.id)
        )
      );
    } else {
      setFilteredVouchers([]);
    }
  }, [availableVouchers, preview]);

  // Tính tổng từ preview
  const totalCartPrice = preview?.subtotalBeforeDiscount || 0;
  const voucherDiscount = preview?.discountAmount || 0;
  const pointsDiscount = preview?.usedPoints || 0;
  const totalWithShipping = preview?.totalAmount || 0;
  const shippingFee = preview?.shippingFee || 0;

  // Tùy chọn điểm thưởng cho dropdown
  const getPointOptions = () => {
    const maxUsablePoints = Math.floor(totalCartPrice);
    const availablePoints = Math.min(userPoints, maxUsablePoints);
    const step = 1000;
    const options = [];

    for (let i = 0; i <= availablePoints; i += step) {
      options.push(i);
    }

    if (!options.includes(availablePoints)) {
      options.push(availablePoints);
    }

    return options;
  };

  // Xử lý chọn voucher
  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowVoucherModal(false);
    Swal.fire("Voucher đã chọn", "Sẽ áp dụng khi thanh toán", "info");
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
  };

  // Xử lý submit thanh toán
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.useSavedAddress || !formData.addressId) {
      setError("Vui lòng chọn hoặc lưu địa chỉ trước khi thanh toán.");
      return;
    }

    if (selectedItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
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
          { params: { code: selectedVoucher.code } }
        );
        Swal.fire("Voucher đã áp dụng", "Voucher của bạn đã được áp dụng", "success");
      }

      // Chuẩn bị payload thanh toán
      const payload = {
        addressId: formData.addressId,
        paymentMethod,
        cartItemIds: selectedItems,
        voucherId: selectedVoucher?.id || 0,
        usedPoints,
        note: note || "",
      };

      const result = await dispatch(checkoutSelectedItemsThunk(payload)).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Làm mới thông tin người dùng
      const userInfoAction = await dispatch(fetchUserInfo());
      if (fetchUserInfo.fulfilled.match(userInfoAction)) {
        const updatedUser = userInfoAction.payload;
        dispatch(setUser(updatedUser));
        Cookies.set("user", JSON.stringify(updatedUser), {
          sameSite: "Strict",
          secure: true,
          path: "/",
        });
        const totalPoints = updatedUser?.address?.[0]?.user?.userPoint?.totalPoints || 0;
        setUserPoints(totalPoints);
      }

      // Xóa selectedItems khỏi localStorage sau khi thanh toán thành công
      localStorage.removeItem("selectedItems");
      dispatch(setSelectedItems([]));

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
      console.error("Lỗi thanh toán:", err);
      setError(err.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
      setIsSubmitting(false);
    }
  };

  const handleCodPayment = async (orderId) => {
    try {
      const response = await createCodPayment(orderId);
      if (!response) {
        throw new Error("Phản hồi từ server không hợp lệ");
      }

      Swal.fire({
        title: "Đặt hàng thành công!",
        text: typeof response === "string" ? response : "Đơn hàng đã được xác nhận. Thanh toán khi nhận hàng.",
        icon: "success",
        confirmButtonText: "Xem đơn hàng",
      }).then(() => {
        navigate(`/payment-success/${orderId}`, {
          state: { orderId, paymentMethod: "COD" },
        });
      });
    } catch (err) {
      console.error("Lỗi thanh toán COD:", err);
      setError("Không thể tạo thanh toán COD. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
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
      console.error("Lỗi thanh toán VNPAY:", err);
      setError("Không thể tạo link thanh toán VNPAY. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: "COD", name: "Thanh toán khi nhận hàng (COD)" },
    { id: "BANK_TRANSFER", name: "Thanh toán qua VNPAY" },
    { id: "MOMO", name: "Thanh toán qua Momo" },
  ];

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto bg-white py-4">
      {(error || cartError) && (
        <div className="max-w-6xl mx-auto px-4 mb-4 text-red-600">
          {error || cartError?.message}
        </div>
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
            <h2 className="text-2xl font-semibold mb-6">Thông tin thanh toán</h2>
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
                {preview?.items?.length > 0 ? (
                  preview.items.map((item) => (
                    <div
                      key={item.variantId}
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
                            Màu: {item.color || "N/A"} | Size: {item.size || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-700">
                              {item.priceAtTime.toLocaleString("vi-VN")} ₫
                            </span>
                            {item.originalPrice && item.originalPrice !== item.priceAtTime && (
                              <span className="text-gray-500 line-through text-sm ml-2">
                                {item.originalPrice.toLocaleString("vi-VN")} ₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 font-medium">
                          {(item.priceAtTime * item.quantity).toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>
                    Giỏ hàng của bạn đang trống.{" "}
                    <a href="/cart" className="text-blue-600 hover:underline">
                      Quay lại giỏ hàng
                    </a>.
                  </p>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Mã giảm giá & Điểm thưởng</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú cho đơn hàng
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voucher khả dụng ({filteredVouchers.length})
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
                        disabled={filteredVouchers.length === 0}
                      >
                        <span className="text-gray-500">
                          {filteredVouchers.length > 0 ? "Chọn voucher" : "Không có voucher khả dụng"}
                        </span>
                        <span className="text-gray-400">›</span>
                      </button>
                    )}
                  </div>

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
                        {getPointOptions().map((points) => (
                          <option key={points} value={points}>
                            {points.toLocaleString("vi-VN")} điểm (-{(points).toLocaleString("vi-VN")} ₫)
                          </option>
                        ))}
                      </select>
                    </div>
                    {pointsDiscount > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        Tiết kiệm: {pointsDiscount.toLocaleString("vi-VN")} ₫
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
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
                  !preview?.items?.length ||
                  !formData.useSavedAddress ||
                  !formData.addressId ||
                  isSubmitting ||
                  loading
                }
              >
                {isSubmitting || loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Voucher */}
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
            ) : filteredVouchers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Không có voucher khả dụng
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-red-300 hover:bg-red-50"
                    onClick={() => handleSelectVoucher(voucher)}
                  >
                    <div className="font-medium text-gray-900">{voucher.code}</div>
                    <div className="text-sm text-red-600">
                      {voucher.discountPercent && voucher.discountPercent > 0
                        ? `Giảm ${voucher.discountPercent}% ${
                            voucher.maxDiscount
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