import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordUser } from "../../redux/slices/authSlice";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams]);

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
  };

  const validateForm = () => {
    const errors = {
      password: "",
      confirmPassword: "",
    };

    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Vui lòng nhập mật khẩu mới";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (formData.password.length > 20) {
      errors.password = "Mật khẩu không được quá 20 ký tự";
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      errors.password = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setValidationErrors(errors);
    const isValid = !Object.values(errors).some((error) => error !== "");
    
    if (!isValid) {
      console.log("Validation errors:", errors);
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Debug: Log request data
      console.log("Reset password request:", {
        token: token,
        request: {
          newPassword: formData.password,
        },
      });

      await dispatch(resetPasswordUser({
        token: token,
        request: {
          newPassword: formData.password,
        },
      })).unwrap();

      // Hiển thị thông báo thành công
      alert("Bạn đã đặt lại mật khẩu thành công!");
      
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Đặt lại mật khẩu lỗi:", err);
      
      // Xử lý lỗi từ backend response
      let errorMessage = "Lỗi đặt lại mật khẩu không xác định";
      
      if (err?.data) {
        // Nếu err.data là string
        if (typeof err.data === 'string') {
          errorMessage = err.data.toLowerCase();
        }
        // Nếu err.data là object (thường là response từ backend)
        else if (typeof err.data === 'object') {
          errorMessage = err.data.message || err.data.error || JSON.stringify(err.data);
        }
      } else if (err?.message) {
        errorMessage = err.message.toLowerCase();
      }
      
      // Kiểm tra các loại lỗi cụ thể
      const errorText = errorMessage.toLowerCase();
      let displayError = "";
      
      if (errorText.includes("token") || errorText.includes("expired") || errorText.includes("invalid")) {
        displayError = "Token không hợp lệ hoặc đã hết hạn";
      } else if (errorText.includes("password") || errorText.includes("mật khẩu")) {
        displayError = "Mật khẩu không hợp lệ";
      } else if (errorText.includes("400") || errorText.includes("bad request")) {
        displayError = "Yêu cầu không hợp lệ";
      } else {
        displayError = "Có lỗi xảy ra khi đặt lại mật khẩu";
      }
      
      setValidationErrors((prev) => ({
        ...prev,
        password: displayError,
        confirmPassword: displayError,
      }));
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Link không hợp lệ</h2>
          <p className="text-gray-600 mb-6">Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Yêu cầu link mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
        <img
          src="/assets/images/signUp.png"
          alt="Reset password illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
          <p className="text-gray-600 mb-8">Nhập mật khẩu mới của bạn</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu mới"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 pr-10 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.password ? "border-red-500" : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8-3.582-8-8s3.582-8 8-8c1.947 0 3.74.696 5.125 1.853M15 12a3 3 0 11-6 0 3 3 0 016 0zm4.586 7.414L4.586 4.414"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.146-2.146C19.593 7.853 16.96 5 12 5c-4.96 0-7.593 2.853-9.146 4.854a2 2 0 000 2.292C4.407 14.147 7.04 17 12 17c4.96 0 7.593-2.853 9.146-4.854a2 2 0 000-2.292z"
                    />
                  </svg>
                )}
              </button>
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 pr-10 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8-3.582-8-8s3.582-8 8-8c1.947 0 3.74.696 5.125 1.853M15 12a3 3 0 11-6 0 3 3 0 016 0zm4.586 7.414L4.586 4.414"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.146-2.146C19.593 7.853 16.96 5 12 5c-4.96 0-7.593 2.853-9.146 4.854a2 2 0 000 2.292C4.407 14.147 7.04 17 12 17c4.96 0 7.593-2.853 9.146-4.854a2 2 0 000-2.292z"
                    />
                  </svg>
                )}
              </button>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Nhớ mật khẩu? </span>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-900 hover:text-gray-700 font-medium underline"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 