import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
      email: "",
      password: "",
    };

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không đúng định dạng";
    }

    // Password validation
    // if (!formData.password.trim()) {
    //   errors.password = "Vui lòng nhập mật khẩu";
    // } else if (formData.password.length < 6 || formData.password.length > 20) {
    //   errors.password = "Mật khẩu phải có độ dài từ 6 đến 20 ký tự";
    // } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
    //   errors.password =
    //     "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
    // }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await dispatch(loginUser(formData)).unwrap();

      if (res?.data?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else if (res?.data?.roles?.includes("ROLE_MODERATOR")) {
          navigate("/shipper/dashboard");
        } else {
          navigate("/");
        }
    } catch (err) {
      console.error("Đăng nhập lỗi:", err);
      console.log(err);
      const errorMessage =
        err?.data?.toLowerCase() ||
        err?.message?.toLowerCase() ||
        "Lỗi đăng nhập không xác định";
      console.log("Error message:", errorMessage);
      setValidationErrors((prev) => ({
        ...prev,
        email: errorMessage.includes("username or password is incorrect")
          ? "Tài khoản không tồn tại hoặc sai mật khẩu"
          : "",
        password: errorMessage.includes("username or password is incorrect")
          ? "Tài khoản không tồn tại hoặc sai mật khẩu"
          : "",
      }));
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
        <img
          src="/public/assets/images/signUp.png"
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
          <p className="text-gray-600 mb-8">Nhập thông tin của bạn</p>

          <div className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${validationErrors.email ? "border-red-500" : "border-gray-300"
                  } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 pr-10 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${validationErrors.password
                  ? "border-red-500"
                  : "border-gray-300"
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <button
                onClick={handleForgotPassword}
                className="w-full sm:w-auto text-red-500 hover:underline font-medium py-4 px-6 transition-colors duration-200"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link
              to="/signup"
              className="text-gray-900 hover:text-gray-700 font-medium underline"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
