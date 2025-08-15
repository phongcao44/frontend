import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { fetchMyOrderDetail, clearCurrentOrder } from "../../../redux/slices/orderSlice";

export default function OrderFailedPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderId && orderId !== "unknown") {
      dispatch(fetchMyOrderDetail(Number(orderId)));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <p className="text-base md:text-lg text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if ((error && !currentOrder) || orderId === "unknown") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-close-line text-5xl text-red-600"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Thanh Toán Thất Bại!
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Rất tiếc, quá trình thanh toán của bạn đã bị hủy hoặc gặp lỗi. Vui lòng thử lại sau.
          </p>

          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              marginBottom: "2rem",
              border: "1px solid #fecaca",
            }}
            bodyStyle={{ padding: "1.5rem", backgroundColor: "#fef2f2" }}
          >
            <h3 className="text-lg font-semibold text-red-700 mb-4">
              <i className="ri-error-warning-line mr-2"></i>
              Lý do có thể
            </h3>
            <div className="space-y-3 text-gray-600 text-base text-left">
              <div className="flex items-start space-x-3">
                <i className="ri-close-circle-line text-red-500 mt-1"></i>
                <span>Bạn đã hủy thanh toán trên cổng VNPay</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-close-circle-line text-red-500 mt-1"></i>
                <span>Thông tin thẻ không chính xác hoặc không đủ số dư</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-close-circle-line text-red-500 mt-1"></i>
                <span>Kết nối mạng không ổn định</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="ri-close-circle-line text-red-500 mt-1"></i>
                <span>Phiên thanh toán đã hết hạn</span>
              </div>
            </div>
          </Card>

          <p className="text-sm text-gray-500 mb-8">
            Đừng lo lắng! Bạn có thể thử thanh toán lại hoặc chọn phương thức thanh toán khác.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center whitespace-nowrap no-underline"
            >
              <i className="ri-home-line mr-2"></i>
              Về Trang Chủ
            </Link>
            <Link
              to="/contact"
              className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors text-center whitespace-nowrap no-underline"
            >
              <i className="ri-customer-service-line mr-2"></i>
              Liên Hệ Hỗ Trợ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Nếu có thông tin đơn hàng
  const orderTime = currentOrder?.createdAt
    ? new Date(currentOrder.createdAt).toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Không xác định";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-close-line text-5xl text-red-600"></i>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Thanh Toán Thất Bại!
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8">
          Rất tiếc, thanh toán cho đơn hàng <span className="font-semibold text-red-600">{currentOrder?.orderCode}</span> đã thất bại. 
          Đơn hàng vẫn được lưu và bạn có thể thanh toán lại.
        </p>

        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem",
            border: "1px solid #fecaca",
          }}
          bodyStyle={{ padding: "1.5rem" }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Thông Tin Đơn Hàng
          </h3>
          <div className="space-y-4 text-gray-600 text-base">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-file-list-3-line text-red-400"></i>
                <span>Mã đơn hàng</span>
              </div>
              <span className="font-medium">{currentOrder?.orderCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-wallet-line text-red-400"></i>
                <span>Phương thức thanh toán</span>
              </div>
              <span className="font-medium">{currentOrder?.paymentMethod || "VNPay"}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-calendar-line text-red-400"></i>
                <span>Thời gian đặt hàng</span>
              </div>
              <span className="font-medium">{orderTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-money-dollar-circle-line text-red-400"></i>
                <span>Tổng tiền</span>
              </div>
              <span className="font-medium text-red-600">
                {(currentOrder?.totalAmount || 0).toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ri-information-line text-red-400"></i>
                <span>Trạng thái thanh toán</span>
              </div>
              <span className="font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                Thất bại
              </span>
            </div>
          </div>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <i className="ri-lightbulb-line text-yellow-600 text-xl mt-1"></i>
            <div className="text-left">
              <h4 className="font-semibold text-yellow-800 mb-2">Gợi ý cho bạn:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Kiểm tra lại thông tin thẻ và số dư tài khoản</li>
                <li>• Thử thanh toán bằng phương thức khác (COD, chuyển khoản)</li>
                <li>• Liên hệ ngân hàng nếu thẻ bị khóa tạm thời</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/user/orders"
            className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors text-center whitespace-nowrap no-underline"
          >
            <i className="ri-file-list-line mr-2"></i>
            Xem Đơn Hàng
          </Link>
          <Link
            to="/"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center whitespace-nowrap no-underline"
          >
            <i className="ri-home-line mr-2"></i>
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
