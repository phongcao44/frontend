import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, initiateGoogleLogin } from "../../redux/slices/authSlice";
import { setNotification } from "../../redux/slices/notificationSlice";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
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

    if (!formData.email.trim()) {
      errors.email = t("login.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("login.errors.emailInvalid");
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed:", validationErrors);
      return;
    }

    try {
      console.log("Attempting login with formData:", formData);
      const res = await dispatch(loginUser(formData)).unwrap();
      console.log("Login response:", res);

      // Dispatch success notification
      dispatch(
        setNotification({
          message: t("login.notifications.success", { email: formData.email }),
          type: "success",
        })
      );

      // Redirect immediately
      if (res?.data?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else if (res?.data?.roles?.includes("ROLE_MODERATOR")) {
        navigate("/shipper/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err?.data?.toLowerCase() ||
        err?.message?.toLowerCase() ||
        t("login.errors.unknownError");
      console.log("Error message:", errorMessage);
      setValidationErrors((prev) => ({
        ...prev,
        email: errorMessage.includes("username or password is incorrect")
          ? t("login.errors.authFailed")
          : "",
        password: errorMessage.includes("username or password is incorrect")
          ? t("login.errors.authFailed")
          : "",
      }));

      // Dispatch error notification
      dispatch(
        setNotification({
          message: errorMessage,
          type: "error",
        })
      );
    }
  };

  const handleForgotPassword = () => {
    dispatch(
      setNotification({
        message: t("login.notifications.forgotPassword"),
        type: "info",
      })
    );
    navigate("/forgot-password");
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Google login clicked");
      await dispatch(initiateGoogleLogin()).unwrap();
    } catch (error) {
      console.error("Google login error:", error);
      setValidationErrors((prev) => ({
        ...prev,
        email: t("login.errors.googleError"),
      }));
      dispatch(
        setNotification({
          message: t("login.errors.googleError"),
          type: "error",
        })
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
        <img
          src="/assets/images/signUp.png"
          alt={t("login.title")}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("login.title")}</h1>
          <p className="text-gray-600 mb-8">{t("login.subtitle")}</p>

          <div className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder={t("login.emailPlaceholder")}
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 pr-10 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
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

            <div className="flex flex-col gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? t("login.loginLoading") : t("login.loginButton")}
              </button>
              <button
                onClick={handleGoogleLogin}
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
                {t("login.googleLogin")}
              </button>

              <button
                onClick={handleForgotPassword}
                className="w-full sm:w-auto text-red-500 hover:underline font-medium py-4 px-6 transition-colors duration-200"
              >
                {t("login.forgotPassword")}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-600">{t("login.noAccount")} </span>
            <Link
              to="/signup"
              className="text-gray-900 hover:text-gray-700 font-medium underline"
            >
              {t("login.signUpLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;