import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { fetchMyOrderDetail, clearCurrentOrder } from "../../../redux/slices/orderSlice";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrderDetail(Number(orderId)));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  // Dù có lỗi từ backend (ví dụ voucher discountPercent null), vẫn hiển thị trang thành công với dữ liệu an toàn
  const safeOrder = currentOrder || {};
  const orderTime = safeOrder.createdAt
    ? new Date(safeOrder.createdAt).toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Không xác định";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-check-line text-5xl text-green-600"></i>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8">
          Cảm ơn bạn đã mua sắm tại cửa hàng. Đơn hàng của bạn (Mã: <span className="font-semibold text-blue-600">{safeOrder.orderCode || `#${orderId}`}</span>) đã được xác nhận.
        </p>

        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem",
          }}
          bodyStyle={{ padding: "1.5rem" }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Thông Tin Đơn Hàng
          </h3>
          <div className="space-y-4 text-gray-600 text-base">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-file-list-3-line text-gray-400"></i>
                <span>Mã đơn hàng</span>
              </div>
              <span className="font-medium">{safeOrder.orderCode || `#${orderId}`}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-wallet-line text-gray-400"></i>
                <span>Phương thức thanh toán</span>
              </div>
              <span className="font-medium">{safeOrder.paymentMethod || "Không xác định"}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-calendar-line text-gray-400"></i>
                <span>Thời gian đặt hàng</span>
              </div>
              <span className="font-medium">{orderTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-money-dollar-circle-line text-gray-400"></i>
                <span>Tổng tiền</span>
              </div>
              <span className="font-medium">
                {Number(safeOrder.totalAmount ?? 0).toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        </Card>

        {error ? (
          <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 mb-8 inline-block">
            Hệ thống đang xử lý thông tin chi tiết đơn hàng. Bạn vẫn có thể xem đơn hàng trong mục "Đơn hàng của tôi".
          </p>
        ) : (
          <p className="text-sm text-gray-500 mb-8">
            Bạn vui lòng kiểm tra đơn hàng của mình trong mục "Đơn hàng của tôi" hoặc bấm vào "Xem Đơn Hàng".
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
             to={`/user/order/${orderId}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center whitespace-nowrap no-underline"
          >
            Xem Đơn Hàng
          </Link>
          <Link
            to="/"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center whitespace-nowrap no-underline"
          >
            Tiếp Tục Mua Sắm
          </Link>
          <Link
            to="https://www.facebook.com/ecommerce122"
            className="bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors text-center whitespace-nowrap no-underline"
          >
            Liên Hệ Hỗ Trợ
          </Link>
        </div>
      </div>
    </div>
  );
}