import React, { useState } from 'react';
import { User, Package, MapPin, Settings, Heart, LogOut, Edit, Eye, Truck, CheckCircle, Clock } from 'lucide-react';

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0987654321',
    birthDate: '1990-05-15',
    gender: 'male'
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nhà riêng',
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      isDefault: true
    },
    {
      id: 2,
      name: 'Văn phòng',
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      address: '456 Đường Lê Lợi, Quận 3, TP.HCM',
      isDefault: false
    }
  ]);

  const [orders] = useState([
    {
      id: 'DH001',
      date: '2024-07-15',
      status: 'delivered',
      total: 850000,
      items: 3,
      image: 'https://via.placeholder.com/60x60'
    },
    {
      id: 'DH002',
      date: '2024-07-18',
      status: 'shipping',
      total: 650000,
      items: 2,
      image: 'https://via.placeholder.com/60x60'
    },
    {
      id: 'DH003',
      date: '2024-07-20',
      status: 'pending',
      total: 1200000,
      items: 1,
      image: 'https://via.placeholder.com/60x60'
    }
  ]);

  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
    { id: 'addresses', label: 'Sổ địa chỉ', icon: MapPin },
    { id: 'wishlist', label: 'Danh sách yêu thích', icon: Heart },
    { id: 'settings', label: 'Cài đặt tài khoản', icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipping': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Đã giao';
      case 'shipping': return 'Đang giao';
      case 'pending': return 'Chờ xử lý';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipping': return Truck;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Edit className="w-4 h-4" />
          Chỉnh sửa
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">{userInfo.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">{userInfo.email}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">{userInfo.phone}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
          <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">{userInfo.birthDate}</div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
            {userInfo.gender === 'male' ? 'Nam' : 'Nữ'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Đơn hàng của tôi</h2>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <div key={order.id} className="rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={order.image} 
                    alt="Sản phẩm" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Đơn hàng #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  <StatusIcon className="w-4 h-4" />
                  {getStatusText(order.status)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {order.items} sản phẩm • {formatPrice(order.total)}
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sổ địa chỉ</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Thêm địa chỉ mới
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{address.name}</h3>
                {address.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Mặc định
                  </span>
                )}
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p>{address.fullName}</p>
              <p>{address.phone}</p>
              <p>{address.address}</p>
            </div>
            
            {!address.isDefault && (
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                Đặt làm mặc định
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Danh sách yêu thích</h2>
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Bạn chưa có sản phẩm yêu thích nào</p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Khám phá sản phẩm
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Cài đặt tài khoản</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between py-3">
          <div>
            <h3 className="font-medium text-gray-900">Thông báo email</h3>
            <p className="text-sm text-gray-600">Nhận thông báo về đơn hàng và khuyến mãi</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div>
            <h3 className="font-medium text-gray-900">Thông báo SMS</h3>
            <p className="text-sm text-gray-600">Nhận tin nhắn về trạng thái đơn hàng</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="py-3">
          <button className="w-full md:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'orders': return renderOrders();
      case 'addresses': return renderAddresses();
      case 'wishlist': return renderWishlist();
      case 'settings': return renderSettings();
      default: return renderProfile();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tài khoản của tôi</h1>
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{userInfo.name}</p>
                  <p className="text-sm text-gray-600">{userInfo.email}</p>
                </div>
              </div>
              
              <nav className="pt-6">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeTab === item.id 
                              ? 'bg-blue-50 text-blue-600 font-semibold' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;