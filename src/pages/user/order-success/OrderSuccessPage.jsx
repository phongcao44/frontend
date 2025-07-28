import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import DeliveryInfo from "./DeliveryInfo";
import NextSteps from "./NextSteps";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentOrder, fetchMyOrderDetail } from "../../../redux/slices/orderSlice";

export default function OrderSuccessPage() {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    dispatch(fetchMyOrderDetail(Number(orderId)));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <p className="text-lg text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-600"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cảm ơn bạn đã mua sắm tại cửa hàng. Đơn hàng của bạn đã được xác
            nhận và đang được xử lý.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Chi Tiết Đơn Hàng
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-500">Mã đơn hàng</p>
              <p className="text-lg font-bold text-blue-600">
                {currentOrder.orderId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thông Tin Khách Hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="ri-user-line text-gray-400"></i>
                  <span className="text-gray-600">
                    {currentOrder.customer.username}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-phone-line text-gray-400"></i>
                  <span className="text-gray-600">
                    {currentOrder.shippingAddress.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-mail-line text-gray-400"></i>
                  <span className="text-gray-600">
                    {currentOrder.customer.email}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-map-pin-line text-gray-400 mt-1"></i>
                  <span className="text-gray-600">
                    {currentOrder.shippingAddress.fulladdress}, {currentOrder.shippingAddress.ward}, {currentOrder.shippingAddress.district}, {currentOrder.shippingAddress.province}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thông Tin Giao Hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="ri-truck-line text-gray-400"></i>
                  <span className="text-gray-600">
                    Giao hàng tiêu chuẩn
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-calendar-line text-gray-400"></i>
                  <span className="text-gray-600">
                    Dự kiến: 25-28/07/2025
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-money-dollar-circle-line text-gray-400"></i>
                  <span className="text-gray-600">
                    Phí giao hàng: {currentOrder.shippingFee === null ? "Miễn phí" : `${currentOrder.shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-wallet-line text-gray-400"></i>
                  <span className="text-gray-600">
                    {currentOrder.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <OrderSummary orderData={currentOrder} />
        <DeliveryInfo deliveryInfo={{
          method: "Giao hàng tiêu chuẩn",
          estimatedDate: "25-28/07/2025",
          fee: currentOrder.shippingFee || 0
        }} />
        <NextSteps orderId={currentOrder.orderId} />

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
          >
            Xem Đơn Hàng
          </Link>
          <Link
            to="/"
            className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center whitespace-nowrap"
          >
            Tiếp Tục Mua Sắm
          </Link>
          <Link
            to="/support"
            className="bg-green-100 text-green-700 px-8 py-4 rounded-lg font-medium hover:bg-green-200 transition-colors text-center whitespace-nowrap"
          >
            Liên Hệ Hỗ Trợ
          </Link>
        </div>
      </div>
    </div>
  );
}