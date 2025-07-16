import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const userString = Cookies.get("user");
      const user = userString ? JSON.parse(userString) : null;
      console.log(user);
      const res = await dispatch(loginUser(formData)).unwrap();
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
    } catch (err) {
      console.error("Đăng nhập lỗi:", err);
      console.error("Đăng nhập lỗi:", JSON.stringify(err, null, 2));
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Log in to Exclusive
          </h1>
          <p className="text-gray-600 mb-8">Enter your details below</p>

          <div className="space-y-6">
            <div>
              <input
                type="text"
                name="email"
                placeholder="Email or Phone Number"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none bg-transparent"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none bg-transparent"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <button
                onClick={handleForgotPassword}
                className="w-full sm:w-auto text-red-500 hover:underline font-medium py-4 px-6 transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
