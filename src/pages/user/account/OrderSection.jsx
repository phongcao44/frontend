import { useState, useEffect } from 'react';
import { getMyOrders } from '../../../services/orderService';
import OrderCard from './OrderCard';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Calendar, Clock, DollarSign, ShoppingBag, Filter, ArrowRight, Eye, Truck, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react';

export default function OrderSection() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  const tabs = [
    { id: 'ALL', label: 'Tất cả', icon: Package },
    { id: 'PENDING', label: 'Chờ xác nhận', icon: Clock },
    { id: 'CONFIRMED', label: 'Đã xác nhận', icon: CheckCircle },
    { id: 'SHIPPED', label: 'Đang giao', icon: Truck },
    { id: 'DELIVERED', label: 'Đã giao', icon: CheckCircle },
    { id: 'CANCELLED', label: 'Đã hủy', icon: XCircle },
    { id: 'RETURNED', label: 'Đã hoàn trả', icon: RotateCcw },
  ];

  const [counts, setCounts] = useState({
    ALL: 0,
    PENDING: 0,
    CONFIRMED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    RETURNED: 0,
  });

  const fetchCounts = async () => {
    try {
      const mapping = [
        { id: 'ALL', status: undefined },
        { id: 'PENDING', status: 'PENDING' },
        { id: 'CONFIRMED', status: 'CONFIRMED' },
        { id: 'SHIPPED', status: 'SHIPPED' },
        { id: 'DELIVERED', status: 'DELIVERED' },
        { id: 'CANCELLED', status: 'CANCELLED' },
        { id: 'RETURNED', status: 'RETURNED' },
      ];
      const results = await Promise.all(
        mapping.map(m => getMyOrders({ status: m.status, page: 0, limit: 1 }))
      );
      const next = { ...counts };
      mapping.forEach((m, idx) => {
        next[m.id] = results[idx]?.totalItems ?? 0;
      });
      setCounts(next);
    } catch (e) {
      // keep counts as-is on error
    }
  };

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const status = activeTab === 'ALL' ? undefined : activeTab;
        const data = await getMyOrders({ status, page: currentPage, limit });
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(typeof error === 'string' ? error : 'Có lỗi xảy ra khi tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab, currentPage]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm && !order.orderId.toString().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200';
      case 'DELIVERED': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'RETURNED': return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đơn hàng của tôi
              </h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                    <span className={`text-lg font-bold ${activeTab === tab.id ? 'text-white' : 'text-gray-900'}`}>
                      {counts[tab.id] ?? 0}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>
                    {tab.label}
                  </p>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'ALL' 
                  ? 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!'
                  : `Bạn không có đơn hàng nào ở trạng thái ${getStatusText(activeTab)}`
                }
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-blue-600" />
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">#{order.orderId}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {order.totalAmount?.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center p-6">
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <span className="text-gray-600">←</span>
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={`px-3 py-2 rounded-lg ${currentPage === idx
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                onClick={() => handlePageChange(idx)}
                disabled={currentPage === idx}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <span className="text-gray-600">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}