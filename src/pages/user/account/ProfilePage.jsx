import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Calendar, CheckCircle, Gift, Edit, Mail } from 'lucide-react';
import { fetchUserView, clearError } from '../../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux/slices/authSlice';
import SandyLoadingAnimation from '../../../components/SandyLoadingAnimation';

// Component for displaying user profile details
export default function ProfilePage() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, loading, error: reduxError } = useSelector((state) => state.users);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        dispatch(clearError());
        await dispatch(fetchUserView()).unwrap();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
      }
    };
    fetchData();
  }, [dispatch]);

  // Sync local error state with Redux error
  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  // Safely resolve user points from different possible API shapes
  const totalPoints =
    userDetail?.address?.[0]?.user?.userPoint?.totalPoints ??
    userDetail?.addresses?.[0]?.user?.userPoint?.totalPoints ??
    userDetail?.userPoint?.totalPoints ??
    userDetail?.user?.userPoint?.totalPoints ??
    0;

  const rankPoints =
    userDetail?.address?.[0]?.user?.userPoint?.rankPoints ??
    userDetail?.addresses?.[0]?.user?.userPoint?.rankPoints ??
    userDetail?.userPoint?.rankPoints ??
    userDetail?.user?.userPoint?.rankPoints ??
    0;

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SandyLoadingAnimation />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
        <button
          onClick={() => {
            dispatch(clearError());
            window.location.reload();
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Thông tin cá nhân
              </h1>
              <p className="text-gray-600 mt-1">Quản lý thông tin tài khoản của bạn</p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/user/edit-profile')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa thông tin
            </button>
          </div>
        </header>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basic Information Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Họ và tên
                </label>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-gray-900 font-medium">{userDetail?.userName || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email
                </label>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-gray-900 font-medium">{userDetail?.userEmail || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Account Status Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trạng thái tài khoản</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Trạng thái
                </label>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${userDetail?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-gray-900 font-medium">
                      {userDetail?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-blue-500" />
                  Hạng thành viên
                </label>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-gray-900 font-medium">{userDetail?.rank || 'Chưa có hạng'}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Account Timeline Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Lịch sử tài khoản</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Ngày tạo tài khoản
              </label>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-gray-900 font-medium">
                  {userDetail?.createTime ? new Date(userDetail.createTime).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Cập nhật lần cuối
              </label>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-gray-900 font-medium">
                  {userDetail?.updateTime ? new Date(userDetail.updateTime).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Points Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Điểm tích lũy</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4 text-blue-500" />
                Tổng điểm
              </label>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-2xl font-bold text-gray-900">
                  {totalPoints.toLocaleString('vi-VN')}
                </span>
                <span className="text-gray-600 ml-2">điểm</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4 text-blue-500" />
                Điểm hạng
              </label>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-2xl font-bold text-gray-900">
                  {rankPoints.toLocaleString('vi-VN')}
                </span>
                <span className="text-gray-600 ml-2">điểm</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}