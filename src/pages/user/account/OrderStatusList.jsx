import { useState, useEffect } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import OrderCard from './OrderCard';
import { ShoppingBag } from 'lucide-react';
import { getMyOrders } from '../../../services/orderService';

export default function OrderStatusList() {
  const { searchTerm, dateFilter } = useOutletContext();
  const { status } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    const orderStatus = status?.toUpperCase();
    getMyOrders({ status: orderStatus, page: currentPage, limit })
      .then((data) => {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
      })
      .catch((err) => {
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(typeof err === 'string' ? err : 'Có lỗi xảy ra khi tải đơn hàng');
      })
      .finally(() => setLoading(false));
  }, [status, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'returned': return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      case 'returned': return 'Đã hoàn trả';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-lg text-gray-500">Đang tải đơn hàng...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">{error}</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
        <p className="text-gray-500 mb-6">
          Bạn không có đơn hàng nào ở trạng thái {getStatusText(status)}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          Mua sắm ngay
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <OrderCard
            key={order.orderId || order.id}
            order={order}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center p-6 border-t border-gray-100">
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
    </>
  );
}
