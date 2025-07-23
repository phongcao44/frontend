import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserView, updateUserDetailThunk } from "../../../redux/slices/userSlice";
import { changePasswordUser } from "../../../redux/slices/authSlice";

export default function EditProfileForm({ onClose }) {
  const dispatch = useDispatch();
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
      setSuccess("Cập nhật thông tin thành công!");
      await dispatch(fetchUserView());
      setTimeout(() => {
        onClose();
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
      setSuccess("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi đổi mật khẩu";
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-900">
          {isEditingPassword ? "Đổi mật khẩu" : "Chỉnh sửa thông tin cá nhân"}
        </h2>
        <button
          onClick={() => {
            setIsEditingPassword(!isEditingPassword);
            setError("");
            setSuccess("");
          }}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {isEditingPassword ? "Chỉnh sửa thông tin" : "Đổi mật khẩu"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {!isEditingPassword ? (
        // Profile Edit Form
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      ) : (
        // Password Change Form
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Hủy
            </button>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
