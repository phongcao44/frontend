import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetail } from "../../../services/orderService";
import { Package, Calendar, MapPin, CreditCard, Gift, ArrowLeft, Eye, X, Truck, CheckCircle, XCircle, AlertCircle, RotateCcw, Clock } from 'lucide-react';

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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Đang tải chi tiết đơn hàng...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    </div>
  );
  
  if (!order) return null;

  // Helper for status color
  const statusColor = {
    RETURNED: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200',
    CANCELLED: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200',
    DELIVERED: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200',
    SHIPPED: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200',
    CONFIRMED: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200',
    PENDING: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200',
    default: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200',
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      case 'RETURNED': return <RotateCcw className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.orderId || order.id}</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Ngày tạo: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : ''}
                  </p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border ${statusColor[order.status] || statusColor.default}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Thông tin khách hàng</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{order.customer?.username}</p>
                  <p className="text-gray-600 text-sm">{order.customer?.email}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Địa chỉ giao hàng</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{order.shippingAddress?.recipient_name}</p>
                  <p className="text-gray-600 text-sm">{order.shippingAddress?.phone}</p>
                  <p className="text-gray-600 text-sm">{order.shippingAddress?.fulladdress}</p>
                  <p className="text-gray-600 text-sm">
                    {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment & Voucher */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Phương thức thanh toán</h3>
                </div>
                <p className="text-gray-700 font-medium">{order.paymentMethod}</p>
              </div>
              
              {order.voucher && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Gift className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Voucher áp dụng</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-green-700">{order.voucher.code}</p>
                    <p className="text-sm text-gray-600">Giảm {order.voucher.discountAmount}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Table */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Danh sách sản phẩm</h3>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Màu</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Đơn giá</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Số lượng</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            {item.images && item.images[0]?.image_url ? (
                              <img
                                src={item.images[0].image_url}
                                alt={item.productName}
                                className="w-16 h-16 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105 shadow-sm"
                                onClick={() => setShowImage(item.images[0].image_url)}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-600">{item.color?.name || '-'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-600">{item.size?.name || '-'}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-semibold text-gray-900">{item.price?.toLocaleString('vi-VN')}₫</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-gray-600">{item.quantity}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-blue-600">{item.totalPrice?.toLocaleString('vi-VN')}₫</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex flex-col items-end gap-3">
                {order.subTotal && (
                  <div className="flex gap-6 items-center">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold text-gray-900">{order.subTotal?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                {order.discountAmount && (
                  <div className="flex gap-6 items-center">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-semibold text-green-600">- {order.discountAmount?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                {order.shippingFee && (
                  <div className="flex gap-6 items-center">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-semibold text-gray-900">{order.shippingFee?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                {order.totalAmount && (
                  <div className="flex gap-6 items-center text-lg pt-3 border-t border-blue-200">
                    <span className="text-gray-900 font-bold">Tổng cộng:</span>
                    <span className="font-bold text-blue-600 text-xl">{order.totalAmount?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>
        </div>

        {/* Image Modal */}
        {showImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={showImage}
                alt="Ảnh sản phẩm"
                className="max-w-full max-h-full rounded-xl shadow-2xl border-4 border-white"
                onClick={e => e.stopPropagation()}
              />
              <button
                className="absolute -top-4 -right-4 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors shadow-lg"
                onClick={() => setShowImage(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}