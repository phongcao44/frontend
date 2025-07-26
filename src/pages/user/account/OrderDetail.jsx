import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetail } from "../../../services/orderService";

export default function OrderDetail({ order: orderProp }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(orderProp || null);
  const [loading, setLoading] = useState(!orderProp);
  const [error, setError] = useState(null);
  const [showImage, setShowImage] = useState(null);

  useEffect(() => {
    if (orderProp) return;
    async function fetchOrder() {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderDetail(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || "Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [orderProp, id]);

  if (loading) return <div className="p-8 text-center">Đang tải chi tiết đơn hàng...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!order) return null;

  // Helper for status color
  const statusColor = {
    RETURNED: 'bg-orange-100 text-orange-700',
    CANCELLED: 'bg-red-100 text-red-700',
    DELIVERED: 'bg-green-100 text-green-700',
    SHIPPED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    default: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-blue-700">Đơn hàng #{order.orderId || order.id}</h1>
            <div className="text-gray-500 text-sm">Ngày tạo: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : ''}</div>
          </div>
          <div className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${statusColor[order.status] || statusColor.default}`}>{order.status}</div>
        </div>

        {/* Customer & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="font-semibold text-gray-700 mb-1">Khách hàng</div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-medium">{order.customer?.username}</div>
              <div className="text-gray-500 text-sm">{order.customer?.email}</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-1">Địa chỉ giao hàng</div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div>{order.shippingAddress?.fulladdress}</div>
              <div className="text-gray-500 text-sm">{order.shippingAddress?.recipient_name} | {order.shippingAddress?.phone}</div>
              <div className="text-gray-500 text-sm">{order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}</div>
            </div>
          </div>
        </div>

        {/* Payment & Voucher */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="font-semibold text-gray-700 mb-1">Phương thức thanh toán</div>
            <div className="bg-gray-50 rounded-lg p-4">{order.paymentMethod}</div>
          </div>
          {order.voucher && (
            <div className="flex-1">
              <div className="font-semibold text-gray-700 mb-1">Voucher</div>
              <div className="bg-green-50 rounded-lg p-4">
                <span className="font-medium text-green-700">{order.voucher.code}</span> (Giảm {order.voucher.discountAmount}%)
              </div>
            </div>
          )}
        </div>

        {/* Product Table */}
        <div className="mb-8">
          <div className="font-semibold text-gray-700 mb-2">Sản phẩm</div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Ảnh</th>
                  <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                  <th className="px-4 py-2 text-left">Màu</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-right">Đơn giá</th>
                  <th className="px-4 py-2 text-right">Số lượng</th>
                  <th className="px-4 py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">
                      {item.images && item.images[0]?.image_url ? (
                        <img
                          src={item.images[0].image_url}
                          alt={item.productName}
                          className="w-14 h-14 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                          onClick={() => setShowImage(item.images[0].image_url)}
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium">{item.productName}</td>
                    <td className="px-4 py-2">{item.color?.name}</td>
                    <td className="px-4 py-2">{item.size?.name}</td>
                    <td className="px-4 py-2 text-right">{item.price?.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right font-semibold">{item.totalPrice?.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="flex flex-col items-end gap-2">
          {order.subTotal && (
            <div className="flex gap-4">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-semibold">{order.subTotal?.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          {order.discountAmount && (
            <div className="flex gap-4">
              <span className="text-gray-600">Giảm giá:</span>
              <span className="font-semibold text-green-700">- {order.discountAmount?.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          {order.shippingFee && (
            <div className="flex gap-4">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-semibold">{order.shippingFee?.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          {order.totalAmount && (
            <div className="flex gap-4 text-lg">
              <span className="text-gray-900 font-bold">Tổng cộng:</span>
              <span className="font-bold text-blue-700">{order.totalAmount?.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
        </div>
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2"
        >
          <span className="text-lg">←</span> Quay lại
        </button>
      </div>
        {/* Modal hiển thị ảnh lớn */}
        {showImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={() => setShowImage(null)}
          >
            <img
              src={showImage}
              alt="Ảnh sản phẩm"
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg border-4 border-white"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={() => setShowImage(null)}
            >
              ×
            </button>
          </div>
        )}
    </div>
  );
}