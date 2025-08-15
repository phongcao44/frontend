import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserView, updateUserDetailThunk } from "../../../redux/slices/userSlice";
import { changePasswordUser } from "../../../redux/slices/authSlice";
import { User, Mail, Lock, Eye, EyeOff, Save, X, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function EditProfileForm({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, loading } = useSelector((state) => state.users);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (userDetail) {
      setFormData({
        name: userDetail.userName || "",
        email: userDetail.userEmail || "",
      });
    }
  }, [userDetail]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
    setSuccess("");
  };

  const validateProfileForm = () => {
    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên người dùng");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }
    if (!passwordData.newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    try {
      if (!validateProfileForm()) return;

      const updateData = {
        userName: formData.name,
        email: formData.email
      };

      console.log("s ", updateData)
      await dispatch(updateUserDetailThunk(updateData)).unwrap();
      
      // Hiển thị thông báo thành công
      Swal.fire({
        title: 'Thành công!',
        text: 'Thông tin cá nhân đã được cập nhật thành công',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      await dispatch(fetchUserView());
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          navigate('/user/profile');
        }
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi cập nhật thông tin";
      setError(errorMessage);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!validatePasswordForm()) return;

      const passwordChangeData = {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      await dispatch(changePasswordUser(passwordChangeData)).unwrap();
      
      // Hiển thị thông báo thành công
      Swal.fire({
        title: 'Thành công!',
        text: 'Mật khẩu đã được thay đổi thành công',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          navigate('/user/profile');
        }
      }, 1500);
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi đổi mật khẩu";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                navigate('/user/profile');
              }
            }}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              {isEditingPassword ? (
                <Shield className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditingPassword ? "Đổi mật khẩu" : "Chỉnh sửa thông tin cá nhân"}
              </h2>
              <p className="text-gray-600 mt-1">
                {isEditingPassword 
                  ? "Cập nhật mật khẩu để bảo vệ tài khoản của bạn" 
                  : "Cập nhật thông tin cá nhân của bạn"
                }
              </p>
            </div>
          </div>

          {/* Tab Switch */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => {
                setIsEditingPassword(false);
                setError("");
                setSuccess("");
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                !isEditingPassword 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              Thông tin cá nhân x
            </button>
            <button
              onClick={() => {
                setIsEditingPassword(true);
                setError("");
                setSuccess("");
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isEditingPassword 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Lock className="w-4 h-4" />
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-red-600" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {!isEditingPassword ? (
            // Profile Edit Form
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Nhập địa chỉ email của bạn"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    } else {
                      navigate('/user/profile');
                    }
                  }}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Password Change Form
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordData.newPassword.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    Mật khẩu phải có ít nhất 6 ký tự
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordData.confirmPassword.length > 0 && passwordData.newPassword !== passwordData.confirmPassword && (
                  <div className="mt-2 text-sm text-red-500">
                    Mật khẩu xác nhận không khớp
                  </div>
                )}
                {passwordData.confirmPassword.length > 0 && passwordData.newPassword === passwordData.confirmPassword && (
                  <div className="mt-2 text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Mật khẩu xác nhận khớp
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    } else {
                      navigate('/user/profile');
                    }
                  }}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Đổi mật khẩu
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
