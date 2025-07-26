import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Vui lòng nhập email";
    }
    if (!emailRegex.test(email)) {
      return "Email không đúng định dạng";
    }
    // Kiểm tra phải là Gmail
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return "Chỉ chấp nhận email Gmail (@gmail.com)";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Gọi API forgot password
      await forgotPassword({ email });
      
      // Tạo token demo và chuyển đến trang ResetPassword
      const demoToken = "demo-token-" + Date.now();
      navigate(`/reset-password/${demoToken}`);
      
    } catch (err) {
      console.error("Forgot password error:", err);
      
      // Nếu API lỗi, vẫn chuyển đến trang ResetPassword với token demo
      const demoToken = "demo-token-" + Date.now();
      navigate(`/reset-password/${demoToken}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
        <img
          src="/public/assets/images/signUp.png"
          alt="Forgot password illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right */}
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
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h1>
            <p className="text-gray-600">
              Nhập email Gmail của bạn để đặt lại mật khẩu
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
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Nhập email Gmail (ví dụ: example@gmail.com)"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Chỉ chấp nhận địa chỉ email Gmail (@gmail.com)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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

export default ForgotPassword; 