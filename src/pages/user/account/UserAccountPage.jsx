import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, MapPin, Settings, Heart, RotateCcw } from 'lucide-react';
import { fetchUserView } from '../../../redux/slices/userSlice';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ProductFilled } from '@ant-design/icons';

export default function UserAccountPage() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetail, loading } = useSelector((state) => state.users);


  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/user/orders')) return 'orders';
    if (path.includes('/user/addresses')) return 'addresses';
    if (path.includes('/user/profile') || path === '/user') return 'profile';
    if (path.includes('/user/edit-profile')) return 'edit-profile';
    if (path.includes('/user/wishlist')) return 'wishlist';
    if (path.includes('/user/myVouchers')) return 'myVouchers';
    if (path.includes('/user/deliveredProduct')) return 'deliveredProduct';
    if (path.includes('/user/returns')) return 'returns';
    return 'profile'; // default
  };

  const activeTab = getActiveTab();

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



  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
    { id: 'addresses', label: 'Địa chỉ', icon: MapPin },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: Heart },
    { id: 'myVouchers', label: 'Voucher của tôi', icon: Settings },
    { id: 'deliveredProduct', label: 'Sản phẩm đã giao', icon: ProductFilled },
    { id: 'returns', label: 'Yêu cầu trả hàng', icon: RotateCcw },
  ];

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-lg">Đang tải thông tin...</div>
  //     </div>
  //   );
  // }

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
                          onClick={() => navigate(`/user/${item.id === 'profile' ? 'profile' : item.id}`)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}