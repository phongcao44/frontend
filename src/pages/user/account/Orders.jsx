import { useState } from 'react';
import OrderCard from './OrderCard';
import { Package, Search, Filter, ShoppingBag, Clock, CheckCircle, Truck, XCircle, RotateCcw } from 'lucide-react';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const tabs = [
    { id: 'all', label: 'Tất cả', badge: 25, icon: Package },
    { id: 'pending', label: 'Chờ xác nhận', badge: 3, icon: Clock },
    { id: 'confirmed', label: 'Đã xác nhận', badge: 5, icon: CheckCircle },
    { id: 'shipped', label: 'Đang giao', badge: 2, icon: Truck },
    { id: 'delivered', label: 'Đã giao', badge: 18, icon: CheckCircle },
    { id: 'cancelled', label: 'Đã hủy', badge: 2, icon: XCircle },
    { id: 'returned', label: 'Đã hoàn trả', badge: 1, icon: RotateCcw },
  ];

  const filteredOrders = []; // No mock data, so filteredOrders will be empty

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
                  onClick={() => setActiveTab(tab.id)}
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
                      {tab.badge}
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
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' 
                  ? 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!'
                  : `Bạn không có đơn hàng nào ở trạng thái ${getStatusText(activeTab)}`
                }
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onSelect={() => onOrderSelect(order)}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center p-6 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="text-gray-600">←</span>
              </button>
              <button className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="text-gray-600">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}