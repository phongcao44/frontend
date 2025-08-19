/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Gift, Tag, Calendar, Percent, DollarSign, Coins } from "lucide-react";
import Swal from "sweetalert2";
import AddressSection from "./AddressSection";
import {
  getCart,
  checkoutSelectedItemsThunk,
  checkoutSelectedItemsPreviewThunk,
  setSelectedItems,
} from "../../../redux/slices/cartSlice";
import {
  createCodPayment,
  createVnpayPayment,
} from "../../../services/paymentService";
import { setUser, fetchUserInfo } from "../../../redux/slices/authSlice";
import {
  fetchUnusedVouchers,
  fetchCollectibleVouchers,
  userCollectVoucher,
} from "../../../redux/slices/voucherSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const { unusedVouchers, collectibleVouchers, collectLoading, collectError } =
    useSelector((state) => state.voucher);
  const {
    cart,
    preview,
    selectedItems,
    loading,
    error: cartError,
  } = useSelector((state) => state.cart);

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
  const [usePoints, setUsePoints] = useState(false);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Refs to prevent repeated preview dispatches / navigations
  const lastPreviewKeyRef = useRef("");
  const previewDebounceRef = useRef(null);
  const warnedNoSelectionRef = useRef(false);

  // Get initial preview from navigation state (from Buy Now)
  const initialPreview = location.state?.preview;

  // Fetch user info, cart, and vouchers on mount
  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(getCart());
    dispatch(fetchUnusedVouchers());
    dispatch(fetchCollectibleVouchers());
  }, [dispatch]);

  // Restore selectedItems from localStorage on mount (only for Cart flow)
  useEffect(() => {
    if (!initialPreview?.variantId) {
      const savedSelectedItems = localStorage.getItem("selectedItems");
      if (savedSelectedItems) {
        const parsedItems = JSON.parse(savedSelectedItems);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          dispatch(setSelectedItems(parsedItems));
        }
      }
    }
  }, [dispatch, initialPreview?.variantId]);

  // Sync selectedItems with localStorage when changed (only for Cart flow)
  useEffect(() => {
    if (!initialPreview?.variantId && selectedItems.length > 0) {
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    } else if (!initialPreview?.variantId) {
      localStorage.removeItem("selectedItems");
    }
  }, [selectedItems, initialPreview?.variantId]);

  // Update formData when user changes
  useEffect(() => {
    setUsedPoints(0);
    setUsePoints(false);
    if (user?.address?.[0]?.addressId && !formData.addressId) {
      setFormData((prev) => ({
        ...prev,
        addressId: user.address[0].addressId,
        useSavedAddress: true,
      }));
    }
  }, [user, formData.addressId]);

  // Create stable list of cart item IDs
  const cartItemIdsInCart = useMemo(
    () => cart?.items?.map((i) => i.cartItemId) || [],
    [cart?.items]
  );

  // Generate preview based on Buy Now or Cart flow
  useEffect(() => {
    if (previewDebounceRef.current) {
      clearTimeout(previewDebounceRef.current);
      previewDebounceRef.current = null;
    }

    if (!formData.addressId) {
      setError("Vui lòng chọn hoặc lưu địa chỉ trước khi thanh toán.");
      return;
    }

    let payload;
    // Buy Now flow: use variantId and quantity, exclude cartItemIds
    if (initialPreview?.variantId && initialPreview.quantity) {
      if (initialPreview.quantity <= 0) {
        setError("Số lượng không hợp lệ cho biến thể này.");
        return;
      }
      payload = {
        addressId: formData.addressId,
        paymentMethod,
        variantId: initialPreview.variantId,
        quantity: initialPreview.quantity,
        voucherId: selectedVoucher?.id || 0,
        usedPoints: usePoints ? usedPoints : 0,
        note: note || "",
      };
    }
    // Cart flow: use cartItemIds, exclude variantId and quantity
    else if (cartItemIdsInCart.length > 0 && selectedItems.length > 0) {
      const validSelectedItems = selectedItems.filter((id) =>
        cartItemIdsInCart.includes(id)
      );

      if (validSelectedItems.length === 0) {
        setError("Không có sản phẩm hợp lệ để thanh toán.");
        if (!warnedNoSelectionRef.current) {
          warnedNoSelectionRef.current = true;
          navigate("/cart", {
            state: { error: "Vui lòng chọn sản phẩm để thanh toán." },
          });
        }
        return;
      }

      payload = {
        addressId: formData.addressId,
        paymentMethod,
        cartItemIds: [...validSelectedItems].sort((a, b) => a - b),
        voucherId: selectedVoucher?.id || 0,
        usedPoints: usePoints ? usedPoints : 0,
        note: note || "",
      };
    } else {
      // Cart flow: redirect to cart if no valid items
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      if (!warnedNoSelectionRef.current) {
        warnedNoSelectionRef.current = true;
        navigate("/cart", {
          state: { error: "Vui lòng chọn sản phẩm để thanh toán." },
        });
      }
      return;
    }

    const previewKey = JSON.stringify(payload);
    if (previewKey === lastPreviewKeyRef.current) {
      return;
    }

    previewDebounceRef.current = setTimeout(() => {
      lastPreviewKeyRef.current = previewKey;
      dispatch(checkoutSelectedItemsPreviewThunk(payload));
    }, 300);

    return () => {
      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
        previewDebounceRef.current = null;
      }
    };
  }, [
    formData.addressId,
    selectedVoucher?.id,
    usedPoints,
    usePoints,
    note,
    paymentMethod,
    selectedItems,
    cartItemIdsInCart,
    initialPreview?.variantId,
    initialPreview?.quantity,
    dispatch,
    navigate,
  ]);

  // Set initial preview from navigation state
  useEffect(() => {
    if (initialPreview && !preview) {
      dispatch({
        type: "cart/checkoutSelectedItemsPreview/fulfilled",
        payload: initialPreview,
      });
    }
  }, [initialPreview, preview, dispatch]);

  // Filter valid vouchers
  useEffect(() => {
    if (unusedVouchers.length > 0 && preview?.subtotal > 0) {
      const validVouchers = unusedVouchers.filter(
        (voucher) =>
          voucher.active &&
          new Date(voucher.endDate) > new Date() &&
          new Date(voucher.startDate) <= new Date() &&
          preview.subtotal >= (voucher.minOrderAmount || 0)
      );
      setFilteredVouchers(
        validVouchers.filter(
          (v, i, self) => i === self.findIndex((x) => x.id === v.id)
        )
      );
    } else {
      setFilteredVouchers([]);
    }
  }, [unusedVouchers, preview]);

  // Handle voucher collection
  const handleCollectVoucher = async (voucher) => {
    try {
      await dispatch(
        userCollectVoucher({ voucherCode: voucher.code })
      ).unwrap();
      Swal.fire({
        title: "Thành công!",
        text: `Đã thu thập voucher ${voucher.code}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      dispatch(fetchUnusedVouchers());
      dispatch(fetchCollectibleVouchers());
    } catch (error) {
      Swal.fire({
        title: "Lỗi",
        text: collectError || "Không thể thu thập voucher",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  };

  // Handle voucher selection
  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowVoucherModal(false);
    Swal.fire({
      title: "Voucher đã chọn",
      text: `Đã áp dụng ${voucher.code}`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  // Handle voucher removal
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    Swal.fire({
      title: "Đã xóa",
      text: "Voucher đã được bỏ chọn",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  // Handle checkout submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.useSavedAddress || !formData.addressId) {
      setError("Vui lòng chọn hoặc lưu địa chỉ trước khi thanh toán.");
      return;
    }

    let payload;
    // Buy Now flow: use variantId and quantity, exclude cartItemIds
    if (initialPreview?.variantId && initialPreview.quantity) {
      if (initialPreview.quantity <= 0) {
        setError("Số lượng không hợp lệ cho biến thể này.");
        return;
      }
      payload = {
        addressId: formData.addressId,
        paymentMethod,
        variantId: initialPreview.variantId,
        quantity: initialPreview.quantity,
        voucherId: selectedVoucher?.id || 0,
        usedPoints: usePoints ? usedPoints : 0,
        note: note || "",
      };
    }
    // Cart flow: use cartItemIds, exclude variantId and quantity
    else if (selectedItems.length > 0) {
      const validSelectedItems = selectedItems.filter((id) =>
        cartItemIdsInCart.includes(id)
      );

      if (validSelectedItems.length === 0) {
        setError("Không có sản phẩm hợp lệ để thanh toán.");
        return;
      }

      payload = {
        addressId: formData.addressId,
        paymentMethod,
        cartItemIds: [...validSelectedItems].sort((a, b) => a - b),
        voucherId: selectedVoucher?.id || 0,
        usedPoints: usePoints ? usedPoints : 0,
        note: note || "",
      };
    } else {
      // Cart flow: no valid items selected
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await dispatch(
        checkoutSelectedItemsThunk(payload)
      ).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 300));

      const userInfoAction = await dispatch(fetchUserInfo());
      if (fetchUserInfo.fulfilled.match(userInfoAction)) {
        const updatedUser = userInfoAction.payload;
        dispatch(setUser(updatedUser));
        setUsedPoints(0);
        setUsePoints(false);
      }

      // Only clear selectedItems for Cart flow
      if (payload.cartItemIds) {
        localStorage.removeItem("selectedItems");
        dispatch(setSelectedItems([]));
      }

      const orderId = result.orderId || result.id;
      if (!orderId) throw new Error("Không thể lấy mã đơn hàng");

      if (paymentMethod === "COD") {
        await handleCodPayment(orderId);
      } else if (paymentMethod === "BANK_TRANSFER") {
        await handleVnpayPayment(orderId);
      } else {
        Swal.fire({
          title: "Thông báo",
          text: "Phương thức thanh toán chưa hỗ trợ.",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
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

      navigate(`/payment-success/${orderId}`, {
        state: { orderId, paymentMethod: "COD" },
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

  // Calculate totals from preview
  const totalCartPrice = preview?.subtotal || 0;
  const voucherDiscount = preview?.discountAmount || 0;
  const pointsDiscount = preview?.usedPoints || 0;
  const totalWithShipping = preview?.totalAmount || 0;
  const shippingFee = preview?.shippingFee || 0;

  // Calculate available points
  const availablePoints = Math.min(
    user?.userPoint || 0,
    Math.floor(totalCartPrice)
  );

  // Handle points toggle
  const handleTogglePoints = () => {
    if (!usePoints) {
      setUsedPoints(availablePoints);
    } else {
      setUsedPoints(0);
    }
    setUsePoints(!usePoints);
  };

  const paymentMethods = [
    { id: "COD", name: "Thanh toán khi nhận hàng (COD)" },
    { id: "BANK_TRANSFER", name: "Thanh toán qua VNPAY" },
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
                            Màu: {item.color || "N/A"} | Size:{" "}
                            {item.size || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-700">
                              {item.priceAtTime.toLocaleString("vi-VN")} ₫
                            </span>
                            {item.originalPrice &&
                              item.originalPrice !== item.priceAtTime && (
                                <span className="text-gray-500 line-through text-sm ml-2">
                                  {item.originalPrice.toLocaleString("vi-VN")} ₫
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 font-medium">
                          {(item.priceAtTime * item.quantity).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          ₫
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>
                    Không có sản phẩm để hiển thị.{" "}
                    <a href="/cart" className="text-blue-600 hover:underline">
                      Quay lại giỏ hàng
                    </a>
                    .
                  </p>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Mã giảm giá & Điểm thưởng
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú cho đơn hàng
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voucher khả dụng ({filteredVouchers.length})
                    </label>
                    {selectedVoucher ? (
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Tag className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-blue-700">
                                {selectedVoucher.code}
                              </h3>
                              <div className="text-sm text-gray-600">
                                {selectedVoucher.discountPercent > 0
                                  ? `Giảm ${
                                      selectedVoucher.discountPercent
                                    }% (tối đa ${selectedVoucher.maxDiscount.toLocaleString(
                                      "vi-VN"
                                    )} ₫)`
                                  : `Giảm ${selectedVoucher.discountAmount?.toLocaleString(
                                      "vi-VN"
                                    )} ₫`}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Đơn tối thiểu:{" "}
                                {selectedVoucher.minOrderAmount.toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                ₫
                              </div>
                              <div className="text-xs text-gray-500">
                                HSD:{" "}
                                {new Date(
                                  selectedVoucher.startDate
                                ).toLocaleDateString("vi-VN")}{" "}
                                -{" "}
                                {new Date(
                                  selectedVoucher.endDate
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveVoucher}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Bỏ chọn
                          </button>
                        </div>
                        {voucherDiscount > 0 && (
                          <div className="text-sm text-green-600 mt-2">
                            Tiết kiệm: {voucherDiscount.toLocaleString("vi-VN")}{" "}
                            ₫
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowVoucherModal(true)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg text-left hover:from-blue-100 hover:to-purple-100 transition-all duration-200 flex justify-between items-center"
                        disabled={filteredVouchers.length === 0}
                      >
                        <span className="text-gray-600">
                          {filteredVouchers.length > 0
                            ? "Chọn hoặc thu thập voucher"
                            : "Không có voucher khả dụng"}
                        </span>
                        <Gift className="w-5 h-5 text-blue-600" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm thưởng (Có:{" "}
                      {(user?.userPoint || 0).toLocaleString("vi-VN")} điểm)
                    </label>
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-6 h-6 text-orange-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Sử dụng {availablePoints.toLocaleString("vi-VN")}{" "}
                              điểm để giảm{" "}
                              {availablePoints.toLocaleString("vi-VN")} ₫
                            </div>
                            <div className="text-xs text-gray-500">
                              1 điểm = 1 ₫, tối đa{" "}
                              {availablePoints.toLocaleString("vi-VN")} điểm
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={usePoints}
                            onChange={handleTogglePoints}
                            className="sr-only peer"
                            disabled={availablePoints === 0}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                      {usePoints && pointsDiscount > 0 && (
                        <div className="text-sm text-green-600 mt-2">
                          Tiết kiệm: {pointsDiscount.toLocaleString("vi-VN")} ₫
                        </div>
                      )}
                    </div>
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300"
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

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Chọn hoặc Thu thập Voucher
                  </h2>
                  <p className="text-sm text-gray-500">
                    Chọn voucher để áp dụng hoặc thu thập voucher mới
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collectLoading ? (
                <div className="col-span-full text-center py-12 text-gray-600">
                  Đang tải...
                </div>
              ) : filteredVouchers.length === 0 &&
                collectibleVouchers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không có voucher khả dụng
                  </h3>
                  <p className="text-gray-500">
                    Hãy quay lại sau để xem voucher mới!
                  </p>
                </div>
              ) : (
                <>
                  {filteredVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-blue-700">
                              {voucher.code}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Áp dụng cho đơn hàng này
                            </p>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          Có thể sử dụng
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            HSD:{" "}
                            {new Date(voucher.startDate).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -{" "}
                            {new Date(voucher.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center gap-2">
                            {voucher.discountPercent > 0 ? (
                              <>
                                <Percent className="w-4 h-4 text-blue-600" />
                                <span className="font-bold text-lg text-blue-600">
                                  Giảm {voucher.discountPercent}% (tối đa{" "}
                                  {voucher.maxDiscount.toLocaleString("vi-VN")}{" "}
                                  ₫)
                                </span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-4 h-4 text-blue-600" />
                                <span className="font-bold text-lg text-blue-600">
                                  Giảm{" "}
                                  {voucher.discountAmount?.toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  ₫
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectVoucher(voucher)}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-105"
                      >
                        Chọn voucher
                      </button>
                    </div>
                  ))}
                  {collectibleVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-blue-700">
                              {voucher.code}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Thu thập để sử dụng sau
                            </p>
                          </div>
                        </div>
                        <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                          Có thể thu thập
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            HSD:{" "}
                            {new Date(voucher.startDate).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -{" "}
                            {new Date(voucher.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center gap-2">
                            {voucher.discountPercent > 0 ? (
                              <>
                                <Percent className="w-4 h-4 text-blue-600" />
                                <span className="font-bold text-lg text-blue-600">
                                  Giảm {voucher.discountPercent}% (tối đa{" "}
                                  {voucher.maxDiscount.toLocaleString("vi-VN")}{" "}
                                  ₫)
                                </span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-4 h-4 text-blue-600" />
                                <span className="font-bold text-lg text-blue-600">
                                  Giảm{" "}
                                  {voucher.discountAmount?.toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  ₫
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCollectVoucher(voucher)}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-105"
                        disabled={collectLoading}
                      >
                        <Gift className="w-4 h-4" />
                        Thu thập ngay
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;