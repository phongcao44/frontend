import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Package, Search, Filter } from 'lucide-react';
import { getMyOrders } from '../../../services/orderService';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousTab, setPreviousTab] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'all', label: 'Tất cả', path: '/user/orders' },
    { id: 'pending', label: 'Chờ xác nhận', path: '/user/orders/pending' },
    { id: 'confirmed', label: 'Đã xác nhận', path: '/user/orders/confirmed' },
    { id: 'shipped', label: 'Đang giao', path: '/user/orders/shipped' },
    { id: 'delivered', label: 'Đã giao', path: '/user/orders/delivered' },
    { id: 'cancelled', label: 'Đã hủy', path: '/user/orders/cancelled' },
    { id: 'returned', label: 'Đã hoàn trả', path: '/user/orders/returned' },
  ];

  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
  });

  const [loadingCounts, setLoadingCounts] = useState(true);

  const fetchCounts = async () => {
    try {
      setLoadingCounts(true);
      const mapping = [
        { id: 'all', status: undefined },
        { id: 'pending', status: 'PENDING' },
        { id: 'confirmed', status: 'CONFIRMED' },
        { id: 'shipped', status: 'SHIPPED' },
        { id: 'delivered', status: 'DELIVERED' },
        { id: 'cancelled', status: 'CANCELLED' },
        { id: 'returned', status: 'RETURNED' },
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
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleTabChange = (path) => {
    const currentActiveTab = getActiveTab();
    
    if (location.pathname !== path) {
      setPreviousTab(currentActiveTab);
      setIsTransitioning(true);
      
      setTimeout(() => {
        navigate(path);
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousTab('');
        }, 150);
      }, 100);
    }
  };

  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath === '/user/orders') return 'all';
    const pathParts = currentPath.split('/');
    return pathParts[pathParts.length - 1];
  };

  const activeTab = getActiveTab();

  const CounterSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-8"></div>
    </div>
  );

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
            {tabs.map((tab, index) => {
              const Icon = tab.icon || Package;
              const isActive = activeTab === tab.id;
              const wasPrevious = previousTab === tab.id;
              
              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.path)}
                  className={`
                    relative p-4 rounded-xl cursor-pointer transition-all duration-500 transform 
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105 hover:scale-110'
                      : wasPrevious && isTransitioning
                        ? 'bg-gray-100 text-gray-500 scale-95'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md hover:scale-105'
                    }
                    ${isTransitioning && !isActive && !wasPrevious ? 'hover:scale-100' : ''}
                  `}
                  style={{
                    transitionDelay: isActive ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`} />
                    <div className="text-lg font-bold transition-all duration-300">
                      {loadingCounts ? (
                        <CounterSkeleton />
                      ) : (
                        <span className={`${
                          isActive ? 'text-white' : 'text-gray-900'
                        } transition-all duration-300`}>
                          {counts[tab.id] ?? 0}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs mt-2 transition-colors duration-300 ${
                    isActive ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {tab.label}
                  </p>
                  
                  <div className={`
                    absolute -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full transition-all duration-500
                    ${isActive 
                      ? 'w-8 h-1 bg-white opacity-100' 
                      : 'w-0 h-1 bg-white opacity-0'
                    }
                  `}></div>
                  
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl">
                      <div className="absolute inset-0 rounded-xl bg-white opacity-20 animate-ping"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
            <div className="flex gap-3">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-all duration-200 focus:scale-[1.02]"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95">
                <Filter className="w-4 h-4 transition-transform group-hover:rotate-180" />
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md relative">
          <div className={`transition-all duration-300 ${
            isTransitioning ? 'opacity-70 scale-[0.99]' : 'opacity-100 scale-100'
          }`}>
            <Outlet context={{ searchTerm, dateFilter }} />
          </div>
          
          {/* Loading overlay chỉ áp dụng cho Outlet */}
          {isTransitioning && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 flex items-center justify-center backdrop-blur-sm z-10">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Đang tải...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}