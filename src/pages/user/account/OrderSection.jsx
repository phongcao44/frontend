import { useState, useEffect } from 'react';
import { getMyOrders } from '../../../services/orderService';
import OrderCard from './OrderCard';
import { useNavigate } from 'react-router-dom';

export default function OrderSection() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'PENDING', label: 'Chờ xác nhận' },
    { id: 'CONFIRMED', label: 'Đã xác nhận' },
    { id: 'SHIPPED', label: 'Đang giao' },
    { id: 'DELIVERED', label: 'Đã giao' },
    { id: 'CANCELLED', label: 'Đã hủy' },
    { id: 'RETURNED', label: 'Đã hoàn trả' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const status = activeTab === 'ALL' ? null : activeTab;
        const data = await getMyOrders(status);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const filteredOrders = orders.filter(order => {
    if (searchTerm && !order.orderId.toString().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'RETURNED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPED': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      case 'RETURNED': return 'Đã hoàn trả';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-full flex items-center space-x-2 cursor-pointer whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Đang tải dữ liệu...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-red-600">{error}</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Không tìm thấy đơn hàng nào</p>
              <p className="text-gray-500 text-sm mt-2">
                {activeTab === 'ALL' 
                  ? 'Bạn chưa có đơn hàng nào'
                  : `Bạn không có đơn hàng nào ở trạng thái ${getStatusText(activeTab)}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-2 lg:mb-0">
                      <h3 className="font-semibold text-gray-900">Đơn hàng #{order.orderId}</h3>
                      <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-900">
                        {order.totalAmount?.toLocaleString('vi-VN')}đ
                      </span>
                      <button
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Người đặt: {order.username}</p>
                    <p>Phương thức thanh toán: {order.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}