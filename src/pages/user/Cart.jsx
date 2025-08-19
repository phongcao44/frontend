import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateCartItemQuantity,
  removeItemFromCart,
  checkoutSelectedItemsPreviewThunk,
  setSelectedItems,
} from "../../redux/slices/cartSlice";
import { getAddresses } from "../../redux/slices/addressSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading, itemLoading, error } = useSelector(
    (state) => state.cart
  );
  const { addresses } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);

  // Sử dụng Redux state thay vì local state
  const selectedItems = useSelector((state) => state.cart.selectedItems || []);

  // Helper functions cho localStorage
  const saveSelectedItemsToStorage = (items) => {
    try {
      if (Array.isArray(items) && items.length > 0) {
        localStorage.setItem("selectedItems", JSON.stringify(items));
      } else {
        localStorage.removeItem("selectedItems");
      }
    } catch (err) {
      console.error("Error saving selectedItems to localStorage:", err);
    }
  };

  const loadSelectedItemsFromStorage = () => {
    try {
      const savedSelectedItems = localStorage.getItem("selectedItems");
      if (savedSelectedItems) {
        const parsedItems = JSON.parse(savedSelectedItems);
        if (Array.isArray(parsedItems)) {
          return parsedItems;
        }
      }
    } catch (err) {
      console.error("Error parsing selectedItems from localStorage:", err);
    }
    return [];
  };

  console.log("Cart component mounted, user:", cart);

  // Load cart và addresses
  useEffect(() => {
    dispatch(getCart());
    dispatch(getAddresses());
  }, [dispatch, user]);

  // Initialize selectedItems from localStorage khi component mount
  useEffect(() => {
    // Chỉ load từ localStorage nếu selectedItems trong Redux chưa có giá trị
    if (!selectedItems.length) {
      const savedItems = loadSelectedItemsFromStorage();
      if (savedItems.length > 0) {
        dispatch(setSelectedItems(savedItems));
      }
    }
  }, [dispatch]);

  // Sync selectedItems với localStorage mỗi khi selectedItems thay đổi
  useEffect(() => {
    saveSelectedItemsToStorage(selectedItems);
  }, [selectedItems]);

  // Validate và clean up selectedItems khi cart items thay đổi
  useEffect(() => {
    if (loading || !cart?.items) return; // Không xử lý khi đang loading hoặc cart chưa sẵn sàng

    const validItems = selectedItems.filter((id) =>
      cart.items.some((item) => item.cartItemId === id)
    );

    // Chỉ dispatch nếu selectedItems có thay đổi
    if (validItems.length !== selectedItems.length ||
        validItems.some((id, index) => id !== selectedItems[index])) {
      dispatch(setSelectedItems(validItems));
    }
  }, [cart?.items, loading, selectedItems, dispatch]);


  const handleQuantityChange = async (cartItemId, delta) => {
    if (!selectedItems.includes(cartItemId) || itemLoading[cartItemId]) return;

    const item = cart.items.find((item) => item.cartItemId === cartItemId);
    const newQty = (item.quantity || 0) + delta;

    if (newQty < 1) {
      try {
        await dispatch(removeItemFromCart(cartItemId)).unwrap();
      } catch (err) {
        Swal.fire(
          "Lỗi",
          err.payload?.message || "Xóa sản phẩm thất bại, vui lòng thử lại.",
          "error"
        );
      }
      return;
    }

    if (newQty > item.stockQuantity) {
      Swal.fire("Thông báo", "Số lượng vượt quá tồn kho.", "warning");
      return;
    }

    try {
      await dispatch(
        updateCartItemQuantity({ cartItemId, quantity: newQty })
      ).unwrap();
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err.payload?.message || "Cập nhật số lượng thất bại, vui lòng thử lại.",
        "error"
      );
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (itemLoading[cartItemId]) return;

    try {
      await dispatch(removeItemFromCart(cartItemId)).unwrap();
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err.payload?.message || "Xóa sản phẩm thất bại, vui lòng thử lại.",
        "error"
      );
    }
  };

  const handleSelectItem = (cartItemId) => {
    // Ensure the cartItemId exists in cart.items
    if (!cart?.items?.some((item) => item.cartItemId === cartItemId)) {
      console.warn(`Invalid cartItemId ${cartItemId} selected`);
      return;
    }

    const newSelectedItems = selectedItems.includes(cartItemId)
      ? selectedItems.filter((id) => id !== cartItemId)
      : [...selectedItems, cartItemId];
    
    dispatch(setSelectedItems(newSelectedItems));
  };

  const handleSelectAll = () => {
    if (!cart?.items?.length) {
      return;
    }

    const allItemIds = cart.items.map((item) => item.cartItemId);
    const isAllSelected = selectedItems.length === allItemIds.length;

    console.log("handleSelectAll triggered", {
      selectedItemsLength: selectedItems.length,
      cartItemsLength: cart?.items?.length,
      cartItems: allItemIds,
    });

    if (isAllSelected) {
      dispatch(setSelectedItems([]));
    } else {
      dispatch(setSelectedItems(allItemIds));
    }
  };

  const handleProceedToCheckout = async () => {
    if (selectedItems.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất một sản phẩm để thanh toán.", "warning");
      return;
    }

    if (!addresses?.length) {
      Swal.fire("Thông báo", "Vui lòng thêm địa chỉ trước khi thanh toán.", "warning");
      navigate("/account/addresses");
      return;
    }

    try {
      const payload = {
        addressId: addresses[0].addressId,
        paymentMethod: "COD",
        cartItemIds: selectedItems,
        voucherId: 0,
        usedPoints: 0,
        note: "",
      };
      const result = await dispatch(checkoutSelectedItemsPreviewThunk(payload)).unwrap();
      navigate("/checkout", { state: { preview: result } });
    } catch (err) {
      console.error("Checkout preview failed:", err);
      Swal.fire("Lỗi", err.message || "Không thể tải thông tin xem trước đơn hàng.", "error");
    }
  };

  const placeholderImage = "/placeholder.png";

  const renderVariantInfo = (item) => {
    const variants = [];

    if (item.color) {
      variants.push(`Màu: ${item.color}`);
    }

    if (item.size && item.size !== "Free Size") {
      variants.push(`Size: ${item.size}`);
    } else if (item.size === "Free Size") {
      variants.push("Free Size");
    }

    return variants.join(" | ") || "";
  };

  const isAllSelected = cart?.items?.length > 0 && selectedItems.length === cart?.items?.length;

  // Tính tổng theo các sản phẩm đã chọn
  const selectedItemsSet = new Set(selectedItems);
  const selectedCartItems = Array.isArray(cart?.items)
    ? cart.items.filter((i) => selectedItemsSet.has(i.cartItemId))
    : [];

  const selectedSubtotal = selectedCartItems.reduce((sum, i) => {
    const perItemTotal =
      i.totalPrice != null
        ? i.totalPrice
        : (i.discountedPrice || i.originalPrice || 0) * (i.quantity || 0);
    return sum + perItemTotal;
  }, 0);

  const selectedDiscount = selectedCartItems.reduce((sum, i) => {
    return sum + ((i.discountAmount || 0) * (i.quantity || 1));
  }, 0);

  const selectedGrandTotal = selectedSubtotal - selectedDiscount;
 const { isLoggedIn } = useSelector((state) => state.auth); // Use isLoggedIn to match authSlice.js  
    // Handle unauthenticated state
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20 px-5">
            <h4 className="text-xl font-medium mb-4">
              Bạn chưa đăng nhập. Vui lòng đăng nhập để xem danh sách yêu thích.
            </h4>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded transition-colors duration-200"
              onClick={() => navigate("/login")}
              aria-label="Đăng nhập"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="mb-12 text-sm text-gray-500">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-black">Cart</span>
        </nav>

        {loading && <div className="text-center py-4">Đang tải...</div>}
        {error && (
          <div className="text-center py-4 text-red-500">
            Lỗi: {error.message || "Đã xảy ra lỗi, vui lòng thử lại."}
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 mb-4">
          <div className="grid grid-cols-6 gap-8 px-8 py-6 items-center">
            <div className="font-medium flex items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="h-5 w-5 text-red-500 mr-2"
                disabled={loading || !cart?.items?.length}
              />
              {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </div>
            <div className="font-medium">Sản phẩm</div>
            <div className="font-medium">Giá</div>
            <div className="font-medium">Số lượng</div>
            <div className="font-medium">Tổng phụ</div>
            <div className="font-medium">Hành động</div>
          </div>
        </div>

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
                    disabled={loading || itemLoading[item.cartItemId]}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || placeholderImage}
                    alt={item.productName || "Hình ảnh sản phẩm"}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-black font-medium">
                      {item.productName || "Sản phẩm không xác định"}
                    </span>
                    {renderVariantInfo(item) && (
                      <span className="text-sm text-gray-500 mt-1">
                        {renderVariantInfo(item)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-black">
                  <div className="flex flex-col">
                    <span className="text-red-500 font-medium">
                      {(item.discountedPrice || item.originalPrice || 0).toLocaleString("vi-VN")} ₫
                    </span>
                    {item.discountedPrice !== item.originalPrice && (
                      <span className="text-gray-500 line-through text-sm">
                        {(item.originalPrice || 0).toLocaleString("vi-VN")} ₫
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, -1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={
                      itemLoading[item.cartItemId] ||
                      !selectedItems.includes(item.cartItemId) ||
                      item.quantity <= 1
                    }
                  >
                    -
                  </button>
                  <span className="px-4 min-w-[50px] text-center">{item.quantity || 0}</span>
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, 1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={
                      itemLoading[item.cartItemId] ||
                      !selectedItems.includes(item.cartItemId) ||
                      item.quantity >= item.stockQuantity
                    }
                  >
                    +
                  </button>
                </div>
                <div className="text-black font-medium">
                  {(item.totalPrice || 0).toLocaleString("vi-VN")} ₫
                </div>
                <div>
                  <button
                    onClick={() => handleRemoveItem(item.cartItemId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    disabled={loading || itemLoading[item.cartItemId]}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}

        {cart?.items?.length > 0 && (
          <div className="flex justify-between my-8">
            <button
              className="px-8 py-3 border border-gray-300 text-black bg-white hover:bg-gray-50 transition-colors"
              onClick={() => navigate("/home")}
            >
              Quay lại cửa hàng
            </button>
          </div>
        )}

        {cart?.items?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
            <div className="flex space-x-4 items-start">
              <input
                type="text"
                placeholder="Mã giảm giá"
                className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              />
              <button
                className="px-8 py-3 bg-red-500 text-white hover:bg-red-600 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Áp dụng mã
              </button>
            </div>

            <div
              className="bg-white border border-gray-300 p-8 ml-auto rounded"
              style={{ width: "400px" }}
            >
              <h3 className="text-xl font-medium mb-6">Tổng giỏ hàng</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{(selectedSubtotal || 0).toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span>Giảm giá:</span>
                  <span className="font-medium">{(selectedDiscount || 0).toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between py-3 text-lg font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-red-500">{(selectedGrandTotal || 0).toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
              <button
                className="w-full mt-8 px-6 py-3 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
                onClick={handleProceedToCheckout}
                disabled={loading || selectedItems.length === 0}
              >
                Tiến hành thanh toán ({selectedItems.length} sản phẩm)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;