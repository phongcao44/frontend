import { Package, Calendar, DollarSign, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderCard({ order, getStatusColor, getStatusText }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>;
      case 'CONFIRMED':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'SHIPPED':
        return <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>;
      case 'DELIVERED':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'CANCELLED':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'RETURNED':
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản ngân hàng';
      case 'PAYPAL':
        return 'PayPal';
      case 'CREDIT_CARD':
        return 'Thẻ tín dụng';
      default:
        return 'Chưa xác định';
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">#{order.orderCode || order.orderId}</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                order.status
              )} flex items-center gap-1`}
            >
              {getStatusIcon(order.status)}
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{order.date || formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">
                {order.total?.toLocaleString('vi-VN') || order.totalAmount?.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span>{getPaymentMethodText(order.paymentMethod)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/user/order/${order.orderId || order.id}`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group"
          >
            <Eye className="w-4 h-4" />
            Xem chi tiết
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}