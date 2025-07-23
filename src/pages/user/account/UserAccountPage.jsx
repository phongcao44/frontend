import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, MapPin, Settings, Heart, LogOut, Edit, Trash2 } from 'lucide-react';
import { fetchUserView } from '../../../redux/slices/userSlice';
import { removeAddress } from '../../../redux/slices/addressSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux/slices/authSlice';
import OrderSection from './OrderSection';
import EditProfileForm from './EditProfileForm';
import AddressForm from './AddressForm';
import WishList from '../WishList';

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, loading } = useSelector((state) => state.users);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        await dispatch(fetchUserView()).unwrap();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
      }
    };
    fetchData();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Có lỗi xảy ra khi đăng xuất');
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsAddressFormOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsAddressFormOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      await dispatch(removeAddress(addressId)).unwrap();
      await dispatch(fetchUserView());
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Có lỗi xảy ra khi xóa địa chỉ');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
    { id: 'addresses', label: 'Địa chỉ', icon: MapPin },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: Heart },
  ];

  const renderProfile = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
              {userDetail?.userName}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
              {userDetail?.userEmail}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái tài khoản</label>
            <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
              {userDetail?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hạng thành viên</label>
            <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
              {userDetail?.rank || 'Chưa có hạng'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày tạo tài khoản</label>
            <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
              {new Date(userDetail?.createTime).toLocaleDateString('vi-VN')}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cập nhật lần cuối</label>
            <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
              {new Date(userDetail?.updateTime).toLocaleDateString('vi-VN')}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Điểm tích lũy</label>
            <div className="p-3 bg-white rounded-lg text-gray-900 border border-gray-100">
              <div className="flex justify-between items-center">
                <span>Tổng điểm: {userDetail?.address?.[0]?.user?.userPoint?.totalPoints?.toLocaleString('vi-VN') || 0} điểm</span>
                <span>Điểm hạng: {userDetail?.address?.[0]?.user?.userPoint?.rankPoints?.toLocaleString('vi-VN') || 0} điểm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddresses = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Thông tin địa chỉ</h2>
        <button
          onClick={handleAddAddress}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="space-y-4">
        {userDetail?.address?.map((addr) => (
          <div key={addr.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{addr.recipientName}</h3>
                <p className="text-gray-600">{addr.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditAddress(addr)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-gray-600">
              <p>{addr.fullAddress}</p>
              <p>{addr.ward}, {addr.district}, {addr.province}</p>
            </div>
          </div>
        ))}
        {(!userDetail?.address || userDetail.address.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return isEditing ? (
          <EditProfileForm onClose={() => setIsEditing(false)} />
        ) : (
          renderProfile()
        );
      case 'orders':
        return <OrderSection />;
      case 'addresses':
        return renderAddresses();
      case 'wishlist':
        return <WishList />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tài khoản của tôi</h1>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {userDetail?.userName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userDetail?.userEmail}
                  </p>
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

          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      {isAddressFormOpen && (
        <AddressForm
          address={selectedAddress}
          onClose={() => {
            setIsAddressFormOpen(false);
            setSelectedAddress(null);
          }}
        />
      )}
    </div>
  );
}