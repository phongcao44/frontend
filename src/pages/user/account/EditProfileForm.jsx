import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserView, updateUserDetailThunk } from "../../../redux/slices/userSlice";
import { changePasswordUser } from "../../../redux/slices/authSlice";
import { User, Mail, Lock, Eye, EyeOff, Save, X, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

export default function EditProfileForm({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, loading } = useSelector((state) => state.users);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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
    setValidationErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateProfileForm = () => {
    if (!formData.name.trim()) {
      setError(t("editProfile.errors.nameRequired"));
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Current Password validation
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = t("editProfile.errors.currentPasswordRequired");
    }

    // New Password validation
    if (!passwordData.newPassword.trim()) {
      errors.newPassword = t("editProfile.errors.newPasswordRequired");
    } else if (passwordData.newPassword.length < 6 || passwordData.newPassword.length > 20) {
      errors.newPassword = t("editProfile.errors.passwordLength");
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = t("editProfile.errors.passwordFormat");
    }

    // Confirm Password validation
    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword = t("editProfile.errors.confirmPasswordRequired");
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = t("editProfile.errors.confirmPasswordMismatch");
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
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
        title: t('editProfile.success.title'),
        text: t('editProfile.success.profileUpdated'),
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
      const errorMessage = err.response?.data?.message || err.message || t("editProfile.errors.serverError");
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
        title: t('editProfile.success.title'),
        text: t('editProfile.success.passwordChanged'),
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
      const errorMessage = err.response?.data?.message || err.message || t("editProfile.errors.serverError");
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
                {isEditingPassword ? t("editProfile.passwordTab") : t("editProfile.profileTab")}
              </h2>
              <p className="text-gray-600 mt-1">
                {isEditingPassword 
                  ? t("editProfile.passwordDescription") 
                  : t("editProfile.profileDescription")
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
              {t("editProfile.profileTab")}
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
              {t("editProfile.passwordTab")}
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
                  {t("editProfile.nameLabel")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={t("editProfile.namePlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  {t("editProfile.emailLabel")}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
                  placeholder={t("editProfile.emailPlaceholder")}
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
                  {t("editProfile.cancelButton")}
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
                      {t("editProfile.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {t("editProfile.saveButton")}
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
                  {t("editProfile.currentPasswordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 ${
                      validationErrors.currentPassword ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder={t("editProfile.currentPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  {t("editProfile.newPasswordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 ${
                      validationErrors.newPassword ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder={t("editProfile.newPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {t("editProfile.confirmPasswordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12 ${
                      validationErrors.confirmPassword ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder={t("editProfile.confirmPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.confirmPassword}</p>
                )}
                {passwordData.confirmPassword.length > 0 && passwordData.newPassword === passwordData.confirmPassword && !validationErrors.confirmPassword && (
                  <div className="mt-2 text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {t("editProfile.passwordMatch")}
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
                  {t("editProfile.cancelButton")}
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
                      {t("editProfile.saving")}
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      {t("editProfile.changePasswordButton")}
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