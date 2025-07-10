import axiosInstance from "../utils/axiosInstance";

// Login
export const login = async (formLogin) => {
  console.log("service", formLogin);
  const response = await axiosInstance.post("/auth/login", formLogin);

  return response.data;
};

// Register
export const register = async (formRegister) => {
  const response = await axiosInstance.post("/auth/register", formRegister);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

// Forgot Password
export const forgotPassword = async (request) => {
  const response = await axiosInstance.post("/auth/forgot-password", request);
  return response.data;
};

// Reset Password
export const resetPassword = async (token, request) => {
  const response = await axiosInstance.post(
    `/auth/reset-password?token=${token}`,
    request
  );
  return response.data;
};

// Change Password
export const changePassword = async (request) => {
  const response = await axiosInstance.put("/auth/change-password", request);
  return response.data;
};
