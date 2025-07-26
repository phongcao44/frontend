import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, MapPin, Settings, Heart, LogOut, Edit, Trash2, Gift, Tag, Calendar, Percent, DollarSign, Phone, Mail, CheckCircle } from 'lucide-react';
import { fetchUserView } from '../../../redux/slices/userSlice';
import { removeAddress } from '../../../redux/slices/addressSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux/slices/authSlice';
import OrderSection from './OrderSection';
import EditProfileForm from './EditProfileForm';
import AddressForm from './AddressForm';
import WishList from '../WishList';
import { fetchUserVouchers, fetchCollectibleVouchers, userCollectVoucher } from '../../../redux/slices/voucherSlice';
import Swal from 'sweetalert2';

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState(null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, loading } = useSelector((state) => state.users);
  const { userVouchers, collectibleVouchers } = useSelector((state) => state.voucher || {});
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        await dispatch(fetchUserView()).unwrap();
        if (activeTab === 'myVouchers') {
          await dispatch(fetchUserVouchers()).unwrap();
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
      }
    };
    fetchData();
  }, [dispatch, activeTab]);

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

  const handleAddressFormClose = () => {
    setIsAddressFormOpen(false);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(removeAddress(addressId)).unwrap();
        await dispatch(fetchUserView());
        
        // Hiển thị thông báo thành công
        Swal.fire({
          title: 'Thành công!',
          text: 'Địa chỉ đã được xóa thành công',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } catch (err) {
        console.error('Error deleting address:', err);
        Swal.fire({
          title: 'Lỗi!',
          text: err.message || 'Có lỗi xảy ra khi xóa địa chỉ',
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    }
  };

  const handleCollectVoucher = async (voucher) => {
    // Thử các cách khác nhau để lấy userId
    const userId = userDetail?.id || userDetail?.userId || userDetail?.user?.id;
    
    const payload = {
      userId: userId,
      voucherCode: voucher.code
    };
    console.log('Payload gửi lên BE:', payload);
    console.log('userDetail:', userDetail);
    console.log('userId được lấy:', userId);
    
    // Kiểm tra userId trước khi gửi
    if (!userId) {
      setError('Không thể xác định ID người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    
    try {
      await dispatch(userCollectVoucher(payload)).unwrap();
      console.log('Thu thập voucher thành công!');
      
      // Hiển thị thông báo thành công
      Swal.fire({
        title: 'Thành công!',
        text: 'Bạn đã thu thập voucher thành công',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      // Refresh both lists after collecting
      await dispatch(fetchUserVouchers());
      await dispatch(fetchCollectibleVouchers());
      setIsCollectModalOpen(false); // Close modal after collecting
    } catch (err) {
      console.error('Lỗi thu thập voucher:', err);
      setError(err?.message || 'Có lỗi xảy ra khi thu thập voucher');
    }
  };

  const handleOpenCollectModal = async () => {
    try {
      await dispatch(fetchCollectibleVouchers()).unwrap();
      setIsCollectModalOpen(true);
    } catch (error) {
      setError('Có lỗi xảy ra khi tải danh sách voucher có thể thu thập');
    }
  };

  // Helper to render discount info safely
  const renderDiscount = (voucher) => {
    if (voucher.discountPercent != null) {
      return `Giảm ${voucher.discountPercent}%`;
    }
    if (voucher.discountAmount != null) {
      return `Giảm ${voucher.discountAmount.toLocaleString('vi-VN')}₫`;
    }
    return 'Không xác định';
  };

  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
    { id: 'addresses', label: 'Địa chỉ', icon: MapPin },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: Heart },
    { id: 'myVouchers', label: 'Voucher của tôi', icon: Settings },
  ];

  const renderProfile = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-600">
                  Thông tin cá nhân
                </h1>
                <p className="text-gray-600 mt-1">Quản lý thông tin tài khoản của bạn</p>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa thông tin
              </button>
            </div>
          </div>

          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
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
            </div>

            {/* Account Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
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
            </div>
          </div>

          {/* Account Timeline Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 mb-8">
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
          </div>

          {/* Points Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
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
                    {userDetail?.address?.[0]?.user?.userPoint?.totalPoints?.toLocaleString('vi-VN') || 0}
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
                    {userDetail?.address?.[0]?.user?.userPoint?.rankPoints?.toLocaleString('vi-VN') || 0}
                  </span>
                  <span className="text-gray-600 ml-2">điểm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddresses = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Địa chỉ của tôi
              </h1>
              <p className="text-gray-600 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
            </div>
          </div>

          {/* Add Address Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleAddAddress}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Thêm địa chỉ mới
            </button>
          </div>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userDetail?.address && userDetail.address.length > 0 ? (
            userDetail.address.map((addr) => (
              <div key={addr.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{addr.recipientName}</h3>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {addr.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105 transform flex items-center gap-1 text-sm font-medium"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-105 transform flex items-center gap-1 text-sm font-medium"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 font-medium">{addr.fullAddress}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{addr.ward}, {addr.district}, {addr.province}</span>
                  </div>
                </div>

                {/* Default Address Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Địa chỉ giao hàng
                    </span>
                    <div className="text-xs text-gray-500">
                      ID: #{addr.id}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bạn chưa có địa chỉ nào</h3>
                <p className="text-gray-500 mb-6">Hãy thêm địa chỉ để thuận tiện cho việc giao hàng!</p>
                <button
                  onClick={handleAddAddress}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  <MapPin className="w-4 h-4" />
                  Thêm địa chỉ đầu tiên
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMyVouchers = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Voucher của tôi</h2>
            <p className="text-sm text-gray-500">Quản lý voucher và mã giảm giá</p>
          </div>
        </div>
        <button
          onClick={handleOpenCollectModal}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Gift className="w-4 h-4" />
          Thu thập voucher
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userVouchers && userVouchers.length > 0 ? (
          userVouchers.map((voucher) => (
            <div key={voucher.id} className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-blue-700">{voucher.code}</h3>
                    <p className="text-sm text-gray-600">{voucher.description || voucher.name}</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Đã có
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>HSD: {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : (voucher.endDate ? new Date(voucher.endDate).toLocaleDateString('vi-VN') : 'Không xác định')}</span>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2">
                    {voucher.discountPercent > 0 ? (
                      <>
                        <Percent className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-lg text-green-600">Giảm Giá: {voucher.discountPercent}%</span>
                      </>
                    ) : voucher.discountAmount > 0 ? (
                      <>
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-lg text-green-600">Giảm Giá: {voucher.discountAmount.toLocaleString('vi-VN')}₫</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Không xác định</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bạn chưa có voucher nào</h3>
            <p className="text-gray-500 mb-4">Hãy thu thập voucher để nhận ưu đãi hấp dẫn!</p>
            <button
              onClick={handleOpenCollectModal}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Thu thập voucher ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCollectModal = () => (
    isCollectModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Thu thập voucher</h2>
                <p className="text-sm text-gray-500">Chọn voucher bạn muốn thu thập</p>
              </div>
            </div>
            <button
              onClick={() => setIsCollectModalOpen(false)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collectibleVouchers && collectibleVouchers.length > 0 ? (
              collectibleVouchers.map((voucher) => (
                <div key={voucher.id} className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Tag className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-green-700">{voucher.code}</h3>
                        <p className="text-sm text-gray-600">{voucher.description || voucher.name}</p>
                      </div>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      Có thể thu thập
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>HSD: {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : (voucher.endDate ? new Date(voucher.endDate).toLocaleDateString('vi-VN') : 'Không xác định')}</span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <div className="flex items-center gap-2">
                        {voucher.discountPercent > 0 ? (
                          <>
                            <Percent className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-lg text-green-600">Giảm {voucher.discountPercent}%</span>
                          </>
                        ) : voucher.discountAmount > 0 ? (
                          <>
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-lg text-green-600">Giảm {voucher.discountAmount.toLocaleString('vi-VN')}₫</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Không xác định</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-105"
                    onClick={() => handleCollectVoucher(voucher)}
                  >
                    <Gift className="w-4 h-4" />
                    Thu thập ngay
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có voucher nào để thu thập</h3>
                <p className="text-gray-500">Hãy quay lại sau để xem voucher mới!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
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
      case 'myVouchers':
        return renderMyVouchers();
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
          onClose={handleAddressFormClose}
        />
      )}

      {renderCollectModal()}
    </div>
  );
}