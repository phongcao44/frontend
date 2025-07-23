import { useState } from 'react';
import OrderCard from './OrderCard';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const tabs = [
    { id: 'all', label: 'Tất cả', badge: 25 },
    { id: 'pending', label: 'Chờ xác nhận', badge: 3 },
    { id: 'shipping', label: 'Đang giao', badge: 2 },
    { id: 'delivered', label: 'Đã giao', badge: 18 },
    { id: 'cancelled', label: 'Đã hủy', badge: 2 },
  ];

  const orders = [
    {
      id: '#DH001',
      date: '2024-01-15',
      status: 'delivered',
      total: 1250000,
      items: [
        { 
          image: 'https://readdy.ai/api/search-image?query=modern%20smartphone%20with%20sleek%20design%2C%20white%20background%2C%20product%20photography%20style%2C%20clean%20minimal%20aesthetic%2C%20high%20quality%20details&width=80&height=80&seq=phone1&orientation=squarish',
          name: 'iPhone 15 Pro Max',
          quantity: 1,
          price: 850000
        },
        { 
          image: 'https://readdy.ai/api/search-image?query=wireless%20bluetooth%20headphones%2C%20black%20color%2C%20modern%20design%2C%20white%20background%2C%20product%20photography%20style%2C%20premium%20quality&width=80&height=80&seq=headphone1&orientation=squarish',
          name: 'AirPods Pro',
          quantity: 1,
          price: 400000
        }
      ]
    },
    {
      id: '#DH002',
      date: '2024-01-12',
      status: 'shipping',
      total: 750000,
      items: [
        { 
          image: 'https://readdy.ai/api/search-image?query=modern%20laptop%20computer%20with%20silver%20finish%2C%20white%20background%2C%20product%20photography%20style%2C%20clean%20professional%20look%2C%20high%20quality%20details&width=80&height=80&seq=laptop1&orientation=squarish',
          name: 'MacBook Air M2',
          quantity: 1,
          price: 750000
        }
      ]
    },
    {
      id: '#DH003',
      date: '2024-01-10',
      status: 'pending',
      total: 320000,
      items: [
        { 
          image: 'https://readdy.ai/api/search-image?query=wireless%20computer%20mouse%2C%20white%20color%2C%20ergonomic%20design%2C%20white%20background%2C%20product%20photography%20style%2C%20modern%20minimalist%20aesthetic&width=80&height=80&seq=mouse1&orientation=squarish',
          name: 'Magic Mouse',
          quantity: 1,
          price: 180000
        },
        { 
          image: 'https://readdy.ai/api/search-image?query=wireless%20keyboard%2C%20white%20color%2C%20compact%20design%2C%20white%20background%2C%20product%20photography%20style%2C%20clean%20modern%20look%2C%20premium%20quality&width=80&height=80&seq=keyboard1&orientation=squarish',
          name: 'Magic Keyboard',
          quantity: 1,
          price: 140000
        }
      ]
    }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
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
                <span className={`
                  px-2 py-1 rounded-full text-xs
                  ${activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-300'}
                `}>
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Filter */}
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
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <i className="ri-calendar-line absolute left-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <i className="ri-arrow-left-line"></i>
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}