/* eslint-disable react/prop-types */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrderDetail, cancelUserOrder } from "../../../redux/slices/orderSlice";
import { toast } from "react-toastify";
import { Package, MapPin, CreditCard, Gift, ArrowLeft, X, Truck, CheckCircle, XCircle, AlertCircle, RotateCcw, Clock } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export default function OrderDetail({ order: orderProp }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading, error } = useSelector((state) => state.order);
  const [showImage, setShowImage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Map frontend display reasons to backend CancelReason enum
  const cancelReasons = [
    { display: 'Thay đổi ý định', value: 'CHANGE_OF_MIND' },
    { display: 'Tìm được giá tốt hơn', value: 'FOUND_BETTER_PRICE' },
    { display: 'Đặt nhầm sản phẩm', value: 'ORDERED_BY_MISTAKE' },
    { display: 'Thời gian giao hàng quá lâu', value: 'SHIPPING_TOO_SLOW' },
    { display: 'Sản phẩm không như kỳ vọng', value: 'ITEM_NOT_AS_EXPECTED' },
    { display: 'Vấn đề dịch vụ khách hàng', value: 'CUSTOMER_SERVICE_ISSUE' },
    { display: 'Khác', value: 'OTHER' },
  ];

  useEffect(() => {
    if (orderProp) return;
    if (id) {
      dispatch(fetchMyOrderDetail(id));
    }
  }, [orderProp, id, dispatch]);

  const canCancelOrder = () => {
    return order && (order.status === 'PENDING' || order.status === 'CONFIRMED');
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error('Vui lòng chọn lý do hủy đơn hàng', { autoClose: 3000 });
      return;
    }

    if (cancelReason === 'OTHER' && !customReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy cụ thể', { autoClose: 3000 });
      return;
    }

    try {
      setCancelling(true);
      const payload = {
        orderId: order.orderId,
        cancellationReason: cancelReason,
        ...(cancelReason === 'OTHER' && { customCancellationReason: customReason }),
      };
      await dispatch(cancelUserOrder(payload)).unwrap();
      setShowCancelModal(false);
      setCancelReason('');
      setCustomReason('');
      toast.success('Hủy đơn hàng thành công!', { autoClose: 3000 });
    } catch (err) {
      toast.error('Có lỗi xảy ra khi hủy đơn hàng: ' + (err || 'Vui lòng thử lại'), { autoClose: 3000 });
    } finally {
      setCancelling(false);
    }
  };

  // Hàm để lấy giá trị display từ cancellationReason
  const getCancelReasonDisplay = (reasonValue) => {
    if (reasonValue === 'OTHER' && order.customCancellationReason) {
      return order.customCancellationReason;
    }
    const reason = cancelReasons.find(r => r.value === reasonValue);
    return reason ? reason.display : reasonValue;
  };

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
                  <h1 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.orderCode || order.orderId}</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Ngày tạo: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : ''}
                  </p>
                  {order.cancellationReason && order.status === "CANCELLED" && (
                    <p className="text-red-600 text-sm mt-1">
                      Lý do hủy: {getCancelReasonDisplay(order.cancellationReason)}
                    </p>
                  )}
                  {order.cancelledAt && order.status === "CANCELLED" && (
                    <p className="text-gray-500 text-sm mt-1">
                      Thời gian hủy: {new Date(order.cancelledAt).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border ${statusColor[order.status] || statusColor.default}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
                {canCancelOrder() && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium text-sm shadow-sm hover:shadow-md"
                  >
                    <XCircle className="w-4 h-4" />
                    Hủy đơn hàng
                  </button>
                )}
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

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Hủy đơn hàng</h3>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Bạn có chắc chắn muốn hủy đơn hàng <strong>#{order.orderCode || order.orderId}</strong>?
                  </p>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    Lưu ý: Sau khi hủy đơn hàng, bạn sẽ không thể khôi phục lại được.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Lý do hủy đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {cancelReasons.map((reason, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="cancelReason"
                          value={reason.value}
                          checked={cancelReason === reason.value}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-700">{reason.display}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {cancelReason === 'OTHER' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhập lý do cụ thể <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling || !cancelReason || (cancelReason === 'OTHER' && !customReason.trim())}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {cancelling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang hủy...
                      </>
                    ) : (
                      'Xác nhận hủy'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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