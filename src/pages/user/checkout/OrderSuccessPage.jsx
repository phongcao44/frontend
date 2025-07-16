import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  Home,
  FileText,
} from "lucide-react";

const OrderSuccessPage = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [orderData] = useState({
    orderId: 21,
    status: "PENDING",
    paymentStatus: "PENDING",
    paymentMethod: "COD",
    createdAt: "2025-07-15T14:36:35.776525",
    subTotal: null,
    discountAmount: null,
    shippingFee: 44000,
    totalAmount: 152000,
    customer: {
      id: 8,
      username: "Hoang Van E",
      email: "user5@shop.vn",
    },
    shippingAddress: {
      id: 5,
      fulladdress: "56 Phạm Văn Đồng, Ninh Kiều CT",
      province: "Hà Nội",
      district: "Quận Ba Đình",
      ward: "Phường Nguyễn Trung Trực",
      recipient_name: "Lê Thị Duy Tân",
      phone: "0945678901",
    },
    items: [
      {
        productId: 25,
        productName: "Snack khoai tây vị BBQ",
        variantId: 69,
        color: {
          id: 1,
          name: "Đen",
          hex_code: "#000000",
        },
        size: {
          id: 5,
          name: "Free Size",
          description: "Không phân chia theo kích cỡ",
        },
        quantity: 4,
        price: 27000,
        totalPrice: 108000,
        images: [
          {
            id: 121,
            image_url: "https://picsum.photos/seed/25-1/720/720",
            is_main: true,
            variant_id: null,
          },
          {
            id: 122,
            image_url: "https://picsum.photos/seed/25-2/720/720",
            is_main: false,
            variant_id: null,
          },
          {
            id: 123,
            image_url: "https://picsum.photos/seed/25-3/720/720",
            is_main: false,
            variant_id: null,
          },
          {
            id: 124,
            image_url: "https://picsum.photos/seed/25-4/720/720",
            is_main: false,
            variant_id: null,
          },
          {
            id: 125,
            image_url: "https://picsum.photos/seed/25-5/720/720",
            is_main: false,
            variant_id: null,
          },
        ],
      },
    ],
    voucher: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const orderSteps = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Đơn hàng đã được xác nhận",
      status: "completed",
      time: "Vừa xong",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Success Animation */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div
              className={`inline-block transition-all duration-1000 ${
                animationStep >= 1
                  ? "scale-100 opacity-100"
                  : "scale-50 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Cảm ơn bạn đã tin tưởng và mua hàng tại cửa hàng chúng tôi
            </p>
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
              Mã đơn hàng:{" "}
              <span className="font-bold">{orderData.orderId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin đơn hàng */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trạng thái đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="w-6 h-6 mr-2 text-blue-600" />
                Trạng thái đơn hàng
              </h2>

              <div className="space-y-4">
                {orderSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        step.status === "completed"
                          ? "bg-green-500 text-white shadow-lg"
                          : step.status === "current"
                          ? "bg-blue-500 text-white shadow-lg animate-pulse"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-medium ${
                            step.status === "completed" ||
                            step.status === "current"
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {step.time}
                        </span>
                      </div>
                      {step.status === "current" && (
                        <div className="mt-2 flex items-center text-sm text-blue-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-ping"></div>
                          Đang xử lý...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Chi tiết sản phẩm
              </h2>

              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      {item.images.find((img) => img.is_main)?.image_url ? (
                        <img
                          src={item.images.find((img) => img.is_main).image_url}
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Màu: {item.color.name} | Size: {item.size.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {item.totalPrice.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-green-600" />
                Thông tin giao hàng
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {orderData.shippingAddress.recipient_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-600">
                      {orderData.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-600">
                      {orderData.shippingAddress.fulladdress},{" "}
                      {orderData.shippingAddress.ward},{" "}
                      {orderData.shippingAddress.district},{" "}
                      {orderData.shippingAddress.province}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Tóm tắt đơn hàng */}
          <div className="space-y-6">
            {/* Tóm tắt thanh toán */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-purple-600" />
                Tóm tắt thanh toán
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>
                    {(
                      orderData.totalAmount - orderData.shippingFee
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>{orderData.shippingFee.toLocaleString("vi-VN")} ₫</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">
                      {orderData.totalAmount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">
                      Phương thức:{" "}
                      {orderData.paymentMethod === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : orderData.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue- Anchored by: https://x.com/iamthenight/status/1853893759483007032
700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <FileText className="w-5 h-5" />
                <span>Xem chi tiết đơn hàng</span>
              </button>

              <button className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer cảm ơn */}
      <div className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cảm ơn bạn đã mua hàng! 🎉
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ gửi thông báo cập
              nhật trạng thái đơn hàng qua email và SMS. Nếu có bất kỳ câu hỏi
              nào, vui lòng liên hệ với chúng tôi.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <span>📞 Hotline: 1900-1234</span>
              <span>📧 Email: support@example.com</span>
              <span>💬 Chat: 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
