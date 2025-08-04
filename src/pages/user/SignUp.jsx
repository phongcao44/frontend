import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../redux/slices/authSlice";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };

    // Username (Full Name) validation
    if (!formData.username.trim()) {
      errors.username = t("signup.errors.usernameRequired");
    } else if (!/^[\p{L}\s]+$/u.test(formData.username)) {
      errors.username = t("signup.errors.usernameInvalid");
    } else if (formData.username.length < 2 || formData.username.length > 50) {
      errors.username = t("signup.errors.usernameLength");
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = t("signup.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("signup.errors.emailInvalid");
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = t("signup.errors.passwordRequired");
    } else if (formData.password.length < 6 || formData.password.length > 20) {
      errors.password = t("signup.errors.passwordLength");
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      errors.password = t("signup.errors.passwordFormat");
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = t("signup.errors.confirmPasswordRequired");
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = t("signup.errors.confirmPasswordMismatch");
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleRegister = async (data) => {
    try {
      const registerPayload = {
        email: data.email,
        username: data.username,
        password: data.password,
      };
      console.log("Registering user:", registerPayload);
      await dispatch(registerUser(registerPayload)).unwrap();

      const loginPayload = {
        email: data.email,
        password: data.password,
      };
      const res = await dispatch(loginUser(loginPayload)).unwrap();

      const userInfo = {
        id: res.data?.user?.id || "",
        username: res.data?.user?.username || "",
        email: res.data?.user?.email || "",
        status: res.data?.user?.status || "",
        createdAt: res.data?.user?.createdAt || "",
        updatedAt: res.data?.user?.updatedAt || "",
        userPoint: res.data?.user?.userPoint || 0,
        roles: res.data?.roles || [],
      };

      Cookies.set("access_token", res.data?.accessToken || "", {
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
    } catch (error) {
      console.error("Register or auto login failed:", error);
      setError(error?.data?.message || t("signup.errors.serverError"));
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Image */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 md:p-12">
        <img
          src="assets/images/signUp.png"
          alt={t("signup.title")}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 md:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("signup.title")}</h1>
          <p className="text-gray-600 mb-4">{t("signup.subtitle")}</p>

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
                placeholder={t("signup.usernamePlaceholder")}
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.username ? "border-red-500" : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              {validationErrors.username && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder={t("signup.emailPlaceholder")}
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 border-0 border-b-2 ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                } focus:border-red-500 focus:outline-none bg-transparent`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("signup.passwordPlaceholder")}
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
                aria-label={showPassword ? t("signup.hidePassword") : t("signup.showPassword")}
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
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={t("signup.confirmPasswordPlaceholder")}
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
                aria-label={showConfirmPassword ? t("signup.hidePassword") : t("signup.showPassword")}
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
                <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
            >
              {t("signup.signUpButton")}
            </button>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-600">{t("signup.haveAccount")} </span>
            <Link
              to="/login"
              className="text-gray-900 hover:text-gray-700 font-medium underline"
            >
              {t("signup.loginLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;