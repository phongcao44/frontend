import { Package, Calendar, DollarSign, Eye, ArrowRight } from 'lucide-react';

export default function OrderCard({ order, onSelect, getStatusColor, getStatusText }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>;
      case 'CONFIRMED': return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'SHIPPED': return <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>;
      case 'DELIVERED': return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'CANCELLED': return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'RETURNED': return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">#{order.id || order.orderId}</h3>
              <p className="text-sm text-gray-500">{order.date || formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Ngày đặt: {order.date || formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {order.total?.toLocaleString('vi-VN') || order.totalAmount?.toLocaleString('vi-VN')}₫
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4 text-gray-400" />
            <span>{order.paymentMethod || 'Chưa xác định'}</span>
          </div>
        </div>

        {/* Products Preview */}
        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={item.image || item.images?.[0]?.image_url}
                    alt={item.name || item.productName}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {item.name || item.productName}
                    </p>
                    <p className="text-xs text-gray-600">SL: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="flex items-center justify-center bg-blue-50 p-3 rounded-lg">
                  <span className="text-sm text-blue-600 font-medium">
                    +{order.items.length - 3} sản phẩm khác
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onSelect}
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
