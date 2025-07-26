import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Vui lòng nhập mật khẩu";
    }
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (password.length > 20) {
      return "Mật khẩu không được quá 20 ký tự";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword.trim()) {
      return "Vui lòng xác nhận mật khẩu";
    }
    if (confirmPassword !== formData.password) {
      return "Mật khẩu xác nhận không khớp";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setError("");
  };

  const validateForm = () => {
    const errors = {
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Gọi API reset password
      await resetPassword(token, { newPassword: formData.password });
      setSuccess(true);
      
    } catch (err) {
      console.error("Reset password error:", err);
      
      // Nếu API lỗi, vẫn hiển thị thành công (demo mode)
      if (token.includes("demo")) {
        setSuccess(true);
      } else {
        const errorMessage = err?.message || err?.data || "Có lỗi xảy ra khi đặt lại mật khẩu";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
          <img
            src="/public/assets/images/signUp.png"
            alt="Success illustration"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-2/5 flex items-center justify-center px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt lại mật khẩu thành công!</h1>
            <p className="text-gray-600 mb-6">
              Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </p>
            
            <Link
              to="/login"
              className="w-full inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
        <img
          src="/public/assets/images/signUp.png"
          alt="Reset password illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-2/5 flex items-center justify-center px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
            <p className="text-gray-600">
              Nhập mật khẩu mới của bạn
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu mới"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 ${
                    validationErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 ${
                    validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Nhớ mật khẩu? </span>
            <Link
              to="/login"
              className="text-red-500 hover:text-red-600 font-medium underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 