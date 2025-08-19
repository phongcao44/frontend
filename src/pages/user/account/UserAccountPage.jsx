import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, MapPin, Heart, LogOut, Gift, RotateCcw } from 'lucide-react';
import { fetchUserView, clearError } from '../../../redux/slices/userSlice';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { logoutUser } from '../../../redux/slices/authSlice';
import { ProductFilled } from '@ant-design/icons';
import SandyLoadingAnimation from '../../../components/SandyLoadingAnimation';

export default function UserAccountPage() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetail, loading, error: reduxError } = useSelector((state) => state.users);
  const isMounted = useRef(true);
  const fetchRef = useRef(null);
  const fetchCount = useRef(0); // Track number of fetch attempts for debugging

  // Determine active tab based on URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/user/orders')) return 'orders';
    if (path.includes('/user/addresses')) return 'addresses';
    if (path.includes('/user/profile') || path === '/user') return 'profile';
    if (path.includes('/user/wishlist')) return 'wishlist';
    if (path.includes('/user/myVouchers')) return 'myVouchers';
    if (path.includes('/user/deliveredProduct')) return 'deliveredProduct';
    if (path.includes('/user/returns')) return 'returns';
    return 'profile';
  };

  const activeTab = getActiveTab();

  // Fetch user data on component mount
  useEffect(() => {
    console.log('useEffect triggered with pathname:', location.pathname);
    isMounted.current = true;

    const fetchData = async () => {
      if (fetchRef.current) {
        console.log('Skipping fetch: already in progress');
        return;
      }
      fetchCount.current += 1;
      console.log(`Fetch attempt #${fetchCount.current}`);

      try {
        setError(null);
        dispatch(clearError());
        const promise = dispatch(fetchUserView()).unwrap();
        fetchRef.current = promise;
        const result = await promise;
        console.log('fetchUserView result:', result);
      } catch (error) {
        if (isMounted.current) {
          console.error('Failed to fetch user data:', error);
          setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
        }
      } finally {
        fetchRef.current = null;
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
      console.log('useEffect cleanup, isMounted set to false');
    };
  }, [dispatch]); // Removed location.pathname to prevent re-runs on navigation

  // Sync local error state with Redux error
  useEffect(() => {
    if (reduxError && isMounted.current) {
      setError(reduxError);
    }
  }, [reduxError]);

  // Log userDetail changes for debugging
  useEffect(() => {
    console.log('userDetail updated:', userDetail);
  }, [userDetail]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearError());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Có lỗi xảy ra khi đăng xuất');
    }
  };

  // Menu items for sidebar navigation
  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
    { id: 'addresses', label: 'Địa chỉ', icon: MapPin },
    // { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: Heart },
    { id: 'myVouchers', label: 'Voucher của tôi', icon: Gift },
    { id: 'deliveredProduct', label: 'Sản phẩm đã giao', icon: ProductFilled },
    { id: 'returns', label: 'Yêu cầu trả hàng', icon: RotateCcw },
    { id: 'logout', label: 'Đăng xuất', icon: LogOut },
  ];

  // Log loading state for debugging
  console.log('Loading state (fetchUserView):', loading.fetchUserView);

  // // Render loading state
  // if (loading.fetchUserView) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-50">
  //       <SandyLoadingAnimation />
  //     </div>
  //   );
  // }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
        <button
          onClick={() => {
            dispatch(clearError());
            setError(null);
            dispatch(fetchUserView());
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Render main content only if userDetail is available
  // if (!userDetail) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-50">
  //       <div className="text-gray-600 text-lg font-medium">
  //         Không tìm thấy thông tin người dùng
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              {/* User Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {userDetail?.userName || 'Chưa cập nhật'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userDetail?.userEmail || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="pt-6">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() =>
                            item.id === 'logout'
                              ? handleLogout()
                              : navigate(`/user/${item.id === 'profile' ? '' : item.id}`)
                          }
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}