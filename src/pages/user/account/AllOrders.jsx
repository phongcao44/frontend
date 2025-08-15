import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import OrderCard from './OrderCard';
import { ShoppingBag } from 'lucide-react';
import { getMyOrders } from '../../../services/orderService';

// Skeleton component cho OrderCard
const OrderCardSkeleton = () => (
  <div className="p-6 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Order Info Skeleton */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Action Button Skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-12 bg-gray-200 rounded-xl w-36"></div>
      </div>
    </div>
  </div>
);

export default function AllOrders() {
  const { searchTerm, dateFilter } = useOutletContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageChanging, setPageChanging] = useState(false); // Thêm state cho page changing
  const [error, setError] = useState(null);
  const limit = 5;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMyOrders({ status: undefined, page: currentPage, limit })
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
      .finally(() => {
        setLoading(false);
        setPageChanging(false); // Reset page changing state
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      setPageChanging(true); // Set page changing state
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': 
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': 
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200';
      case 'SHIPPED': 
        return 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200';
      case 'DELIVERED': 
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'CANCELLED': 
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'RETURNED': 
        return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200';
      default: 
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
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

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);

    return (
      <div className="flex justify-center p-6 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || pageChanging}
          >
            ←
          </button>

          {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
            <button
              type="button"
              key={page}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50 text-gray-700"
              } ${pageChanging ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePageChange(page)}
              disabled={currentPage === page || pageChanging}
            >
              {page + 1}
            </button>
          ))}

          <button
            type="button"
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || pageChanging}
          >
            →
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">{error}</div>
    );
  }

  if (!loading && orders.length === 0 && !pageChanging) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
        <p className="text-gray-500 mb-6">
          Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
        </p>
        <button
          type="button"
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
      {/* List area */}
      <div className="divide-y divide-gray-100 relative min-h-[200px]">
        {/* Hiển thị skeleton khi đang loading lần đầu */}
        {loading && !pageChanging && (
          <>
            {Array.from({ length: limit }, (_, index) => (
              <OrderCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        {/* Hiển thị data với hiệu ứng mờ khi đang chuyển trang */}
        {(!loading || pageChanging) && (
          <div className={`transition-opacity duration-300 ${pageChanging ? 'opacity-30' : 'opacity-100'}`}>
            {orders.map((order) => (
              <OrderCard
                key={order.orderId || order.id}
                order={order}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))}
          </div>
        )}

        {/* Overlay skeleton khi đang chuyển trang */}
        {pageChanging && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm">
            {Array.from({ length: Math.min(orders.length, limit) }, (_, index) => (
              <OrderCardSkeleton key={`changing-skeleton-${index}`} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && renderPagination()}
    </>
  );
}