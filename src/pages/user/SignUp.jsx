import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../redux/slices/authSlice";
import Cookies from "js-cookie";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    const errors = {
      email: formData.email.trim() ? "" : "Vui lòng nhập email",
      username: formData.username.trim() ? "" : "Vui lòng nhập tên người dùng",
      password: formData.password.trim() ? "" : "Vui lòng nhập mật khẩu",
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleRegister = async (data) => {
    try {
      dispatch(registerUser(data)).unwrap();

      const loginPayload = {
        email: data.email,
        password: data.password,
      };
      const res = await dispatch(loginUser(loginPayload)).unwrap();

      const userInfo = {
        id: res.data.user.id,
        username: res.data.user.username,
        email: res.data.user.email,
        status: res.data.user.status,
        createdAt: res.data.user.createdAt,
        updatedAt: res.data.user.updatedAt,
        userPoint: res.data.user.userPoint,
        roles: res.data.roles,
      };

      Cookies.set("access_token", res.data.accessToken, {
        sameSite: "Strict",
        secure: true,
        path: "/",
      });

      Cookies.set("user", JSON.stringify(userInfo), {
        sameSite: "Strict",
        secure: true,
        path: "/",
      });

      if (res?.data?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

      navigate("/");
    } catch (error) {
      console.error("Register or auto login failed:", error);
      setError(
        error.data ||
          "Đăng ký hoặc đăng nhập tự động thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleRegister(formData);
    } else {
      console.log("Form validation failed:", validationErrors);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
    setError(null);
    setValidationErrors({ email: "", username: "", password: "" });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Image */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
        <img
          src="/public/assets/images/signUp.png"
          alt="Sign up illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-gray-600 mb-4">Vui lòng nhập đầy đủ thông tin</p>

          {/* Server Error Notification */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Tên người dùng"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.username
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              {validationErrors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.username}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
            >
              Tạo tài khoản
            </button>

            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng ký với Google
            </button>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link
              to="/login"
              className="text-gray-900 hover:text-gray-700 font-medium underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
