import axiosInstance from "../utils/axiosInstance";
import Cookies from "js-cookie";

//  Login
export const login = async (formLogin) => {
  try {
    const response = await axiosInstance.post("/auth/login", formLogin);
    return response.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};

//  Register
export const register = async (formRegister) => {
  try {
    const response = await axiosInstance.post("/auth/register", formRegister);
    return response.data;
  } catch (err) {
    console.error("Register failed:", err);
    throw err;
  }
};

//  Logout
export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    Cookies.remove("access_token");
    Cookies.remove("user");
    return response.data;
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
};

//  Forgot Password
export const forgotPassword = async (request) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", request);
    return response.data;
  } catch (err) {
    console.error("Forgot Password failed:", err);
    throw err;
  }
};

//  Reset Password
export const resetPassword = async (token, request) => {
  try {
    console.log("Sending reset password request:", {
      url: `/auth/reset-password?token=${token}`,
      data: request
    });
    
    const response = await axiosInstance.post(
      `/auth/reset-password?token=${token}`,
      request
    );
    return response.data;
  } catch (err) {
    console.error("Reset Password failed:", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

// Change Password
export const changePassword = async (request) => {
  try {
    const response = await axiosInstance.put("/auth/change-password", request);
    return response.data;
  } catch (err) {
    console.error("Change Password failed:", err);
    throw err;
  }
};

// Google OAuth - Lấy URL redirect để đăng nhập Google
export const getGoogleLoginUrl = async () => {
  try {
    const response = await axiosInstance.get("/auth/google-login");
    return response.data.data.redirectUrl;
  } catch (error) {
    console.error("Lỗi khi lấy Google login URL:", error);
    throw error;
  }
};

// Google OAuth - Xử lý code từ Google callback
export const exchangeGoogleCodeForToken = async (code, redirectUri) => {
  try {
    const response = await axiosInstance.post("/auth/google/code", {
      code: code,
      redirectUri: redirectUri
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi trao đổi code lấy token:", error);
    throw error;
  }
};

// Google OAuth - Redirect đến Google OAuth
export const redirectToGoogle = async () => {
  try {
    const redirectUrl = await getGoogleLoginUrl();
    window.location.href = redirectUrl;
  } catch (error) {
    console.error("Lỗi khi redirect đến Google:", error);
    throw error;
  }
};
